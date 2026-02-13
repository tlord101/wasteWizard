
import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
// Fix: Use named export from firebase/auth for modular SDK
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface CustomerSignupProps {
  onSuccess: () => void;
  onError: (msg: string) => void;
  onBack: () => void;
}

const CustomerSignup: React.FC<CustomerSignupProps> = ({ onSuccess, onError, onBack }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      onError("All fields are required.");
      return;
    }
    
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        name: formData.name,
        email: formData.email,
        role: 'customer',
        createdAt: Date.now()
      });
      onSuccess();
    } catch (err: any) {
      onError(err.message || "Registration failed.");
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
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
          <i className="fa-solid fa-user-plus text-3xl text-emerald-500"></i>
        </div>
        <h2 className="text-3xl font-black text-white leading-tight mb-2">Create Account</h2>
        <p className="text-neutral-500">Join TrashTasker for reliable waste collection.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Full Name</label>
          <input
            type="text"
            placeholder="e.g. Felix Miller"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full h-14 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-neutral-700"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Email Address</label>
          <input
            type="email"
            placeholder="felix@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full h-14 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-neutral-700"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Secure Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full h-14 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-neutral-700"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-16 bg-emerald-500 text-black font-black text-lg rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 mt-4"
        >
          {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <span>Register Now</span>}
        </button>
      </form>
    </div>
  );
};

export default CustomerSignup;
