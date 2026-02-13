
import React from 'react';
import { MOCK_TRANSACTIONS, COLORS } from '../constants';
import { WasteType } from '../types';

interface PickupHistoryProps {
  onBack: () => void;
  isVendor: boolean;
}

const PickupHistory: React.FC<PickupHistoryProps> = ({ onBack, isVendor }) => {
  return (
    <div className="flex flex-col h-full bg-neutral-900 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-center gap-4 py-3 border-b border-neutral-800 mb-6 px-2">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 active:scale-90 transition-all">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div>
          <h3 className="font-black text-white leading-tight text-lg">Pickup History</h3>
          <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Logged Logistics</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-3 pb-12 no-scrollbar">
        {MOCK_TRANSACTIONS.map((item) => (
          <div key={item.id} className="bg-neutral-950 border border-neutral-800/50 p-4 rounded-2xl flex items-center justify-between group active:bg-neutral-800/30 transition-colors">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner"
                style={{ backgroundColor: `${COLORS[item.wasteType || WasteType.DOMESTIC]}20`, color: COLORS[item.wasteType || WasteType.DOMESTIC] }}
              >
                <i className={`fa-solid ${getIconForWaste(item.wasteType || WasteType.DOMESTIC)}`}></i>
              </div>
              <div>
                <h4 className="font-black text-white text-sm tracking-tight">
                  {isVendor ? item.customerName : 'Service Collection'}
                </h4>
                <div className="flex items-center gap-2 text-neutral-500 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider">{item.wasteType}</span>
                  <span className="text-[8px] opacity-30">•</span>
                  <span className="text-[10px] font-medium">{item.date}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-black ${item.status === 'Completed' ? 'text-emerald-500' : 'text-red-500'}`}>
                {item.status === 'Completed' ? (isVendor ? `+$${item.amount}` : 'Success') : 'Cancelled'}
              </p>
              <p className="text-[8px] text-neutral-600 font-black uppercase tracking-widest mt-0.5">{item.id}</p>
            </div>
          </div>
        ))}

        {MOCK_TRANSACTIONS.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <i className="fa-solid fa-box-open text-6xl mb-4"></i>
            <p className="font-black uppercase tracking-widest text-xs">No records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const getIconForWaste = (type: WasteType) => {
  switch (type) {
    case WasteType.RECYCLABLE: return 'fa-recycle';
    case WasteType.MEDICAL: return 'fa-briefcase-medical';
    case WasteType.DOMESTIC: return 'fa-trash-can';
    default: return 'fa-trash-can';
  }
};

export default PickupHistory;
