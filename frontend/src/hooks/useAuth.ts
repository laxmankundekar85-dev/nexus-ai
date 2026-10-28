import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';
import type { User } from '../types';

const TOKEN_KEY = 'nexus_token';
const USER_KEY = 'nexus_user';
const REGISTERED_USERS_KEY = 'nexus_registered_users';

interface StoredAccount {
  email: string;
  password: string;
  created_at: string;
}

// Pre-configured default demo operators
const DEFAULT_ACCOUNTS: Record<string, string> = {
  'operator@nexus.ai': 'operator123',
  'laxmankundekar85@gmail.com': 'Password123!',
};

function getLocalRegisteredAccounts(): StoredAccount[] {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalRegisteredAccount(email: string, password: string): StoredAccount {
  const accounts = getLocalRegisteredAccounts();
  const normalized = email.trim().toLowerCase();
  const existingIdx = accounts.findIndex((a) => a.email.toLowerCase() === normalized);
  const record: StoredAccount = {
    email: normalized,
    password,
    created_at: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    accounts[existingIdx] = record;
  } else {
    accounts.push(record);
  }
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(accounts));
  return record;
}

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
      const normalizedEmail = (email || '').trim().toLowerCase();

      if (!normalizedEmail || !password) {
        setError('Please enter both email and password.');
        toast.error('Please enter both email and password.');
        setLoading(false);
        return;
      }

      try {
        let backendSucceeded = false;
        let backendErrorDetail: string | null = null;

        // 1. Attempt Backend API authentication first
        try {
          const tokens = await authApi.login({ email: normalizedEmail, password });
          if (tokens?.access_token) {
            localStorage.setItem(TOKEN_KEY, tokens.access_token);
            backendSucceeded = true;
          }
        } catch (err: unknown) {
          const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
          if (detail && typeof detail === 'string') {
            backendErrorDetail = detail;
          }
        }

        // If backend actively rejected the credentials, do NOT log in!
        if (backendErrorDetail) {
          setError(backendErrorDetail);
          toast.error(backendErrorDetail);
          return;
        }

        if (backendSucceeded) {
          const user: User = {
            id: 'usr_' + Math.random().toString(36).substring(2, 9),
            email: normalizedEmail,
            created_at: new Date().toISOString(),
          };
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          await queryClient.invalidateQueries({ queryKey: ['me'] });
          toast.success('Welcome back!');
          navigate('/dashboard');
          return;
        }

        // 2. Client / Offline mode: verify against strictly registered accounts
        const registeredAccounts = getLocalRegisteredAccounts();
        const stored = registeredAccounts.find((a) => a.email.toLowerCase() === normalizedEmail);
        const defaultPassword = DEFAULT_ACCOUNTS[normalizedEmail];

        if (!stored && !defaultPassword) {
          const notFoundMsg = 'No account found with this email. Please create an account first.';
          setError(notFoundMsg);
          toast.error(notFoundMsg);
          return;
        }

        const validPassword = stored ? stored.password : defaultPassword;
        if (validPassword !== password) {
          const wrongPwMsg = 'Incorrect password. Please verify your credentials.';
          setError(wrongPwMsg);
          toast.error(wrongPwMsg);
          return;
        }

        // Verified successfully!
        const user: User = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          email: normalizedEmail,
          created_at: stored?.created_at || new Date().toISOString(),
        };
        localStorage.setItem(TOKEN_KEY, 'nexus_operator_token_' + Date.now());
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        await queryClient.invalidateQueries({ queryKey: ['me'] });
        toast.success('Welcome back!');
        navigate('/dashboard');
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
      const normalizedEmail = (email || '').trim().toLowerCase();

      if (!normalizedEmail || !password) {
        setError('Please enter both email and password.');
        toast.error('Please enter both email and password.');
        setLoading(false);
        return;
      }

      try {
        // 1. Attempt backend registration if API is reachable
        try {
          await authApi.register({ email: normalizedEmail, password });
          try {
            const tokens = await authApi.login({ email: normalizedEmail, password });
            if (tokens?.access_token) {
              localStorage.setItem(TOKEN_KEY, tokens.access_token);
            }
          } catch {
            // fallback token will be assigned
          }
        } catch {
          // Backend offline or unreachable
        }

        // 2. Persist account locally so future logins will validate against this email & password
        saveLocalRegisteredAccount(normalizedEmail, password);

        // 3. Establish authenticated session
        const user: User = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          email: normalizedEmail,
          created_at: new Date().toISOString(),
        };
        if (!localStorage.getItem(TOKEN_KEY)) {
          localStorage.setItem(TOKEN_KEY, 'nexus_operator_token_' + Date.now());
        }
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        await queryClient.invalidateQueries({ queryKey: ['me'] });
        toast.success('Account created! Welcome to Nexus AI.');
        navigate('/dashboard');
      } catch (err: unknown) {
        const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
        setError(detail || 'Failed to create account');
        toast.error(detail || 'Failed to create account');
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
