import React from 'react';
import { AlertCircle, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { ContradictionAlert } from '../types';

interface ContradictionAlertCardProps {
  contradiction: ContradictionAlert;
  onRouteToReviewer?: () => void;
}

export const ContradictionAlertCard: React.FC<ContradictionAlertCardProps> = ({
  contradiction,
  onRouteToReviewer
}) => {
  return (
    <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-heading font-bold text-xs text-amber-800 dark:text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Contradiction Detected: "{contradiction.parameter}"</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 border border-amber-500/30">
          Unresolved Discrepancy
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-white/70 dark:bg-black/40 border border-amber-500/20 space-y-1">
          <span className="text-[10px] uppercase text-slate-500 dark:text-zinc-400 font-bold">Source A: {contradiction.claim_a.source}</span>
          <p className="font-bold text-slate-900 dark:text-white">{contradiction.claim_a.text}</p>
          <p className="text-[10px] text-slate-400">Reliability: {(contradiction.claim_a.reliability * 100).toFixed(0)}% • Date: {contradiction.claim_a.date?.slice(0, 10)}</p>
        </div>

        <div className="p-3 rounded-xl bg-white/70 dark:bg-black/40 border border-amber-500/20 space-y-1">
          <span className="text-[10px] uppercase text-slate-500 dark:text-zinc-400 font-bold">Source B: {contradiction.claim_b.source}</span>
          <p className="font-bold text-slate-900 dark:text-white">{contradiction.claim_b.text}</p>
          <p className="text-[10px] text-slate-400">Reliability: {(contradiction.claim_b.reliability * 100).toFixed(0)}% • Date: {contradiction.claim_b.date?.slice(0, 10)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-[11px] text-slate-600 dark:text-zinc-400">
          Policy: Nexus AI never silently resolves conflicting assertions.
        </p>
        {onRouteToReviewer && (
          <button
            onClick={onRouteToReviewer}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            Route to Human Reviewer
          </button>
        )}
      </div>
    </div>
  );
};

export default ContradictionAlertCard;
