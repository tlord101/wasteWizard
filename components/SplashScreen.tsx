
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[200] bg-neutral-950 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] rounded-full animate-pulse" />
        <div className="relative w-32 h-32 rounded-[2rem] bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-2xl">
          <i className="fa-solid fa-trash-can text-6xl text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"></i>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h1 className="text-3xl font-black tracking-tighter text-white mb-1">TrashTasker</h1>
        <p className="text-xs text-neutral-500 uppercase tracking-[0.3em] font-bold">On-Demand Waste Logistics</p>
      </div>

      <div className="absolute bottom-16 flex flex-col items-center">
        <div className="w-1 h-12 rounded-full bg-gradient-to-b from-emerald-500 to-transparent animate-bounce" />
        <span className="mt-4 text-[10px] text-neutral-600 uppercase font-bold tracking-widest">Loading Logistics...</span>
      </div>
    </div>
  );
};

export default SplashScreen;
