import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  FileCheck2,
  Workflow,
  Search,
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-[#071120] dark:via-[#0c182b] dark:to-[#071120] text-slate-800 dark:text-slate-100 font-sans selection:bg-sky-500/20 selection:text-sky-900 dark:selection:text-sky-200 relative overflow-hidden transition-colors duration-300">
      {/* Ambient glass light orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-400/15 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-400/15 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-sky-100/80 dark:border-sky-400/20 sticky top-0 z-40 bg-white/75 dark:bg-[#0c182b]/80 backdrop-blur-xl shadow-sm shadow-sky-500/5 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25 ring-1 ring-white/50">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              NEXUS <span className="text-sky-600 dark:text-sky-400 text-xs font-mono font-semibold px-1.5 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-500/30">OS</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme switcher toggle button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle light or dark theme"
              className="p-2 rounded-xl text-slate-600 dark:text-sky-300 hover:text-sky-600 dark:hover:text-white hover:bg-sky-50/80 dark:hover:bg-sky-950/60 border border-transparent hover:border-sky-200 dark:hover:border-sky-400/30 transition-all duration-200"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-sky-600" />}
            </button>

            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/register')}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-20 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-200/80 dark:border-sky-400/30 bg-white/70 dark:bg-sky-950/40 backdrop-blur-md text-sky-700 dark:text-sky-300 text-xs font-medium mb-6 shadow-sm shadow-sky-500/5">
          <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 animate-pulse" />
          Autonomous Multi-Agent Operating System
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-3xl mx-auto mb-6">
          Enterprise AI Agents that{' '}
          <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-300 dark:via-blue-300 dark:to-indigo-200 bg-clip-text text-transparent">
            Plan, Execute, & Deliver.
          </span>
        </h1>

        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          Provide high-level objectives. Nexus AI coordinates specialized agents to execute deep research, ground claims in enterprise documents, and synthesize verified intelligence reports in a glassmorphic workspace.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
          <Button
            size="md"
            variant="primary"
            onClick={() => navigate('/register')}
            iconRight={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto px-7 py-2.5 font-semibold"
          >
            Launch Nexus Workspace
          </Button>
          <Button
            size="md"
            variant="secondary"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-7 py-2.5 font-semibold"
          >
            Sign In to Dashboard
          </Button>
        </div>

        {/* Live Interface Preview Mockup */}
        <div className="relative mx-auto max-w-4xl rounded-2xl border border-sky-200/80 dark:border-sky-400/25 bg-white/75 dark:bg-[#0c182b]/75 backdrop-blur-xl p-3 shadow-2xl shadow-sky-500/10 transition-colors">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-sky-100 dark:border-sky-400/20 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <span className="ml-2 font-mono text-[11px] text-sky-700 dark:text-sky-300 font-medium">nexus-os // live-execution-pipeline-9042b</span>
          </div>

          <div className="p-4 text-left grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="col-span-1 bg-sky-50/70 dark:bg-[#071324]/80 rounded-xl p-3.5 border border-sky-200/60 dark:border-sky-400/20">
              <div className="text-[10px] uppercase text-sky-800 dark:text-sky-300 font-bold mb-2.5 tracking-wider">Subtasks Pipeline</div>
              <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-200 font-mono">
                <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>1. Planner: DAG created</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>2. Research: 4 sources cited</span>
                </li>
                <li className="flex items-center gap-2 text-sky-600 dark:text-sky-300 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping shrink-0" />
                  <span>3. Analysis: Computing velocity</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                  <span>4. Reviewer: Verification gate</span>
                </li>
              </ul>
            </div>

            <div className="col-span-2 bg-sky-50/70 dark:bg-[#071324]/80 rounded-xl p-3.5 border border-sky-200/60 dark:border-sky-400/20">
              <div className="text-[10px] uppercase text-sky-800 dark:text-sky-300 font-bold mb-2 tracking-wider">Telemetry Stream (SSE)</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono mb-2">
                &gt; objective: &quot;Research enterprise SaaS providers, compare compliance moats, and compute growth velocity.&quot;
              </p>
              <div className="p-3 rounded-lg bg-white/90 dark:bg-[#0c182b]/90 border border-sky-200 dark:border-sky-400/25 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 leading-relaxed shadow-sm">
                [AnalysisAgent] Synthesizing verified citations. Deterministic metric calculation: Mean velocity = 81.25. Verification check score = 94%.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-sky-100 dark:border-sky-400/20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            Engineered for Deterministic Execution
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-lg mx-auto text-xs md:text-sm leading-relaxed">
            Not a generic conversational chatbot. An enterprise agent operating system built on bounded state machines, deterministic tools, and explicit verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card>
            <div className="w-9 h-9 rounded-xl bg-sky-100/80 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 border border-sky-200 dark:border-sky-400/30">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Multi-Agent Orchestration</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Planner, Research, Document, Analysis, Reviewer, and Report agents collaborate through strictly typed handoffs.
            </p>
          </Card>

          <Card>
            <div className="w-9 h-9 rounded-xl bg-sky-100/80 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 border border-sky-200 dark:border-sky-400/30">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Visual Workflow Builder</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Interactive React Flow DAG canvas with cycle detection, topological validation, and real-time execution feedback.
            </p>
          </Card>

          <Card>
            <div className="w-9 h-9 rounded-xl bg-sky-100/80 dark:bg-sky-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 border border-sky-200 dark:border-sky-400/30">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Document Grounding</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Upload PDF, DOCX, XLSX, and CSV files. Passages are chunked and retrieved with strict user ownership isolation.
            </p>
          </Card>

          <Card>
            <div className="w-9 h-9 rounded-xl bg-sky-100/80 dark:bg-sky-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 border border-sky-200 dark:border-sky-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Human Approval Gates</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Suspend execution before consequential actions. Inspect proposed parameters and authorize or reject before continuing.
            </p>
          </Card>

          <Card>
            <div className="w-9 h-9 rounded-xl bg-sky-100/80 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 border border-sky-200 dark:border-sky-400/30">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Empirical Research Tools</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Web search integrations associate factual claims with retrieval timestamps and verified source links—never invented URLs.
            </p>
          </Card>

          <Card>
            <div className="w-9 h-9 rounded-xl bg-sky-100/80 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 border border-sky-200 dark:border-sky-400/30">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Verified Artifact Reports</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Generates executive Markdown reports with structured methodology, findings, evidence citations, and instant downloads.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sky-100/80 dark:border-sky-400/20 py-8 px-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-[#071120]/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white">
              <Layers className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Nexus AI Operating Platform</span>
          </div>
          <p>© 2026 Nexus AI. Enterprise Autonomous Orchestrator.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
