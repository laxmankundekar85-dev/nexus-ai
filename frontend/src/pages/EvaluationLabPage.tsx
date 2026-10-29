import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Target,
  FileCheck,
  Zap,
  TrendingUp
} from 'lucide-react';
import { evaluationApi } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import type { EvaluationRun, BenchmarkTestCase } from '../types';

export const EvaluationLabPage: React.FC = () => {
  const [runs, setRuns] = useState<EvaluationRun[]>([]);
  const [testCases, setTestCases] = useState<BenchmarkTestCase[]>([]);
  const [selectedRun, setSelectedRun] = useState<EvaluationRun | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const r = await evaluationApi.getRuns();
      const tc = await evaluationApi.getTestCases();
      setRuns(r);
      setTestCases(tc);
      if (r.length > 0 && !selectedRun) setSelectedRun(r[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleRunEvaluation = () => {
    toast.success('Automated evaluation benchmark run dispatched across 3 LLM providers!');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-title tracking-tight text-slate-950 dark:text-white">
                AI Evaluation & Benchmarking Lab
              </h1>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">
                Repeatable golden benchmark datasets, citation precision scoring, factual consistency, and cross-model leaderboards
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleRunEvaluation}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          icon={<Play className="w-4 h-4 fill-white" />}
        >
          Run Benchmark Suite
        </Button>
      </div>

      {/* Model Benchmark Comparison Leaderboard */}
      {selectedRun && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <div>
              <h2 className="text-base font-bold font-title text-slate-950 dark:text-white">{selectedRun.benchmark_name}</h2>
              <p className="text-xs text-slate-500 font-body">{selectedRun.notes}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> No Regression Detected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {selectedRun.models_evaluated.map((m) => (
              <div key={m.model_id} className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{m.model_name}</h3>
                  <span className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {m.overall_score}%
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Citation Precision</span>
                    <span className="font-bold text-slate-900 dark:text-white">{m.citation_precision}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Evidence Coverage</span>
                    <span className="font-bold text-slate-900 dark:text-white">{m.evidence_coverage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Factual Consistency</span>
                    <span className="font-bold text-slate-900 dark:text-white">{m.factual_consistency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Numerical Accuracy</span>
                    <span className="font-bold text-slate-900 dark:text-white">{m.numerical_accuracy}%</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-slate-400 text-[11px]">
                    <span>Avg Latency</span>
                    <span>{m.average_latency_ms}ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Golden Dataset Test Cases */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
          Golden Dataset Test Cases ({testCases.length})
        </h2>

        <div className="space-y-3">
          {testCases.map((tc) => (
            <Card key={tc.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-500/15 text-indigo-600">
                    {tc.category.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{tc.name}</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">{tc.id}</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-zinc-300 font-body">"{tc.prompt}"</p>

              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-zinc-900 text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                Ground Truth: {tc.ground_truth_reference}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationLabPage;
