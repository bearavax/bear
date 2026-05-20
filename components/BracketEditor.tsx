'use client';

import { GROUPS, TEAMS, flagOf } from '@/data/tournament';
import type { Prediction } from '@/lib/types';

type Props = {
  value: Prediction;
  onChange: (next: Prediction) => void;
  disabled?: boolean;
};

function TeamSelect({
  value,
  options,
  placeholder,
  disabled,
  onChange,
}: {
  value: string;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <select
      className="team-select"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((name) => (
        <option key={name} value={name}>
          {flagOf(name)} {name}
        </option>
      ))}
    </select>
  );
}

const ALL_TEAMS = TEAMS.map((t) => t.name);

export default function BracketEditor({ value, onChange, disabled }: Props) {
  function setGroup(gid: string, slot: 'first' | 'second', team: string) {
    const current = value.groups[gid] || { first: '', second: '' };
    const next = { ...current, [slot]: team };
    if (slot === 'first' && next.second === team) next.second = '';
    if (slot === 'second' && next.first === team) next.first = '';
    onChange({ ...value, groups: { ...value.groups, [gid]: next } });
  }

  function setSemifinalist(index: number, team: string) {
    const semifinalists = [...value.semifinalists];
    semifinalists[index] = team;
    onChange({ ...value, semifinalists });
  }

  function setFinalist(index: number, team: string) {
    const finalists = [...value.finalists];
    finalists[index] = team;
    onChange({ ...value, finalists });
  }

  const chosenSemis = value.semifinalists.filter(Boolean);
  const finalistPool = chosenSemis.length >= 2 ? chosenSemis : ALL_TEAMS;

  const chosenFinalists = value.finalists.filter(Boolean);
  const championPool = chosenFinalists.length >= 1 ? chosenFinalists : ALL_TEAMS;

  return (
    <div>
      <h2>Group stage — pick who finishes 1st &amp; 2nd</h2>
      <div className="groups">
        {GROUPS.map((g) => {
          const pick = value.groups[g.id] || { first: '', second: '' };
          return (
            <div key={g.id} className="group-card">
              <h3>Group {g.id}</h3>
              <div className="field">
                <label>Winner</label>
                <TeamSelect
                  value={pick.first}
                  options={g.teams.filter((t) => t !== pick.second)}
                  placeholder="Pick winner…"
                  disabled={disabled}
                  onChange={(v) => setGroup(g.id, 'first', v)}
                />
              </div>
              <div className="field">
                <label>Runner-up</label>
                <TeamSelect
                  value={pick.second}
                  options={g.teams.filter((t) => t !== pick.first)}
                  placeholder="Pick runner-up…"
                  disabled={disabled}
                  onChange={(v) => setGroup(g.id, 'second', v)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <h2>Semi-finalists — pick the final 4</h2>
      <div className="knockout">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="field">
            <label>Semi-finalist {i + 1}</label>
            <TeamSelect
              value={value.semifinalists[i] || ''}
              options={ALL_TEAMS.filter(
                (t) =>
                  !value.semifinalists.some((s, j) => j !== i && s === t),
              )}
              placeholder="Pick a team…"
              disabled={disabled}
              onChange={(v) => setSemifinalist(i, v)}
            />
          </div>
        ))}
      </div>

      <h2>Finalists — pick the 2 that reach the final</h2>
      <div className="knockout">
        {[0, 1].map((i) => (
          <div key={i} className="field">
            <label>Finalist {i + 1}</label>
            <TeamSelect
              value={value.finalists[i] || ''}
              options={finalistPool.filter(
                (t) => !value.finalists.some((s, j) => j !== i && s === t),
              )}
              placeholder="Pick a finalist…"
              disabled={disabled}
              onChange={(v) => setFinalist(i, v)}
            />
          </div>
        ))}
      </div>

      <h2>Champion — who lifts the trophy? 🏆</h2>
      <div className="knockout">
        <div className="field">
          <label>World Cup winner</label>
          <TeamSelect
            value={value.champion}
            options={championPool}
            placeholder="Pick the champion…"
            disabled={disabled}
            onChange={(v) => onChange({ ...value, champion: v })}
          />
        </div>
      </div>
    </div>
  );
}
