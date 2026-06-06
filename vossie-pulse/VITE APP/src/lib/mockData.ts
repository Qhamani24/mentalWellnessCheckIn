import { AppState, CheckIn, PointTransaction } from '../types';

export function generateMockState(currentState: AppState): AppState {
  const today = new Date();
  const mockCheckIns: CheckIn[] = [];
  const tagsPool = ['Academic Stress', 'Social Life', 'Sleep', 'Diet', 'Exercise', 'Burnout', 'Family', 'Money'];
  let points: PointTransaction[] = [];
  let totalPoints = 0;

  for (let i = 45; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    // Create a realistic pattern. We want a strong recent streak for the badges.
    if (i > 15 && Math.random() > 0.7) continue; 

    // Generate mood (weighting mostly towards 2-4)
    const moodMap = [1, 2, 2, 3, 3, 3, 4, 4, 4, 5];
    const mood = moodMap[Math.floor(Math.random() * moodMap.length)];
    
    const tags = [tagsPool[Math.floor(Math.random() * tagsPool.length)]];
    if (Math.random() > 0.5) tags.push(tagsPool[Math.floor(Math.random() * tagsPool.length)]);

    mockCheckIns.push({
      id: `mock_ci_${i}`,
      date: d.toISOString(),
      mood,
      tags: Array.from(new Set(tags)),
      reflection: Math.random() > 0.6 ? 'Mock reflection data to showcase how users interact with the app. Often reflecting on daily struggles and wins.' : undefined
    });

    const earned = 10;
    points.push({
      id: `mock_p_${i}`,
      date: d.toISOString(),
      reason: 'Daily Check-in',
      points: earned
    });
    totalPoints += earned;
  }

  // Also simulate completing challenges
  points.push({ id: 'cp_1', date: new Date().toISOString(), reason: 'Challenge: 5 Day Check-In Streak', points: 100 });

  return {
    ...currentState,
    checkIns: mockCheckIns,
    points,
    isOnboarded: true,
    challenges: currentState.challenges.map(c => c.id === 'c1' ? { ...c, completed: true, progress: 5 } : c),
    profile: currentState.profile || { name: 'Demo Student', house: 'LEFATSHE' },
    unlockedAchievements: ['first_checkin', 'first_reflection', 'streak_3', 'streak_10', 'week_1']
  };
}
