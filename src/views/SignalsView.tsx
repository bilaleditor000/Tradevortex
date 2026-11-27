import React from 'react';
import { MarketSignalsWidget } from '../components/MarketSignalsWidget';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { CustomBlocksRenderer } from '../components/CustomBlocksRenderer';
import { MediaPlacementsRenderer } from '../components/MediaPlacementsRenderer';
import { Zap, ShieldCheck, Scale, Compass, CheckCircle2 } from 'lucide-react';
import { playClickSound } from '../utils/sound';
import { PageView } from '../types';

interface SignalsViewProps {
  onNavigate?: (page: PageView) => void;
}

export const SignalsView: React.FC<SignalsViewProps> = ({ onNavigate }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono text-cyan-300 mb-3">
          <Zap className="h-3.5 w-3.5 text-cyan-400" />
          <span>DAILY INSTITUTIONAL TECHNICAL BIAS & ORDER FLOW</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Live Market Signals & Key Invalidation Levels
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
          Actionable institutional technical analysis across Gold (XAU/USD), EUR/USD, Bitcoin, and US30 index updated daily with explicit entry zones, stop losses, and multi-tier profit targets.
        </p>
      </div>

      <CustomBlocksRenderer page="signals" />
      <MediaPlacementsRenderer page="signals" />

      {/* Mandatory Slot 1: Header Top Leaderboard Slot (728x90 / 320x50) */}
      <AdPlaceholder
        page="signals"
        format="leaderboard"
        placement="header"
        slotLabel="Header Top Leaderboard Slot (728x90 / 320x50)"
      />

      {/* Mandatory Slot 2: Mid-Page High-CPM Ad Slot (728x90) */}
      <AdPlaceholder
        page="signals"
        format="leaderboard"
        placement="midpage"
        slotLabel="Mid-Page High-CPM Ad Slot (728x90)"
      />

      {/* Main Signals Cards Widget (contains Slot 3 In-Article Native) */}
      <MarketSignalsWidget />

      {/* Analytical Methodology & Mandatory Slot 4: Sidebar Vertical Banner Ad Slot (300x600) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="h-4 w-4 text-cyan-400" />
              Institutional Market Structure Principles
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every signal model on TradeVortex isolates high-liquidity sweep points, Fair Value Gaps (FVGs), and institutional order blocks. Rather than chasing breakout impulses, entries target discounted retracement zones with mathematically asymmetric risk-to-reward ratios (minimum 1:2.0).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800/80">
                <span className="font-mono text-cyan-300 text-xs font-bold block mb-1">
                  1. Strict Invalidation Rule
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  If price breaches the defined stop loss level on a 4-hour candle close, the setup is immediately discarded. Never widen a stop loss.
                </p>
              </div>
              <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800/80">
                <span className="font-mono text-cyan-300 text-xs font-bold block mb-1">
                  2. Partial Profit Taking
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Scale out 50% of position size at Target 1 and shift stop loss to breakeven, converting the setup into a risk-free free-roll.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="h-4 w-4 text-cyan-400" />
              Calculate Your Exact Lot Size Before Executing
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never enter a trade with arbitrary contract sizes. Always calculate your position based on a fixed 1%–2% account risk limit using our institutional calculator.
            </p>
            {onNavigate && (
              <button
                type="button"
                onClick={() => {
                  playClickSound('calculate');
                  onNavigate('calculators');
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 mt-2"
              >
                <span>Launch Forex Lot Size Calculator</span>
              </button>
            )}
          </div>
        </div>

        {/* Mandatory Slot 4: Sidebar Vertical Banner Ad Slot (300x600) */}
        <div className="lg:col-span-4 flex justify-center">
          <AdPlaceholder
            page="signals"
            format="halfpage"
            placement="sidebar"
            slotLabel="Sidebar Vertical Banner Ad Slot (300x600)"
          />
        </div>
      </div>

      {/* Mandatory Slot 5: Pre-Footer / Content Bottom Banner Slot (728x90) */}
      <AdPlaceholder
        page="signals"
        format="leaderboard"
        placement="prefooter"
        slotLabel="Pre-Footer / Content Bottom Banner Slot (728x90)"
      />
    </div>
  );
};
