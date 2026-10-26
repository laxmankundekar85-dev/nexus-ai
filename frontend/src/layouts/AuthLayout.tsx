import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layers, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const AuthLayout: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#eaeff6] dark:bg-black text-slate-900 dark:text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2.5 rounded-xl bg-slate-200/90 dark:bg-zinc-900 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white shadow-xs hover:scale-105 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-blue-700" />}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-3 cursor-pointer group mb-6"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-1.5">
            NEXUS <span className="text-blue-700 dark:text-zinc-400 text-sm font-mono font-bold">OS</span>
          </span>
        </div>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
