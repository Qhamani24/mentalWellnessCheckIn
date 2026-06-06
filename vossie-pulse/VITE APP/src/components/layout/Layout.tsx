import React from 'react';
import { useApp } from '../../context/AppContext';
import { BottomNav } from './BottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { Onboarding } from '../../pages/Onboarding';
import { Dashboard } from '../../pages/Dashboard';
import { CheckInFlow } from '../../pages/CheckInFlow';
import { History } from '../../pages/History';
import { Houses } from '../../pages/Houses';
import { Support } from '../../pages/Support';
import { Profile } from '../../pages/Profile';

export function Layout() {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'onboarding': return <Onboarding />;
      case 'dashboard': return <Dashboard />;
      case 'checkin': return <CheckInFlow />;
      case 'history': return <History />;
      case 'houses': return <Houses />;
      case 'support': return <Support />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans selection:bg-purple-200">
      <AnimatePresence mode="wait">
        <motion.main
          key={currentView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="pb-24 max-w-lg mx-auto w-full min-h-screen relative"
        >
          {renderView()}
        </motion.main>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
