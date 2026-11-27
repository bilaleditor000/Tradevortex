import React, { useState, useEffect } from 'react';
import {
  LOCAL_CURRENCIES,
  fetchLiveExchangeRates,
  formatCurrencyAmount
} from '../../data/currencies';
import { NumericField } from './NumericField';
import { playClickSound } from '../../utils/sound';
import { AdInterstitialModal } from '../AdInterstitialModal';
import { Globe, RotateCcw, Copy, Check, TrendingUp, TrendingDown, Sparkles, RefreshCw } from 'lucide-react';

interface LocalCurrencyPnLCalcProps {
  defaultCurrency?: string;
}

export const LocalCurrencyPnLCalc: React.FC<LocalCurrencyPnLCalcProps> = ({
  defaultCurrency = 'PKR'
}) => {
  const [currencyCode, setCurrencyCode] = useState<string>(defaultCurrency);
  const [rates, setRates] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    LOCAL_CURRENCIES.forEach((c) => {
      map[c.code] = c.ratePerUSD;
    });
    return map;
  });
  const [customRate, setCustomRate] = useState<number>(
    LOCAL_CURRENCIES.find((c) => c.code === defaultCurrency)?.ratePerUSD || 278.5
  );
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [localInvestment, setLocalInvestment] = useState<number>(100000);
  const [leverage, setLeverage] = useState<number>(10);
  const [entryPrice, setEntryPrice] = useState<number>(2650);
  const [exitPrice, setExitPrice] = useState<number>(2740);
  const [feePercent, setFeePercent] = useState<number>(0.05);
  const [isRefreshingFx, setIsRefreshingFx] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAdOpen, setIsAdOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fetchLiveExchangeRates().then((r) => {
      if (!active) return;
      setRates(r);
      if (r[currencyCode]) {
        setCustomRate(Number(r[currencyCode].toFixed(4)));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleCurrencyChange = (nextCode: string) => {
    playClickSound('click');
    setCurrencyCode(nextCode);
    const rate = rates[nextCode] || LOCAL_CURRENCIES.find((c) => c.code === nextCode)?.ratePerUSD || 1;
    setCustomRate(Number(rate.toFixed(4)));
  };

  const handleRefreshRates = async () => {
    playClickSound('toggle');
    setIsRefreshingFx(true);
    const fresh = await fetchLiveExchangeRates();
    setRates(fresh);
    if (fresh[currencyCode]) {
      setCustomRate(Number(fresh[currencyCode].toFixed(4)));
    }
    setIsRefreshingFx(false);
  };

  const selectedCurrencyObj =
    LOCAL_CURRENCIES.find((c) => c.code === currencyCode) || LOCAL_CURRENCIES[1];

  const effectiveRate = customRate > 0 ? customRate : 1;
  const usdMargin = localInvestment / effectiveRate;
  const notionalUSD = usdMargin * leverage;
  const units = entryPrice > 0 ? notionalUSD / entryPrice : 0;

  const priceDelta = direction === 'LONG' ? exitPrice - entryPrice : entryPrice - exitPrice;
  const grossPnLUSD = entryPrice > 0 ? (priceDelta / entryPrice) * notionalUSD : 0;
  const totalFeesUSD = (notionalUSD * feePercent * 2) / 100;
  const netPnLUSD = grossPnLUSD - totalFeesUSD;
  const netPnLLocal = netPnLUSD * effectiveRate;
  const finalBalanceLocal = localInvestment + netPnLLocal;
  const roePercent = usdMargin > 0 ? (netPnLUSD / usdMargin) * 100 : 0;

  const isProfitable = netPnLUSD >= 0;

  const handleCopy = () => {
    playClickSound('click');
    navigator.clipboard.writeText(
      `Local Currency P&L (${currencyCode}): Capital ${formatCurrencyAmount(
        localInvestment,
        currencyCode
      )} | Net P&L: ${formatCurrencyAmount(netPnLLocal, currencyCode)} ($${netPnLUSD.toFixed(
        2
      )} USD) | ROE: ${roePercent.toFixed(2)}%`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    playClickSound('toggle');
    setDirection('LONG');
    setLocalInvestment(100000);
    setLeverage(10);
    setEntryPrice(2650);
    setExitPrice(2740);
    setFeePercent(0.05);
  };

  return (
    <div className="rounded-xl border border-cyan-500/25 bg-slate-900/80 p-5 md:p-7 shadow-xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-cyan-400" />
            Global Local Currency Profit & Loss Calculator ({currencyCode})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Calculate exact trading profits, losses, and fees directly in PKR, SAR, AED, MYR, INR, EUR, GBP, TRY & 22+ world currencies alongside USD.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefreshRates}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-950/50 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshingFx ? 'animate-spin' : ''}`} />
            <span>Sync Live FX</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Select Your Local Currency
              </label>
              <select
                value={currencyCode}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                {LOCAL_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} — {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Exchange Rate (1 USD = ? {currencyCode})
              </label>
              <NumericField
                value={customRate}
                onChangeValue={setCustomRate}
                min={0.01}
                fallbackOnEmpty={1}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-300">Trade Side:</label>
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => {
                  playClickSound('click');
                  setDirection('LONG');
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded transition-colors ${
                  direction === 'LONG'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                <span>LONG (Buy)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound('click');
                  setDirection('SHORT');
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded transition-colors ${
                  direction === 'SHORT'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingDown className="h-3.5 w-3.5" />
                <span>SHORT (Sell)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Invested Margin in {currencyCode} ({selectedCurrencyObj.symbol})
              </label>
              <NumericField
                value={localInvestment}
                onChangeValue={setLocalInvestment}
                min={0}
              />
              <span className="text-[11px] text-cyan-400 font-mono mt-1 block">
                Equivalent Margin: ${usdMargin.toFixed(2)} USD
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                <span>Leverage:</span>
                <span className="font-mono text-cyan-400 font-bold">{leverage}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="125"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value, 10) || 1)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>1x Spot</span>
                <span>10x</span>
                <span>25x</span>
                <span>50x</span>
                <span>125x</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Entry Price ($)
              </label>
              <NumericField value={entryPrice} onChangeValue={setEntryPrice} min={0} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Exit / Target Price ($)
              </label>
              <NumericField value={exitPrice} onChangeValue={setExitPrice} min={0} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Fee Rate (% / side)
              </label>
              <NumericField value={feePercent} onChangeValue={setFeePercent} min={0} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound('calculate');
              setIsAdOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-3 text-xs font-extrabold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-md shadow-cyan-500/25 uppercase tracking-wide"
          >
            <Sparkles className="h-4 w-4" />
            <span>Calculate Local Currency P&L & Unlock Report</span>
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-5 shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">
                {currencyCode} & USD Output
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div
              className={`mb-4 rounded-lg border p-4 text-center ${
                isProfitable
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-rose-500/40 bg-rose-950/20'
              }`}
            >
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Net Profit / Loss in {selectedCurrencyObj.name}
              </span>
              <div
                className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${
                  isProfitable ? 'text-emerald-300' : 'text-rose-400'
                }`}
              >
                {netPnLLocal >= 0 ? '+' : ''}
                {formatCurrencyAmount(netPnLLocal, currencyCode)}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-xs font-mono font-bold">
                <span className="text-cyan-300">
                  ({netPnLUSD >= 0 ? '+' : ''}${netPnLUSD.toFixed(2)} USD)
                </span>
                <span className="text-slate-500">|</span>
                <span className={roePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {roePercent >= 0 ? '+' : ''}
                  {roePercent.toFixed(2)}% ROE
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Ending Balance ({currencyCode}):</span>
                <span className="font-mono font-bold text-white">
                  {formatCurrencyAmount(finalBalanceLocal, currencyCode)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Position Value (USD):</span>
                <span className="font-mono font-semibold text-slate-200">
                  ${notionalUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })} ({units.toFixed(4)} units)
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Trading Fees ({currencyCode}):</span>
                <span className="font-mono font-semibold text-rose-300">
                  -{formatCurrencyAmount(totalFeesUSD * effectiveRate, currencyCode)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">FX Conversion Rate:</span>
                <span className="font-mono font-semibold text-cyan-300">
                  1 USD = {effectiveRate} {currencyCode}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            Exchange rates automatically convert your local currency capital into USD position notional and return net profit in both {currencyCode} and USD.
          </div>
        </div>
      </div>

      <AdInterstitialModal isOpen={isAdOpen} onComplete={() => setIsAdOpen(false)} />
    </div>
  );
};
