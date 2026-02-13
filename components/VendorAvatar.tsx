
import React from 'react';
import { Vendor } from '../types';

interface VendorAvatarProps {
  vendor: Vendor;
  onClick: (vendor: Vendor) => void;
  size?: 'sm' | 'md' | 'lg';
  isDimmed?: boolean;
}

const VendorAvatar: React.FC<VendorAvatarProps> = ({ vendor, onClick, size = 'md', isDimmed = false }) => {
  const isAvailable = vendor.status === 'available';
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <button 
      onClick={() => onClick(vendor)}
      className={`flex flex-col items-center group transition-all duration-500 active:scale-95 ${isDimmed ? 'opacity-30 scale-90' : 'opacity-100 scale-100'}`}
    >
      <div className="relative">
        {/* Availability Ring */}
        <div className={`
          absolute -inset-1 rounded-full border-2 transition-colors duration-500
          ${isAvailable ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-neutral-700'}
        `} />
        
        {/* Avatar Image */}
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-neutral-800 border-2 border-neutral-950 relative z-10`}>
          <img 
            src={vendor.image} 
            alt={vendor.name} 
            className={`w-full h-full object-cover ${!isAvailable ? 'grayscale opacity-60' : ''}`} 
          />
        </div>

        {/* Distance Badge */}
        <div className="absolute -bottom-1 -right-1 z-20 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded-md shadow-xl">
          <p className="text-[8px] font-black text-white whitespace-nowrap">{vendor.distance}</p>
        </div>
      </div>
      
      <p className="mt-2 text-[10px] font-bold text-neutral-400 uppercase tracking-tighter truncate w-16 text-center group-hover:text-white">
        {vendor.name.split(' ')[1] || vendor.name}
      </p>
    </button>
  );
};

export default VendorAvatar;
