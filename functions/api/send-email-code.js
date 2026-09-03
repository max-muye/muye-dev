const CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function base64Url(bytes) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function verificationKey(secret) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encryptChallenge(challenge, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await verificationKey(secret);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(challenge)),
  );
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return base64Url(combined);
}

function makeCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return [...bytes].map((byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.EMAIL_VERIFICATION_SECRET) {
    return json({ error: "Email verification is not configured yet." }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Enter a valid email address." }, 400);
  }

  const code = makeCode();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  const challenge = await encryptChallenge({ email, code, expiresAt }, env.EMAIL_VERIFICATION_SECRET);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [email],
      subject: "Your Muye verification code",
      html: `
        <div style="background:#f4f1e9;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;color:#18211e;">
          <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #d9d4c8;border-radius:12px;padding:36px;">
            <p style="margin:0 0 10px;color:#a56c32;font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;">Muye</p>
            <h1 style="margin:0 0 24px;font-size:28px;line-height:1.2;">Verify your email</h1>
            <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">Enter this code to continue creating your Muye email address:</p>
            <div style="margin:0 0 24px;padding:22px 16px;border:1px solid #e0b778;border-radius:10px;background:#fff8ec;text-align:center;">
              <span style="font-size:42px;line-height:1;font-weight:800;letter-spacing:8px;color:#18211e;">${code}</span>
            </div>
            <p style="margin:0 0 12px;font-size:14px;line-height:1.6;"><strong>This code expires in 10 minutes.</strong></p>
            <p style="margin:0;color:#68736d;font-size:14px;line-height:1.6;">Keep this code secret. If you did not request it, you can safely ignore this email.</p>
          </div>
        </div>
      `,
      text: `Your Muye verification code is ${code}. It expires in 10 minutes. Keep this code secret. If you did not request it, ignore this email.`,
    }),
  });

  if (!response.ok) {
    return json({ error: "We could not send the verification email. Try again." }, 502);
  }

  return json({ ok: true, challenge });
}
