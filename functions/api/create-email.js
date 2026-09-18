import { verifyTurnstile } from "./_turnstile.js";
import { clerkUserFromRequest } from "./_clerk.js";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function verificationKey(secret) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["decrypt"]);
}

async function decryptToken(token, secret) {
  const combined = fromBase64Url(token);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const key = await verificationKey(secret);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
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
  const encodedSalt = btoa(String.fromCharCode(...salt));
  const encodedHash = btoa(String.fromCharCode(...new Uint8Array(bits)));
  return `pbkdf2-sha256$100000$${encodedSalt}$${encodedHash}`;
}

function splitList(value) {
  return String(value || "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
}

async function roleFor(env, verified, clerkUser) {
  const candidates = [
    verified?.identity && `${verified.method}:${String(verified.identity).toLowerCase()}`,
    verified?.identity && String(verified.identity).toLowerCase(),
    clerkUser?.id,
    clerkUser?.email,
  ].filter(Boolean);

  if (clerkUser?.email === "muye@muye.dev" || String(verified?.identity || "").toLowerCase() === "muye@muye.dev") {
    return { role: "site_admin", emailLimit: null };
  }

  const adminIds = [...splitList(env.ADMIN_CLERK_IDS), ...splitList(env.EDITOR_CLERK_IDS)];
  const adminEmails = [...splitList(env.ADMIN_CLERK_EMAILS), ...splitList(env.EDITOR_CLERK_EMAILS)];
  const vipIds = splitList(env.VIP1_CLERK_IDS);
  const vipEmails = splitList(env.VIP1_CLERK_EMAILS);
  if (clerkUser?.id && adminIds.includes(clerkUser.id.toLowerCase())) return { role: "admin", emailLimit: null };
  if (clerkUser?.email && adminEmails.includes(clerkUser.email.toLowerCase())) return { role: "admin", emailLimit: null };
  if (clerkUser?.id && vipIds.includes(clerkUser.id.toLowerCase())) return { role: "vip1", emailLimit: 3 };
  if (clerkUser?.email && vipEmails.includes(clerkUser.email.toLowerCase())) return { role: "vip1", emailLimit: 3 };

  if (env.muye_mailboxes) {
    for (const identifier of candidates) {
      const row = await env.muye_mailboxes.prepare("SELECT role, email_limit FROM account_roles WHERE identifier = ? LIMIT 1").bind(identifier).first();
      if (row) return { role: row.role, emailLimit: row.email_limit == null ? null : Number(row.email_limit) };
    }
  }

  return { role: "device", emailLimit: 1 };
}

function isUnlimitedRole(role) {
  return role === "site_admin" || role === "admin" || role === "site_editor" || role === "editor";
}

function roleLimit(role) {
  if (role === "vip" || role === "vip1") return 3;
  return 1;
}

export async function onRequestPost({ request, env }) {
  if (!env.muye_mailboxes || !env.EMAIL_VERIFICATION_SECRET) {
    return json({ error: "Mailbox storage is not configured yet." }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const emailName = String(body.emailName || "").trim().toLowerCase();
  const requestText = String(body.requestText || "").trim();
  const proof = String(body.proof || "");
  const captcha = String(body.captcha || "");
  const password = String(body.password || "");
  const deviceId = String(body.deviceId || "").trim().slice(0, 96);
  if (!/^[a-z0-9._-]+$/.test(emailName)) return json({ error: "Enter a valid Muye email name." }, 400);
  if (!/^[a-z0-9_-]{16,96}$/i.test(deviceId)) return json({ error: "This device could not be identified. Refresh and try again." }, 400);
  if (!(await verifyTurnstile(captcha, request, env.TURNSTILE_SECRET_KEY))) return json({ error: "Please complete the CAPTCHA and try again." }, 403);

  let clerkUser = null;
  try { clerkUser = await clerkUserFromRequest(request, env, false); } catch { clerkUser = null; }
  const isOwner = String(clerkUser?.email || "").toLowerCase() === "muye@muye.dev";

  if (!isOwner) {
    if (password.length < 8 || !/\d/.test(password)) return json({ error: "Password must be at least 8 characters and include a number." }, 400);
    if (requestText.length < 12 || requestText.length > 1200) {
      return json({ error: "Write a short request with what you want this email for." }, 400);
    }
    try {
      const requestedPasswordHash = await passwordHash(password);
      await env.muye_mailboxes.prepare(
        `INSERT INTO email_requests (email_name, request_text, requester_clerk_user_id, requester_email, requester_name, password_hash)
         VALUES (?, ?, ?, ?, ?, ?)`,
      ).bind(emailName, requestText, clerkUser?.id || null, clerkUser?.email || null, clerkUser?.username || null, requestedPasswordHash).run();
    } catch (error) {
      console.error("create-email request failed", error);
      return json({ error: `Request database error: ${String(error?.message || error).slice(0, 180)}` }, 500);
    }
    return json({ ok: true, requested: true, mailbox: `${emailName}@muye.dev` });
  }

  if (password.length < 8 || !/\d/.test(password)) return json({ error: "Password must be at least 8 characters and include a number." }, 400);

  let verified;
  if (proof) {
    try {
      verified = await decryptToken(proof, env.EMAIL_VERIFICATION_SECRET);
    } catch {
      return json({ error: "Your verification has expired. Verify again." }, 400);
    }
    if (!verified.identity || verified.expiresAt < Date.now()) {
      return json({ error: "Your verification has expired. Verify again." }, 400);
    }
  } else {
    verified = { method: "email", identity: clerkUser.email, expiresAt: Date.now() + 60 * 1000 };
  }

  const role = await roleFor(env, verified, clerkUser);
  if (!isUnlimitedRole(role.role)) {
    const limit = role.emailLimit == null ? roleLimit(role.role) : Number(role.emailLimit);
    const identityHashForCount = await digest(`${verified.method}:${verified.identity}:${env.EMAIL_VERIFICATION_SECRET}`);
    if (clerkUser?.id) {
      const deviceOwner = await env.muye_mailboxes.prepare(
        "SELECT clerk_user_id FROM mailboxes WHERE device_id = ? AND clerk_user_id IS NOT NULL AND clerk_user_id != ? LIMIT 1",
      ).bind(deviceId, clerkUser.id).first();
      if (deviceOwner) return json({ error: "This device is already linked to another Clerk account." }, 409);
    }
    const existing = await env.muye_mailboxes.prepare(
      "SELECT COUNT(*) AS count FROM mailboxes WHERE identity_hash = ? OR device_id = ? OR (clerk_user_id IS NOT NULL AND clerk_user_id = ?)",
    ).bind(identityHashForCount, deviceId, clerkUser?.id || "__none__").first();
    if (Number(existing?.count || 0) >= limit) {
      return json({ error: limit === 1 ? "This device or verified contact already has a Muye email." : `VIP1 can create up to ${limit} Muye emails.` }, 409);
    }
  }

  const mailbox = `${emailName}@muye.dev`;
  let identityHash;
  let hashedPassword;
  try {
    identityHash = await digest(`${verified.method}:${verified.identity}:${env.EMAIL_VERIFICATION_SECRET}`);
    hashedPassword = await passwordHash(password);
  } catch (error) {
    console.error("create-email preparation failed", error);
    return json({ error: `Mailbox security setup error: ${String(error?.message || error).slice(0, 180)}` }, 500);
  }

  try {
    await env.muye_mailboxes.prepare(
      "INSERT INTO mailboxes (mailbox, identity_hash, identity_type, password_hash, device_id, clerk_user_id) VALUES (?, ?, ?, ?, ?, ?)",
    ).bind(mailbox, identityHash, verified.method, hashedPassword, deviceId, clerkUser?.id || null).run();
  } catch (error) {
    console.error("create-email insert failed", error);
    if (String(error?.message || error).includes("UNIQUE")) {
      const mailboxExists = await env.muye_mailboxes.prepare("SELECT 1 FROM mailboxes WHERE mailbox = ? LIMIT 1").bind(mailbox).first();
      return json({ error: mailboxExists ? "That Muye email address is already taken." : "Could not reserve that Muye email address." }, 409);
    }
    return json({ error: `Mailbox database error: ${String(error?.message || error).slice(0, 180)}` }, 500);
  }

  return json({ ok: true, mailbox });
}
