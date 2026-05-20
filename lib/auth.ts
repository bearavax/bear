import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { db } from './db';
import type { User } from './types';

export const SESSION_COOKIE = 'wc_session';

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function createMagicToken(email: string): string {
  const token = randomBytes(24).toString('hex');
  db()
    .prepare(
      'INSERT INTO magic_tokens (token, email, expires_at, used) VALUES (?, ?, ?, 0)',
    )
    .run(token, email, Date.now() + TOKEN_TTL_MS);
  return token;
}

export function consumeMagicToken(token: string): string | null {
  const row = db()
    .prepare('SELECT email, expires_at, used FROM magic_tokens WHERE token = ?')
    .get(token) as { email: string; expires_at: number; used: number } | undefined;

  if (!row || row.used || row.expires_at < Date.now()) return null;

  db().prepare('UPDATE magic_tokens SET used = 1 WHERE token = ?').run(token);
  return row.email;
}

export function upsertUser(email: string): User {
  const existing = db()
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email) as User | undefined;
  if (existing) return existing;

  const displayName = email.split('@')[0].slice(0, 40);
  const info = db()
    .prepare(
      'INSERT INTO users (email, display_name, created_at) VALUES (?, ?, ?)',
    )
    .run(email, displayName, new Date().toISOString());

  return {
    id: Number(info.lastInsertRowid),
    email,
    display_name: displayName,
    created_at: new Date().toISOString(),
  };
}

export function createSession(userId: number): string {
  const id = randomBytes(24).toString('hex');
  db()
    .prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)')
    .run(id, userId, Date.now() + SESSION_TTL_MS);
  return id;
}

export const SESSION_MAX_AGE = SESSION_TTL_MS / 1000;

export function destroySession(sessionId: string): void {
  db().prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
}

/** Reads the signed-in user from the session cookie, or null. */
export function currentUser(): User | null {
  const id = cookies().get(SESSION_COOKIE)?.value;
  if (!id) return null;

  const row = db()
    .prepare(
      `SELECT u.* FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > ?`,
    )
    .get(id, Date.now()) as User | undefined;

  return row || null;
}
