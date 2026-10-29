import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  FileText,
  FolderArchive,
  Search,
  Network,
  Clock,
  Compass,
  GitFork,
  RotateCcw,
  Calendar,
  ShieldAlert,
  Calculator,
  Target,
  Lock,
  ShieldCheck,
  Settings,
  LogOut,
  Layers,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import PWAInstallBanner from '../components/PWAInstallBanner';

interface NavGroup {
  title: string;
  items: {
    label: string;
    sublabel: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', sublabel: 'Platform health & telemetry', path: '/dashboard', icon: LayoutDashboard },
      { label: 'AI Workspace', sublabel: 'Mission objective & agent mesh', path: '/workspace', icon: Cpu },
      { label: 'Intelligence Reports', sublabel: 'Synthesized dossiers & citations', path: '/reports', icon: FileText },
    ],
  },
  {
    title: 'KNOWLEDGE & RESEARCH',
    items: [
      { label: 'Document Intelligence', sublabel: 'Corpus ingestion & comparison', path: '/documents', icon: FolderArchive },
      { label: 'Evidence Explorer', sublabel: 'Claim lineage & impact analyzer', path: '/evidence', icon: Search },
      { label: 'Knowledge Graph', sublabel: 'Entity networks & temporal diff', path: '/knowledge-graph', icon: Network },
      { label: 'Source Freshness', sublabel: 'Staleness & re-validation feeds', path: '/source-freshness', icon: Clock },
    ],
  },
  {
    title: 'AUTONOMOUS OPERATIONS',
    items: [
      { label: 'Mission Supervisor', sublabel: 'DAG planning & 10-state machine', path: '/supervisor', icon: Compass, badge: 'Active' },
      { label: 'Workflow Builder', sublabel: 'Visual agent DAG studio', path: '/workflows', icon: GitFork },
      { label: 'Mission History & Replay', sublabel: 'Execution diff & plan branching', path: '/mission-history', icon: RotateCcw },
      { label: 'Scheduled Missions', sublabel: 'Recurring cron & delta alerts', path: '/schedules', icon: Calendar },
      { label: 'Execution Recovery', sublabel: 'Self-healing & circuit breakers', path: '/execution-recovery', icon: ShieldAlert },
    ],
  },
  {
    title: 'ANALYTICS & QUALITY',
    items: [
      { label: 'Data Analysis Lab', sublabel: 'AST Python sandbox & SVG charts', path: '/analysis-lab', icon: Calculator },
      { label: 'AI Evaluation & Benchmarks', sublabel: 'Golden datasets & model radar', path: '/evaluation', icon: Target },
    ],
  },
  {
    title: 'SYSTEM & GOVERNANCE',
    items: [
      { label: 'Security & Permissions', sublabel: 'Tool gateway & approval queue', path: '/security', icon: Lock },
      { label: 'Audit Trail', sublabel: 'Chained SHA-256 tamper logs', path: '/audit-trail', icon: ShieldCheck },
      { label: 'Settings', sublabel: 'LLM routing, keys & diagnostics', path: '/settings', icon: Settings },
    ],
  },
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

  const renderNavItems = () => (
    <div className="space-y-4">
      {navGroups.map((group) => (
        <div key={group.title} className="space-y-1">
          <div className="px-3.5 py-1 text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
            {group.title}
          </div>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group',
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 dark:bg-white dark:text-black dark:shadow-white/10'
                        : 'text-slate-700 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-zinc-900/70 border border-transparent hover:border-slate-200/60 dark:hover:border-white/5'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-white dark:text-black' : 'text-slate-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-white')} />
                      <div className="flex flex-col text-left flex-1 min-w-0">
                        <span className="truncate">{item.label}</span>
                        <span className={clsx('text-[9.5px] font-normal leading-tight truncate', isActive ? 'text-white/80 dark:text-black/70' : 'text-slate-500 dark:text-zinc-500')}>
                          {item.sublabel}
                        </span>
                      </div>
                      {item.badge && (
                        <span className={clsx('text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full', isActive ? 'bg-white/20 text-white dark:bg-black/10 dark:text-black' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300')}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen md:overflow-hidden font-sans text-slate-900 dark:text-white bg-[#f8fafc] dark:bg-[#09090b]">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-[#09090b]/95 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 sticky top-0 z-30 shrink-0 shadow-xs">
        <div onClick={() => navigate('/dashboard')} className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-extrabold tracking-wide text-slate-950 dark:text-white flex items-center gap-1.5">
            NEXUS <span className="text-blue-600 dark:text-blue-400 text-xs font-mono font-bold">ENTERPRISE</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
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
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/10 h-full flex flex-col justify-between p-4 z-10 shadow-2xl animate-in slide-in-from-left duration-200 overflow-hidden">
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10 mb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                    <Layers className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-950 dark:text-white tracking-wide">
                    NEXUS <span className="text-blue-600 dark:text-blue-400 font-mono">ENTERPRISE</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:text-black dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Navigation in Drawer */}
              <div className="flex-1 overflow-y-auto pr-1">
                {renderNavItems()}
              </div>

              {/* Drawer Footer */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 shrink-0">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  icon={<LogOut className="w-3.5 h-3.5" />}
                  className="w-full justify-start text-xs text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Frosted Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white/80 dark:bg-[#09090b]/90 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/10 flex-col justify-between shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-black/40 z-20 h-screen">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 px-5 py-4 border-b border-slate-200/80 dark:border-white/10 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-title text-slate-950 dark:text-white tracking-wide flex items-center gap-1.5">
                NEXUS <span className="text-blue-600 dark:text-blue-400 text-xs font-mono font-medium">OS</span>
              </h1>
              <p className="text-[9.5px] text-slate-500 dark:text-zinc-400 font-mono tracking-wider uppercase font-medium">Enterprise Intelligence</p>
            </div>
          </div>

          {/* Navigation Scroll Container */}
          <nav className="p-3 overflow-y-auto flex-1 space-y-2">
            {renderNavItems()}
          </nav>

          {/* Footer Controls */}
          <div className="p-3 border-t border-slate-200/80 dark:border-white/10 space-y-2 shrink-0 bg-slate-50/50 dark:bg-zinc-950/40">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/70 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/10 text-xs">
              <span className="text-[11px] font-medium text-slate-800 dark:text-white flex items-center gap-1.5">
                {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-zinc-300" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                <span>{theme === 'dark' ? 'Dark Monolith' : 'Light Glass'}</span>
              </span>
              <button
                onClick={toggleTheme}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-white dark:text-black transition-all"
              >
                Switch
              </button>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center justify-between px-1">
              <div className="overflow-hidden">
                <p className="text-[11px] font-mono font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.email || 'nexus_operator'}
                </p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono uppercase font-bold">17 Pages Online</span>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Page Body */}
      <main className="flex-1 md:overflow-y-auto min-h-0">
        <Outlet />
      </main>

      <PWAInstallBanner />
    </div>
  );
};

export default MainLayout;
