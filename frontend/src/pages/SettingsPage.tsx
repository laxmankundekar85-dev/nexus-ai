import React from 'react';
import {
  Settings as SettingsIcon,
  Cpu,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import Button from '../components/Button';

export const SettingsPage: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="p-7 max-w-5xl mx-auto w-full space-y-5">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-slate-400" />
          System Settings & Platform Status
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Operator credentials, active AI provider configuration, and runtime isolation parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Profile Card */}
        <Card className="p-5 space-y-3.5">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
            <User className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Operator Profile</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Email Account</span>
              <span className="font-mono text-slate-200 bg-[#0b0f19] px-3 py-1.5 rounded-lg block border border-slate-800">
                {currentUser?.email || 'nexus@local'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Account Identifier</span>
              <span className="font-mono text-slate-500 bg-[#0b0f19] px-3 py-1.5 rounded-lg block border border-slate-800">
                {currentUser?.id || 'sys-local-operator'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Authenticated Session
              </span>
            </div>
          </div>
        </Card>

        {/* AI Provider Config */}
        <Card className="p-5 space-y-3.5">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">AI Engine Status</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0b0f19] border border-slate-800">
              <span className="text-slate-300">Active Engine</span>
              <span className="font-mono text-blue-400 font-semibold">Autonomous / Mock Engine</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0b0f19] border border-slate-800">
              <span className="text-slate-300">Target Model</span>
              <span className="font-mono text-slate-300">gpt-4o / multi-agent</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0b0f19] border border-slate-800">
              <span className="text-slate-300">Credential Storage</span>
              <span className="text-emerald-400 font-semibold font-mono text-[11px]">Server-side Only (.env)</span>
            </div>
          </div>
        </Card>

        {/* Integrations */}
        <Card className="p-5 space-y-3.5">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
            <Search className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Integrations</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0b0f19] border border-slate-800">
              <span className="text-slate-300">Research Provider</span>
              <span className="font-mono text-slate-300">Tavily / Verified Mock</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0b0f19] border border-slate-800">
              <span className="text-slate-300">Storage Layer</span>
              <span className="font-mono text-slate-300">Local Encrypted Path</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0b0f19] border border-slate-800">
              <span className="text-slate-300">Streaming Protocol</span>
              <span className="font-mono text-emerald-400 text-[11px]">Server-Sent Events (SSE)</span>
            </div>
          </div>
        </Card>

        {/* Security & Isolation */}
        <Card className="p-5 space-y-3.5">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Security & Isolation</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0b0f19] border border-slate-800">
              <span className="text-slate-300">Multi-Tenant Isolation</span>
              <span className="text-emerald-400 font-semibold font-mono text-[11px]">Enforced (SQL-level)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0b0f19] border border-slate-800">
              <span className="text-slate-300">Path Traversal Guard</span>
              <span className="text-emerald-400 font-semibold font-mono text-[11px]">Active</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0b0f19] border border-slate-800">
              <span className="text-slate-300">Approval Gate Controls</span>
              <span className="text-blue-400 font-semibold font-mono text-[11px]">Configured</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="pt-2 flex justify-end">
        <Button variant="danger" size="xs" onClick={logout}>
          Sign Out of Session
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
