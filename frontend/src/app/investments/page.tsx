'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, ShieldAlert, Sparkles, PieChart as PieIcon, ArrowUpRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchInvestmentSuggestions } from '@/lib/api';

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

export default function InvestmentsPage() {
  const [riskProfile, setRiskProfile] = useState<'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'>('MODERATE');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const result = await fetchInvestmentSuggestions(riskProfile);
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [riskProfile]);

  if (loading || !data) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  const pieData = [
    { name: 'Equities (Stocks)', value: data.allocation.stocksPct },
    { name: 'Bonds (Fixed Income)', value: data.allocation.bondsPct },
    { name: 'High-Yield Cash', value: data.allocation.cashPct },
    { name: 'Crypto & Innovation', value: data.allocation.cryptoPct },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-cyan-400" />
            AI Wealth & Investment Allocations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Personalized portfolio asset distribution generated based on monthly surplus cash (${data.monthlySurplus.toLocaleString()}).
          </p>
        </div>

        {/* Risk Profile Selector */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 self-start md:self-auto">
          {(['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'] as const).map((profile) => (
            <button
              key={profile}
              onClick={() => setRiskProfile(profile)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition uppercase tracking-wider ${
                riskProfile === profile
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {profile}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Distribution Chart & Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recharts Pie Visualization */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <PieIcon className="h-5 w-5 text-emerald-400" />
              Target Allocation Mix
            </h2>
            <p className="text-xs text-slate-400">Risk Profile: {riskProfile}</p>
          </div>

          <div className="h-64 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx] }} />
                <div>
                  <p className="text-[10px] text-slate-400">{item.name}</p>
                  <p className="font-extrabold text-white text-xs">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Recommendations Table */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Recommended Asset Portfolio</h2>
            <p className="text-xs text-slate-400 mt-0.5">{data.reasoning}</p>
          </div>

          <div className="space-y-4">
            {data.recommendedPortfolio.map((item: any, idx: number) => {
              const allocatedDollars = (data.monthlySurplus * (item.percentage / 100)).toFixed(2);

              return (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        {item.percentage}% Allocation
                      </span>
                      <h3 className="font-bold text-white text-sm">{item.assetClass}</h3>
                    </div>
                    <p className="text-xs text-slate-400">Sample Tickers: <strong className="text-slate-200">{item.tickerExamples}</strong></p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Monthly Investment</p>
                    <p className="text-xl font-extrabold text-emerald-400">${allocatedDollars}/mo</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
