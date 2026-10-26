import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0f1d] flex flex-col items-center justify-center px-4 py-8 sm:p-6 relative overflow-hidden">
      {/* Eye-pleasing ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-2.5 mb-6 cursor-pointer relative z-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-sm shadow-indigo-950/50">
          <Layers className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-white tracking-wide flex items-center gap-1.5">
            NEXUS <span className="text-indigo-400 text-xs font-mono font-medium">OS</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Agent Orchestrator</p>
        </div>
      </Link>

      {/* Auth Card Content */}
      <div className="w-full max-w-sm bg-[#0e1529]/95 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
