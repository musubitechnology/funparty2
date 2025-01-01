export interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
}

export interface Quester {
  id: string;
  name: string;
  nickname: string;
  points: number;
}

export interface CompletedQuest {
  questId: string;
  participants: string[];
  timestamp: number;
}