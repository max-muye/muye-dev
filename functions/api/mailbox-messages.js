function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;
const MAX_ATTACHMENT_BASE64_LENGTH = Math.ceil(MAX_ATTACHMENT_BYTES / 3) * 4;

function fromBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function decryptSession(token, secret) {
  const combined = fromBase64Url(token);
  const keyBytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["decrypt"]);
  const payload = await crypto.subtle.decrypt({ name: "AES-GCM", iv: combined.slice(0, 12) }, key, combined.slice(12));
  const session = JSON.parse(new TextDecoder().decode(payload));
  if (!session.mailbox || session.expiresAt < Date.now()) throw new Error("expired");
  return session.mailbox;
}

async function mailboxFromRequest(request, env) {
  const cookie = request.headers.get("cookie") || "";
  const token = cookie.match(/(?:^|; )muye_mailbox=([^;]+)/)?.[1];
  if (!token || !env.EMAIL_VERIFICATION_SECRET) throw new Error("unauthorized");
  return decryptSession(token, env.EMAIL_VERIFICATION_SECRET);
}

async function mailboxIsBanned(env, mailbox) {
  const row = await env.muye_mailboxes.prepare("SELECT banned_at FROM mailboxes WHERE mailbox = ? LIMIT 1").bind(mailbox).first();
  return Boolean(row?.banned_at);
}

export async function onRequestGet({ request, env }) {
  let mailbox;
  try { mailbox = await mailboxFromRequest(request, env); } catch { return json({ error: "Sign in to your mailbox." }, 401); }
  if (await mailboxIsBanned(env, mailbox)) return json({ error: "This mailbox is banned." }, 403);
  const url = new URL(request.url);
  const requestedView = url.searchParams.get("view");
  const view = requestedView === "outbox" || requestedView === "trash" ? requestedView : "inbox";
  const viewClause = {
    inbox: "direction = 'inbox' AND trashed_at IS NULL",
    outbox: "direction = 'sent' AND trashed_at IS NULL",
    trash: "direction = 'inbox' AND trashed_at IS NOT NULL",
  }[view];
  const orderClause = view === "outbox" ? "created_at DESC, id DESC" : "is_read ASC, created_at DESC, id DESC";
  const rows = await env.muye_mailboxes.prepare(
    `SELECT id, direction, sender, recipient, subject, body, body_html, image_name, image_type, image_data, is_read, trashed_at, created_at FROM messages WHERE mailbox = ? AND ${viewClause} ORDER BY ${orderClause} LIMIT 100`,
  ).bind(mailbox).all();
  return json({ mailbox, view, messages: rows.results || [] });
}

