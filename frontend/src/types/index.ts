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


// ─── Adaptive Mission Supervisor ─────────────────────────────────────────────
export type SupervisorMissionStatus =
  | 'draft'
  | 'planned'
  | 'queued'
  | 'running'
  | 'waiting_for_approval'
  | 'needs_attention'
  | 'recovering'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface SupervisorBudget {
  max_tokens: number;
  consumed_tokens: number;
  max_cost_usd: number;
  consumed_cost_usd: number;
  max_time_seconds: number;
  elapsed_time_seconds: number;
  max_iterations: number;
  current_iteration: number;
}

export interface SupervisorTaskNode {
  id: string;
  name: string;
  agent_role: 'planner' | 'research' | 'document' | 'analysis' | 'reviewer' | 'report';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'blocked' | 'skipped';
  dependencies: string[];
  description: string;
  output_summary?: string;
  error?: string;
  started_at?: string;
  completed_at?: string;
  confidence?: number;
}

export interface SupervisorDecisionEvent {
  id: string;
  timestamp: string;
  decision_type: 'plan_created' | 'replan_triggered' | 'budget_warning' | 'circuit_broken' | 'checkpoint_saved' | 'human_escalation';
  title: string;
  detail: string;
  metadata?: Record<string, any>;
}

export interface SupervisorMission {
  id: string;
  title: string;
  objective: string;
  status: SupervisorMissionStatus;
  current_revision: number;
  budget: SupervisorBudget;
  tasks: SupervisorTaskNode[];
  decision_log: SupervisorDecisionEvent[];
  created_at: string;
  updated_at: string;
}

// ─── Evidence Lineage & Impact Analysis ──────────────────────────────────────
export interface SourceDocumentReference {
  id: string;
  filename: string;
  version: number;
  hash: string;
  ingested_at: string;
  status: 'active' | 'stale' | 'deprecated' | 'updated';
}

export interface EvidenceLineageItem {
  id: string;
  claim_id: string;
  claim_text: string;
  status: ClaimStatus;
  confidence: number;
  sources: {
    document_id: string;
    document_name: string;
    version: number;
    passage: string;
    page: number;
    match_score: number;
  }[];
  affected_reports: {
    report_id: string;
    report_title: string;
    impact_severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
  revalidation_status: 'valid' | 'needs_revalidation' | 'invalidated';
  last_verified_at: string;
}

// ─── Source Freshness Monitor ────────────────────────────────────────────────
export interface SourceFreshnessItem {
  id: string;
  name: string;
  source_type: 'financial_filing' | 'market_feed' | 'regulatory_api' | 'internal_corpus' | 'web_index';
  version: number;
  last_ingested_at: string;
  refresh_interval_hours: number;
  staleness_status: 'fresh' | 'needs_review' | 'stale' | 'missing';
  dependent_claims_count: number;
  dependent_reports_count: number;
  endpoint_or_file: string;
  hash: string;
}

// ─── Self-Healing Mission Execution & Recovery ───────────────────────────────
export type FailureClassificationType =
  | 'transient_network'
  | 'rate_limit'
  | 'timeout'
  | 'invalid_output'
  | 'dependency_failure'
  | 'non_recoverable';

export interface CircuitBreakerState {
  provider_id: string;
  provider_name: string;
  status: 'closed' | 'open' | 'half_open';
  failure_count: number;
  threshold: number;
  last_failure_at?: string;
  next_trial_at?: string;
}

export interface CheckpointRecord {
  id: string;
  mission_id: string;
  task_id: string;
  checkpoint_name: string;
  state_snapshot: Record<string, any>;
  created_at: string;
}

export interface RecoveryIncident {
  id: string;
  mission_id: string;
  task_id: string;
  task_name: string;
  failure_class: FailureClassificationType;
  error_message: string;
  attempt_number: number;
  max_attempts: number;
  strategy_applied: 'exponential_backoff' | 'model_fallback' | 're_prompt_clarification' | 'branch_replay' | 'human_escalation';
  status: 'recovering' | 'recovered' | 'exhausted' | 'escalated';
  timestamp: string;
}

// ─── AI Evaluation & Benchmarking Lab ────────────────────────────────────────
export interface BenchmarkTestCase {
  id: string;
  name: string;
  category: 'factual_extraction' | 'numerical_synthesis' | 'adversarial_contradiction' | 'citation_precision';
  prompt: string;
  ground_truth_reference: string;
  expected_facts: string[];
}

export interface ModelComparisonScore {
  model_id: string;
  model_name: string;
  citation_precision: number;
  evidence_coverage: number;
  factual_consistency: number;
  numerical_accuracy: number;
  average_latency_ms: number;
  cost_per_1k_runs_usd: number;
  overall_score: number;
}

export interface EvaluationRun {
  id: string;
  benchmark_name: string;
  test_cases_count: number;
  executed_at: string;
  status: 'completed' | 'running' | 'failed';
  models_evaluated: ModelComparisonScore[];
  regression_detected: boolean;
  notes: string;
}

// ─── Mission History, Replay & Branching ──────────────────────────────────────
export interface MissionReplayStep {
  step_number: number;
  task_id: string;
  agent: string;
  input_summary: string;
  output_summary: string;
  duration_ms: number;
  state_hash: string;
  is_checkpoint: boolean;
}

export interface MissionHistoryItem {
  id: string;
  title: string;
  objective: string;
  parent_mission_id?: string;
  branch_name?: string;
  status: SupervisorMissionStatus;
  started_at: string;
  completed_at?: string;
  duration_seconds: number;
  total_tokens: number;
  cost_usd: number;
  steps_count: number;
  can_replay: boolean;
  can_branch: boolean;
}

// ─── Policy-Aware Tool Gateway & Governance ──────────────────────────────────
export interface AgentToolPermission {
  agent_role: 'planner' | 'research' | 'document' | 'analysis' | 'reviewer' | 'report';
  allowed_tools: string[];
  denied_tools: string[];
  requires_approval_tools: string[];
  max_requests_per_minute: number;
  max_execution_time_seconds: number;
}

export interface PendingToolApproval {
  id: string;
  mission_id: string;
  agent_role: string;
  tool_name: string;
  target_resource: string;
  payload: Record<string, any>;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  requested_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'modified';
}
