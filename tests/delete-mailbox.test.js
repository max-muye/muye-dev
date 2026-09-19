import assert from "node:assert/strict";
import test from "node:test";

import { onRequestDelete } from "../functions/api/delete-mailbox.js";

const encoder = new TextEncoder();

function toBase64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}

function toBase64Url(bytes) {
  return toBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function passwordHash(password, iterations = 10000) {
  const salt = encoder.encode("fixed-test-salt");
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, key, 256);
  return `pbkdf2-sha256$${iterations}$${toBase64(salt)}$${toBase64(new Uint8Array(bits))}`;
}

async function sessionCookie(mailbox, secret) {
  const iv = new Uint8Array(12).fill(7);
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
  constructor(mailbox, hash) {
    this.mailboxes = new Map([[mailbox, { password_hash: hash }]]);
    this.messages = [{ mailbox }, { mailbox }, { mailbox: "other@muye.dev" }];
    this.sendRequests = [{ mailbox }, { mailbox: "other@muye.dev" }];
  }

  prepare(sql) {
    return {
      bind: (...values) => ({
        sql,
        values,
        first: async () => this.mailboxes.get(values[0]) || null,
      }),
    };
  }

  async batch(statements) {
    for (const { sql, values } of statements) {
      const mailbox = values[0];
      if (sql.startsWith("DELETE FROM messages")) this.messages = this.messages.filter((row) => row.mailbox !== mailbox);
      if (sql.startsWith("DELETE FROM mailbox_send_requests")) this.sendRequests = this.sendRequests.filter((row) => row.mailbox !== mailbox);
      if (sql.startsWith("DELETE FROM mailboxes")) this.mailboxes.delete(mailbox);
    }
  }
}

async function fixture() {
  const mailbox = "owner@muye.dev";
  const password = "password1";
  const secret = "test-session-secret";
  const database = new FakeDatabase(mailbox, await passwordHash(password));
  const cookie = await sessionCookie(mailbox, secret);
  const env = { muye_mailboxes: database, EMAIL_VERIFICATION_SECRET: secret };
  return { mailbox, password, database, cookie, env };
}

function request(cookie, body) {
  return new Request("https://www.muye.dev/api/delete-mailbox", {
    method: "DELETE",
    headers: { cookie, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("deletes only the signed-in mailbox and its stored data", async () => {
  const { mailbox, password, database, cookie, env } = await fixture();
  const response = await onRequestDelete({ request: request(cookie, { password, confirmation: mailbox }), env });

  assert.equal(response.status, 200);
  assert.match(response.headers.get("set-cookie"), /Max-Age=0/);
  assert.equal(database.mailboxes.has(mailbox), false);
  assert.deepEqual(database.messages, [{ mailbox: "other@muye.dev" }]);
  assert.deepEqual(database.sendRequests, [{ mailbox: "other@muye.dev" }]);
});

test("does not delete a mailbox when the password is wrong", async () => {
  const { mailbox, database, cookie, env } = await fixture();
  const response = await onRequestDelete({ request: request(cookie, { password: "wrong-password1", confirmation: mailbox }), env });

  assert.equal(response.status, 401);
  assert.equal(database.mailboxes.has(mailbox), true);
  assert.equal(database.messages.length, 3);
});

test("does not delete a mailbox when the confirmation address differs", async () => {
  const { password, database, cookie, env } = await fixture();
  const response = await onRequestDelete({ request: request(cookie, { password, confirmation: "other@muye.dev" }), env });

  assert.equal(response.status, 400);
  assert.equal(database.mailboxes.size, 1);
  assert.equal(database.messages.length, 3);
});
