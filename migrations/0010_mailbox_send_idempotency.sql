CREATE TABLE IF NOT EXISTS mailbox_send_requests (
  idempotency_key TEXT PRIMARY KEY,
  mailbox TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mailbox_send_requests_created
ON mailbox_send_requests (created_at DESC);
