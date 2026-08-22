'use client';

import React from 'react';
import { Search, RotateCcw, Filter, Tag, Globe, ShoppingBag } from 'lucide-react';
import { Brand } from '@/types/sales';

interface FilterBarProps {
  brands: Brand[];
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  selectedChannel: string;
  onSelectChannel: (channel: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  brands,
  selectedBrand,
  onSelectBrand,
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
  selectedChannel,
  onSelectChannel,
  searchQuery,
  onSearchChange,
  onReset
}) => {
  const categories = [
    'All',
    'Laptops',
    'Smart Home',
    'Audio',
    'Wearables',
    'Jackets',
    'Pants',
    'Furniture',
    'Appliances',
    'Supplements',
    'Nutrition',
    'Studio Monitors',
    'Headphones'
  ];

  const regions = ['All Regions', 'North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East & Africa'];
  const channels = ['All Channels', 'Direct D2C Website', 'Amazon Enterprise', 'Retail Flagship Stores', 'B2B Wholesale'];

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md shadow-xl">
      <div className="flex flex-col gap-3.5">
        
        {/* Top Row: Brand Selector Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1">
              <Filter className="h-3.5 w-3.5 text-cyan-400" />
              Brands:
            </span>

            <button
              onClick={() => onSelectBrand('All')}
              className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                selectedBrand === 'All'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80'
              }`}
            >
              All Portfolio ({brands.length})
            </button>

            {brands.map((b) => {
              const isSelected = selectedBrand.toLowerCase() === b.name.toLowerCase();
              return (
                <button
                  key={b.id}
                  onClick={() => onSelectBrand(b.name)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? 'text-white font-semibold ring-1 shadow-md'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${b.color}25` : undefined,
                    borderColor: isSelected ? b.color : undefined,
                    boxShadow: isSelected ? `0 0 15px -3px ${b.color}40` : undefined
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: b.color }}
                  />
                  {b.name}
                  <span className="text-[10px] opacity-70">({b.productCount} SKUs)</span>
                </button>
              );
            })}
          </div>

          {/* Reset Filters */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>

        {/* Bottom Row: Secondary Filters & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800/60">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search product name or SKU..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-1.5 text-xs text-slate-300">
              <Tag className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                className="w-full bg-transparent outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-slate-200">
                    Category: {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Region Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-1.5 text-xs text-slate-300">
              <Globe className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <select
                value={selectedRegion}
                onChange={(e) => onSelectRegion(e.target.value)}
                className="w-full bg-transparent outline-none cursor-pointer"
              >
                {regions.map((r) => (
                  <option key={r} value={r} className="bg-slate-900 text-slate-200">
                    Region: {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sales Channel Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-1.5 text-xs text-slate-300">
              <ShoppingBag className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <select
                value={selectedChannel}
                onChange={(e) => onSelectChannel(e.target.value)}
                className="w-full bg-transparent outline-none cursor-pointer"
              >
                {channels.map((ch) => (
                  <option key={ch} value={ch} className="bg-slate-900 text-slate-200">
                    Channel: {ch}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
