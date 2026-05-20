import { GROUPS } from '@/data/tournament';
import type { Prediction } from './types';

export const POINTS = {
  groupWinner: 3,
  groupRunnerUp: 2,
  semifinalist: 5,
  finalist: 8,
  champion: 20,
} as const;

export type ScoreLine = { label: string; points: number };
export type ScoreBreakdown = { total: number; lines: ScoreLine[] };

/** Scores a prediction against the actual results. */
export function scorePrediction(
  pred: Prediction,
  results: Prediction,
): ScoreBreakdown {
  let total = 0;
  const lines: ScoreLine[] = [];

  for (const g of GROUPS) {
    const p = pred.groups[g.id];
    const r = results.groups[g.id];
    if (!p || !r) continue;

    if (p.first && p.first === r.first) {
      total += POINTS.groupWinner;
      lines.push({ label: `Group ${g.id} winner`, points: POINTS.groupWinner });
    }
    if (p.second && p.second === r.second) {
      total += POINTS.groupRunnerUp;
      lines.push({
        label: `Group ${g.id} runner-up`,
        points: POINTS.groupRunnerUp,
      });
    }
  }

  const actualSemis = new Set(results.semifinalists.filter(Boolean));
  for (const t of pred.semifinalists) {
    if (t && actualSemis.has(t)) {
      total += POINTS.semifinalist;
      lines.push({ label: `Semi-finalist: ${t}`, points: POINTS.semifinalist });
    }
  }

  const actualFinalists = new Set(results.finalists.filter(Boolean));
  for (const t of pred.finalists) {
    if (t && actualFinalists.has(t)) {
      total += POINTS.finalist;
      lines.push({ label: `Finalist: ${t}`, points: POINTS.finalist });
    }
  }

  if (pred.champion && pred.champion === results.champion) {
    total += POINTS.champion;
    lines.push({ label: `Champion: ${pred.champion}`, points: POINTS.champion });
  }

  return { total, lines };
}

/** True once an admin has entered at least one actual result. */
export function hasResults(results: Prediction | null): boolean {
  if (!results) return false;
  if (results.champion) return true;
  if (results.finalists.some(Boolean)) return true;
  if (results.semifinalists.some(Boolean)) return true;
  return Object.values(results.groups).some((g) => g.first || g.second);
}
