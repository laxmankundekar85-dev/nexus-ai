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
  | 'paused'
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
  execution_time_ms?: number;
  tool_calls?: { tool: string; duration_ms: number }[];
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
  reviewer_id?: string;
  reviewer_name?: string;
  decision?: string;
  comments?: string;
  modified_action?: Record<string, unknown>;
  requested_at: string;
  resolved_at?: string;
}

// ─── Artifact ─────────────────────────────────────────────────────────────────
export interface Artifact {
  id: string;
  execution_id?: string;
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

// ─── Enterprise Claims & Evidence Traceability ────────────────────────────────
export type ClaimStatus = 'verified' | 'partially_verified' | 'unsupported' | 'contradicted';

export interface Claim {
  id: string;
  execution_id: string;
  claim_text: string;
  status: ClaimStatus;
  confidence_score: number;
  source_type: string;
  source_name?: string;
  page_number?: number;
  extracted_passage?: string;
  source_url?: string;
  created_at?: string;
}

// ─── Multi-Document Comparison ────────────────────────────────────────────────
export interface ComparisonMatrixRow {
  parameter: string;
  values: string[];
  has_difference: boolean;
  has_missing: boolean;
}

export interface NumericalShift {
  parameter: string;
  initial_value: number;
  comparison_value: number;
  absolute_delta: number;
  percentage_shift: number;
  direction: 'increase' | 'decrease';
}

export interface FactsVsInterpretation {
  filename: string;
  document_facts: string[];
  ai_interpretation: string[];
}

export interface DocumentComparisonResult {
  documents: { id: string; filename: string; word_count: number }[];
  comparison_matrix: ComparisonMatrixRow[];
  numerical_shifts: NumericalShift[];
  missing_values: { parameter: string; missing_in: string[] }[];
  facts_vs_interpretations: FactsVsInterpretation[];
  summary: string;
}

// ─── Interactive Data Analysis Lab ────────────────────────────────────────────
export interface AnalysisResult {
  query: string;
  formula_applied: string;
  execution_environment: string;
  is_valid: boolean;
  result_summary: string;
  statistics: Record<string, any>;
  chart: {
    type: 'bar' | 'line' | 'pie';
    data: { label: string; value: number }[];
  };
  table_data: Record<string, any>[];
}

// ─── Scheduled Missions ───────────────────────────────────────────────────────
export interface ScheduledMission {
  id: string;
  name: string;
  objective: string;
  schedule_type: string;
  cron_expression?: string;
  is_active: boolean;
  notify_on_delta: boolean;
  last_run_at?: string;
  next_run_at?: string;
  created_at?: string;
}

// ─── Audit Trail ──────────────────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  timestamp: string;
}

// ─── Dashboard Reliability & Cost Metrics ─────────────────────────────────────
export interface DashboardMetrics {
  reliability: {
    citation_coverage_pct: number;
    verification_accuracy_pct: number;
    claims_breakdown: {
      total: number;
      verified: number;
      partially_verified: number;
      unsupported: number;
      contradicted: number;
    };
    calibration_notice: string;
  };
  cost_and_usage: {
    provider: string;
    model: string;
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    average_latency_ms: number;
    retry_count: number;
    estimated_cost_usd: number;
  };
  agent_performance: {
    agent: string;
    success_rate_pct: number;
    avg_time_ms: number;
  }[];
}

// ─── Contradiction Alert ──────────────────────────────────────────────────────
export interface ContradictionAlert {
  id: string;
  parameter: string;
  claim_a: {
    source: string;
    source_type: string;
    date: string;
    reliability: number;
    value: string;
    text: string;
    passage: string;
  };
  claim_b: {
    source: string;
    source_type: string;
    date: string;
    reliability: number;
    value: string;
    text: string;
    passage: string;
  };
  discrepancy_type: string;
  status: string;
  routed_to: string;
}
