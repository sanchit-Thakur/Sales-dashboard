'use client';

import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Cell
} from 'recharts';
import { Product } from '@/types/sales';
import {
  Layers,
  ArrowUpDown,
  Search,
  ExternalLink,
  Sparkles,
  DollarSign,
  ShoppingBag,
  Star,
  Activity
} from 'lucide-react';

interface ProductPerformanceStudioProps {
  products: Product[];
  selectedBrand: string;
  onSelectProduct: (product: Product) => void;
}

export const ProductPerformanceStudio: React.FC<ProductPerformanceStudioProps> = ({
  products,
  selectedBrand,
  onSelectProduct
}) => {
  const [viewMode, setViewMode] = useState<'revenue-margin' | 'scatter' | 'category'>('revenue-margin');
  const [sortField, setSortField] = useState<keyof Product>('netRevenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const brandColors: Record<string, string> = {
    AuraTech: '#06b6d4',
    NovaStyle: '#8b5cf6',
    ApexLiving: '#10b981',
    VitalisHealth: '#f59e0b',
    PulseAudio: '#ec4899'
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'desc' ? valB - valA : valA - valB;
    }
    return 0;
  });

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Chart data for Dual-Axis
  const chartData = sortedProducts.slice(0, 14).map((p) => ({
    name: p.name.length > 18 ? p.name.substring(0, 16) + '...' : p.name,
    fullName: p.name,
    brand: p.brand,
    revenue: Math.round(p.netRevenue / 1000),
    profit: Math.round(p.grossProfit / 1000),
    margin: p.profitMargin,
    units: p.unitsSold,
    color: brandColors[p.brand] || '#06b6d4'
  }));

  // Scatter plot data (Price vs Volume vs Margin)
  const scatterData = products.map((p) => ({
    name: p.name,
    brand: p.brand,
    price: p.basePrice,
    units: p.unitsSold,
    revenue: p.netRevenue,
    margin: p.profitMargin,
    profit: p.grossProfit,
    color: brandColors[p.brand] || '#06b6d4'
  }));

  // Category Aggregation
  const categoryMap: Record<string, { category: string; revenue: number; units: number; count: number }> = {};
  products.forEach((p) => {
    if (!categoryMap[p.category]) {
      categoryMap[p.category] = { category: p.category, revenue: 0, units: 0, count: 0 };
    }
    categoryMap[p.category].revenue += p.netRevenue;
    categoryMap[p.category].units += p.unitsSold;
    categoryMap[p.category].count += 1;
  });
  const categoryData = Object.values(categoryMap).sort((a, b) => b.revenue - a.revenue);

  // Custom Tooltip for Composed Chart
  const CustomComposedTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md text-xs">
          <p className="font-bold text-white mb-1">{item.fullName}</p>
          <p className="text-slate-400 mb-2">Brand: <span style={{ color: item.color }} className="font-semibold">{item.brand}</span></p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4 text-cyan-300">
              <span>Net Revenue:</span>
              <span className="font-bold">${(item.revenue * 1000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4 text-emerald-300">
              <span>Gross Profit:</span>
              <span className="font-bold">${(item.profit * 1000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4 text-amber-300">
              <span>Profit Margin:</span>
              <span className="font-bold">{item.margin}%</span>
            </div>
            <div className="flex justify-between gap-4 text-purple-300">
              <span>Units Sold:</span>
              <span className="font-bold">{item.units.toLocaleString()} units</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Graph Studio Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Product-Level Sales & Margin Graph Studio</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualizing revenue, profit, unit volume, and pricing elasticity for every individual product SKU
            </p>
          </div>

          {/* Graph View Toggle Pills */}
          <div className="flex items-center rounded-xl bg-slate-800/80 p-1 border border-slate-700">
            <button
              onClick={() => setViewMode('revenue-margin')}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                viewMode === 'revenue-margin'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dual-Axis (Revenue & Margin %)
            </button>
            <button
              onClick={() => setViewMode('scatter')}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                viewMode === 'scatter'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Price vs Volume Matrix
            </button>
            <button
              onClick={() => setViewMode('category')}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                viewMode === 'category'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Category Aggregates
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-[380px] w-full">
          {viewMode === 'revenue-margin' && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 15, right: 10, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#06b6d4"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#10b981"
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomComposedTooltip />} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="Net Revenue ($k)"
                  fill="#06b6d4"
                  radius={[6, 6, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                  ))}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="margin"
                  name="Gross Margin %"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {viewMode === 'scatter' && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  dataKey="price"
                  name="Unit Price ($)"
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                  label={{ value: 'Unit Price ($ USD)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  type="number"
                  dataKey="units"
                  name="Units Sold"
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v / 1000}k`}
                  label={{ value: 'Total Units Sold', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                />
                <ZAxis type="number" dataKey="profit" range={[60, 400]} name="Gross Profit ($)" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 text-xs shadow-2xl backdrop-blur-md">
                          <p className="font-bold text-white mb-1">{data.name}</p>
                          <p className="text-slate-400 mb-1">Brand: <span style={{ color: data.color }} className="font-semibold">{data.brand}</span></p>
                          <p className="text-cyan-300">Unit Price: <span className="font-bold">${data.price}</span></p>
                          <p className="text-purple-300">Units Sold: <span className="font-bold">{data.units.toLocaleString()}</span></p>
                          <p className="text-emerald-300">Net Revenue: <span className="font-bold">${data.revenue.toLocaleString()}</span></p>
                          <p className="text-amber-300">Profit Margin: <span className="font-bold">{data.margin}%</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Products" data={scatterData} fill="#06b6d4">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {viewMode === 'category' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 20, left: 80, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Total Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[0, 6, 6, 0]}>
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'][index % 6]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Exhaustive Product SKU Catalog Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden backdrop-blur-xl shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-cyan-400" />
              All Brand Products Catalog & Velocity Metrics ({sortedProducts.length} SKUs)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click on any product row for full econometric deep-dive, channel distribution, and price elasticity curve
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
            Sorted by: <span className="text-cyan-400 font-semibold">{String(sortField)}</span> ({sortDirection})
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                  Product & SKU
                </th>
                <th className="py-3.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('brand')}>
                  Brand
                </th>
                <th className="py-3.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('category')}>
                  Category
                </th>
                <th className="py-3.5 px-3 text-right cursor-pointer hover:text-white" onClick={() => handleSort('basePrice')}>
                  Price ($)
                </th>
                <th className="py-3.5 px-3 text-right cursor-pointer hover:text-white" onClick={() => handleSort('unitsSold')}>
                  Units Sold
                </th>
                <th className="py-3.5 px-3 text-right cursor-pointer hover:text-white" onClick={() => handleSort('netRevenue')}>
                  Net Revenue
                </th>
                <th className="py-3.5 px-3 text-right cursor-pointer hover:text-white" onClick={() => handleSort('profitMargin')}>
                  Margin %
                </th>
                <th className="py-3.5 px-3 text-center cursor-pointer hover:text-white" onClick={() => handleSort('priceElasticity')}>
                  Elasticity ($E_d$)
                </th>
                <th className="py-3.5 px-3 text-center cursor-pointer hover:text-white" onClick={() => handleSort('rating')}>
                  Rating
                </th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
              {sortedProducts.map((p) => {
                const brandColor = brandColors[p.brand] || '#06b6d4';
                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    {/* Product Name & ID */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: brandColor }}
                        />
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-300 transition">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">{p.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="py-3 px-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border"
                        style={{
                          backgroundColor: `${brandColor}15`,
                          borderColor: `${brandColor}40`,
                          color: brandColor
                        }}
                      >
                        {p.brand}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 text-slate-400">{p.category}</td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right font-mono text-slate-200">
                      ${p.basePrice.toFixed(2)}
                    </td>

                    {/* Units Sold */}
                    <td className="py-3 px-3 text-right font-mono text-purple-300 font-semibold">
                      {p.unitsSold.toLocaleString()}
                    </td>

                    {/* Net Revenue */}
                    <td className="py-3 px-3 text-right font-mono text-cyan-300 font-bold">
                      ${p.netRevenue.toLocaleString()}
                    </td>

                    {/* Profit Margin */}
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-block font-mono font-bold ${
                          p.profitMargin >= 60
                            ? 'text-emerald-400'
                            : p.profitMargin >= 45
                            ? 'text-cyan-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {p.profitMargin}%
                      </span>
                    </td>

                    {/* Elasticity */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          Math.abs(p.priceElasticity) > 1.3
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {p.priceElasticity}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-amber-400 font-semibold">
                        <Star className="h-3 w-3 fill-amber-400" />
                        <span>{p.rating}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(p);
                        }}
                        className="rounded-lg bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-400 p-1.5 border border-slate-700 transition"
                        title="View Deep Dive"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
