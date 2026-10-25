import React, { useState, useCallback } from 'react';
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
import Button from '../components/Button';
import type { WorkflowNode, WorkflowEdge } from '../types';

const defaultNodeStyle = {
  background: '#0f172a',
  color: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #334155',
  padding: '10px 14px',
  fontSize: '12px',
  fontWeight: '500',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
};

const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'input',
    position: { x: 50, y: 150 },
    data: { label: 'Start Trigger' },
    style: { ...defaultNodeStyle, borderLeft: '4px solid #3b82f6' },
  },
  {
    id: 'planner-1',
    position: { x: 230, y: 150 },
    data: { label: 'Planner Agent' },
    style: { ...defaultNodeStyle, borderLeft: '4px solid #6366f1' },
  },
  {
    id: 'research-1',
    position: { x: 420, y: 80 },
    data: { label: 'Research Agent' },
    style: { ...defaultNodeStyle, borderLeft: '4px solid #0ea5e9' },
  },
  {
    id: 'analysis-1',
    position: { x: 420, y: 220 },
    data: { label: 'Analysis Agent' },
    style: { ...defaultNodeStyle, borderLeft: '4px solid #f59e0b' },
  },
  {
    id: 'reviewer-1',
    position: { x: 610, y: 150 },
    data: { label: 'Reviewer Agent' },
    style: { ...defaultNodeStyle, borderLeft: '4px solid #84cc16' },
  },
  {
    id: 'report-1',
    position: { x: 800, y: 150 },
    data: { label: 'Report Generator' },
    style: { ...defaultNodeStyle, borderLeft: '4px solid #10b981' },
  },
  {
    id: 'end-1',
    type: 'output',
    position: { x: 990, y: 150 },
    data: { label: 'End Artifact' },
    style: { ...defaultNodeStyle, borderLeft: '4px solid #64748b' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'start-1', target: 'planner-1', style: { stroke: '#475569' } },
  { id: 'e2-3', source: 'planner-1', target: 'research-1', style: { stroke: '#475569' } },
  { id: 'e2-4', source: 'planner-1', target: 'analysis-1', style: { stroke: '#475569' } },
  { id: 'e3-5', source: 'research-1', target: 'reviewer-1', style: { stroke: '#475569' } },
  { id: 'e4-5', source: 'analysis-1', target: 'reviewer-1', style: { stroke: '#475569' } },
  { id: 'e5-6', source: 'reviewer-1', target: 'report-1', style: { stroke: '#475569' } },
  { id: 'e6-7', source: 'report-1', target: 'end-1', style: { stroke: '#475569' } },
];

const NODE_TEMPLATES = [
  { type: 'start', label: 'Start Trigger', border: '#3b82f6' },
  { type: 'planner', label: 'Planner Agent', border: '#6366f1' },
  { type: 'research', label: 'Research Agent', border: '#0ea5e9' },
  { type: 'document', label: 'Document Agent', border: '#06b6d4' },
  { type: 'analysis', label: 'Analysis Agent', border: '#f59e0b' },
  { type: 'reviewer', label: 'Reviewer Agent', border: '#84cc16' },
  { type: 'report', label: 'Report Generator', border: '#10b981' },
  { type: 'approval', label: 'Human Approval Gate', border: '#ef4444' },
  { type: 'end', label: 'End Artifact', border: '#64748b' },
];

export const WorkflowBuilderPage: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('Standard Multi-Agent Pipeline');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { createWorkflow, loading } = useWorkflows();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, style: { stroke: '#475569' } }, eds)),
    [setEdges]
  );

  const addCustomNode = (template: typeof NODE_TEMPLATES[0]) => {
    const id = `${template.type}-${Date.now()}`;
    const newNode: Node = {
      id,
      position: { x: 300 + Math.random() * 80, y: 150 + Math.random() * 80 },
      data: { label: template.label, nodeType: template.type },
      style: {
        ...defaultNodeStyle,
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
    <div className="flex flex-col h-full bg-[#090d16]">
      {/* Top Action Bar */}
      <div className="h-14 border-b border-slate-800 px-5 flex items-center justify-between bg-[#0b0f19]">
        <div className="flex items-center gap-2.5">
          <GitFork className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent font-semibold text-slate-100 text-sm focus:outline-none border-b border-transparent hover:border-slate-700 focus:border-blue-500 transition-colors px-1"
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
        <div className="bg-rose-500/10 border-b border-rose-500/30 px-5 py-2 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{validationErrors.join(' • ')}</span>
        </div>
      )}

      {/* Main Canvas & Left Node Palette */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Node Palette */}
        <div className="w-56 bg-[#0b0f19] border-r border-slate-800 p-3.5 space-y-2.5 overflow-y-auto shrink-0 z-10">
          <h3 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Node Palette</h3>
          <p className="text-[10px] text-slate-500">Click a node to add to canvas:</p>

          <div className="space-y-1.5">
            {NODE_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.type}
                type="button"
                onClick={() => addCustomNode(tmpl)}
                className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between bg-[#0f172a] border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 transition-colors"
                style={{ borderLeftColor: tmpl.border, borderLeftWidth: '3px' }}
              >
                <span className="text-slate-200">{tmpl.label}</span>
                <Plus className="w-3 h-3 text-slate-500" />
              </button>
            ))}
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 h-full bg-[#090d16]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls className="bg-[#0f172a] border border-slate-800 text-slate-300 rounded-lg shadow-md" />
            <MiniMap
              nodeStrokeColor="#334155"
              nodeColor="#1e293b"
              className="bg-[#0b0f19] border border-slate-800 rounded-lg overflow-hidden"
            />
            <Background color="#1e293b" gap={20} size={1} variant={BackgroundVariant.Dots} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilderPage;
