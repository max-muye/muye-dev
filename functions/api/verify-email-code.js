function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function verificationKey(secret) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function decryptChallenge(token, secret) {
  const combined = fromBase64Url(token);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const key = await verificationKey(secret);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return JSON.parse(new TextDecoder().decode(plaintext));
}

function base64Url(bytes) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function encryptProof(proof, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await verificationKey(secret);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(proof)),
  );
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return base64Url(combined);
}

export async function onRequestPost({ request, env }) {
  if (!env.EMAIL_VERIFICATION_SECRET) {
    return json({ error: "Email verification is not configured yet." }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const email = String(body.email || "").trim().toLowerCase();
  const code = String(body.code || "").trim();
  const challenge = String(body.challenge || "");
  if (!email || !/^[A-Za-z0-9]{6}$/.test(code) || !challenge) {
    return json({ error: "Enter the email and 6-character verification code." }, 400);
  }

  let payload;
  try {
    payload = await decryptChallenge(challenge, env.EMAIL_VERIFICATION_SECRET);
  } catch {
    return json({ error: "That code is not valid or has expired." }, 400);
  }

  if (payload.email !== email || payload.code !== code || payload.expiresAt < Date.now()) {
    return json({ error: "That code is not valid or has expired." }, 400);
  }

  const proof = await encryptProof({
    method: "email",
    identity: email,
    expiresAt: Date.now() + 30 * 60 * 1000,
  }, env.EMAIL_VERIFICATION_SECRET);
  return json({ ok: true, proof });
}
