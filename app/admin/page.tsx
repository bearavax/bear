'use client';

import { useEffect, useState } from 'react';
import BracketEditor from '@/components/BracketEditor';
import { emptyPrediction } from '@/lib/empty';
import type { Prediction } from '@/lib/types';

export default function AdminPage() {
  const [results, setResults] = useState<Prediction>(emptyPrediction());
  const [token, setToken] = useState('');
  const [state, setState] = useState<'loading' | 'idle' | 'saving' | 'saved' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/results')
      .then((r) => r.json())
      .then((data) => {
        if (data.results) setResults(data.results);
      })
      .catch(() => {})
      .finally(() => setState('idle'));
  }, []);

  async function save() {
    setState('saving');
    setMessage('');
    try {
      const res = await fetch('/api/admin/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, results }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState('error');
        setMessage(data.error || 'Could not save results.');
        return;
      }
      setResults(data.results);
      setState('saved');
      setMessage('Results saved — the leaderboard now reflects them.');
    } catch {
      setState('error');
      setMessage('Network error. Try again.');
    }
  }

  return (
    <>
      <h1>Admin — actual results</h1>
      <p className="lead">
        Enter the real tournament outcomes here. Every player&apos;s score on
        the leaderboard is calculated against these values. Update them as the
        tournament progresses.
      </p>

      <div className="panel" style={{ maxWidth: 460 }}>
        <div className="field">
          <label htmlFor="token">Admin token</label>
          <input
            id="token"
            className="input"
            type="password"
            placeholder="ADMIN_TOKEN value"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>
          Set <code>ADMIN_TOKEN</code> in the environment and enter it here to
          save.
        </p>
      </div>

      {state === 'loading' ? (
        <p className="muted">Loading current results…</p>
      ) : (
        <BracketEditor value={results} onChange={setResults} />
      )}

      <div className="save-bar">
        <button
          className="btn"
          onClick={save}
          disabled={state === 'saving' || state === 'loading' || !token}
        >
          {state === 'saving' ? 'Saving…' : 'Save results'}
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
    </>
  );
}
