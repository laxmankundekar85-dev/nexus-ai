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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-title tracking-tight text-slate-950 dark:text-white">
              System Overview
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-300 text-blue-900 dark:bg-zinc-900 dark:border-white/15 dark:text-white text-[11px] font-mono font-medium">
              <Sparkles className="w-3 h-3 text-blue-600 dark:text-white" /> v3.0
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-600 dark:text-zinc-400 font-body">
            <span>
              Operator: <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{currentUser?.email || 'nexus_operator'}</span>
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-medium">
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
            icon={<GitFork className="w-3.5 h-3.5 text-blue-700 dark:text-white" />}
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
        <div className="p-6 rounded-2xl bg-white/75 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/80 dark:border-white/12 hover:border-blue-500/50 dark:hover:border-white/30 transition-all duration-200 shadow-sm flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 uppercase tracking-wider font-heading">Total Executions</p>
            <h3 className="text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">{totalRuns}</h3>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-zinc-400 font-body">
              <TrendingUp className="w-3 h-3 text-blue-600 dark:text-white" />
              <span>Orchestrated tasks</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform shrink-0">
            <Cpu className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Card 2: Active Jobs */}
        <div className="p-6 rounded-2xl bg-white/75 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/80 dark:border-white/12 hover:border-blue-500/50 dark:hover:border-white/30 transition-all duration-200 shadow-sm flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 uppercase tracking-wider font-heading">Active Jobs</p>
            <h3 className="text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">{activeRuns}</h3>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400 font-body">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-white animate-pulse" />
              <span>Real-time processing</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform shrink-0">
            <Clock className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Card 3: Verified Reports */}
        <div className="p-6 rounded-2xl bg-white/75 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/80 dark:border-white/12 hover:border-blue-500/50 dark:hover:border-white/30 transition-all duration-200 shadow-sm flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 uppercase tracking-wider font-heading">Verified Reports</p>
            <h3 className="text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">{completedRuns}</h3>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-body">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Synthesis ready</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform shrink-0">
            <FileText className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Card 4: Indexed Documents */}
        <div className="p-6 rounded-2xl bg-white/75 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/80 dark:border-white/12 hover:border-blue-500/50 dark:hover:border-white/30 transition-all duration-200 shadow-sm flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 uppercase tracking-wider font-heading">Indexed Documents</p>
            <h3 className="text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">{totalDocs}</h3>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-zinc-400 font-body">
              <span>Grounding corpus</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform shrink-0">
            <FolderArchive className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Recent Executions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-white shadow-xs" />
            <h2 className="text-sm font-semibold font-heading text-slate-900 dark:text-slate-100 uppercase tracking-wider">Recent Executions</h2>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigate('/workspace')}
            iconRight={<ArrowRight className="w-3.5 h-3.5 text-blue-700 dark:text-white" />}
            className="text-slate-900 dark:text-white font-medium hover:text-blue-700 dark:hover:text-white"
          >
            Open Workspace
          </Button>
        </div>

        {executions.length === 0 && !loadingExecs ? (
          <EmptyState
            icon={<Layers className="w-6 h-6 text-blue-600 dark:text-white" />}
            title="No executions recorded"
            description="Submit an objective to initiate autonomous multi-agent planning, research, and analysis."
            actionLabel="Start New Execution"
            onAction={() => navigate('/workspace')}
          />
        ) : (
          <div className="bg-white/75 dark:bg-[#0c0c0e]/80 border border-white/80 dark:border-white/12 rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 dark:bg-zinc-950/90 border-b border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-zinc-300 uppercase tracking-wider font-heading">
                  <tr>
                    <th className="py-3.5 px-5 font-semibold">Objective</th>
                    <th className="py-3.5 px-5 font-semibold">Status</th>
                    <th className="py-3.5 px-5 font-semibold">Created</th>
                    <th className="py-3.5 px-5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                  {(executions as Execution[]).map((exec: Execution) => (
                    <tr
                      key={exec.id}
                      onClick={() => navigate(`/workspace?id=${exec.id}`)}
                      className="hover:bg-slate-50/80 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-5 text-slate-900 dark:text-white max-w-md truncate group-hover:text-blue-600 dark:group-hover:text-white transition-colors font-body">
                        {exec.objective}
                      </td>
                      <td className="py-3.5 px-5">
                        <StatusBadge status={exec.status} />
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
                        {new Date(exec.created_at).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 group-hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-medium font-mono border border-blue-200/80 dark:border-blue-900/40 text-xs transition-all">
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
