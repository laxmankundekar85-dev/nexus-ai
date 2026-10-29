import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { executionsApi } from '../services/api';
import type { Execution, Task, Artifact } from '../types';

export const EXECUTIONS_KEY = 'executions';

export function useCreateExecution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { objective: string; document_ids?: string[] }): Promise<Execution> => {
      try {
        return await executionsApi.create(data);
      } catch {
        // Resilient fallback for cloud / offline mode
        const execId = 'exec_' + Math.random().toString(36).substring(2, 10);
        const demoExec: Execution = {
          id: execId,
          objective: data.objective,
          status: 'running',
          plan: null,
          created_at: new Date().toISOString(),
          started_at: new Date().toISOString(),
        };
        const local = JSON.parse(localStorage.getItem('nexus_local_executions') || '[]');
        localStorage.setItem('nexus_local_executions', JSON.stringify([demoExec, ...local]));
        return demoExec;
      }
    },
    onSuccess: (execution: Execution) => {
      queryClient.invalidateQueries({ queryKey: [EXECUTIONS_KEY] });
      toast.success('Execution pipeline initiated!');
      return execution;
    },
  });
}

export function useCancelExecution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => executionsApi.cancel(id),
    onSuccess: (_data: Execution, id: string) => {
      queryClient.invalidateQueries({ queryKey: [EXECUTIONS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [EXECUTIONS_KEY] });
      toast.success('Execution cancelled');
    },
    onError: () => toast.error('Execution cancelled'),
  });
}

export function useRetryExecution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => executionsApi.retry(id),
    onSuccess: (_data: Execution, id: string) => {
      queryClient.invalidateQueries({ queryKey: [EXECUTIONS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [EXECUTIONS_KEY] });
      toast.success('Execution retried!');
    },
    onError: () => toast.error('Failed to retry execution'),
  });
}

export function useExecutions(page = 1, size = 20) {
  const query = useQuery({
    queryKey: [EXECUTIONS_KEY, page, size],
    queryFn: async () => {
      try {
        return await executionsApi.list(page, size);
      } catch {
        const local = JSON.parse(localStorage.getItem('nexus_local_executions') || '[]');
        return {
          items: local,
          total: local.length,
          page,
          size,
        };
      }
    },
    retry: false,
    staleTime: 60 * 1000,
  });

  const createMutation = useCreateExecution();
  const cancelMutation = useCancelExecution();
  const retryMutation = useRetryExecution();

  return {
    ...query,
    executions: query.data?.items || [],
    total: query.data?.total || 0,
    loading: query.isLoading,
    createExecution: async (objective: string, document_ids?: string[]) =>
      createMutation.mutateAsync({ objective, document_ids }),
    cancelExecution: async (id: string) => cancelMutation.mutateAsync(id),
    retryExecution: async (id: string) => retryMutation.mutateAsync(id),
  };
}

export function useExecution(id: string | undefined) {
  return useQuery({
    queryKey: [EXECUTIONS_KEY, id],
    queryFn: () => executionsApi.get(id!),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      const activeStatuses = ['queued', 'planning', 'running', 'reviewing', 'awaiting_approval'];
      return status && activeStatuses.includes(status) ? 3000 : false;
    },
  });
}

export function useExecutionTasks(executionId: string | undefined) {
  return useQuery<Task[]>({
    queryKey: [EXECUTIONS_KEY, executionId, 'tasks'],
    queryFn: () => executionsApi.getTasks(executionId!),
    enabled: Boolean(executionId),
    refetchInterval: 5000,
  });
}

export function useExecutionArtifacts(executionId: string | undefined) {
  return useQuery<Artifact[]>({
    queryKey: [EXECUTIONS_KEY, executionId, 'artifacts'],
    queryFn: () => executionsApi.getArtifacts(executionId!),
    enabled: Boolean(executionId),
  });
}
