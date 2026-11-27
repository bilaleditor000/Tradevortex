import React, { useState } from 'react';
import { playClickSound } from '../utils/sound';
import { TrendingUp, TrendingDown, ShieldAlert, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { AdPlaceholder } from './AdPlaceholder';

interface Signal {
  id: string;
  asset: string;
  bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  timeframe: string;
  entryZone: string;
  target1: string;
  target2: string;
  stopLoss: string;
  riskReward: string;
  catalyst: string;
  updatedAt: string;
}

const SIGNALS: Signal[] = [
  {
    id: 'xauusd',
    asset: 'XAU/USD (Spot Gold)',
    bias: 'BULLISH',
    timeframe: '4-Hour / Daily',
    entryZone: '$2,642.00 – $2,648.00',
    target1: '$2,670.00',
    target2: '$2,695.00',
    stopLoss: '$2,632.00',
    riskReward: '1 : 2.8',
    catalyst: 'Liquidity sweep of prior weekly low with US 10-Year yield cooling.',
    updatedAt: 'Updated Today 07:30 UTC'
  },
  {
    id: 'eurusd',
    asset: 'EUR/USD (Euro)',
    bias: 'BEARISH',
    timeframe: '1-Hour / 4-Hour',
    entryZone: '1.0860 – 1.0875',
    target1: '1.0810',
    target2: '1.0760',
    stopLoss: '1.0910',
    riskReward: '1 : 2.5',
    catalyst: 'Resistance rejection at 200 EMA + ECB dovish policy guidance.',
    updatedAt: 'Updated Today 08:15 UTC'
  },
  {
    id: 'btcusdt',
    asset: 'BTC/USDT (Bitcoin)',
    bias: 'BULLISH',
    timeframe: 'Daily / Weekly',
    entryZone: '$67,400 – $68,200',
    target1: '$72,000',
    target2: '$75,500',
    stopLoss: '$65,800',
    riskReward: '1 : 3.2',
    catalyst: 'Institutional spot ETF inflows and clean higher-low structure reclaim.',
    updatedAt: 'Updated Today 06:45 UTC'
  },
  {
    id: 'us30',
    asset: 'US30 (Dow Jones)',
    bias: 'NEUTRAL',
    timeframe: 'Intraday 15M',
    entryZone: '42,150 – 42,280 (Range Fade)',
    target1: '42,480',
    target2: '42,650',
    stopLoss: '41,950',
    riskReward: '1 : 2.1',
    catalyst: 'Consolidation ahead of US CPI & corporate earnings volatility.',
    updatedAt: 'Updated Today 09:00 UTC'
  }
];

export const MarketSignalsWidget: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h3 className="text-xl font-bold text-white">
              Daily Technical Market Structure & Key Levels
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional swing invalidations, key support/resistance zones, and risk-to-reward frameworks.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Clock className="h-3.5 w-3.5 text-cyan-400" />
          <span>London / NY Session Coverage</span>
        </div>
      </div>

      {/* Signal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SIGNALS.map((sig) => {
          const isBull = sig.bias === 'BULLISH';
          const isBear = sig.bias === 'BEARISH';
          return (
            <div
              key={sig.id}
              className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 shadow-lg space-y-4 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <h4 className="font-bold text-white text-base">{sig.asset}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">{sig.timeframe}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-bold font-mono ${
                      isBull
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : isBear
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isBull ? <ArrowUpRight className="h-3.5 w-3.5" /> : isBear ? <ArrowDownRight className="h-3.5 w-3.5" /> : null}
                    {sig.bias}
                  </span>
                </div>
              </div>

              {/* Price Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded bg-slate-950/80 p-2 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block mb-0.5">Entry Zone</span>
                  <span className="font-mono text-cyan-300 font-bold">{sig.entryZone}</span>
                </div>
                <div className="rounded bg-slate-950/80 p-2 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block mb-0.5">Stop Loss</span>
                  <span className="font-mono text-rose-400 font-bold">{sig.stopLoss}</span>
                </div>
                <div className="rounded bg-slate-950/80 p-2 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block mb-0.5">Target 1</span>
                  <span className="font-mono text-emerald-400 font-bold">{sig.target1}</span>
                </div>
                <div className="rounded bg-slate-950/80 p-2 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block mb-0.5">Risk:Reward</span>
                  <span className="font-mono text-slate-200 font-bold">{sig.riskReward}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                <strong className="text-slate-400 block text-[11px] mb-0.5">Technical Rationale:</strong>
                {sig.catalyst}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
                <span className="font-mono">{sig.updatedAt}</span>
                <span className="text-cyan-400 font-mono">Invalidation at SL</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Signals Contextual In-Feed Ad Slot */}
      <AdPlaceholder
        page="signals"
        format="infeed"
        placement="article"
        slotLabel="Daily Signals Contextual In-Feed AdSlot"
      />

      {/* Regulatory Signals Disclaimer */}
      <div className="rounded-xl border border-amber-500/25 bg-amber-950/10 p-4 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 block mb-0.5">Mandatory Analytical Disclaimer:</strong>
          These levels reflect technical chart structure analysis for educational research and modeling purposes only. TradeVortex does not provide personalized trade signals or guaranteed forecasts. Past technical reactions do not guarantee future performance.
        </div>
      </div>
    </div>
  );
};
