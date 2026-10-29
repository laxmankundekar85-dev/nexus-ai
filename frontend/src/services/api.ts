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
} from '../types';

// ─── Axios Instance ────────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': '1',
  },
  timeout: 4000,
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

export default api;
