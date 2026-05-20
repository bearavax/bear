export type Team = { name: string; flag: string };
export type Group = { id: string; teams: string[] };

export const TOURNAMENT_NAME = 'FIFA World Cup 2026';

/**
 * The 2026 World Cup features 48 teams in 12 groups of four.
 *
 * The line-up below is an EDITABLE PLACEHOLDER draw. Once the official draw
 * is known, just update the names here and in GROUPS — every page, the
 * prediction form and the scoring all read from this single file.
 */
export const TEAMS: Team[] = [
  { name: 'Mexico', flag: '🇲🇽' },
  { name: 'Croatia', flag: '🇭🇷' },
  { name: 'Ecuador', flag: '🇪🇨' },
  { name: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Belgium', flag: '🇧🇪' },
  { name: 'Morocco', flag: '🇲🇦' },
  { name: 'Qatar', flag: '🇶🇦' },
  { name: 'USA', flag: '🇺🇸' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Tunisia', flag: '🇹🇳' },
  { name: 'Panama', flag: '🇵🇦' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Senegal', flag: '🇸🇳' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Denmark', flag: '🇩🇰' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Ghana', flag: '🇬🇭' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'Cameroon', flag: '🇨🇲' },
  { name: 'Costa Rica', flag: '🇨🇷' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Uruguay', flag: '🇺🇾' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Serbia', flag: '🇷🇸' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'Iran', flag: '🇮🇷' },
  { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Colombia', flag: '🇨🇴' },
  { name: 'Egypt', flag: '🇪🇬' },
  { name: 'New Zealand', flag: '🇳🇿' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { name: 'Algeria', flag: '🇩🇿' },
  { name: 'Jordan', flag: '🇯🇴' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Austria', flag: '🇦🇹' },
  { name: 'Ivory Coast', flag: '🇨🇮' },
  { name: 'Peru', flag: '🇵🇪' },
  { name: 'Norway', flag: '🇳🇴' },
  { name: 'Ukraine', flag: '🇺🇦' },
  { name: 'Turkey', flag: '🇹🇷' },
  { name: 'Chile', flag: '🇨🇱' },
];

export const GROUPS: Group[] = [
  { id: 'A', teams: ['Mexico', 'Croatia', 'Ecuador', 'Saudi Arabia'] },
  { id: 'B', teams: ['Canada', 'Belgium', 'Morocco', 'Qatar'] },
  { id: 'C', teams: ['USA', 'Netherlands', 'Tunisia', 'Panama'] },
  { id: 'D', teams: ['Argentina', 'Poland', 'Senegal', 'South Korea'] },
  { id: 'E', teams: ['France', 'Denmark', 'Australia', 'Ghana'] },
  { id: 'F', teams: ['Brazil', 'Switzerland', 'Cameroon', 'Costa Rica'] },
  { id: 'G', teams: ['Spain', 'Uruguay', 'Japan', 'Serbia'] },
  { id: 'H', teams: ['Portugal', 'Sweden', 'Nigeria', 'Iran'] },
  { id: 'I', teams: ['England', 'Colombia', 'Egypt', 'New Zealand'] },
  { id: 'J', teams: ['Italy', 'Wales', 'Algeria', 'Jordan'] },
  { id: 'K', teams: ['Germany', 'Austria', 'Ivory Coast', 'Peru'] },
  { id: 'L', teams: ['Norway', 'Ukraine', 'Turkey', 'Chile'] },
];

/** Predictions can be edited until this moment (tournament kickoff). */
export const PREDICTIONS_DEADLINE = '2026-06-11T16:00:00Z';

const flagMap = new Map(TEAMS.map((t) => [t.name, t.flag]));

export function flagOf(name: string): string {
  return flagMap.get(name) || '🏳️';
}

export function allTeamNames(): string[] {
  return TEAMS.map((t) => t.name);
}

/** Server-only: whether predictions are still open for editing. */
export function predictionsOpen(): boolean {
  if (process.env.PREDICTIONS_LOCKED === 'true') return false;
  return Date.now() < new Date(PREDICTIONS_DEADLINE).getTime();
}
