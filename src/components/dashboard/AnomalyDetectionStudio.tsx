'use client';

import React, { useState, useEffect } from 'react';
import { AnomalyItem } from '@/types/sales';
import { fetchAnomalies } from '@/lib/api';
import { AlertTriangle, TrendingUp, TrendingDown, Info, CheckCircle } from 'lucide-react';

export const AnomalyDetectionStudio: React.FC = () => {
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);

  useEffect(() => {
    fetchAnomalies().then(setAnomalies);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Statistical Anomaly & Outlier Detection Engine</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Z-score and rolling IQR outlier monitoring identifying sudden sales spikes, viral events, or supply chain shocks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {anomalies.map((anom) => {
          const isSpike = anom.zScore > 0;
          return (
            <div
              key={anom.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-md ${
                      isSpike ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {isSpike ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    </span>
                    <span className="text-xs font-bold text-white">{anom.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      Z: {anom.zScore > 0 ? `+${anom.zScore}` : anom.zScore}σ
                    </span>
                    <span className="text-[10px] text-slate-500">{anom.date}</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white">{anom.product}</h4>
                <p className="text-xs text-slate-400 font-medium">{anom.brand}</p>

                <div className="grid grid-cols-2 gap-2 my-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Observed</span>
                    <p className="font-mono font-bold text-white">
                      {anom.metric.includes('Revenue') ? `$${anom.observedValue.toLocaleString()}` : anom.observedValue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Expected (Mean)</span>
                    <p className="font-mono font-bold text-slate-400">
                      {anom.metric.includes('Revenue') ? `$${anom.expectedValue.toLocaleString()}` : anom.expectedValue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                <span className="font-semibold text-amber-400">Root Cause: </span>
                {anom.rootCause}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
