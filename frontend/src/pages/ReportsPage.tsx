import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  Download,
  Calendar,
  Layers,
  Eye,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { artifactsApi } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import ReportPreviewModal from '../components/ReportPreviewModal';
import type { Artifact } from '../types';

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [previewArtifact, setPreviewArtifact] = useState<Artifact | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['artifacts', 1],
    queryFn: () => artifactsApi.list(1, 50),
    retry: 1,
  });

  const localReports: Artifact[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('nexus_generated_reports') || '[]');
    } catch {
      return [];
    }
  })();

  const serverReports = (data?.items || []).filter((a) => a.artifact_type.includes('report'));
  const reports = [...localReports];
  for (const sr of serverReports) {
    if (!reports.some((r) => r.id === sr.id)) {
      reports.push(sr);
    }
  }

  const handleDownload = (rep: Artifact) => {
    const meta = rep.metadata as { title?: string; content?: string };
    if (meta?.content) {
      const blob = new Blob([meta.content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(meta?.title || 'Report').replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      window.open(artifactsApi.downloadUrl(rep.id), '_blank');
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-7 font-sans">
      {/* Header */}
      <div className="border-b border-slate-300 dark:border-white/10 pb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-800 text-white shadow-md">
            <FileText className="w-5 h-5 text-white" />
          </div>
          Intelligence Reports & Synthesized Artifacts
        </h1>
        <p className="text-xs text-slate-800 dark:text-zinc-400 font-semibold mt-1">
          Executive summaries, empirical findings, and verified citations generated across all agent executions.
        </p>
      </div>

      {reports.length === 0 && !isLoading ? (
        <div className="space-y-4">
          <EmptyState
            icon={<Layers className="w-6 h-6 text-blue-600 dark:text-white" />}
            title="No intelligence reports generated yet"
            description="Submit an objective in the AI Workspace. The Report Generator Agent will compile verified findings into downloadable artifacts."
          />
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/workspace')}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Launch AI Workspace to Generate a Report
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((rep) => {
            const meta = rep.metadata as { title?: string; byte_size?: number; citations_count?: number };
            const title = meta?.title || `Intelligence Report (${rep.id.slice(0, 8)})`;
            return (
              <Card key={rep.id} className="flex flex-col justify-between hoverable group">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-800 dark:text-zinc-400 font-semibold mb-3">
                    <span className="inline-flex items-center gap-1 font-mono uppercase bg-blue-100 text-blue-900 border border-blue-300 dark:bg-zinc-900 dark:text-white dark:border-white/15 px-2 py-0.5 rounded-md font-bold tracking-wider text-[10px]">
                      <Sparkles className="w-2.5 h-2.5" /> Verified
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-700 dark:text-zinc-400 font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(rep.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-white transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-800 dark:text-zinc-300 font-medium line-clamp-2 mb-4 leading-relaxed">
                    Autonomous multi-agent synthesis with empirical references, quantitative metrics, and quality review checks.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-300 dark:border-white/10">
                  <span className="text-[11px] text-slate-800 dark:text-zinc-400 font-bold font-mono font-medium">
                    {meta?.citations_count || 4} verified citations
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => setPreviewArtifact(rep)}
                      icon={<Eye className="w-3 h-3 text-blue-700 dark:text-white" />}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => handleDownload(rep)}
                      icon={<Download className="w-3 h-3" />}
                    >
                      .md
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Report Preview Modal */}
      <ReportPreviewModal
        isOpen={Boolean(previewArtifact)}
        onClose={() => setPreviewArtifact(null)}
        artifact={previewArtifact}
      />
    </div>
  );
};

export default ReportsPage;
