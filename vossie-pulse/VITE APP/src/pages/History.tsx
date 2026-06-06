import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';

export function History() {
  const { state } = useApp();

  const chartData = state.checkIns.map(c => ({
    date: format(parseISO(c.date), 'MMM d'),
    mood: c.mood,
  }));

  const tagCounts: Record<string, number> = {};
  state.checkIns.forEach(c => {
    c.tags.forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="px-6 py-8 flex flex-col gap-8 pb-12">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-[#1D1D1F]">Your Pulse</h1>
        <p className="text-sm font-medium text-gray-500 mt-2">See how you've been doing recently.</p>
      </header>

      {state.checkIns.length > 0 ? (
        <>
          <section className="bg-[#F9FAFB] rounded-[32px] border border-gray-100 p-5 mt-2">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Mood Trend</h3>
             <div className="h-48">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 'bold'}}
                      dy={10}
                   />
                   <YAxis 
                      domain={[1, 5]} 
                      ticks={[1, 3, 5]} 
                      axisLine={false} 
                      tickLine={false}
                      tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 'bold'}}
                      dx={-10}
                      tickFormatter={(val) => {
                         if(val===5) return 'Great';
                         if(val===3) return 'Neutral';
                         if(val===1) return 'Low';
                         return '';
                      }}
                   />
                   <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }} 
                   />
                   <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#c084fc" 
                      strokeWidth={4} 
                      dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }} 
                      activeDot={{ r: 6 }}
                   />
                 </LineChart>
               </ResponsiveContainer>
             </div>
          </section>

          {sortedTags.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Common Factors</h3>
              <ul className="flex flex-col gap-3">
                {sortedTags.map(([tag, count]) => (
                  <li key={tag} className="flex justify-between items-center p-4 bg-white rounded-[24px] border border-gray-100 shadow-sm">
                    <span className="font-bold text-sm text-gray-700">{tag}</span>
                    <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{count} times</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Recent Notes</h3>
             <div className="flex flex-col gap-4">
                {[...state.checkIns].filter(c => c.reflection).reverse().map(c => (
                  <div key={c.id} className="p-4 bg-white rounded-[24px] border border-gray-100 shadow-sm flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{format(parseISO(c.date), 'EEEE, MMMM d')}</p>
                    <p className="text-sm italic text-gray-600">"{c.reflection}"</p>
                  </div>
                ))}
                {state.checkIns.filter(c => c.reflection).length === 0 && (
                  <p className="text-gray-500 text-sm font-medium text-center py-4 bg-gray-50 rounded-[24px]">No written reflections yet.</p>
                )}
             </div>
          </section>
        </>
      ) : (
        <Card className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex justify-center items-center mb-4">
               <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-display text-lg font-medium text-zinc-900 mb-1">No Data Yet</h3>
            <p className="text-zinc-500">Check in today to start building your mood history.</p>
        </Card>
      )}
    </div>
  );
}
