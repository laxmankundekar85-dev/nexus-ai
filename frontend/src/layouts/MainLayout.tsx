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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden font-sans text-slate-800 dark:text-slate-100">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-[#071324]/85 backdrop-blur-xl border-b border-sky-100 dark:border-sky-500/20 sticky top-0 z-30 shrink-0">
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/30">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-extrabold tracking-wide text-slate-900 dark:text-white flex items-center gap-1.5">
            NEXUS <span className="text-sky-600 dark:text-sky-400 text-xs font-mono font-bold">OS</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle (Mobile) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-sky-50/80 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-500/30 text-sky-700 dark:text-sky-300 hover:scale-105 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-sky-700" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-sky-50/80 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-500/30 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-white transition-colors"
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
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white/95 dark:bg-[#071324]/95 backdrop-blur-2xl border-r border-sky-100 dark:border-sky-500/20 h-full flex flex-col justify-between p-5 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-sky-100 dark:border-sky-500/20 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/30">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide">
                      NEXUS <span className="text-sky-600 dark:text-sky-400 text-xs font-mono">OS</span>
                    </h1>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
                          isActive
                            ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white font-bold shadow-md shadow-sky-500/30 border border-sky-300/40'
                            : 'text-slate-600 dark:text-slate-300 hover:text-sky-900 dark:hover:text-white hover:bg-sky-50/80 dark:hover:bg-sky-950/50 border border-transparent'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={clsx('w-4 h-4', isActive ? 'text-white' : 'text-sky-600 dark:text-sky-400')} />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Footer */}
            <div className="pt-4 border-t border-sky-100 dark:border-sky-500/20">
              <div className="mb-3 px-2">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {currentUser?.email || 'nexus_operator'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-wider font-semibold">Online</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                icon={<LogOut className="w-3.5 h-3.5 text-slate-400" />}
                className="w-full justify-start text-xs text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Frosted Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white/75 dark:bg-[#071324]/85 backdrop-blur-2xl border-r border-sky-100 dark:border-sky-500/20 flex-col justify-between shrink-0 shadow-xl shadow-sky-500/5 dark:shadow-black/40">
        <div>
          {/* Brand */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 px-6 py-5 border-b border-sky-100 dark:border-sky-500/20 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/30 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide flex items-center gap-1.5">
                NEXUS <span className="text-sky-600 dark:text-sky-400 text-xs font-mono font-bold">OS</span>
              </h1>
              <p className="text-[10px] text-sky-700/70 dark:text-sky-300/60 font-mono tracking-wider uppercase font-medium">Agent Operating Platform</p>
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
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white font-bold shadow-md shadow-sky-500/30 border border-sky-300/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-sky-900 dark:hover:text-white hover:bg-sky-50/80 dark:hover:bg-sky-950/50 border border-transparent'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={clsx('w-4 h-4', isActive ? 'text-white' : 'text-sky-600 dark:text-sky-400')} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer: User Profile, Theme Switcher & Logout */}
        <div className="p-4 border-t border-sky-100 dark:border-sky-500/20 space-y-3">
          {/* Theme Switcher Toggle */}
          <div className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-sky-50/80 dark:bg-sky-950/50 border border-sky-200/80 dark:border-sky-500/30">
            <span className="text-xs font-semibold text-slate-700 dark:text-sky-200 flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-sky-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              <span>{theme === 'dark' ? 'Dark Glass' : 'Light Glass'}</span>
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-sky-900 text-sky-700 dark:text-sky-200 border border-sky-200 dark:border-sky-700 hover:scale-105 transition-all shadow-xs"
            >
              Switch
            </button>
          </div>

          <div className="px-2">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {currentUser?.email || 'nexus_operator'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-wider font-semibold">Online</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="xs"
            onClick={logout}
            icon={<LogOut className="w-3.5 h-3.5 text-slate-400" />}
            className="w-full justify-start text-xs text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
