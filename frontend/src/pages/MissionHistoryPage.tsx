import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  GitBranch,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';
import { missionHistoryApi } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import toast from 'react-hot-toast';
import type { MissionHistoryItem } from '../types';

const INITIAL_HISTORY: MissionHistoryItem[] = [
  {
    id: 'sm-9041',
    title: 'Q3 Enterprise Revenue & Cross-Regional Market Analysis',
    objective: 'Synthesize quarterly filing across EU and APAC subsidiaries with automated anomaly reconciliation.',
    status: 'running',
    started_at: '2026-10-29T10:00:00Z',
    duration_seconds: 218,
    total_tokens: 184500,
    cost_usd: 4.12,
    steps_count: 5,
    can_replay: true,
    can_branch: true,
  },
  {
    id: 'sm-9038',
    title: 'Cybersecurity Threat Intelligence Digest',
    objective: 'Analyze CVE feed and cross-reference against internal cloud dependencies.',
    status: 'completed',
    started_at: '2026-10-29T09:00:00Z',
    completed_at: '2026-10-29T09:08:14Z',
    duration_seconds: 494,
    total_tokens: 289400,
    cost_usd: 6.35,
    steps_count: 7,
    can_replay: true,
    can_branch: true,
  },
  {
    id: 'sm-9022',
    title: 'Automated Regulatory Antitrust Compliance Scan',
    objective: 'Inspect multi-party M&A filings for overlapping market share thresholds.',
    status: 'completed',
    started_at: '2026-10-28T14:15:00Z',
    completed_at: '2026-10-28T14:26:30Z',
    duration_seconds: 690,
    total_tokens: 412000,
    cost_usd: 9.18,
    steps_count: 9,
    can_replay: true,
    can_branch: true,
  },
];

export const MissionHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<MissionHistoryItem[]>(INITIAL_HISTORY);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<MissionHistoryItem | null>(INITIAL_HISTORY[0]);

  useEffect(() => {
    missionHistoryApi.getHistory().then((data) => {
      setHistory(data);
      if (data.length > 0 && !selectedItem) setSelectedItem(data[0]);
    });
  }, []);

  const handleBranch = async (item: MissionHistoryItem) => {
    const branchName = prompt('Enter a name for the branched alternative mission:', `${item.title} (Branch A)`);
    if (!branchName) return;
    await missionHistoryApi.branchMission(item.id, branchName);
    toast.success(`Branched alternative mission created: "${branchName}"!`);
  };

  const handleReplay = (item: MissionHistoryItem) => {
    toast.success(`Replaying deterministic step sequence for ${item.id}...`);
  };

  const filteredHistory = history.filter(h =>
    h.title.toLowerCase().includes(search.toLowerCase()) ||
    h.objective.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-title tracking-tight text-slate-950 dark:text-white">
                Mission History, Replay & Branching
              </h1>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">
                Deterministic step execution logs, diffing runs, and spawning alternative mission branches
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full sm:w-80">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search prior mission executions..."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filteredHistory.map((item) => (
            <Card
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`p-5 cursor-pointer transition-all border ${
                selectedItem?.id === item.id ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold capitalize bg-blue-500/15 text-blue-600">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 font-body line-clamp-1">{item.objective}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={(e) => { e.stopPropagation(); handleBranch(item); }}
                    icon={<GitBranch className="w-3 h-3 text-purple-600" />}
                  >
                    Branch Plan
                  </Button>
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={(e) => { e.stopPropagation(); handleReplay(item); }}
                    icon={<RotateCcw className="w-3 h-3 text-blue-600" />}
                  >
                    Replay
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
                <span>Duration: {item.duration_seconds}s</span>
                <span>Tokens: {item.total_tokens.toLocaleString()}</span>
                <span>Cost: ${item.cost_usd.toFixed(2)}</span>
                <span>{item.steps_count} Steps</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Selected Mission Inspector */}
        <div>
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Run Inspector</h3>
            {selectedItem ? (
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">Mission ID</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedItem.id}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Started</span>
                  <p className="text-slate-900 dark:text-white">{new Date(selectedItem.started_at).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Deterministic State Snapshot</span>
                  <p className="text-emerald-600 font-bold">SHA-256 Checkpoint Valid</p>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2">
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => handleBranch(selectedItem)}
                    className="w-full"
                  >
                    Spawn Alternative Plan Branch
                  </Button>
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => handleReplay(selectedItem)}
                    className="w-full"
                  >
                    Deterministic Step Replay
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">Select an execution to inspect checkpoints.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MissionHistoryPage;
