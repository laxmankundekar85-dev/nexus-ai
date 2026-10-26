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
      <div className="mb-5 text-center">
        <h2 className="text-xl font-semibold text-slate-100 tracking-tight">Operator Sign In</h2>
        <p className="text-xs text-slate-400 mt-1">
          Authenticate to manage autonomous agent pipelines
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
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
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => login(email || 'operator@nexus.ai', password || 'operator123')}
          className="w-full text-xs"
        >
          ⚡ Instant One-Click Demo Access
        </Button>
      </form>

      <div className="mt-5 text-center text-xs text-slate-400">
        New operator?{' '}
        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
