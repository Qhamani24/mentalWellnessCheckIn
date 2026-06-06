import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, LogOut, Settings, Award, Database, Download, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { exportCheckInsToCSV, parseCSV } from '../lib/csvHelper';
import { generateMockState } from '../lib/mockData';

export function Profile() {
  const { state, resetApp, loadState } = useApp();
  const { profile } = state;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = () => {
    if (state.checkIns.length === 0) {
      alert("No data to export.");
      return;
    }
    exportCheckInsToCSV(state.checkIns);
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const parsedCheckIns = await parseCSV(file);
      if (parsedCheckIns.length > 0) {
        if(window.confirm(`Successfully parsed ${parsedCheckIns.length} records. Replace current check-ins?`)) {
           loadState({
              ...state,
              checkIns: parsedCheckIns,
           });
        }
      } else {
        alert("No valid check-ins found in CSV. Make sure it's the right format.");
      }
    } catch (err) {
      alert("Error parsing CSV: " + err);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadShowcase = () => {
    if (window.confirm("This will replace your current data with a 45-day simulated history to showcase a fully adopted platform. Continue?")) {
      loadState(generateMockState(state));
    }
  };

  return (
    <div className="px-6 py-8 flex flex-col gap-6">
      <header className="mb-4">
        <h1 className="text-2xl font-black tracking-tight text-[#1D1D1F]">Profile</h1>
      </header>

      <div className="flex items-center gap-5 p-6 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-[32px] shadow-lg border border-purple-500 overflow-hidden relative">
         <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
         <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center relative z-10 backdrop-blur-sm">
            <User className="w-8 h-8 text-white" />
         </div>
         <div className="relative z-10">
            <h2 className="text-2xl font-display font-bold">{profile?.name}</h2>
            <p className="text-white/80 text-sm mt-1 font-medium">{profile?.studentNumber} &bull; {profile?.campus}</p>
         </div>
      </div>

      <div className="grid gap-3">
        <div className="flex justify-between items-center bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm">
           <span className="text-gray-500 font-bold text-sm">Joined</span>
           <span className="font-bold text-[#1D1D1F]">Today</span>
        </div>
        <div className="flex justify-between items-center bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm">
           <span className="text-gray-500 font-bold text-sm">Total Check-ins</span>
           <span className="font-bold text-[#1D1D1F]">{state.checkIns.length}</span>
        </div>
        <div className="flex justify-between items-center bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm">
           <span className="text-gray-500 font-bold text-sm">Challenges Completed</span>
           <span className="font-bold text-[#1D1D1F]">{state.challenges.filter(c => c.completed).length} / {state.challenges.length}</span>
        </div>
      </div>

      <section className="mt-4">
        <h3 className="text-[10px] font-bold tracking-widest text-[#1D1D1F] uppercase mb-3 px-1 mt-2">Data & CSV Integration</h3>
        <div className="bg-white p-2 border border-gray-100 rounded-[28px] shadow-sm mb-6">
           <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleImportCSV} />
           <button onClick={handleLoadShowcase} className="w-full flex items-center justify-between p-3 hover:bg-blue-50 rounded-[20px] transition-colors">
              <div className="flex items-center gap-4">
                 <div className="bg-blue-100 p-2.5 rounded-[14px]"><Database className="w-5 h-5 text-blue-600" /></div>
                 <div className="text-left"><span className="font-bold text-sm text-gray-800 block">Seed Mock Data</span>
                 <span className="text-[10px] text-gray-500 font-medium">Auto-fill 45 days of mock history</span></div>
              </div>
           </button>
           <button onClick={handleExportCSV} className="w-full flex items-center justify-between p-3 hover:bg-emerald-50 rounded-[20px] transition-colors mt-1">
              <div className="flex items-center gap-4">
                 <div className="bg-emerald-100 p-2.5 rounded-[14px]"><Download className="w-5 h-5 text-emerald-600" /></div>
                 <div className="text-left"><span className="font-bold text-sm text-gray-800 block">Export as CSV</span>
                 <span className="text-[10px] text-gray-500 font-medium">Download a DB of your history</span></div>
              </div>
           </button>
           <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-[20px] transition-colors mt-1">
              <div className="flex items-center gap-4">
                 <div className="bg-purple-100 p-2.5 rounded-[14px]"><Upload className="w-5 h-5 text-purple-600" /></div>
                 <div className="text-left"><span className="font-bold text-sm text-gray-800 block">Import CSV DB</span>
                 <span className="text-[10px] text-gray-500 font-medium">Load DB elements from CSV</span></div>
              </div>
           </button>
        </div>

        <h3 className="text-[10px] font-bold tracking-widest text-[#1D1D1F] uppercase mb-3 px-1">Settings</h3>
        <div className="bg-white p-2 border border-gray-100 rounded-[28px] shadow-sm">
           <button onClick={() => alert("Notification settings (demo)")} className="w-full flex items-center gap-4 text-left p-3 hover:bg-gray-50 rounded-[20px] transition-colors">
              <div className="bg-gray-100 p-2.5 rounded-[14px]"><Settings className="w-5 h-5 text-gray-700" /></div>
              <span className="font-bold text-sm text-gray-800">Account Settings</span>
           </button>
           <button onClick={resetApp} className="w-full flex items-center gap-4 text-left p-3 hover:bg-red-50 rounded-[20px] transition-colors mt-1">
              <div className="bg-red-100 p-2.5 rounded-[14px]"><LogOut className="w-5 h-5 text-red-600" /></div>
              <span className="font-bold text-sm text-red-600">Log Out & Reset Data</span>
           </button>
        </div>
      </section>

      <div className="mt-8 text-center opacity-40">
        <p className="text-[10px] font-bold tracking-widest text-[#1D1D1F]">PULSE v1.0.0</p>
      </div>
    </div>
  );
}
