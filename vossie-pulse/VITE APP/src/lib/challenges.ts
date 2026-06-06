import { Challenge } from '../types';
import { calculateStreak } from '../utils';
import { CheckIn } from '../types';

const challengePool = [
  { id: 'pool_1', title: 'Deep Reflection', description: 'Add a written note to your daily check-in.', points: 50 },
  { id: 'pool_2', title: 'Explore Support', description: 'Review the campus counseling resources in the Support tab.', points: 50 },
  { id: 'pool_3', title: 'House Pride', description: 'Check your current House standing on the Houses tab.', points: 30 },
  { id: 'pool_4', title: 'History Review', description: 'Take a look at your past check-ins in the History tab.', points: 30 },
  { id: 'pool_5', title: 'Update Profile', description: 'Review your profile settings and make sure they are up to date.', points: 20 },
];

export function generateDailyChallenges(name: string, checkIns: CheckIn[]): Challenge[] {
  const today = new Date().toDateString();
  const seedStr = `${today}-${name}`;
  
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Create a seeded RNG
  const seededRandom = () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
  
  const pool = [...challengePool].sort(() => seededRandom() - 0.5);
  const selected = pool.slice(0, 2);
  
  const streak = calculateStreak(checkIns);
  
  const challenges: Challenge[] = [
    { 
      id: 'c1', 
      title: '5 Day Check-In Streak', 
      description: 'Complete 5 consecutive daily check-ins.', 
      points: 100, 
      target: 5, 
      progress: Math.min(streak, 5), 
      completed: streak >= 5 
    },
    { ...selected[0], id: selected[0].id, completed: false }, // we use original id (pool_1 etc)
    { ...selected[1], id: selected[1].id, completed: false }
  ];
  
  return challenges;
}
