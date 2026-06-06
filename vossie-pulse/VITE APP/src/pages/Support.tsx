import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Phone, MessageCircle, ExternalLink, ShieldAlert, HeartHandshake, University, Heart, X, FileText } from 'lucide-react';
import { MoodValue } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export function Support() {
  const { state, completeChallenge } = useApp();
  const [activeModal, setActiveModal] = useState<'counseling' | 'stress' | null>(null);

  // Escalation Logic
  // Check if the last 3 checkins were "Difficult" (1 or 2)
  const recentCheckIns = state.checkIns.slice(-3);
  const needsEscalation = recentCheckIns.length >= 3 && recentCheckIns.every(c => c.mood <= 2);

  const handleOpenModal = (modal: 'counseling' | 'stress') => {
    setActiveModal(modal);
    completeChallenge('pool_2');
  };

  return (
    <div className="px-6 py-8 flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-[#1D1D1F] mb-2">Support & Resources</h1>
        <p className="text-sm font-medium text-gray-500">You don't have to navigate challenging times alone. Reach out if you need someone to talk to.</p>
      </header>

      {needsEscalation && (
        <div className="p-6 bg-white border-2 border-orange-200 rounded-[32px] shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-100 rounded-full blur-2xl opacity-60"></div>
          <div className="flex gap-4 relative z-10">
             <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-[18px] text-orange-600 flex-shrink-0">
               <HeartHandshake className="w-6 h-6" />
             </div>
             <div>
               <h3 className="font-bold text-[#1D1D1F] text-lg mb-1 leading-tight">We noticed it's been a tough few days.</h3>
               <p className="text-gray-500 mb-4 text-xs font-medium leading-relaxed">
                 You've reported feeling down recently. Consider reaching out to a mentor, friend, or a campus counselor.
               </p>
               <Button onClick={() => handleOpenModal('counseling')} className="bg-orange-600 text-white font-bold h-10 px-4 py-2 w-full text-sm shadow-md rounded-[20px]">
                  Connect with a Counselor
               </Button>
             </div>
          </div>
        </div>
      )}

      <section>
        <h2 className="text-[10px] font-bold tracking-widest text-[#1D1D1F] uppercase mb-3 px-1 mt-2">Get Support & Self-Care Tips</h2>
        <div className="grid gap-3">
           <button onClick={() => handleOpenModal('counseling')} className="w-full text-left flex items-center justify-between p-4 bg-white rounded-[24px] border border-gray-100 shadow-sm hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-[18px]">
                   <University className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-bold text-sm text-[#1D1D1F]">Campus Counseling Center</p>
                   <p className="text-[11px] font-medium text-gray-500">Reach out to campus counselors</p>
                 </div>
              </div>
           </button>

           <button onClick={() => handleOpenModal('stress')} className="w-full text-left flex items-center justify-between p-4 bg-white rounded-[24px] border border-gray-100 shadow-sm hover:border-purple-200 hover:bg-purple-50/50 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 flex items-center justify-center bg-purple-100 text-purple-600 rounded-[18px]">
                   <Heart className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-bold text-sm text-[#1D1D1F]">Stress Management Tips</p>
                   <p className="text-[11px] font-medium text-gray-500">Helpful guides and resources</p>
                 </div>
              </div>
           </button>
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-bold tracking-widest text-[#1D1D1F] uppercase mb-3 px-1 mt-4">24/7 Crisis Support</h2>
        <div className="p-6 bg-red-50 border border-red-100 rounded-[32px] shadow-sm">
           <div className="flex items-center gap-3 mb-5">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              <h3 className="font-bold text-red-900 text-sm tracking-wide">Emergency Contacts</h3>
           </div>
           
           <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-[20px] shadow-sm">
                 <div>
                   <h4 className="font-black text-red-800 text-sm">National Crisis Line</h4>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mt-0.5">Available 24/7</p>
                 </div>
                 <a href="tel:988" className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-full font-black text-sm shadow-md hover:bg-red-600 transition-colors">
                   <Phone className="w-4 h-4" /> 988
                 </a>
              </div>
           </div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="fixed top-[15%] left-4 right-4 bottom-auto max-h-[80vh] overflow-y-auto bg-white rounded-[32px] p-6 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-[#1D1D1F]">
                  {activeModal === 'counseling' ? 'Campus Counselors' : 'Stress Management'}
                </h2>
                <button onClick={() => setActiveModal(null)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {activeModal === 'counseling' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#F9FAFB] rounded-[24px] border border-gray-100">
                    <h3 className="font-bold text-[#1D1D1F] text-lg mb-2">Savannah Naick</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong className="text-gray-900">Teams:</strong> Savannah Naick</p>
                      <p><strong className="text-gray-900">Email:</strong> <a href="mailto:savannah.naick@eduvos.com" className="text-purple-600 font-medium">savannah.naick@eduvos.com</a></p>
                      <p><strong className="text-gray-900">Work No:</strong> <a href="tel:0831234567" className="text-purple-600 font-medium">083 123 4567</a></p>
                    </div>
                  </div>
                  <div className="p-4 bg-[#F9FAFB] rounded-[24px] border border-gray-100">
                    <h3 className="font-bold text-[#1D1D1F] text-lg mb-2">Babalo Lutholi</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong className="text-gray-900">Teams:</strong> Babalo Lutholi</p>
                      <p><strong className="text-gray-900">Email:</strong> <a href="mailto:babalo.lutholi@eduvos.com" className="text-purple-600 font-medium">babalo.lutholi@eduvos.com</a></p>
                      <p><strong className="text-gray-900">Work No:</strong> <a href="tel:0606339378" className="text-purple-600 font-medium">060 633 9378</a></p>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'stress' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">Here are some helpful guides and tips to manage stress:</p>
                  
                  <a href="/pdf/WellnessGuide.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-purple-50 rounded-[20px] text-purple-900 hover:bg-purple-100 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-[14px] flex items-center justify-center text-purple-600 shadow-sm"><FileText className="w-5 h-5"/></div>
                    <span className="font-bold text-sm">Wellness Guide</span>
                  </a>
                  
                  <a href="/pdf/Stress_Control.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-blue-50 rounded-[20px] text-blue-900 hover:bg-blue-100 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-[14px] flex items-center justify-center text-blue-600 shadow-sm"><FileText className="w-5 h-5"/></div>
                    <span className="font-bold text-sm">Stress Control Tips</span>
                  </a>
                  
                  <a href="/pdf/MindfulnessExercises.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-emerald-50 rounded-[20px] text-emerald-900 hover:bg-emerald-100 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-[14px] flex items-center justify-center text-emerald-600 shadow-sm"><FileText className="w-5 h-5"/></div>
                    <span className="font-bold text-sm">Mindfulness Exercises</span>
                  </a>
                  
                  <a href="/pdf/ProblemSolving_Presentation.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-orange-50 rounded-[20px] text-orange-900 hover:bg-orange-100 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-[14px] flex items-center justify-center text-orange-600 shadow-sm"><FileText className="w-5 h-5"/></div>
                    <span className="font-bold text-sm">Problem Solving</span>
                  </a>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

