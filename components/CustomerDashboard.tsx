
import React from 'react';
import { Vendor, WasteType } from '../types';
import VendorAvatar from './VendorAvatar';

interface CustomerDashboardProps {
  userName: string;
  onScanClick: () => void;
  onFindCollectorClick: () => void;
  onViewMapClick: () => void;
  vendors: Vendor[];
  onVendorClick: (vendor: Vendor) => void;
  stats: {
    recycled: number;
    saved: string;
    points: number;
  };
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ 
  userName, 
  onScanClick, 
  onFindCollectorClick, 
  onViewMapClick,
  vendors, 
  onVendorClick,
  stats
}) => {
  return (
    <div className="flex flex-col h-full bg-neutral-950 text-white overflow-y-auto no-scrollbar pb-32 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <header className="px-6 pt-safe pb-6 flex justify-between items-center">
        <div>
          <p className="text-neutral-500 text-xs font-black uppercase tracking-widest mb-1">Welcome back</p>
          <h1 className="text-2xl font-black tracking-tight">{userName}</h1>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 relative">
          <i className="fa-solid fa-bell text-xl"></i>
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-neutral-950"></span>
        </div>
      </header>

      {/* Hero Stats Card */}
      <section className="px-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-[2.5rem] shadow-[0_20px_40px_rgba(16,185,129,0.2)] relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-emerald-100/70 text-[10px] font-black uppercase tracking-widest mb-1">Eco Impact</p>
              <h2 className="text-4xl font-black text-white">{stats.points} <span className="text-sm font-bold opacity-70">pts</span></h2>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
              <i className="fa-solid fa-leaf text-white"></i>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <p className="text-[9px] font-black text-emerald-100/50 uppercase mb-0.5">Items Recycled</p>
              <p className="text-lg font-black">{stats.recycled}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <p className="text-[9px] font-black text-emerald-100/50 uppercase mb-0.5">CO2 Prevented</p>
              <p className="text-lg font-black">{stats.saved}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Actions */}
      <section className="px-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onScanClick}
            className="flex flex-col items-center justify-center gap-3 bg-neutral-900 border border-neutral-800 p-6 rounded-[2rem] active:scale-95 transition-all shadow-xl group"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <i className="fa-solid fa-wand-magic-sparkles text-2xl text-emerald-500"></i>
            </div>
            <span className="text-sm font-black uppercase tracking-widest text-neutral-300">Waste Wizard</span>
          </button>
          
          <button 
            onClick={onFindCollectorClick}
            className="flex flex-col items-center justify-center gap-3 bg-neutral-900 border border-neutral-800 p-6 rounded-[2rem] active:scale-95 transition-all shadow-xl group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <i className="fa-solid fa-truck-fast text-2xl text-blue-500"></i>
            </div>
            <span className="text-sm font-black uppercase tracking-widest text-neutral-300">Quick Pickup</span>
          </button>
        </div>
      </section>

      {/* Nearby Logistics */}
      <section className="mb-8">
        <div className="px-6 flex justify-between items-center mb-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">Nearby Logistics</h3>
          <button onClick={onViewMapClick} className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 active:opacity-50">
            View Radar <i className="fa-solid fa-arrow-right-long"></i>
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 no-scrollbar pb-2">
          {vendors.map(v => (
            <div key={v.id} className="min-w-[70px]">
              <VendorAvatar vendor={v} onClick={onVendorClick} />
            </div>
          ))}
        </div>
      </section>

      {/* Map Preview Card */}
      <section className="px-6 mb-8">
        <div 
          onClick={onViewMapClick}
          className="relative h-40 rounded-[2.5rem] bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl group active:scale-[0.98] transition-all"
        >
          <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=13&size=600x300&maptype=roadmap&style=feature:all|element:labels|visibility:off&style=feature:geometry|color:0x212121&style=feature:water|color:0x000000&key=AIzaSyA5EplU4UjhGREUk7aKberi_chRemUNBTE')] bg-cover bg-center grayscale opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Live Logistics Grid</p>
              <h4 className="text-lg font-black text-white">4 Active Collectors</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-2xl">
              <i className="fa-solid fa-location-arrow"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Guide */}
      <section className="px-6">
        <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-[2.5rem]">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500 mb-4">Wizard Tip</h3>
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-lightbulb text-amber-500"></i>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed font-medium">
              Scanning your waste with AI ensures it gets routed to the correct processing center and earns you 2x Eco-Points.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;
