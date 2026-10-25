import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Play,
  RotateCcw,
  Ban,
  Download,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  Terminal,
} from 'lucide-react';
import { useExecutions } from '../hooks/useExecutions';
import { useExecutionEvents } from '../hooks/useExecutionEvents';
import { useDocuments } from '../hooks/useDocuments';
import { useApprovals } from '../hooks/useApprovals';
import { executionsApi, artifactsApi } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import type { Task, Artifact } from '../types';

export const WorkspacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const executionIdParam = searchParams.get('id');

  const [objective, setObjective] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(executionIdParam);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createExecution, cancelExecution, retryExecution } = useExecutions();
  const { documents } = useDocuments(1, 50);
  const { approvals, resolveApproval } = useApprovals(currentExecutionId || undefined);
  const { events, clearEvents } = useExecutionEvents(currentExecutionId);

  useEffect(() => {
    if (!currentExecutionId) return;

    const fetchDetails = async () => {
      try {
        const [taskData, artData] = await Promise.all([
          executionsApi.getTasks(currentExecutionId),
          executionsApi.getArtifacts(currentExecutionId),
        ]);
        setTasks(taskData);
        setArtifacts(artData);
      } catch (err) {
        // Ignored
      }
    };

    fetchDetails();
    const interval = setInterval(fetchDetails, 3000);
    return () => clearInterval(interval);
  }, [currentExecutionId, events.length]);

  const handleStart = async () => {
    if (!objective.trim()) return;
    setIsSubmitting(true);
    try {
      clearEvents();
      const exec = await createExecution(objective, selectedDocIds);
      setCurrentExecutionId(exec.id);
      setSearchParams({ id: exec.id });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!currentExecutionId) return;
    await cancelExecution(currentExecutionId);
  };

  const handleRetry = async () => {
    if (!currentExecutionId) return;
    await retryExecution(currentExecutionId);
  };

  return (
    <div className="p-7 max-w-7xl mx-auto w-full space-y-5">
      {/* Objective Input Card */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-2.5">
          <Terminal className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white tracking-wide">Execution Objective</h2>
        </div>

        <div className="space-y-3.5">
          <textarea
            rows={3}
            placeholder="Specify target objective (e.g. Research enterprise generative AI security controls, compare market products, calculate compliance scores, and compile a verified report)."
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />

          {/* Attached Document Selectors */}
          {documents.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Ground in Documents (Optional):</p>
              <div className="flex flex-wrap gap-1.5">
                {documents.map((doc) => {
                  const isSelected = selectedDocIds.includes(doc.id);
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => {
                        setSelectedDocIds((prev) =>
                          isSelected ? prev.filter((id) => id !== doc.id) : [...prev, doc.id]
                        );
                      }}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                        isSelected
                          ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 font-medium'
                          : 'bg-[#0b0f19] text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {doc.filename}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500 font-mono">
              {currentExecutionId ? `ID: ${currentExecutionId}` : 'Status: Ready for input'}
            </span>

            <div className="flex items-center gap-2">
              {currentExecutionId && (
                <>
                  <Button variant="danger" size="xs" onClick={handleCancel} icon={<Ban className="w-3.5 h-3.5" />}>
                    Cancel
                  </Button>
                  <Button variant="secondary" size="xs" onClick={handleRetry} icon={<RotateCcw className="w-3.5 h-3.5" />}>
                    Retry
                  </Button>
                </>
              )}
              <Button
                variant="primary"
                size="sm"
                loading={isSubmitting}
                onClick={handleStart}
                icon={<Play className="w-3.5 h-3.5 fill-current" />}
              >
                Execute
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Human Approval Banner if pending */}
      {approvals.filter((a) => a.status === 'pending').map((appr) => (
        <div
          key={appr.id}
          className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-white">Approval Required</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Action: <span className="font-mono text-amber-300">{appr.action_type}</span> requires operator confirmation before dispatching.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              size="xs"
              onClick={() => resolveApproval(appr.id, 'rejected', 'Operator rejected via UI')}
            >
              Reject
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={() => resolveApproval(appr.id, 'approved', 'Operator authorized via UI')}
            >
              Authorize
            </Button>
          </div>
        </div>
      ))}

      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Tasks Progress */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Subtasks Pipeline</h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">{tasks.length} tasks</span>
            </div>

            {tasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Tasks will populate once the Planner agent breaks down your objective.
              </p>
            ) : (
              <div className="space-y-2">
                {tasks.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-lg bg-[#0b0f19] border border-slate-800/90 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold uppercase tracking-wider text-slate-300 font-mono text-[11px]">
                        {idx + 1}. {t.agent_role}
                      </span>
                      <StatusBadge status={t.status} />
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{t.description}</p>
                    {t.error_summary && (
                      <p className="text-rose-400 font-mono text-[11px] bg-rose-950/30 p-2 rounded border border-rose-900/40">
                        {t.error_summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Generated Artifacts */}
          {artifacts.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-slate-800">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Output Artifacts</h3>
              </div>

              {artifacts.map((art) => (
                <div
                  key={art.id}
                  className="p-2.5 rounded-lg bg-[#0b0f19] border border-slate-800 flex items-center justify-between"
                >
                  <div className="truncate mr-3">
                    <p className="text-xs font-medium text-slate-200 truncate">
                      {(art.metadata as { title?: string })?.title || 'Intelligence Report'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Markdown • {new Date(art.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <a
                    href={artifactsApi.downloadUrl(art.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0"
                  >
                    <Button variant="secondary" size="xs" icon={<Download className="w-3 h-3 text-slate-300" />}>
                      Download .md
                    </Button>
                  </a>
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* Right Column: Live Telemetry Stream */}
        <div className="lg:col-span-7">
          <Card className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Telemetry Stream (SSE)</h3>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>

            <div className="flex-1 bg-[#0b0f19] rounded-lg p-3.5 font-mono text-xs overflow-y-auto max-h-[500px] space-y-1.5 border border-slate-800/80">
              {events.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-600 text-xs py-10">
                  Ready. Telemetry events will stream here during execution.
                </div>
              ) : (
                events.map((ev, i) => (
                  <div key={ev.id || i} className="leading-relaxed border-b border-slate-900 pb-1 text-[11px]">
                    <span className="text-slate-500">[{new Date(ev.timestamp).toLocaleTimeString()}]</span>{' '}
                    <span className="text-blue-400 font-semibold">{ev.event_type}</span>:{' '}
                    <span className="text-slate-300">
                      {JSON.stringify(ev.payload)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;
