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
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../hooks/useAuth';
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
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0f1d] text-slate-100 overflow-hidden font-sans">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a0f1e] border-b border-slate-800/80 sticky top-0 z-30 shrink-0">
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-sm font-semibold text-white tracking-wide flex items-center gap-1">
            NEXUS <span className="text-indigo-400 text-xs font-mono font-medium">OS</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-slate-200" /> : <Menu className="w-5 h-5 text-slate-200" />}
        </button>
      </header>

      {/* Mobile Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-[#0a0f1e] border-r border-slate-800/80 h-full flex flex-col justify-between p-4 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Layers className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h1 className="text-sm font-semibold text-white tracking-wide">
                      NEXUS <span className="text-indigo-400 text-xs font-mono">OS</span>
                    </h1>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="space-y-1">
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
                            ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 text-white font-bold shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={clsx('w-4 h-4', isActive ? 'text-white' : 'text-slate-400')} />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Footer with User & Logout */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="mb-3 px-2">
                <p className="text-xs font-medium text-slate-200 truncate">
                  {currentUser?.email || 'nexus_operator'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Online</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                icon={<LogOut className="w-3.5 h-3.5 text-slate-500" />}
                className="w-full justify-start text-xs text-slate-400 hover:text-rose-400"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-60 bg-[#0a0f1e] border-r border-slate-800/80 flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-800/80 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
                NEXUS <span className="text-indigo-400 text-xs font-mono font-medium">OS</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Agent Orchestrator</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
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
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 text-white font-bold shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={clsx('w-4 h-4', isActive ? 'text-white' : 'text-slate-400')} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="p-3 border-t border-slate-800/80">
          <div className="mb-2 px-2">
            <p className="text-xs font-medium text-slate-200 truncate">
              {currentUser?.email || 'nexus_operator'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/50" />
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Online</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="xs"
            onClick={logout}
            icon={<LogOut className="w-3.5 h-3.5 text-slate-500" />}
            className="w-full justify-start text-xs text-slate-400 hover:text-rose-400"
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#0a0f1d]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
