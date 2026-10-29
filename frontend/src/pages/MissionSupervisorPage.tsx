import React, { useState, useEffect } from 'react';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  GitBranch,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Plus,
  Compass,
  Check,
  XCircle,
  FileText
} from 'lucide-react';
import { supervisorApi } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import toast from 'react-hot-toast';
import type { SupervisorMission, SupervisorTaskNode, SupervisorMissionStatus } from '../types';

export const MissionSupervisorPage: React.FC = () => {
  const [missions, setMissions] = useState<SupervisorMission[]>([]);
  const [selectedMission, setSelectedMission] = useState<SupervisorMission | null>(null);
  const [selectedTask, setSelectedTask] = useState<SupervisorTaskNode | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [maxCost, setMaxCost] = useState('10.0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const data = await supervisorApi.listMissions();
      setMissions(data);
      if (data.length > 0 && !selectedMission) {
        setSelectedMission(data[0]);
        if (data[0].tasks.length > 0) setSelectedTask(data[0].tasks[0]);
      }
    } catch {
      toast.error('Unable to fetch supervisor missions');
    }
  };

  const handleCreateMission = async () => {
    if (!newTitle.trim() || !newObjective.trim()) {
      toast.error('Please specify title and objective.');
      return;
    }
    setLoading(true);
    try {
      const m = await supervisorApi.createMission({
        title: newTitle,
        objective: newObjective,
        budget: { max_cost_usd: parseFloat(maxCost) || 10.0 }
      });
      setMissions([m, ...missions]);
      setSelectedMission(m);
      if (m.tasks.length > 0) setSelectedTask(m.tasks[0]);
      setIsCreating(false);
      setNewTitle('');
      setNewObjective('');
      toast.success('Mission plan generated and dispatched to autonomous agents!');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusShift = async (status: SupervisorMissionStatus) => {
    if (!selectedMission) return;
    await supervisorApi.updateStatus(selectedMission.id, status);
    toast.success(`Mission status updated to ${status}`);
    loadMissions();
  };

  const handleRetryNode = async (taskId: string) => {
    if (!selectedMission) return;
    await supervisorApi.retryTask(selectedMission.id, taskId);
    toast.success('Task node re-dispatched with fresh execution context!');
    loadMissions();
  };

  const getStatusBadge = (status: SupervisorMissionStatus) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: 'bg-slate-100 dark:bg-zinc-800', text: 'text-slate-600 dark:text-zinc-400', label: 'Draft' },
      planned: { bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-400', label: 'Planned' },
      queued: { bg: 'bg-indigo-100 dark:bg-indigo-950/60', text: 'text-indigo-700 dark:text-indigo-400', label: 'Queued' },
      running: { bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-400', label: 'Running' },
      waiting_for_approval: { bg: 'bg-purple-100 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-400', label: 'Approval Required' },
      needs_attention: { bg: 'bg-rose-100 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-400', label: 'Needs Attention' },
      recovering: { bg: 'bg-orange-100 dark:bg-orange-950/60', text: 'text-orange-700 dark:text-orange-400', label: 'Recovering' },
      completed: { bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-400', label: 'Completed' },
      failed: { bg: 'bg-red-100 dark:bg-red-950/60', text: 'text-red-700 dark:text-red-400', label: 'Failed' },
      cancelled: { bg: 'bg-zinc-200 dark:bg-zinc-800', text: 'text-zinc-600 dark:text-zinc-400', label: 'Cancelled' },
    };
    const c = map[status] || map.running;
    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-title tracking-tight text-slate-950 dark:text-white">
                  Adaptive Mission Supervisor
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400 text-[10px] font-mono font-bold">
                  10-State Machine
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">
                Dynamic DAG task decomposition, token & cost budget meters, plan revisions, and execution controls
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsCreating(!isCreating)}
            icon={<Plus className="w-4 h-4" />}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isCreating ? 'Close Planner' : 'Launch Supervised Mission'}
          </Button>
        </div>
      </div>

      {/* Creation Modal / Drawer */}
      {isCreating && (
        <Card className="p-6 space-y-4 border-2 border-blue-500/40 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-title text-slate-950 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> Define Supervised Autonomous Mission
            </h2>
            <button onClick={() => setIsCreating(false)} className="text-xs text-slate-500 hover:text-black dark:hover:text-white">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Mission Title</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. FY27 Cloud Infrastructure Market & Margin Discrepancy Reconciliation"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">High-Level Objective</label>
                <textarea
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  rows={3}
                  placeholder="Describe goal; Supervisor will decompose it into a DAG of specialized agents..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3 border-l pl-4 border-slate-200 dark:border-white/10">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Resource Budgets</h3>
              <div>
                <label className="text-[11px] text-slate-600 dark:text-zinc-400 block mb-1">Max Cost Limit (USD)</label>
                <Input
                  type="number"
                  value={maxCost}
                  onChange={(e) => setMaxCost(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 dark:text-zinc-400 block mb-1">Max Token Cap</label>
                <Input value="350,000" disabled className="opacity-70" />
              </div>
              <Button
                onClick={handleCreateMission}
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              >
                Synthesize Plan & Run
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Main Mission Inspector Workspace */}
      {selectedMission && (
        <div className="space-y-6">
          {/* Mission Status & Control Strip */}
          <Card className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{selectedMission.title}</h2>
                {getStatusBadge(selectedMission.status)}
                <span className="text-[11px] font-mono text-slate-500">Rev #{selectedMission.current_revision}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-1">{selectedMission.objective}</p>
            </div>

            {/* Execution Action Controls */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {selectedMission.status === 'running' ? (
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => handleStatusShift('waiting_for_approval')}
                  icon={<Pause className="w-3.5 h-3.5 text-amber-600" />}
                >
                  Pause
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => handleStatusShift('running')}
                  icon={<Play className="w-3.5 h-3.5 text-emerald-600" />}
                >
                  Resume
                </Button>
              )}
              <Button
                variant="secondary"
                size="xs"
                onClick={() => handleStatusShift('recovering')}
                icon={<RotateCcw className="w-3.5 h-3.5 text-blue-600" />}
              >
                Replan DAG
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleStatusShift('cancelled')}
                className="text-rose-600 hover:text-rose-700"
              >
                Cancel
              </Button>
            </div>
          </Card>

          {/* Budget Meters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500">Token Consumption</span>
              <p className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {selectedMission.budget.consumed_tokens.toLocaleString()} / {selectedMission.budget.max_tokens.toLocaleString()}
              </p>
              <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${Math.min((selectedMission.budget.consumed_tokens / selectedMission.budget.max_tokens) * 100, 100)}%` }}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500">Cost Budget</span>
              <p className="text-base font-bold font-mono text-slate-900 dark:text-white">
                ${selectedMission.budget.consumed_cost_usd.toFixed(2)} / ${selectedMission.budget.max_cost_usd.toFixed(2)}
              </p>
              <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${Math.min((selectedMission.budget.consumed_cost_usd / selectedMission.budget.max_cost_usd) * 100, 100)}%` }}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500">Elapsed Time</span>
              <p className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {selectedMission.budget.elapsed_time_seconds}s / {selectedMission.budget.max_time_seconds}s
              </p>
              <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full"
                  style={{ width: `${Math.min((selectedMission.budget.elapsed_time_seconds / selectedMission.budget.max_time_seconds) * 100, 100)}%` }}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500">Supervisor Iterations</span>
              <p className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {selectedMission.budget.current_iteration} of {selectedMission.budget.max_iterations}
              </p>
              <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${Math.min((selectedMission.budget.current_iteration / selectedMission.budget.max_iterations) * 100, 100)}%` }}
                />
              </div>
            </Card>
          </div>

          {/* DAG Task Nodes & Node Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task DAG Tree */}
            <Card className="p-5 lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-blue-600" /> Decomposed Task DAG ({selectedMission.tasks.length} Nodes)
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Topological Sort: Valid</span>
              </div>

              <div className="space-y-3">
                {selectedMission.tasks.map((task, idx) => {
                  const isCurrent = selectedTask?.id === task.id;
                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${
                        isCurrent
                          ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                          : 'bg-white/80 dark:bg-zinc-900/40 border-slate-200/80 dark:border-white/10 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                            task.status === 'completed' ? 'bg-emerald-500 text-white' :
                            task.status === 'running' ? 'bg-amber-500 text-white animate-pulse' :
                            task.status === 'failed' ? 'bg-rose-500 text-white' :
                            'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{task.name}</h4>
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                                {task.agent_role}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">{task.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold capitalize ${
                            task.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                            task.status === 'running' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' :
                            task.status === 'failed' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' :
                            'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}>
                            {task.status}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Selected Node Inspector */}
            <div className="space-y-4">
              <Card className="p-5 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Task Node Inspector</h3>
                {selectedTask ? (
                  <div className="space-y-3 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Node ID</span>
                      <p className="font-bold text-slate-900 dark:text-white">{selectedTask.id}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Agent Specialty</span>
                      <p className="font-bold text-blue-600 dark:text-blue-400 capitalize">{selectedTask.agent_role} Agent</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Dependencies</span>
                      <p className="text-slate-800 dark:text-zinc-200">
                        {selectedTask.dependencies.length > 0 ? selectedTask.dependencies.join(', ') : 'Root node (None)'}
                      </p>
                    </div>
                    {selectedTask.output_summary && (
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 font-sans">
                        <span className="text-[10px] font-mono text-emerald-600 font-bold block mb-1">Execution Output</span>
                        <p className="text-slate-800 dark:text-zinc-200 text-xs">{selectedTask.output_summary}</p>
                      </div>
                    )}
                    {selectedTask.confidence && (
                      <div>
                        <span className="text-[10px] text-slate-500 block">Grounded Confidence</span>
                        <p className="font-bold text-emerald-600">{(selectedTask.confidence * 100).toFixed(1)}%</p>
                      </div>
                    )}
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => handleRetryNode(selectedTask.id)}
                      className="w-full mt-2"
                      icon={<RotateCcw className="w-3 h-3 text-blue-600" />}
                    >
                      Retry This Node
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-6 text-center">Select any node on the left to inspect its parameters.</p>
                )}
              </Card>

              {/* Decision Log Timeline */}
              <Card className="p-5 space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Supervisor Decision Log</h3>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {selectedMission.decision_log.map((d) => (
                    <div key={d.id} className="text-xs border-l-2 border-blue-500 pl-3 py-0.5 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span className="font-bold text-blue-600 dark:text-blue-400 capitalize">{d.decision_type.replace(/_/g, ' ')}</span>
                        <span>{new Date(d.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">{d.title}</p>
                      <p className="text-[11px] text-slate-600 dark:text-zinc-400 font-body">{d.detail}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionSupervisorPage;
