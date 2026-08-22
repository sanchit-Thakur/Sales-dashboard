'use client';

import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Product, SimulationResult } from '@/types/sales';
import { runWhatIfSimulation } from '@/lib/api';
import {
  Sparkles,
  Sliders,
  TrendingUp,
  Percent,
  DollarSign,
  ShoppingBag,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

interface WhatIfSimulatorProps {
  products: Product[];
  selectedBrand: string;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ products, selectedBrand }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'AT-101');
  const [priceChangePct, setPriceChangePct] = useState<number>(5);
  const [discountChangePct, setDiscountChangePct] = useState<number>(0);
  const [marketingSpendPct, setMarketingSpendPct] = useState<number>(15);
  const [unitCostPct, setUnitCostPct] = useState<number>(0);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    if (products.length > 0 && !products.find((p) => p.id === selectedProductId)) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  useEffect(() => {
    runWhatIfSimulation({
      productId: selectedProductId,
      priceChangePct,
      discountChangePct,
      marketingSpendChangePct: marketingSpendPct,
      unitCostChangePct: unitCostPct
    }).then(setSimulationResult);
  }, [selectedProductId, priceChangePct, discountChangePct, marketingSpendPct, unitCostPct]);

  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  return (
    <div className="space-y-6">
      
      {/* Header & Product Selector */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-white">Price Elasticity & What-If Scenario Simulator</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulate price shifts, promotional discounts, and ad spend to model predicted revenue, unit demand, and net profit
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Target Product:</span>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-cyan-400 outline-none cursor-pointer"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  [{p.brand}] {p.name} (${p.basePrice})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Sliders (Left) & Live Impact Dashboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Simulation Sliders (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-cyan-400" />
              Scenario Control Parameters
            </h4>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              $E_d$ = {activeProduct?.priceElasticity || -1.25}
            </span>
          </div>

          {/* Slider 1: Price Change */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Price Adjustment</span>
              <span className={`font-bold font-mono ${priceChangePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {priceChangePct >= 0 ? `+${priceChangePct}%` : `${priceChangePct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="1"
              value={priceChangePct}
              onChange={(e) => setPriceChangePct(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-30% (Volume Play)</span>
              <span>Baseline ($0)</span>
              <span>+30% (Premium Play)</span>
            </div>
          </div>

          {/* Slider 2: Discount Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Promotional Discount</span>
              <span className="font-bold font-mono text-indigo-400">{discountChangePct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={discountChangePct}
              onChange={(e) => setDiscountChangePct(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% (No Discount)</span>
              <span>12.5%</span>
              <span>25% (Flash Sale)</span>
            </div>
          </div>

          {/* Slider 3: Marketing Spend */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Marketing & Ad Spend</span>
              <span className={`font-bold font-mono ${marketingSpendPct >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {marketingSpendPct >= 0 ? `+${marketingSpendPct}%` : `${marketingSpendPct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={marketingSpendPct}
              onChange={(e) => setMarketingSpendPct(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-50% Cut</span>
              <span>Baseline</span>
              <span>+100% Boost</span>
            </div>
          </div>

          {/* Slider 4: Unit Cost Variance */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">COGS / Unit Cost Variance</span>
              <span className={`font-bold font-mono ${unitCostPct <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {unitCostPct >= 0 ? `+${unitCostPct}%` : `${unitCostPct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={unitCostPct}
              onChange={(e) => setUnitCostPct(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-20% (Supply Savings)</span>
              <span>Baseline</span>
              <span>+20% (Cost Inflation)</span>
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={() => {
              setPriceChangePct(0);
              setDiscountChangePct(0);
              setMarketingSpendPct(0);
              setUnitCostPct(0);
            }}
            className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-semibold text-slate-300 transition"
          >
            Reset to Baseline
          </button>
        </div>

        {/* Right Column: Live Impact Cards & Demand Curves (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Before vs After Impact Metric Cards */}
          {simulationResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Unit Price */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 backdrop-blur-xl shadow-lg">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Unit Price</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-lg font-bold text-white">${simulationResult.simulated.unitPrice}</span>
                  <span className="text-[10px] text-slate-500 line-through">${simulationResult.baseline.unitPrice}</span>
                </div>
                <span className={`text-[10px] font-semibold ${simulationResult.deltas.unitPriceDeltaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simulationResult.deltas.unitPriceDeltaPct >= 0 ? `+${simulationResult.deltas.unitPriceDeltaPct}%` : `${simulationResult.deltas.unitPriceDeltaPct}%`}
                </span>
              </div>

              {/* Units Sold */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 backdrop-blur-xl shadow-lg">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Predicted Units</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-lg font-bold text-purple-400">{simulationResult.simulated.unitsSold.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500">{simulationResult.baseline.unitsSold.toLocaleString()}</span>
                </div>
                <span className={`text-[10px] font-semibold ${simulationResult.deltas.unitsSoldDeltaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simulationResult.deltas.unitsSoldDeltaPct >= 0 ? `+${simulationResult.deltas.unitsSoldDeltaPct}%` : `${simulationResult.deltas.unitsSoldDeltaPct}%`}
                </span>
              </div>

              {/* Net Revenue */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 backdrop-blur-xl shadow-lg">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Predicted Net Revenue</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-lg font-bold text-cyan-400">${(simulationResult.simulated.netRevenue / 1000).toFixed(0)}k</span>
                  <span className="text-[10px] text-slate-500">${(simulationResult.baseline.netRevenue / 1000).toFixed(0)}k</span>
                </div>
                <span className={`text-[10px] font-semibold ${simulationResult.deltas.netRevenueDeltaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simulationResult.deltas.netRevenueDeltaPct >= 0 ? `+${simulationResult.deltas.netRevenueDeltaPct}%` : `${simulationResult.deltas.netRevenueDeltaPct}%`}
                </span>
              </div>

              {/* Gross Profit */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 backdrop-blur-xl shadow-lg">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Predicted Gross Profit</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-lg font-bold text-emerald-400">${(simulationResult.simulated.grossProfit / 1000).toFixed(0)}k</span>
                  <span className="text-[10px] text-slate-500">${(simulationResult.baseline.grossProfit / 1000).toFixed(0)}k</span>
                </div>
                <span className={`text-[10px] font-semibold ${simulationResult.deltas.grossProfitDeltaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simulationResult.deltas.grossProfitDeltaPct >= 0 ? `+${simulationResult.deltas.grossProfitDeltaPct}%` : `${simulationResult.deltas.grossProfitDeltaPct}%`}
                </span>
              </div>
            </div>
          )}

          {/* Demand Curve Chart */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-3">
              <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
              Econometric Price Demand & Profit Optimization Curve
            </h4>

            <div className="h-[260px] w-full">
              {simulationResult && (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={simulationResult.demandCurve} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="price" stroke="#64748b" tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" stroke="#8b5cf6" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: any, name: any) => [
                        name === 'predictedVolume' ? `${Number(val).toLocaleString()} Units` : `$${Number(val).toLocaleString()}`,
                        name === 'predictedVolume' ? 'Predicted Units' : (name === 'predictedRevenue' ? 'Net Revenue' : 'Gross Profit')
                      ]}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="predictedVolume" name="Predicted Volume (Units)" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="predictedRevenue" name="Net Revenue ($)" stroke="#06b6d4" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="predictedProfit" name="Gross Profit ($)" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: '#10b981' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* AI Econometric Recommendation */}
          {simulationResult && (
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-indigo-950/40 p-4 shadow-xl flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shrink-0">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-300">Data Science Recommendation</h5>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {simulationResult.recommendation}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
