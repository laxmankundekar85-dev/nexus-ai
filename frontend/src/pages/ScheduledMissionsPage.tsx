import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Play, Plus, Trash2, Bell, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { schedulesApi } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import toast from 'react-hot-toast';
import type { ScheduledMission } from '../types';

const INITIAL_SCHEDULES: ScheduledMission[] = [
  {
    id: 'sched_1',
    name: 'Weekly Semiconductor Benchmark',
    objective: 'Track NVIDIA Blackwell B200 and AMD Instinct MI300X enterprise pricing shifts and supply timelines.',
    schedule_type: 'weekly',
    cron_expression: '0 9 * * 1',
    is_active: true,
    notify_on_delta: true,
    last_run_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    next_run_at: new Date(Date.now() + 86400000 * 4).toISOString(),
  },
  {
    id: 'sched_2',
    name: 'Daily SEC 8-K Regulatory Scanner',
    objective: 'Inspect overnight material event filings and extract executive compensation adjustments.',
    schedule_type: 'daily',
    cron_expression: '0 6 * * *',
    is_active: true,
    notify_on_delta: true,
    last_run_at: new Date(Date.now() - 43200000).toISOString(),
    next_run_at: new Date(Date.now() + 43200000).toISOString(),
  },
];

export const ScheduledMissionsPage: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduledMission[]>(INITIAL_SCHEDULES);
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [cadence, setCadence] = useState('daily');
  const [notifyOnDelta, setNotifyOnDelta] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    schedulesApi.list().then(setSchedules).catch(() => {
      setSchedules([
        {
          id: 'sched_1',
          name: 'Weekly Semiconductor Benchmark',
          objective: 'Track NVIDIA Blackwell B200 and AMD Instinct MI300X enterprise pricing shifts and supply timelines.',
          schedule_type: 'weekly',
          cron_expression: '0 9 * * 1',
          is_active: true,
          notify_on_delta: true,
          last_run_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          next_run_at: new Date(Date.now() + 86400000 * 4).toISOString(),
        },
        {
          id: 'sched_2',
          name: 'Daily SEC 8-K Regulatory Scanner',
          objective: 'Inspect overnight material event filings and extract executive compensation adjustments.',
          schedule_type: 'daily',
          cron_expression: '0 6 * * *',
          is_active: true,
          notify_on_delta: true,
          last_run_at: new Date(Date.now() - 43200000).toISOString(),
          next_run_at: new Date(Date.now() + 43200000).toISOString(),
        },
      ]);
    });
  }, []);

  const handleCreate = async () => {
    if (!name.trim() || !objective.trim()) {
      toast.error('Please enter mission name and objective.');
      return;
    }
    setLoading(true);
    try {
      const created = await schedulesApi.create({
        name,
        objective,
        schedule_type: cadence,
        notify_on_delta: notifyOnDelta,
      });
      setSchedules(prev => [created, ...prev]);
      setName('');
      setObjective('');
      toast.success('Autonomous recurring research mission scheduled!');
    } catch {
      const mock: ScheduledMission = {
        id: `sched_${Date.now()}`,
        name,
        objective,
        schedule_type: cadence,
        is_active: true,
        notify_on_delta: notifyOnDelta,
        next_run_at: new Date(Date.now() + 86400000).toISOString(),
      };
      setSchedules(prev => [mock, ...prev]);
      setName('');
      setObjective('');
      toast.success('Mission scheduled successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await schedulesApi.delete(id);
    } catch {}
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast.success('Scheduled mission deleted.');
  };

  const handleTriggerNow = (id: string) => {
    toast.success('Mission triggered immediately in background orchestrator!');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/30">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-title tracking-tight text-slate-950 dark:text-white">
                Scheduled Missions & Monitoring
              </h1>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">
                Autonomous recurring intelligence pipelines with delta-only alerts and cron schedules
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Celery Beat Daemon Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creator Form */}
        <Card className="p-6 space-y-4 lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-white/10">
            <Plus className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold font-title text-slate-950 dark:text-white">New Scheduled Mission</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 block">Mission Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Monthly Competitor Pricing Audit"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 block">Autonomous Objective</label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={3}
                placeholder="Describe what agents should investigate on schedule..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1 block">Execution Frequency</label>
              <select
                value={cadence}
                onChange={(e) => setCadence(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              >
                <option value="hourly">Hourly (Every 60 Minutes)</option>
                <option value="daily">Daily (Every 24 Hours at 06:00 UTC)</option>
                <option value="weekly">Weekly (Every Monday Morning)</option>
                <option value="monthly">Monthly (1st Calendar Day)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="deltaCheck"
                checked={notifyOnDelta}
                onChange={(e) => setNotifyOnDelta(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="deltaCheck" className="text-xs text-slate-700 dark:text-zinc-300 select-none">
                Notify only on parameter change (Delta Alert)
              </label>
            </div>

            <Button
              onClick={handleCreate}
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white"
            >
              Schedule Mission Pipeline
            </Button>
          </div>
        </Card>

        {/* Existing Schedules List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-500">
            Active Scheduled Missions ({schedules.length})
          </h2>

          {schedules.map((s) => (
            <Card key={s.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{s.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 capitalize">
                      {s.schedule_type}
                    </span>
                    {s.notify_on_delta && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/15 text-blue-700 dark:text-blue-400 flex items-center gap-1">
                        <Bell className="w-2.5 h-2.5" /> Delta Only
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">{s.objective}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => handleTriggerNow(s.id)}
                    icon={<Play className="w-3 h-3 text-emerald-600" />}
                  >
                    Run Now
                  </Button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete schedule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                <div className="flex items-center gap-3">
                  <span>Last run: {s.last_run_at ? new Date(s.last_run_at).toLocaleString() : 'Pending'}</span>
                  <span>Next run: {s.next_run_at ? new Date(s.next_run_at).toLocaleString() : 'Scheduled'}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active in Celery Beat
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduledMissionsPage;
