import Link from 'next/link';
import { allPredictions, getResults } from '@/lib/predictions';
import { scorePrediction, hasResults } from '@/lib/scoring';
import { flagOf } from '@/data/tournament';

export const dynamic = 'force-dynamic';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const results = getResults();
  const showScores = hasResults(results);

  const rows = allPredictions()
    .map((p) => {
      const score =
        showScores && results
          ? scorePrediction(p.prediction, results)
          : { total: 0, lines: [] };
      return {
        name: p.name,
        total: score.total,
        champion: p.prediction.champion,
        updatedAt: p.updatedAt,
      };
    })
    .sort(
      (a, b) =>
        b.total - a.total ||
        a.updatedAt.localeCompare(b.updatedAt) ||
        a.name.localeCompare(b.name),
    );

  return (
    <>
      <h1>Leaderboard</h1>
      {showScores ? (
        <p className="lead">
          Points update automatically as real tournament results come in.
        </p>
      ) : (
        <div className="banner warn">
          Results haven&apos;t been entered yet — scores will appear here once
          the tournament is underway.
        </div>
      )}

      {rows.length === 0 ? (
        <div className="panel">
          <p className="lead">
            No predictions yet. Be the first to enter your bracket!
          </p>
          <Link href="/bracket" className="btn">
            Fill out your bracket
          </Link>
        </div>
      ) : (
        <div className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Champion pick</th>
                <th style={{ textAlign: 'right' }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.name + i} className={i === 0 ? 'top-1' : ''}>
                  <td className="rank">
                    {showScores && i < 3 ? MEDALS[i] : i + 1}
                  </td>
                  <td>{row.name}</td>
                  <td className="muted">
                    {row.champion
                      ? `${flagOf(row.champion)} ${row.champion}`
                      : '—'}
                  </td>
                  <td className="score">{showScores ? row.total : '·'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
