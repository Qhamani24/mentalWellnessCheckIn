import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { housesData } from '../lib/houses';

const campuses = [
  'East London', 'Midrand', 'Pretoria', 'Bedfordview', 
  'Durban (Umhlanga)', 'Mowbray (Cape Town)', 'Tygervalley (Cape Town)', 
  'Nelson Mandela Bay', 'Bloemfontein', 'Potchefstroom', 'Mbombela', 'Vaal'
];

export function Onboarding() {
  const { updateProfile } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [campus, setCampus] = useState('');
  const [house, setHouse] = useState('');

  const handleNext = () => {
    if (step === 0 && name.trim()) setStep(1);
    if (step === 1 && studentNumber.trim()) setStep(2);
    if (step === 2 && campus) setStep(3);
    if (step === 3 && house) {
      updateProfile({ name, studentNumber, campus, house });
    }
  };

  const steps = [
    {
      title: "Welcome to Pulse.",
      subtitle: "Your daily reflection companion. What should we call you?",
      content: (
        <input
          autoFocus
          type="text"
          placeholder="First name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full text-center text-4xl font-display font-black text-[#1D1D1F] bg-transparent border-b-2 border-gray-200 focus:border-purple-600 pb-2 outline-none transition-colors"
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
        />
      ),
      isValid: !!name.trim(),
    },
    {
      title: "Nice to meet you, " + name,
      subtitle: "What is your student number?",
      content: (
        <input
          autoFocus
          type="text"
          placeholder="e.g. 12345678"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
          className="w-full text-center text-4xl font-display font-black text-[#1D1D1F] bg-transparent border-b-2 border-gray-200 focus:border-purple-600 pb-2 outline-none transition-colors"
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
        />
      ),
      isValid: !!studentNumber.trim(),
    },
    {
      title: "Where are you studying?",
      subtitle: "Select your primary campus location.",
      content: (
        <div className="flex flex-col gap-3 w-full max-h-[40vh] overflow-y-auto px-1 pb-4" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {campuses.map(c => (
            <button
              key={c}
              onClick={() => { setCampus(c); setTimeout(() => setStep(3), 200); }}
              className={`p-4 rounded-[24px] text-lg font-bold transition-all ${
                campus === c ? 'bg-purple-600 text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      ),
      isValid: !!campus,
    },
    {
      title: "Join your House",
      subtitle: "Participate in wellbeing challenges and earn points together.",
      content: (
        <div className="grid grid-cols-2 gap-3 w-full max-h-[40vh] overflow-y-auto px-1 pb-4" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {housesData.map(h => (
            <button
              key={h.name}
              onClick={() => setHouse(h.name)}
              className={`aspect-square flex flex-col items-center justify-center gap-2 rounded-[32px] transition-all ${
                house === h.name ? 'bg-purple-600 text-white shadow-lg scale-95' : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${house === h.name ? 'bg-white/20' : `${h.bg} ${h.color}`}`}>
                 <h.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                 <span className="font-display font-bold text-sm tracking-wide">{h.name}</span>
                 <span className={`text-[10px] font-bold uppercase tracking-widest ${house === h.name ? 'text-white/80' : 'text-gray-400'}`}>{h.label}</span>
              </div>
            </button>
          ))}
        </div>
      ),
      isValid: !!house,
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen flex flex-col px-6 py-12">
      <div className="flex gap-2 w-full max-w-xs mx-auto mb-12">
        {steps.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i <= step ? 'bg-purple-600' : 'bg-gray-200'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="flex-1 flex flex-col justify-center items-center max-w-sm mx-auto w-full"
        >
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-8">
            <Heart className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-display font-black text-center mb-3 text-[#1D1D1F]">{currentStep.title}</h1>
          <p className="text-gray-500 font-medium text-center mb-12 text-lg">{currentStep.subtitle}</p>
          
          {currentStep.content}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 pb-8 max-w-sm mx-auto w-full">
        <Button 
          size="lg" 
          onClick={handleNext} 
          disabled={!currentStep.isValid}
          className="w-full text-lg"
        >
          {step === steps.length - 1 ? "Let's Begin" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
