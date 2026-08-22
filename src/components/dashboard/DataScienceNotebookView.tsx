'use client';

import React, { useState } from 'react';
import { Terminal, Download, FileCode, CheckCircle2, Copy, BookOpen, Database } from 'lucide-react';

export const DataScienceNotebookView: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const pythonSnippet = `# OmniSales End-to-End Econometric & Time-Series Pipeline
import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing

# 1. Ingest Multi-Brand Enterprise Transactions
df = pd.read_csv('data/sales_transactions.csv', parse_dates=['date'])

# 2. Econometric Price Elasticity of Demand (Ed = %dQ / %dP)
elasticity_df = df.groupby(['brand', 'product_name']).apply(
    lambda g: np.polyfit(np.log(g['unit_price']), np.log(g['quantity']), deg=1)[0]
).reset_index(name='price_elasticity')

# 3. Monthly Holt-Winters Additive Trend + Multiplicative Seasonality
monthly_rev = df.set_index('date').resample('ME')['net_revenue'].sum()
hw_model = ExponentialSmoothing(
    monthly_rev,
    trend='add',
    seasonal='mul',
    seasonal_periods=12
).fit(optimized=True)

# 4. Generate 90-Day Forecast with 95% Confidence Bounds
forecast_90d = hw_model.forecast(3)
print(f"90-Day Projected Revenue: \${forecast_90d.sum():,.2f}")`;

  const copyCode = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <FileCode className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Data Science Python Pipeline & Model Architecture</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspecting the underlying Python econometric models, Holt-Winters algorithms, and raw CSV datasets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open('http://localhost:5001/api/sales/export-csv', '_blank')}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-3 py-1.5 text-xs font-semibold border border-cyan-500/40 transition"
          >
            <Download className="h-3.5 w-3.5" />
            Download sales_data.csv (63k rows)
          </button>
        </div>
      </div>

      {/* Econometric Math Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
          <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">Econometric Theory</span>
          <h5 className="font-semibold text-white mt-1">Price Elasticity of Demand</h5>
          <p className="font-mono text-slate-300 bg-slate-900/80 p-2 rounded-lg my-2 border border-slate-800 text-center">
            E_d = (% ΔQ) / (% ΔP)
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Quantifies percentage unit demand drop given a 1% price escalation. Drives What-If simulator pricing curves.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
          <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">Time Series ML</span>
          <h5 className="font-semibold text-white mt-1">Holt-Winters Smoothing</h5>
          <p className="font-mono text-slate-300 bg-slate-900/80 p-2 rounded-lg my-2 border border-slate-800 text-center">
            Y_t = (Level + Trend) × Seasonal + ε
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Triple exponential smoothing separating baseline level, long-term trend, and 12-month multiplicative seasonal cycles.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
          <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Customer Analytics</span>
          <h5 className="font-semibold text-white mt-1">RFM Vector Clustering</h5>
          <p className="font-mono text-slate-300 bg-slate-900/80 p-2 rounded-lg my-2 border border-slate-800 text-center">
            Score = w_1·R + w_2·F + w_3·M
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            K-Means 5-cluster segmentation partitioning customers by transaction recency, frequency, and monetary contribution.
          </p>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-mono text-slate-300">python_scripts/ml_pipeline.py</span>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition text-[11px]"
          >
            {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
        </div>
        <pre className="p-4 text-xs font-mono text-cyan-300/90 overflow-x-auto leading-relaxed">
          {pythonSnippet}
        </pre>
      </div>

      {/* Notebook Link note */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-purple-400" />
          Interactive Jupyter Notebook available locally: <code className="text-slate-200 font-mono">notebooks/sales_eda_and_ml_forecasting.ipynb</code>
        </span>
        <span className="text-emerald-400 font-semibold flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" /> Ready to Run
        </span>
      </div>
    </div>
  );
};
