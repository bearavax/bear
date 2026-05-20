export type GroupPick = {
  first: string;
  second: string;
};

export type Prediction = {
  groups: Record<string, GroupPick>;
  semifinalists: string[];
  finalists: string[];
  champion: string;
};

export type User = {
  id: number;
  email: string;
  display_name: string;
  created_at: string;
};

export type LeaderboardRow = {
  rank: number;
  name: string;
  total: number;
  correctChampion: boolean;
};
