'use client';

import { useEffect, useState } from 'react';
import { GROUPS, flagOf } from '@/data/tournament';
import { hasResults } from '@/lib/scoring';
import type { Prediction } from '@/lib/types';

function TeamChip({
  name,
  champion,
}: {
  name: string;
  champion?: boolean;
}) {
  const classes = ['bracket-team'];
  if (champion) classes.push('champion');
  if (!name) classes.push('tbd');
  return (
    <span className={classes.join(' ')}>
      {name ? (
        <>
          {champion ? '🏆 ' : ''}
          {flagOf(name)} {name}
        </>
      ) : (
        'TBD'
      )}
    </span>
  );
}

function GroupLine({ place, name }: { place: string; name: string }) {
  return (
    <div className="bracket-line">
      <span className="bracket-place">{place}</span>
      {name ? (
        <span>
          {flagOf(name)} {name}
        </span>
      ) : (
        <span className="muted">TBD</span>
      )}
    </div>
  );
}

export default function LiveBracket({ initial }: { initial: Prediction }) {
  const [results, setResults] = useState<Prediction>(initial);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch('/api/admin/results', { cache: 'no-store' });
        const data = await res.json();
        if (active && data.results) {
          setResults(data.results);
          setUpdatedAt(new Date().toLocaleTimeString());
        }
      } catch {
        /* keep showing the last known bracket */
      }
    }

    const id = setInterval(load, 30_000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const live = hasResults(results);

  return (
    <>
      <div className="live-head">
        <span className="live-dot" />
        <strong>LIVE</strong>
        <span className="muted">
          Auto-updates every 30s
          {updatedAt ? ` · last checked ${updatedAt}` : ''}
        </span>
      </div>

      {!live && (
        <div className="banner warn">
          No results yet — this bracket fills in automatically as the
          tournament plays out.
        </div>
      )}

      <h2>Group stage</h2>
      <div className="groups">
        {GROUPS.map((g) => {
          const pick = results.groups[g.id] || { first: '', second: '' };
          return (
            <div key={g.id} className="group-card">
              <h3>Group {g.id}</h3>
              <GroupLine place="🥇" name={pick.first} />
              <GroupLine place="🥈" name={pick.second} />
            </div>
          );
        })}
      </div>

      <h2>Knockout</h2>
      <div className="panel">
        <div className="field">
          <label>Semi-finalists</label>
          <div className="bracket-row">
            {[0, 1, 2, 3].map((i) => (
              <TeamChip key={i} name={results.semifinalists[i] || ''} />
            ))}
          </div>
        </div>
        <div className="field">
          <label>Finalists</label>
          <div className="bracket-row">
            {[0, 1].map((i) => (
              <TeamChip key={i} name={results.finalists[i] || ''} />
            ))}
          </div>
        </div>
        <div className="field">
          <label>Champion</label>
          <div className="bracket-row">
            <TeamChip name={results.champion} champion />
          </div>
        </div>
      </div>
    </>
  );
}
