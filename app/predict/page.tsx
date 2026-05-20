import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import { getPrediction } from '@/lib/predictions';
import { predictionsOpen, PREDICTIONS_DEADLINE } from '@/data/tournament';
import PredictForm from './PredictForm';

export const dynamic = 'force-dynamic';

export default function PredictPage() {
  const user = currentUser();

  if (!user) {
    return (
      <>
        <h1>Make your predictions</h1>
        <div className="panel">
          <p className="lead">You need to sign in before you can play.</p>
          <Link href="/login" className="btn">
            Sign in with email
          </Link>
        </div>
      </>
    );
  }

  const prediction = getPrediction(user.id);
  const open = predictionsOpen();
  const deadline = new Date(PREDICTIONS_DEADLINE).toUTCString();

  return (
    <>
      <h1>Your bracket</h1>
      <p className="lead">
        Signed in as {user.display_name}.{' '}
        {open
          ? `You can edit and re-save until kickoff (${deadline}).`
          : 'Predictions are now locked.'}
      </p>
      <PredictForm initial={prediction} locked={!open} />
    </>
  );
}
