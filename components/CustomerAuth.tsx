
import React, { useState } from 'react';

interface CustomerAuthProps {
  onSuccess: () => void;
  onError: (msg: string) => void;
  onCancel: () => void;
  onGoToSignup: () => void;
}

const CustomerAuth: React.FC<CustomerAuthProps> = ({ onSuccess, onError, onCancel, onGoToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      onError("Please provide your username and password.");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 px-8 flex flex-col justify-center animate-[fadeIn_0.4s_ease-out]">
      <div className="absolute top-0 left-0 pt-safe px-6 py-4">
        <button 
          onClick={onCancel}
          className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white active:scale-90 transition-transform shadow-xl"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
      </div>

      <div className="mb-10">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
          <i className="fa-solid fa-user-circle text-3xl text-emerald-500"></i>
        </div>
        <h2 className="text-4xl font-black text-white leading-tight mb-2">Welcome Back.</h2>
        <p className="text-neutral-500 text-lg">Sign in to your logistics account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Username</label>
          <input
            autoFocus
            type="text"
            placeholder="e.g. felix_wizard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-16 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-lg text-white focus:border-emerald-500 outline-none transition-all placeholder:text-neutral-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-16 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-lg text-white focus:border-emerald-500 outline-none transition-all placeholder:text-neutral-700"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-16 bg-emerald-500 text-black font-black text-lg rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 mt-4"
        >
          {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <span>Log In</span>}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-neutral-500 text-sm">
          New to WasteWizard?{' '}
          <button 
            onClick={onGoToSignup}
            className="text-emerald-500 font-bold hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default CustomerAuth;
