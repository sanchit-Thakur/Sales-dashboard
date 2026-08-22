'use client';

import React from 'react';
import {
  TrendingUp,
  Download,
  Database,
  BrainCircuit,
  Sparkles,
  Layers
} from 'lucide-react';
import { Brand } from '@/types/sales';

interface NavbarProps {
  brands: Brand[];
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brands,
  selectedBrand,
  onSelectBrand,
  activeTab,
  onSelectTab
}) => {
  const tabs = [
    { id: 'overview', label: 'Executive Portfolio', icon: TrendingUp },
    { id: 'products', label: 'Product Sales Studio', icon: Layers },
    { id: 'forecast', label: 'ML Forecasting', icon: BrainCircuit },
    { id: 'simulator', label: 'What-If Simulator', icon: Sparkles },
    { id: 'customers', label: 'Customer Cohorts & Basket', icon: Database }
  ];

  const handleExportCSV = () => {
    window.open('http://localhost:5001/api/sales/export-csv', '_blank');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#080c14]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo & Project Identity */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 shadow-lg shadow-cyan-500/20">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">OmniSales</span>
                <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                  DS-Studio
                </span>
              </div>
              <p className="text-xs text-slate-400">Enterprise Multi-Brand & Product Analytics</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-900/80 p-1 border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Items: Brand Filter & Export */}
          <div className="flex items-center gap-3">
            {/* Quick Brand Switcher Pill */}
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs">
              <span className="text-slate-400">Brand:</span>
              <select
                value={selectedBrand}
                onChange={(e) => onSelectBrand(e.target.value)}
                className="bg-transparent font-medium text-cyan-400 outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All Portfolio Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.name} className="bg-slate-900 text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Dataset Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 border border-slate-700 transition"
              title="Export Full Multi-Brand Product CSV Dataset"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/60 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center whitespace-nowrap gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3 w-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
