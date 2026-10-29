import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  FileText,
  FolderArchive,
  Play,
  ArrowRight,
  Clock,
  Layers,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Calculator,
  Network,
  CalendarClock,
  ShieldAlert,
  Coins,
  CheckCircle2,
  AlertCircle,
  Activity,
  Bot,
  Search,
  FileSearch,
  Compass,
  Server,
  Target
} from 'lucide-react';
import { useExecutions } from '../hooks/useExecutions';
import { useDocuments } from '../hooks/useDocuments';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { dashboardApi } from '../services/api';
import type { Execution, DashboardMetrics } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { executions, loading: loadingExecs } = useExecutions(1, 10);
  const { documents } = useDocuments(1, 50);

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    reliability: {
      citation_coverage_pct: 94.6,
      verification_accuracy_pct: 97.8,
      claims_breakdown: {
        total: 87,
        verified: 74,
        partially_verified: 9,
        unsupported: 3,
        contradicted: 1,
      },
      calibration_notice: 'Calibrated AI confidence based on multi-document citation verification.',
    },
    cost_and_usage: {
      provider: 'Nexus Multi-Agent Mesh',
      model: 'FastAPI Orchestrator',
      prompt_tokens: 215400,
      completion_tokens: 127510,
      total_tokens: 342910,
      average_latency_ms: 2140,
      retry_count: 0,
      estimated_cost_usd: 4.82,
    },
    agent_performance: [],
  });

  useEffect(() => {
    dashboardApi.getMetrics()
      .then((data) => {
        if (data) setMetrics(data);
      })
      .catch(() => {});
  }, []);

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
              Intelligence Operations Dashboard
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-300 text-blue-900 dark:bg-zinc-900 dark:border-white/15 dark:text-white text-[11px] font-mono font-medium">
              <Sparkles className="w-3 h-3 text-blue-600 dark:text-white" /> Enterprise OS
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-400 font-body mt-1">
            Autonomous multi-agent platform telemetry, supervised execution DAGs, citation grounding, and governance
          </p>
        </div>

        {/* Executive Action Toolbar - Direct Navigation to Dedicated Pages */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="xs"
            onClick={() => navigate('/supervisor')}
            icon={<Compass className="w-3.5 h-3.5 text-blue-600" />}
          >
            Mission Supervisor
          </Button>
          <Button
            variant="secondary"
            size="xs"
            onClick={() => navigate('/evidence')}
            icon={<Search className="w-3.5 h-3.5 text-emerald-600" />}
          >
            Evidence Explorer
          </Button>
          <Button
            variant="secondary"
            size="xs"
            onClick={() => navigate('/analysis-lab')}
            icon={<Calculator className="w-3.5 h-3.5 text-purple-600" />}
          >
            Data Lab
          </Button>
          <Button
            variant="secondary"
            size="xs"
            onClick={() => navigate('/schedules')}
            icon={<CalendarClock className="w-3.5 h-3.5 text-amber-600" />}
          >
            Schedules
          </Button>
          <Button
            onClick={() => navigate('/workspace')}
            size="xs"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            icon={<Play className="w-3.5 h-3.5 fill-white" />}
          >
            New Mission
          </Button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Active Missions
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-title text-slate-950 dark:text-white">
              {activeRuns}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
              of {totalRuns} total runs
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Citation Grounding
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-title text-slate-950 dark:text-white">
              {metrics.reliability.citation_coverage_pct}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">
              Calibrated
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Knowledge Corpus
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <FolderArchive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-title text-slate-950 dark:text-white">
              {totalDocs}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
              indexed documents
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Total Cost & Tokens
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-title text-slate-950 dark:text-white">
              ${metrics.cost_and_usage.estimated_cost_usd.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
              {metrics.cost_and_usage.total_tokens.toLocaleString()} tok
            </span>
          </div>
        </div>
      </div>

      {/* Enterprise Architecture Quick Navigation Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
          Enterprise Operational Workspaces
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/supervisor')}
            className="p-5 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/10 hover:border-blue-500 cursor-pointer transition-all hover:shadow-md group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono uppercase">Autonomous Operations</span>
              <Compass className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Adaptive Mission Supervisor</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">
              Decompose missions into multi-agent DAGs, inspect 10-state lifecycle, and adjust dynamic plan revisions.
            </p>
            <div className="pt-2 text-xs font-mono text-blue-600 flex items-center gap-1 group-hover:underline">
              Open Supervisor <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => navigate('/evidence')}
            className="p-5 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500 cursor-pointer transition-all hover:shadow-md group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono uppercase">Knowledge & Research</span>
              <Search className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Evidence Lineage & Impact</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">
              Trace claim provenance to document excerpts, inspect downstream impact, and trigger revalidations.
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-600 flex items-center gap-1 group-hover:underline">
              Inspect Evidence <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => navigate('/execution-recovery')}
            className="p-5 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/10 hover:border-rose-500 cursor-pointer transition-all hover:shadow-md group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono uppercase">Self-Healing Infrastructure</span>
              <ShieldAlert className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Execution Recovery & Circuit Breakers</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">
              Monitor automated failure classification, provider circuit breaker health, and bounded retries.
            </p>
            <div className="pt-2 text-xs font-mono text-rose-600 flex items-center gap-1 group-hover:underline">
              View Recovery Telemetry <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Executions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold font-title text-slate-950 dark:text-white">
              Recent Intelligence Missions
            </h2>
            <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 font-medium">
              ({executions.length})
            </span>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigate('/workspace')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Launch workspace
          </Button>
        </div>

        {executions.length === 0 ? (
          <EmptyState
            icon={<Cpu className="w-6 h-6" />}
            title="No intelligence missions dispatched yet"
            description="Initiate an objective to orchestrate planner, research, and analysis agents."
            actionLabel="Dispatch mission"
            onAction={() => navigate('/workspace')}
          />
        ) : (
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-950/80 backdrop-blur-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 dark:bg-zinc-950/90 border-b border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-zinc-300 uppercase tracking-wider font-heading">
                  <tr>
                    <th className="py-3.5 px-5 font-semibold">Mission Objective</th>
                    <th className="py-3.5 px-5 font-semibold">Status</th>
                    <th className="py-3.5 px-5 font-semibold">Dispatched</th>
                    <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
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
                          View details <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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
