import Database from "better-sqlite3";

const db = new Database("tickets.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL,
    used INTEGER NOT NULL DEFAULT 0,
    used_at TEXT
  )
`);

db.close();

console.log("Database initialized successfully.");