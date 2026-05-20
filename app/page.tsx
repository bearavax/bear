import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import { allPredictions, getResults, playerCount } from '@/lib/predictions';
import { scorePrediction, hasResults, POINTS } from '@/lib/scoring';
import { TOURNAMENT_NAME, flagOf } from '@/data/tournament';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const user = currentUser();
  const results = getResults();
  const showScores = hasResults(results);
  const players = playerCount();

  const top = allPredictions()
    .map((p) => ({
      name: p.name,
      total:
        showScores && results
          ? scorePrediction(p.prediction, results).total
          : 0,
      champion: p.prediction.champion,
    }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
    .slice(0, 5);

  return (
    <>
      <section className="hero">
        <div className="ball">🏆</div>
        <h1>Team1 {TOURNAMENT_NAME} Predictions</h1>
        <p className="lead">
          Predict the bracket. Top the leaderboard. Just for fun.
        </p>
        <div className="cta-row">
          <Link href={user ? '/predict' : '/login'} className="btn">
            {user ? 'Make your predictions' : 'Sign up to play'}
          </Link>
          <Link href="/leaderboard" className="btn secondary">
            Leaderboard
          </Link>
        </div>
      </section>

      <div className="steps">
        <div className="step">
          <span className="step-n">1</span>
          <b>Sign up</b>
          <p>Enter your email and tap the sign-in link.</p>
        </div>
        <div className="step">
          <span className="step-n">2</span>
          <b>Predict</b>
          <p>Pick group winners, the final four, and the champion.</p>
        </div>
        <div className="step">
          <span className="step-n">3</span>
          <b>Climb</b>
          <p>Score points as real results come in.</p>
        </div>
      </div>

      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Points</h2>
        <div className="chips">
          <span className="chip">
            Group winner <b>+{POINTS.groupWinner}</b>
          </span>
          <span className="chip">
            Runner-up <b>+{POINTS.groupRunnerUp}</b>
          </span>
          <span className="chip">
            Semi-finalist <b>+{POINTS.semifinalist}</b>
          </span>
          <span className="chip">
            Finalist <b>+{POINTS.finalist}</b>
          </span>
          <span className="chip">
            Champion <b>+{POINTS.champion}</b>
          </span>
        </div>
      </div>

      {top.length > 0 && (
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>
            {showScores ? 'Leaderboard' : `Players (${players})`}
          </h2>
          <table className="table">
            <tbody>
              {top.map((row, i) => (
                <tr key={row.name + i} className={i === 0 ? 'top-1' : ''}>
                  <td className="rank">{i + 1}</td>
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
          <p style={{ margin: '12px 0 0' }}>
            <Link href="/leaderboard">Full leaderboard →</Link>
          </p>
        </div>
      )}
    </>
  );
}
