import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Cpu,
  Search,
  ShieldCheck,
  User,
  Key,
  CheckCircle2,
  XCircle,
  Loader2,
  Globe,
  Save,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import Button from '../components/Button';
import { settingsApi, SystemConfig } from '../services/api';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [selectedProvider, setSelectedProvider] = useState<string>('autonomous');
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency_ms?: number } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getConfig();
      setConfig(data);
      setSelectedProvider(data.llm_provider || 'autonomous');
    } catch {
      // Fallback defaults
      setConfig({
        llm_provider: 'autonomous',
        llm_model: 'gpt-4o',
        search_provider: 'ddgs',
        has_openai_key: false,
        openai_key_masked: 'Not Configured',
        has_groq_key: false,
        groq_key_masked: 'Not Configured',
        has_gemini_key: false,
        gemini_key_masked: 'Not Configured',
        has_anthropic_key: false,
        anthropic_key_masked: 'Not Configured',
        has_tavily_key: false,
        tavily_key_masked: 'Not Configured',
        live_web_status: 'Active (DuckDuckGo Live)',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload: Record<string, any> = {
        llm_provider: selectedProvider,
      };

      if (apiKey.trim()) {
        if (selectedProvider === 'groq') {
          payload.groq_api_key = apiKey.trim();
        } else if (selectedProvider === 'gemini') {
          payload.gemini_api_key = apiKey.trim();
        } else if (selectedProvider === 'anthropic') {
          payload.anthropic_api_key = apiKey.trim();
        } else {
          payload.llm_api_key = apiKey.trim();
        }
      }

      await settingsApi.updateConfig(payload);
      toast.success(`Active AI engine updated to ${selectedProvider.toUpperCase()}`);
      setApiKey('');
      await loadConfig();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      setTestResult(null);

      const targetProv = selectedProvider === 'autonomous' ? 'ddgs' : selectedProvider;
      const res = await settingsApi.testConnection({
        provider: targetProv,
        api_key: apiKey.trim() || undefined,
      });

      setTestResult(res);
      if (res.success) {
        toast.success(`Connected! Latency: ${res.latency_ms}ms`);
      } else {
        toast.error(res.message || 'Connection test failed');
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.response?.data?.detail || 'Failed to ping provider',
      });
      toast.error('Connection test failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-4 sm:p-7 max-w-5xl mx-auto w-full space-y-5">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-slate-400" />
          System Settings & AI Engine Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure real-time web search, LLM providers (Groq, OpenAI, Gemini, Anthropic), and runtime parameters.
        </p>
      </div>

      {/* Real-Time AI Engine Configuration Card */}
      <Card className="p-5 space-y-4 border-blue-900/40 bg-gradient-to-br from-[#0c1322] to-[#080d1a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              AI Engine & Real-Time Intelligence
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Search Active (DuckDuckGo Real-Time)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Active Intelligence Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full bg-[#070b14] border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value="autonomous">Autonomous Live Crawler (100% Free, Real Web)</option>
              <option value="groq">Groq Cloud (Free Llama 3.3 70B, Ultra-Fast)</option>
              <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
              <option value="gemini">Google Gemini (Gemini 1.5 Flash/Pro)</option>
              <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
              <option value="ollama">Local Ollama (Offline / Localhost)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              {selectedProvider === 'autonomous'
                ? 'Retrieves verified live web data, prices, and specs with 0 API keys.'
                : `Connects to ${selectedProvider.toUpperCase()} for deep generative synthesis.`}
            </p>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>{selectedProvider === 'autonomous' ? 'Search Provider API Key (Optional)' : `${selectedProvider.toUpperCase()} API Key`}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {selectedProvider === 'groq' && config?.has_groq_key && `Saved: ${config.groq_key_masked}`}
                {selectedProvider === 'openai' && config?.has_openai_key && `Saved: ${config.openai_key_masked}`}
                {selectedProvider === 'gemini' && config?.has_gemini_key && `Saved: ${config.gemini_key_masked}`}
                {selectedProvider === 'anthropic' && config?.has_anthropic_key && `Saved: ${config.anthropic_key_masked}`}
              </span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  selectedProvider === 'autonomous'
                    ? 'Leave empty to use DuckDuckGo Live (Free) or enter Tavily Key'
                    : `Enter your ${selectedProvider.toUpperCase()} API key...`
                }
                className="w-full bg-[#070b14] border border-slate-800 text-slate-200 text-xs rounded-lg pl-3 pr-9 py-2 focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls & Ping Test */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              onClick={handleTestConnection}
              disabled={testing}
              className="flex items-center gap-1.5 text-xs"
            >
              {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5 text-blue-400" />}
              Test Live Connection
            </Button>

            {testResult && (
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${testResult.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                {testResult.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {testResult.latency_ms ? `${testResult.latency_ms}ms` : ''} {testResult.message}
              </span>
            )}
          </div>

          <Button
            variant="primary"
            size="xs"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Engine Configuration
          </Button>
        </div>
      </Card>

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
                {currentUser?.email || 'nexus@nexusai.corp'}
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
