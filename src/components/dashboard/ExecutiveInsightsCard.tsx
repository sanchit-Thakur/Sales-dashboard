'use client';

import React from 'react';
import { ExecutiveInsights } from '@/types/sales';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface ExecutiveInsightsCardProps {
  insights: ExecutiveInsights;
  selectedBrand: string;
}

export const ExecutiveInsightsCard: React.FC<ExecutiveInsightsCardProps> = ({
  insights,
  selectedBrand
}) => {
  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-cyan-950/30 p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Data Scientist Executive Intelligence Co-Pilot
              <span className="text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                AI Synthesized
              </span>
            </h3>
            <p className="text-xs text-slate-400">Contextual analysis for {selectedBrand === 'All' ? 'Enterprise Portfolio' : selectedBrand}</p>
          </div>
        </div>
      </div>

      {/* Executive Summary paragraph */}
      <div className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-800 text-xs text-slate-200 leading-relaxed font-normal">
        {insights.summary}
      </div>

      {/* 3 Insight Pillars: Drivers, Risks, Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        
        {/* Drivers */}
        <div className="rounded-xl bg-slate-950/40 p-3.5 border border-slate-800/80">
          <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2 uppercase tracking-wider">
            <TrendingUp className="h-3.5 w-3.5" />
            Key Growth Drivers
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {insights.keyDrivers.map((driver, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="leading-snug">{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks & Outliers */}
        <div className="rounded-xl bg-slate-950/40 p-3.5 border border-slate-800/80">
          <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2 uppercase tracking-wider">
            <AlertCircle className="h-3.5 w-3.5" />
            Margin Risks & Sensitivity
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {insights.risksAndAnomalies.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="leading-snug">{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Strategies */}
        <div className="rounded-xl bg-slate-950/40 p-3.5 border border-slate-800/80">
          <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 mb-2 uppercase tracking-wider">
            <CheckCircle className="h-3.5 w-3.5" />
            Strategic Recommendations
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {insights.actionableStrategies.map((strat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span className="leading-snug">{strat}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};
