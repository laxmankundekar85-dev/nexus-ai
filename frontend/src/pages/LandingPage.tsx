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
    <div className="min-h-screen bg-[#eaeff6] dark:bg-black text-slate-900 dark:text-white font-sans selection:bg-blue-600/20 selection:text-blue-900 dark:selection:text-white relative overflow-hidden transition-colors duration-200">
      {/* Top Navbar */}
      <header className="border-b border-slate-300/80 dark:border-white/10 sticky top-0 z-40 bg-slate-100/90 dark:bg-[#09090b]/95 backdrop-blur-xl shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-950 dark:text-white flex items-center gap-1.5">
              NEXUS <span className="text-blue-700 dark:text-zinc-400 text-xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-zinc-800 border border-blue-300 dark:border-white/15">OS</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme switcher toggle button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle light or dark theme"
              className="p-2 rounded-xl text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-300 dark:border-white/15 transition-all"
              title={theme === 'dark' ? 'Switch to Light Glass' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-blue-700" />}
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

      {/* Main Content Landmark */}
      <main role="main">
        {/* Hero Section */}
        <section className="px-6 pt-16 pb-20 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-300 dark:border-white/15 bg-blue-100/90 dark:bg-zinc-900 text-blue-900 dark:text-white text-xs font-bold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-700 dark:text-white motion-safe:animate-pulse will-change-[opacity]" />
          Autonomous Multi-Agent Operating System
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15] max-w-3xl mx-auto mb-6">
          Enterprise AI Agents that{' '}
          <span className="text-blue-600 dark:text-white underline decoration-blue-500/40">
            Plan, Execute, & Deliver.
          </span>
        </h1>

        <p className="text-base text-slate-800 dark:text-zinc-300 max-w-2xl mx-auto mb-8 leading-relaxed font-semibold">
          Provide high-level objectives. Nexus AI coordinates specialized agents to execute deep research, ground claims in enterprise documents, and synthesize verified intelligence reports.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
          <Button
            size="md"
            variant="primary"
            onClick={() => navigate('/register')}
            iconRight={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto px-7 py-2.5 font-bold"
          >
            Launch Nexus Workspace
          </Button>
          <Button
            size="md"
            variant="secondary"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-7 py-2.5 font-bold"
          >
            Sign In to Dashboard
          </Button>
        </div>

        {/* Live Interface Preview Mockup */}
        <div className="relative mx-auto max-w-4xl rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-100/90 dark:bg-[#0c0c0e]/95 backdrop-blur-xl p-3 shadow-2xl transition-colors">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-300 dark:border-white/10 text-xs text-slate-700 dark:text-zinc-400">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="ml-2 font-mono text-[11px] text-slate-900 dark:text-white font-bold">nexus-os // live-execution-pipeline-9042b</span>
          </div>

          <div className="p-4 text-left grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="col-span-1 bg-slate-200/90 dark:bg-zinc-950 rounded-xl p-3.5 border border-slate-300 dark:border-white/10">
              <div className="text-[10px] uppercase text-slate-900 dark:text-zinc-400 font-extrabold mb-2.5 tracking-wider">Subtasks Pipeline</div>
              <ul className="text-xs space-y-2 text-slate-900 dark:text-white font-mono">
                <li className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>1. Planner: DAG created</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>2. Research: 4 sources cited</span>
                </li>
                <li className="flex items-center gap-2 text-blue-700 dark:text-white text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-white motion-safe:animate-ping will-change-[transform,opacity] shrink-0" />
                  <span>3. Analysis: Computing velocity</span>
                </li>
                <li className="flex items-center gap-2 text-slate-600 dark:text-zinc-500 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-700 shrink-0" />
                  <span>4. Reviewer: Verification gate</span>
                </li>
              </ul>
            </div>

            <div className="col-span-2 bg-slate-200/90 dark:bg-zinc-950 rounded-xl p-3.5 border border-slate-300 dark:border-white/10">
              <div className="text-[10px] uppercase text-blue-900 dark:text-zinc-300 font-extrabold mb-2 tracking-wider">Telemetry Stream (SSE)</div>
              <p className="text-[11px] text-slate-800 dark:text-zinc-400 font-mono mb-2 font-medium">
                &gt; objective: &quot;Research enterprise SaaS providers, compare compliance moats, and compute growth velocity.&quot;
              </p>
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-black border border-slate-300 dark:border-white/15 text-[11px] font-mono text-emerald-900 dark:text-emerald-300 font-medium leading-relaxed shadow-xs">
                [AnalysisAgent] Synthesizing verified citations. Deterministic metric calculation: Mean velocity = 81.25. Verification check score = 94%.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-300/80 dark:border-white/10 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white mb-2 tracking-tight">
            Engineered for Deterministic Execution
          </h2>
          <p className="text-slate-800 dark:text-zinc-300 max-w-lg mx-auto text-xs md:text-sm leading-relaxed font-semibold">
            Not a generic conversational chatbot. An enterprise agent operating system built on bounded state machines, deterministic tools, and explicit verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 dark:bg-zinc-900 dark:text-white flex items-center justify-center mb-3 border border-blue-200 dark:border-white/15">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white mb-1">Multi-Agent Orchestration</h3>
            <p className="text-xs text-slate-800 dark:text-zinc-300 leading-relaxed font-medium">
              Planner, Research, Document, Analysis, Reviewer, and Report agents collaborate through strictly typed handoffs.
            </p>
          </Card>

          <Card>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 dark:bg-zinc-900 dark:text-white flex items-center justify-center mb-3 border border-blue-200 dark:border-white/15">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white mb-1">Visual Workflow Builder</h3>
            <p className="text-xs text-slate-800 dark:text-zinc-300 leading-relaxed font-medium">
              Interactive React Flow DAG canvas with cycle detection, topological validation, and real-time execution feedback.
            </p>
          </Card>

          <Card>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-zinc-900 dark:text-emerald-400 flex items-center justify-center mb-3 border border-emerald-300 dark:border-white/15">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white mb-1">Document Grounding</h3>
            <p className="text-xs text-slate-800 dark:text-zinc-300 leading-relaxed font-medium">
              Upload PDF, DOCX, XLSX, and CSV files. Passages are chunked and retrieved with strict user ownership isolation.
            </p>
          </Card>

          <Card>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 dark:bg-zinc-900 dark:text-amber-400 flex items-center justify-center mb-3 border border-amber-300 dark:border-white/15">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white mb-1">Human Approval Gates</h3>
            <p className="text-xs text-slate-800 dark:text-zinc-300 leading-relaxed font-medium">
              Suspend execution before consequential actions. Inspect proposed parameters and authorize or reject before continuing.
            </p>
          </Card>

          <Card>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 dark:bg-zinc-900 dark:text-white flex items-center justify-center mb-3 border border-blue-200 dark:border-white/15">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white mb-1">Empirical Research Tools</h3>
            <p className="text-xs text-slate-800 dark:text-zinc-300 leading-relaxed font-medium">
              Web search integrations associate factual claims with retrieval timestamps and verified source links—never invented URLs.
            </p>
          </Card>

          <Card>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 dark:bg-zinc-900 dark:text-white flex items-center justify-center mb-3 border border-blue-200 dark:border-white/15">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white mb-1">Verified Artifact Reports</h3>
            <p className="text-xs text-slate-800 dark:text-zinc-300 leading-relaxed font-medium">
              Generates executive Markdown reports with structured methodology, findings, evidence citations, and instant downloads.
            </p>
          </Card>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-300/80 dark:border-white/10 py-8 px-6 text-center text-xs text-slate-700 dark:text-zinc-400 bg-slate-200/50 dark:bg-black">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
              <Layers className="w-3 h-3 text-white" />
            </div>
            <span className="font-extrabold text-slate-950 dark:text-white">Nexus AI Operating Platform</span>
          </div>
          <p>© 2026 Nexus AI. Enterprise Autonomous Orchestrator.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
