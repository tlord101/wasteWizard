
import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface VendorSignupProps {
  onSuccess: () => void;
  onError: (msg: string) => void;
  onBack: () => void;
}

const VendorSignup: React.FC<VendorSignupProps> = ({ onSuccess, onError, onBack }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', vehicle: '', experience: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.vehicle) {
      onError("Please provide name, email, password, and primary vehicle type.");
      return;
    }
    
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        name: formData.name,
        email: formData.email,
        role: 'vendor',
        vehicle: formData.vehicle,
        experience: formData.experience || '',
        onboarded: false,
        approved: false,
        isOnline: false,
        createdAt: Date.now()
      });
      onSuccess();
    } catch (err: any) {
      onError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 px-8 flex flex-col justify-center animate-[fadeIn_0.4s_ease-out] z-[100]">
      <div className="absolute top-0 left-0 pt-safe px-6 py-4">
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white active:scale-90 transition-all shadow-xl"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
      </div>

      <div className="mb-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
          <i className="fa-solid fa-truck-ramp-box text-3xl text-amber-500"></i>
        </div>
        <h2 className="text-3xl font-black text-white leading-tight mb-2">Join as Tasker</h2>
        <p className="text-neutral-500">Earn income by providing essential waste logistics.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Full Legal Name</label>
          <input
            type="text"
            placeholder="e.g. Silas Scrapper"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full h-14 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-white focus:border-amber-500 outline-none transition-all placeholder:text-neutral-700"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Email Address</label>
          <input
            type="email"
            placeholder="silas@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full h-14 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-white focus:border-amber-500 outline-none transition-all placeholder:text-neutral-700"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Secure Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full h-14 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-white focus:border-amber-500 outline-none transition-all placeholder:text-neutral-700"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Vehicle Category</label>
          <select
            value={formData.vehicle}
            onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
            className="w-full h-14 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-white focus:border-amber-500 outline-none transition-all appearance-none"
          >
            <option value="">Select Primary Vehicle</option>
            <option value="bike">Bicycle / E-Bike</option>
            <option value="trike">Tricycle / Cart</option>
            <option value="pickup">Pickup Truck</option>
            <option value="truck">Heavy Duty Truck</option>
          </select>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl mb-2">
          <div className="flex gap-3 items-start">
            <i className="fa-solid fa-circle-info text-amber-500 mt-1"></i>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Registering as a partner requires background verification. Your profile will be reviewed by operations after registration.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-16 bg-amber-500 text-black font-black text-lg rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 mt-4"
        >
          {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <span>Register Partner</span>}
        </button>
      </form>
    </div>
  );
};

export default VendorSignup;
