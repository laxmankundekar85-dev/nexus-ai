import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  GitFork,
  FolderArchive,
  FileText,
  Settings,
  LogOut,
  Layers,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Workspace', path: '/workspace', icon: Cpu },
  { label: 'Workflow Builder', path: '/workflows', icon: GitFork },
  { label: 'Documents', path: '/documents', icon: FolderArchive },
  { label: 'Reports', path: '/reports', icon: FileText },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const MainLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden font-sans text-slate-900 dark:text-white">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-[#09090b]/85 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 sticky top-0 z-30 shrink-0 shadow-sm">
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-extrabold tracking-wide text-slate-950 dark:text-white flex items-center gap-1.5">
            NEXUS <span className="text-blue-600 dark:text-blue-400 text-xs font-mono font-bold">OS</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle (Mobile) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-white/15 text-slate-800 dark:text-white hover:scale-105 transition-all shadow-xs"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-white/15 text-slate-800 dark:text-white transition-colors shadow-xs"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white/90 dark:bg-[#09090b]/95 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/10 h-full flex flex-col justify-between p-5 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-sm font-extrabold text-slate-950 dark:text-white tracking-wide">
                      NEXUS <span className="text-blue-600 dark:text-blue-400 text-xs font-mono font-bold">OS</span>
                    </h1>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150',
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 dark:bg-white dark:text-black dark:shadow-white/10'
                            : 'text-slate-700 dark:text-zinc-400 hover:bg-slate-100/80 dark:hover:bg-zinc-900/80 hover:text-blue-600 dark:hover:text-white'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={clsx('w-4 h-4', isActive ? 'text-white dark:text-black' : 'text-slate-500 dark:text-zinc-400')} />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Footer */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-white/10">
              <div className="mb-3 px-2">
                <p className="text-xs font-bold text-slate-950 dark:text-white truncate">
                  {currentUser?.email || 'nexus_operator'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-wider font-bold">Online</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                icon={<LogOut className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />}
                className="w-full justify-start text-xs text-slate-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 font-bold"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Frosted Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white/75 dark:bg-[#09090b]/85 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/10 flex-col justify-between shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.03)] dark:shadow-black/50 z-20">
        <div>
          {/* Brand */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 px-6 py-5 border-b border-slate-200/80 dark:border-white/10 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-950 dark:text-white tracking-wide flex items-center gap-1.5">
                NEXUS <span className="text-blue-600 dark:text-blue-400 text-xs font-mono font-bold">OS</span>
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono tracking-wider uppercase font-semibold">Agent Operating Platform</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150',
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 dark:bg-white dark:text-black dark:shadow-white/10'
                        : 'text-slate-700 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-zinc-900/70 border border-transparent hover:border-slate-200/60 dark:hover:border-white/5'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={clsx('w-4 h-4', isActive ? 'text-white dark:text-black' : 'text-slate-500 dark:text-zinc-400')} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer: User Profile, Theme Switcher & Logout */}
        <div className="p-4 border-t border-slate-200/80 dark:border-white/10 space-y-3">
          {/* Theme Switcher Toggle */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200/80 dark:border-white/15 shadow-xs">
            <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-zinc-300" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              <span>{theme === 'dark' ? 'Dark Monolith' : 'Light Glass'}</span>
            </span>
            <button
              onClick={toggleTheme}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all shadow-xs"
            >
              Switch
            </button>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="overflow-hidden">
              <p className="text-xs font-extrabold text-slate-950 dark:text-white truncate">
                {currentUser?.email || 'nexus_operator'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-wider font-extrabold">Online</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="xs"
              onClick={logout}
              icon={<LogOut className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />}
              className="text-xs text-slate-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 font-bold"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-transparent transition-colors duration-200">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
