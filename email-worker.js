const EMAIL_DOMAIN = "muye.dev";

function decodeHeader(value) {
  return value.replace(/=\?([^?]+)\?([bq])\?([^?]+)\?=/gi, (_match, charset, encoding, text) => {
    try {
      const bytes = encoding.toLowerCase() === "b"
        ? Uint8Array.from(atob(text), (character) => character.charCodeAt(0))
        : quotedPrintableHeaderBytes(text);
      return new TextDecoder(charset.toLowerCase()).decode(bytes);
    } catch {
      return text;
    }
  }).replace(/\s+/g, " ").trim();
}

function quotedPrintableHeaderBytes(value) {
  const text = value.replace(/_/g, " ");
  const bytes = [];
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === "=" && /^[0-9a-f]{2}$/i.test(text.slice(index + 1, index + 3))) {
      bytes.push(parseInt(text.slice(index + 1, index + 3), 16));
      index += 2;
    } else {
      bytes.push(text.charCodeAt(index));
    }
  }
  return new Uint8Array(bytes);
}

function headerValues(raw, name) {
  const matches = [...raw.matchAll(new RegExp(`^${name}:\\s*(.+(?:\\r?\\n[\\t ].+)*)$`, "gim"))];
  return matches.map((match) => decodeHeader(match[1].replace(/\r?\n[\t ]+/g, " ")));
}

function headerValue(raw, name) {
  const match = raw.match(new RegExp(`^${name}:\\s*(.+(?:\\r?\\n[\\t ].+)*)$`, "im"));
  return match ? decodeHeader(match[1]) : "";
}

function emailAddresses(value) {
  const decoded = decodeHeader(String(value || ""));
  return [...decoded.matchAll(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@muye\.dev\b/gi)]
    .map((match) => match[0].toLowerCase());
}

function localPart(address) {
  const value = String(address || "").trim().toLowerCase();
  const direct = emailAddresses(value)[0];
  if (direct) return direct.slice(0, direct.lastIndexOf("@"));
  const at = value.lastIndexOf("@");
  return at > 0 && value.slice(at + 1) === EMAIL_DOMAIN ? value.slice(0, at) : "";
}

function mailboxFromMessage(message, raw) {
  const candidates = [
    message.to,
    message.headers?.get?.("to"),
    message.headers?.get?.("delivered-to"),
    message.headers?.get?.("x-forwarded-to"),
    message.headers?.get?.("x-original-to"),
    ...headerValues(raw, "To"),
    ...headerValues(raw, "Delivered-To"),
    ...headerValues(raw, "X-Forwarded-To"),
    ...headerValues(raw, "X-Original-To"),
  ];
  for (const candidate of candidates) {
    const part = localPart(candidate);
    if (part) return `${part}@${EMAIL_DOMAIN}`;
  }
  return "";
}

async function ensureEmailIngestLog(env) {
  await env.muye_mailboxes.prepare(`
    CREATE TABLE IF NOT EXISTS email_ingest_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT NOT NULL,
      mailbox TEXT,
      message_to TEXT,
      message_from TEXT,
      header_to TEXT,
      delivered_to TEXT,
      forwarded_to TEXT,
      original_to TEXT,
      sender TEXT,
      subject TEXT,
      error TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
  await env.muye_mailboxes.prepare("CREATE INDEX IF NOT EXISTS email_ingest_log_created_idx ON email_ingest_log (created_at DESC)").run();
}

async function logEmailIngest(env, details) {
  if (!env.muye_mailboxes) return;
  try {
    await ensureEmailIngestLog(env);
    await env.muye_mailboxes.prepare(`
      INSERT INTO email_ingest_log (
        status, mailbox, message_to, message_from, header_to, delivered_to,
        forwarded_to, original_to, sender, subject, error
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      details.status,
      details.mailbox || null,
      details.messageTo || null,
      details.messageFrom || null,
      details.headerTo || null,
      details.deliveredTo || null,
      details.forwardedTo || null,
      details.originalTo || null,
      details.sender || null,
      details.subject || null,
      details.error || null,
    ).run();
  } catch (error) {
    console.error("email ingest log failed", error);
  }
}

function extractBody(raw) {
  const separator = raw.match(/\r?\n\r?\n/);
  if (!separator) return { text: raw.slice(-10000), html: "" };
  const headers = raw.slice(0, separator.index || 0);
  const body = raw.slice((separator.index || 0) + separator[0].length);
  const decoded = decodeMimeBody(headers, body);
  return {
    text: String(decoded.text || "").trim().slice(0, 10000),
    html: sanitizeHtml(String(decoded.html || "")).trim().slice(0, 50000),
  };
}

function headerValueFromBlock(headers, name) {
  const match = headers.match(new RegExp(`^${name}:\\s*(.+(?:\\r?\\n[\\t ].+)*)$`, "im"));
  return match ? match[1].replace(/\r?\n[\t ]+/g, " ").trim() : "";
}

function contentTypeParam(contentType, name) {
  const match = contentType.match(new RegExp(`${name}="?([^";]+)"?`, "i"));
  return match ? match[1] : "";
}

