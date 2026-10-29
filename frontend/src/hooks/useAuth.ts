import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Default demo account
const DEMO_ACCOUNTS: Record<string, string> = {
  'operator@nexus.ai': 'operator123',
};

function getLocalRegisteredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (isAuthenticated && !currentUser) {
      authApi
        .getMe()
        .then((user) => {
          setCurrentUser(user);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        })
        .catch(() => {});
    }
  }, [isAuthenticated, currentUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      const normalizedEmail = (email || '').trim().toLowerCase();

      if (!normalizedEmail || !password) {
        const msg = 'Please enter both email and password.';
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      try {
        let backendSucceeded = false;
        let backendErrorDetail: string | null = null;

        // 1. Attempt Backend API authentication first (if backend is active)
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

        // If backend actively rejected credentials with a specific error
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
          setCurrentUser(user);
          toast.success('Welcome back!');
          navigate('/dashboard');
          return;
        }

        // 2. Client / Offline mode: STRICT credential validation
        const registered = getLocalRegisteredAccounts();
        const stored = registered.find((a) => a.email.toLowerCase() === normalizedEmail);
        const demoPassword = DEMO_ACCOUNTS[normalizedEmail];

        // Check if account exists
        if (!stored && !demoPassword) {
          const notFoundMsg = 'No account found with this email. Please check your email or click Create an account.';
          setError(notFoundMsg);
          toast.error(notFoundMsg);
          return;
        }

        // Check password strictly against the stored / registered password
        const expectedPassword = stored ? stored.password : demoPassword;
        if (expectedPassword !== password) {
          const wrongPwMsg = 'Incorrect password. Please verify your credentials.';
          setError(wrongPwMsg);
          toast.error(wrongPwMsg);
          return;
        }

        // Password matches! Establish authenticated session
        const user: User = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          email: normalizedEmail,
          created_at: stored?.created_at || new Date().toISOString(),
        };
        localStorage.setItem(TOKEN_KEY, 'nexus_operator_token_' + Date.now());
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setCurrentUser(user);
        toast.success(`Welcome back, ${normalizedEmail}!`);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      const normalizedEmail = (email || '').trim().toLowerCase();

      if (!normalizedEmail || !password) {
        const msg = 'Please enter both email and password.';
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      try {
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

        // Save new registered account with this password
        saveLocalRegisteredAccount(normalizedEmail, password);

        const user: User = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          email: normalizedEmail,
          created_at: new Date().toISOString(),
        };
        if (!localStorage.getItem(TOKEN_KEY)) {
          localStorage.setItem(TOKEN_KEY, 'nexus_operator_token_' + Date.now());
        }
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setCurrentUser(user);
        toast.success('Account registered! Welcome to Nexus AI.');
        navigate('/dashboard');
      } catch (err: unknown) {
        const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
        setError(detail || 'Failed to create account');
        toast.error(detail || 'Failed to create account');
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setCurrentUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  }, [navigate]);

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

export default useAuth;
