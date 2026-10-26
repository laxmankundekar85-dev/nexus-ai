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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              System Overview
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium">
              <Sparkles className="w-3 h-3 text-indigo-400" /> v2.4 Live
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400">
            <span>
              Operator: <span className="font-mono text-slate-200 font-semibold">{currentUser?.email || 'nexus_operator'}</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Autonomous Pipeline Active
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/workflows')}
            icon={<GitFork className="w-3.5 h-3.5 text-indigo-400" />}
            className="border-indigo-500/30 hover:border-indigo-400/50 text-indigo-200 bg-[#131e38] hover:bg-[#1b2b50]"
          >
            Workflow Builder
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/workspace')}
            icon={<Play className="w-3.5 h-3.5 fill-current" />}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40"
          >
            New Execution
          </Button>
        </div>
      </div>

      {/* Metrics Row — Vibrant, Eye-Pleasing Modern Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Executions (Electric Indigo) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#131c38] via-[#0e1529] to-[#0a0f1e] border border-indigo-500/30 hover:border-indigo-400/60 transition-all duration-200 shadow-lg shadow-indigo-950/30 hover:shadow-indigo-900/30 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[11px] text-indigo-300/80 uppercase tracking-wider font-semibold">Total Executions</p>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">{totalRuns}</h3>
            <div className="flex items-center gap-1 text-[11px] text-indigo-400/90 font-medium">
              <TrendingUp className="w-3 h-3 text-indigo-400" />
              <span>Orchestrated tasks</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Active Jobs (Cyan / Sky) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c2238] via-[#0e1529] to-[#0a0f1e] border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-200 shadow-lg shadow-cyan-950/30 hover:shadow-cyan-900/30 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[11px] text-cyan-300/80 uppercase tracking-wider font-semibold">Active Jobs</p>
            <h3 className="text-3xl font-extrabold text-cyan-100 tracking-tight">{activeRuns}</h3>
            <div className="flex items-center gap-1 text-[11px] text-cyan-400/90 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Real-time processing</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Verified Reports (Emerald / Mint) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c2826] via-[#0e1529] to-[#0a0f1e] border border-emerald-500/30 hover:border-emerald-400/60 transition-all duration-200 shadow-lg shadow-emerald-950/30 hover:shadow-emerald-900/30 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[11px] text-emerald-300/80 uppercase tracking-wider font-semibold">Verified Reports</p>
            <h3 className="text-3xl font-extrabold text-emerald-100 tracking-tight">{completedRuns}</h3>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400/90 font-medium">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Synthesis ready</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Indexed Documents (Amber / Gold) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#291e13] via-[#0e1529] to-[#0a0f1e] border border-amber-500/30 hover:border-amber-400/60 transition-all duration-200 shadow-lg shadow-amber-950/30 hover:shadow-amber-900/30 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[11px] text-amber-300/80 uppercase tracking-wider font-semibold">Indexed Documents</p>
            <h3 className="text-3xl font-extrabold text-amber-100 tracking-tight">{totalDocs}</h3>
            <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-medium">
              <span>Grounding corpus</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <FolderArchive className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Executions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Recent Executions</h2>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigate('/workspace')}
            iconRight={<ArrowRight className="w-3.5 h-3.5 text-indigo-400" />}
            className="text-indigo-300 hover:text-white hover:bg-indigo-500/10 font-semibold"
          >
            Open Workspace
          </Button>
        </div>

        {executions.length === 0 && !loadingExecs ? (
          <EmptyState
            icon={<Layers className="w-6 h-6 text-indigo-400" />}
            title="No executions recorded"
            description="Submit an objective to initiate autonomous multi-agent planning, research, and analysis."
            actionLabel="Start New Execution"
            onAction={() => navigate('/workspace')}
          />
        ) : (
          <div className="bg-[#0e162c]/90 border border-slate-700/60 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121c38] border-b border-slate-700/70 text-indigo-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-5 font-semibold">Objective</th>
                    <th className="py-3.5 px-5 font-semibold">Status</th>
                    <th className="py-3.5 px-5 font-semibold">Created</th>
                    <th className="py-3.5 px-5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {(executions as Execution[]).map((exec: Execution) => (
                    <tr
                      key={exec.id}
                      onClick={() => navigate(`/workspace?id=${exec.id}`)}
                      className="hover:bg-indigo-950/30 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-5 font-medium text-slate-100 max-w-md truncate group-hover:text-indigo-300 transition-colors">
                        {exec.objective}
                      </td>
                      <td className="py-3 px-5">
                        <StatusBadge status={exec.status} />
                      </td>
                      <td className="py-3 px-5 text-slate-400 font-mono text-[11px]">
                        {new Date(exec.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-5 text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-500/15 group-hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 font-medium text-xs transition-colors">
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
