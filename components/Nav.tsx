import Link from 'next/link';
import { currentUser } from '@/lib/auth';

export default function Nav() {
  const user = currentUser();

  return (
    <nav className="nav">
      <Link href="/" className="brand">
        ⚽ <span className="t1">team1</span> World Cup
      </Link>
      <div className="links">
        <Link href="/bracket">Bracket</Link>
        <Link href="/live">Live</Link>
        <Link href="/leaderboard">Leaderboard</Link>
      </div>
      <div className="spacer" />
      {user ? (
        <>
          <span className="who">{user.display_name}</span>
          <form action="/api/auth/logout" method="post">
            <button className="btn secondary" type="submit">
              Sign out
            </button>
          </form>
        </>
      ) : (
        <Link href="/login" className="btn">
          Sign in
        </Link>
      )}
    </nav>
  );
}
