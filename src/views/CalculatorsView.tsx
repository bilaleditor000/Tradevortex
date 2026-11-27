import React, { useState, useEffect } from 'react';
import { CalculatorTab, Language, AdminSettings } from '../types';
import { playClickSound } from '../utils/sound';
import { TRANSLATIONS } from '../utils/translations';
import { LOCAL_CURRENCIES, fetchLiveExchangeRates } from '../data/currencies';
import { getAdminSettings, ADMIN_EVENT_KEY, getCmsValue } from '../data/adminSettings';
import { FuturesPnLCalc } from '../components/calculators/FuturesPnLCalc';
import { LocalCurrencyPnLCalc } from '../components/calculators/LocalCurrencyPnLCalc';
import { ForexLotSizeCalc } from '../components/calculators/ForexLotSizeCalc';
import { PipValueCalc } from '../components/calculators/PipValueCalc';
import { FuturesLiquidationCalc } from '../components/calculators/FuturesLiquidationCalc';
import { CompoundDrawdownCalc } from '../components/calculators/CompoundDrawdownCalc';
import { GoldIndicesCalc } from '../components/calculators/GoldIndicesCalc';
import { MarginLeverageCalc } from '../components/calculators/MarginLeverageCalc';
import { StopLossTakeProfitCalc } from '../components/calculators/StopLossTakeProfitCalc';
import { BreakevenCalc } from '../components/calculators/BreakevenCalc';
import { DcaScalingCalc } from '../components/calculators/DcaScalingCalc';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { CustomBlocksRenderer } from '../components/CustomBlocksRenderer';
import { MediaPlacementsRenderer } from '../components/MediaPlacementsRenderer';
import {
  Calculator,
  Percent,
  TrendingUp,
  Coins,
  Scale,
  Flame,
  Globe,
  Gauge,
  Target,
  Activity,
  Layers,
  RefreshCw
} from 'lucide-react';

interface CalculatorsViewProps {
  language?: Language;
}

