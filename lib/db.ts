import Database from 'better-sqlite3';
import path from 'path';

let instance: Database.Database | null = null;

export function db(): Database.Database {
  if (instance) return instance;

  const file =
    process.env.DATABASE_PATH || path.join(process.cwd(), 'worldcup.db');
  const conn = new Database(file);
  conn.pragma('journal_mode = WAL');

  conn.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      email        TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      created_at   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS magic_tokens (
      token      TEXT PRIMARY KEY,
      email      TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      used       INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id         TEXT PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id),
      expires_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS predictions (
      user_id    INTEGER PRIMARY KEY REFERENCES users(id),
      data       TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS results (
      id         INTEGER PRIMARY KEY CHECK (id = 1),
      data       TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  instance = conn;
  return instance;
}
