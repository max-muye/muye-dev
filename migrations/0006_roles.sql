ALTER TABLE mailboxes ADD COLUMN device_id TEXT;
ALTER TABLE mailboxes ADD COLUMN clerk_user_id TEXT;

CREATE TABLE IF NOT EXISTS account_roles (
  identifier TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  email_limit INTEGER
);

INSERT OR IGNORE INTO account_roles (identifier, role, email_limit)
VALUES ('muye@muye.dev', 'site_admin', NULL);
