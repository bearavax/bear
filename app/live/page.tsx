import { getResults } from '@/lib/predictions';
import { emptyPrediction } from '@/lib/empty';
import LiveBracket from '@/components/LiveBracket';

export const dynamic = 'force-dynamic';

export default function LivePage() {
  const results = getResults() ?? emptyPrediction();

  return (
    <>
      <h1>Live bracket</h1>
      <p className="lead">
        The real tournament as it unfolds — results land here as they happen.
      </p>
      <LiveBracket initial={results} />
    </>
  );
}
