import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, CheckIn, PointTransaction, UserProfile, Challenge, MoodValue } from '../types';
import { calculateStreak } from '../utils';
import { generateDailyChallenges } from '../lib/challenges';

export type ViewState = 'onboarding' | 'dashboard' | 'checkin' | 'history' | 'houses' | 'support' | 'profile';

interface AppContextType {
  state: AppState;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  updateProfile: (profile: UserProfile) => void;
  addCheckIn: (checkIn: Omit<CheckIn, 'id'>) => void;
  addPoints: (points: number, reason: string) => void;
  completeChallenge: (challengeId: string) => void;
  resetApp: () => void;
  loadState: (newState: AppState) => void;
}

const defaultChallenges: Challenge[] = [
  { id: 'c1', title: '5 Day Check-In Streak', description: 'Complete 5 consecutive daily check-ins.', points: 100, target: 5, progress: 0, completed: false },
  { id: 'pool_1', title: 'Deep Reflection', description: 'Add a written note to your daily check-in.', points: 50, completed: false },
  { id: 'pool_2', title: 'Explore Support', description: 'Review the campus counseling resources in the Support tab.', points: 50, completed: false },
];

const defaultState: AppState = {
  profile: null,
  checkIns: [],
  points: [],
  challenges: defaultChallenges,
  unlockedAchievements: [],
  isOnboarded: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('pulse_app_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.challenges) parsed.challenges = defaultChallenges;
        if (!parsed.unlockedAchievements) parsed.unlockedAchievements = [];
        return parsed;
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  const [currentView, setCurrentView] = useState<ViewState>(state.isOnboarded ? 'dashboard' : 'onboarding');

  useEffect(() => {
    localStorage.setItem('pulse_app_state', JSON.stringify(state));
  }, [state]);

  // Handle daily challenge generation
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastChallengeDate !== today && state.isOnboarded && state.profile) {
      const newChallenges = generateDailyChallenges(state.profile.name, state.checkIns);
      setState(s => ({ ...s, challenges: newChallenges, lastChallengeDate: today }));
    }
  }, [state.lastChallengeDate, state.isOnboarded, state.profile, state.checkIns]);

  // Handle achievements
  useEffect(() => {
    if (!state.isOnboarded) return;
    
    let newUnlocked = [...state.unlockedAchievements];
    const streak = calculateStreak(state.checkIns);
    const hasReflection = state.checkIns.some(c => c.reflection && c.reflection.trim().length > 0);
    const checkinCount = state.checkIns.length;
    
    const checkUnlock = (id: string, condition: boolean) => {
      if (condition && !newUnlocked.includes(id)) {
        newUnlocked.push(id);
      }
    };
    
    checkUnlock('first_checkin', checkinCount >= 1);
    checkUnlock('first_reflection', hasReflection);
    checkUnlock('streak_3', streak >= 3);
    checkUnlock('week_1', checkinCount >= 7);
    checkUnlock('streak_10', streak >= 10);
    
    if (newUnlocked.length > state.unlockedAchievements.length) {
      setState(s => ({ ...s, unlockedAchievements: newUnlocked }));
    }
  }, [state.checkIns, state.isOnboarded, state.unlockedAchievements]);

  const setView = (view: ViewState) => {
    if (view === 'houses') completeChallenge('pool_3');
    if (view === 'history') completeChallenge('pool_4');
    if (view === 'profile') completeChallenge('pool_5');
    setCurrentView(view);
  };

  const updateProfile = (profile: UserProfile) => {
    setState(s => ({ ...s, profile, isOnboarded: true }));
    setCurrentView('dashboard');
  };

  const addCheckIn = (checkIn: Omit<CheckIn, 'id'>) => {
    const newCheckIn: CheckIn = {
      ...checkIn,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    setState(s => {
      const newCheckIns = [...s.checkIns, newCheckIn];
      
      // Calculate current streak
      const streak = calculateStreak(newCheckIns);

      // Update challenge c1 progress
      const newChallenges = s.challenges.map(c => {
        if (c.id === 'c1' && !c.completed) {
          const newProgress = Math.min(streak, c.target || 5);
          const completed = newProgress >= (c.target || 5);
          if (completed) {
            // we should technically grant points here but doing in state is tricky, 
            // we will grant points below
          }
          return { ...c, progress: newProgress, completed };
        }
        return c;
      });

      return { ...s, checkIns: newCheckIns, challenges: newChallenges };
    });
    
    // Add points for checking in
    addPoints(10, 'Daily Check-in');
    
    // Check if c1 was completed by this checkin
    setTimeout(() => {
      setState(s => {
        const c1 = s.challenges.find(c => c.id === 'c1');
        if (c1 && c1.completed) {
          // If we haven't given points for it yet (we can check by checking point history but this hacky timeout is okay for prototype)
          const alreadyGiven = s.points.some(p => p.reason === `Completed Challenge: ${c1.title}`);
          if (!alreadyGiven) {
            addPoints(c1.points, `Completed Challenge: ${c1.title}`);
          }
        }
        return s;
      });
      
      if (checkIn.reflection && checkIn.reflection.trim().length > 0) {
        completeChallenge('pool_1');
      }
    }, 100);
  };

  const addPoints = (points: number, reason: string) => {
    const transaction: PointTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      reason,
      points,
    };
    setState(s => ({ ...s, points: [...s.points, transaction] }));
  };

  const completeChallenge = (challengeId: string) => {
    setState(s => {
      const challenge = s.challenges.find(c => c.id === challengeId);
      if (!challenge || challenge.completed) return s;

      const newChallenges = s.challenges.map(c => 
        c.id === challengeId ? { ...c, completed: true } : c
      );

      return { ...s, challenges: newChallenges };
    });
    
    const challenge = state.challenges.find(c => c.id === challengeId);
    if (challenge) {
      addPoints(challenge.points, `Challenge: ${challenge.title}`);
    }
  };

  const resetApp = () => {
    setState(defaultState);
    setCurrentView('onboarding');
  };

  const loadState = (newState: AppState) => {
    setState(newState);
  };

  return (
    <AppContext.Provider value={{ state, currentView, setView, updateProfile, addCheckIn, addPoints, completeChallenge, resetApp, loadState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
