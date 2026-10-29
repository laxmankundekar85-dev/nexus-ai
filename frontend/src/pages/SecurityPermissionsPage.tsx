import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Key,
  Users,
  Settings2,
  Check,
  X
} from 'lucide-react';
import { securityApi } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import type { AgentToolPermission, PendingToolApproval } from '../types';

export const SecurityPermissionsPage: React.FC = () => {
  const [policies, setPolicies] = useState<AgentToolPermission[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingToolApproval[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentToolPermission | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const pol = await securityApi.getPolicies();
    const app = await securityApi.getPendingApprovals();
    setPolicies(pol);
    setPendingApprovals(app);
    if (pol.length > 0 && !selectedAgent) setSelectedAgent(pol[0]);
  };

  const handleResolve = async (id: string, decision: 'approved' | 'rejected') => {
    await securityApi.resolveApproval(id, decision);
    toast.success(`Operation ${decision} by operator policy.`);
    setPendingApprovals(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-title tracking-tight text-slate-950 dark:text-white">
                Security, Permissions & Human Approvals
              </h1>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">
                Policy-aware agent tool gateways, permission matrices, and human-in-the-loop review queues
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Human Approval Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Pending Human Approvals Queue ({pendingApprovals.length})
          </h2>
        </div>

        {pendingApprovals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApprovals.map((a) => (
              <Card key={a.id} className="p-5 space-y-3 border-amber-500/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{a.tool_name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      a.risk_level === 'high' ? 'bg-rose-100 text-rose-700' :
                      a.risk_level === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {a.risk_level} Risk
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 capitalize">{a.agent_role} Agent</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">{a.reason}</p>

                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-zinc-900 font-mono text-[11px] text-slate-700 dark:text-zinc-300">
                  Target: {a.target_resource}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                  <Button
                    size="xs"
                    onClick={() => handleResolve(a.id, 'approved')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    icon={<Check className="w-3.5 h-3.5" />}
                  >
                    Approve
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleResolve(a.id, 'rejected')}
                    className="flex-1 text-rose-600 hover:bg-rose-50"
                    icon={<X className="w-3.5 h-3.5" />}
                  >
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center text-xs text-slate-500">
            All agent tool calls currently verified. No actions requiring human escalation.
          </Card>
        )}
      </div>

      {/* Agent Tool Gateway Permission Matrix */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" /> Agent Tool Gateway Policies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {policies.map((pol) => (
            <Card key={pol.agent_role} className="p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize">{pol.agent_role} Agent</h3>
                <span className="text-[10px] font-mono text-slate-500">{pol.max_requests_per_minute} req/min</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-emerald-600 font-bold block mb-1">Allowed Tools</span>
                  <div className="flex flex-wrap gap-1">
                    {pol.allowed_tools.map(t => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-amber-600 font-bold block mb-1">Requires Operator Approval</span>
                  <div className="flex flex-wrap gap-1">
                    {pol.requires_approval_tools.map(t => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-rose-600 font-bold block mb-1">Blocked / Forbidden</span>
                  <div className="flex flex-wrap gap-1">
                    {pol.denied_tools.map(t => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityPermissionsPage;
