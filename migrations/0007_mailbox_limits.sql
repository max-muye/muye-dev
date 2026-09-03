CREATE TABLE IF NOT EXISTS mailboxes_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mailbox TEXT NOT NULL UNIQUE,
  identity_hash TEXT NOT NULL,
  identity_type TEXT NOT NULL CHECK (identity_type IN ('email', 'phone')),
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  device_id TEXT,
  clerk_user_id TEXT
);

INSERT INTO mailboxes_new (id, mailbox, identity_hash, identity_type, password_hash, created_at, device_id, clerk_user_id)
SELECT id, mailbox, identity_hash, identity_type, password_hash, created_at, device_id, clerk_user_id
FROM mailboxes;

DROP TABLE mailboxes;
ALTER TABLE mailboxes_new RENAME TO mailboxes;

CREATE UNIQUE INDEX IF NOT EXISTS mailboxes_mailbox_unique_idx ON mailboxes (mailbox);
CREATE INDEX IF NOT EXISTS mailboxes_identity_hash_idx ON mailboxes (identity_hash);
CREATE INDEX IF NOT EXISTS mailboxes_device_id_idx ON mailboxes (device_id);
CREATE INDEX IF NOT EXISTS mailboxes_clerk_user_id_idx ON mailboxes (clerk_user_id);

INSERT OR REPLACE INTO account_roles (identifier, role, email_limit)
VALUES ('muye@muye.dev', 'site_admin', NULL);
