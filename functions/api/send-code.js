function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function normalizePhone(phone) {
  return String(phone || "").replace(/[()\s.-]/g, "");
}

export async function onRequestPost({ request, env }) {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_VERIFY_SERVICE_SID) {
    return json({ error: "SMS verification is not configured yet." }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const phone = normalizePhone(body.phone);
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    return json({ error: "Enter a phone number in international format, such as +15551234567." }, 400);
  }

  const response = await fetch(
    `https://verify.twilio.com/v2/Services/${env.TWILIO_VERIFY_SERVICE_SID}/Verifications`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: phone, Channel: "sms" }),
    },
  );

  if (!response.ok) {
    return json({ error: "We could not send the code. Check the phone number and try again." }, 502);
  }

  return json({ ok: true });
}

