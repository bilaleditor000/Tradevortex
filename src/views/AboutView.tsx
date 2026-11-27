import React from 'react';
import { PageView } from '../types';
import { playClickSound } from '../utils/sound';
import { Shield, Target, Users, BookOpen, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (page: PageView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300 mb-3">
          <Shield className="h-3.5 w-3.5 text-cyan-400" />
          <span>Independent Financial Tooling & Research</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About TradeVortex
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
          TradeVortex was built by former institutional prop desk analysts and algorithmic software engineers to solve a critical retail problem: lack of mathematical risk discipline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Target className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">Our Mission</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To provide retail traders worldwide with the exact mathematical calculations, volatility metrics, and position sizing tools used by institutional hedge funds—completely free of charge.
          </p>
        </div>

        <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">Editorial Independence</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every broker review, guide, and calculation formula is audited by certified market technicians (CMT) without editorial influence from commercial sponsors or brokerage sales departments.
          </p>
        </div>

        <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">Anti-Hype Philosophy</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We strictly reject get-rich-quick claims, guaranteed profit algorithms, or luxury lifestyle marketing. Consistent trading is an elite probability business rooted in capital preservation.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-white">
          Our Rigorous Broker Auditing Methodology
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Before any brokerage is listed in our comparison matrices, our research team verifies:
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Regulatory Authenticity:</strong> Valid licenses with Tier-1 bodies (FCA, ASIC, CySEC, CFTC) and independent investor compensation fund memberships.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Spread & Commission Verification:</strong> Real execution testing across live accounts during high-liquidity New York/London sessions to measure true slippage.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">•</span>
            <span><strong>Withdrawal Reliability:</strong> Unscheduled test withdrawals via crypto, bank cards, and local wire systems to record real turnaround times.</span>
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-6">
        <div>
          <h3 className="text-base font-bold text-white">Explore our free tools</h3>
          <p className="text-xs text-slate-400 mt-0.5">Calculate position size or read our comprehensive guides.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            playClickSound('calculate');
            onNavigate('calculators');
          }}
          className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
        >
          <span>Calculators</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
