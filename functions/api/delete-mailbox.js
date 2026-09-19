function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
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

async function passwordMatches(password, stored) {
  try {
    const [algorithm, iterationsText, saltText, hashText] = String(stored || "").split("$");
    const iterations = Number(iterationsText);
    if (algorithm !== "pbkdf2-sha256" || !Number.isInteger(iterations) || iterations < 1) return false;
    const salt = fromBase64(saltText);
    const expected = fromBase64(hashText);
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, key, expected.length * 8);
    const actual = new Uint8Array(bits);
    let difference = actual.length ^ expected.length;
    for (let index = 0; index < Math.min(actual.length, expected.length); index += 1) difference |= actual[index] ^ expected[index];
    return difference === 0;
  } catch {
    return false;
  }
}

const clearMailboxCookie = "muye_mailbox=; HttpOnly; Secure; SameSite=Lax; Domain=.muye.dev; Path=/; Max-Age=0";

export async function onRequestDelete({ request, env }) {
  if (!env.muye_mailboxes || !env.EMAIL_VERIFICATION_SECRET) return json({ error: "Mailbox storage is not configured." }, 503);
  const mailbox = await mailboxFromRequest(request, env);
  if (!mailbox) return json({ error: "Your mailbox session has expired. Sign in again." }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const password = String(body.password || "");
  const confirmation = String(body.confirmation || "").trim().toLowerCase();
  if (confirmation !== mailbox) return json({ code: "confirmation_mismatch", error: "Type your full Muye email address to confirm deletion." }, 400);
  if (!password) return json({ error: "Enter your current password." }, 400);

  const record = await env.muye_mailboxes.prepare("SELECT password_hash FROM mailboxes WHERE mailbox = ? LIMIT 1").bind(mailbox).first();
  if (!record) return json({ error: "Mailbox not found." }, 404);
  if (!(await passwordMatches(password, record.password_hash))) return json({ code: "password_incorrect", error: "Current password is incorrect." }, 401);

  await env.muye_mailboxes.batch([
    env.muye_mailboxes.prepare("DELETE FROM messages WHERE mailbox = ?").bind(mailbox),
    env.muye_mailboxes.prepare("DELETE FROM mailbox_send_requests WHERE mailbox = ?").bind(mailbox),
    env.muye_mailboxes.prepare("DELETE FROM mailboxes WHERE mailbox = ?").bind(mailbox),
  ]);
  return json({ ok: true }, 200, { "set-cookie": clearMailboxCookie });
}
