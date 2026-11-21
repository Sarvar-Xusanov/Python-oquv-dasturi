import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { db } from './db.ts';

export interface AuthenticatedUser {
  id: number;
  username: string;
  displayName: string;
  role: string;
  hasPassword: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, expectedHex] = parts;
  const actualBuf = crypto.scryptSync(password, salt, 64);
  const expectedBuf = Buffer.from(expectedHex, 'hex');
  if (actualBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(actualBuf, expectedBuf);
}

export function createSessionToken(userId: number): string {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  db.prepare(`
    INSERT INTO sessions (token_hash, user_id, expires_at)
    VALUES (?, ?, ?)
  `).run(tokenHash, userId, expiresAt);

  db.prepare(`UPDATE users SET last_active_at = datetime('now') WHERE id = ?`).run(userId);

  return rawToken;
}

export function revokeSessionToken(rawToken: string): void {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const rawToken = authHeader.slice(7).trim();
  if (!rawToken) {
    res.status(401).json({ error: 'Invalid session token' });
    return;
  }

  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const row = db
    .prepare(`
      SELECT u.id, u.username, u.display_name, u.role, u.password_hash, s.expires_at
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ?
    `)
    .get(tokenHash) as
    | {
        id: number;
        username: string;
        display_name: string;
        role: string;
        password_hash: string | null;
        expires_at: string;
      }
    | undefined;

  if (!row) {
    res.status(401).json({ error: 'Session expired or invalid' });
    return;
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
    res.status(401).json({ error: 'Session expired' });
    return;
  }

  req.user = {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    role: row.role,
    hasPassword: Boolean(row.password_hash),
  };

  next();
}
