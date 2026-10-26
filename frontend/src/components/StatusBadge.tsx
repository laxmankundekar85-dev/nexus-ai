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

  let colorClasses =
    'bg-slate-200 text-slate-900 border-slate-300 dark:bg-zinc-900 dark:text-zinc-300 dark:border-white/15';
  let icon = <Clock className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400 shrink-0" />;

  switch (normalized) {
    case 'completed':
    case 'ready':
    case 'approved':
      colorClasses =
        'bg-emerald-100 text-emerald-950 font-bold border-emerald-300 dark:bg-zinc-900 dark:text-emerald-300 dark:border-emerald-500/30 shadow-xs';
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />;
      break;
    case 'failed':
    case 'rejected':
      colorClasses =
        'bg-rose-100 text-rose-950 font-bold border-rose-300 dark:bg-zinc-900 dark:text-rose-300 dark:border-rose-500/30 shadow-xs';
      icon = <XCircle className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400 shrink-0" />;
      break;
    case 'running':
    case 'processing':
      colorClasses =
        'bg-blue-100 text-blue-950 font-bold border-blue-400 dark:bg-zinc-900 dark:text-white dark:border-white/20 shadow-xs';
      icon = (
        <span className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-white animate-ping" />
          <Loader2 className="w-3 h-3 text-blue-700 dark:text-white animate-spin" />
        </span>
      );
      break;
    case 'planning':
      colorClasses =
        'bg-blue-100 text-blue-950 font-bold border-blue-400 dark:bg-zinc-900 dark:text-white dark:border-white/20 shadow-xs';
      icon = <Loader2 className="w-3.5 h-3.5 text-blue-700 dark:text-white animate-spin shrink-0" />;
      break;
    case 'reviewing':
    case 'awaiting_approval':
      colorClasses =
        'bg-amber-100 text-amber-950 font-bold border-amber-300 dark:bg-zinc-900 dark:text-amber-300 dark:border-amber-500/30 shadow-xs';
      icon = <AlertCircle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 shrink-0" />;
      break;
    case 'cancelled':
      colorClasses =
        'bg-slate-200 text-slate-800 font-semibold border-slate-300 dark:bg-zinc-900 dark:text-zinc-400 dark:border-white/10';
      icon = <Ban className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400 shrink-0" />;
      break;
    default:
      colorClasses =
        'bg-slate-200 text-slate-900 font-semibold border-slate-300 dark:bg-zinc-900 dark:text-zinc-300 dark:border-white/15';
      icon = <Clock className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400 shrink-0" />;
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all',
        colorClasses
      )}
    >
      {showIcon && icon}
      <span className="capitalize">{normalized.replace('_', ' ')}</span>
    </span>
  );
};

export default StatusBadge;
