import Link from 'next/link';
import { currentUser } from '@/lib/auth';

export default function Nav() {
  const user = currentUser();

  return (
    <nav className="nav">
      <Link href="/" className="brand">
        ⚽ WC Predictions
      </Link>
      <div className="links">
        <Link href="/predict">Predict</Link>
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
