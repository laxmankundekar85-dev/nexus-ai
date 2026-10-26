import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layers, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const AuthLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:p-6 relative overflow-hidden font-sans">
      {/* Frosted ambient background orbs */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-400/20 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-white/70 dark:bg-[#0c182b]/70 border border-sky-200/80 dark:border-sky-500/30 backdrop-blur-xl shadow-md text-slate-700 dark:text-sky-200 hover:scale-105 transition-all"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-sky-700" />}
        </button>
      </div>

      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-3 mb-6 cursor-pointer relative z-10 group">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 border border-sky-300/40 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-wide flex items-center gap-1.5">
            NEXUS <span className="text-sky-600 dark:text-sky-400 text-xs font-mono font-bold">OS</span>
          </h1>
          <p className="text-[10px] text-sky-700/80 dark:text-sky-300/70 font-mono tracking-wider uppercase font-medium">Autonomous Agent Platform</p>
        </div>
      </Link>

      {/* Auth Glass Card Content */}
      <div className="w-full max-w-sm bg-white/85 dark:bg-[#0c182b]/85 backdrop-blur-2xl border border-white/90 dark:border-sky-400/25 rounded-3xl shadow-2xl shadow-sky-500/10 dark:shadow-black/50 p-6 sm:p-8 relative z-10 transition-all">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
