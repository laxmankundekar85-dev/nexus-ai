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
    'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  let icon = <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />;

  switch (normalized) {
    case 'completed':
    case 'ready':
    case 'approved':
      colorClasses =
        'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 shadow-xs shadow-emerald-500/10';
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      break;
    case 'failed':
    case 'rejected':
      colorClasses =
        'bg-rose-500/15 text-rose-700 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40 shadow-xs shadow-rose-500/10';
      icon = <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />;
      break;
    case 'running':
    case 'processing':
      colorClasses =
        'bg-sky-500/15 text-sky-700 border-sky-500/35 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/40 shadow-xs shadow-sky-500/15';
      icon = (
        <span className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-ping" />
          <Loader2 className="w-3 h-3 text-sky-600 dark:text-sky-300 animate-spin" />
        </span>
      );
      break;
    case 'planning':
      colorClasses =
        'bg-blue-500/15 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40 shadow-xs shadow-blue-500/15';
      icon = <Loader2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-300 animate-spin shrink-0" />;
      break;
    case 'reviewing':
    case 'awaiting_approval':
      colorClasses =
        'bg-amber-500/15 text-amber-700 border-amber-500/35 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 shadow-xs shadow-amber-500/15';
      icon = <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300 shrink-0" />;
      break;
    case 'cancelled':
      colorClasses =
        'bg-slate-200/80 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      icon = <Ban className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />;
      break;
    default:
      colorClasses =
        'bg-sky-50 text-sky-800 border-sky-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      icon = <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-slate-400 shrink-0" />;
  }

  const label = normalized.replace('_', ' ');

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize tracking-wide select-none backdrop-blur-xs',
        colorClasses
      )}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
