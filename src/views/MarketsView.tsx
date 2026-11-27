import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { TOP_10_FEATURED_ASSETS } from '../data/assetsCatalog';
import { TradingViewChart } from '../components/TradingViewChart';
import { TradingViewCalendar } from '../components/TradingViewCalendar';
import { TradingViewTechnicalGauge } from '../components/TradingViewTechnicalGauge';
import { LiveMarketIntelligenceHub } from '../components/LiveMarketIntelligenceHub';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { CustomBlocksRenderer } from '../components/CustomBlocksRenderer';
import { MediaPlacementsRenderer } from '../components/MediaPlacementsRenderer';
import { playClickSound } from '../utils/sound';
import { LineChart, Calendar, Gauge } from 'lucide-react';

interface MarketsViewProps {
  theme: 'dark' | 'light';
  language?: Language;
}

export const MarketsView: React.FC<MarketsViewProps> = ({ theme, language = 'en' }) => {
  const [activeGaugeSymbol, setActiveGaugeSymbol] = useState('OANDA:XAUUSD');
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300 mb-3">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span>Live Market Feeds &amp; Universal Coin Search</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t.marketsTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
          {t.marketsSubtitle}
        </p>
      </div>

      <CustomBlocksRenderer page="markets" />
      <MediaPlacementsRenderer page="markets" />

      {/* Pro Trader Daily Terminal: Sessions Clock, Macro Catalyst Filter & Strength Meter */}
      <LiveMarketIntelligenceHub theme={theme} />

      {/* Main TradingView Chart */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <LineChart className="h-5 w-5 text-cyan-400" />
            Interactive All-Assets TradingView Chart
          </h2>
          <span className="text-xs text-slate-400 font-mono">Powered by TradingView tv.js</span>
        </div>
        <TradingViewChart
          theme={theme}
          defaultSymbol="OANDA:XAUUSD"
          searchPlaceholder={t.searchAnyCoin}
        />
      </div>

      {/* AdSense In-Content Placement */}
      <AdPlaceholder
        page="markets"
        format="leaderboard"
        placement="header"
        slotLabel="Live Terminal Market Leaderboard (728x90)"
      />

      {/* Economic Calendar & Technical Gauge Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-cyan-400" />
            Live Global Economic Calendar
          </h2>
          <p className="text-xs text-slate-400">
            Real-time feed of interest rate announcements, CPI inflation prints, and labor reports with historical and forecast values.
          </p>
          <TradingViewCalendar theme={theme} height={520} />
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Gauge className="h-5 w-5 text-cyan-400" />
              {t.techSentimentTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Search any cryptocurrency, forex pair, gold, or index below to inspect composite Buy / Sell moving average consensus.
          </p>

          {/* Top 10 Featured Quick Symbol Buttons for Gauge */}
          <div className="flex flex-wrap gap-1.5 py-1">
            {TOP_10_FEATURED_ASSETS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  playClickSound('click');
                  setActiveGaugeSymbol(s.symbol);
                }}
                className={`text-xs px-2.5 py-1 rounded font-mono transition-colors ${
                  activeGaugeSymbol === s.symbol
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.ticker}
              </button>
            ))}
          </div>

          <TradingViewTechnicalGauge
            symbol={activeGaugeSymbol}
            onSymbolChange={setActiveGaugeSymbol}
            theme={theme}
            height={420}
            allowSearch={true}
          />
        </div>
      </div>
    </div>
  );
};
