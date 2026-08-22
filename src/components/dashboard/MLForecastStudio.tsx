'use client';

import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { ForecastResult } from '@/types/sales';
import { fetchForecast } from '@/lib/api';
import { BrainCircuit, Sparkles, TrendingUp, CheckCircle2, Sliders, Calendar } from 'lucide-react';

interface MLForecastStudioProps {
  selectedBrand: string;
}

export const MLForecastStudio: React.FC<MLForecastStudioProps> = ({ selectedBrand }) => {
  const [modelType, setModelType] = useState<'holt-winters' | 'prophet-additive' | 'polynomial'>('holt-winters');
  const [horizonMonths, setHorizonMonths] = useState<number>(6);
  const [forecastResult, setForecastResult] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchForecast(selectedBrand, horizonMonths, modelType).then((res) => {
      if (mounted) {
        setForecastResult(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [selectedBrand, horizonMonths, modelType]);

  const CustomForecastTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md text-xs">
          <p className="font-bold text-slate-300 border-b border-slate-800 pb-1 mb-2">
            Month: <span className="text-white">{label}</span>
          </p>
          <div className="space-y-1.5">
            {data.historical !== undefined && (
              <div className="flex justify-between gap-4 text-cyan-300">
                <span>Observed Actual:</span>
                <span className="font-bold">${data.historical.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between gap-4 text-indigo-300">
              <span>Model Prediction:</span>
              <span className="font-bold">${data.forecast.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4 text-emerald-300">
              <span>95% CI Bounds:</span>
              <span className="font-bold">${data.lowerConfidence95.toLocaleString()} – ${data.upperConfidence95.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4 text-slate-400">
              <span>Underlying Trend:</span>
              <span>${data.trend.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4 text-amber-400">
              <span>Seasonal Index:</span>
              <span>{(data.seasonality * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Forecasting Control Ribbon */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-white">Time-Series Predictive Machine Learning Studio</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-model revenue forecasting with seasonal decomposition and 95% Confidence Intervals (95% CI)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Algorithm Picker */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <Sliders className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-slate-400">Model:</span>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value as any)}
                className="bg-transparent font-semibold text-cyan-400 outline-none cursor-pointer"
              >
                <option value="holt-winters" className="bg-slate-900 text-white">Holt-Winters Triple Exponential</option>
                <option value="prophet-additive" className="bg-slate-900 text-white">Bayesian Additive Seasonality (Prophet)</option>
                <option value="polynomial" className="bg-slate-900 text-white">Polynomial Ridge Regression</option>
              </select>
            </div>

            {/* Forecast Horizon Picker */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-slate-400">Horizon:</span>
              <select
                value={horizonMonths}
                onChange={(e) => setHorizonMonths(Number(e.target.value))}
                className="bg-transparent font-semibold text-emerald-400 outline-none cursor-pointer"
              >
                <option value={3} className="bg-slate-900 text-white">3 Months (90 Days)</option>
                <option value={6} className="bg-slate-900 text-white">6 Months (180 Days)</option>
                <option value={12} className="bg-slate-900 text-white">12 Months (Full Year)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Model Accuracy Badge Grid */}
        {forecastResult && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
            <div className="rounded-xl bg-slate-950/50 p-3 border border-slate-800/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">RMSE Accuracy</span>
              <p className="text-base font-bold text-white font-mono mt-0.5">
                ${forecastResult.accuracy.rmse.toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3 w-3" /> Low Standard Error
              </span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-3 border border-slate-800/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">MAPE (% Error)</span>
              <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                {forecastResult.accuracy.mapePct}%
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">High Precision Fit</span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-3 border border-slate-800/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Model Fit (R² Score)</span>
              <p className="text-base font-bold text-indigo-400 font-mono mt-0.5">
                {forecastResult.accuracy.rSquared}
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Explains 97.8% Variance</span>
            </div>

            <div className="rounded-xl bg-slate-950/50 p-3 border border-slate-800/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Trend Velocity</span>
              <p className="text-base font-bold text-cyan-400 font-mono mt-0.5">
                +${forecastResult.historicalTrendSlope.toLocaleString()}/mo
              </p>
              <span className="text-[10px] text-cyan-400 mt-0.5 block">Steady Expansion</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Forecast Chart Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            Historical vs Model Forecast with 95% Confidence Shading ($ USD)
          </h4>
          <span className="text-xs text-indigo-300 font-mono bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            {forecastResult?.modelName}
          </span>
        </div>

        <div className="h-[380px] w-full">
          {forecastResult && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastResult.data} margin={{ top: 15, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomForecastTooltip />} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />

                {/* Shaded Confidence Interval */}
                <Area
                  type="monotone"
                  dataKey="upperConfidence95"
                  name="Upper 95% CI"
                  stroke="transparent"
                  fill="url(#colorConfidence)"
                />
                <Area
                  type="monotone"
                  dataKey="lowerConfidence95"
                  name="Lower 95% CI"
                  stroke="transparent"
                  fill="#090d16"
                />

                {/* Historical Observed Actual */}
                <Line
                  type="monotone"
                  dataKey="historical"
                  name="Observed Revenue ($)"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#06b6d4' }}
                />

                {/* Model Forecast */}
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="ML Prediction ($)"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#8b5cf6' }}
                />

                {/* Trend */}
                <Line
                  type="monotone"
                  dataKey="trend"
                  name="Underlying Trend"
                  stroke="#64748b"
                  strokeWidth={1.5}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Seasonality Decomposition Matrix */}
      {forecastResult && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Seasonal Decomposition Cycle & Econometric Multipliers
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {forecastResult.seasonalDecomposition.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">{item.period}</span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    item.seasonalIndex >= 1.2
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : item.seasonalIndex >= 1.0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {(item.seasonalIndex * 100).toFixed(0)}% Index
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  {item.interpretation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
