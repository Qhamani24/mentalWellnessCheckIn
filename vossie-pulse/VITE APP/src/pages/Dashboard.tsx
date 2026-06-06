import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { Trophy, Flame, Plus, Sparkles, Smile, Check } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { calculateStreak } from '../utils';
import { achievementsData } from '../lib/achievements';

const quotes = [
  "Every journey begins with a single step.",
  "You are capable of amazing things.",
  "Small steps every day.",
  "Believe you can and you're halfway there.",
  "Be kind to your mind.",
  "Breathe in courage, exhale fear.",
  "Progress, not perfection.",
  "You belong right here.",
  "Find joy in the ordinary."
];

function getDailyQuote(name: string) {
  const dateStr = new Date().toDateString();
  const seedStr = `${dateStr}-${name}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return quotes[Math.abs(hash) % quotes.length];
}

export function Dashboard() {
  const { state, setView, completeChallenge } = useApp();
  const [insight, setInsight] = useState<string>('Reflecting on your days is a step towards better wellbeing.');

  const hasCheckedInToday = state.checkIns.some(c => isToday(new Date(c.date)));
  
  const totalPoints = state.points.reduce((acc, curr) => acc + curr.points, 0);

  // calculate streak
  const streak = calculateStreak(state.checkIns);

  useEffect(() => {
    // Fetch insight
    if (state.checkIns.length > 0) {
      fetch('/api/insight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile: state.profile,
          checkIns: state.checkIns
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.insight) setInsight(data.insight);
      })
      .catch(() => {});
    }
  }, [state.checkIns, state.profile]);

  return (
    <div className="px-6 py-8 flex flex-col gap-6">
      <header className="flex justify-between items-center py-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-0.5">Pulse</h1>
          <p className="text-sm text-gray-800 font-bold mb-1">{state.profile?.name || 'User'} 👋</p>
          <p className="text-xs text-gray-500 font-medium">"{getDailyQuote(state.profile?.name || 'User')}"</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-pink-300 border-2 border-white shadow-md self-start"></div>
      </header>

      {!hasCheckedInToday ? (
        <div className="mt-2 p-6 bg-[#FDF4FF] rounded-[32px] border-2 border-[#F5D0FE] relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-purple-900 mb-1">How are you today?</h2>
            <p className="text-xs text-purple-600 mb-4 font-medium">Your daily check-in awaits.</p>
            <Button size="sm" className="bg-purple-600 text-white shadow-lg" onClick={() => setView('checkin')}>
              Start Check-in
            </Button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-200 rounded-full blur-2xl opacity-60"></div>
        </div>
      ) : (
        <div className="mt-2 p-6 bg-[#FDF4FF] rounded-[32px] border-2 border-[#F5D0FE] relative overflow-hidden flex flex-col items-center text-center">
          <div className="relative z-10 w-full">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 mx-auto shadow-sm text-2xl">
              ✨
            </div>
            <h2 className="text-lg font-bold text-purple-900 mb-1">You're all checked in!</h2>
            <p className="text-xs text-purple-600 font-medium">Amazing job prioritizing your wellbeing today.</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-200 rounded-full blur-2xl opacity-60"></div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-white rounded-[28px] border border-gray-100 shadow-sm">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Current Streak</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-orange-500">{streak}</span>
            <span className="text-xl">🔥</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-[28px] border border-gray-100 shadow-sm">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Your Points</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-500">{totalPoints}</span>
            <span className="text-xl">✨</span>
          </div>
        </div>
      </div>

      {state.unlockedAchievements.length > 0 && (
        <section className="mt-6">
          <h3 className="text-sm font-bold text-[#1D1D1F] mb-4 px-1">House Achievements</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar px-1 -mx-2 pl-2">
            {state.unlockedAchievements.map(id => {
              const badge = achievementsData.find(a => a.id === id);
              if (!badge) return null;
              const Icon = badge.icon;
              return (
                <div key={id} className="snap-start shrink-0 w-28 bg-white border border-gray-100 rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
                  <div className={`absolute -right-4 -top-4 w-16 h-16 ${badge.bg} rounded-full blur-xl opacity-50`}></div>
                  <div className={`w-12 h-12 rounded-full ${badge.bg} ${badge.color} flex items-center justify-center mb-3 relative z-10`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-[#1D1D1F] mb-1 relative z-10">{badge.title}</h4>
                  <p className="text-[10px] text-gray-500 font-medium leading-tight relative z-10">{badge.description}</p>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <div className="mt-4 p-6 bg-[#ECFDF5] rounded-[32px] border border-emerald-100 mb-4">
        <h3 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Pulse Insight
        </h3>
        <p className="text-sm text-emerald-800 leading-relaxed font-medium whitespace-pre-wrap">
          {insight}
        </p>
      </div>

      <section className="p-6 bg-white rounded-[32px] shadow-sm border border-blue-50 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="flex items-center justify-between mb-5 relative z-10">
           <h3 className="text-sm font-bold text-[#1D1D1F]">Daily Challenges</h3>
           <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-1 rounded-full">{state.challenges.filter(c => c.completed).length}/{state.challenges.length} Done</span>
        </div>
        <div className="space-y-3 relative z-10">
          {state.challenges.map((challenge, index) => (
            <div key={challenge.id} className={`flex items-start gap-4 p-4 rounded-[24px] border transition-all ${challenge.completed ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-gray-100 hover:border-blue-100/50 hover:bg-gray-50/50 shadow-sm'}`}>
              <div className={`w-10 h-10 flex-shrink-0 rounded-[14px] flex items-center justify-center shadow-sm font-bold text-lg ${challenge.completed ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400 border border-gray-200/50'}`}>
                {challenge.completed ? <Check className="w-5 h-5" /> : (index + 1)}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h4 className={`text-sm font-bold truncate ${challenge.completed ? 'text-gray-400 line-through' : 'text-[#1D1D1F]'}`}>{challenge.title}</h4>
                    <p className={`text-xs mt-0.5 line-clamp-2 ${challenge.completed ? 'text-gray-400 ml-0.5' : 'text-gray-500 ml-0.5'}`}>{challenge.description}</p>
                  </div>
                  <div className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg ${challenge.completed ? 'bg-gray-100 text-gray-400' : 'bg-orange-50 text-orange-600'}`}>
                    +{challenge.points} pts
                  </div>
                </div>
                {challenge.target && !challenge.completed && (
                  <div className="mt-4 w-full">
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-1.5 uppercase tracking-wider">
                      <span>Progress</span>
                      <span>{challenge.progress || 0} / {challenge.target}</span>
                    </div>
                    <div className="w-full bg-gray-100/80 h-2 rounded-full overflow-hidden p-0.5">
                      <div className="bg-blue-400 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${((challenge.progress || 0) / challenge.target) * 100}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
