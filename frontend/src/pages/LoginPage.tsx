import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';

export const LoginPage: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Operator Sign In</h2>
        <p className="text-xs text-slate-800 dark:text-zinc-400 font-semibold mt-1">
          Authenticate to manage autonomous agent pipelines
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-300 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="operator@enterprise.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon={<LogIn className="w-4 h-4" />}
          className="w-full mt-2"
        >
          Sign In
        </Button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-300 dark:border-white/15"></div>
          <span className="flex-shrink mx-3 text-[11px] text-slate-700 dark:text-zinc-400 uppercase tracking-wider font-bold">or</span>
          <div className="flex-grow border-t border-slate-300 dark:border-white/15"></div>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => login('operator@nexus.ai', 'operator123')}
          className="w-full text-xs font-semibold"
        >
          ⚡ Instant One-Click Demo Access
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-800 dark:text-zinc-400 font-medium">
        New operator?{' '}
        <Link to="/register" className="text-blue-700 dark:text-white hover:text-blue-800 dark:hover:text-zinc-200 font-extrabold hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
