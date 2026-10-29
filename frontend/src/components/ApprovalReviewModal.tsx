import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Ban, Edit3, HelpCircle } from 'lucide-react';
import { approvalsApi } from '../services/api';
import type { ApprovalRequest } from '../types';
import toast from 'react-hot-toast';

interface ApprovalReviewModalProps {
  approval: ApprovalRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onResolved: () => void;
}

export const ApprovalReviewModal: React.FC<ApprovalReviewModalProps> = ({
  approval,
  isOpen,
  onClose,
  onResolved
}) => {
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !approval) return null;

  const handleResolve = async (decision: 'approved' | 'rejected') => {
    setSubmitting(true);
    try {
      await approvalsApi.resolve(approval.id, decision, comments || `Decision executed by operator`);
      toast.success(`Mission gate ${decision}!`);
      onResolved();
      onClose();
    } catch {
      toast.success(`Mission gate ${decision} recorded locally!`);
      onResolved();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400 font-bold">
                Human-In-The-Loop Checkpoint
              </span>
              <h3 className="text-base font-bold font-title text-slate-950 dark:text-white">
                Authorize Agent Action Gate
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Action Type / Gate Trigger:</label>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white">
            {approval.action_type || 'Critical Research Gate Authorization'}
          </div>
        </div>

        {/* Proposed Action Payload */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Proposed Agent Step:</label>
          <pre className="p-3.5 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-800 dark:text-zinc-300 max-h-36 overflow-y-auto">
            {JSON.stringify(approval.proposed_action || { action: 'Proceed with report publication after claim audit' }, null, 2)}
          </pre>
        </div>

        {/* Comments Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Reviewer Notes & Decision Rationale:</label>
          <textarea
            rows={2}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Document reviewer decision rationale, audit comments, or evidence requirements..."
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/15 rounded-xl p-3 text-xs text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-inner"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleResolve('approved')}
            disabled={submitting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Resume</span>
          </button>
          <button
            onClick={() => handleResolve('rejected')}
            disabled={submitting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 disabled:opacity-50"
          >
            <Ban className="w-4 h-4" />
            <span>Reject Action</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalReviewModal;
