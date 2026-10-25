import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  FileText,
  FolderArchive,
  Play,
  GitFork,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';
import { useExecutions } from '../hooks/useExecutions';
import { useDocuments } from '../hooks/useDocuments';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { executions, loading: loadingExecs } = useExecutions(1, 10);
  const { documents } = useDocuments(1, 10);

  const totalRuns = executions.length;
  const activeRuns = executions.filter(
    (e) => e.status === 'running' || e.status === 'planning' || e.status === 'reviewing'
  ).length;
  const completedRuns = executions.filter((e) => e.status === 'completed').length;
  const totalDocs = documents.length;

  return (
    <div className="p-7 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            System Overview
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operator: <span className="font-mono text-slate-300">{currentUser?.email || 'nexus_operator'}</span> • Engine: <span className="font-mono text-emerald-400">Autonomous Pipeline Active</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/workflows')}
            icon={<GitFork className="w-3.5 h-3.5" />}
          >
            Workflow Builder
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/workspace')}
            icon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            New Execution
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-slate-800 text-blue-400 border border-slate-700/60">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Executions</p>
            <h3 className="text-xl font-bold text-white mt-0.5">{totalRuns}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-slate-800 text-amber-400 border border-slate-700/60">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Jobs</p>
            <h3 className="text-xl font-bold text-white mt-0.5">{activeRuns}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700/60">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Verified Reports</p>
            <h3 className="text-xl font-bold text-white mt-0.5">{completedRuns}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60">
            <FolderArchive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Indexed Documents</p>
            <h3 className="text-xl font-bold text-white mt-0.5">{totalDocs}</h3>
          </div>
        </Card>
      </div>

      {/* Recent Executions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Recent Executions</h2>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigate('/workspace')}
            iconRight={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open Workspace
          </Button>
        </div>

        {executions.length === 0 && !loadingExecs ? (
          <EmptyState
            icon={<Layers className="w-6 h-6 text-slate-400" />}
            title="No executions recorded"
            description="Submit an objective to initiate autonomous multi-agent planning, research, and analysis."
            actionLabel="Start New Execution"
            onAction={() => navigate('/workspace')}
          />
        ) : (
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b0f19] border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-medium">Objective</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Created</th>
                    <th className="py-3 px-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {executions.map((exec) => (
                    <tr
                      key={exec.id}
                      onClick={() => navigate(`/workspace?id=${exec.id}`)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-4 font-medium text-slate-200 max-w-md truncate">
                        {exec.objective}
                      </td>
                      <td className="py-2.5 px-4">
                        <StatusBadge status={exec.status} />
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 font-mono">
                        {new Date(exec.created_at).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/workspace?id=${exec.id}`);
                          }}
                        >
                          View Live
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
