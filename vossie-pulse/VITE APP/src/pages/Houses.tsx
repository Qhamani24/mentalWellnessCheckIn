import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Users, Shield, Award, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { getHouseData, housesData } from '../lib/houses';

const leaderboards = [
  { name: 'LEFATSHE', points: 14250 },
  { name: 'SERITI', points: 13800 },
  { name: 'MOYO', points: 12100 },
  { name: 'LESEDI', points: 11500 },
  { name: 'PULA', points: 11100 },
  { name: 'UMOYA', points: 10400 },
];

export function Houses() {
  const { state, completeChallenge } = useApp();
  
  const houseTotal = state.points.reduce((acc, curr) => acc + curr.points, 0);
  const userHouseData = getHouseData(state.profile?.house || '');

  return (
    <div className="px-6 py-8 flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-[#1D1D1F]">Social Houses</h1>
        <p className="text-sm font-medium text-gray-500 mt-2">Participate to earn points for {userHouseData.name !== 'Unknown' ? userHouseData.name : 'your house'}.</p>
      </header>

      <div className={`p-6 bg-white rounded-[32px] shadow-sm border border-gray-100 mt-2 relative overflow-hidden`}>
        <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${userHouseData.bg} rounded-full blur-2xl opacity-60`}></div>
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className={`w-12 h-12 ${userHouseData.bg} rounded-full flex items-center justify-center`}>
            {React.createElement(userHouseData.icon, { className: `w-6 h-6 ${userHouseData.color}` })}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Social House</p>
            <h3 className="text-lg font-bold text-gray-800">{userHouseData.name !== 'Unknown' ? userHouseData.name : 'Your House'}</h3>
          </div>
        </div>
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Your Contribution</span>
            <span className={`font-bold ${userHouseData.color}`}>{houseTotal} pts</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className={`${userHouseData.hex} h-full w-[85%]`}></div>
          </div>
          <p className="text-[11px] text-gray-400 font-medium italic">Keep checking in to earn more points!</p>
        </div>
      </div>

      <section className="p-6 bg-white rounded-[32px] shadow-sm border border-purple-50">
        <h3 className="text-sm font-bold text-[#1D1D1F] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          Campus Leaderboard
        </h3>
        <div className="space-y-4">
          {leaderboards.map((house, index) => {
            const staticHouseData = getHouseData(house.name);
            const isUserHouse = state.profile?.house === house.name;
            const myHousePoints = house.points + (isUserHouse ? houseTotal : 0);
            return (
              <div key={house.name} className={`flex items-center justify-between p-2 rounded-2xl ${isUserHouse ? staticHouseData.bg : ''}`}>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold w-4 text-center ${index === 0 ? 'text-purple-700' : 'text-gray-400'}`}>{index + 1}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${staticHouseData.bg} ${staticHouseData.color}`}>
                     {React.createElement(staticHouseData.icon, { className: "w-4 h-4" })}
                  </div>
                  <span className="text-sm font-medium text-[#1D1D1F]">{house.name} {isUserHouse && '(Yours)'}</span>
                </div>
                <span className={`text-xs font-bold ${index === 0 ? 'text-purple-700' : 'text-gray-700'}`}>{myHousePoints.toLocaleString()}</span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  );
}
