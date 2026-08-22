'use client';

import { useEffect, useState } from 'react';
import {
  PieChart,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { fetchBudgets, fetchSpendingPredictions } from '@/lib/api';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [bData, fData] = await Promise.all([
      fetchBudgets(),
      fetchSpendingPredictions(),
    ]);
    setBudgets(bData);
    setForecast(fData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  // Bar chart data comparing Budget Limit vs Actual Spent
  const chartData = budgets.map((b) => ({
    category: b.categoryName,
    BudgetLimit: b.monthlyLimit,
    ActualSpent: b.spent,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
            <PieChart className="h-7 w-7 text-emerald-400" />
            Smart Budget Planner
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dynamic category spending limits with real-time alert thresholds and 30-day AI predictive forecasts.
          </p>
        </div>
      </div>

      {/* Recharts Budget vs Actual Comparison */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Category Budget vs Actual Spend</h2>
            <p className="text-xs text-slate-400">Comparing current monthly outlay against defined limits</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-slate-600" /> Budget Limit</div>
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-cyan-400" /> Actual Spent</div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
              />
              <Bar dataKey="BudgetLimit" fill="#334155" radius={[6, 6, 0, 0]} />
              <Bar dataKey="ActualSpent" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Budget Meters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((b) => {
          const isDanger = b.isOverBudget;
          const isWarning = b.isWarning;

          return (
            <div
              key={b.id}
              className={`glass-card p-6 rounded-3xl border transition duration-200 ${
                isDanger
                  ? 'border-rose-500/40 bg-rose-950/10'
                  : isWarning
                  ? 'border-amber-500/40 bg-amber-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">{b.categoryName}</h3>
                  {isDanger && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> OVER BUDGET
                    </span>
                  )}
                  {isWarning && !isDanger && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                      <Zap className="h-3 w-3" /> &gt;80% LIMIT
                    </span>
                  )}
                  {!isDanger && !isWarning && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> ON TRACK
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">Limit</p>
                  <p className="font-extrabold text-white text-sm">${b.monthlyLimit.toLocaleString()}</p>
                </div>
              </div>

              {/* Progress bar meter */}
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isDanger
                      ? 'bg-rose-500'
                      : isWarning
                      ? 'bg-amber-400'
                      : 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                  }`}
                  style={{ width: `${Math.min(b.percentage, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Spent: <strong className="text-slate-100">${b.spent.toFixed(2)}</strong> ({b.percentage}%)</span>
                <span>Remaining: <strong className={isDanger ? 'text-rose-400' : 'text-emerald-400'}>${b.remaining.toFixed(2)}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Spending Predictions & Forecast Insights */}
      {forecast && (
        <div className="glass-card p-6 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-slate-900 via-[#101426] to-slate-900 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            <h2 className="text-lg font-bold text-white">AI Spending Predictions (Next 30 Days)</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {forecast.forecastInsight}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {forecast.predictions?.slice(0, 4).map((p: any) => (
              <div key={p.category} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400 font-medium">{p.category}</p>
                <p className="text-xl font-extrabold text-cyan-400">${p.predictedAmount.toFixed(2)}</p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{p.trend} Momentum</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
