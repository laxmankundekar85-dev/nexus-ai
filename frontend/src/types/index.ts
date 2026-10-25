// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// ─── Workflow ──────────────────────────────────────────────────────────────────
export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  configuration: Record<string, unknown>;
  data?: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  metadata?: Record<string, unknown>;
}

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  workflow_definition: WorkflowGraph;
  version: number;
  created_at: string;
  updated_at: string;
}

// ─── Execution ────────────────────────────────────────────────────────────────
export type ExecutionStatus =
  | 'queued'
  | 'planning'
  | 'awaiting_approval'
  | 'running'
  | 'reviewing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface Execution {
  id: string;
  objective: string;
  status: ExecutionStatus;
  plan: unknown;
  error_summary?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

// ─── Task ─────────────────────────────────────────────────────────────────────
export interface Task {
  id: string;
  agent_role: string;
  description: string;
  status: string;
  attempt_count: number;
  error_summary?: string;
}

// ─── Document ─────────────────────────────────────────────────────────────────
export interface Document {
  id: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  processing_status: string;
  created_at: string;
}

// ─── Approval ─────────────────────────────────────────────────────────────────
export interface ApprovalRequest {
  id: string;
  execution_id: string;
  action_type: string;
  proposed_action: unknown;
  status: string;
  requested_at: string;
}

// ─── Artifact ─────────────────────────────────────────────────────────────────
export interface Artifact {
  id: string;
  artifact_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ─── Execution Event ──────────────────────────────────────────────────────────
export interface ExecutionEvent {
  id: string;
  execution_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

// ─── API Pagination ───────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