export async function onRequestPost({ request, env }) {
  let mailbox;
  try { mailbox = await mailboxFromRequest(request, env); } catch { return json({ error: "Sign in to your mailbox." }, 401); }
  if (await mailboxIsBanned(env, mailbox)) return json({ error: "This mailbox is banned." }, 403);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const recipient = String(body.recipient || "").trim().toLowerCase();
  const subject = String(body.subject || "").trim();
  const messageBody = String(body.body || "").trim();
  const idempotencyKey = String(request.headers.get("idempotency-key") || body.idempotencyKey || "").trim().slice(0, 120);
  let attachment;
  try { attachment = normalizeAttachment(body.attachment || body.image); } catch (error) { return json({ error: error.message || "That file cannot be sent." }, 400); }
  if (!/^\S+@\S+\.\S+$/.test(recipient) || !subject || (!messageBody && !attachment)) return json({ error: "Enter a recipient, subject, and message or file." }, 400);
  if (subject.length > 160 || messageBody.length > 10000) return json({ error: "That message is too long." }, 400);

  const mailboxFrom = mailbox;
  if (idempotencyKey && /^[a-zA-Z0-9._:-]{16,120}$/.test(idempotencyKey)) {
    try {
      await env.muye_mailboxes.prepare(
        "INSERT INTO mailbox_send_requests (idempotency_key, mailbox) VALUES (?, ?)",
      ).bind(`${mailbox}:${idempotencyKey}`, mailbox).run();
    } catch (error) {
      if (String(error?.message || error).includes("UNIQUE")) return json({ ok: true, duplicate: true });
      console.error("mailbox send idempotency failed", error);
      return json({ error: "Could not prepare this send. Try again." }, 500);
    }
  }

  const recentDuplicate = await env.muye_mailboxes.prepare(
    `SELECT id FROM messages
     WHERE mailbox = ?
       AND direction = 'sent'
       AND recipient = ?
       AND subject = ?
       AND body = ?
       AND COALESCE(image_name, '') = ?
       AND COALESCE(image_type, '') = ?
       AND COALESCE(image_data, '') = ?
       AND created_at > datetime('now', '-10 seconds')
     LIMIT 1`,
  ).bind(mailbox, recipient, subject, messageBody, attachment?.name || "", attachment?.type || "", attachment?.data || "").first();
  if (recentDuplicate) return json({ ok: true, duplicate: true });

  if (env.RESEND_API_KEY && mailboxFrom) {
    const payload = { from: mailboxFrom, to: [recipient], subject, text: messageBody || "File attached." };
    if (attachment) payload.attachments = [{ filename: attachment.name, content: attachment.data }];
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json", ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}) },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return json({ error: "The message could not be sent." }, 502);
  }

  await env.muye_mailboxes.prepare(
    "INSERT INTO messages (mailbox, direction, sender, recipient, subject, body, body_html, image_name, image_type, image_data, is_read) VALUES (?, 'sent', ?, ?, ?, ?, NULL, ?, ?, ?, 1)",
  ).bind(mailbox, mailbox, recipient, subject, messageBody, attachment?.name || null, attachment?.type || null, attachment?.data || null).run();

  if (recipient.endsWith("@muye.dev")) {
    await env.muye_mailboxes.prepare(
      "INSERT INTO messages (mailbox, direction, sender, recipient, subject, body, body_html, image_name, image_type, image_data) VALUES (?, 'inbox', ?, ?, ?, ?, NULL, ?, ?, ?)",
    ).bind(recipient, mailbox, recipient, subject, messageBody, attachment?.name || null, attachment?.type || null, attachment?.data || null).run();
  }
  return json({ ok: true });
}

function normalizeAttachment(attachment) {
  if (!attachment) return null;
  const name = String(attachment.name || "attachment").replace(/[\\/\0]/g, "").slice(0, 160) || "attachment";
  const type = String(attachment.type || "application/octet-stream").toLowerCase().slice(0, 100);
  const data = String(attachment.data || "");
  if (!/^[A-Za-z0-9+/=]+$/.test(data)) throw new Error("File data is invalid.");
  if (data.length > MAX_ATTACHMENT_BASE64_LENGTH) throw new Error("Choose a file under 4 MB.");
  return { name, type, data };
}

export async function onRequestPatch({ request, env }) {
  let mailbox;
  try { mailbox = await mailboxFromRequest(request, env); } catch { return json({ error: "Sign in to your mailbox." }, 401); }
  if (await mailboxIsBanned(env, mailbox)) return json({ error: "This mailbox is banned." }, 403);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const id = Number(body.id);
  if (!Number.isInteger(id)) return json({ error: "Invalid message." }, 400);
  const action = String(body.action || "read");
  if (action === "read") {
    await env.muye_mailboxes.prepare("UPDATE messages SET is_read = 1 WHERE id = ? AND mailbox = ?").bind(id, mailbox).run();
  } else if (action === "unread") {
    await env.muye_mailboxes.prepare("UPDATE messages SET is_read = 0 WHERE id = ? AND mailbox = ?").bind(id, mailbox).run();
  } else if (action === "trash") {
    await env.muye_mailboxes.prepare("UPDATE messages SET trashed_at = CURRENT_TIMESTAMP WHERE id = ? AND mailbox = ?").bind(id, mailbox).run();
  } else if (action === "restore") {
    await env.muye_mailboxes.prepare("UPDATE messages SET trashed_at = NULL WHERE id = ? AND mailbox = ?").bind(id, mailbox).run();
  } else {
    return json({ error: "Invalid action." }, 400);
  }
  return json({ ok: true });
}
