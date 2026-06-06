import { CheckIn } from './types';

export const calculateStreak = (checkIns: CheckIn[]) => {
  if (checkIns.length === 0) return 0;
  
  // Sort descending by date
  const sorted = [...checkIns].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const firstCheckInDate = new Date(sorted[0].date);
  firstCheckInDate.setHours(0,0,0,0);

  // If the last check-in is not today or yesterday, streak is 0
  const diffDaysFirst = Math.floor((currentDate.getTime() - firstCheckInDate.getTime()) / (1000 * 3600 * 24));
  if (diffDaysFirst > 1) return 0;

  let expectedDate = firstCheckInDate.getTime();

  for (let i = 0; i < sorted.length; i++) {
    const checkInDate = new Date(sorted[i].date);
    checkInDate.setHours(0, 0, 0, 0);

    if (checkInDate.getTime() === expectedDate) {
      streak++;
      expectedDate -= 24 * 60 * 60 * 1000;
    } else if (checkInDate.getTime() > expectedDate) {
      continue; // Multiple check-ins on the same day
    } else {
      break;
    }
  }
  
  return streak;
};
