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
  BarChart3,
  FileText,
} from 'lucide-react';
import Button from '../components/Button';
import PWAInstallBanner from '../components/PWAInstallBanner';
import Card from '../components/Card';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Prefetch operational bundle on user intent (hover or touch) so dashboard navigation remains 0ms
  const prefetchApp = () => {
    import('../MainApp');
  };


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

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              onMouseEnter={prefetchApp}
              onTouchStart={prefetchApp}
            >
              Sign in
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/workspace')}
              onMouseEnter={prefetchApp}
              onTouchStart={prefetchApp}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Launch workspace →
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
            Enterprise intelligence platform
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
            From complex objectives to verified intelligence.
          </h1>

          <p className="text-base text-slate-800 dark:text-zinc-300 max-w-3xl mx-auto mb-8 leading-relaxed font-normal">
            Turn complex business objectives into actionable intelligence with coordinated AI agents, evidence-backed research, and document-grounded analysis. Nexus AI brings research, reasoning, verification, and reporting together in one intelligent workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
            <Button
              size="md"
              variant="primary"
              onClick={() => navigate('/workspace')}
              onMouseEnter={prefetchApp}
              onTouchStart={prefetchApp}
              iconRight={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto px-7 py-2.5 font-bold"
            >
              Launch workspace →
            </Button>
            <Button
              size="md"
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              onMouseEnter={prefetchApp}
              onTouchStart={prefetchApp}
              className="w-full sm:w-auto px-7 py-2.5 font-bold"
            >
              Explore the platform
            </Button>
          </div>

          {/* Supporting Trust Statement */}
          <p className="text-xs font-medium text-slate-700 dark:text-zinc-300 mb-14 tracking-wide">
            One coordinated workflow. Multiple specialized agents. Evidence-backed deliverables.
          </p>

          {/* Product Preview Label & Window */}
          <div className="relative mx-auto max-w-4xl rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-100/90 dark:bg-[#0c0c0e]/95 backdrop-blur-xl p-3 shadow-2xl transition-colors text-left">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-300 dark:border-white/10 text-xs text-slate-700 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="ml-2 font-mono text-[10px] uppercase font-bold text-slate-700 dark:text-zinc-300">
                  LIVE MISSION OVERVIEW
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-900 dark:text-white font-medium">
                Enterprise research mission
              </span>
            </div>

            <p className="px-3 pt-3 text-[11px] text-slate-700 dark:text-zinc-300 font-body">
              Watch specialized agents plan, investigate, analyze, and validate findings in a unified execution pipeline.
            </p>

            <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="col-span-1 bg-slate-200/90 dark:bg-zinc-950 rounded-xl p-3.5 border border-slate-300 dark:border-white/10">
                <div className="text-[10px] uppercase text-slate-900 dark:text-zinc-400 font-extrabold mb-2.5 tracking-wider">
                  Agent execution pipeline
                </div>
                <ul className="text-xs space-y-2 text-slate-900 dark:text-white font-mono">
                  <li className="flex items-start gap-2 text-emerald-800 dark:text-emerald-400 text-[11px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>1. Planning — Defining objectives and execution strategy</span>
                  </li>
                  <li className="flex items-start gap-2 text-emerald-800 dark:text-emerald-400 text-[11px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>2. Research — Gathering relevant external evidence</span>
                  </li>
                  <li className="flex items-start gap-2 text-blue-700 dark:text-white text-[11px] font-medium">
                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-white motion-safe:animate-ping will-change-[transform,opacity] shrink-0 mt-1" />
                    <span>3. Document analysis — Extracting source-backed findings</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-700 dark:text-zinc-400 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-700 shrink-0 mt-1.5" />
                    <span>4. Synthesis — Connecting evidence and evaluating results</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-700 dark:text-zinc-400 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-700 shrink-0 mt-1.5" />
                    <span>5. Verification — Checking claims and identifying discrepancies</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-700 dark:text-zinc-400 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-700 shrink-0 mt-1.5" />
                    <span>6. Reporting — Preparing the final intelligence dossier</span>
                  </li>
                </ul>
              </div>

              <div className="col-span-2 bg-slate-200/90 dark:bg-zinc-950 rounded-xl p-3.5 border border-slate-300 dark:border-white/10 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase text-blue-900 dark:text-zinc-300 font-extrabold mb-2 tracking-wider">
                    Telemetry Stream (SSE)
                  </div>
                  <p className="text-[11px] text-slate-800 dark:text-zinc-400 font-mono mb-2 font-medium">
                    &gt; mission_objective: &quot;Evaluate enterprise AI cloud architecture, benchmark inference economics, and synthesize grounded comparison dossier.&quot;
                  </p>
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-black border border-slate-300 dark:border-white/15 text-[11px] font-mono text-emerald-900 dark:text-emerald-300 font-medium leading-relaxed shadow-xs">
                    [DocumentAgent] 2 source documents indexed. 48 passages parsed. Grounded citations linked to verified page references. Zero ungrounded claims detected.
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-300 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-700 dark:text-zinc-300">
                  <span>Status: Autonomous Pipeline Active</span>
                  <span>Telemetry: Real-time SSE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Capabilities Section */}
        <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-300/80 dark:border-white/10 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-title text-slate-950 dark:text-white mb-2 tracking-tight">
              Intelligence workflows, built for complex work.
            </h2>
            <p className="text-slate-700 dark:text-zinc-300 max-w-2xl mx-auto text-xs md:text-sm leading-relaxed font-normal">
              From raw information to decision-ready deliverables, Nexus AI coordinates the process in a single workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 dark:bg-zinc-900 dark:text-white flex items-center justify-center mb-3 border border-blue-200 dark:border-white/15">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold font-heading text-slate-950 dark:text-white mb-1.5">
                Autonomous agent orchestration
              </h3>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                Break complex objectives into coordinated tasks executed by specialized AI agents.
              </p>
            </Card>

            <Card>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 dark:bg-zinc-900 dark:text-white flex items-center justify-center mb-3 border border-blue-200 dark:border-white/15">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold font-heading text-slate-950 dark:text-white mb-1.5">
                Evidence-backed research
              </h3>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                Collect relevant information, preserve source references, and make findings easier to verify.
              </p>
            </Card>

            <Card>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-zinc-900 dark:text-emerald-400 flex items-center justify-center mb-3 border border-emerald-300 dark:border-white/15">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold font-heading text-slate-950 dark:text-white mb-1.5">
                Document intelligence
              </h3>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                Extract meaningful insights from technical documents, reports, spreadsheets, and other supported files.
              </p>
            </Card>

            <Card>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 dark:bg-zinc-900 dark:text-amber-400 flex items-center justify-center mb-3 border border-amber-300 dark:border-white/15">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold font-heading text-slate-950 dark:text-white mb-1.5">
                Analytical reasoning
              </h3>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                Compare evidence, evaluate data, and perform reproducible calculations to support conclusions.
              </p>
            </Card>

            <Card>
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 dark:bg-zinc-900 dark:text-rose-400 flex items-center justify-center mb-3 border border-rose-300 dark:border-white/15">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold font-heading text-slate-950 dark:text-white mb-1.5">
                Quality assurance
              </h3>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                Review findings for missing evidence, inconsistencies, and unsupported statements.
              </p>
            </Card>

            <Card>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 dark:bg-zinc-900 dark:text-white flex items-center justify-center mb-3 border border-blue-200 dark:border-white/15">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold font-heading text-slate-950 dark:text-white mb-1.5">
                Publication-ready reporting
              </h3>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                Transform reviewed findings into structured reports with citations, tables, and export options.
              </p>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-300/80 dark:border-white/10 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-title text-slate-950 dark:text-white mb-2 tracking-tight">
              From objective to outcome.
            </h2>
            <p className="text-slate-700 dark:text-zinc-300 max-w-2xl mx-auto text-xs md:text-sm leading-relaxed font-normal">
              A structured workflow designed to turn complex requests into traceable, reviewable deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 shadow-xs">
              <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 block mb-1">Step 1</span>
              <h3 className="text-xs font-semibold font-heading text-slate-950 dark:text-white mb-1.5">Define the objective</h3>
              <p className="text-[11px] text-slate-700 dark:text-zinc-300 font-body leading-relaxed">
                Describe the question, problem, or business outcome you want to investigate.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 shadow-xs">
              <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 block mb-1">Step 2</span>
              <h3 className="text-xs font-semibold font-heading text-slate-950 dark:text-white mb-1.5">Coordinate the agents</h3>
              <p className="text-[11px] text-slate-700 dark:text-zinc-300 font-body leading-relaxed">
                Nexus AI organizes the work into specialized tasks and assigns the appropriate capabilities.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 shadow-xs">
              <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 block mb-1">Step 3</span>
              <h3 className="text-xs font-semibold font-heading text-slate-950 dark:text-white mb-1.5">Gather the evidence</h3>
              <p className="text-[11px] text-slate-700 dark:text-zinc-300 font-body leading-relaxed">
                Retrieve relevant documents, research sources, and supporting data.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 shadow-xs">
              <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 block mb-1">Step 4</span>
              <h3 className="text-xs font-semibold font-heading text-slate-950 dark:text-white mb-1.5">Analyze and validate</h3>
              <p className="text-[11px] text-slate-700 dark:text-zinc-300 font-body leading-relaxed">
                Synthesize the findings, check calculations, and flag claims that require additional evidence.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 shadow-xs">
              <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 block mb-1">Step 5</span>
              <h3 className="text-xs font-semibold font-heading text-slate-950 dark:text-white mb-1.5">Deliver the report</h3>
              <p className="text-[11px] text-slate-700 dark:text-zinc-300 font-body leading-relaxed">
                Review the final findings and export the resulting intelligence dossier.
              </p>
            </div>
          </div>
        </section>

        {/* Final Landing Page CTA */}
        <section className="py-20 px-6 max-w-4xl mx-auto text-center border-t border-slate-300/80 dark:border-white/10 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold font-title text-slate-950 dark:text-white mb-4 tracking-tight">
            Make complex research easier to execute.
          </h2>
          <p className="text-sm text-slate-700 dark:text-zinc-300 max-w-xl mx-auto mb-8 leading-relaxed font-normal">
            Bring your documents, research objectives, and analytical workflows into one coordinated intelligence platform.
          </p>
          <Button
            size="md"
            variant="primary"
            onClick={() => navigate('/workspace')}
            onMouseEnter={prefetchApp}
            onTouchStart={prefetchApp}
            iconRight={<ArrowRight className="w-4 h-4" />}
            className="px-8 py-3 text-sm font-bold shadow-lg shadow-blue-600/30"
          >
            Launch Nexus AI →
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-300/80 dark:border-white/10 py-10 px-6 text-xs text-slate-700 dark:text-zinc-400 bg-slate-200/50 dark:bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
                <Layers className="w-3 h-3 text-white" />
              </div>
              <span className="font-extrabold text-slate-950 dark:text-white">Nexus AI</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-zinc-300 max-w-md font-normal leading-relaxed">
              Nexus AI is an enterprise intelligence platform for coordinated AI research, document analysis, evidence verification, and structured reporting.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 dark:hover:text-white transition-colors">Platform</button>
            <button onClick={() => navigate('/workspace')} className="hover:text-blue-600 dark:hover:text-white transition-colors">Workspace</button>
            <button onClick={() => navigate('/workflows')} className="hover:text-blue-600 dark:hover:text-white transition-colors">Workflows</button>
            <button onClick={() => navigate('/documents')} className="hover:text-blue-600 dark:hover:text-white transition-colors">Documents</button>
            <button onClick={() => navigate('/reports')} className="hover:text-blue-600 dark:hover:text-white transition-colors">Reports</button>
            <button onClick={() => navigate('/settings')} className="hover:text-blue-600 dark:hover:text-white transition-colors">Settings</button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-4 border-t border-slate-300/60 dark:border-white/10 text-center text-[10px] text-slate-700 dark:text-zinc-400">
          © 2026 Nexus AI. All rights reserved. Coordinated enterprise multi-agent workflows.
        </div>
      </footer>

      <PWAInstallBanner />
    </div>
  );
};

export default LandingPage;
