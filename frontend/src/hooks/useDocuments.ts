import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { documentsApi } from '../services/api';

export const DOCUMENTS_KEY = 'documents';

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => documentsApi.upload(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY] });
      toast.success('Document uploaded successfully!');
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to upload document';
      toast.error(msg);
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY] });
      toast.success('Document deleted');
    },
    onError: () => toast.error('Failed to delete document'),
  });
}

export function useDocuments(page = 1, size = 20) {
  const query = useQuery({
    queryKey: [DOCUMENTS_KEY, page, size],
    queryFn: () => documentsApi.list(page, size),
  });

  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();

  return {
    ...query,
    documents: query.data?.items || [],
    total: query.data?.total || 0,
    loading: query.isLoading,
    uploadDocument: async (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      return uploadMutation.mutateAsync(fd);
    },
    deleteDocument: async (id: string) => deleteMutation.mutateAsync(id),
  };
}

export function useDocument(id: string | undefined) {
  return useQuery({
    queryKey: [DOCUMENTS_KEY, id],
    queryFn: () => documentsApi.get(id!),
    enabled: Boolean(id),
  });
}

export function useDocumentText(id: string | undefined) {
  return useQuery({
    queryKey: [DOCUMENTS_KEY, id, 'text'],
    queryFn: () => documentsApi.getText(id!),
    enabled: Boolean(id),
  });
}
