import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';
import type { User } from '../types';

const TOKEN_KEY = 'nexus_token';
const USER_KEY = 'nexus_user';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem(TOKEN_KEY);
  const isAuthenticated = Boolean(token);

  const { data: currentUser } = useQuery<User>({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const tokens = await authApi.login({ email, password });
        localStorage.setItem(TOKEN_KEY, tokens.access_token);
        await queryClient.invalidateQueries({ queryKey: ['me'] });
        toast.success('Welcome back!');
        navigate('/dashboard');
      } catch (err: unknown) {
        const networkError = (err as { code?: string })?.code === 'ERR_NETWORK' || !(err as { response?: unknown })?.response;
        const msg = networkError
          ? 'Cannot connect to backend server. Please start the backend on port 8000.'
          : (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Invalid email or password';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [navigate, queryClient]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        await authApi.register({ email, password });
        // Auto-login after register
        const tokens = await authApi.login({ email, password });
        localStorage.setItem(TOKEN_KEY, tokens.access_token);
        await queryClient.invalidateQueries({ queryKey: ['me'] });
        toast.success('Account created! Welcome to Nexus AI.');
        navigate('/dashboard');
      } catch (err: unknown) {
        const networkError = (err as { code?: string })?.code === 'ERR_NETWORK' || !(err as { response?: unknown })?.response;
        const msg = networkError
          ? 'Cannot connect to backend server. Please start the backend on port 8000.'
          : (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Registration failed. Please try again.';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [navigate, queryClient]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    queryClient.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  }, [navigate, queryClient]);

  return {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
}
