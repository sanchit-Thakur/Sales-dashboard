'use client';

import React, { useState, useEffect } from 'react';
import { MarketBasketItem } from '@/types/sales';
import { fetchMarketBasket } from '@/lib/api';
import { Database, Link2, Sparkles, ShoppingCart, Percent } from 'lucide-react';

export const MarketBasketStudio: React.FC = () => {
  const [affinities, setAffinities] = useState<MarketBasketItem[]>([]);

  useEffect(() => {
    fetchMarketBasket().then(setAffinities);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <ShoppingCart className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Market Basket & Cross-Brand Product Affinity Rules</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Association rule mining metrics (Support, Confidence, Lift) identifying prime multi-brand bundling opportunities
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3 px-3">Primary Item (Antecedent)</th>
              <th className="py-3 px-3">Associated Item (Consequent)</th>
              <th className="py-3 px-2 text-center">Support</th>
              <th className="py-3 px-2 text-center">Confidence</th>
              <th className="py-3 px-2 text-center">Lift Ratio</th>
              <th className="py-3 px-3">Recommended Bundle Strategy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
            {affinities.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-3">
                  <div className="font-bold text-white">{item.itemA}</div>
                  <span className="text-[10px] text-cyan-400 font-semibold">{item.brandA}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="font-bold text-white">{item.itemB}</div>
                  <span className="text-[10px] text-purple-400 font-semibold">{item.brandB}</span>
                </td>
                <td className="py-3 px-2 text-center font-mono font-semibold text-slate-300">
                  {(item.support * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-2 text-center font-mono font-bold text-indigo-400">
                  {(item.confidence * 100).toFixed(0)}%
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                    {item.lift}x Lift
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    <Sparkles className="h-3 w-3" />
                    {item.recommendedBundleDiscount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
