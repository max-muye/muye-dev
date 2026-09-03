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
  if (!env.muye_mailboxes) return json({ error: "Mailbox storage is not configured." }, 503);
  try { await requireSiteAdmin(request, env); } catch { return json({ error: "Admin access required." }, 403); }

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const action = String(body.action || "");
  const mailbox = cleanMailbox(body.mailbox);
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
