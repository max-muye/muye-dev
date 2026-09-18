import { clerkUserFromRequest } from "./_clerk.js";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function splitList(value) {
  return String(value || "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function mailboxFromRequest(request, env) {
  const cookie = request.headers.get("cookie") || "";
  const token = cookie.match(/(?:^|; )muye_mailbox=([^;]+)/)?.[1];
  if (!token || !env.EMAIL_VERIFICATION_SECRET) throw new Error("missing mailbox session");
  const combined = fromBase64Url(token);
  const keyBytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(env.EMAIL_VERIFICATION_SECRET));
  const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["decrypt"]);
  const payload = await crypto.subtle.decrypt({ name: "AES-GCM", iv: combined.slice(0, 12) }, key, combined.slice(12));
  const session = JSON.parse(new TextDecoder().decode(payload));
  if (!session.mailbox || session.expiresAt < Date.now()) throw new Error("expired mailbox session");
  return String(session.mailbox || "").toLowerCase();
}

async function requireSiteAdmin(request, env) {
  try {
    const mailbox = await mailboxFromRequest(request, env);
    if (mailbox === "muye@muye.dev") return { mailbox };
  } catch {}

  const user = await clerkUserFromRequest(request, env);
  const email = String(user.email || "").toLowerCase();
  if (email === "muye@muye.dev") return user;
  const adminIds = [...splitList(env.ADMIN_CLERK_IDS), ...splitList(env.EDITOR_CLERK_IDS)];
  const adminEmails = [...splitList(env.ADMIN_CLERK_EMAILS), ...splitList(env.EDITOR_CLERK_EMAILS)];
  if (user.id && adminIds.includes(user.id.toLowerCase())) return user;
  if (email && adminEmails.includes(email)) return user;
  if (env.muye_mailboxes) {
    const identifiers = [user.id, email].filter(Boolean);
    for (const identifier of identifiers) {
      const row = await env.muye_mailboxes.prepare(
        "SELECT role FROM account_roles WHERE identifier = ? LIMIT 1",
      ).bind(identifier).first();
      if (row?.role === "site_admin" || row?.role === "admin" || row?.role === "site_editor" || row?.role === "editor") return user;
    }
  }
  throw new Error("forbidden");
}

function cleanMailbox(value) {
  return String(value || "").trim().toLowerCase();
}

async function digest(value) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function onRequestGet({ request, env }) {
  if (!env.muye_mailboxes) return json({ error: "Mailbox storage is not configured." }, 503);
  try { await requireSiteAdmin(request, env); } catch { return json({ error: "Admin access required." }, 403); }

  const url = new URL(request.url);
  const mailbox = cleanMailbox(url.searchParams.get("mailbox"));
  if (mailbox) {
    const mailboxRow = await env.muye_mailboxes.prepare(
      "SELECT mailbox, identity_type, created_at, banned_at FROM mailboxes WHERE mailbox = ? LIMIT 1",
    ).bind(mailbox).first();
    if (!mailboxRow) return json({ error: "Mailbox not found." }, 404);
    const messages = await env.muye_mailboxes.prepare(
      `SELECT id, mailbox, direction, sender, recipient, subject, body, body_html, image_name, image_type, image_data, is_read, trashed_at, created_at
       FROM messages WHERE mailbox = ? ORDER BY created_at DESC, id DESC LIMIT 500`,
    ).bind(mailbox).all();
    return json({ mailbox: mailboxRow, messages: messages.results || [] });
  }

  const rows = await env.muye_mailboxes.prepare(
    `SELECT m.mailbox, m.identity_type, m.created_at, m.banned_at,
            COUNT(msg.id) AS message_count,
            SUM(CASE WHEN msg.direction = 'inbox' THEN 1 ELSE 0 END) AS inbox_count,
            SUM(CASE WHEN msg.direction = 'sent' THEN 1 ELSE 0 END) AS sent_count,
            MAX(msg.created_at) AS latest_message_at
     FROM mailboxes m
     LEFT JOIN messages msg ON msg.mailbox = m.mailbox
     GROUP BY m.mailbox, m.identity_type, m.created_at, m.banned_at
     ORDER BY m.created_at DESC
     LIMIT 500`,
  ).all();
  const requestRows = await env.muye_mailboxes.prepare(
    `SELECT id, email_name, request_text, requester_email, requester_name, status, created_at
     FROM email_requests
     ORDER BY created_at DESC, id DESC
     LIMIT 100`,
  ).all();
  return json({ mailboxes: rows.results || [], requests: requestRows.results || [] });
}

