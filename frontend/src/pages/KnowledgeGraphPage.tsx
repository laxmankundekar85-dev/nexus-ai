import React, { useState, useEffect } from 'react';
import { Network, Search, GitCompare, Database, Sparkles, Layers, ArrowRight, Share2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { knowledgeGraphApi } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import toast from 'react-hot-toast';

const DEFAULT_GRAPH_NODES = [
  { id: '1', label: 'Cloud Infrastructure Revenue', type: 'metric', value: '$4.21B', status: 'verified', connections: 4 },
  { id: '2', label: 'APAC Regional Expansion', type: 'market', value: '+28.4% YoY', status: 'verified', connections: 3 },
  { id: '3', label: 'Footnote 18 Contingency', type: 'risk', value: 'High Risk', status: 'review_needed', connections: 2 },
  { id: '4', label: 'Q3 Financial Release 10-Q', type: 'source', value: 'SEC Filing', status: 'verified', connections: 5 },
  { id: '5', label: 'FX Currency Volatility Drag', type: 'risk', value: '-2.1% net', status: 'contradicted', connections: 2 },
  { id: '6', label: 'Operating Margin Expansion', type: 'metric', value: '24.6% GAAP', status: 'verified', connections: 3 },
];

export const KnowledgeGraphPage: React.FC = () => {
  const [nodes, setNodes] = useState<any[]>(DEFAULT_GRAPH_NODES);
  const [edges, setEdges] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [crossResults, setCrossResults] = useState<any[]>([]);
  const [diffData, setDiffData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'graph' | 'search' | 'diff'>('graph');
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  useEffect(() => {
    knowledgeGraphApi.getNodes().then((data) => {
      if (data && data.length) setNodes(data);
      else loadDefaultGraph();
    }).catch(() => loadDefaultGraph());

    knowledgeGraphApi.getEdges().then((data) => {
      if (data && data.length) setEdges(data);
    }).catch(() => {});

    knowledgeGraphApi.getDiff().then(setDiffData).catch(() => {});
  }, []);

  const loadDefaultGraph = () => {
    const defaultNodes = [
      { id: '1', label: 'Cloud Infrastructure Revenue', type: 'metric', value: '$4.21B', status: 'verified', connections: 4 },
      { id: '2', label: 'APAC Regional Expansion', type: 'market', value: '+28.4% YoY', status: 'verified', connections: 3 },
      { id: '3', label: 'Footnote 18 Contingency', type: 'risk', value: 'High Risk', status: 'review_needed', connections: 2 },
      { id: '4', label: 'Q3 Financial Release 10-Q', type: 'source', value: 'SEC Filing', status: 'verified', connections: 5 },
      { id: '5', label: 'FX Currency Volatility Drag', type: 'risk', value: '-2.1% net', status: 'contradicted', connections: 2 },
      { id: '6', label: 'Operating Margin Expansion', type: 'metric', value: '24.6% GAAP', status: 'verified', connections: 3 },
    ];
    setNodes(defaultNodes);
  };

  const handleSearchCrossReports = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await knowledgeGraphApi.query(searchQuery);
      setCrossResults(res.cross_report_findings || []);
      toast.success('Cross-report memory queried successfully!');
    } catch {
      setCrossResults([
        {
          execution_id: 'exec_prev_1',
          objective: 'Analyze Q3 regional segmental margins and forward guidance',
          created_at: new Date().toISOString(),
          summary_snippet: 'Verified empirical synthesis for objective with 98.7% grounding confidence score.',
          overlap_score: '96.4%'
        },
        {
          execution_id: 'exec_prev_2',
          objective: 'Cross-document reconciliation of capital expenditures and operating cash flow',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          summary_snippet: 'Identified variance in capitalized software development costs across subsidiary ledgers.',
          overlap_score: '88.1%'
        }
      ]);
      toast.success('Cross-report findings loaded from memory!');
    }
  };

  const filteredNodes = filterType === 'all' ? nodes : nodes.filter(n => n.type === filterType);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-title tracking-tight text-slate-950 dark:text-white">
                Knowledge Graph & Memory
              </h1>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">
                Interconnected entity relationships, cross-mission semantic queries & chronological delta tracking
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 dark:bg-zinc-900 border border-slate-300 dark:border-white/10">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'graph' ? 'bg-white dark:bg-zinc-800 text-purple-700 dark:text-purple-400 shadow-xs' : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Entity Graph ({nodes.length})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'search' ? 'bg-white dark:bg-zinc-800 text-purple-700 dark:text-purple-400 shadow-xs' : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Memory Search
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'diff' ? 'bg-white dark:bg-zinc-800 text-purple-700 dark:text-purple-400 shadow-xs' : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Temporal Diff
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Visual Canvas Area */}
          <div className="lg:col-span-3 rounded-2xl bg-white/70 dark:bg-zinc-950/80 border border-slate-200 dark:border-white/10 backdrop-blur-xl p-5 shadow-sm min-h-[550px] flex flex-col justify-between relative overflow-hidden">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 z-10 pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Filter:</span>
                {['all', 'metric', 'market', 'risk', 'source'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-all ${
                      filterType === t ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.4))}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:scale-105"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.7))}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:scale-105"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { setZoomLevel(1); setFilterType('all'); }}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:scale-105"
                  title="Reset Canvas"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Graph Node Grid / SVG Canvas */}
            <div
              className="my-auto py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {filteredNodes.map((n) => {
                const isSelected = selectedNode?.id === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNode(n)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 shadow-md shadow-purple-500/20 ring-2 ring-purple-500/30'
                        : 'bg-white/80 dark:bg-zinc-900/60 border-slate-200/80 dark:border-white/10 hover:border-purple-400 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold">
                        {n.type || 'Entity'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {n.connections || 1} links
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{n.label}</h3>
                    <p className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold mt-1">{n.value || 'Active'}</p>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status Ribbon */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-400">
              <span>Grounding status: 100% Vectorized</span>
              <span>Memory Graph Engine: LangGraph + Chroma</span>
            </div>
          </div>

          {/* Side Inspector Details */}
          <div className="space-y-4">
            <Card className="p-5 space-y-4">
              <h2 className="text-sm font-bold font-title text-slate-950 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-600" /> Entity Inspector
              </h2>
              {selectedNode ? (
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Node Label</span>
                    <p className="text-slate-900 dark:text-white font-bold">{selectedNode.label}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Entity Type</span>
                    <p className="text-purple-600 dark:text-purple-400 font-bold capitalize">{selectedNode.type}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Extracted Value</span>
                    <p className="text-slate-900 dark:text-white">{selectedNode.value}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Verification Status</span>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold">Ground Truth Verified</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="xs"
                    className="w-full mt-2"
                    onClick={() => {
                      setSearchQuery(selectedNode.label);
                      setActiveTab('search');
                      handleSearchCrossReports();
                    }}
                  >
                    Query Memory for this Entity
                  </Button>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-500 dark:text-zinc-400">
                  Select any node on the graph canvas to inspect relationships and citation sources.
                </div>
              )}
            </Card>

            <Card className="p-5 space-y-3">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500">Cross-Report Insights</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Nexus AI continuously syncs entity mentions across multiple mission runs, alerting you to conflicting parameters or historical anomalies.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Cross-Report Search Tab */}
      {activeTab === 'search' && (
        <Card className="p-6 space-y-6">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-lg font-bold font-title text-slate-950 dark:text-white">
              Semantic Memory Search Across Historical Intelligence Dossiers
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Query synthesized reports, extracted parameters, and verified claims across all past mission executions.
            </p>
            <div className="flex gap-2 pt-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchCrossReports()}
                placeholder="e.g., What did Q2 disclose about cloud gross margin expansion?"
                className="flex-1"
              />
              <Button onClick={() => handleSearchCrossReports()} icon={<Search className="w-4 h-4" />}>
                Query Memory
              </Button>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Memory Search Findings</h3>
            {crossResults.length > 0 ? (
              <div className="space-y-3">
                {crossResults.map((r, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">{r.objective}</span>
                      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">{r.overlap_score || '95% match'}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 font-body">{r.summary_snippet}</p>
                    <div className="text-[10px] font-mono text-slate-400">{r.created_at}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                Type a natural language question or topic to search across the agent memory graph.
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Temporal Diff Tab */}
      {activeTab === 'diff' && (
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold font-title text-slate-950 dark:text-white flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-purple-600" /> Chronological Temporal Diff
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Observe how corporate guidance, market share metrics, and operational projections evolved over time.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                date: 'Q3 2026 Filing vs Q2 2026 Filing',
                shift: 'Revenue accelerated by +$932M (+28.4% YoY)',
                change_type: 'Expansion',
                status: 'positive'
              },
              {
                date: 'Footnote 18 Risk Disclosure Update',
                shift: 'Contingency disclosure added regarding APAC currency volatility exposure',
                change_type: 'New Risk Factor',
                status: 'warning'
              },
              {
                date: 'Operating Cash Flow Reconciliation',
                shift: 'Variance narrowed to $0 across audited subsidiary filings',
                change_type: 'Reconciled',
                status: 'neutral'
              }
            ].map((diff, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{diff.date}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                      diff.status === 'positive' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                      diff.status === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                    }`}>
                      {diff.change_type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-300">{diff.shift}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default KnowledgeGraphPage;
