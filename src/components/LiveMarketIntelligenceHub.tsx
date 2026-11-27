import React, { useEffect, useState, useMemo } from 'react';
import { TradingViewCalendar } from './TradingViewCalendar';
import { playClickSound } from '../utils/sound';
import {
  Clock,
  Globe2,
  Calendar,
  Activity,
  Zap,
  Filter,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface LiveMarketIntelligenceHubProps {
  theme?: 'dark' | 'light';
}

interface SessionSpec {
  id: string;
  city: string;
  timezoneLabel: string;
  openUtcHour: number;
  closeUtcHour: number;
  pairsFocus: string;
}

const MARKET_SESSIONS: SessionSpec[] = [
  {
    id: 'sydney',
    city: 'Sydney',
    timezoneLabel: '21:00 – 06:00 UTC',
    openUtcHour: 21,
    closeUtcHour: 6,
    pairsFocus: 'AUD / NZD'
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    timezoneLabel: '00:00 – 09:00 UTC',
    openUtcHour: 0,
    closeUtcHour: 9,
    pairsFocus: 'JPY / Gold Asia'
  },
  {
    id: 'london',
    city: 'London',
    timezoneLabel: '08:00 – 17:00 UTC',
    openUtcHour: 8,
    closeUtcHour: 17,
    pairsFocus: 'EUR / GBP / XAU'
  },
  {
    id: 'newyork',
    city: 'New York',
    timezoneLabel: '13:00 – 22:00 UTC',
    openUtcHour: 13,
    closeUtcHour: 22,
    pairsFocus: 'USD / US30 / BTC'
  }
];

interface MacroEventItem {
  id: string;
  timeUtc: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  impact: 'HIGH' | 'MEDIUM';
  title: string;
  forecast: string;
  previous: string;
  category: 'CPI' | 'NFP' | 'FOMC' | 'RATES' | 'GDP';
}

const HIGH_IMPACT_MACRO_EVENTS: MacroEventItem[] = [
  {
    id: 'ev-cpi',
    timeUtc: '13:30 UTC',
    currency: 'USD',
    impact: 'HIGH',
    title: 'US Core CPI (MoM & YoY Inflation Print)',
    forecast: '3.1%',
    previous: '3.2%',
    category: 'CPI'
  },
  {
    id: 'ev-nfp',
    timeUtc: '13:30 UTC',
    currency: 'USD',
    impact: 'HIGH',
    title: 'US Non-Farm Payrolls (NFP) & Unemployment Rate',
    forecast: '185K',
    previous: '176K',
    category: 'NFP'
  },
  {
    id: 'ev-fomc',
    timeUtc: '19:00 UTC',
    currency: 'USD',
    impact: 'HIGH',
    title: 'FOMC Federal Funds Rate Decision & Statement',
    forecast: '4.50%',
    previous: '4.50%',
    category: 'FOMC'
  },
  {
    id: 'ev-ecb',
    timeUtc: '13:15 UTC',
    currency: 'EUR',
    impact: 'HIGH',
    title: 'ECB Main Refinancing Interest Rate Decision',
    forecast: '2.90%',
    previous: '3.00%',
    category: 'RATES'
  },
  {
    id: 'ev-boe',
    timeUtc: '12:00 UTC',
    currency: 'GBP',
    impact: 'HIGH',
    title: 'Bank of England (BoE) MPC Rate & Vote Split',
    forecast: '4.50%',
    previous: '4.50%',
    category: 'RATES'
  },
  {
    id: 'ev-boj',
    timeUtc: '03:00 UTC',
    currency: 'JPY',
    impact: 'HIGH',
    title: 'BoJ Monetary Policy Statement & Core CPI Outlook',
    forecast: '0.50%',
    previous: '0.50%',
    category: 'RATES'
  },
  {
    id: 'ev-gdp',
    timeUtc: '13:30 UTC',
    currency: 'USD',
    impact: 'MEDIUM',
    title: 'US Advance GDP (QoQ) & Core PCE Deflator',
    forecast: '2.4%',
    previous: '2.3%',
    category: 'GDP'
  }
];

interface StrengthAsset {
  code: string;
  label: string;
  score: number; // 0 to 100
  changePct: number;
}

const BASELINE_STRENGTH: Record<'1H' | '4H' | '24H', StrengthAsset[]> = {
  '1H': [
    { code: 'XAU', label: 'Gold (XAU)', score: 78, changePct: 0.64 },
    { code: 'USD', label: 'US Dollar', score: 68, changePct: 0.28 },
    { code: 'BTC', label: 'Bitcoin (BTC)', score: 72, changePct: 1.42 },
    { code: 'EUR', label: 'Euro (EUR)', score: 54, changePct: -0.14 },
    { code: 'GBP', label: 'British Pound', score: 49, changePct: -0.22 },
    { code: 'JPY', label: 'Japanese Yen', score: 34, changePct: -0.41 }
  ],
  '4H': [
    { code: 'BTC', label: 'Bitcoin (BTC)', score: 82, changePct: 2.35 },
    { code: 'XAU', label: 'Gold (XAU)', score: 74, changePct: 0.91 },
    { code: 'USD', label: 'US Dollar', score: 63, changePct: 0.19 },
    { code: 'GBP', label: 'British Pound', score: 56, changePct: 0.08 },
    { code: 'EUR', label: 'Euro (EUR)', score: 47, changePct: -0.18 },
    { code: 'JPY', label: 'Japanese Yen', score: 31, changePct: -0.58 }
  ],
  '24H': [
    { code: 'XAU', label: 'Gold (XAU)', score: 81, changePct: 1.18 },
    { code: 'BTC', label: 'Bitcoin (BTC)', score: 79, changePct: 3.12 },
    { code: 'USD', label: 'US Dollar', score: 64, changePct: 0.34 },
    { code: 'EUR', label: 'Euro (EUR)', score: 52, changePct: -0.11 },
    { code: 'GBP', label: 'British Pound', score: 48, changePct: -0.25 },
    { code: 'JPY', label: 'Japanese Yen', score: 29, changePct: -0.74 }
  ]
};

function isSessionOpen(utcDecimalHour: number, openHour: number, closeHour: number): boolean {
  if (openHour < closeHour) {
    return utcDecimalHour >= openHour && utcDecimalHour < closeHour;
  }
  return utcDecimalHour >= openHour || utcDecimalHour < closeHour;
}

function getSessionProgressPct(utcDecimalHour: number, openHour: number, closeHour: number): number {
  if (!isSessionOpen(utcDecimalHour, openHour, closeHour)) return 0;
  const duration = openHour < closeHour ? closeHour - openHour : 24 - openHour + closeHour;
  const elapsed =
    openHour < closeHour
      ? utcDecimalHour - openHour
      : utcDecimalHour >= openHour
      ? utcDecimalHour - openHour
      : 24 - openHour + utcDecimalHour;
  return Math.min(100, Math.max(4, Math.round((elapsed / duration) * 100)));
}

export const LiveMarketIntelligenceHub: React.FC<LiveMarketIntelligenceHubProps> = ({
  theme = 'dark'
}) => {
  const [now, setNow] = useState<Date>(() => new Date());
  const [activeTab, setActiveTab] = useState<'sessions' | 'calendar' | 'strength'>('sessions');
  const [impactFilter, setImpactFilter] = useState<'ALL' | 'HIGH'>('HIGH');
  const [currencyFilter, setCurrencyFilter] = useState<'ALL' | 'USD' | 'EUR' | 'GBP' | 'JPY'>('ALL');
  const [showFullTvCalendar, setShowFullTvCalendar] = useState(false);
  const [strengthTf, setStrengthTf] = useState<'1H' | '4H' | '24H'>('4H');
  const [liveOverrides, setLiveOverrides] = useState<{ btcPct?: number; xauPct?: number }>({});

  // Real-time 1s clock tick
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Live lightweight 24h momentum feed for BTC and Gold (PAXG proxy) from public Binance ticker API
  useEffect(() => {
    let active = true;
    const fetchLiveTickerBias = async () => {
      try {
        const res = await fetch(
          'https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","PAXGUSDT"]'
        );
        if (!res.ok) return;
        const data = (await res.json()) as { symbol: string; priceChangePercent: string }[];
        if (!active || !Array.isArray(data)) return;
        const btc = data.find((d) => d.symbol === 'BTCUSDT');
        const xau = data.find((d) => d.symbol === 'PAXGUSDT');
        setLiveOverrides({
          btcPct: btc ? parseFloat(btc.priceChangePercent) : undefined,
          xauPct: xau ? parseFloat(xau.priceChangePercent) : undefined
        });
      } catch {
        // Fallback gracefully to institutional baseline
      }
    };
    fetchLiveTickerBias();
    const poll = window.setInterval(fetchLiveTickerBias, 60000);
    return () => {
      active = false;
      window.clearInterval(poll);
    };
  }, []);

  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcDecimal = utcHours + utcMinutes / 60;
  const isLondonNyOverlap = utcHours >= 13 && utcHours < 17;

  const utcTimeStr = now.toISOString().slice(11, 19);
  const localTimeStr = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const filteredEvents = useMemo(() => {
    return HIGH_IMPACT_MACRO_EVENTS.filter((ev) => {
      const matchImpact = impactFilter === 'ALL' || ev.impact === 'HIGH';
      const matchCurrency = currencyFilter === 'ALL' || ev.currency === currencyFilter;
      return matchImpact && matchCurrency;
    });
  }, [impactFilter, currencyFilter]);

  const strengthRows = useMemo(() => {
    const base = BASELINE_STRENGTH[strengthTf].map((item) => {
      if (item.code === 'BTC' && typeof liveOverrides.btcPct === 'number' && !Number.isNaN(liveOverrides.btcPct)) {
        const clampedScore = Math.min(95, Math.max(15, Math.round(55 + liveOverrides.btcPct * 5)));
        return { ...item, score: clampedScore, changePct: Number(liveOverrides.btcPct.toFixed(2)) };
      }
      if (item.code === 'XAU' && typeof liveOverrides.xauPct === 'number' && !Number.isNaN(liveOverrides.xauPct)) {
        const clampedScore = Math.min(95, Math.max(15, Math.round(58 + liveOverrides.xauPct * 8)));
        return { ...item, score: clampedScore, changePct: Number(liveOverrides.xauPct.toFixed(2)) };
      }
      return item;
    });
    return [...base].sort((a, b) => b.score - a.score);
  }, [strengthTf, liveOverrides]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-cyan-500/25 bg-slate-900/75 p-5 sm:p-6 shadow-xl space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-0.5 text-[11px] font-mono text-cyan-300 mb-2">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span>PRO TRADER DAILY TERMINAL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Globe2 className="h-6 w-6 text-cyan-400 shrink-0" />
              <span>Live Market Intelligence Hub</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Real-time global liquidity sessions, high-impact macro catalyst filter, and relative currency &amp; commodity strength meter.
            </p>
          </div>

          {/* Real-time UTC / Local Clock + Overlap Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="rounded-xl border border-slate-800 bg-slate-950/90 px-3.5 py-2 text-xs font-mono">
              <div className="text-[10px] text-slate-400 uppercase">UTC Terminal Clock</div>
              <div className="font-bold text-cyan-300 text-sm">{utcTimeStr} UTC</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/90 px-3.5 py-2 text-xs font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Local Time</div>
              <div className="font-bold text-white text-sm">{localTimeStr}</div>
            </div>
            <div
              className={`rounded-xl border px-3.5 py-2 text-xs font-mono ${
                isLondonNyOverlap
                  ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                  : 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300'
              }`}
            >
              <div className="text-[10px] uppercase opacity-80">Peak Volatility Window</div>
              <div className="font-bold text-xs">
                {isLondonNyOverlap ? 'LONDON + NY OVERLAP ACTIVE' : 'London/NY Overlap: 13:00–17:00 UTC'}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              setActiveTab('sessions');
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === 'sessions'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'border border-slate-800 bg-slate-950/70 text-slate-300 hover:text-white'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Global Sessions Clock</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              setActiveTab('calendar');
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === 'calendar'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'border border-slate-800 bg-slate-950/70 text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>High-Impact Economic Calendar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              setActiveTab('strength');
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === 'strength'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'border border-slate-800 bg-slate-950/70 text-slate-300 hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Currency &amp; Asset Strength Meter</span>
          </button>
        </div>

        {/* PANEL 1: GLOBAL MARKET SESSIONS CLOCK */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MARKET_SESSIONS.map((session) => {
                const open = isSessionOpen(utcDecimal, session.openUtcHour, session.closeUtcHour);
                const pct = getSessionProgressPct(utcDecimal, session.openUtcHour, session.closeUtcHour);
                const isOverlapMember =
                  isLondonNyOverlap && (session.id === 'london' || session.id === 'newyork');

                return (
                  <div
                    key={session.id}
                    className={`rounded-xl border p-4 space-y-3 transition-all ${
                      open
                        ? isOverlapMember
                          ? 'border-emerald-500/50 bg-emerald-950/15'
                          : 'border-cyan-500/40 bg-slate-950/80'
                        : 'border-slate-800 bg-slate-950/50 opacity-85'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white">{session.city}</h3>
                        <span className="text-[11px] font-mono text-slate-400">
                          {session.timezoneLabel}
                        </span>
                      </div>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                          open
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {open ? 'OPEN' : 'CLOSED'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Focus: {session.pairsFocus}</span>
                        <span>{open ? `${pct}% Elapsed` : 'Standby'}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            open ? 'bg-gradient-to-r from-cyan-500 to-emerald-400' : 'bg-slate-700'
                          }`}
                          style={{ width: `${open ? pct : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Session Overlap Highlight Strip */}
            <div className="rounded-xl border border-cyan-500/25 bg-slate-950/80 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <span
                  className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                    isLondonNyOverlap ? 'bg-emerald-400' : 'bg-cyan-400'
                  }`}
                />
                <span>
                  <strong className="text-white">London + New York Overlap (13:00 – 17:00 UTC):</strong>{' '}
                  Highest institutional liquidity, tightest ECN spreads (0.0 pips), and peak intraday volume on EUR/USD, GBP/USD, XAU/USD, and US30.
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold text-cyan-300 whitespace-nowrap">
                {isLondonNyOverlap ? 'LIVE NOW' : 'DAILY 13:00–17:00 UTC'}
              </span>
            </div>
          </div>
        )}

        {/* PANEL 2: HIGH-IMPACT ECONOMIC CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 mr-1">
                  <Filter className="h-3.5 w-3.5 text-cyan-400" />
                  Impact:
                </span>
                {(['HIGH', 'ALL'] as const).map((imp) => (
                  <button
                    key={imp}
                    type="button"
                    onClick={() => {
                      playClickSound('click');
                      setImpactFilter(imp);
                    }}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-mono font-bold ${
                      impactFilter === imp
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {imp === 'HIGH' ? 'High-Impact Only' : 'All Catalysts'}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(['ALL', 'USD', 'EUR', 'GBP', 'JPY'] as const).map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => {
                      playClickSound('click');
                      setCurrencyFilter(cur);
                    }}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-mono font-bold ${
                      currencyFilter === cur
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-2.5">Release Window</th>
                    <th className="px-4 py-2.5">Currency</th>
                    <th className="px-4 py-2.5">Impact</th>
                    <th className="px-4 py-2.5">Macro Catalyst</th>
                    <th className="px-4 py-2.5 text-right">Consensus</th>
                    <th className="px-4 py-2.5 text-right">Previous</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredEvents.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-cyan-300 whitespace-nowrap">
                        {ev.timeUtc}
                      </td>
                      <td className="px-4 py-2.5 font-mono font-bold text-white">{ev.currency}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold ${
                            ev.impact === 'HIGH'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {ev.impact}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-medium text-slate-200">{ev.title}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-emerald-300 font-bold">
                        {ev.forecast}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-400">
                        {ev.previous}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  playClickSound('click');
                  setShowFullTvCalendar((prev) => !prev);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/30 px-3.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
              >
                <span>{showFullTvCalendar ? 'Hide Live TradingView Feed' : 'Load Live TradingView Macro Feed'}</span>
                {showFullTvCalendar ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>

            {showFullTvCalendar && <TradingViewCalendar theme={theme} height={460} />}
          </div>
        )}

        {/* PANEL 3: LIVE CURRENCY & ASSET STRENGTH METER */}
        {activeTab === 'strength' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-300">
                Relative strength index across major fiat benchmarks, Gold (XAU), and Bitcoin (BTC) to spot strong-vs-weak institutional pairs.
              </p>
              <div className="flex items-center gap-1.5">
                {(['1H', '4H', '24H'] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => {
                      playClickSound('click');
                      setStrengthTf(tf);
                    }}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-mono font-bold ${
                      strengthTf === tf
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {strengthRows.map((asset) => {
                const isBullish = asset.score >= 60;
                const isBearish = asset.score <= 42;
                return (
                  <div
                    key={asset.code}
                    className="rounded-xl border border-slate-800 bg-slate-950/75 p-3.5 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono font-bold text-cyan-300">
                          {asset.code}
                        </span>
                        <span className="font-bold text-white">{asset.label}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span
                          className={`inline-flex items-center gap-0.5 font-bold ${
                            asset.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {asset.changePct >= 0 ? (
                            <TrendingUp className="h-3.5 w-3.5" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5" />
                          )}
                          {asset.changePct >= 0 ? '+' : ''}
                          {asset.changePct}%
                        </span>
                        <span className="text-slate-300 font-bold">{asset.score}/100</span>
                      </div>
                    </div>

                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isBullish
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                            : isBearish
                            ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                            : 'bg-gradient-to-r from-sky-500 to-cyan-400'
                        }`}
                        style={{ width: `${asset.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
