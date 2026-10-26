import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  FileText,
  FolderArchive,
  Play,
  GitFork,
  ArrowRight,
  Clock,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useExecutions } from '../hooks/useExecutions';
import { useDocuments } from '../hooks/useDocuments';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import type { Execution } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { executions, loading: loadingExecs } = useExecutions(1, 10);
  const { documents } = useDocuments(1, 10);

  const totalRuns = executions.length;
  const activeRuns = (executions as Execution[]).filter(
    (e: Execution) => e.status === 'running' || e.status === 'planning' || e.status === 'reviewing'
  ).length;
  const completedRuns = (executions as Execution[]).filter((e: Execution) => e.status === 'completed').length;
  const totalDocs = documents.length;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-200/80 dark:border-sky-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-sky-800 to-sky-600 dark:from-white dark:via-sky-100 dark:to-sky-300 bg-clip-text text-transparent">
              System Overview
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-700 dark:text-sky-300 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-sky-500" /> Glassmorphic v3.0
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Operator: <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{currentUser?.email || 'nexus_operator'}</span>
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Autonomous Pipeline Active
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/workflows')}
            icon={<GitFork className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
          >
            Workflow Builder
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/workspace')}
            icon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            New Execution
          </Button>
        </div>
      </div>

      {/* Metrics Row — Frosted Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Executions */}
        <div className="p-6 rounded-2xl bg-white/75 dark:bg-[#0c182b]/75 backdrop-blur-xl border border-white/80 dark:border-sky-400/25 hover:border-sky-300 dark:hover:border-sky-400/50 transition-all duration-200 shadow-lg shadow-sky-500/5 dark:shadow-black/40 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[11px] text-sky-800/80 dark:text-sky-300/80 uppercase tracking-wider font-bold">Total Executions</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{totalRuns}</h3>
            <div className="flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 font-medium">
              <TrendingUp className="w-3 h-3 text-sky-500" />
              <span>Orchestrated tasks</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/30 group-hover:scale-105 transition-transform shrink-0">
            <Cpu className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Card 2: Active Jobs */}
        <div className="p-6 rounded-2xl bg-white/75 dark:bg-[#0c182b]/75 backdrop-blur-xl border border-white/80 dark:border-sky-400/25 hover:border-sky-300 dark:hover:border-sky-400/50 transition-all duration-200 shadow-lg shadow-sky-500/5 dark:shadow-black/40 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[11px] text-sky-800/80 dark:text-sky-300/80 uppercase tracking-wider font-bold">Active Jobs</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-cyan-100 tracking-tight">{activeRuns}</h3>
            <div className="flex items-center gap-1.5 text-[11px] text-sky-600 dark:text-cyan-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-cyan-400 animate-pulse" />
              <span>Real-time processing</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-sky-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform shrink-0">
            <Clock className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Card 3: Verified Reports */}
        <div className="p-6 rounded-2xl bg-white/75 dark:bg-[#0c182b]/75 backdrop-blur-xl border border-white/80 dark:border-sky-400/25 hover:border-sky-300 dark:hover:border-sky-400/50 transition-all duration-200 shadow-lg shadow-sky-500/5 dark:shadow-black/40 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[11px] text-sky-800/80 dark:text-sky-300/80 uppercase tracking-wider font-bold">Verified Reports</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-emerald-100 tracking-tight">{completedRuns}</h3>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Synthesis ready</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform shrink-0">
            <FileText className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Card 4: Indexed Documents */}
        <div className="p-6 rounded-2xl bg-white/75 dark:bg-[#0c182b]/75 backdrop-blur-xl border border-white/80 dark:border-sky-400/25 hover:border-sky-300 dark:hover:border-sky-400/50 transition-all duration-200 shadow-lg shadow-sky-500/5 dark:shadow-black/40 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[11px] text-sky-800/80 dark:text-sky-300/80 uppercase tracking-wider font-bold">Indexed Documents</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-sky-100 tracking-tight">{totalDocs}</h3>
            <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-sky-400 font-medium">
              <span>Grounding corpus</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform shrink-0">
            <FolderArchive className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Recent Executions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-xs shadow-sky-500/50" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Recent Executions</h2>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigate('/workspace')}
            iconRight={<ArrowRight className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
            className="text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-white font-bold"
          >
            Open Workspace
          </Button>
        </div>

        {executions.length === 0 && !loadingExecs ? (
          <EmptyState
            icon={<Layers className="w-6 h-6 text-sky-500" />}
            title="No executions recorded"
            description="Submit an objective to initiate autonomous multi-agent planning, research, and analysis."
            actionLabel="Start New Execution"
            onAction={() => navigate('/workspace')}
          />
        ) : (
          <div className="bg-white/80 dark:bg-[#0c182b]/80 border border-sky-200/80 dark:border-sky-500/25 rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sky-50/80 dark:bg-[#091526]/80 border-b border-sky-200 dark:border-sky-500/20 text-sky-900 dark:text-sky-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-5 font-bold">Objective</th>
                    <th className="py-3.5 px-5 font-bold">Status</th>
                    <th className="py-3.5 px-5 font-bold">Created</th>
                    <th className="py-3.5 px-5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100 dark:divide-sky-500/15">
                  {(executions as Execution[]).map((exec: Execution) => (
                    <tr
                      key={exec.id}
                      onClick={() => navigate(`/workspace?id=${exec.id}`)}
                      className="hover:bg-sky-50/60 dark:hover:bg-sky-950/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-5 font-semibold text-slate-800 dark:text-slate-100 max-w-md truncate group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                        {exec.objective}
                      </td>
                      <td className="py-3.5 px-5">
                        <StatusBadge status={exec.status} />
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 dark:text-sky-200/70 font-mono text-[11px]">
                        {new Date(exec.created_at).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/15 group-hover:bg-sky-500/25 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-semibold text-xs transition-all">
                          View Live <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
