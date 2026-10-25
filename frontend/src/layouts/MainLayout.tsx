import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  GitFork,
  FolderArchive,
  FileText,
  Settings,
  LogOut,
  Layers,
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

  return (
    <div className="flex h-screen bg-[#090d16] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0b0f19] border-r border-slate-800/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-800/80 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-200">
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
                NEXUS <span className="text-blue-400 text-xs font-mono font-medium">OS</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Agent Orchestrator</p>
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
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-slate-800/90 text-white border border-slate-700/70 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-transparent'
                    )
                  }
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Online</span>
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
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#090d16]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
