import React from 'react';
import { clsx } from 'clsx';
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle, Ban } from 'lucide-react';
import type { ExecutionStatus } from '../types';

interface StatusBadgeProps {
  status: ExecutionStatus | string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true }) => {
  const normalized = status.toLowerCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let icon = <Clock className="w-3.5 h-3.5 text-slate-400" />;

  switch (normalized) {
    case 'completed':
    case 'ready':
    case 'approved':
      colorClasses = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs shadow-emerald-500/20';
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      break;
    case 'failed':
    case 'rejected':
      colorClasses = 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-xs shadow-rose-500/20';
      icon = <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      break;
    case 'running':
    case 'processing':
      colorClasses = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-xs shadow-cyan-500/20';
      icon = (
        <span className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <Loader2 className="w-3 h-3 text-cyan-300 animate-spin" />
        </span>
      );
      break;
    case 'planning':
      colorClasses = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-xs shadow-indigo-500/20';
      icon = <Loader2 className="w-3.5 h-3.5 text-indigo-300 animate-spin shrink-0" />;
      break;
    case 'reviewing':
    case 'awaiting_approval':
      colorClasses = 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs shadow-amber-500/20';
      icon = <AlertCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />;
      break;
    case 'cancelled':
      colorClasses = 'bg-slate-800/90 text-slate-400 border-slate-700';
      icon = <Ban className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      break;
    default:
      colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
      icon = <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
  }

  const label = normalized.replace('_', ' ');

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize tracking-wide select-none',
        colorClasses
      )}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
