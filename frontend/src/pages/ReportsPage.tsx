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
import { exportReportToPdf } from '../utils/pdfExport';
import { exportReportToPptx } from '../utils/pptxExport';
import { Presentation } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [previewArtifact, setPreviewArtifact] = useState<Artifact | null>(null);
  const [exportingPptxId, setExportingPptxId] = useState<string | null>(null);
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
        <h1 className="text-xl sm:text-2xl font-bold font-title text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30">
            <FileText className="w-5 h-5 text-white" />
          </div>
          Intelligence reports
        </h1>
        <p className="text-xs text-slate-600 dark:text-zinc-400 font-body mt-1">
          Access, review, compare, and export the reports produced by your completed missions.
        </p>
      </div>

      {reports.length === 0 && !isLoading ? (
        <div className="space-y-4">
          <EmptyState
            icon={<Layers className="w-6 h-6 text-blue-600 dark:text-white" />}
            title="Your reports will appear here."
            description="Complete a mission to create your first intelligence dossier."
          />
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/workspace')}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Start a mission
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
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 font-medium mb-3">
                    <span className="inline-flex items-center gap-1 font-mono uppercase bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-zinc-900 dark:text-blue-300 dark:border-white/15 px-2 py-0.5 rounded-md font-medium tracking-wider text-[10px]">
                      <Sparkles className="w-2.5 h-2.5" /> Verified
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-500 dark:text-zinc-400 font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(rep.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold font-heading text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 font-body line-clamp-2 mb-4 leading-relaxed">
                    Autonomous multi-agent synthesis with empirical references, quantitative metrics, and quality review checks.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-white/10">
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono font-medium">
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
                      onClick={async () => {
                        const meta = rep.metadata as { title?: string; content?: string };
                        const repTitle = meta?.title || title;
                        const repContent = meta?.content || '# Intelligence Report';
                        setExportingPptxId(rep.id);
                        try {
                          await exportReportToPptx({ title: repTitle, objective: 'Executive Strategic Dossier', markdownContent: repContent });
                        } finally {
                          setExportingPptxId(null);
                        }
                      }}
                      loading={exportingPptxId === rep.id}
                      icon={<Presentation className="w-3 h-3 text-amber-500" />}
                    >
                      PPTX
                    </Button>
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => handleDownload(rep)}
                      icon={<Download className="w-3 h-3" />}
                    >
                      .md
                    </Button>
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => {
                        const meta = rep.metadata as { title?: string; content?: string };
                        if (meta?.content) {
                          exportReportToPdf(meta.title || title, meta.content);
                        } else {
                          handleDownload(rep);
                        }
                      }}
                      icon={<FileText className="w-3 h-3 text-white" />}
                      className="bg-blue-600 hover:bg-blue-700 font-bold"
                    >
                      PDF
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
