'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CustomerSegment } from '@/types/sales';
import { fetchCustomerSegments } from '@/lib/api';
import { Users, Database, Sparkles, TrendingUp, ShieldAlert, HeartHandshake } from 'lucide-react';

export const CustomerRFMStudio: React.FC = () => {
  const [segments, setSegments] = useState<CustomerSegment[]>([]);

  useEffect(() => {
    fetchCustomerSegments().then(setSegments);
  }, []);

  const cohortHeatmap = [
    { cohort: '2024-Q1', m0: 100, m1: 78, m2: 64, m3: 58, m4: 52, m5: 48, m6: 45 },
    { cohort: '2024-Q2', m0: 100, m1: 82, m2: 69, m3: 61, m4: 55, m5: 51, m6: 47 },
    { cohort: '2024-Q3', m0: 100, m1: 85, m2: 72, m3: 65, m4: 59, m5: 54, m6: 50 },
    { cohort: '2024-Q4', m0: 100, m1: 89, m2: 76, m3: 68, m4: 62, m5: 58, m6: 53 },
    { cohort: '2025-Q1', m0: 100, m1: 91, m2: 79, m3: 71, m4: 65, m5: 61, m6: 56 }
  ];

  return (
    <div className="space-y-6">
      
      {/* RFM Overview Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Customer RFM Segmentation & Cohort Retention Analytics</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              K-Means algorithmic clustering based on Recency, Frequency, and Monetary transaction vectors
            </p>
          </div>
        </div>
      </div>

      {/* Segment Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {segments.map((seg) => (
          <div
            key={seg.name}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-xl shadow-lg relative overflow-hidden"
          >
            <div
              className="absolute -right-6 -top-6 h-16 w-16 rounded-full blur-xl opacity-20"
              style={{ backgroundColor: seg.color }}
            />
            <div className="flex items-center justify-between">
              <span
                className="inline-flex px-2 py-0.5 rounded-md text-xs font-bold"
                style={{ backgroundColor: `${seg.color}20`, color: seg.color }}
              >
                {seg.name}
              </span>
              <span className="text-xs text-slate-400 font-mono">{seg.percentage}%</span>
            </div>

            <h4 className="text-xl font-bold text-white mt-2 font-mono">
              ${(seg.revenueContribution / 1000000).toFixed(2)}M
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{seg.revenueSharePct}% Portfolio Share</p>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Avg Monetary:</span>
                <span className="font-semibold text-white font-mono">${seg.avgMonetary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Avg Frequency:</span>
                <span className="font-semibold text-purple-300 font-mono">{seg.avgFrequency}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recency Window:</span>
                <span className="font-semibold text-cyan-300 font-mono">{seg.avgRecencyDays} days</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Side-by-Side: Segment Contribution & Cohort Retention Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Contribution by Segment (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-4">
            <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
            Revenue Contribution by RFM Cohort
          </h4>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segments} layout="vertical" margin={{ top: 10, right: 20, left: 70, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue Contribution']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }}
                />
                <Bar dataKey="revenueContribution" radius={[0, 6, 6, 0]}>
                  {segments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cohort Retention Heatmap Matrix (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-4">
            <HeartHandshake className="h-3.5 w-3.5 text-emerald-400" />
            Multi-Brand Customer Retention Cohort Matrix (%)
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="py-2.5 px-3 text-left font-bold text-slate-300">Cohort</th>
                  <th className="py-2.5 px-2">Month 0</th>
                  <th className="py-2.5 px-2">Month 1</th>
                  <th className="py-2.5 px-2">Month 2</th>
                  <th className="py-2.5 px-2">Month 3</th>
                  <th className="py-2.5 px-2">Month 4</th>
                  <th className="py-2.5 px-2">Month 5</th>
                  <th className="py-2.5 px-2">Month 6</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {cohortHeatmap.map((row) => (
                  <tr key={row.cohort}>
                    <td className="py-2.5 px-3 text-left font-bold text-slate-300 font-sans">{row.cohort}</td>
                    <td className="py-2 px-2 bg-emerald-500/25 text-emerald-300 font-bold">{row.m0}%</td>
                    <td className="py-2 px-2 bg-emerald-500/20 text-emerald-300">{row.m1}%</td>
                    <td className="py-2 px-2 bg-emerald-500/15 text-emerald-400">{row.m2}%</td>
                    <td className="py-2 px-2 bg-cyan-500/15 text-cyan-300">{row.m3}%</td>
                    <td className="py-2 px-2 bg-indigo-500/15 text-indigo-300">{row.m4}%</td>
                    <td className="py-2 px-2 bg-indigo-500/10 text-slate-300">{row.m5}%</td>
                    <td className="py-2 px-2 bg-slate-800/60 text-slate-400">{row.m6}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            * Matrix demonstrates high month-6 repeat purchase retention (56%), outpacing standard e-commerce benchmarks (28%).
          </p>
        </div>

      </div>

    </div>
  );
};
