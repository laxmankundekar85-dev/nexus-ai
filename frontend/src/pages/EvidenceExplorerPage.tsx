import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  RefreshCw,
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { evidenceApi } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import toast from 'react-hot-toast';
import type { EvidenceLineageItem, ClaimStatus } from '../types';

export const EvidenceExplorerPage: React.FC = () => {
  const [items, setItems] = useState<EvidenceLineageItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<EvidenceLineageItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLineage();
  }, []);

  const loadLineage = async () => {
    setLoading(true);
    try {
      const data = await evidenceApi.listLineage();
      setItems(data);
      if (data.length > 0 && !selectedItem) setSelectedItem(data[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleRevalidate = async (id: string) => {
    try {
      await evidenceApi.revalidateClaim(id);
      toast.success('Claim revalidated against latest source corpus!');
      loadLineage();
    } catch {
      toast.error('Revalidation failed.');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.claim_text.toLowerCase().includes(search.toLowerCase()) ||
      item.sources.some(s => s.document_name.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'verified':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</span>;
      case 'partially_verified':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Partially Verified</span>;
      case 'contradicted':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> Contradicted</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-400">Unsupported</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-title tracking-tight text-slate-950 dark:text-white">
                Evidence Lineage & Impact Analysis
              </h1>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">
                Trace generated claims directly to underlying document passages and assess impact when sources are updated
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={loadLineage}
          icon={<RefreshCw className="w-4 h-4 text-emerald-600" />}
        >
          Refresh Lineage
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search verified claim text or document..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['all', 'verified', 'partially_verified', 'contradicted'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-white/10'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claims Lineage List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredItems.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <Card
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-5 cursor-pointer transition-all border ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/20'
                    : 'hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    <span className="text-[10px] font-mono text-slate-500">ID: {item.claim_id}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {(item.confidence * 100).toFixed(0)}% Confidence
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed mb-3">
                  "{item.claim_text}"
                </p>

                <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>{item.sources[0]?.document_name || 'Corpus Source'} (p. {item.sources[0]?.page || 1})</span>
                  </div>
                  <span>{item.affected_reports.length} Affected Reports</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Lineage & Impact Inspector */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Claim Provenance Inspector
            </h3>

            {selectedItem ? (
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Citing Passage in Source</span>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 font-sans italic leading-relaxed">
                    "{selectedItem.sources[0]?.passage || 'Document citation excerpt indexed in vector database.'}"
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Source Versioning</span>
                  <p className="text-slate-900 dark:text-white font-bold">
                    {selectedItem.sources[0]?.document_name} • v{selectedItem.sources[0]?.version}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Downstream Impact Analysis</span>
                  <div className="space-y-2">
                    {selectedItem.affected_reports.map((rep, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                        <span className="text-slate-900 dark:text-white font-sans text-xs">{rep.report_title}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          rep.impact_severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                          rep.impact_severity === 'high' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {rep.impact_severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handleRevalidate(selectedItem.id)}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Trigger Revalidation
                </Button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-8 text-center">Select a claim to inspect citation provenance.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EvidenceExplorerPage;
