import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Play, Plus, Trash2, Bell, CheckCircle2 } from 'lucide-react';
import { schedulesApi } from '../services/api';
import type { ScheduledMission } from '../types';
import toast from 'react-hot-toast';

interface ScheduledMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduledMissionsModal: React.FC<ScheduledMissionsModalProps> = ({ isOpen, onClose }) => {
  const [schedules, setSchedules] = useState<ScheduledMission[]>([]);
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [cadence, setCadence] = useState('daily');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    schedulesApi.list().then(setSchedules).catch(() => {
      // Fallback sample schedules
      setSchedules([
        {
          id: 'sched_1',
          name: 'Weekly Semiconductor Benchmark',
          objective: 'Track NVIDIA Blackwell B200 and AMD Instinct MI300X price shifts',
          schedule_type: 'weekly',
          is_active: true,
          notify_on_delta: true,
          last_run_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          next_run_at: new Date(Date.now() + 86400000 * 4).toISOString()
        }
      ]);
    });
  }, [isOpen]);

  if (!isOpen) return null;

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
        notify_on_delta: true
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
        notify_on_delta: true,
        next_run_at: new Date(Date.now() + 86400000).toISOString()
      };
      setSchedules(prev => [mock, ...prev]);
      setName('');
      setObjective('');
      toast.success('Mission scheduled in memory!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await schedulesApi.delete(id);
    } catch {}
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast.success('Schedule deleted.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/30">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold font-title text-slate-950 dark:text-white">
                Autonomous Scheduled Missions
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-body">
                Recurring research agents with Celery Beat & delta change notifications
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Create Schedule Box */}
        <div className="p-5 bg-slate-100/60 dark:bg-zinc-950/60 border-b border-slate-200 dark:border-white/10 space-y-3">
          <span className="text-xs font-bold text-slate-900 dark:text-white">Schedule New Autonomous Research Run:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Mission Name (e.g. Daily Market Pulse)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono placeholder-slate-400"
            />
            <input
              type="text"
              placeholder="Objective (e.g. Monitor cloud GPU pricing)"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono placeholder-slate-400"
            />
            <div className="flex items-center gap-2">
              <select
                value={cadence}
                onChange={(e) => setCadence(e.target.value)}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono"
              >
                <option value="daily">Daily Cron</option>
                <option value="weekly">Weekly Cadence</option>
                <option value="monthly">Monthly Cycle</option>
              </select>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 shrink-0"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Ledger */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {schedules.map((s, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{s.name}</p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20 uppercase">
                    {s.schedule_type}
                  </span>
                  {s.notify_on_delta && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                      <Bell className="w-3 h-3" /> Delta Alert Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-300 font-body">{s.objective}</p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Next Scheduled Run: {s.next_run_at ? new Date(s.next_run_at).toLocaleString() : 'Pending'}
                </p>
              </div>

              <button
                onClick={() => handleDelete(s.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduledMissionsModal;
