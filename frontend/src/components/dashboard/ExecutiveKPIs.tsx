'use client';

import React from 'react';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Percent,
  Users,
  RotateCcw,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { KPIOverview } from '@/types/sales';

interface ExecutiveKPIsProps {
  kpis: KPIOverview;
  selectedBrand: string;
}

export const ExecutiveKPIs: React.FC<ExecutiveKPIsProps> = ({ kpis, selectedBrand }) => {
  const cards = [
    {
      title: 'Gross Revenue',
      value: `$${(kpis.totalGrossRevenue / 1000000).toFixed(2)}M`,
      rawValue: `$${kpis.totalGrossRevenue.toLocaleString()}`,
      delta: `+${kpis.yoyGrowthPct}% YoY`,
      isPositive: true,
      icon: DollarSign,
      color: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
      subtitle: `${selectedBrand === 'All' ? '5 Brand Portfolio' : selectedBrand} Total`
    },
    {
      title: 'Net Profit & Margin',
      value: `$${(kpis.totalGrossProfit / 1000000).toFixed(2)}M`,
      rawValue: `$${kpis.totalGrossProfit.toLocaleString()}`,
      delta: `${kpis.overallMarginPct}% Margin`,
      isPositive: kpis.overallMarginPct > 50,
      icon: Percent,
      color: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      subtitle: 'Post-Cost Gross Profitability'
    },
    {
      title: 'Units Sold & Velocity',
      value: `${(kpis.totalUnitsSold / 1000).toFixed(1)}k Units`,
      rawValue: `${kpis.totalUnitsSold.toLocaleString()} units`,
      delta: `$${kpis.avgOrderValue.toFixed(2)} AOV`,
      isPositive: true,
      icon: ShoppingBag,
      color: 'from-purple-500/20 to-indigo-500/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      subtitle: 'Average Order Basket Size'
    },
    {
      title: 'Customer LTV / CAC',
      value: `${(kpis.ltv / kpis.cac).toFixed(1)}x Ratio`,
      rawValue: `LTV: $${kpis.ltv} | CAC: $${kpis.cac}`,
      delta: `LTV: $${kpis.ltv}`,
      isPositive: true,
      icon: Users,
      color: 'from-amber-500/20 to-orange-500/20',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      subtitle: `Acquisition Cost: $${kpis.cac}`
    },
    {
      title: 'Return Rate & Quality',
      value: `${kpis.returnRatePct}%`,
      rawValue: 'Low defect & return rate',
      delta: 'Target < 4.0%',
      isPositive: kpis.returnRatePct < 3.5,
      icon: RotateCcw,
      color: 'from-rose-500/20 to-pink-500/20',
      borderColor: 'border-rose-500/30',
      textColor: 'text-rose-400',
      subtitle: 'Customer Satisfaction: 4.8 / 5'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl border ${card.borderColor} bg-slate-900/70 p-4 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/90`}
          >
            {/* Ambient Background Gradient */}
            <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${card.color} blur-2xl pointer-events-none`} />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </p>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    {card.value}
                  </h3>
                </div>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 ${card.textColor} border border-slate-700/50 shadow-inner`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-2.5">
              <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                {card.subtitle}
              </span>
              <span className={`flex items-center text-xs font-semibold ${card.isPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                {card.delta}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
