'use client';

import { useEffect, useState } from 'react';
import { Target, Plus, CheckCircle2, Calendar, Award, Sparkles, TrendingUp } from 'lucide-react';
import { fetchGoals, updateGoalProgress } from '@/lib/api';

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadGoals = async () => {
    setLoading(true);
    const data = await fetchGoals();
    setGoals(data);
    setLoading(false);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleAddProgress = async (goalId: string) => {
    setUpdatingId(goalId);
    await updateGoalProgress(goalId, 250);
    await loadGoals();
    setUpdatingId(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
            <Target className="h-7 w-7 text-violet-400" />
            Financial Goals & Milestones
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build wealth systematically by setting dedicated targets with deadlines and progress tracking.
          </p>
        </div>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-cyan-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((g) => (
            <div
              key={g.id}
              className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6 hover:border-violet-500/40 transition duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {g.category || 'Savings Goal'}
                  </span>
                  {g.isCompleted ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> COMPLETED
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-cyan-400">{g.progressPercentage}% Progress</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{g.name}</h3>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl md:text-3xl font-extrabold text-white">${g.currentAmount.toLocaleString()}</span>
                  <span className="text-xs text-slate-400">/ ${g.targetAmount.toLocaleString()}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${g.progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>Target Date: Dec 2026</span>
                  </div>
                  <span className="font-semibold text-slate-300">
                    Remaining: ${(g.targetAmount - g.currentAmount).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => handleAddProgress(g.id)}
                  disabled={updatingId === g.id || g.isCompleted}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  <span>{updatingId === g.id ? 'Updating...' : '+ Add $250 Contribution'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
