CREATE TABLE IF NOT EXISTS mailboxes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mailbox TEXT NOT NULL UNIQUE,
  identity_hash TEXT NOT NULL UNIQUE,
  identity_type TEXT NOT NULL CHECK (identity_type IN ('email', 'phone')),
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
