export type MoodValue = 1 | 2 | 3 | 4 | 5;

export interface UserProfile {
  name: string;
  studentNumber: string;
  campus: string;
  house: string;
}

export interface CheckIn {
  id: string;
  date: string; // ISO format
  mood: MoodValue;
  tags: string[];
  reflection?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  target?: number;
  progress?: number;
  completed: boolean;
}

export interface PointTransaction {
  id: string;
  date: string;
  reason: string;
  points: number;
}

export interface AppState {
  profile: UserProfile | null;
  checkIns: CheckIn[];
  points: PointTransaction[];
  challenges: Challenge[];
  unlockedAchievements: string[];
  isOnboarded: boolean;
  lastChallengeDate?: string;
}