export const CalculatorsView: React.FC<CalculatorsViewProps> = ({ language = 'en' }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getAdminSettings());
  const [activeTab, setActiveTab] = useState<CalculatorTab>('futures-pnl');
  const [displayCurrency, setDisplayCurrency] = useState<string>('PKR');
  const [fxRates, setFxRates] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    LOCAL_CURRENCIES.forEach((c) => {
      map[c.code] = c.ratePerUSD;
    });
    return map;
  });
  const [isRefreshingFx, setIsRefreshingFx] = useState(false);

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setAdminSettings(getAdminSettings());
    };
    window.addEventListener(ADMIN_EVENT_KEY, handleSettingsUpdate);
    return () => window.removeEventListener(ADMIN_EVENT_KEY, handleSettingsUpdate);
  }, []);

  useEffect(() => {
    let active = true;
    fetchLiveExchangeRates().then((rates) => {
      if (active) setFxRates(rates);
    });
    return () => {
      active = false;
    };
  }, []);

  const refreshFx = async () => {
    setIsRefreshingFx(true);
    const rates = await fetchLiveExchangeRates();
    setFxRates(rates);
    setIsRefreshingFx(false);
  };

  const allTabs: {
    id: CalculatorTab;
    label: string;
    icon: React.ReactNode;
    desc: string;
    badge?: string;
  }[] = [
    {
      id: 'futures-pnl',
      label: 'Futures Profit/Loss',
      icon: <Scale className="h-4 w-4" />,
      desc: '1x-125x Leverage & Fee Deductions',
      badge: 'PRO'
    },
    {
      id: 'local-currency',
      label: 'Local Currency P&L',
      icon: <Globe className="h-4 w-4" />,
      desc: 'PKR, SAR, AED, MYR, INR, EUR & GBP',
      badge: 'GLOBAL'
    },
    {
      id: 'lot-size',
      label: 'Forex Lot Size & R:R',
      icon: <Calculator className="h-4 w-4" />,
      desc: 'Dynamic 1% Risk & Stop Loss Pips'
    },
    {
      id: 'pip-value',
      label: 'Pip Value Matrix',
      icon: <Percent className="h-4 w-4" />,
      desc: 'Multi-Currency Pip Value Per Lot'
    },
    {
      id: 'liquidation',
      label: 'Liquidation Price',
      icon: <Flame className="h-4 w-4" />,
      desc: 'Bankruptcy Threshold & Distance %',
      badge: 'CRYPTO'
    },
    {
      id: 'compound-drawdown',
      label: 'Compound & Drawdown',
      icon: <TrendingUp className="h-4 w-4" />,
      desc: 'Growth & Breakeven Recovery Math'
    },
    {
      id: 'gold-indices',
      label: 'Gold & Indices Sizer',
      icon: <Coins className="h-4 w-4" />,
      desc: 'Contracts for XAU/USD, US30 & NAS100'
    },
    {
      id: 'margin-leverage',
      label: 'Margin & Leverage',
      icon: <Gauge className="h-4 w-4" />,
      desc: 'Required Margin & Free Margin Level',
      badge: 'NEW'
    },
    {
      id: 'sl-tp',
      label: 'SL / TP Target & R:R',
      icon: <Target className="h-4 w-4" />,
      desc: 'Stop Loss, Take Profit & Ratio Planner',
      badge: 'NEW'
    },
    {
      id: 'breakeven',
      label: 'Win Rate & Expectancy',
      icon: <Activity className="h-4 w-4" />,
      desc: 'Breakeven Win % & Profit Expectancy',
      badge: 'NEW'
    },
    {
      id: 'dca',
      label: 'DCA Average Entry',
      icon: <Layers className="h-4 w-4" />,
      desc: 'Multi-Tranche Scaling Cost Basis',
      badge: 'NEW'
    }
  ];

  const disabledSet = new Set(adminSettings.disabledCalculators || []);
  const visibleTabs = allTabs.filter((tab) => !disabledSet.has(tab.id));

  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.some((tItem) => tItem.id === activeTab)) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [activeTab, visibleTabs]);

  const handleTabChange = (tab: CalculatorTab) => {
    playClickSound('toggle');
    setActiveTab(tab);
  };

  const currentFxRate = fxRates[displayCurrency] || 1;
  const activeCurrencyMeta =
    LOCAL_CURRENCIES.find((c) => c.code === displayCurrency) || LOCAL_CURRENCIES[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300 mb-3">
            <span>{visibleTabs.length} Institutional Calculators Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {getCmsValue(adminSettings, 'calcHubTitle', t.calcHubTitle)}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            {getCmsValue(adminSettings, 'calcHubSubtitle', t.calcHubSubtitle)}
          </p>
        </div>

        {/* Global Local Currency Toggle Bar */}
        <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-3.5 shadow-lg space-y-2 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-cyan-400 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              {t.localCurrencyLabel}
            </span>
            <button
              type="button"
              onClick={refreshFx}
              className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
              title="Refresh live exchange rates"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshingFx ? 'animate-spin' : ''}`} />
              <span>1 USD = {currentFxRate.toLocaleString()} {displayCurrency}</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {['USD', 'PKR', 'SAR', 'AED', 'MYR', 'INR', 'EUR', 'GBP', 'TRY'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  playClickSound('click');
                  setDisplayCurrency(code);
                }}
                className={`px-2 py-1 rounded text-[11px] font-mono font-bold border transition-colors ${
                  displayCurrency === code
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {code}
              </button>
            ))}
            <select
              value={displayCurrency}
              onChange={(e) => {
                playClickSound('click');
                setDisplayCurrency(e.target.value);
              }}
              className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
              aria-label="Select local currency"
            >
              {LOCAL_CURRENCIES.map((cur) => (
                <option key={cur.code} value={cur.code}>
                  {cur.flag} {cur.code} - {cur.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Showing dual outputs in USD + {activeCurrencyMeta.flag} {activeCurrencyMeta.name} ({activeCurrencyMeta.code})
          </div>
        </div>
      </div>

      {/* Mandatory Slot 1: Header Top Leaderboard Slot (728x90 / 320x50) */}
      <AdPlaceholder
        page="calculators"
        format="leaderboard"
        placement="header"
        slotLabel="Header Top Leaderboard Slot (728x90 / 320x50)"
      />

      {/* Calculator Tab Switcher Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`relative flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                isActive
                  ? 'border-cyan-500 bg-cyan-950/40 text-white shadow-lg shadow-cyan-500/20'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {tab.badge && (
                <span className="absolute top-2 right-2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 text-[9px] font-mono font-bold">
                  {tab.badge}
                </span>
              )}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg mb-2 ${
                  isActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.icon}
              </div>
              <span className={`text-xs font-bold leading-tight ${isActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                {tab.label}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                {tab.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mandatory Slot 2: Mid-Page High-CPM Ad Slot */}
      <AdPlaceholder
        page="calculators"
        format="leaderboard"
        placement="midpage"
        slotLabel="Mid-Page High-CPM Ad Slot (728x90)"
      />

      {/* Active Calculator Component Container */}
      <div className="pt-2">
        {activeTab === 'futures-pnl' && (
          <FuturesPnLCalc displayCurrency={displayCurrency} fxRate={currentFxRate} />
        )}
        {activeTab === 'local-currency' && (
          <LocalCurrencyPnLCalc />
        )}
        {activeTab === 'lot-size' && (
          <ForexLotSizeCalc displayCurrency={displayCurrency} fxRate={currentFxRate} />
        )}
        {activeTab === 'pip-value' && (
          <PipValueCalc displayCurrency={displayCurrency} fxRate={currentFxRate} />
        )}
        {activeTab === 'liquidation' && (
          <FuturesLiquidationCalc displayCurrency={displayCurrency} fxRate={currentFxRate} />
        )}
        {activeTab === 'compound-drawdown' && (
          <CompoundDrawdownCalc displayCurrency={displayCurrency} fxRate={currentFxRate} />
        )}
        {activeTab === 'gold-indices' && (
          <GoldIndicesCalc displayCurrency={displayCurrency} fxRate={currentFxRate} />
        )}
        {activeTab === 'margin-leverage' && (
          <MarginLeverageCalc displayCurrency={displayCurrency} fxRate={currentFxRate} />
        )}
        {activeTab === 'sl-tp' && (
          <StopLossTakeProfitCalc displayCurrency={displayCurrency} fxRate={currentFxRate} />
        )}
        {activeTab === 'breakeven' && (
          <BreakevenCalc displayCurrency={displayCurrency} fxRate={currentFxRate} />
        )}
        {activeTab === 'dca' && (
          <DcaScalingCalc displayCurrency={displayCurrency} fxRate={currentFxRate} />
        )}
      </div>

      <CustomBlocksRenderer page="calculators" />
      <MediaPlacementsRenderer page="calculators" />

      {/* Mandatory Slot 3: In-Article / Between Calculators Native Ad Slot */}
      <AdPlaceholder
        page="calculators"
        format="infeed"
        placement="article"
        slotLabel="In-Article / Between Calculators Native Ad Slot"
      />

      {/* Educational Explanations Section paired with Mandatory Slot 4: Sidebar Vertical Banner Ad Slot (300x600) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              Why Static Lot Sizes Fail
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Trading an identical volume on every setup (e.g. always 1.00 lot) is mathematically reckless. Because invalidation stops vary from 15 to 70 pips, fixed lot sizing causes wild variations in dollar loss. Dynamic sizing stabilizes risk.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              The 1% - 2% Golden Rule
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Restricting individual trade risk to 1%–2% ensures that even ten consecutive losses diminish your equity by less than 18%, leaving sufficient capital to capture high-probability asymmetric trend expansions.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              Local Currency Awareness & Margin Buffer
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Converting your risk and profit into PKR, SAR, AED, MYR, INR, or EUR before entering a trade ensures you never underestimate real financial exposure under high leverage. Always place your stop loss ahead of your calculated liquidation price.
            </p>
          </div>
        </div>

        {/* Slot 4: Sidebar Vertical Banner Ad Slot (300x600) */}
        <div className="lg:col-span-4 flex justify-center">
          <AdPlaceholder
            page="calculators"
            format="halfpage"
            placement="sidebar"
            slotLabel="Sidebar Vertical Banner Ad Slot (300x600)"
          />
        </div>
      </div>

      {/* Mandatory Slot 5: Pre-Footer / Content Bottom Banner Slot */}
      <AdPlaceholder
        page="calculators"
        format="leaderboard"
        placement="prefooter"
        slotLabel="Pre-Footer / Content Bottom Banner Slot (728x90)"
      />
    </div>
  );
};
