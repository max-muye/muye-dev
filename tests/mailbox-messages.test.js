import assert from "node:assert/strict";
import test from "node:test";

import { onRequestPost } from "../functions/api/mailbox-messages.js";

const encoder = new TextEncoder();

function toBase64Url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sessionCookie(mailbox, secret) {
  const iv = new Uint8Array(12).fill(4);
  const keyBytes = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["encrypt"]);
  const payload = encoder.encode(JSON.stringify({ mailbox, expiresAt: Date.now() + 60000 }));
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, payload));
  const combined = new Uint8Array(iv.length + encrypted.length);
  combined.set(iv);
  combined.set(encrypted, iv.length);
  return `muye_mailbox=${toBase64Url(combined)}`;
}

class FakeDatabase {
  constructor() {
    this.writes = [];
  }

  prepare(sql) {
    return {
      bind: (...values) => ({
        first: async () => sql.includes("banned_at") ? { banned_at: null } : null,
        run: async () => { this.writes.push({ sql, values }); return { success: true }; },
      }),
    };
  }
}

async function sendRequest(recipient) {
  const mailbox = "sender@muye.dev";
  const secret = "mailbox-message-test-secret";
  const cookie = await sessionCookie(mailbox, secret);
  return {
    mailbox,
    database: new FakeDatabase(),
    env: { EMAIL_VERIFICATION_SECRET: secret, RESEND_API_KEY: "resend-test-key" },
    request: new Request("https://www.muye.dev/api/mailbox-messages", {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ recipient, subject: "Test", body: "One message" }),
    }),
  };
}

test("delivers Muye-to-Muye mail directly without also calling Resend", async (t) => {
  let resendCalls = 0;
  t.mock.method(globalThis, "fetch", async () => { resendCalls += 1; return new Response("{}", { status: 200 }); });
  const fixture = await sendRequest("friend@muye.dev");
  fixture.env.muye_mailboxes = fixture.database;

  const response = await onRequestPost({ request: fixture.request, env: fixture.env });

  assert.equal(response.status, 200);
  assert.equal(resendCalls, 0);
  assert.equal(fixture.database.writes.filter(({ sql }) => sql.includes("'sent'")).length, 1);
  assert.equal(fixture.database.writes.filter(({ sql }) => sql.includes("'inbox'")).length, 1);
});

test("uses Resend for external recipients without creating an internal inbox row", async (t) => {
  let resendCalls = 0;
  t.mock.method(globalThis, "fetch", async () => { resendCalls += 1; return new Response("{}", { status: 200 }); });
  const fixture = await sendRequest("friend@example.com");
  fixture.env.muye_mailboxes = fixture.database;

  const response = await onRequestPost({ request: fixture.request, env: fixture.env });

  assert.equal(response.status, 200);
  assert.equal(resendCalls, 1);
  assert.equal(fixture.database.writes.filter(({ sql }) => sql.includes("'sent'")).length, 1);
  assert.equal(fixture.database.writes.filter(({ sql }) => sql.includes("'inbox'")).length, 0);
});
