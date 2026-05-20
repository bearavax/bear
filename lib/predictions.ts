import { db } from './db';
import { emptyPrediction } from './empty';
import { GROUPS, allTeamNames } from '@/data/tournament';
import type { Prediction } from './types';

export { emptyPrediction };

const TEAM_NAMES = new Set(allTeamNames());

/** Coerces arbitrary input into a valid, trusted Prediction object. */
export function sanitizePrediction(input: unknown): Prediction {
  const out = emptyPrediction();
  if (!input || typeof input !== 'object') return out;
  const raw = input as Record<string, unknown>;

  const groups = raw.groups;
  if (groups && typeof groups === 'object') {
    for (const g of GROUPS) {
      const pick = (groups as Record<string, unknown>)[g.id];
      if (!pick || typeof pick !== 'object') continue;
      const valid = new Set(g.teams);
      const p = pick as Record<string, unknown>;
      const first =
        typeof p.first === 'string' && valid.has(p.first) ? p.first : '';
      let second =
        typeof p.second === 'string' && valid.has(p.second) ? p.second : '';
      if (second && second === first) second = '';
      out.groups[g.id] = { first, second };
    }
  }

  out.semifinalists = pickDistinctTeams(raw.semifinalists, 4);
  out.finalists = pickDistinctTeams(raw.finalists, 2);
  out.champion =
    typeof raw.champion === 'string' && TEAM_NAMES.has(raw.champion)
      ? raw.champion
      : '';

  return out;
}

function pickDistinctTeams(value: unknown, length: number): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  if (Array.isArray(value)) {
    for (const v of value) {
      if (typeof v === 'string' && TEAM_NAMES.has(v) && !seen.has(v)) {
        out.push(v);
        seen.add(v);
      }
    }
  }
  while (out.length < length) out.push('');
  return out.slice(0, length);
}

export function getPrediction(userId: number): Prediction {
  const row = db()
    .prepare('SELECT data FROM predictions WHERE user_id = ?')
    .get(userId) as { data: string } | undefined;
  if (!row) return emptyPrediction();
  try {
    return sanitizePrediction(JSON.parse(row.data));
  } catch {
    return emptyPrediction();
  }
}

export function savePrediction(userId: number, prediction: Prediction): void {
  db()
    .prepare(
      `INSERT INTO predictions (user_id, data, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
    )
    .run(userId, JSON.stringify(prediction), new Date().toISOString());
}

export function getResults(): Prediction | null {
  const row = db()
    .prepare('SELECT data FROM results WHERE id = 1')
    .get() as { data: string } | undefined;
  if (!row) return null;
  try {
    return sanitizePrediction(JSON.parse(row.data));
  } catch {
    return null;
  }
}

export function saveResults(results: Prediction): void {
  db()
    .prepare(
      `INSERT INTO results (id, data, updated_at) VALUES (1, ?, ?)
       ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
    )
    .run(JSON.stringify(results), new Date().toISOString());
}

export type StoredPrediction = {
  userId: number;
  name: string;
  prediction: Prediction;
  updatedAt: string;
};

export function allPredictions(): StoredPrediction[] {
  const rows = db()
    .prepare(
      `SELECT u.id AS userId, u.display_name AS name, p.data, p.updated_at
       FROM predictions p JOIN users u ON u.id = p.user_id`,
    )
    .all() as { userId: number; name: string; data: string; updated_at: string }[];

  return rows.map((r) => {
    let prediction: Prediction;
    try {
      prediction = sanitizePrediction(JSON.parse(r.data));
    } catch {
      prediction = emptyPrediction();
    }
    return { userId: r.userId, name: r.name, prediction, updatedAt: r.updated_at };
  });
}

export function playerCount(): number {
  const row = db()
    .prepare('SELECT COUNT(*) AS n FROM predictions')
    .get() as { n: number };
  return row.n;
}
