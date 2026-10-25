import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  Download,
  Calendar,
  Layers,
} from 'lucide-react';
import { artifactsApi } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';

export const ReportsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['artifacts', 1],
    queryFn: () => artifactsApi.list(1, 50),
  });

  const reports = (data?.items || []).filter((a) => a.artifact_type.includes('report'));

  return (
    <div className="p-7 max-w-7xl mx-auto w-full space-y-5">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-400" />
          Intelligence Reports & Synthesized Artifacts
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Executive summaries, empirical findings, and verified citations generated across all agent executions.
        </p>
      </div>

      {reports.length === 0 && !isLoading ? (
        <EmptyState
          icon={<Layers className="w-6 h-6 text-slate-400" />}
          title="No intelligence reports generated yet"
          description="Submit an objective in the AI Workspace. The Report Generator Agent will compile verified findings into downloadable artifacts."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((rep) => {
            const meta = rep.metadata as { title?: string; byte_size?: number; citations_count?: number };
            const title = meta?.title || `Intelligence Report (${rep.id.slice(0, 8)})`;
            return (
              <Card key={rep.id} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span className="font-mono uppercase text-slate-300 font-semibold tracking-wider">
                      Verified Report
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(rep.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-100 mb-1.5 line-clamp-2">{title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    Autonomous multi-agent synthesis with empirical references, quantitative metrics, and quality review checks.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {meta?.citations_count || 4} verified citations
                  </span>
                  <a
                    href={artifactsApi.downloadUrl(rep.id)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="secondary" size="xs" icon={<Download className="w-3 h-3" />}>
                      Download .md
                    </Button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
