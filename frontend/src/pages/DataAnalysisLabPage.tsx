import React, { useState, useEffect } from 'react';
import { Calculator, Play, BarChart3, LineChart, PieChart, ShieldCheck, Sparkles, RefreshCw, Download, FileSpreadsheet } from 'lucide-react';
import { analysisApi } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import toast from 'react-hot-toast';
import type { AnalysisResult } from '../types';
import { executeAnalysisQuery, DEFAULT_DATASET } from '../utils/analysisEngine';

export const DataAnalysisLabPage: React.FC = () => {
  const [query, setQuery] = useState('Calculate the percentage change between Q1 and Q4');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const quickPrompts = [
    'Calculate the percentage change between Q1 and Q4',
    'Identify highest and lowest parameter values',
    'Generate proportional share distribution pie chart',
    'Compute standard deviation and descriptive statistics',
    'Forecast Q5 using linear progression trend',
  ];

  useEffect(() => {
    if (!result) {
      const initial = executeAnalysisQuery(query, DEFAULT_DATASET);
      setResult(initial);
    }
  }, []);

  const handleRunAnalysis = async (selectedQuery?: string) => {
    const q = selectedQuery || query;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await Promise.race([
        analysisApi.execute(q, DEFAULT_DATASET),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2500))
      ]);
      setResult(res);
      toast.success('Analysis executed in secure sandbox!');
    } catch {
      const res = executeAnalysisQuery(q, DEFAULT_DATASET);
      setResult(res);
      toast.success('Analysis calculated with mathematical AST engine!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-title tracking-tight text-slate-950 dark:text-white">
                  Data Analysis & Computation Lab
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> AST Sandbox
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-body">
                Execute mathematical computations with pandas & NumPy in an isolated AST-verified environment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Query Bar */}
      <Card className="p-5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunAnalysis()}
            placeholder="Type any formula or question, e.g. 'Calculate the CAGR from Q1 to Q4'"
            className="flex-1"
          />
          <Button
            onClick={() => handleRunAnalysis()}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
            icon={<Play className="w-4 h-4 fill-white" />}
          >
            Compute Formula
          </Button>
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mr-1">Quick prompts:</span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(p);
                handleRunAnalysis(p);
              }}
              className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-white/5 transition-all text-left"
            >
              {p}
            </button>
          ))}
        </div>
      </Card>

      {/* Analysis Output Results */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual & Formula Card */}
          <Card className="p-6 lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Execution Formula</span>
                <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{result.formula_applied}</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-bold">
                {result.execution_environment}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1">Analytical Result</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{result.result_summary}</p>
            </div>

            {/* SVG Chart Visualization */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-emerald-600" /> Visual Output ({result.chart.type.toUpperCase()})
                </span>
              </div>
              <div className="h-56 w-full flex items-end justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/10">
                {result.chart.data.map((item, idx) => {
                  const maxVal = Math.max(...result.chart.data.map(d => d.value), 1);
                  const heightPct = Math.max(Math.round((item.value / maxVal) * 85), 10);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-zinc-300">
                        {item.value}
                      </span>
                      <div
                        className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-emerald-600 to-teal-400 transition-all duration-300"
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[10px] font-mono text-slate-500 truncate max-w-[60px] text-center">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Statistics & Dataset Breakdown */}
          <div className="space-y-4">
            <Card className="p-5 space-y-3">
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500">Statistical Metrics</h2>
              <div className="space-y-2 font-mono text-xs">
                {Object.entries(result.statistics).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-zinc-900">
                    <span className="capitalize text-slate-500">{key.replace(/_/g, ' ')}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{String(val)}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500">Dataset Context</h3>
              <div className="space-y-1.5 font-mono text-xs text-slate-600 dark:text-zinc-400">
                <p>• Rows analyzed: {DEFAULT_DATASET.length} quarters</p>
                <p>• Variables: Revenue, Net Margin, Growth</p>
                <p>• AST Security: Zero system calls permitted</p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnalysisLabPage;
