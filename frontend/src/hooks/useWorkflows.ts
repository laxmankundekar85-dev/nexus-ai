import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { workflowsApi } from '../services/api';
import type { WorkflowGraph } from '../types';

export const WORKFLOWS_KEY = 'workflows';

export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description: string; workflow_definition: WorkflowGraph }) =>
      workflowsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_KEY] });
      toast.success('Workflow saved!');
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to save workflow';
      toast.error(msg);
    },
  });
}

export function useUpdateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{ name: string; description: string; workflow_definition: WorkflowGraph }>;
    }) => workflowsApi.update(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_KEY] });
      toast.success('Workflow updated!');
    },
    onError: () => toast.error('Failed to update workflow'),
  });
}

export function useDeleteWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workflowsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_KEY] });
      toast.success('Workflow deleted');
    },
    onError: () => toast.error('Failed to delete workflow'),
  });
}

export function useWorkflows(page = 1, size = 20) {
  const query = useQuery({
    queryKey: [WORKFLOWS_KEY, page, size],
    queryFn: () => workflowsApi.list(page, size),
  });

  const createMutation = useCreateWorkflow();
  const updateMutation = useUpdateWorkflow();
  const deleteMutation = useDeleteWorkflow();

  return {
    ...query,
    workflows: query.data?.items || [],
    total: query.data?.total || 0,
    loading: query.isLoading,
    createWorkflow: async (name: string, description: string, workflow_definition: WorkflowGraph) =>
      createMutation.mutateAsync({ name, description, workflow_definition }),
    updateWorkflow: async (
      id: string,
      data: Partial<{ name: string; description: string; workflow_definition: WorkflowGraph }>
    ) => updateMutation.mutateAsync({ id, data }),
    deleteWorkflow: async (id: string) => deleteMutation.mutateAsync(id),
  };
}

export function useWorkflow(id: string | undefined) {
  return useQuery({
    queryKey: [WORKFLOWS_KEY, id],
    queryFn: () => workflowsApi.get(id!),
    enabled: Boolean(id),
  });
}

export function useValidateWorkflow() {
  return useMutation({
    mutationFn: (id: string) => workflowsApi.validate(id),
    onSuccess: (result) => {
      if (result.valid) {
        toast.success('Workflow is valid!');
      } else {
        toast.error(`Workflow has ${result.errors.length} error(s)`);
      }
    },
    onError: () => toast.error('Validation failed'),
  });
}
