'use client';

import { Bell, Search, User, Zap } from 'lucide-react';

export function Navbar() {
  return (
    <header className="h-16 border-b border-border bg-[#0b101d]/60 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input */}
      <div className="relative w-72 hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search transactions, budgets, AI insights..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
        />
      </div>

      {/* User Actions & Profile */}
      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <Zap className="h-3.5 w-3.5 fill-emerald-400" />
          <span>Sync Status: Live</span>
        </div>

        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400" />
        </button>

        <div className="h-6 w-px bg-slate-800" />

        <div className="flex items-center gap-3 cursor-pointer">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-500/20">
            AM
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white">Alex Morgan</p>
            <p className="text-[10px] text-slate-400">USD ($) • Premium Account</p>
          </div>
        </div>
      </div>
    </header>
  );
}
