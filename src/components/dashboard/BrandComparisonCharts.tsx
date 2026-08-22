'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Brand, TimeSeriesPoint } from '@/types/sales';
import { BarChart3, PieChart as PieIcon, Activity, Sparkles, Layers } from 'lucide-react';

interface BrandComparisonChartsProps {
  brands: Brand[];
  timeSeries: TimeSeriesPoint[];
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
}

export const BrandComparisonCharts: React.FC<BrandComparisonChartsProps> = ({
  brands,
  timeSeries,
  selectedBrand,
  onSelectBrand
}) => {
  const [chartMode, setChartMode] = useState<'stacked' | 'stream'>('stacked');

  const brandColors: Record<string, string> = {
    AuraTech: '#06b6d4',
    NovaStyle: '#8b5cf6',
    ApexLiving: '#10b981',
    VitalisHealth: '#f59e0b',
    PulseAudio: '#ec4899'
  };

  // Pie Data for Market Share
  const pieData = brands.map((b) => ({
    name: b.name,
    value: b.netRevenue,
    marketShare: b.marketShare,
    color: b.color || brandColors[b.name] || '#3b82f6'
  }));

  // Bar Data for Profitability Matrix
  const marginData = brands.map((b) => ({
    brand: b.name,
    netRevenue: Math.round(b.netRevenue / 1000),
    grossProfit: Math.round(b.grossProfit / 1000),
    marginPct: b.profitMargin,
    color: b.color
  }));

  // Radar Data for Brand Health Scorecards
  const radarData = [
    { metric: 'Revenue Growth', AuraTech: 88, NovaStyle: 94, ApexLiving: 76, VitalisHealth: 98, PulseAudio: 72 },
    { metric: 'Profit Margin', AuraTech: 75, NovaStyle: 92, ApexLiving: 76, VitalisHealth: 99, PulseAudio: 68 },
    { metric: 'LTV / CAC Efficiency', AuraTech: 92, NovaStyle: 86, ApexLiving: 85, VitalisHealth: 96, PulseAudio: 74 },
    { metric: 'Market Share', AuraTech: 98, NovaStyle: 78, ApexLiving: 80, VitalisHealth: 65, PulseAudio: 58 },
    { metric: 'CSAT Rating', AuraTech: 94, NovaStyle: 91, ApexLiving: 96, VitalisHealth: 98, PulseAudio: 95 }
  ];

  // Custom Chart Tooltips
  const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((acc: number, p: any) => acc + (p.value || 0), 0);
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md">
          <p className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-1.5 mb-2">
            Month: {label}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4 text-xs">
                <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-bold text-white">${entry.value?.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-800 flex justify-between text-xs font-bold text-cyan-400">
            <span>Portfolio Total:</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Multi-Brand 36-Month Time Series Trajectory */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Multi-Brand Revenue Trajectory (2023 - 2025)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical monthly net revenue breakdown across all 5 company portfolio brands
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter View:</span>
            <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                onClick={() => setChartMode('stacked')}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  chartMode === 'stacked' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Stacked Area
              </button>
              <button
                onClick={() => setChartMode('stream')}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  chartMode === 'stream' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                100% Normalized
              </button>
            </div>
          </div>
        </div>

        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAuraTech" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorNovaStyle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorApexLiving" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorVitalisHealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorPulseAudio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomAreaTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="auratechRevenue"
                name="AuraTech"
                stackId="1"
                stroke="#06b6d4"
                fill="url(#colorAuraTech)"
              />
              <Area
                type="monotone"
                dataKey="novastyleRevenue"
                name="NovaStyle"
                stackId="1"
                stroke="#8b5cf6"
                fill="url(#colorNovaStyle)"
              />
              <Area
                type="monotone"
                dataKey="apexlivingRevenue"
                name="ApexLiving"
                stackId="1"
                stroke="#10b981"
                fill="url(#colorApexLiving)"
              />
              <Area
                type="monotone"
                dataKey="vitalishealthRevenue"
                name="VitalisHealth"
                stackId="1"
                stroke="#f59e0b"
                fill="url(#colorVitalisHealth)"
              />
              <Area
                type="monotone"
                dataKey="pulseaudioRevenue"
                name="PulseAudio"
                stackId="1"
                stroke="#ec4899"
                fill="url(#colorPulseAudio)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Side-by-Side: Market Share Donut & Brand Profit Margin Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Market Share Donut Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">Brand Market Share</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Share of $24.32M enterprise portfolio</p>
          </div>

          <div className="h-[260px] w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#0f172a"
                      strokeWidth={2}
                      className="cursor-pointer transition-transform hover:scale-105"
                      onClick={() => onSelectBrand(entry.name)}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `$${Number(val).toLocaleString()} (${brands.find(b => b.name === name)?.marketShare}%)`,
                    name
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
            {pieData.map((item) => (
              <div
                key={item.name}
                onClick={() => onSelectBrand(item.name)}
                className="flex items-center justify-between rounded-lg p-1.5 text-xs hover:bg-slate-800/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.marketShare}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Profit Margin & Revenue Efficiency Bar Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Revenue vs Gross Profit ($k)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Margin efficiency by brand</p>
          </div>

          <div className="h-[280px] w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marginData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="brand" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}k`} />
                <Tooltip
                  formatter={(val: any, name: any) => [`$${Number(val).toLocaleString()}k`, name === 'netRevenue' ? 'Net Revenue' : 'Gross Profit']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="netRevenue" name="Net Revenue ($k)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="grossProfit" name="Gross Profit ($k)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Dimensional Brand Health Radar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Brand Health Scorecard</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Radar comparison across 5 performance pillars</p>
          </div>

          <div className="h-[280px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="AuraTech" dataKey="AuraTech" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} />
                <Radar name="VitalisHealth" dataKey="VitalisHealth" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                <Radar name="NovaStyle" dataKey="NovaStyle" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
