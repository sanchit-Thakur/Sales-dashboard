'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, FileText, CheckCircle2, AlertCircle, Shield, RefreshCw } from 'lucide-react';
import { sendAdvisorQuery } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AdvisorPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'report'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello Alex! I am your AI Financial Advisor. I have real-time access to your bank balances ($63,669.75 Net Worth), monthly cash flow ($1,450.00 net surplus), active budgets, and recent transactions.\n\nHow can I help you today? You can ask questions like: *"Can I afford a $500 vacation next month?"* or *"How can I optimize my savings rate?"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Monthly Report state
  const [generatingReport, setGeneratingReport] = useState(false);
  const [report, setReport] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || loading) return;

    const userText = inputQuery;
    setInputQuery('');

    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    const response = await sendAdvisorQuery(userText);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.answer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    // Simulate / fetch monthly AI report
    setTimeout(() => {
      setReport({
        healthScore: 88,
        summary: `In the past 30 days, Alex Morgan generated a total income of $4,250.00 against total expenses of $2,800.00. This resulted in a net surplus of $1,450.00 (a 34.1% savings rate). Dining expenses slightly exceeded target parameters, but housing and fixed utilities remained strictly disciplined.`,
        keyHighlights: [
          'Achieved a high net savings rate of 34.1% ($1,450 surplus).',
          'Housing commitment remained stable at 49.4% of net income.',
          'On track to complete Emergency Fund goal by Q4 2026.',
        ],
        anomalies: [
          'Dining & Restaurants spending spiked by +12.5% over target limit.',
        ],
        actionItems: [
          'Cap weekend restaurant dining outlays at $120/week.',
          'Automate a $500 transfer to Marcus High-Yield Savings account.',
          'Reallocate surplus to accelerate Japan Vacation fund.',
        ],
      });
      setGeneratingReport(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
            <Bot className="h-7 w-7 text-cyan-400" />
            AI Financial Advisor Chat & Monthly Reports
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Context-grounded reasoning engine powered by LangChain & OpenAI GPT-4o.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="h-4 w-4" />
            <span>Advisor Chatbot</span>
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'report'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Monthly AI Report</span>
          </button>
        </div>
      </div>

      {/* CHATBOT INTERFACE TAB */}
      {activeTab === 'chat' && (
        <div className="glass-card rounded-3xl border border-slate-800 flex flex-col h-[640px] overflow-hidden">
          {/* Chat Top Banner */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  LangChain RAG Agent
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                </h3>
                <p className="text-[11px] text-slate-400">Context: 4 Accounts, 8 Budgets, 3 Goals, 20 Transactions</p>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium rounded-br-none shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none whitespace-pre-wrap'
                  }`}
                >
                  {m.content}
                  <div className={`text-[10px] mt-2 opacity-60 text-right ${m.role === 'user' ? 'text-white' : 'text-slate-400'}`}>
                    {m.timestamp}
                  </div>
                </div>

                {m.role === 'user' && (
                  <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    AM
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center animate-spin">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 italic">
                  Analyzing budget context & performing math calculations...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-6 py-2 border-t border-slate-800/60 bg-slate-950/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider shrink-0">Try Asking:</span>
            {[
              'Can I afford a $500 vacation next month?',
              'How can I cut $200 from discretionary spending?',
              'Am I on track with my Emergency Fund goal?',
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInputQuery(prompt)}
                className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:border-cyan-500 transition whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center gap-3">
            <input
              type="text"
              placeholder="Ask your financial advisor any question..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-3 text-xs md:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* MONTHLY REPORT TAB */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Monthly AI Financial Report</h2>
              <p className="text-xs text-slate-400">Natural-language summary, anomaly detection, and actionable guidance</p>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={generatingReport}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-500/20 hover:opacity-90 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${generatingReport ? 'animate-spin' : ''}`} />
              <span>{generatingReport ? 'Generating Report...' : 'Generate New Monthly Report'}</span>
            </button>
          </div>

          {report && (
            <div className="space-y-6">
              {/* Summary Header Card */}
              <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#101426] to-slate-900 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">Financial Performance Summary</h3>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs border border-emerald-500/30">
                    Health Score: {report.healthScore}/100
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{report.summary}</p>
              </div>

              {/* Highlights & Anomalies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Highlights */}
                <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 space-y-3">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Key Achievements
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {report.keyHighlights.map((h: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Anomalies */}
                <div className="glass-card p-6 rounded-3xl border border-amber-500/30 space-y-3">
                  <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Overspending Anomalies
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {report.anomalies.map((a: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Items */}
              <div className="glass-card p-6 rounded-3xl border border-cyan-500/30 space-y-3">
                <h4 className="text-sm font-bold text-cyan-400">Actionable Steps for Next Month</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {report.actionItems.map((item: string, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium leading-relaxed">
                      <span className="font-bold text-cyan-400 block mb-1">Step {idx + 1}</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
