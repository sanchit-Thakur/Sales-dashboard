'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  TrendingUp,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Senior Data Scientist');
  const [organization, setOrganization] = useState('OmniBrands Corp');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const result = await signup(name, email, password, role);
    setIsSubmitting(false);

    if (result.success) {
      router.push('/');
    } else {
      setErrorMsg(result.message || 'Failed to create account.');
    }
  };

  const roles = [
    'Senior Data Scientist',
    'Lead Econometrician',
    'VP of Commercial Sales',
    'Brand Portfolio Director',
    'Machine Learning Engineer',
    'Financial Revenue Analyst'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080c14] px-4 py-12 relative overflow-hidden">
      
      {/* Ambient Neon Glows */}
      <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 shadow-xl shadow-cyan-500/25 mb-1">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create an <span className="text-cyan-400">OmniSales</span> Account
          </h1>
          <p className="text-xs text-slate-400">
            Join the enterprise Data Science & Sales Intelligence platform
          </p>
        </div>

        {/* Signup Card */}
        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/70 p-7 backdrop-blur-xl shadow-2xl space-y-5">
          
          {errorMsg && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-2.5 pl-10 pr-3.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Work Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@company.com"
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-2.5 pl-10 pr-3.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition"
                />
              </div>
            </div>

            {/* Role & Organization Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Role Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Professional Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-2.5 px-3 text-xs text-cyan-400 font-medium focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r} value={r} className="bg-slate-900 text-white">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Organization */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Company / Organization</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="OmniBrands Corp"
                    className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-2.5 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition"
                  />
                </div>
              </div>

            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Creating Enterprise Account...' : 'Complete Registration'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Login link */}
          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 font-bold hover:underline">
              Sign In
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
