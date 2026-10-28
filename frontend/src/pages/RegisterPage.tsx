import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';

export const RegisterPage: React.FC = () => {
  const { register, login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    await register(email, password);
  };

  const displayError = validationError || error;

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Operator Account</h2>
        <p className="text-xs text-slate-800 dark:text-zinc-400 font-semibold mt-1">
          Deploy and monitor autonomous multi-agent pipelines
        </p>
      </div>

      {displayError && (
        <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-300 font-medium">
          {displayError}
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

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon={<UserPlus className="w-4 h-4" />}
          className="w-full mt-2"
        >
          Create Account
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
        Already registered?{' '}
        <Link to="/login" className="text-blue-700 dark:text-white hover:text-blue-800 dark:hover:text-zinc-200 font-extrabold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
