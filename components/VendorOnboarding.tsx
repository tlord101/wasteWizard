
import React, { useState } from 'react';
import { WasteType } from '../types';

interface VendorOnboardingProps {
  onComplete: (data: any) => void;
  onError: (msg: string) => void;
}

const VendorOnboarding: React.FC<VendorOnboardingProps> = ({ onComplete, onError }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [specialties, setSpecialties] = useState<WasteType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSpecialty = (type: WasteType) => {
    setSpecialties(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleNext = () => {
    if (!name || !businessType || specialties.length === 0) {
      onError("Please fulfill all identity requirements.");
      return;
    }
    setStep(2);
  };

  const requestGPS = async () => {
    setIsLoading(true);
    try {
      const result: any = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { 
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0
        });
      });
      if (result) {
        onComplete({ name, businessType, specialties });
      }
    } catch (err: any) {
      console.error(`Onboarding location error: code=${err.code}, message=${err.message || 'unknown'}`);
      onError(err.code === 3 ? "GPS signal weak. Try moving outside." : "GPS access is required for logistics tracking.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 px-8 flex flex-col justify-center animate-[fadeIn_0.5s_ease-out]">
      {step === 1 ? (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">Build your profile.</h2>
            <p className="text-neutral-500">Provide your identity for verification.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Display Name</label>
              <input 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Silas Scrapper"
                className="w-full h-14 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-white focus:border-amber-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Service Type</label>
              <select 
                value={businessType}
                onChange={e => setBusinessType(e.target.value)}
                className="w-full h-14 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-white focus:border-amber-500 outline-none transition-all appearance-none"
              >
                <option value="">Select Type</option>
                <option value="individual">Independent Collector</option>
                <option value="guild">Registered Service</option>
                <option value="corporate">Logistics Company</option>
              </select>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Collection Specialties</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(WasteType).map(type => (
                  <button
                    key={type}
                    onClick={() => toggleSpecialty(type)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border ${
                      specialties.includes(type) 
                        ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                        : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleNext}
            className="w-full h-16 bg-white text-black font-black rounded-2xl active:scale-95 transition-all mt-8"
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center animate-pulse border border-amber-500/30">
            <i className="fa-solid fa-location-dot text-4xl text-amber-500"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white mb-2">Location Tracking.</h2>
            <p className="text-neutral-500">To receive collection requests, we must track your movements in real-time. Grant GPS access to proceed.</p>
          </div>
          
          <button 
            onClick={requestGPS}
            disabled={isLoading}
            className="w-full h-16 bg-amber-500 text-black font-black rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-satellite"></i>}
            <span>Enable Real-time Tracking</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VendorOnboarding;
