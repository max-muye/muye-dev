function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function verificationKey(secret) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["decrypt"]);
}

async function decryptProof(token, secret) {
  const combined = fromBase64Url(token);
  const key = await verificationKey(secret);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: combined.slice(0, 12) }, key, combined.slice(12));
  return JSON.parse(new TextDecoder().decode(plaintext));
}

async function digest(value) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function passwordHash(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, key, 256);
  return `pbkdf2-sha256$100000$${btoa(String.fromCharCode(...salt))}$${btoa(String.fromCharCode(...new Uint8Array(bits)))}`;
}

export async function onRequestPost({ request, env }) {
  if (!env.muye_mailboxes || !env.EMAIL_VERIFICATION_SECRET) return json({ error: "Password recovery is not configured." }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const proof = String(body.proof || "");
  const password = String(body.password || "");
  if (!proof) return json({ error: "Enter a new password and verification code." }, 400);
  if (password.length < 8 || !/\d/.test(password)) return json({ error: "Password must be at least 8 characters and include a number." }, 400);

  let verified;
  try { verified = await decryptProof(proof, env.EMAIL_VERIFICATION_SECRET); } catch { return json({ error: "Your verification has expired. Verify again." }, 400); }
  if (!verified.identity || verified.expiresAt < Date.now()) return json({ error: "Your verification has expired. Verify again." }, 400);
  const identityHash = await digest(`${verified.method}:${verified.identity}:${env.EMAIL_VERIFICATION_SECRET}`);
  const result = await env.muye_mailboxes.prepare("UPDATE mailboxes SET password_hash = ? WHERE identity_hash = ?").bind(await passwordHash(password), identityHash).run();
  if (!result.meta.changes) return json({ error: "That verified contact does not have a Muye mailbox." }, 403);
  return json({ ok: true });
}
