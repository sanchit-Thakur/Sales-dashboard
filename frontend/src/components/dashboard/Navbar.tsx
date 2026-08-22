'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  TrendingUp,
  Download,
  Database,
  BrainCircuit,
  Sparkles,
  Layers,
  User,
  LogOut,
  ChevronDown,
  LogIn,
  UserPlus,
  ShieldCheck
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
  const router = useRouter();
  const { user, logout, demoLogin } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#080c14]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo & Project Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">OmniSales</span>
                <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                  DS-Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Enterprise Multi-Brand & Product Analytics</p>
            </div>
          </Link>

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

          {/* Right Action Items: Brand Filter, Export & User Auth Profile */}
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
              className="hidden md:flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 border border-slate-700 transition"
              title="Export Full Multi-Brand Product CSV Dataset"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 p-1.5 pr-2.5 border border-slate-800 hover:border-slate-700 transition"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-7 w-7 rounded-lg object-cover ring-1 ring-cyan-500/40"
                  />
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-bold text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] text-cyan-400 leading-tight truncate max-w-[110px]">{user.role}</p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="border-b border-slate-800 pb-2.5 mb-2 px-1">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-flex mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {user.role}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
                        Switch Demo Persona
                      </p>
                      <button
                        onClick={() => {
                          demoLogin('datascience');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-between"
                      >
                        <span>Dr. Sarah Chen</span>
                        <span className="text-[9px] text-cyan-400">Data Scientist</span>
                      </button>
                      <button
                        onClick={() => {
                          demoLogin('exec');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-between"
                      >
                        <span>Marcus Vance</span>
                        <span className="text-[9px] text-indigo-400">VP Sales</span>
                      </button>
                      <button
                        onClick={() => {
                          demoLogin('brandlead');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-between"
                      >
                        <span>Elena Rostova</span>
                        <span className="text-[9px] text-purple-400">Brand Lead</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-2 mt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700 transition"
                >
                  <LogIn className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  className="hidden sm:flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 transition"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}

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
