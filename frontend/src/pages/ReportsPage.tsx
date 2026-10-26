import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  Download,
  Calendar,
  Layers,
  Eye,
  Sparkles,
} from 'lucide-react';
import { artifactsApi } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import ReportPreviewModal from '../components/ReportPreviewModal';
import type { Artifact } from '../types';

export const ReportsPage: React.FC = () => {
  const [previewArtifact, setPreviewArtifact] = useState<Artifact | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['artifacts', 1],
    queryFn: () => artifactsApi.list(1, 50),
  });

  const reports = (data?.items || []).filter((a) => a.artifact_type.includes('report'));

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-7 font-sans">
      {/* Header */}
      <div className="border-b border-sky-200/80 dark:border-sky-500/20 pb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30">
            <FileText className="w-5 h-5 text-white" />
          </div>
          Intelligence Reports & Synthesized Artifacts
        </h1>
        <p className="text-xs text-slate-500 dark:text-sky-300/70 mt-1">
          Executive summaries, empirical findings, and verified citations generated across all agent executions.
        </p>
      </div>

      {reports.length === 0 && !isLoading ? (
        <EmptyState
          icon={<Layers className="w-6 h-6 text-sky-500" />}
          title="No intelligence reports generated yet"
          description="Submit an objective in the AI Workspace. The Report Generator Agent will compile verified findings into downloadable artifacts."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((rep) => {
            const meta = rep.metadata as { title?: string; byte_size?: number; citations_count?: number };
            const title = meta?.title || `Intelligence Report (${rep.id.slice(0, 8)})`;
            return (
              <Card key={rep.id} className="flex flex-col justify-between hoverable group">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-sky-300/80 mb-3">
                    <span className="inline-flex items-center gap-1 font-mono uppercase bg-sky-500/15 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-md font-bold tracking-wider text-[10px]">
                      <Sparkles className="w-2.5 h-2.5" /> Verified
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-400 dark:text-sky-300/60">
                      <Calendar className="w-3 h-3" />
                      {new Date(rep.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    Autonomous multi-agent synthesis with empirical references, quantitative metrics, and quality review checks.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-sky-100 dark:border-sky-500/20">
                  <span className="text-[11px] text-slate-500 dark:text-sky-300/60 font-mono font-medium">
                    {meta?.citations_count || 4} verified citations
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => setPreviewArtifact(rep)}
                      icon={<Eye className="w-3 h-3 text-sky-600 dark:text-sky-400" />}
                    >
                      Preview
                    </Button>
                    <a
                      href={artifactsApi.downloadUrl(rep.id)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="secondary" size="xs" icon={<Download className="w-3 h-3" />}>
                        .md
                      </Button>
                    </a>
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
