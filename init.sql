CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  coins INTEGER DEFAULT 0,
  hasVpnBoost INTEGER DEFAULT 0,
  activateVpn INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS completed_tasks (
  user_id TEXT,
  task_key TEXT,
  completed_at INTEGER
);
