function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function mailboxFromRequest(request, env) {
  const token = request.headers.get("cookie")?.match(/(?:^|; )muye_mailbox=([^;]+)/)?.[1];
  if (!token || !env.EMAIL_VERIFICATION_SECRET) return "";
  try {
    const combined = fromBase64Url(token);
    const keyBytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(env.EMAIL_VERIFICATION_SECRET));
    const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["decrypt"]);
    const payload = await crypto.subtle.decrypt({ name: "AES-GCM", iv: combined.slice(0, 12) }, key, combined.slice(12));
    const session = JSON.parse(new TextDecoder().decode(payload));
    return session.expiresAt >= Date.now() ? String(session.mailbox || "").toLowerCase() : "";
  } catch {
    return "";
  }
}

async function passwordHash(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, key, 256);
  return `pbkdf2-sha256$100000$${btoa(String.fromCharCode(...salt))}$${btoa(String.fromCharCode(...new Uint8Array(bits)))}`;
}

export async function onRequestPost({ request, env }) {
  if (!env.muye_mailboxes || !env.EMAIL_VERIFICATION_SECRET) return json({ error: "Mailbox storage is not configured." }, 503);
  const mailbox = await mailboxFromRequest(request, env);
  if (!mailbox) return json({ error: "Your mailbox session has expired. Sign in again." }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const password = String(body.password || "");
  if (password.length < 8) return json({ error: "Password must be at least 8 characters." }, 400);
  const result = await env.muye_mailboxes.prepare("UPDATE mailboxes SET password_hash = ? WHERE mailbox = ? AND banned_at IS NULL").bind(await passwordHash(password), mailbox).run();
  if (!result.meta?.changes) return json({ error: "Mailbox not found or unavailable." }, 404);
  return json({ ok: true });
}
