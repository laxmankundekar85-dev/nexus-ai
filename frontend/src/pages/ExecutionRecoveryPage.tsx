import React, { useState, useEffect } from 'react';
import {
  Activity,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Clock,
  Sparkles,
  RefreshCw,
  Zap,
  Server
} from 'lucide-react';
import { recoveryApi } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import type { RecoveryIncident, CircuitBreakerState } from '../types';

export const ExecutionRecoveryPage: React.FC = () => {
  const [incidents, setIncidents] = useState<RecoveryIncident[]>([]);
  const [circuitBreakers, setCircuitBreakers] = useState<CircuitBreakerState[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const inc = await recoveryApi.getIncidents();
      const cb = await recoveryApi.getCircuitBreakers();
      setIncidents(inc);
      setCircuitBreakers(cb);
    } finally {
      setLoading(false);
    }
  };

  const handleResetCircuit = async (providerId: string) => {
    await recoveryApi.resetCircuitBreaker(providerId);
    toast.success('Circuit breaker manually reset to CLOSED state!');
    loadData();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-title tracking-tight text-slate-950 dark:text-white">
                  Self-Healing Execution Recovery
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold">
                  Self-Healing Active
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">
                Automated failure classification, circuit breakers, bounded exponential retries, and checkpoint restoration
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={loadData}
          icon={<RefreshCw className="w-4 h-4 text-rose-600" />}
        >
          Refresh Telemetry
        </Button>
      </div>

      {/* Circuit Breakers Status */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-600" /> AI Provider Circuit Breakers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {circuitBreakers.map((cb) => (
            <Card key={cb.provider_id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{cb.provider_name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  cb.status === 'closed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                  cb.status === 'half_open' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' :
                  'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                }`}>
                  {cb.status}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 space-y-0.5">
                <div>Failures: {cb.failure_count} / {cb.threshold} limit</div>
                <div>Status: {cb.status === 'closed' ? 'Normal Traffic' : 'Tripped / Throttled'}</div>
              </div>
              {cb.status !== 'closed' && (
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => handleResetCircuit(cb.provider_id)}
                  className="w-full mt-2"
                >
                  Reset Circuit
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Self-Healing Incidents Timeline */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Self-Healing Recovery Events
        </h2>

        <div className="space-y-3">
          {incidents.map((inc) => (
            <Card key={inc.id} className="p-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-500/15 text-rose-700 dark:text-rose-400">
                    {inc.failure_class.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{inc.task_name}</h3>
                  <span className="text-[11px] font-mono text-slate-500">({inc.mission_id})</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Strategy Applied: {inc.strategy_applied.replace(/_/g, ' ')}
                </span>
              </div>

              <p className="text-xs font-mono text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/40">
                {inc.error_message}
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                <span>Attempt {inc.attempt_number} of {inc.max_attempts} max retries</span>
                <span>Resolved at: {new Date(inc.timestamp).toLocaleTimeString()}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutionRecoveryPage;
