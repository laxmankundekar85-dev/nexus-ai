import React, { useState, useEffect } from 'react';
import {
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Database,
  ExternalLink,
  ShieldCheck,
  Layers,
  Sparkles
} from 'lucide-react';
import { freshnessApi } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import type { SourceFreshnessItem } from '../types';

export const SourceFreshnessPage: React.FC = () => {
  const [sources, setSources] = useState<SourceFreshnessItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    setLoading(true);
    try {
      const data = await freshnessApi.listSources();
      setSources(data);
    } finally {
      setLoading(false);
    }
  };

  const handleReingest = async (id: string) => {
    try {
      await freshnessApi.triggerReingestion(id);
      toast.success('Source re-ingestion and vector synchronization triggered!');
      loadSources();
    } catch {
      toast.error('Reingestion failed.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'fresh':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Fresh</span>;
      case 'needs_review':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Needs Review</span>;
      case 'stale':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Stale</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700">Missing</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/30">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-title tracking-tight text-slate-950 dark:text-white">
                Source Freshness Monitor
              </h1>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">
                Track corpus ingestion recency, detect stale data dependencies, and trigger automatic revalidation
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={loadSources}
          icon={<RefreshCw className="w-4 h-4 text-cyan-600" />}
        >
          Check All Feeds
        </Button>
      </div>

      {/* Freshness Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Total Feeds Monitored</span>
          <p className="text-xl font-bold font-mono text-slate-950 dark:text-white">{sources.length}</p>
        </Card>
        <Card className="p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Fresh & Validated</span>
          <p className="text-xl font-bold font-mono text-emerald-600">
            {sources.filter(s => s.staleness_status === 'fresh').length}
          </p>
        </Card>
        <Card className="p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Attention Required</span>
          <p className="text-xl font-bold font-mono text-amber-600">
            {sources.filter(s => s.staleness_status === 'needs_review').length}
          </p>
        </Card>
        <Card className="p-4 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Stale / Outdated</span>
          <p className="text-xl font-bold font-mono text-rose-600">
            {sources.filter(s => s.staleness_status === 'stale').length}
          </p>
        </Card>
      </div>

      {/* Feed List Table */}
      <div className="space-y-4">
        {sources.map((src) => (
          <Card key={src.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{src.name}</h3>
                {getStatusBadge(src.staleness_status)}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 capitalize">
                  {src.source_type.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] font-mono text-slate-500">v{src.version}</span>
              </div>
              <p className="text-xs font-mono text-slate-500 truncate">{src.endpoint_or_file}</p>
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                <span>Last ingested: {new Date(src.last_ingested_at).toLocaleString()}</span>
                <span>Interval: Every {src.refresh_interval_hours}h</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{src.dependent_claims_count} dependent claims</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleReingest(src.id)}
                icon={<RefreshCw className="w-3.5 h-3.5 text-cyan-600" />}
              >
                Re-ingest Feed
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SourceFreshnessPage;