export async function onRequestPatch({ request, env }) {
  if (!env.muye_mailboxes || !env.EMAIL_VERIFICATION_SECRET) return json({ error: "Mailbox storage is not configured." }, 503);
  try { await requireSiteAdmin(request, env); } catch { return json({ error: "Admin access required." }, 403); }

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const action = String(body.action || "");
  const mailbox = cleanMailbox(body.mailbox);

  if (action === "approve-request") {
    const requestId = Number(body.requestId);
    if (!Number.isInteger(requestId) || requestId <= 0) return json({ error: "Choose a request to approve." }, 400);
    const requestRow = await env.muye_mailboxes.prepare(
      "SELECT id, email_name, requester_clerk_user_id, requester_email, status, password_hash FROM email_requests WHERE id = ? LIMIT 1",
    ).bind(requestId).first();
    if (!requestRow) return json({ error: "Request not found." }, 404);
    if (requestRow.status && requestRow.status !== "open") return json({ error: "This request is already closed." }, 409);
    if (!requestRow.password_hash) return json({ error: "This older request has no password. Ask the user to submit it again." }, 409);
    const requestMailbox = `${cleanMailbox(requestRow.email_name)}@muye.dev`;
    if (!/^[a-z0-9._-]+@muye\.dev$/.test(requestMailbox)) return json({ error: "Invalid requested mailbox." }, 400);
    const existing = await env.muye_mailboxes.prepare("SELECT 1 FROM mailboxes WHERE mailbox = ? LIMIT 1").bind(requestMailbox).first();
    if (existing) return json({ error: "That Muye email address is already taken." }, 409);
    const identity = requestRow.requester_email || requestRow.requester_clerk_user_id || `request:${requestId}`;
    const identityHash = await digest(`approved-request:${identity}:${env.EMAIL_VERIFICATION_SECRET}`);
    await env.muye_mailboxes.batch([
      env.muye_mailboxes.prepare(
        "INSERT INTO mailboxes (mailbox, identity_hash, identity_type, password_hash, device_id, clerk_user_id) VALUES (?, ?, ?, ?, ?, ?)",
      ).bind(requestMailbox, identityHash, "approved_request", requestRow.password_hash, `approved-request:${requestId}`, requestRow.requester_clerk_user_id || null),
      env.muye_mailboxes.prepare(
        "UPDATE email_requests SET status = 'closed' WHERE id = ?",
      ).bind(requestId),
    ]);
    return json({ ok: true, mailbox: requestMailbox });
  }

  if (!/^[a-z0-9._-]+@muye\.dev$/.test(mailbox)) return json({ error: "Invalid mailbox." }, 400);

  if (action === "ban") {
    await env.muye_mailboxes.prepare("UPDATE mailboxes SET banned_at = CURRENT_TIMESTAMP WHERE mailbox = ?").bind(mailbox).run();
  } else if (action === "unban") {
    await env.muye_mailboxes.prepare("UPDATE mailboxes SET banned_at = NULL WHERE mailbox = ?").bind(mailbox).run();
  } else {
    return json({ error: "Invalid action." }, 400);
  }
  return json({ ok: true });
}

export async function onRequestDelete({ request, env }) {
  if (!env.muye_mailboxes) return json({ error: "Mailbox storage is not configured." }, 503);
  try { await requireSiteAdmin(request, env); } catch { return json({ error: "Admin access required." }, 403); }

  const url = new URL(request.url);
  const messageId = Number(url.searchParams.get("messageId"));
  const mailbox = cleanMailbox(url.searchParams.get("mailbox"));
  if (Number.isInteger(messageId) && messageId > 0) {
    await env.muye_mailboxes.prepare("DELETE FROM messages WHERE id = ?").bind(messageId).run();
    return json({ ok: true });
  }
  if (/^[a-z0-9._-]+@muye\.dev$/.test(mailbox)) {
    await env.muye_mailboxes.prepare("DELETE FROM messages WHERE mailbox = ?").bind(mailbox).run();
    await env.muye_mailboxes.prepare("DELETE FROM mailboxes WHERE mailbox = ?").bind(mailbox).run();
    return json({ ok: true });
  }
  return json({ error: "Choose a message or mailbox to delete." }, 400);
}
