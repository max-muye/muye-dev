CREATE TABLE IF NOT EXISTS collatz_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  next_start TEXT NOT NULL DEFAULT '1',
  best_steps INTEGER NOT NULL DEFAULT 0,
  best_num TEXT NOT NULL DEFAULT '1',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collatz_records (
  num TEXT PRIMARY KEY,
  steps INTEGER NOT NULL,
  line TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collatz_clients (
  client_id TEXT PRIMARY KEY,
  updated_at INTEGER NOT NULL
);

INSERT OR IGNORE INTO collatz_state (id, next_start, best_steps, best_num)
VALUES (1, '1', 0, '1');
