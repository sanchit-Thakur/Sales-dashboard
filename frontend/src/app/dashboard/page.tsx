'use client';

import { useEffect, useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Target,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BarChart3,
  ShieldCheck,
  Plus,
  Building2,
  CreditCard,
  PiggyBank,
  Briefcase,
  X,
  Eye,
  Check,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  fetchDashboardSummary,
  fetchGoals,
  fetchAccounts,
  createBankAccount,
  syncPlaidBankAccounts,
  fetchTransactions,
} from '@/lib/api';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('ALL');
  const [accountTransactions, setAccountTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Add Bank Account Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState('CHECKING');
  const [newAccBalance, setNewAccBalance] = useState('');
  const [submittingAcc, setSubmittingAcc] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    const [summary, goalsData, accountsData, txData] = await Promise.all([
      fetchDashboardSummary(),
      fetchGoals(),
      fetchAccounts(),
      fetchTransactions('ALL', '', selectedAccountId),
    ]);
    setData(summary);
    setGoals(goalsData);
    setAccounts(accountsData);
    setAccountTransactions(txData);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedAccountId]);

  const handleSyncPlaid = async () => {
    setSyncing(true);
    const res = await syncPlaidBankAccounts();
    setToastMessage(res.message || 'Synced Plaid Bank Accounts successfully');
    await loadDashboardData();
    setSyncing(false);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim() || !newAccBalance) return;

    setSubmittingAcc(true);
    const created = await createBankAccount({
      name: newAccName,
      type: newAccType,
      balance: parseFloat(newAccBalance) || 0,
      currency: 'USD',
    });

    setToastMessage(`Successfully connected ${created.name}!`);
    setIsModalOpen(false);
    setNewAccName('');
    setNewAccBalance('');
    setSubmittingAcc(false);
    await loadDashboardData();
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (loading || !data) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Aggregating bank account balances & monthly spending...</p>
      </div>
    );
  }

  // Monthly Income vs Expenses Recharts Bar Chart Data
  const monthlyComparisonData = [
    { month: 'Mar', Income: 4100, Expenses: 2750 },
    { month: 'Apr', Income: 4250, Expenses: 2900 },
    { month: 'May', Income: 4250, Expenses: 2650 },
    { month: 'Jun', Income: 4400, Expenses: 3100 },
    { month: 'Jul', Income: 4250, Expenses: 2700 },
    { month: 'Aug', Income: data.monthlyIncome, Expenses: data.monthlyExpenses },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl glass-card border border-emerald-500/40 bg-emerald-950/90 text-emerald-300 font-semibold text-xs flex items-center gap-2 shadow-2xl animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-[#0d1627] to-slate-900/90 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">AI Health Score: 88/100 (Optimal)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Alex Morgan's Wealth Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time bank cash flow, Recharts financial analytics, and connected bank accounts.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
          >
            <Plus className="h-4 w-4 text-cyan-400" />
            <span>Link Bank Account</span>
          </button>

          <button
            onClick={handleSyncPlaid}
            disabled={syncing}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing Plaid Account Feed...' : 'Sync Plaid Accounts'}</span>
          </button>
        </div>
      </div>

      {/* NEW SECTION: Connected Bank Accounts & Monthly Outlay Manager */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-cyan-400" />
              Connected Bank Accounts & Monthly Outlay
            </h2>
            <p className="text-xs text-slate-400">Select an account below to filter monthly spending and transaction logs</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedAccountId('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedAccountId === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              All Accounts ({accounts.length})
            </button>
          </div>
        </div>

        {/* Bank Account Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accounts.map((acc) => {
            const isSelected = selectedAccountId === acc.id;
            let Icon = Building2;
            let iconColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';

            if (acc.type === 'CREDIT_CARD') {
              Icon = CreditCard;
              iconColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
            } else if (acc.type === 'SAVINGS') {
              Icon = PiggyBank;
              iconColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
            } else if (acc.type === 'INVESTMENT') {
              Icon = Briefcase;
              iconColor = 'text-violet-400 bg-violet-500/10 border-violet-500/30';
            }

            return (
              <div
                key={acc.id}
                onClick={() => setSelectedAccountId(acc.id)}
                className={`p-5 rounded-2xl bg-slate-900/90 border cursor-pointer transition duration-300 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 ${
                  isSelected ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/10' : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {acc.type.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm mb-1">{acc.name}</h3>
                  <p className="text-2xl font-extrabold text-white tracking-tight">
                    ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Monthly Spent:</span>
                  <span className="font-extrabold text-rose-400">${(acc.monthlySpending || 0).toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Metric Cards (shadcn/ui layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Net Worth Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-cyan-500/40 transition duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition">
            <Wallet className="h-24 w-24 text-cyan-400" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Net Worth</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              +12.4% YTD
            </span>
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
            ${data.netWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div>Assets: <span className="text-emerald-400 font-semibold">${data.totalAssets.toLocaleString()}</span></div>
            <div>Liabilities: <span className="text-rose-400 font-semibold">${data.totalLiabilities.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Monthly Cash Surplus */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Cash Surplus</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-emerald-400 mb-2 tracking-tight">
            +${data.netCashFlow.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Income: <strong className="text-slate-200">${data.monthlyIncome.toLocaleString()}</strong></span>
            <span>•</span>
            <span>Expenses: <strong className="text-slate-200">${data.monthlyExpenses.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Quick Advisor Prompt Banner */}
        <div className="glass-card p-6 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-950/30 via-slate-900 to-slate-900 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">AI Advisor Alert</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium mb-3">
            Dining out spending reached <strong>$623.25</strong> ($23 over limit). Reallocating surplus to your <strong>Emergency Fund</strong> target keeps you on track for Q4 completion.
          </p>
          <a
            href="/advisor"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-300 hover:text-white transition mt-auto"
          >
            <span>Ask AI Advisor Chatbot</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Main Section: Recharts Income vs. Expenses Bar Chart */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              Income vs. Expenses Comparison (Recharts)
            </h2>
            <p className="text-xs text-slate-400">Monthly cash inflow vs. total category expenditures</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-md bg-cyan-400" /> Monthly Income
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-md bg-rose-400" /> Total Expenses
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="Income" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Income ($)" />
              <Bar dataKey="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Expenses ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goal Tracking Section */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-violet-400" />
              Active Financial Goals Progress
            </h2>
            <p className="text-xs text-slate-400">Track target savings and investment milestones</p>
          </div>
          <a href="/goals" className="text-xs font-bold text-cyan-400 hover:underline">View All Goals →</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal: any) => (
            <div key={goal.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-white">{goal.name}</span>
                <span className="text-xs font-bold text-cyan-400">{goal.progressPercentage}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${goal.progressPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Current: <strong className="text-slate-200">${goal.currentAmount.toLocaleString()}</strong></span>
                <span>Target: <strong className="text-slate-200">${goal.targetAmount.toLocaleString()}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD BANK ACCOUNT MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="glass-card w-full max-w-md p-6 rounded-3xl border border-cyan-500/30 bg-[#0f172a] shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Connect Bank Account</h3>
                <p className="text-xs text-slate-400">Link checking, savings, card, or brokerage</p>
              </div>
            </div>

            <form onSubmit={handleAddAccountSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Bank / Account Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chase Total Checking, Citi Double Cash"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Account Type</label>
                <select
                  value={newAccType}
                  onChange={(e) => setNewAccType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 text-xs transition"
                >
                  <option value="CHECKING">Checking Account</option>
                  <option value="SAVINGS">High-Yield Savings Account</option>
                  <option value="CREDIT_CARD">Credit Card Account</option>
                  <option value="INVESTMENT">Investment / Brokerage</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Starting Balance ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 5420.50 (negative for credit card)"
                  value={newAccBalance}
                  onChange={(e) => setNewAccBalance(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs transition"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAcc}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  <span>{submittingAcc ? 'Connecting...' : 'Connect Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
