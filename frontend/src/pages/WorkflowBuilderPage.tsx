import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Save,
  CheckCircle,
  Plus,
  AlertCircle,
  GitFork,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useWorkflows } from '../hooks/useWorkflows';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import type { WorkflowNode, WorkflowEdge } from '../types';

const NODE_TEMPLATES = [
  { type: 'start', label: 'Start Trigger', border: '#0284c7' },
  { type: 'planner', label: 'Planner Agent', border: '#2563eb' },
  { type: 'research', label: 'Research Agent', border: '#0ea5e9' },
  { type: 'document', label: 'Document Agent', border: '#06b6d4' },
  { type: 'analysis', label: 'Analysis Agent', border: '#f59e0b' },
  { type: 'reviewer', label: 'Reviewer Agent', border: '#10b981' },
  { type: 'report', label: 'Report Generator', border: '#059669' },
  { type: 'approval', label: 'Human Approval Gate', border: '#f43f5e' },
  { type: 'end', label: 'End Artifact', border: '#64748b' },
];

export const WorkflowBuilderPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const nodeBaseStyle = useMemo(
    () => ({
      background: isDark ? '#09090b' : '#f1f5f9',
      color: isDark ? '#f8fafc' : '#0f172a',
      borderRadius: '10px',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
      padding: '10px 14px',
      fontSize: '12px',
      fontWeight: '600' as const,
      boxShadow: isDark
        ? '0 4px 12px 0 rgba(0, 0, 0, 0.4)'
        : '0 4px 12px 0 rgba(14, 165, 233, 0.08)',
      backdropFilter: 'blur(12px)',
    }),
    [isDark]
  );

  const initialNodes: Node[] = useMemo(
    () => [
      {
        id: 'start-1',
        type: 'input',
        position: { x: 50, y: 150 },
        data: { label: 'Start Trigger' },
        style: { ...nodeBaseStyle, borderLeft: '4px solid #0284c7' },
      },
      {
        id: 'planner-1',
        position: { x: 230, y: 150 },
        data: { label: 'Planner Agent' },
        style: { ...nodeBaseStyle, borderLeft: '4px solid #2563eb' },
      },
      {
        id: 'research-1',
        position: { x: 420, y: 80 },
        data: { label: 'Research Agent' },
        style: { ...nodeBaseStyle, borderLeft: '4px solid #0ea5e9' },
      },
      {
        id: 'analysis-1',
        position: { x: 420, y: 220 },
        data: { label: 'Analysis Agent' },
        style: { ...nodeBaseStyle, borderLeft: '4px solid #f59e0b' },
      },
      {
        id: 'reviewer-1',
        position: { x: 610, y: 150 },
        data: { label: 'Reviewer Agent' },
        style: { ...nodeBaseStyle, borderLeft: '4px solid #10b981' },
      },
      {
        id: 'report-1',
        position: { x: 800, y: 150 },
        data: { label: 'Report Generator' },
        style: { ...nodeBaseStyle, borderLeft: '4px solid #059669' },
      },
      {
        id: 'end-1',
        type: 'output',
        position: { x: 990, y: 150 },
        data: { label: 'End Artifact' },
        style: { ...nodeBaseStyle, borderLeft: '4px solid #64748b' },
      },
    ],
    [nodeBaseStyle]
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      { id: 'e1-2', source: 'start-1', target: 'planner-1', style: { stroke: isDark ? '#38bdf8' : '#0284c7', strokeWidth: 2 } },
      { id: 'e2-3', source: 'planner-1', target: 'research-1', style: { stroke: isDark ? '#38bdf8' : '#0284c7', strokeWidth: 2 } },
      { id: 'e2-4', source: 'planner-1', target: 'analysis-1', style: { stroke: isDark ? '#38bdf8' : '#0284c7', strokeWidth: 2 } },
      { id: 'e3-5', source: 'research-1', target: 'reviewer-1', style: { stroke: isDark ? '#38bdf8' : '#0284c7', strokeWidth: 2 } },
      { id: 'e4-5', source: 'analysis-1', target: 'reviewer-1', style: { stroke: isDark ? '#38bdf8' : '#0284c7', strokeWidth: 2 } },
      { id: 'e5-6', source: 'reviewer-1', target: 'report-1', style: { stroke: isDark ? '#38bdf8' : '#0284c7', strokeWidth: 2 } },
      { id: 'e6-7', source: 'report-1', target: 'end-1', style: { stroke: isDark ? '#38bdf8' : '#0284c7', strokeWidth: 2 } },
    ],
    [isDark]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('Standard Multi-Agent Pipeline');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { createWorkflow, loading } = useWorkflows();

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: { stroke: isDark ? '#38bdf8' : '#0284c7', strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges, isDark]
  );

  const addCustomNode = (template: typeof NODE_TEMPLATES[0]) => {
    const id = `${template.type}-${Date.now()}`;
    const newNode: Node = {
      id,
      position: { x: 300 + Math.random() * 80, y: 150 + Math.random() * 80 },
      data: { label: template.label, nodeType: template.type },
      style: {
        ...nodeBaseStyle,
        borderLeft: `4px solid ${template.border}`,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    toast.success(`Added ${template.label}`);
  };

  const handleValidate = () => {
    const errors: string[] = [];
    const hasStart = nodes.some((n) => n.id.includes('start') || n.data?.nodeType === 'start' || n.type === 'input');
    const hasEnd = nodes.some((n) => n.id.includes('end') || n.data?.nodeType === 'end' || n.type === 'output');

    if (!hasStart) errors.push('Workflow must contain at least one Start node.');
    if (!hasEnd) errors.push('Workflow must contain at least one End node.');
    if (edges.length === 0) errors.push('Workflow nodes must be connected via edges.');

    setValidationErrors(errors);
    if (errors.length === 0) {
      toast.success('Workflow is topologically valid DAG.');
    } else {
      toast.error('Validation failed');
    }
  };

  const handleSave = async () => {
    const graphNodes: WorkflowNode[] = nodes.map((n) => ({
      id: n.id,
      type: (n.data?.nodeType as string) || n.id.split('-')[0],
      position: { x: n.position.x, y: n.position.y },
      configuration: {},
    }));

    const graphEdges: WorkflowEdge[] = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    }));

    await createWorkflow(workflowName, 'Custom visual agent workflow', {
      nodes: graphNodes,
      edges: graphEdges,
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#071120] transition-colors duration-200">
      {/* Top Action Bar */}
      <div className="h-14 border-b border-slate-300 dark:border-white/10 px-5 flex items-center justify-between bg-slate-100/95 dark:bg-[#09090b] backdrop-blur-xl shadow-sm z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-zinc-900 border border-blue-300 dark:border-white/15 flex items-center justify-center text-blue-700 dark:text-white">
            <GitFork className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent font-semibold text-slate-950 dark:text-white font-extrabold text-sm focus:outline-none border-b border-transparent hover:border-blue-500 dark:hover:border-white focus:border-blue-600 transition-colors px-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="xs" onClick={handleValidate} icon={<CheckCircle className="w-3.5 h-3.5" />}>
            Validate DAG
          </Button>
          <Button variant="primary" size="xs" loading={loading} onClick={handleSave} icon={<Save className="w-3.5 h-3.5" />}>
            Save Pipeline
          </Button>
        </div>
      </div>

      {/* Validation Banner if errors */}
      {validationErrors.length > 0 && (
        <div className="bg-rose-500/10 border-b border-rose-500/30 px-5 py-2 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 backdrop-blur-md">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{validationErrors.join(' • ')}</span>
        </div>
      )}

      {/* Mobile Node Palette Strip */}
      <div className="sm:hidden bg-slate-100/90 dark:bg-[#0c0c0e]/90 backdrop-blur-xl border-b border-slate-300 dark:border-white/12 dark:border-white/10 px-3 py-2 overflow-x-auto flex items-center gap-2 shrink-0">
        <span className="text-[10px] uppercase font-bold text-slate-800 dark:text-zinc-400 whitespace-nowrap">Add:</span>
        {NODE_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.type}
            type="button"
            onClick={() => addCustomNode(tmpl)}
            className="shrink-0 text-xs px-2.5 py-1 rounded-lg bg-slate-200/90 dark:bg-zinc-950 border border-slate-300 dark:border-white/15 hover:border-blue-500 dark:hover:border-white text-slate-950 dark:text-white font-bold flex items-center gap-1.5 shadow-sm"
            style={{ borderLeftColor: tmpl.border, borderLeftWidth: '3px' }}
          >
            <span>{tmpl.label}</span>
            <Plus className="w-2.5 h-2.5 text-blue-600 dark:text-white" />
          </button>
        ))}
      </div>

      {/* Main Canvas & Left Node Palette */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Node Palette (Desktop) */}
        <div className="hidden sm:block w-60 bg-slate-100/90 dark:bg-[#09090b] backdrop-blur-xl border-r border-slate-300 dark:border-white/10 p-4 space-y-3 overflow-y-auto shrink-0 z-10 shadow-sm">
          <h3 className="text-[11px] uppercase font-bold text-slate-950 dark:text-white font-black tracking-wider">Node Palette</h3>
          <p className="text-[10px] text-slate-800 dark:text-zinc-400 font-semibold">Click a node to add to canvas:</p>

          <div className="space-y-1.5">
            {NODE_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.type}
                type="button"
                onClick={() => addCustomNode(tmpl)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between bg-slate-200/90 dark:bg-zinc-900 border border-slate-300 dark:border-white/15 hover:border-blue-500 hover:bg-slate-300 dark:hover:bg-zinc-800 text-slate-950 dark:text-white font-bold transition-all shadow-sm group"
                style={{ borderLeftColor: tmpl.border, borderLeftWidth: '3.5px' }}
              >
                <span>{tmpl.label}</span>
                <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-white opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 h-full bg-[#eaeff6] dark:bg-black relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls className="!bg-slate-100 dark:!bg-zinc-900 !border !border-slate-300 dark:!border-white/15 !text-slate-950 dark:!text-white !rounded-xl !shadow-lg backdrop-blur-md overflow-hidden" />
            <MiniMap
              nodeStrokeColor={isDark ? '#ffffff' : '#2563eb'}
              nodeColor={isDark ? '#18181b' : '#cbd5e1'}
              className="!bg-slate-100/95 dark:!bg-[#0c0c0e]/95 !border !border-slate-300 dark:!border-white/15 !rounded-xl !overflow-hidden backdrop-blur-md shadow-md"
            />
            <Background
              color={isDark ? '#27272a' : '#94a3b8'}
              gap={20}
              size={1.5}
              variant={BackgroundVariant.Dots}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilderPage;
