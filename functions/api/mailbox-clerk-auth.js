import { verifyTurnstileResult } from "./_turnstile.js";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
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
    for (let index = 0; index < Math.max(actual.length, expected.length); index += 1) {
      difference |= (actual[index] || 0) ^ (expected[index] || 0);
    }
    return difference === 0;
  } catch {
    return false;
  }
}

function clerkHeaders(secretKey) {
  return {
    authorization: `Bearer ${secretKey}`,
    accept: "application/json",
    "content-type": "application/json",
  };
}

function userEmail(user) {
  const primary = (user?.email_addresses || []).find((email) => email.id === user.primary_email_address_id)
    || user?.email_addresses?.[0];
  return String(primary?.email_address || "").toLowerCase();
}

async function findClerkUser(mailbox, secretKey) {
  const url = new URL("https://api.clerk.com/v1/users");
  url.searchParams.set("query", mailbox);
  url.searchParams.set("limit", "20");
  const response = await fetch(url, { headers: clerkHeaders(secretKey) });
  if (!response.ok) throw new Error("Could not search Clerk users.");
  const payload = await response.json();
  const users = Array.isArray(payload) ? payload : payload.data || [];
  return users.find((user) => userEmail(user) === mailbox) || null;
}

async function createClerkUser(mailbox, secretKey) {
  const response = await fetch("https://api.clerk.com/v1/users", {
    method: "POST",
    headers: clerkHeaders(secretKey),
    body: JSON.stringify({
      email_address: [mailbox],
      external_id: `muye-mailbox:${mailbox}`,
      skip_password_requirement: true,
      public_metadata: { auth_provider: "muye_mailbox", mailbox },
    }),
  });
  if (response.ok) return response.json();

  // A simultaneous first login may have created the same user already.
  if (response.status === 409 || response.status === 422) {
    const existing = await findClerkUser(mailbox, secretKey);
    if (existing) return existing;
  }
  throw new Error("Could not create Clerk user.");
}

async function createSignInTicket(userId, secretKey) {
  const response = await fetch("https://api.clerk.com/v1/sign_in_tokens", {
    method: "POST",
    headers: clerkHeaders(secretKey),
    body: JSON.stringify({ user_id: userId, expires_in_seconds: 60 }),
  });
  if (!response.ok) throw new Error("Could not create sign-in ticket.");
  const result = await response.json();
  if (!result.token) throw new Error("Clerk returned no sign-in ticket.");
  return result.token;
}

export async function onRequestPost({ request, env }) {
  if (!env.muye_mailboxes || !env.CLERK_SECRET_KEY) {
    return json({ error: "Muye Mailbox sign-in is not configured." }, 503);
  }

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const mailbox = String(body.mailbox || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (mailbox.length > 254 || password.length > 4096 || !/^[a-z0-9._-]+@muye\.dev$/.test(mailbox) || !password) {
    return json({ error: "Enter your Muye email and password." }, 400);
  }

  const captcha = await verifyTurnstileResult(String(body.captcha || ""), request, env.TURNSTILE_SECRET_KEY);
  if (!captcha.success) return json({ error: "Please complete the CAPTCHA and try again." }, 403);

  const record = await env.muye_mailboxes.prepare(
    "SELECT mailbox, password_hash, banned_at FROM mailboxes WHERE mailbox = ? LIMIT 1",
  ).bind(mailbox).first();
  if (!record || !(await passwordMatches(password, record.password_hash))) {
    return json({ error: "Muye email or password is incorrect." }, 401);
  }
  if (record.banned_at) return json({ error: "This mailbox is banned." }, 403);

  try {
    const user = await findClerkUser(mailbox, env.CLERK_SECRET_KEY)
      || await createClerkUser(mailbox, env.CLERK_SECRET_KEY);
    const ticket = await createSignInTicket(user.id, env.CLERK_SECRET_KEY);
    return json({ ok: true, ticket });
  } catch {
    return json({ error: "Muye Mailbox sign-in is temporarily unavailable." }, 502);
  }
}
