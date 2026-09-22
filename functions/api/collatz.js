import { clerkUserFromRequest } from "./_clerk.js";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
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

async function requireSiteAdmin(request, env, body = {}) {
  const password = String(body.adminPassword || "");
  if (password && env.ADMIN_PASSWD && password === env.ADMIN_PASSWD) return;

  try {
    const mailbox = await mailboxFromRequest(request, env);
    if (mailbox === "muye@muye.dev") return;
  } catch {}

  try {
    const user = await clerkUserFromRequest(request, env);
    const email = String(user.email || "").toLowerCase();
    const ids = splitList(env.ADMIN_CLERK_IDS).concat(splitList(env.EDITOR_CLERK_IDS));
    const emails = splitList(env.ADMIN_CLERK_EMAILS).concat(splitList(env.EDITOR_CLERK_EMAILS));
    if (email === "muye@muye.dev" || ids.includes(String(user.id || "").toLowerCase()) || emails.includes(email)) return;
  } catch {}

  throw new Error("forbidden");
}

async function ensureTables(env) {
  await env.muye_mailboxes.prepare(
    `CREATE TABLE IF NOT EXISTS collatz_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      next_start TEXT NOT NULL DEFAULT '1',
      best_steps INTEGER NOT NULL DEFAULT 0,
      best_num TEXT NOT NULL DEFAULT '1',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  ).run();
  await env.muye_mailboxes.prepare(
    `CREATE TABLE IF NOT EXISTS collatz_records (
      num TEXT PRIMARY KEY,
      steps INTEGER NOT NULL,
      line TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  ).run();
  await env.muye_mailboxes.prepare(
    `CREATE TABLE IF NOT EXISTS collatz_clients (
      client_id TEXT PRIMARY KEY,
      updated_at INTEGER NOT NULL
    )`,
  ).run();
  await env.muye_mailboxes.prepare(
    "INSERT OR IGNORE INTO collatz_state (id, next_start, best_steps, best_num) VALUES (1, '1', 0, '1')",
  ).run();
}

function isPositiveIntegerText(value) {
  return /^[1-9][0-9]*$/.test(String(value || ""));
}

function parseRecordLine(line) {
  const match = String(line || "").match(/cur largest lifespan\s+(\d+),\s*num\s+(\d+)/i);
  if (!match) return null;
  return { steps: Number(match[1]), num: match[2], line: `cur largest lifespan ${Number(match[1])}, num ${match[2]}` };
}

async function touchClient(env, clientId) {
  const id = String(clientId || "").slice(0, 80);
  if (!/^[a-zA-Z0-9._:-]{8,80}$/.test(id)) return;
  await env.muye_mailboxes.prepare(
    "INSERT OR REPLACE INTO collatz_clients (client_id, updated_at) VALUES (?, ?)",
  ).bind(id, Date.now()).run();
}

function readU16(bytes, offset) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function readU32(bytes, offset) {
  return (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0;
}

function textsFromZip(bytes) {
  const texts = [];
  let offset = 0;
  const decoder = new TextDecoder();
  while (offset + 30 < bytes.length) {
    if (readU32(bytes, offset) !== 0x04034b50) break;
    const method = readU16(bytes, offset + 8);
    const compressedSize = readU32(bytes, offset + 18);
    const filenameLength = readU16(bytes, offset + 26);
    const extraLength = readU16(bytes, offset + 28);
    const dataStart = offset + 30 + filenameLength + extraLength;
    const dataEnd = dataStart + compressedSize;
    if (dataEnd > bytes.length) break;
    if (method === 0) texts.push(decoder.decode(bytes.slice(dataStart, dataEnd)));
    offset = dataEnd;
  }
  return texts;
}

async function state(env) {
  await ensureTables(env);
  const activeAfter = Date.now() - 15000;
  await env.muye_mailboxes.prepare("DELETE FROM collatz_clients WHERE updated_at < ?").bind(activeAfter).run();
  const row = await env.muye_mailboxes.prepare("SELECT next_start, best_steps, best_num FROM collatz_state WHERE id = 1").first();
  const active = await env.muye_mailboxes.prepare("SELECT COUNT(*) AS count FROM collatz_clients WHERE updated_at >= ?").bind(activeAfter).first();
  const rows = await env.muye_mailboxes.prepare(
    "SELECT num, steps, line, created_at FROM collatz_records ORDER BY steps ASC, created_at ASC LIMIT 500",
  ).all();
  return {
    nextStart: row.next_start,
    checkedThrough: (BigInt(row.next_start) - 1n).toString(),
    bestSteps: row.best_steps,
    bestNum: row.best_num,
    activeSearchers: Number(active.count || 0),
    records: rows.results || [],
  };
}

export async function onRequestGet({ env }) {
  if (!env.muye_mailboxes) return json({ error: "Storage is not configured." }, 503);
  return json(await state(env));
}

export async function onRequestPost({ request, env }) {
  if (!env.muye_mailboxes) return json({ error: "Storage is not configured." }, 503);
  await ensureTables(env);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const action = String(body.action || "");

  if (action === "claim") {
    await touchClient(env, body.clientId);
    const size = Math.max(1, Math.min(1000000, Number(body.size) || 100000));
    for (let attempt = 0; attempt < 8; attempt++) {
      const current = await env.muye_mailboxes.prepare("SELECT next_start FROM collatz_state WHERE id = 1").first();
      const start = BigInt(current.next_start);
      const end = start + BigInt(size) - 1n;
      const nextStart = end + 1n;
      const result = await env.muye_mailboxes.prepare(
        "UPDATE collatz_state SET next_start = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1 AND next_start = ?",
      ).bind(nextStart.toString(), current.next_start).run();
      if ((result.meta?.changes || 0) === 1) {
        return json({ start: start.toString(), end: end.toString(), nextStart: nextStart.toString() });
      }
    }
    return json({ error: "Could not claim work. Try again." }, 409);
  }

  if (action === "submit") {
    await touchClient(env, body.clientId);
    const records = Array.isArray(body.records) ? body.records.slice(0, 100) : [];
    for (const record of records) {
      const parsed = parseRecordLine(record.line || `cur largest lifespan ${record.steps}, num ${record.num}`);
      if (!parsed || !Number.isSafeInteger(parsed.steps) || !isPositiveIntegerText(parsed.num)) continue;
      await env.muye_mailboxes.prepare(
        "INSERT OR IGNORE INTO collatz_records (num, steps, line) VALUES (?, ?, ?)",
      ).bind(parsed.num, parsed.steps, parsed.line).run();
      const current = await env.muye_mailboxes.prepare("SELECT best_steps FROM collatz_state WHERE id = 1").first();
      if (parsed.steps > Number(current.best_steps || 0)) {
        await env.muye_mailboxes.prepare(
          "UPDATE collatz_state SET best_steps = ?, best_num = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
        ).bind(parsed.steps, parsed.num).run();
      }
    }
    return json({ ok: true, ...(await state(env)) });
  }

  if (action === "heartbeat") {
    await touchClient(env, body.clientId);
    return json({ ok: true, ...(await state(env)) });
  }

  if (action === "admin-import") {
    try { await requireSiteAdmin(request, env, body); } catch { return json({ error: "Admin password is wrong or missing." }, 403); }
    const file = String(body.file || "");
    const mime = String(body.mime || "");
    let text = "";
    if (mime.includes("zip") || file.startsWith("UEs")) {
      const bytes = Uint8Array.from(atob(file), (character) => character.charCodeAt(0));
      text = textsFromZip(bytes).join("\n");
    } else {
      text = new TextDecoder().decode(Uint8Array.from(atob(file), (character) => character.charCodeAt(0)));
    }
    const parsed = text.split(/\r?\n/).map(parseRecordLine).filter(Boolean);
    if (!parsed.length) return json({ error: "No Collatz record lines found." }, 400);
    await env.muye_mailboxes.prepare("DELETE FROM collatz_records").run();
    let best = parsed[0];
    for (const record of parsed) {
      await env.muye_mailboxes.prepare(
        "INSERT OR REPLACE INTO collatz_records (num, steps, line) VALUES (?, ?, ?)",
      ).bind(record.num, record.steps, record.line).run();
      if (record.steps > best.steps) best = record;
    }
    await env.muye_mailboxes.prepare(
      "UPDATE collatz_state SET best_steps = ?, best_num = ?, next_start = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
    ).bind(best.steps, best.num, (BigInt(best.num) + 1n).toString()).run();
    return json({ ok: true, imported: parsed.length, ...(await state(env)) });
  }

  return json({ error: "Invalid action." }, 400);
}
