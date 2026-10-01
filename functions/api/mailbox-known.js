function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function mailboxFromRequest(request, env) {
  const cookie = request.headers.get("cookie") || "";
  const token = cookie.match(/(?:^|; )muye_mailbox=([^;]+)/)?.[1];
  if (!token || !env.EMAIL_VERIFICATION_SECRET) throw new Error("unauthorized");
  const combined = fromBase64Url(token);
  const keyBytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(env.EMAIL_VERIFICATION_SECRET));
  const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["decrypt"]);
  const payload = await crypto.subtle.decrypt({ name: "AES-GCM", iv: combined.slice(0, 12) }, key, combined.slice(12));
  const session = JSON.parse(new TextDecoder().decode(payload));
  if (!session.mailbox || session.expiresAt < Date.now()) throw new Error("expired");
  return String(session.mailbox).toLowerCase();
}

async function ensureKnownTable(env) {
  await env.muye_mailboxes.prepare(
    `CREATE TABLE IF NOT EXISTS mailbox_known_senders (
      mailbox TEXT NOT NULL,
      sender TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (mailbox, sender)
    )`,
  ).run();
}

async function mailboxIsBanned(env, mailbox) {
  const row = await env.muye_mailboxes.prepare("SELECT banned_at FROM mailboxes WHERE mailbox = ? LIMIT 1").bind(mailbox).first();
  return Boolean(row?.banned_at);
}

function normalizeSender(value) {
  const text = String(value || "").trim();
  const bracketed = text.match(/<([^<>\s@]+@[^<>\s@]+\.[^<>\s@]+)>/);
  const plain = text.match(/[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+/);
  const sender = String(bracketed?.[1] || plain?.[0] || "").toLowerCase();
  return /^\S+@\S+\.\S+$/.test(sender) && sender.length <= 254 ? sender : "";
}

export async function onRequestGet({ request, env }) {
  let mailbox;
  try { mailbox = await mailboxFromRequest(request, env); } catch { return json({ error: "Sign in to your mailbox." }, 401); }
  if (await mailboxIsBanned(env, mailbox)) return json({ error: "This mailbox is banned." }, 403);
  await ensureKnownTable(env);
  const rows = await env.muye_mailboxes.prepare(
    "SELECT sender FROM mailbox_known_senders WHERE mailbox = ? ORDER BY sender COLLATE NOCASE",
  ).bind(mailbox).all();
  return json({ senders: (rows.results || []).map((row) => row.sender) });
}

export async function onRequestPost({ request, env }) {
  let mailbox;
  try { mailbox = await mailboxFromRequest(request, env); } catch { return json({ error: "Sign in to your mailbox." }, 401); }
  if (await mailboxIsBanned(env, mailbox)) return json({ error: "This mailbox is banned." }, 403);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const sender = normalizeSender(body.sender);
  const action = body.action === "remove" ? "remove" : body.action === "add" ? "add" : "";
  if (!sender || !action) return json({ error: "Enter a valid email." }, 400);
  await ensureKnownTable(env);
  if (action === "add") {
    await env.muye_mailboxes.prepare(
      "INSERT OR IGNORE INTO mailbox_known_senders (mailbox, sender) VALUES (?, ?)",
    ).bind(mailbox, sender).run();
  } else {
    await env.muye_mailboxes.prepare(
      "DELETE FROM mailbox_known_senders WHERE mailbox = ? AND sender = ?",
    ).bind(mailbox, sender).run();
  }
  return json({ ok: true, sender, known: action === "add" });
}
