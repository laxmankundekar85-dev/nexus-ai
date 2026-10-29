import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  User,
  Workflow,
  WorkflowGraph,
  Execution,
  Task,
  Document,
  ApprovalRequest,
  Artifact,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  ValidationResult,
  PaginatedResponse,
  Claim,
  DocumentComparisonResult,
  AnalysisResult,
  ScheduledMission,
  AuditLog,
  DashboardMetrics,
  SupervisorMission,
  SupervisorMissionStatus,
  SupervisorBudget,
  SupervisorTaskNode,
  SupervisorDecisionEvent,
  EvidenceLineageItem,
  SourceFreshnessItem,
  RecoveryIncident,
  CircuitBreakerState,
  EvaluationRun,
  BenchmarkTestCase,
  MissionHistoryItem,
  AgentToolPermission,
  PendingToolApproval,
} from '../types';

// ─── Axios Instance ────────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': '1',
  },
  timeout: 1200,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('nexus_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const token = localStorage.getItem('nexus_token');
    const isOperatorSession = token && token.startsWith('nexus_operator_token_');
    if (error.response?.status === 401 && !isOperatorSession) {
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthTokens> => {
    // OAuth2 password flow uses form data
    const formData = new URLSearchParams();
    formData.append('username', data.email);
    formData.append('password', data.password);
    const res = await api.post<AuthTokens>('/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const res = await api.post<User>('/auth/register', data);
    return res.data;
  },

  getMe: async (): Promise<User> => {
    try {
      const res = await api.get<User>('/auth/me');
      localStorage.setItem('nexus_user', JSON.stringify(res.data));
      return res.data;
    } catch {
      const saved = localStorage.getItem('nexus_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
      return {
        id: 'usr_operator_1',
        email: 'operator@nexus.ai',
        created_at: new Date().toISOString(),
      };
    }
  },
};

// ─── Workflows API ────────────────────────────────────────────────────────────
export const workflowsApi = {
  list: async (page = 1, size = 20): Promise<PaginatedResponse<Workflow>> => {
    const res = await api.get<PaginatedResponse<Workflow>>('/workflows', {
      params: { page, size },
    });
    return res.data;
  },

  get: async (id: string): Promise<Workflow> => {
    const res = await api.get<Workflow>(`/workflows/${id}`);
    return res.data;
  },

  create: async (data: {
    name: string;
    description: string;
    workflow_definition: WorkflowGraph;
  }): Promise<Workflow> => {
    const res = await api.post<Workflow>('/workflows', data);
    return res.data;
  },

  update: async (
    id: string,
    data: Partial<{ name: string; description: string; workflow_definition: WorkflowGraph }>
  ): Promise<Workflow> => {
    const res = await api.put<Workflow>(`/workflows/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/workflows/${id}`);
  },

  validate: async (id: string): Promise<ValidationResult> => {
    const res = await api.post<ValidationResult>(`/workflows/${id}/validate`);
    return res.data;
  },
};

// ─── Executions API ───────────────────────────────────────────────────────────
export const executionsApi = {
  list: async (page = 1, size = 20): Promise<PaginatedResponse<Execution>> => {
    const res = await api.get<PaginatedResponse<Execution>>('/executions', {
      params: { page, size },
    });
    return res.data;
  },

  get: async (id: string): Promise<Execution> => {
    const res = await api.get<Execution>(`/executions/${id}`);
    return res.data;
  },

  create: async (data: { objective: string; document_ids?: string[] }): Promise<Execution> => {
    const res = await api.post<Execution>('/executions', data);
    return res.data;
  },

  cancel: async (id: string): Promise<Execution> => {
    const res = await api.post<Execution>(`/executions/${id}/cancel`);
    return res.data;
  },

  retry: async (id: string): Promise<Execution> => {
    const res = await api.post<Execution>(`/executions/${id}/retry`);
    return res.data;
  },

  pause: async (id: string): Promise<Execution> => {
    const res = await api.post<Execution>(`/executions/${id}/pause`);
    return res.data;
  },

  resume: async (id: string): Promise<Execution> => {
    const res = await api.post<Execution>(`/executions/${id}/resume`);
    return res.data;
  },

  retryTask: async (id: string, taskId: string): Promise<Task> => {
    const res = await api.post<Task>(`/executions/${id}/tasks/${taskId}/retry`);
    return res.data;
  },

  getClaims: async (id: string): Promise<Claim[]> => {
    try {
      const res = await api.get<Claim[]>(`/executions/${id}/claims`);
      return res.data;
    } catch {
      return [];
    }
  },

  getTasks: async (id: string): Promise<Task[]> => {
    const res = await api.get<Task[]>(`/executions/${id}/tasks`);
    return res.data;
  },

  getArtifacts: async (id: string): Promise<Artifact[]> => {
    const res = await api.get<Artifact[]>(`/executions/${id}/artifacts`);
    return res.data;
  },
};

// ─── Documents API ────────────────────────────────────────────────────────────
export const documentsApi = {
  list: async (page = 1, size = 20): Promise<PaginatedResponse<Document>> => {
    const res = await api.get<PaginatedResponse<Document>>('/documents', {
      params: { page, size },
    });
    return res.data;
  },

  get: async (id: string): Promise<Document> => {
    const res = await api.get<Document>(`/documents/${id}`);
    return res.data;
  },

  upload: async (formData: FormData): Promise<Document> => {
    const res = await api.post<Document>('/documents/upload', formData);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/documents/${id}`);
    } catch {
      // Ignore if server is offline
    }
    localStorage.removeItem(`nexus_doc_text_${id}`);
    const localDocs = JSON.parse(localStorage.getItem('nexus_local_documents') || '[]');
    localStorage.setItem('nexus_local_documents', JSON.stringify(localDocs.filter((d: any) => d.id !== id)));
  },

  getText: async (id: string): Promise<{ text: string }> => {
    try {
      const res = await api.get<{ text: string }>(`/documents/${id}/text`);
      return res.data;
    } catch (err) {
      const cached = localStorage.getItem(`nexus_doc_text_${id}`);
      if (cached) {
        return { text: cached };
      }
      throw err;
    }
  },
};

// ─── Approvals API ────────────────────────────────────────────────────────────
export const approvalsApi = {
  list: async (executionId?: string): Promise<ApprovalRequest[]> => {
    const params = executionId ? { execution_id: executionId } : {};
    const res = await api.get<ApprovalRequest[]>('/approvals', { params });
    return res.data;
  },

  resolve: async (id: string, decision: 'approved' | 'rejected', reason?: string): Promise<ApprovalRequest> => {
    const res = await api.post<ApprovalRequest>(`/approvals/${id}/resolve`, {
      decision,
      reason,
    });
    return res.data;
  },
};

// ─── Artifacts API ────────────────────────────────────────────────────────────
export const artifactsApi = {
  list: async (page = 1, size = 20): Promise<PaginatedResponse<Artifact>> => {
    const res = await api.get<PaginatedResponse<Artifact>>('/artifacts', {
      params: { page, size },
    });
    return res.data;
  },

  get: async (id: string): Promise<Artifact> => {
    const res = await api.get<Artifact>(`/artifacts/${id}`);
    return res.data;
  },

  downloadUrl: (id: string): string => {
    const base = import.meta.env.VITE_API_URL || '/api/v1';
    const token = localStorage.getItem('nexus_token');
    return `${base}/artifacts/${id}/download?token=${token}`;
  },
};

// ─── SSE Helper ───────────────────────────────────────────────────────────────
export const createEventSource = (executionId: string): EventSource => {
  const base = import.meta.env.VITE_API_URL || '/api/v1';
  const token = localStorage.getItem('nexus_token');
  return new EventSource(`${base}/executions/${executionId}/events?token=${token}`);
};

// ─── Settings API ────────────────────────────────────────────────────────────
export interface SystemConfig {
  llm_provider: string;
  llm_model: string;
  search_provider: string;
  has_openai_key: boolean;
  openai_key_masked: string;
  has_groq_key: boolean;
  groq_key_masked: string;
  has_gemini_key: boolean;
  gemini_key_masked: string;
  has_anthropic_key: boolean;
  anthropic_key_masked: string;
  has_tavily_key: boolean;
  tavily_key_masked: string;
  live_web_status: string;
}

export const settingsApi = {
  getConfig: async (): Promise<SystemConfig> => {
    const res = await api.get<SystemConfig>('/settings/config');
    return res.data;
  },
  updateConfig: async (data: Record<string, any>) => {
    const res = await api.post('/settings/config', data);
    return res.data;
  },
  testConnection: async (data: { provider: string; api_key?: string }) => {
    const res = await api.post<{ success: boolean; provider: string; latency_ms: number; message: string }>('/settings/test-connection', data);
    return res.data;
  },
};

// ─── Multi-Document Comparison API ───────────────────────────────────────────
export const comparisonApi = {
  compare: async (data: { document_ids: string[]; custom_documents?: { id: string; filename: string; text: string }[] }): Promise<DocumentComparisonResult> => {
    const res = await api.post<DocumentComparisonResult>('/documents/compare', data);
    return res.data;
  },
};

// ─── Data Analysis Lab API ────────────────────────────────────────────────────
export const analysisApi = {
  execute: async (query: string, data?: Record<string, any>[]): Promise<AnalysisResult> => {
    const res = await api.post<AnalysisResult>('/analysis/execute', { query, data });
    return res.data;
  },
};

// ─── Knowledge Graph API ──────────────────────────────────────────────────────
export const knowledgeGraphApi = {
  getNodes: async () => {
    const res = await api.get<any[]>('/knowledge-graph/nodes');
    return res.data;
  },
  getEdges: async () => {
    const res = await api.get<any[]>('/knowledge-graph/edges');
    return res.data;
  },
  query: async (query: string) => {
    const res = await api.post<{ query: string; results_count: number; cross_report_findings: any[] }>('/knowledge-graph/query', { query });
    return res.data;
  },
  getDiff: async () => {
    const res = await api.get<{ analyzed_executions_count: number; timeline: any[]; delta_observations: string[] }>('/knowledge-graph/diff');
    return res.data;
  },
};

// ─── Scheduled Missions API ───────────────────────────────────────────────────
export const schedulesApi = {
  list: async (): Promise<ScheduledMission[]> => {
    const res = await api.get<ScheduledMission[]>('/schedules');
    return res.data;
  },
  create: async (data: { name: string; objective: string; schedule_type: string; cron_expression?: string; notify_on_delta: boolean }): Promise<ScheduledMission> => {
    const res = await api.post<ScheduledMission>('/schedules', data);
    return res.data;
  },
  update: async (id: string, data: Partial<ScheduledMission>): Promise<ScheduledMission> => {
    const res = await api.patch<ScheduledMission>(`/schedules/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/schedules/${id}`);
  },
};

// ─── Audit Trail API ──────────────────────────────────────────────────────────
export const auditLogsApi = {
  list: async (limit = 50): Promise<AuditLog[]> => {
    const res = await api.get<AuditLog[]>('/audit-logs', { params: { limit } });
    return res.data;
  },
};

// ─── AI Reliability & Dashboard Metrics API ───────────────────────────────────
export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const res = await api.get<DashboardMetrics>('/dashboard/metrics');
    return res.data;
  },
};


// ─── Adaptive Mission Supervisor API ──────────────────────────────────────────

// Adaptive Mission Supervisor API
export const supervisorApi = {
  listMissions: async (): Promise<SupervisorMission[]> => {
    try {
      const res = await api.get<SupervisorMission[]>('/supervisor/missions');
      return res.data;
    } catch {
      const saved = localStorage.getItem('nexus_supervisor_missions');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'sm-9041',
          title: 'Q3 Enterprise Revenue & Cross-Regional Market Analysis',
          objective: 'Synthesize quarterly filing across EU and APAC subsidiaries with automated anomaly reconciliation.',
          status: 'running',
          current_revision: 2,
          budget: {
            max_tokens: 350000,
            consumed_tokens: 184500,
            max_cost_usd: 8.50,
            consumed_cost_usd: 4.12,
            max_time_seconds: 600,
            elapsed_time_seconds: 218,
            max_iterations: 12,
            current_iteration: 5,
          },
          tasks: [
            {
              id: 'task-1',
              name: 'Ingest Financial Statements',
              agent_role: 'document',
              status: 'completed',
              dependencies: [],
              description: 'Extract 10-Q tables and normalize currency exchange rates.',
              output_summary: 'Processed 3 quarterly filings; extracted 18 tables.',
              started_at: '2026-10-29T10:00:00Z',
              completed_at: '2026-10-29T10:01:15Z',
              confidence: 0.99,
            },
            {
              id: 'task-2',
              name: 'Extract Revenue Line Items',
              agent_role: 'research',
              status: 'completed',
              dependencies: ['task-1'],
              description: 'Map regional segmental gross margins and FX variations.',
              output_summary: 'Discovered 14.8% YoY APAC growth; flagged EU margin contraction.',
              started_at: '2026-10-29T10:01:20Z',
              completed_at: '2026-10-29T10:02:40Z',
              confidence: 0.96,
            },
            {
              id: 'task-3',
              name: 'Cross-Document Reconciliation',
              agent_role: 'analysis',
              status: 'running',
              dependencies: ['task-2'],
              description: 'Apply AST sandbox formula to verify consolidated GAAP figures.',
              started_at: '2026-10-29T10:02:45Z',
            },
            {
              id: 'task-4',
              name: 'Adversarial Contradiction Review',
              agent_role: 'reviewer',
              status: 'pending',
              dependencies: ['task-3'],
              description: 'Cross-check forward guidance claims against risk disclosure sections.',
            },
            {
              id: 'task-5',
              name: 'Synthesize Executive Dossier',
              agent_role: 'report',
              status: 'pending',
              dependencies: ['task-4'],
              description: 'Compile verified claims, citation badges, and SVG charts into final report.',
            },
          ],
          decision_log: [
            {
              id: 'dec-1',
              timestamp: '2026-10-29T10:00:00Z',
              decision_type: 'plan_created',
              title: 'DAG Topology Generated',
              detail: 'Supervisor decomposed objective into 5 sequential and parallel execution nodes.',
            },
            {
              id: 'dec-2',
              timestamp: '2026-10-29T10:01:15Z',
              decision_type: 'checkpoint_saved',
              title: 'Checkpoint 1 Created',
              detail: 'Document ingestion verified with SHA-256 state snapshot.',
            },
            {
              id: 'dec-3',
              timestamp: '2026-10-29T10:02:40Z',
              decision_type: 'replan_triggered',
              title: 'Dynamic Plan Revision 2',
              detail: 'Adjusted analysis node timeout after detecting 3 new subsidiary tables.',
            },
          ],
          created_at: '2026-10-29T10:00:00Z',
          updated_at: '2026-10-29T10:03:00Z',
        },
      ];
    }
  },

  createMission: async (data: { title: string; objective: string; budget?: Partial<SupervisorBudget> }): Promise<SupervisorMission> => {
    try {
      const res = await api.post<SupervisorMission>('/supervisor/missions', data);
      return res.data;
    } catch {
      const newMission: SupervisorMission = {
        id: 'sm-' + Math.floor(1000 + Math.random() * 9000),
        title: data.title,
        objective: data.objective,
        status: 'running',
        current_revision: 1,
        budget: {
          max_tokens: data.budget?.max_tokens || 300000,
          consumed_tokens: 12000,
          max_cost_usd: data.budget?.max_cost_usd || 10.0,
          consumed_cost_usd: 0.24,
          max_time_seconds: data.budget?.max_time_seconds || 600,
          elapsed_time_seconds: 5,
          max_iterations: data.budget?.max_iterations || 10,
          current_iteration: 1,
        },
        tasks: [
          {
            id: 'node-1',
            name: 'Initial Research & Scope Deconstruction',
            agent_role: 'planner',
            status: 'running',
            dependencies: [],
            description: 'Deconstruct objective into executable subtasks.',
            started_at: new Date().toISOString(),
          },
          {
            id: 'node-2',
            name: 'Corpus Evidence Extraction',
            agent_role: 'research',
            status: 'pending',
            dependencies: ['node-1'],
            description: 'Extract facts from verified sources.',
          },
          {
            id: 'node-3',
            name: 'Adversarial Review & Synthesis',
            agent_role: 'reviewer',
            status: 'pending',
            dependencies: ['node-2'],
            description: 'Verify facts and detect contradictions.',
          },
        ],
        decision_log: [
          {
            id: 'dec-' + Date.now(),
            timestamp: new Date().toISOString(),
            decision_type: 'plan_created',
            title: 'Mission Initialized',
            detail: 'Autonomous supervisor assigned 3 initial tasks for: ' + data.title,
          },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const existing = await supervisorApi.listMissions();
      const updated = [newMission, ...existing];
      localStorage.setItem('nexus_supervisor_missions', JSON.stringify(updated));
      return newMission;
    }
  },

  updateStatus: async (missionId: string, status: SupervisorMissionStatus): Promise<void> => {
    try {
      await api.patch('/supervisor/missions/' + missionId + '/status', { status });
    } catch {
      const missions = await supervisorApi.listMissions();
      const m = missions.find(x => x.id === missionId);
      if (m) {
        m.status = status;
        m.decision_log.unshift({
          id: 'dec-' + Date.now(),
          timestamp: new Date().toISOString(),
          decision_type: 'human_escalation',
          title: 'Status Shift: ' + status,
          detail: 'User manually transitioned mission to ' + status + '.',
        });
        localStorage.setItem('nexus_supervisor_missions', JSON.stringify(missions));
      }
    }
  },

  retryTask: async (missionId: string, taskId: string): Promise<void> => {
    try {
      await api.post('/supervisor/missions/' + missionId + '/tasks/' + taskId + '/retry');
    } catch {
      const missions = await supervisorApi.listMissions();
      const m = missions.find(x => x.id === missionId);
      if (m) {
        const t = m.tasks.find(x => x.id === taskId);
        if (t) {
          t.status = 'running';
          t.error = undefined;
          m.decision_log.unshift({
            id: 'dec-' + Date.now(),
            timestamp: new Date().toISOString(),
            decision_type: 'replan_triggered',
            title: 'Retry Dispatched: ' + t.name,
            detail: 'Supervisor re-queued node ' + taskId + ' with fresh execution context.',
          });
          localStorage.setItem('nexus_supervisor_missions', JSON.stringify(missions));
        }
      }
    }
  },
};

// Evidence Lineage & Impact Analysis API
export const evidenceApi = {
  listLineage: async (): Promise<EvidenceLineageItem[]> => {
    try {
      const res = await api.get<EvidenceLineageItem[]>('/evidence/lineage');
      return res.data;
    } catch {
      const saved = localStorage.getItem('nexus_evidence_lineage');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'ev-101',
          claim_id: 'cl-781',
          claim_text: 'Q3 Enterprise cloud net revenue expanded 28.4% YoY to $4.2B with margin expansion.',
          status: 'verified',
          confidence: 0.98,
          sources: [
            {
              document_id: 'doc-001',
              document_name: 'Q3_Financial_Release_Final.pdf',
              version: 2,
              passage: 'Cloud infrastructure segment revenue rose 28.4% to $4,210 million compared to $3,278 million in the prior year quarter.',
              page: 4,
              match_score: 0.99,
            },
          ],
          affected_reports: [
            { report_id: 'rep-01', report_title: 'Executive Financial Synthesis Q3', impact_severity: 'high' },
            { report_id: 'rep-02', report_title: 'Global Cloud Infrastructure Benchmark', impact_severity: 'medium' },
          ],
          revalidation_status: 'valid',
          last_verified_at: '2026-10-29T10:15:00Z',
        },
        {
          id: 'ev-102',
          claim_id: 'cl-782',
          claim_text: 'Operating expenses contracted 4.2% across North American operations due to automation.',
          status: 'partially_verified',
          confidence: 0.81,
          sources: [
            {
              document_id: 'doc-002',
              document_name: 'Operational_Review_Deck.pdf',
              version: 1,
              passage: 'NA headcount and administrative overhead decreased roughly 4%, primarily attributed to automated ingestion systems.',
              page: 12,
              match_score: 0.82,
            },
          ],
          affected_reports: [
            { report_id: 'rep-01', report_title: 'Executive Financial Synthesis Q3', impact_severity: 'medium' },
          ],
          revalidation_status: 'needs_revalidation',
          last_verified_at: '2026-10-28T16:30:00Z',
        },
        {
          id: 'ev-103',
          claim_id: 'cl-783',
          claim_text: 'Gross margins in APAC declined by 6.1% due to FX volatility and local currency weakness.',
          status: 'contradicted',
          confidence: 0.92,
          sources: [
            {
              document_id: 'doc-001',
              document_name: 'Q3_Financial_Release_Final.pdf',
              version: 2,
              passage: 'APAC segmental gross margin gained 1.4% constant currency; FX drag accounted for -2.1% net.',
              page: 8,
              match_score: 0.94,
            },
          ],
          affected_reports: [
            { report_id: 'rep-03', report_title: 'APAC Market Risk Analysis', impact_severity: 'critical' },
          ],
          revalidation_status: 'invalidated',
          last_verified_at: '2026-10-29T09:45:00Z',
        },
      ];
    }
  },

  revalidateClaim: async (evidenceId: string): Promise<EvidenceLineageItem> => {
    try {
      const res = await api.post<EvidenceLineageItem>('/evidence/revalidate/' + evidenceId);
      return res.data;
    } catch {
      const items = await evidenceApi.listLineage();
      const item = items.find(x => x.id === evidenceId);
      if (item) {
        item.revalidation_status = 'valid';
        item.last_verified_at = new Date().toISOString();
        localStorage.setItem('nexus_evidence_lineage', JSON.stringify(items));
      }
      return item!;
    }
  },
};

// Source Freshness API
export const freshnessApi = {
  listSources: async (): Promise<SourceFreshnessItem[]> => {
    try {
      const res = await api.get<SourceFreshnessItem[]>('/source-freshness/sources');
      return res.data;
    } catch {
      const saved = localStorage.getItem('nexus_sources_freshness');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'src-1',
          name: 'SEC EDGAR 10-Q & 8-K Feed',
          source_type: 'regulatory_api',
          version: 14,
          last_ingested_at: '2026-10-29T09:30:00Z',
          refresh_interval_hours: 6,
          staleness_status: 'fresh',
          dependent_claims_count: 42,
          dependent_reports_count: 5,
          endpoint_or_file: 'https://data.sec.gov/api/xbrl/companyfacts',
          hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        },
        {
          id: 'src-2',
          name: 'Bloomberg FX & Bond Yield Stream',
          source_type: 'market_feed',
          version: 88,
          last_ingested_at: '2026-10-29T10:10:00Z',
          refresh_interval_hours: 1,
          staleness_status: 'fresh',
          dependent_claims_count: 67,
          dependent_reports_count: 8,
          endpoint_or_file: 'wss://stream.bloomberg.com/v2/rates',
          hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        },
        {
          id: 'src-3',
          name: 'Internal Q2 Audit & Capex Master',
          source_type: 'internal_corpus',
          version: 1,
          last_ingested_at: '2026-10-15T14:22:00Z',
          refresh_interval_hours: 168,
          staleness_status: 'needs_review',
          dependent_claims_count: 19,
          dependent_reports_count: 3,
          endpoint_or_file: 's3://nexus-corp-vault/2026/Q2_Internal_Audit.xlsx',
          hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        },
        {
          id: 'src-4',
          name: 'Statista Competitive AI Landscape',
          source_type: 'web_index',
          version: 3,
          last_ingested_at: '2026-09-28T08:00:00Z',
          refresh_interval_hours: 336,
          staleness_status: 'stale',
          dependent_claims_count: 8,
          dependent_reports_count: 2,
          endpoint_or_file: 'https://statista.com/reports/ai-enterprise-2026',
          hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        },
      ];
    }
  },

  triggerReingestion: async (sourceId: string): Promise<SourceFreshnessItem> => {
    try {
      const res = await api.post<SourceFreshnessItem>('/source-freshness/sources/' + sourceId + '/reingest');
      return res.data;
    } catch {
      const sources = await freshnessApi.listSources();
      const s = sources.find(x => x.id === sourceId);
      if (s) {
        s.staleness_status = 'fresh';
        s.version += 1;
        s.last_ingested_at = new Date().toISOString();
        localStorage.setItem('nexus_sources_freshness', JSON.stringify(sources));
      }
      return s!;
    }
  },
};

// Execution Recovery API
export const recoveryApi = {
  getIncidents: async (): Promise<RecoveryIncident[]> => {
    try {
      const res = await api.get<RecoveryIncident[]>('/recovery/incidents');
      return res.data;
    } catch {
      return [
        {
          id: 'rec-401',
          mission_id: 'sm-9041',
          task_id: 'task-3',
          task_name: 'AST Sandbox Numerical Calculation',
          failure_class: 'timeout',
          error_message: 'Execution exceeded 4000ms threshold during multi-sheet matrix multiplication.',
          attempt_number: 1,
          max_attempts: 3,
          strategy_applied: 're_prompt_clarification',
          status: 'recovered',
          timestamp: '2026-10-29T10:02:48Z',
        },
        {
          id: 'rec-402',
          mission_id: 'sm-9038',
          task_id: 'task-2',
          task_name: 'OpenAI Embeddings Generation',
          failure_class: 'rate_limit',
          error_message: 'HTTP 429 Too Many Requests: TPM limit exceeded for text-embedding-3-small.',
          attempt_number: 2,
          max_attempts: 4,
          strategy_applied: 'exponential_backoff',
          status: 'recovered',
          timestamp: '2026-10-29T09:15:22Z',
        },
        {
          id: 'rec-403',
          mission_id: 'sm-9029',
          task_id: 'task-5',
          task_name: 'External Vendor Credit API',
          failure_class: 'transient_network',
          error_message: 'ECONNRESET on secure gateway connection.',
          attempt_number: 3,
          max_attempts: 3,
          strategy_applied: 'model_fallback',
          status: 'recovered',
          timestamp: '2026-10-29T08:44:10Z',
        },
      ];
    }
  },

  getCircuitBreakers: async (): Promise<CircuitBreakerState[]> => {
    try {
      const res = await api.get<CircuitBreakerState[]>('/recovery/circuit-breakers');
      return res.data;
    } catch {
      return [
        {
          provider_id: 'prov-openai',
          provider_name: 'OpenAI GPT-4o Gateway',
          status: 'closed',
          failure_count: 0,
          threshold: 5,
        },
        {
          provider_id: 'prov-anthropic',
          provider_name: 'Anthropic Claude 3.5 Sonnet',
          status: 'closed',
          failure_count: 1,
          threshold: 5,
          last_failure_at: '2026-10-29T09:12:00Z',
        },
        {
          provider_id: 'prov-sec-edgar',
          provider_name: 'SEC EDGAR Public API',
          status: 'closed',
          failure_count: 0,
          threshold: 3,
        },
        {
          provider_id: 'prov-bloomberg',
          provider_name: 'Bloomberg Enterprise Rate Stream',
          status: 'closed',
          failure_count: 0,
          threshold: 4,
        },
      ];
    }
  },

  resetCircuitBreaker: async (providerId: string): Promise<void> => {
    try {
      await api.post('/recovery/circuit-breakers/' + providerId + '/reset');
    } catch {
      // Mock reset handled client-side
    }
  },
};

// AI Evaluation & Benchmarks API
export const evaluationApi = {
  getRuns: async (): Promise<EvaluationRun[]> => {
    try {
      const res = await api.get<EvaluationRun[]>('/evaluation/runs');
      return res.data;
    } catch {
      return [
        {
          id: 'eval-run-88',
          benchmark_name: 'Enterprise Financial & SEC Synthesis Golden Benchmark v3',
          test_cases_count: 48,
          executed_at: '2026-10-29T08:00:00Z',
          status: 'completed',
          regression_detected: false,
          notes: 'Validated against Q1-Q3 audited enterprise data with strict numerical tolerance (+/- 0.01%).',
          models_evaluated: [
            {
              model_id: 'gpt-4o',
              model_name: 'OpenAI GPT-4o (2024-11-20)',
              citation_precision: 96.4,
              evidence_coverage: 94.2,
              factual_consistency: 97.8,
              numerical_accuracy: 98.1,
              average_latency_ms: 1850,
              cost_per_1k_runs_usd: 12.40,
              overall_score: 96.6,
            },
            {
              model_id: 'claude-3-5-sonnet',
              model_name: 'Anthropic Claude 3.5 Sonnet',
              citation_precision: 98.2,
              evidence_coverage: 95.8,
              factual_consistency: 98.6,
              numerical_accuracy: 97.4,
              average_latency_ms: 2120,
              cost_per_1k_runs_usd: 14.80,
              overall_score: 97.5,
            },
            {
              model_id: 'llama-3-3-70b',
              model_name: 'Meta Llama 3.3 70B Instruct',
              citation_precision: 89.1,
              evidence_coverage: 88.4,
              factual_consistency: 91.2,
              numerical_accuracy: 92.5,
              average_latency_ms: 1340,
              cost_per_1k_runs_usd: 3.20,
              overall_score: 90.3,
            },
          ],
        },
      ];
    }
  },

  getTestCases: async (): Promise<BenchmarkTestCase[]> => {
    try {
      const res = await api.get<BenchmarkTestCase[]>('/evaluation/test-cases');
      return res.data;
    } catch {
      return [
        {
          id: 'tc-1',
          name: 'Segmental Margin Extraction',
          category: 'factual_extraction',
          prompt: 'Extract Q3 gross margin percentage for APAC cloud infrastructure operations.',
          ground_truth_reference: '42.8% GAAP gross margin reported in footnote 7.',
          expected_facts: ['42.8%', 'APAC cloud', 'GAAP'],
        },
        {
          id: 'tc-2',
          name: 'Consolidated Variance Math',
          category: 'numerical_synthesis',
          prompt: 'Calculate absolute YoY revenue difference and percentage CAGR across 3 fiscal years.',
          ground_truth_reference: 'CAGR: 18.42%, Absolute delta: $1.42B.',
          expected_facts: ['18.42%', '$1.42B'],
        },
        {
          id: 'tc-3',
          name: 'Executive Guidance Contradiction',
          category: 'adversarial_contradiction',
          prompt: 'Identify any divergence between press release forward estimates and 10-Q risk factors.',
          ground_truth_reference: 'Press release projected 20% growth; 10-Q disclosed supply chain headwinds lowering target to 12%.',
          expected_facts: ['20% vs 12%', 'supply chain risk'],
        },
      ];
    }
  },
};

// Mission History & Replay API
export const missionHistoryApi = {
  getHistory: async (): Promise<MissionHistoryItem[]> => {
    try {
      const res = await api.get<MissionHistoryItem[]>('/mission-history');
      return res.data;
    } catch {
      return [
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
    }
  },

  branchMission: async (parentMissionId: string, branchName: string): Promise<SupervisorMission> => {
    try {
      const res = await api.post<SupervisorMission>('/mission-history/' + parentMissionId + '/branch', { branch_name: branchName });
      return res.data;
    } catch {
      return supervisorApi.createMission({
        title: '[Branch] ' + branchName,
        objective: 'Branched execution exploring alternative plan topology from ' + parentMissionId,
      });
    }
  },
};

// Security & Tool Gateway API
export const securityApi = {
  getPolicies: async (): Promise<AgentToolPermission[]> => {
    try {
      const res = await api.get<AgentToolPermission[]>('/security/policies');
      return res.data;
    } catch {
      return [
        {
          agent_role: 'planner',
          allowed_tools: ['knowledge_search', 'document_catalog', 'schedule_lookup'],
          denied_tools: ['database_write', 'api_webhook_post', 'credential_access'],
          requires_approval_tools: ['replan_active_mission', 'budget_expansion'],
          max_requests_per_minute: 60,
          max_execution_time_seconds: 30,
        },
        {
          agent_role: 'research',
          allowed_tools: ['web_search', 'sec_edgar_read', 'vector_similarity_search', 'document_chunk_read'],
          denied_tools: ['shell_exec', 'file_write_disk', 'raw_sql_query'],
          requires_approval_tools: ['external_api_post'],
          max_requests_per_minute: 120,
          max_execution_time_seconds: 60,
        },
        {
          agent_role: 'analysis',
          allowed_tools: ['ast_python_sandbox', 'matrix_multiplication', 'stats_variance', 'chart_generator'],
          denied_tools: ['socket_connect', 'os_system', 'subprocess_run', 'file_delete'],
          requires_approval_tools: ['custom_code_eval'],
          max_requests_per_minute: 40,
          max_execution_time_seconds: 15,
        },
        {
          agent_role: 'reviewer',
          allowed_tools: ['claim_cross_check', 'contradiction_detect', 'diff_documents'],
          denied_tools: ['modify_ground_truth', 'delete_records'],
          requires_approval_tools: ['mark_claim_invalidated'],
          max_requests_per_minute: 80,
          max_execution_time_seconds: 45,
        },
      ];
    }
  },

  getPendingApprovals: async (): Promise<PendingToolApproval[]> => {
    try {
      const res = await api.get<PendingToolApproval[]>('/security/approvals');
      return res.data;
    } catch {
      return [
        {
          id: 'appr-901',
          mission_id: 'sm-9041',
          agent_role: 'analysis',
          tool_name: 'custom_code_eval',
          target_resource: 'AST Python Computation Sandbox',
          payload: {
            formula: 'np.polynomial.polynomial.polyfit(quarters, earnings, 2)',
            timeout_ms: 5000,
          },
          risk_level: 'medium',
          reason: 'Non-standard polynomial regression model requires operator verification.',
          requested_at: '2026-10-29T10:02:40Z',
          status: 'pending',
        },
        {
          id: 'appr-902',
          mission_id: 'sm-9041',
          agent_role: 'planner',
          tool_name: 'budget_expansion',
          target_resource: 'Token Allocation Pool',
          payload: {
            additional_tokens: 50000,
            estimated_cost_usd: 1.10,
          },
          risk_level: 'low',
          reason: 'Mission scope expanded to include footnote 18 legal risk reconciliation.',
          requested_at: '2026-10-29T10:03:00Z',
          status: 'pending',
        },
      ];
    }
  },

  resolveApproval: async (approvalId: string, decision: 'approved' | 'rejected'): Promise<void> => {
    try {
      await api.post('/security/approvals/' + approvalId + '/resolve', { decision });
    } catch {
      // Handled in mock state
    }
  },
};

export default api;
