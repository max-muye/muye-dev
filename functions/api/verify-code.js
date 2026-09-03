function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function normalizePhone(phone) {
  return String(phone || "").replace(/[()\s.-]/g, "");
}

function base64Url(bytes) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function verificationKey(secret) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt"]);
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
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_VERIFY_SERVICE_SID || !env.EMAIL_VERIFICATION_SECRET) {
    return json({ error: "SMS verification is not configured yet." }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const phone = normalizePhone(body.phone);
  const code = String(body.code || "").trim();
  if (!/^\+[1-9]\d{7,14}$/.test(phone) || !/^\d{4,10}$/.test(code)) {
    return json({ error: "Enter the phone number and verification code." }, 400);
  }

  const response = await fetch(
    `https://verify.twilio.com/v2/Services/${env.TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: phone, Code: code }),
    },
  );

  const result = await response.json();
  if (!response.ok || result.status !== "approved") {
    return json({ error: "That code is not valid or has expired." }, 400);
  }

  const proof = await encryptProof({
    method: "phone",
    identity: phone,
    expiresAt: Date.now() + 30 * 60 * 1000,
  }, env.EMAIL_VERIFICATION_SECRET);
  return json({ ok: true, proof });
}
