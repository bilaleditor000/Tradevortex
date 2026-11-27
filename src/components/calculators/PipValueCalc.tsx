import React, { useState } from 'react';
import { playClickSound } from '../../utils/sound';
import { RotateCcw, Copy, Check, Sparkles } from 'lucide-react';
import { AdInterstitialModal } from '../AdInterstitialModal';
import { NumericField, CalculatorCurrencyProps, formatDualCurrency } from './NumericField';

const PAIR_RATES: Record<string, { pipMultiplier: number; standardLotPipUSD: number }> = {
  'EUR/USD': { pipMultiplier: 0.0001, standardLotPipUSD: 10.0 },
  'GBP/USD': { pipMultiplier: 0.0001, standardLotPipUSD: 10.0 },
  'AUD/USD': { pipMultiplier: 0.0001, standardLotPipUSD: 10.0 },
  'NZD/USD': { pipMultiplier: 0.0001, standardLotPipUSD: 10.0 },
  'USD/JPY': { pipMultiplier: 0.01, standardLotPipUSD: 6.67 },
  'USD/CAD': { pipMultiplier: 0.0001, standardLotPipUSD: 7.42 },
  'USD/CHF': { pipMultiplier: 0.0001, standardLotPipUSD: 11.2 },
  'EUR/GBP': { pipMultiplier: 0.0001, standardLotPipUSD: 12.85 },
  'GBP/JPY': { pipMultiplier: 0.01, standardLotPipUSD: 6.67 },
  'EUR/JPY': { pipMultiplier: 0.01, standardLotPipUSD: 6.67 }
};

export const PipValueCalc: React.FC<CalculatorCurrencyProps> = ({
  displayCurrency = 'USD',
  fxRate = 1
}) => {
  const [selectedPair, setSelectedPair] = useState<string>('EUR/USD');
  const [lots, setLots] = useState<number>(1.0);
  const [accountCurrency, setAccountCurrency] = useState('USD');
  const [copied, setCopied] = useState(false);
  const [isAdOpen, setIsAdOpen] = useState(false);

  const pairConfig = PAIR_RATES[selectedPair] || PAIR_RATES['EUR/USD'];
  const pipValuePerPip = lots * pairConfig.standardLotPipUSD;
  const dualPip = formatDualCurrency(pipValuePerPip, displayCurrency, fxRate);

  const handleCopy = () => {
    playClickSound('click');
    navigator.clipboard.writeText(
      `Pip Value (${selectedPair}, ${lots} Lots): $${pipValuePerPip.toFixed(2)}${dualPip ? ` (${dualPip})` : ''} / pip`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    playClickSound('toggle');
    setSelectedPair('EUR/USD');
    setLots(1.0);
    setAccountCurrency('USD');
  };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-7 shadow-xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            Pip Value Calculator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Determine the exact monetary value of every single pip movement based on your position volume.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Currency Pair
              </label>
              <select
                value={selectedPair}
                onChange={(e) => {
                  playClickSound('click');
                  setSelectedPair(e.target.value);
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
              >
                {Object.keys(PAIR_RATES).map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Account Currency
              </label>
              <select
                value={accountCurrency}
                onChange={(e) => {
                  playClickSound('click');
                  setAccountCurrency(e.target.value);
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Trade Size in Lots
            </label>
            <NumericField value={lots} onChangeValue={setLots} min={0} />
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[11px] text-slate-400">Quick volume presets:</span>
              {[0.01, 0.05, 0.1, 0.5, 1.0, 2.0, 5.0].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    playClickSound('click');
                    setLots(preset);
                  }}
                  className={`text-xs px-2 py-0.5 rounded border ${
                    lots === preset
                      ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40'
                      : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Pip Value Matrix Table */}
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2 font-mono">
              Pip Movement Profit / Loss Matrix
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              {[10, 25, 50, 100].map((pips) => {
                const usdAmt = pipValuePerPip * pips;
                const localAmt = formatDualCurrency(usdAmt, displayCurrency, fxRate);
                return (
                  <div key={pips} className="rounded border border-slate-800 bg-slate-900/80 p-2">
                    <span className="text-slate-400 block text-[11px]">{pips} Pips</span>
                    <span className="font-mono font-bold text-cyan-300 text-sm block">
                      ${usdAmt.toFixed(2)}
                    </span>
                    {localAmt && (
                      <span className="font-mono text-[10px] text-amber-400 block mt-0.5">
                        {localAmt}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound('calculate');
              setIsAdOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-3 text-xs font-extrabold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-md shadow-cyan-500/25 uppercase tracking-wide mt-4"
          >
            <Sparkles className="h-4 w-4" />
            <span>Calculate Pip Values & Unlock Report</span>
          </button>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-5 shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">
                Calculated Pip Valuation
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

            <div className="mb-5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4 text-center">
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Value Per 1 Pip ({selectedPair})
              </span>
              <div className="text-4xl font-extrabold text-cyan-300 font-mono tracking-tight drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                ${pipValuePerPip.toFixed(2)}
              </div>
              {dualPip && (
                <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                  ≈ {dualPip} / pip ({displayCurrency})
                </div>
              )}
              <span className="text-[11px] text-cyan-400/80 mt-1 block">
                At {lots} Standard Lot{lots !== 1 ? 's' : ''} ({Math.round(lots * 100000).toLocaleString()} Units)
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Pip Decimal Unit:</span>
                <span className="font-mono font-semibold text-slate-200">
                  {pairConfig.pipMultiplier === 0.01 ? '0.01 (JPY format)' : '0.0001 (Standard)'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Standard Lot (1.00):</span>
                <span className="font-mono font-semibold text-cyan-200">
                  ${pairConfig.standardLotPipUSD.toFixed(2)} / pip
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Mini Lot (0.10):</span>
                <span className="font-mono font-semibold text-cyan-200">
                  ${(pairConfig.standardLotPipUSD * 0.1).toFixed(2)} / pip
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Micro Lot (0.01):</span>
                <span className="font-mono font-semibold text-cyan-200">
                  ${(pairConfig.standardLotPipUSD * 0.01).toFixed(2)} / pip
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            Formula: (One Pip / Current Exchange Rate) × Position Units. For pairs quoted with USD as quote currency (EUR/USD, GBP/USD), pip value is mathematically constant at $10/lot.
          </div>
        </div>
      </div>

      <AdInterstitialModal
        isOpen={isAdOpen}
        onComplete={() => setIsAdOpen(false)}
      />
    </div>
  );
};
