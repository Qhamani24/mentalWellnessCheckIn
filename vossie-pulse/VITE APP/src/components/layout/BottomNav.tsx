import React from 'react';
import { useApp, ViewState } from '../../context/AppContext';
import { Home, LineChart, Trophy, HeartHandshake, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export function BottomNav() {
  const { currentView, setView } = useApp();

  const navItems: { id: ViewState; icon: React.ReactNode; label: string }[] = [
    { id: 'dashboard', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { id: 'history', icon: <LineChart className="w-5 h-5" />, label: 'History' },
    { id: 'houses', icon: <Trophy className="w-5 h-5" />, label: 'Houses' },
    { id: 'support', icon: <HeartHandshake className="w-5 h-5" />, label: 'Support' },
    { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Me' },
  ];

  if (currentView === 'onboarding' || currentView === 'checkin') {
    return null; // hide on full screen views
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-4 pt-2 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] z-40" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
      <div className="max-w-md mx-auto flex justify-between items-center h-16">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-colors",
                isActive ? "text-purple-600" : "text-gray-300 hover:text-gray-400"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-0 bg-purple-50 rounded-2xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {item.icon}
              <span className="text-[10px] font-bold mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
