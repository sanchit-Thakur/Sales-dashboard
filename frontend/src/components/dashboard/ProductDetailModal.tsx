'use client';

import React from 'react';
import {
  X,
  Star,
  RotateCcw,
  TrendingUp,
  Globe,
  ShoppingBag,
  DollarSign,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Product } from '@/types/sales';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const velocityData = product.sparkline.map((units, idx) => ({
    month: months[idx],
    units,
    revenue: Math.round(units * product.basePrice)
  }));

  const channelColors = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Title & Brand Badge */}
        <div className="flex flex-wrap items-center gap-3 pr-10">
          <span className="rounded-lg bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
            {product.brand}
          </span>
          <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-400">
            {product.id}
          </span>
          <span className="text-xs text-slate-400 font-medium">Category: {product.category}</span>
        </div>

        <h2 className="mt-2 text-2xl font-bold text-white">{product.name}</h2>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Unit Price / Cost</p>
            <p className="text-lg font-bold text-white mt-0.5">${product.basePrice} <span className="text-xs text-slate-500 font-normal">/ ${product.unitCost}</span></p>
            <p className="text-[10px] text-emerald-400 mt-1">{product.profitMargin}% Gross Margin</p>
          </div>

          <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Net Revenue</p>
            <p className="text-lg font-bold text-cyan-400 mt-0.5">${product.netRevenue.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">${product.grossProfit.toLocaleString()} Net Profit</p>
          </div>

          <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Units Sold</p>
            <p className="text-lg font-bold text-purple-400 mt-0.5">{product.unitsSold.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-1">Inv Turnover: {product.inventoryTurnover}x</p>
          </div>

          <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Rating & Return Rate</p>
            <p className="text-lg font-bold text-amber-400 mt-0.5 flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400" />
              {product.rating} <span className="text-xs text-slate-400 font-normal">({product.returnRate}% returns)</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Price Elasticity: {product.priceElasticity}</p>
          </div>
        </div>

        {/* 12-Month Sales Velocity Chart */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-3">
            <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
            12-Month Monthly Unit Sales Velocity
          </h4>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any, name: any) => [name === 'units' ? `${val} Units` : `$${val.toLocaleString()}`, name === 'units' ? 'Units Sold' : 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="units" stroke="#06b6d4" strokeWidth={2} fill="url(#colorUnits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dual Breakdown: Regional Sales vs Channel Attribution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          
          {/* Regional Distribution */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-3">
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              Regional Revenue Distribution
            </h4>
            <div className="space-y-2">
              {product.regionalDistribution.map((reg) => {
                const pct = Math.round((reg.revenue / product.netRevenue) * 100);
                return (
                  <div key={reg.region} className="text-xs">
                    <div className="flex justify-between text-slate-300 font-medium mb-1">
                      <span>{reg.region}</span>
                      <span className="text-slate-400">${reg.revenue.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Channel Breakdown */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-3">
              <ShoppingBag className="h-3.5 w-3.5 text-purple-400" />
              Sales Channel Breakdown
            </h4>
            <div className="space-y-2">
              {product.channelDistribution.map((ch, idx) => {
                const pct = Math.round((ch.revenue / product.netRevenue) * 100);
                const color = channelColors[idx % channelColors.length];
                return (
                  <div key={ch.channel} className="text-xs">
                    <div className="flex justify-between text-slate-300 font-medium mb-1">
                      <span>{ch.channel}</span>
                      <span className="text-slate-400">${ch.revenue.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
