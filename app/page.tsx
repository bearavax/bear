import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import { allPredictions, getResults, playerCount } from '@/lib/predictions';
import { scorePrediction, hasResults, POINTS } from '@/lib/scoring';
import { TOURNAMENT_NAME, predictionsOpen, flagOf } from '@/data/tournament';

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
        <div className="ball">🏆⚽</div>
        <h1>Team1 {TOURNAMENT_NAME} Predictions</h1>
        <p className="lead">
          Fill in your bracket, predict the champion, and battle the rest of
          team1 on the leaderboard. It&apos;s a free-for-fun prediction game —
          no money, just bragging rights.
        </p>
        <div className="cta-row">
          <Link href={user ? '/predict' : '/login'} className="btn">
            {user ? 'Make your predictions' : 'Sign up to play'}
          </Link>
          <Link href="/leaderboard" className="btn secondary">
            View leaderboard
          </Link>
        </div>
        <p className="muted" style={{ marginTop: 14 }}>
          {players} {players === 1 ? 'player has' : 'players have'} entered ·{' '}
          {predictionsOpen()
            ? 'predictions are open'
            : 'predictions are locked'}
        </p>
      </section>

      <div className="panel">
        <h2 style={{ marginTop: 0 }}>How it works</h2>
        <ol className="muted" style={{ paddingLeft: 20 }}>
          <li>Sign up with your email — we send a one-tap sign-in link.</li>
          <li>
            Predict who finishes 1st &amp; 2nd in all 12 groups, the four
            semi-finalists, the two finalists, and the champion.
          </li>
          <li>
            Edit your bracket as much as you like until the tournament kicks
            off. After that it locks.
          </li>
          <li>
            As real results come in, points are added up and the leaderboard
            updates automatically.
          </li>
        </ol>
      </div>

      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Scoring</h2>
        <div className="chips">
          <span className="chip">
            Group winner <b>+{POINTS.groupWinner}</b>
          </span>
          <span className="chip">
            Group runner-up <b>+{POINTS.groupRunnerUp}</b>
          </span>
          <span className="chip">
            Each semi-finalist <b>+{POINTS.semifinalist}</b>
          </span>
          <span className="chip">
            Each finalist <b>+{POINTS.finalist}</b>
          </span>
          <span className="chip">
            Champion <b>+{POINTS.champion}</b>
          </span>
        </div>
      </div>

      {top.length > 0 && (
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>
            {showScores ? 'Leaderboard — top 5' : 'Players in so far'}
          </h2>
          <table className="table">
            <tbody>
              {top.map((row, i) => (
                <tr key={row.name} className={i === 0 ? 'top-1' : ''}>
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
          <p style={{ marginBottom: 0 }}>
            <Link href="/leaderboard">See the full leaderboard →</Link>
          </p>
        </div>
      )}
    </>
  );
}
