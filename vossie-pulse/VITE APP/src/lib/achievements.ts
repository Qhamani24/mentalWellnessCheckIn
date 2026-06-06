import { Award, Flame, CalendarDays, Book, Compass, Flag } from 'lucide-react';

export const achievementsData = [
  { id: 'first_checkin', title: 'First Step', description: 'Log your first check-in.', icon: Flag, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'first_reflection', title: 'Journalist', description: 'Write your first reflection.', icon: Book, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'streak_3', title: 'Momentum', description: 'Complete a 3-day streak.', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'streak_10', title: 'Dedication', description: 'Maintain a 10-day streak.', icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { id: 'week_1', title: 'Consistent', description: 'Complete your first week of check-ins (7 total).', icon: CalendarDays, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];
