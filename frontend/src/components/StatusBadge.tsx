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

  let colorClasses = 'bg-slate-800/80 text-slate-300 border-slate-700';
  let icon = <Clock className="w-3 h-3 text-slate-400" />;

  switch (normalized) {
    case 'completed':
    case 'ready':
    case 'approved':
      colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      icon = <CheckCircle2 className="w-3 h-3 text-emerald-400" />;
      break;
    case 'failed':
    case 'rejected':
      colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/25';
      icon = <XCircle className="w-3 h-3 text-rose-400" />;
      break;
    case 'running':
    case 'processing':
      colorClasses = 'bg-blue-500/10 text-blue-400 border-blue-500/25';
      icon = <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />;
      break;
    case 'planning':
      colorClasses = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25';
      icon = <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />;
      break;
    case 'reviewing':
      colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/25';
      icon = <AlertCircle className="w-3 h-3 text-amber-400" />;
      break;
    case 'awaiting_approval':
      colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/25';
      icon = <AlertCircle className="w-3 h-3 text-amber-400" />;
      break;
    case 'cancelled':
      colorClasses = 'bg-slate-800 text-slate-400 border-slate-700';
      icon = <Ban className="w-3 h-3 text-slate-500" />;
      break;
    default:
      colorClasses = 'bg-slate-800/80 text-slate-400 border-slate-700';
      icon = <Clock className="w-3 h-3 text-slate-400" />;
  }

  const label = normalized.replace('_', ' ');

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border capitalize tracking-wide',
        colorClasses
      )}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
