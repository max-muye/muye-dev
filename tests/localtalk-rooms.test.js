import assert from "node:assert/strict";
import test from "node:test";

import { deleteEmptyTalkRooms, deleteTalkRoom, enableRoomEncryption, ensureRoomAccess, validEncryptedPayload } from "../functions/_localtalk_worker.js";

function sqlRecorder() {
  const calls = [];
  const sql = async (strings, ...values) => {
    calls.push({ text: strings.join("?"), values });
    return [];
  };
  return { calls, sql };
}

test("deletes a named Talk room and all room-owned public data atomically", async () => {
  const { calls, sql } = sqlRecorder();

  assert.equal(await deleteTalkRoom(sql, "  Project_Room  "), true);
  assert.equal(calls.length, 1);
  assert.match(calls[0].text, /delete from localtalk_messages/);
  assert.match(calls[0].text, /delete from localtalk_room_device_bans/);
  assert.match(calls[0].text, /delete from localtalk_room_text_bans/);
  assert.match(calls[0].text, /delete from localtalk_settings/);
  assert.match(calls[0].text, /delete from localtalk_rooms/);
  assert.deepEqual(calls[0].values, ["project_room", "project_room", "project_room", "fast_spam_room:project_room", "project_room"]);
});

test("refuses to delete the protected main room or an invalid room", async () => {
  const { calls, sql } = sqlRecorder();

  assert.equal(await deleteTalkRoom(sql, ""), false);
  assert.equal(await deleteTalkRoom(sql, "room with spaces"), false);
  assert.equal(calls.length, 0);
});

test("enables encryption with a salt and password verifier", async () => {
  const calls = [];
  const sql = async (strings, ...values) => {
    calls.push({ text: strings.join("?"), values });
    return [{ room: "private_room" }];
  };
  const salt = "MTIzNDU2Nzg5MDEyMzQ1Ng==";
  const verifier = "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo0NTY3ODkwMTI=";

  assert.equal(await enableRoomEncryption(sql, "Private_Room", salt, verifier), true);
  assert.match(calls[0].text, /not exists/);
  assert.deepEqual(calls[0].values, [salt, verifier, "private_room"]);
});

test("accepts only versioned AES-GCM ciphertext envelopes", () => {
  assert.equal(validEncryptedPayload("e2ee:v1:YWJjZA==:ZWZnaA=="), true);
  assert.equal(validEncryptedPayload("hello"), false);
  assert.equal(validEncryptedPayload("e2ee:v2:YWJjZA==:ZWZnaA=="), false);
});

test("creates rooms without applying a per-IP room limit", async () => {
  const calls = [];
  const sql = async (strings, ...values) => {
    calls.push({ text: strings.join("?"), values });
    return calls.length === 1 ? [] : [];
  };

  assert.equal(await ensureRoomAccess(sql, "room_four", "203.0.113.4"), true);
  assert.equal(calls.length, 2);
  assert.doesNotMatch(calls.map((call) => call.text).join("\n"), /count\(\*\)/i);
  assert.match(calls[1].text, /insert into localtalk_rooms/);
});

test("deletes every named room that has zero messages", async () => {
  const deleted = [];
  const sql = async (strings, ...values) => {
    const text = strings.join("?");
    if (text.includes("where not exists")) return [{ room: "empty_one" }, { room: "empty_two" }];
    if (text.includes("delete from localtalk_messages")) deleted.push(values.at(-1));
    return [];
  };

  assert.deepEqual(await deleteEmptyTalkRooms(sql), ["empty_one", "empty_two"]);
  assert.deepEqual(deleted, ["empty_one", "empty_two"]);
});
