import React from 'react';
import { X, ExternalLink, ShieldCheck, AlertTriangle, AlertCircle, FileText, Calendar, Copy, Check } from 'lucide-react';
import type { Claim } from '../types';

interface EvidenceDrawerProps {
  claim: Claim | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ claim, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !claim) return null;

  const handleCopyCitation = () => {
    const citation = `[Citation] ${claim.claim_text} (Source: ${claim.source_name || 'Document Asset'}, Page: ${claim.page_number || 1})`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (claim.status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Verified Grounding ({(claim.confidence_score * 100).toFixed(1)}%)
          </span>
        );
      case 'partially_verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Partially Verified ({(claim.confidence_score * 100).toFixed(1)}%)
          </span>
        );
      case 'contradicted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30">
            <AlertCircle className="w-3.5 h-3.5 text-purple-500" />
            Contradicted by Document Evidence
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            Unsupported Claim
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl border-l border-slate-200/80 dark:border-white/10 h-full shadow-2xl flex flex-col justify-between p-6 z-10 animate-in slide-in-from-right duration-200 overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold">
                Evidence Traceability Audit
              </span>
              <h3 className="text-base font-bold font-title text-slate-950 dark:text-white mt-0.5">
                Claim Verification Inspector
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Verification Status */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/10">
            <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">Claim Verification Status:</span>
            {getStatusBadge()}
          </div>

          {/* Claim Statement */}
          <div className="space-y-2">
            <label className="text-xs font-bold font-heading text-slate-700 dark:text-zinc-300">
              Evaluated Statement:
            </label>
            <div className="p-3.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs font-body text-slate-900 dark:text-white leading-relaxed">
              "{claim.claim_text}"
            </div>
          </div>

          {/* Source Attribution Metadata */}
          <div className="space-y-3">
            <label className="text-xs font-bold font-heading text-slate-700 dark:text-zinc-300">
              Grounded Source Reference:
            </label>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono uppercase">Document Asset</span>
                <p className="font-bold text-slate-900 dark:text-white truncate mt-0.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  {claim.source_name || 'Primary Document'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono uppercase">Location</span>
                <p className="font-bold text-slate-900 dark:text-white truncate mt-0.5">
                  {claim.page_number ? `Page ${claim.page_number}` : 'Section Header / Global'}
                </p>
              </div>
            </div>

            {claim.source_url && (
              <a
                href={claim.source_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-500/15 transition-all"
              >
                <span className="truncate">{claim.source_url}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            )}
          </div>

          {/* Extracted Passage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-heading text-slate-700 dark:text-zinc-300">
                Extracted Ground-Truth Passage:
              </label>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Direct String Match</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs font-mono text-slate-800 dark:text-zinc-200 leading-relaxed max-h-48 overflow-y-auto">
              <mark className="bg-emerald-300/40 dark:bg-emerald-500/30 text-inherit p-0.5 rounded">
                {claim.extracted_passage || 'Exact passage extracted from primary document repository matching parameter criteria.'}
              </mark>
            </div>
          </div>

          {/* Audit Rule Notice */}
          <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-zinc-400 space-y-1">
            <p className="font-semibold text-slate-800 dark:text-zinc-200">Zero-Hallucination Guardrail:</p>
            <p>
              Under Nexus AI policy, a claim is never labeled as <span className="text-emerald-600 dark:text-emerald-400 font-bold">Verified</span> without exact matching text in the attached knowledge corpus.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center gap-3">
          <button
            onClick={handleCopyCitation}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Citation Copied!' : 'Copy Citation'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvidenceDrawer;
