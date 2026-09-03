CREATE TABLE IF NOT EXISTS email_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email_name TEXT NOT NULL,
  request_text TEXT NOT NULL,
  requester_clerk_user_id TEXT,
  requester_email TEXT,
  requester_name TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_requests_status_created
ON email_requests (status, created_at DESC);
