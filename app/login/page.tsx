'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const params = useSearchParams();
  const linkError = params.get('error');

  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  );
  const [message, setMessage] = useState('');
  const [devLink, setDevLink] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    setMessage('');
    setDevLink(null);

    try {
      const res = await fetch('/api/auth/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setState('error');
        setMessage(data.error || 'Something went wrong. Try again.');
        return;
      }

      setState('sent');
      setDevLink(data.devLink || null);
    } catch {
      setState('error');
      setMessage('Network error. Try again.');
    }
  }

  return (
    <>
      <h1>Sign in to play</h1>
      <p className="lead">
        Enter your email and we&apos;ll send you a one-tap sign-in link. No
        password to remember.
      </p>

      {linkError && (
        <div className="banner err">
          {linkError === 'invalid'
            ? 'That sign-in link was invalid or expired. Request a new one below.'
            : 'No sign-in token found. Request a new link below.'}
        </div>
      )}

      <div className="panel" style={{ maxWidth: 460 }}>
        {state === 'sent' ? (
          <>
            <div className="banner ok">
              Check your inbox for a sign-in link.
            </div>
            {devLink && (
              <>
                <p className="muted">
                  No email server is configured, so here&apos;s your sign-in
                  link directly:
                </p>
                <p>
                  <a href={devLink}>{devLink}</a>
                </p>
              </>
            )}
            <button
              className="btn secondary"
              onClick={() => setState('idle')}
            >
              Use a different email
            </button>
          </>
        ) : (
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                className="input"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {state === 'error' && <div className="banner err">{message}</div>}
            <button
              className="btn"
              type="submit"
              disabled={state === 'sending'}
              style={{ marginTop: 8 }}
            >
              {state === 'sending' ? 'Sending…' : 'Send sign-in link'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<h1>Sign in to play</h1>}>
      <LoginForm />
    </Suspense>
  );
}
