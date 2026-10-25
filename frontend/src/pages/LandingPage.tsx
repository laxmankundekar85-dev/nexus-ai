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
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-200 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-200">
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-white flex items-center gap-1.5">
              NEXUS <span className="text-blue-400 text-xs font-mono">OS</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="xs" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={() => navigate('/register')}
              iconRight={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-20 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 text-[11px] font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Autonomous Multi-Agent Operating System
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15] max-w-3xl mx-auto mb-5">
          Enterprise AI Agents that Plan, Execute, & Deliver.
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
          Provide high-level objectives. Nexus AI coordinates specialized agents to execute deep research, ground claims in enterprise documents, and synthesize verified intelligence reports.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <Button
            size="md"
            variant="primary"
            onClick={() => navigate('/register')}
            iconRight={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto px-6"
          >
            Launch Nexus Workspace
          </Button>
          <Button
            size="md"
            variant="secondary"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-6"
          >
            Sign In to Dashboard
          </Button>
        </div>

        {/* Live Interface Preview Mockup */}
        <div className="relative mx-auto max-w-4xl rounded-xl border border-slate-800 bg-[#0b0f19] p-2 shadow-2xl">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800 text-xs text-slate-500">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            </div>
            <span className="ml-2 font-mono text-[11px] text-slate-400">nexus-os // execution-pipeline-9042b</span>
          </div>

          <div className="p-4 text-left grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-1 bg-[#0f172a] rounded-lg p-3.5 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-2 tracking-wider">Subtasks Pipeline</div>
              <ul className="text-xs space-y-2 text-slate-300 font-mono">
                <li className="flex items-center gap-2 text-emerald-400 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>1. Planner: Task DAG created</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-400 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>2. Research: 4 sources cited</span>
                </li>
                <li className="flex items-center gap-2 text-blue-400 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
                  <span>3. Analysis: Computing metrics</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                  <span>4. Reviewer: Verification gate</span>
                </li>
              </ul>
            </div>

            <div className="col-span-2 bg-[#0f172a] rounded-lg p-3.5 border border-slate-800">
              <div className="text-[10px] uppercase text-blue-400 font-bold mb-2 tracking-wider">Telemetry Stream (SSE)</div>
              <p className="text-[11px] text-slate-400 font-mono mb-2">
                &gt; objective: &quot;Research 20 enterprise SaaS providers, compare compliance moats, and compute growth velocity.&quot;
              </p>
              <div className="p-2.5 rounded bg-[#0b0f19] border border-slate-800 text-[11px] font-mono text-emerald-300 leading-relaxed">
                [AnalysisAgent] Synthesizing verified citations. Deterministic metric calculation: Mean velocity = 81.25. Verification check score = 94%.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">
            Engineered for Deterministic Execution
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-xs leading-relaxed">
            Not a generic conversational chatbot. An enterprise agent operating system built on bounded state machines, deterministic tools, and explicit verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-blue-400 flex items-center justify-center mb-3 border border-slate-700/60">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Multi-Agent Orchestration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Planner, Research, Document, Analysis, Reviewer, and Report agents collaborate through strictly typed handoffs.
            </p>
          </Card>

          <Card>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center mb-3 border border-slate-700/60">
              <Workflow className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Visual Workflow Builder</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive React Flow DAG canvas with cycle detection, topological validation, and real-time execution feedback.
            </p>
          </Card>

          <Card>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center mb-3 border border-slate-700/60">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Document Grounding</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload PDF, DOCX, XLSX, and CSV files. Passages are chunked and retrieved with strict user ownership isolation.
            </p>
          </Card>

          <Card>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center mb-3 border border-slate-700/60">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Human Approval Gates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Suspend execution before consequential actions. Inspect proposed parameters and authorize or reject before continuing.
            </p>
          </Card>

          <Card>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-blue-400 flex items-center justify-center mb-3 border border-slate-700/60">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Empirical Research Tools</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Web search integrations associate factual claims with retrieval timestamps and verified source links—never invented URLs.
            </p>
          </Card>

          <Card>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center mb-3 border border-slate-700/60">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Verified Artifact Reports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates executive Markdown reports with structured methodology, findings, evidence citations, and instant downloads.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-300">Nexus AI Operating Platform</span>
          </div>
          <p>© 2026 Nexus AI. Enterprise Autonomous Orchestrator.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
