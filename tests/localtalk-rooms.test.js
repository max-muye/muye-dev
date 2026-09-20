import assert from "node:assert/strict";
import test from "node:test";

import { deleteTalkRoom } from "../functions/_localtalk_worker.js";

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
