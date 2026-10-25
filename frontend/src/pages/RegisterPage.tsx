import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';

export const RegisterPage: React.FC = () => {
  const { register, loading, error } = useAuth();
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
      <div className="mb-5 text-center">
        <h2 className="text-xl font-semibold text-slate-100 tracking-tight">Create Operator Account</h2>
        <p className="text-xs text-slate-400 mt-1">
          Deploy and monitor autonomous multi-agent pipelines
        </p>
      </div>

      {displayError && (
        <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
          {displayError}
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
      </form>

      <div className="mt-5 text-center text-xs text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
