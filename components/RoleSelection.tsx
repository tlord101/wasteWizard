
import React from 'react';
import { UserRole } from '../types';

interface RoleSelectionProps {
  onSelect: (role: UserRole) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center px-6 gap-6">
      <button 
        onClick={() => onSelect('customer')}
        className="w-full h-48 rounded-[2.5rem] bg-neutral-900 border border-emerald-500/20 flex flex-col items-center justify-center gap-4 group active:scale-95 transition-all shadow-[0_0_40px_rgba(16,185,129,0.05)]"
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
          <i className="fa-solid fa-house-user text-3xl text-emerald-500"></i>
        </div>
        <span className="text-xl font-bold text-white tracking-tight uppercase">I have trash to pick up</span>
      </button>

      <button 
        onClick={() => onSelect('vendor')}
        className="w-full h-48 rounded-[2.5rem] bg-neutral-900 border border-amber-500/20 flex flex-col items-center justify-center gap-4 group active:scale-95 transition-all shadow-[0_0_40px_rgba(245,158,11,0.05)]"
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
          <i className="fa-solid fa-truck-pickup text-3xl text-amber-500"></i>
        </div>
        <span className="text-xl font-bold text-white tracking-tight uppercase">I am a Trash Tasker</span>
      </button>
    </div>
  );
};

export default RoleSelection;
