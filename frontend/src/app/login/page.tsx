'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  TrendingUp,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  Briefcase,
  Layers,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push('/');
    } else {
      setErrorMsg(result.message || 'Invalid email or password.');
    }
  };

  const handleQuickDemo = async (persona: 'datascience' | 'exec' | 'brandlead') => {
    await demoLogin(persona);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080c14] px-4 py-12 relative overflow-hidden">
      
      {/* Ambient Neon Glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md space-y-6">
        
        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 shadow-xl shadow-cyan-500/25 mb-1">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome to <span className="text-cyan-400">OmniSales</span> DS-Studio
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access Multi-Brand Sales Intelligence & Machine Learning Hub
          </p>
        </div>

        {/* Main Login Card */}
        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/70 p-7 backdrop-blur-xl shadow-2xl space-y-6">
          
          {errorMsg && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="data.scientist@omnisales.ai"
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-2.5 pl-10 pr-3.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <span className="text-[11px] text-cyan-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-2.5 pl-10 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo 1-Click Personas */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 justify-center">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              1-Click Demo Executive Personas
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('datascience')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 transition group text-center"
              >
                <BrainCircuit className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition mb-1" />
                <span className="text-[10px] font-bold text-slate-200">Data Scientist</span>
                <span className="text-[9px] text-slate-500">Dr. Sarah Chen</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('exec')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition group text-center"
              >
                <Briefcase className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition mb-1" />
                <span className="text-[10px] font-bold text-slate-200">VP Sales</span>
                <span className="text-[9px] text-slate-500">Marcus Vance</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('brandlead')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/60 transition group text-center"
              >
                <Layers className="h-4 w-4 text-purple-400 group-hover:scale-110 transition mb-1" />
                <span className="text-[10px] font-bold text-slate-200">Brand Director</span>
                <span className="text-[9px] text-slate-500">Elena Rostova</span>
              </button>
            </div>
          </div>

          {/* Signup link */}
          <div className="text-center text-xs text-slate-400 pt-1">
            Don't have an enterprise account?{' '}
            <Link href="/signup" className="text-cyan-400 font-bold hover:underline">
              Create Account
            </Link>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition">
            ← Return to Dashboard Preview
          </Link>
        </div>

      </div>
    </div>
  );
}
