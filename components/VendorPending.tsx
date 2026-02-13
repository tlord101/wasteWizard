
import React, { useState } from 'react';

const VendorPending: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center px-8 text-center animate-[fadeIn_0.5s_ease-out]">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-amber-500/10 blur-[60px] rounded-full animate-pulse" />
        <div className="relative w-32 h-32 rounded-[2rem] bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-2xl">
          <i className={`fa-solid fa-clock text-6xl text-amber-500/50 ${isRefreshing ? 'animate-spin' : ''}`}></i>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Under Review.</h2>
        <p className="text-neutral-500 text-lg leading-relaxed">
          Operations is currently verifying your logistics credentials and extraction equipment.
        </p>
        <div className="inline-flex items-center gap-3 bg-amber-500/5 border border-amber-500/20 px-6 py-3 rounded-2xl mt-4">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Awaiting Verification</span>
        </div>
      </div>

      <button 
        type="button"
        onClick={handleRefresh}
        className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-700 hover:text-neutral-400 transition-colors disabled:opacity-30"
        disabled={isRefreshing}
      >
        {isRefreshing ? 'Verifying...' : 'Tap to Refresh Status'}
      </button>
    </div>
  );
};

export default VendorPending;