function decodeQuotedPrintable(value) {
  const compact = value.replace(/=\r?\n/g, "");
  const bytes = [];
  for (let index = 0; index < compact.length; index += 1) {
    if (compact[index] === "=" && /^[0-9a-f]{2}$/i.test(compact.slice(index + 1, index + 3))) {
      bytes.push(parseInt(compact.slice(index + 1, index + 3), 16));
      index += 2;
    } else {
      bytes.push(compact.charCodeAt(index));
    }
  }
  return new TextDecoder("utf-8").decode(new Uint8Array(bytes));
}

function decodeBase64Body(value) {
  const binary = atob(value.replace(/\s+/g, ""));
  return new TextDecoder("utf-8").decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

function maybeDecodeBareBase64(value) {
  const compact = value.trim().replace(/\s+/g, "");
  if (compact.length < 16 || compact.length % 4 !== 0 || !/^[A-Za-z0-9+/=]+$/.test(compact)) return value;
  try {
    const decoded = decodeBase64Body(compact);
    return /[\u4e00-\u9fff]/.test(decoded) ? decoded : value;
  } catch {
    return value;
  }
}

function htmlToText(value) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sanitizeHtml(value) {
  return value
    .replace(/<!doctype[^>]*>/gi, "")
    .replace(/<html[^>]*>/gi, "")
    .replace(/<\/html>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "")
    .replace(/<(?!\/?(a|b|blockquote|br|code|div|em|h1|h2|h3|h4|hr|i|img|li|ol|p|pre|span|strong|table|tbody|td|th|thead|tr|ul)\b)[^>]*>/gi, "");
}

function decodePart(headers, body) {
  const encoding = headerValueFromBlock(headers, "Content-Transfer-Encoding").toLowerCase();
  let decoded = body;
  try {
    if (encoding.includes("quoted-printable")) decoded = decodeQuotedPrintable(body);
    else if (encoding.includes("base64")) decoded = decodeBase64Body(body);
  } catch {
    decoded = body;
  }
  const contentType = headerValueFromBlock(headers, "Content-Type").toLowerCase();
  if (contentType.includes("text/html")) return { text: htmlToText(decoded), html: decoded };
  if (contentType.includes("text/plain") || !contentType) return { text: maybeDecodeBareBase64(decoded), html: "" };
  return { text: "", html: "" };
}

function decodeMimeBody(headers, body) {
  const contentType = headerValueFromBlock(headers, "Content-Type");
  const boundary = contentTypeParam(contentType, "boundary");
  if (!boundary) return decodePart(headers, body);

  const marker = `--${boundary}`;
  const parts = body.split(marker).filter((part) => part.trim() && !part.trim().startsWith("--"));
  const decodedParts = parts.map((part) => {
    const separator = part.match(/\r?\n\r?\n/);
    if (!separator) return { headers: "", text: "", html: "" };
    const partHeaders = part.slice(0, separator.index || 0);
    const partBody = part.slice((separator.index || 0) + separator[0].length);
    return { headers: partHeaders, ...decodeMimeBody(partHeaders, partBody) };
  });
  const plain = decodedParts.find((part) => headerValueFromBlock(part.headers, "Content-Type").toLowerCase().includes("text/plain"));
  const html = decodedParts.find((part) => headerValueFromBlock(part.headers, "Content-Type").toLowerCase().includes("text/html"));
  return {
    text: (plain?.text || htmlToText(html?.html || html?.text || "") || decodedParts.find((part) => part.text)?.text || "").trim(),
    html: (html?.html || "").trim(),
  };
}

export default {
  async email(message, env) {
    const raw = await new Response(message.raw).text();
    const mailbox = mailboxFromMessage(message, raw);
    const sender = String(headerValue(raw, "From") || message.from || "unknown").slice(0, 320);
    const subject = String(decodeHeader(message.headers.get("subject") || headerValue(raw, "Subject") || "(no subject)")).slice(0, 160);
    const logDetails = {
      mailbox,
      messageTo: String(message.to || "").slice(0, 320),
      messageFrom: String(message.from || "").slice(0, 320),
      headerTo: String(message.headers?.get?.("to") || headerValue(raw, "To") || "").slice(0, 320),
      deliveredTo: String(message.headers?.get?.("delivered-to") || headerValue(raw, "Delivered-To") || "").slice(0, 320),
      forwardedTo: String(message.headers?.get?.("x-forwarded-to") || headerValue(raw, "X-Forwarded-To") || "").slice(0, 320),
      originalTo: String(message.headers?.get?.("x-original-to") || headerValue(raw, "X-Original-To") || "").slice(0, 320),
      sender,
      subject,
    };
    if (!mailbox || !env.muye_mailboxes) {
      await logEmailIngest(env, { ...logDetails, status: "rejected", error: !env.muye_mailboxes ? "D1 missing" : "mailbox missing" });
      message.setReject("Mailbox is not configured");
      return;
    }

    const body = extractBody(raw);

    try {
      await env.muye_mailboxes.prepare(
        "INSERT INTO messages (mailbox, direction, sender, recipient, subject, body, body_html) VALUES (?, 'inbox', ?, ?, ?, ?, ?)",
      ).bind(mailbox, sender, mailbox, subject, body.text || "(html message)", body.html || null).run();
      await logEmailIngest(env, { ...logDetails, status: "stored" });
    } catch (error) {
      await logEmailIngest(env, { ...logDetails, status: "failed", error: String(error?.message || error).slice(0, 320) });
      throw error;
    }
  },
};
