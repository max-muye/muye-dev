import { verifyTurnstileResult } from "./_turnstile.js";

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

function toBase64Url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function passwordMatches(password, stored) {
  const [algorithm, iterationsText, saltText, hashText] = stored.split("$");
  if (algorithm !== "pbkdf2-sha256") return false;
  const salt = fromBase64(saltText);
  const expected = fromBase64(hashText);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: Number(iterationsText), hash: "SHA-256" }, key, 256);
  const actual = new Uint8Array(bits);
  return actual.length === expected.length && actual.every((byte, index) => byte === expected[index]);
}

async function sessionToken(mailbox, secret, expiresAt) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyBytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["encrypt"]);
  const payload = new TextEncoder().encode(JSON.stringify({ mailbox, expiresAt }));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, payload);
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return toBase64Url(combined);
}

export async function onRequestPost({ request, env }) {
  if (!env.muye_mailboxes || !env.EMAIL_VERIFICATION_SECRET) return json({ error: "Mailbox storage is not configured." }, 503);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const mailbox = String(body.mailbox || "").trim().toLowerCase();
  const password = String(body.password || "");
  const captcha = String(body.captcha || "");
  const requestedExpiresAt = Number(body.expiresAt);
  const maxExpiresAt = Date.now() + 86400000;
  const expiresAt = body.openForToday && Number.isFinite(requestedExpiresAt)
    ? Math.min(Math.max(requestedExpiresAt, Date.now() + 60000), maxExpiresAt)
    : maxExpiresAt;
  const maxAge = Math.max(60, Math.ceil((expiresAt - Date.now()) / 1000));
  if (!/^[a-z0-9._-]+@muye\.dev$/.test(mailbox) || !password) return json({ error: "Enter your Muye email and password." }, 400);

  const captchaResult = await verifyTurnstileResult(captcha, request, env.TURNSTILE_SECRET_KEY);
  if (!captchaResult.success) return json({ error: captchaResult.reason ? `CAPTCHA failed: ${captchaResult.reason}` : "Please complete the CAPTCHA and try again." }, 403);

  const record = await env.muye_mailboxes.prepare("SELECT mailbox, password_hash, banned_at FROM mailboxes WHERE mailbox = ? LIMIT 1").bind(mailbox).first();
  if (!record || !(await passwordMatches(password, record.password_hash))) return json({ error: "Email or password is incorrect." }, 401);
  if (record.banned_at) return json({ error: "This mailbox is banned." }, 403);

  const token = await sessionToken(mailbox, env.EMAIL_VERIFICATION_SECRET, expiresAt);
  return json({ ok: true, mailbox, expiresAt }, 200, {
    "set-cookie": `muye_mailbox=${token}; HttpOnly; Secure; SameSite=Lax; Domain=.muye.dev; Path=/; Max-Age=${maxAge}`,
  });
}

export async function onRequestDelete({ env }) {
  return json({ ok: true }, 200, { "set-cookie": "muye_mailbox=; HttpOnly; Secure; SameSite=Lax; Domain=.muye.dev; Path=/; Max-Age=0" });
}
