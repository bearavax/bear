import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import { getPrediction } from '@/lib/predictions';
import { predictionsOpen, PREDICTIONS_DEADLINE } from '@/data/tournament';
import Countdown from '@/components/Countdown';
import BracketForm from './BracketForm';

export const dynamic = 'force-dynamic';

export default function BracketPage() {
  const user = currentUser();

  if (!user) {
    return (
      <>
        <h1>Your bracket</h1>
        <div className="panel">
          <p className="lead">Sign in to fill out your bracket.</p>
          <Link href="/login" className="btn">
            Sign in with email
          </Link>
        </div>
      </>
    );
  }

  const prediction = getPrediction(user.id);
  const open = predictionsOpen();

  return (
    <>
      <h1>Your bracket</h1>
      <p className="lead">
        Signed in as {user.display_name}. Edit and re-save as often as you like
        until voting closes.
      </p>
      <Countdown deadline={PREDICTIONS_DEADLINE} locked={!open} />
      <BracketForm initial={prediction} locked={!open} />
    </>
  );
}
