
import React, { useState } from 'react';

interface VendorAuthProps {
  onSuccess: () => void;
  onError: (msg: string) => void;
  onCancel: () => void;
  onGoToSignup: () => void;
}

const VendorAuth: React.FC<VendorAuthProps> = ({ onSuccess, onError, onCancel, onGoToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      onError("Missing credentials.");
      return;
    }

    setIsLoading(true);
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
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
          <i className="fa-solid fa-truck-pickup text-3xl text-amber-500"></i>
        </div>
        <h2 className="text-4xl font-black text-white leading-tight mb-2">Trasher Portal.</h2>
        <p className="text-neutral-500 text-lg">Establish a secure link to the logistics network.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Partner ID / Email</label>
          <input
            autoFocus
            type="text"
            placeholder="Partner #4029"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-16 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-lg text-white focus:border-amber-500 outline-none transition-all placeholder:text-neutral-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-16 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 text-lg text-white focus:border-amber-500 outline-none transition-all placeholder:text-neutral-700"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-16 bg-amber-500 text-black font-black text-lg rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 mt-4"
        >
          {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <span>Access Dashboard</span>}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-neutral-500 text-sm">
          Interested in joining?{' '}
          <button 
            onClick={onGoToSignup}
            className="text-amber-500 font-bold hover:underline"
          >
            Register as Partner
          </button>
        </p>
      </div>
    </div>
  );
};

export default VendorAuth;
