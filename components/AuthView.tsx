
import React, { useState } from 'react';
import { UserRole } from '../types';
import { auth } from '../services/firebase';
// Fix: Use named export from firebase/auth for modular SDK
import { signInWithEmailAndPassword } from 'firebase/auth';

interface AuthViewProps {
  onSuccess: (role: UserRole) => void;
  onError: (msg: string) => void;
  onGoToSignup: (role: UserRole) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onSuccess, onError, onGoToSignup }) => {
  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isCustomer = activeRole === 'customer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      onError("Please provide credentials.");
      return;
    }
    
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess(activeRole);
    } catch (err: any) {
      console.error(err);
      onError(err.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 px-8 flex flex-col justify-center animate-[fadeIn_0.4s_ease-out]">
      <div className="absolute top-12 left-8 right-8 flex justify-center pt-safe">
        <div className="bg-neutral-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-white/5 flex w-full max-xs shadow-2xl">
          <button 
            onClick={() => setActiveRole('customer')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isCustomer ? 'bg-emerald-500 text-black shadow-lg' : 'text-neutral-500'}`}
          >
            Customer
          </button>
          <button 
            onClick={() => setActiveRole('vendor')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${!isCustomer ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-500'}`}
          >
            Tasker
          </button>
        </div>
      </div>

      <div className="mb-10 mt-12 transition-all duration-500">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${isCustomer ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
          <i className={`fa-solid ${isCustomer ? 'fa-user-circle text-emerald-500' : 'fa-truck-pickup text-amber-500'} text-3xl`}></i>
        </div>
        <h2 className="text-4xl font-black text-white leading-tight mb-2">
          {isCustomer ? 'Welcome Back.' : 'Trasher Portal.'}
        </h2>
        <p className="text-neutral-500 text-lg leading-snug">
          {isCustomer ? 'Sign in to your logistics account.' : 'Connect to the logistics network.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Email Address</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full h-16 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-lg text-white outline-none transition-all placeholder:text-neutral-700 ${isCustomer ? 'focus:border-emerald-500' : 'focus:border-amber-500'}`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full h-16 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-lg text-white outline-none transition-all placeholder:text-neutral-700 ${isCustomer ? 'focus:border-emerald-500' : 'focus:border-amber-500'}`}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full h-16 font-black text-lg rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 mt-4 text-black ${isCustomer ? 'bg-emerald-500' : 'bg-amber-500'}`}
        >
          {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <span>{isCustomer ? 'Log In' : 'Access Dashboard'}</span>}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-neutral-500 text-sm">
          {isCustomer ? 'New to WasteWizard?' : 'Interested in joining?'}
          {' '}
          <button 
            onClick={() => onGoToSignup(activeRole)}
            className={`font-bold hover:underline transition-colors duration-500 ${isCustomer ? 'text-emerald-500' : 'text-amber-500'}`}
          >
            {isCustomer ? 'Create Account' : 'Register Partner'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthView;
