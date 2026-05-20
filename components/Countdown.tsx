'use client';

import { useEffect, useState } from 'react';

export default function Countdown({
  deadline,
  locked,
}: {
  deadline: string;
  locked: boolean;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Stable placeholder for the first server + client render (no mismatch).
  if (now === null) {
    return <div className="countdown">⏱ Voting deadline…</div>;
  }

  const diff = new Date(deadline).getTime() - now;

  if (locked || diff <= 0) {
    return <div className="countdown locked">⏱ Voting is closed</div>;
  }

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000) % 24;
  const mins = Math.floor(diff / 60_000) % 60;
  const secs = Math.floor(diff / 1000) % 60;

  return (
    <div className="countdown">
      <span className="cd-label">⏱ Vote by kickoff in</span>
      <span className="cd-unit">
        <b>{days}</b>d
      </span>
      <span className="cd-unit">
        <b>{hours}</b>h
      </span>
      <span className="cd-unit">
        <b>{mins}</b>m
      </span>
      <span className="cd-unit">
        <b>{secs}</b>s
      </span>
    </div>
  );
}
