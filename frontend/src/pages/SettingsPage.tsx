import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  User,
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
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useNotifications } from '../hooks/useNotifications';
import { Bell, BellRing } from 'lucide-react';
import { Smartphone, Download, CheckCircle, Shield } from 'lucide-react';
import { settingsApi, SystemConfig } from '../services/api';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { isInstallable, isInstalled, installApp } = usePWAInstall();
  const { isGranted: notifGranted, requestPermission: reqNotif, notifyTaskCompleted } = useNotifications();
  
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
      const result = await settingsApi.testConnection({
        provider: selectedProvider,
        api_key: apiKey || undefined,
      });
      setTestResult(result);
      if (result.success) {
        toast.success(`Connection verified: ${result.message}`);
      } else {
        toast.error(`Connection failed: ${result.message}`);
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
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6 sm:space-y-7 font-sans">
      {/* Header */}
      <div className="border-b border-slate-300 dark:border-white/10 pb-6">
        <h1 className="text-xl sm:text-2xl font-bold font-title text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          System Settings & AI Engine Configuration
        </h1>
        <p className="text-xs text-slate-600 dark:text-zinc-400 font-body mt-1">
          Configure real-time web search, LLM providers (Groq, OpenAI, Gemini, Anthropic), and runtime parameters.
        </p>
      </div>

      {/* Real-Time AI Engine Configuration Card */}
      <div className="p-6 rounded-2xl bg-white/75 dark:bg-[#0c0c0e]/80 border border-white/80 dark:border-white/12 shadow-xl backdrop-blur-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-white/10 gap-2">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-semibold font-heading text-slate-950 dark:text-white uppercase tracking-wider">
              AI Engine & Real-Time Intelligence
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Search Active (DuckDuckGo Real-Time)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1.5">
              Active Intelligence Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full bg-slate-200/90 dark:bg-zinc-950 border border-slate-300 dark:border-white/20 text-slate-950 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 font-mono font-semibold"
            >
              <option value="autonomous">Autonomous Live Crawler (100% Free, Real Web)</option>
              <option value="groq">Groq Cloud (Free Llama 3.3 70B, Ultra-Fast)</option>
              <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
              <option value="gemini">Google Gemini (Gemini 1.5 Flash/Pro)</option>
              <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
              <option value="ollama">Local Ollama (Offline / Localhost)</option>
            </select>
            <p className="text-[11px] text-slate-800 dark:text-zinc-400 font-semibold mt-1.5">
              {selectedProvider === 'autonomous'
                ? 'Retrieves verified live web data, prices, and specs with 0 API keys.'
                : `Connects to ${selectedProvider.toUpperCase()} for deep generative synthesis.`}
            </p>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{selectedProvider === 'autonomous' ? 'Search Provider API Key (Optional)' : `${selectedProvider.toUpperCase()} API Key`}</span>
              <span className="text-[10px] text-slate-700 dark:text-zinc-400 font-mono font-semibold">
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
                className="w-full bg-slate-200/90 dark:bg-zinc-950 border border-slate-300 dark:border-white/20 text-slate-950 dark:text-white text-xs rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 font-mono font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls & Ping Test */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-300 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              onClick={handleTestConnection}
              disabled={testing}
              className="flex items-center gap-1.5 text-xs"
            >
              {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5 text-blue-700 dark:text-white" />}
              Test Live Connection
            </Button>

            {testResult && (
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${testResult.success ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}`}>
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
            className="flex items-center justify-center gap-1.5 text-xs"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Engine Configuration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-300 dark:border-white/10">
            <User className="w-4 h-4 text-blue-700 dark:text-white" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Operator Profile</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-800 dark:text-zinc-400 font-semibold block mb-1 font-medium">Email Account</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 bg-slate-200/90 dark:bg-zinc-950 px-3.5 py-2 rounded-xl block border border-slate-300 dark:border-white/15 font-semibold text-slate-950 dark:text-white">
                {currentUser?.email || 'nexus@nexusai.corp'}
              </span>
            </div>
            <div>
              <span className="text-slate-800 dark:text-zinc-400 font-semibold block mb-1 font-medium">Account Identifier</span>
              <span className="font-mono text-slate-500 dark:text-slate-400 bg-slate-200/90 dark:bg-zinc-950 px-3.5 py-2 rounded-xl block border border-slate-300 dark:border-white/15 text-slate-800 dark:text-zinc-300 font-medium">
                {currentUser?.id || 'sys-local-operator'}
              </span>
            </div>
            <div>
              <span className="text-slate-800 dark:text-zinc-400 font-semibold block mb-1 font-medium">Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Authenticated Session
              </span>
            </div>
          </div>
        </Card>

        {/* Android & Mobile PWA App Management */}
        <Card className="p-6 space-y-4 md:col-span-2 bg-gradient-to-br from-blue-950/20 to-transparent border-blue-500/20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-300 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Android App & Mobile PWA</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Trusted Web Activity (TWA) Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-200/90 dark:bg-zinc-950 border border-slate-300 dark:border-white/15">
              <span className="text-slate-600 dark:text-zinc-400 block mb-1">Android Package Status</span>
              <div className="flex items-center gap-1.5 font-bold">
                {isInstalled ? (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Installed (Standalone)
                  </span>
                ) : isInstallable ? (
                  <span className="text-blue-400 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5" /> Ready for Install
                  </span>
                ) : (
                  <span className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">Active (Web Engine)</span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-200/90 dark:bg-zinc-950 border border-slate-300 dark:border-white/15">
              <span className="text-slate-600 dark:text-zinc-400 block mb-1">App Package ID (TWA)</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 font-bold text-[11px]">ai.nexus.app</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-200/90 dark:bg-zinc-950 border border-slate-300 dark:border-white/15">
              <span className="text-slate-600 dark:text-zinc-400 block mb-1">Offline Cache Engine</span>
              <span className="text-emerald-500 font-mono font-bold text-[11px]">v1 Active (Stale-While-Revalidate)</span>
            </div>
          </div>

          
          {/* Notification Alert Controls */}
          <div className="p-3.5 rounded-xl bg-slate-200/90 dark:bg-zinc-950 border border-slate-300 dark:border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-xs">Task & Mission Completion Alerts</span>
                <span className="text-[11px] text-slate-600 dark:text-zinc-400">
                  {notifGranted ? 'Native notifications active on lockscreen and notification shade' : 'Enable to get alerted when background agent tasks conclude'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {notifGranted ? (
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => notifyTaskCompleted('Market Analysis & Synthesis', 'Reviewer Agent')}
                  icon={<Bell className="w-3.5 h-3.5" />}
                >
                  Send Test Notification
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="xs"
                  onClick={reqNotif}
                  icon={<BellRing className="w-3.5 h-3.5" />}
                >
                  Enable Notifications
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
              Official signed native APK for Android 11, 12, 13, 14, and 15 with zero Chrome browser notifications, persistent login, and lockscreen alerts.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="/NexusAI.apk"
                download="NexusAI.apk"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download Native APK (.apk)
              </a>
            </div>
          </div>
        </Card>

        {/* Security & Isolation */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-300 dark:border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Security & Isolation</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-200/90 dark:bg-zinc-950 border border-slate-300 dark:border-white/15">
              <span className="text-slate-900 dark:text-zinc-300 font-bold font-medium">Multi-Tenant Isolation</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[11px]">Enforced (SQL-level)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-200/90 dark:bg-zinc-950 border border-slate-300 dark:border-white/15">
              <span className="text-slate-900 dark:text-zinc-300 font-bold font-medium">Path Traversal Guard</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[11px]">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-200/90 dark:bg-zinc-950 border border-slate-300 dark:border-white/15">
              <span className="text-slate-900 dark:text-zinc-300 font-bold font-medium">Approval Gate Controls</span>
              <span className="text-blue-700 dark:text-white font-bold font-mono text-[11px]">Configured</span>
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
