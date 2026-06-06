import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, AlertTriangle, Phone } from 'lucide-react';
import { MoodValue } from '../types';

const moodConfig = {
  1: { emoji: '😫', label: 'Very Difficult', color: 'bg-[#FF8A8A]', bg: 'bg-red-50' },
  2: { emoji: '😕', label: 'Difficult', color: 'bg-[#FFB37C]', bg: 'bg-orange-50' },
  3: { emoji: '😐', label: 'Neutral', color: 'bg-[#FFD97D]', bg: 'bg-yellow-50' },
  4: { emoji: '🙂', label: 'Good', color: 'bg-[#A7D3A6]', bg: 'bg-green-50' },
  5: { emoji: '😁', label: 'Great', color: 'bg-[#6BCB77]', bg: 'bg-emerald-50' },
};

const availableTags = [
  'Academic Stress', 'Assignments', 'Exams', 'Burnout',
  'Financial Pressure', 'Family', 'Relationships', 'Motivation',
  'Physical Health', 'Social Life', 'Career Concerns', 'Personal Growth'
];

export function CheckInFlow() {
  const { setView, addCheckIn } = useApp();
  const [step, setStep] = useState(0);
  
  const [mood, setMood] = useState<MoodValue>(3);
  const [tags, setTags] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');

  const emergencyKeywords = ['suicide', 'kill myself', 'end it all', 'hopeless', 'hurt myself', 'self harm', 'die', 'abuse', 'want to end things'];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      const text = reflection.toLowerCase();
      const isEmergency = emergencyKeywords.some(word => text.includes(word));

      // Save checkin
      addCheckIn({
        date: new Date().toISOString(),
        mood,
        tags,
        reflection: reflection.trim() || undefined
      });
      
      if (isEmergency) {
        setStep(4);
      } else {
        setStep(3); // Celebration step
        setTimeout(() => setView('dashboard'), 2000);
      }
    }
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const currentMood = moodConfig[mood as keyof typeof moodConfig];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-700 ${currentMood.bg}`}>
      <div className="flex justify-between items-center p-6 pb-0">
        <div className="flex gap-2 items-center flex-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 max-w-[40px] ${i <= step && step < 3 ? 'bg-zinc-900' : 'bg-black/10'}`} />
          ))}
        </div>
        <button onClick={() => setView('dashboard')} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors ml-4">
          <X className="w-5 h-5 text-zinc-900" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col items-center justify-center p-6">
            <h2 className="text-3xl font-display font-black text-[#1D1D1F] mb-12 text-center">How are you feeling today?</h2>
            
            <div className="flex justify-between w-full max-w-sm gap-2 mb-16">
              {([1, 2, 3, 4, 5] as MoodValue[]).map((val) => {
                const config = moodConfig[val];
                const isSelected = mood === val;
                return (
                  <motion.button
                    key={val}
                    onClick={() => setMood(val)}
                    whileHover={{ scale: isSelected ? 1.15 : 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ 
                      scale: isSelected ? 1.15 : 0.95,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`relative flex flex-col items-center justify-center flex-1 aspect-[3/4] rounded-[24px] transition-colors duration-300 ${
                      isSelected 
                        ? 'bg-white shadow-xl z-10' 
                        : 'bg-white/40 hover:bg-white/60 grayscale-[50%] hover:grayscale-0 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <motion.span 
                      animate={{ scale: isSelected ? 1.1 : 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="text-4xl"
                    >
                      {config.emoji}
                    </motion.span>
                  </motion.button>
                )
              })}
            </div>

            <div className="flex flex-col items-center mb-16 h-12">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={mood}
                  initial={{ y: 10, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  exit={{ y: -10, opacity: 0 }}
                  className={`px-6 py-2 rounded-full text-lg font-bold shadow-sm ${currentMood.color} text-gray-900`}
                >
                  {currentMood.label}
                </motion.div>
              </AnimatePresence>
            </div>

            <Button size="lg" className="w-full mt-auto mb-8" onClick={handleNext}>Continue</Button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col p-6 pt-12">
            <h2 className="text-3xl font-display font-medium text-zinc-900 mb-2">What is contributing?</h2>
            <p className="text-zinc-500 mb-8">Select all that apply.</p>
            
            <div className="flex flex-wrap gap-3 mb-12">
              {availableTags.map(tag => {
                const isSelected = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-3 rounded-full text-sm font-bold transition-all ${
                      isSelected ? 'bg-purple-600 text-white shadow-md scale-105' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>

            <Button size="lg" className="w-full mt-auto mb-8" onClick={handleNext}>
              {tags.length > 0 ? 'Continue' : 'Skip'}
            </Button>
          </motion.div>
        )}

        {step === 2 && (() => {
          const getPrompt = () => {
            if (mood <= 2 && tags.includes('Academic Stress')) {
              return "What specific academic task is causing the most stress right now?";
            }
            if (mood >= 4 && tags.includes('Social Life')) {
              return "What made your social interactions so positive today?";
            }
            if (mood <= 2 && tags.includes('Burnout')) {
               return "What is one small thing you could do to rest today?";
            }
            if (mood >= 4 && tags.includes('Personal Growth')) {
              return "What did you learn or achieve today that you are proud of?";
            }
            if (mood <= 3) {
              return "Is there anything specific weighing on your mind today?";
            }
            return "Jot down a few thoughts about your day...";
          };
          const dynamicPrompt = getPrompt();
          
          return (
          <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col p-6 pt-12">
            <h2 className="text-3xl font-display font-black text-[#1D1D1F] mb-2">What's on your mind?</h2>
            <p className="text-gray-500 mb-8 font-medium">Optional space for reflection.</p>
            
            <textarea
              autoFocus
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder={dynamicPrompt}
              className="flex-1 w-full p-6 bg-white rounded-[32px] border border-gray-200 text-lg resize-none outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400 mb-12"
            />

            <Button size="lg" className="w-full mt-auto mb-8" onClick={handleNext}>Save Check-in</Button>
          </motion.div>
        )})()}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-24 h-24 rounded-full bg-green-500 text-white flex items-center justify-center mb-6 shadow-xl">
              <Check className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-display font-medium text-zinc-900 mb-2 text-center">Check-in Complete</h2>
            <p className="text-green-700 font-medium">+10 House Points Earned</p>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-24 h-24 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-6 shadow-xl">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-display font-black text-red-600 mb-4 text-center">We care about you</h2>
            <p className="text-gray-700 font-medium text-center mb-8 px-2">
              It sounds like you are going through a very difficult time right now. You are not alone, and there is support available immediately.
            </p>
            <div className="w-full max-w-sm space-y-4 mb-8">
              <a href="tel:0800567567" className="flex items-center justify-center gap-3 w-full bg-red-600 text-white font-bold h-14 rounded-full shadow-lg hover:bg-red-700 transition">
                <Phone className="w-5 h-5" /> Call SADAG (0800 567 567)
              </a>
              <button onClick={() => setView('support')} className="flex items-center justify-center gap-3 w-full bg-white text-red-600 border border-red-200 font-bold h-14 rounded-full shadow-sm hover:bg-red-50 transition">
                Campus Counseling
              </button>
            </div>
            <button onClick={() => setView('dashboard')} className="text-gray-500 font-bold text-sm underline mt-4">
              Return to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
