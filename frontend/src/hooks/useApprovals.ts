import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { approvalsApi } from '../services/api';

export const APPROVALS_KEY = 'approvals';

export function useResolveApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      decision,
      reason,
    }: {
      id: string;
      decision: 'approved' | 'rejected';
      reason?: string;
    }) => approvalsApi.resolve(id, decision, reason),
    onSuccess: (_data, { decision }) => {
      queryClient.invalidateQueries({ queryKey: [APPROVALS_KEY] });
      toast.success(
        decision === 'approved' ? 'Action approved!' : 'Action rejected'
      );
    },
    onError: () => toast.error('Failed to process approval'),
  });
}

export function useApprovals(executionId?: string) {
  const query = useQuery({
    queryKey: [APPROVALS_KEY, executionId],
    queryFn: async () => {
      try {
        return await approvalsApi.list(executionId);
      } catch {
        return [];
      }
    },
    refetchInterval: executionId ? 5000 : false,
    retry: false,
    staleTime: 30 * 1000,
  });

  const resolveMutation = useResolveApproval();

  return {
    ...query,
    approvals: query.data || [],
    loading: query.isLoading,
    resolveApproval: async (id: string, decision: 'approved' | 'rejected', reason?: string) =>
      resolveMutation.mutateAsync({ id, decision, reason }),
  };
}
