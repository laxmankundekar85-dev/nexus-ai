import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-6 relative">
      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-2.5 mb-6 cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <Layers className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-white tracking-wide flex items-center gap-1.5">
            NEXUS <span className="text-blue-400 text-xs font-mono font-medium">OS</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Agent Orchestrator</p>
        </div>
      </Link>

      {/* Auth Card Content */}
      <div className="w-full max-w-sm bg-[#0f172a] border border-slate-800 rounded-xl shadow-lg p-7">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
