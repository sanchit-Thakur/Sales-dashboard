'use client';

import { useEffect, useState } from 'react';
import {
  ReceiptText,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building2,
  Check,
} from 'lucide-react';
import { fetchTransactions, syncPlaidBankAccounts } from '@/lib/api';

const categories = [
  'ALL',
  'Housing',
  'Groceries',
  'Dining & Restaurants',
  'Transportation',
  'Utilities & Bills',
  'Subscriptions',
  'Shopping',
  'Income',
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchTransactions(selectedCategory, searchQuery);
    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  const handleSyncPlaid = async () => {
    setSyncing(true);
    const result = await syncPlaidBankAccounts();
    setToastMessage(result.message || 'Synced Plaid transactions successfully');
    await loadData();
    setSyncing(false);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl glass-card border border-emerald-500/40 bg-emerald-950/80 text-emerald-300 font-semibold text-xs flex items-center gap-2 shadow-2xl animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
            <ReceiptText className="h-7 w-7 text-cyan-400" />
            Transactions & AI Categorization
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time Plaid banking feed automatically classified via lightweight LLM reasoning pipelines.
          </p>
        </div>

        <button
          onClick={handleSyncPlaid}
          disabled={syncing}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing Plaid Feed...' : 'Sync Plaid Transactions'}</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search merchant or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="h-6 w-6 text-cyan-400 animate-spin mx-auto mb-2" />
            <span>Retrieving transactions...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <span>No transactions match the selected filter.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Merchant & Description</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">AI Category</th>
                  <th className="py-4 px-6">LLM Confidence</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {transactions.map((t) => {
                  const isIncome = t.categoryName === 'Income' || t.amount < 0;
                  const confidence = t.confidenceScore ? Math.round(t.confidenceScore * 100) : 95;

                  return (
                    <tr key={t.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 font-bold">
                            <Building2 className="h-4 w-4 text-cyan-400" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{t.merchantName}</p>
                            <p className="text-[11px] text-slate-400">{t.description || t.rawDescription}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          <span>{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-cyan-300 border border-slate-700">
                          <Sparkles className="h-3 w-3 text-cyan-400" />
                          {t.categoryName}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 rounded-full"
                              style={{ width: `${confidence}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-emerald-400">{confidence}%</span>
                        </div>
                      </td>

                      <td className={`py-4 px-6 text-right font-extrabold text-sm whitespace-nowrap ${isIncome ? 'text-emerald-400' : 'text-slate-100'}`}>
                        {isIncome ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
