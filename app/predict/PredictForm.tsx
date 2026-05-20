'use client';

import { useState } from 'react';
import BracketEditor from '@/components/BracketEditor';
import type { Prediction } from '@/lib/types';

export default function PredictForm({
  initial,
  locked,
}: {
  initial: Prediction;
  locked: boolean;
}) {
  const [prediction, setPrediction] = useState<Prediction>(initial);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle',
  );
  const [message, setMessage] = useState('');

  async function save() {
    setState('saving');
    setMessage('');
    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prediction),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState('error');
        setMessage(data.error || 'Could not save your predictions.');
        return;
      }
      setPrediction(data.prediction);
      setState('saved');
      setMessage('Predictions saved!');
    } catch {
      setState('error');
      setMessage('Network error. Try again.');
    }
  }

  return (
    <div>
      {locked && (
        <div className="banner warn">
          Predictions are locked — the tournament has started. You can still
          review your bracket below.
        </div>
      )}

      <BracketEditor
        value={prediction}
        onChange={(next) => {
          setPrediction(next);
          if (state !== 'idle') setState('idle');
        }}
        disabled={locked}
      />

      {!locked && (
        <div className="save-bar">
          <button
            className="btn"
            onClick={save}
            disabled={state === 'saving'}
          >
            {state === 'saving' ? 'Saving…' : 'Save predictions'}
          </button>
          {state === 'saved' && (
            <span className="banner ok" style={{ margin: 0 }}>
              {message}
            </span>
          )}
          {state === 'error' && (
            <span className="banner err" style={{ margin: 0 }}>
              {message}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
