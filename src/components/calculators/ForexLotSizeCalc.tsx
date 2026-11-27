import React, { useState } from 'react';
import { playClickSound } from '../../utils/sound';
import { RotateCcw, Copy, Check, Sparkles } from 'lucide-react';
import { AdInterstitialModal } from '../AdInterstitialModal';
import { NumericField, CalculatorCurrencyProps, formatDualCurrency } from './NumericField';

interface CurrencyPairOption {
  pair: string;
  pipFactor: number;
  pipValuePerStandardLotUSD: number;
}

const PAIRS: CurrencyPairOption[] = [
  { pair: 'EUR/USD', pipFactor: 0.0001, pipValuePerStandardLotUSD: 10.0 },
  { pair: 'GBP/USD', pipFactor: 0.0001, pipValuePerStandardLotUSD: 10.0 },
  { pair: 'AUD/USD', pipFactor: 0.0001, pipValuePerStandardLotUSD: 10.0 },
  { pair: 'NZD/USD', pipFactor: 0.0001, pipValuePerStandardLotUSD: 10.0 },
  { pair: 'USD/JPY', pipFactor: 0.01, pipValuePerStandardLotUSD: 6.6 },
  { pair: 'USD/CAD', pipFactor: 0.0001, pipValuePerStandardLotUSD: 7.4 },
  { pair: 'USD/CHF', pipFactor: 0.0001, pipValuePerStandardLotUSD: 11.2 },
  { pair: 'EUR/GBP', pipFactor: 0.0001, pipValuePerStandardLotUSD: 13.0 },
  { pair: 'GBP/JPY', pipFactor: 0.01, pipValuePerStandardLotUSD: 6.6 }
];

export const ForexLotSizeCalc: React.FC<CalculatorCurrencyProps> = ({
  displayCurrency = 'USD',
  fxRate = 1
}) => {
  const [accountCurrency, setAccountCurrency] = useState('USD');
  const [balance, setBalance] = useState<number>(10000);
  const [riskType, setRiskType] = useState<'percent' | 'cash'>('percent');
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [riskCash, setRiskCash] = useState<number>(150);
  const [stopLossPips, setStopLossPips] = useState<number>(25);
  const [selectedPair, setSelectedPair] = useState<string>('EUR/USD');
  const [copied, setCopied] = useState(false);
  const [isAdOpen, setIsAdOpen] = useState(false);

  const activePairConfig = PAIRS.find((p) => p.pair === selectedPair) || PAIRS[0];

  // Monetary risk calculation
  const cashRisk =
    riskType === 'percent' ? (balance * riskPercent) / 100 : riskCash;

  const pipValuePerStandard = activePairConfig.pipValuePerStandardLotUSD;

  const calculatedLots =
    stopLossPips > 0 && pipValuePerStandard > 0
      ? cashRisk / (stopLossPips * pipValuePerStandard)
      : 0;

  const standardLots = Math.max(0, parseFloat(calculatedLots.toFixed(2)));
  const miniLots = Math.max(0, parseFloat((calculatedLots * 10).toFixed(2)));
  const microLots = Math.max(0, parseFloat((calculatedLots * 100).toFixed(2)));
  const units = Math.round(calculatedLots * 100000);
  const pipValueAtCalculatedLot = standardLots * pipValuePerStandard;

  const dualRisk = formatDualCurrency(cashRisk, displayCurrency, fxRate);
  const dualPip = formatDualCurrency(pipValueAtCalculatedLot, displayCurrency, fxRate);

  const handleCopy = () => {
    playClickSound('click');
    navigator.clipboard.writeText(
      `Forex Position Size (${selectedPair}): ${standardLots} Lots | Risk: $${cashRisk.toFixed(
        2
      )}${dualRisk ? ` (${dualRisk})` : ''} | SL: ${stopLossPips} pips`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    playClickSound('toggle');
    setBalance(10000);
    setRiskPercent(1.5);
    setRiskCash(150);
    setStopLossPips(25);
    setSelectedPair('EUR/USD');
    setRiskType('percent');
  };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-7 shadow-xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            Forex Lot Size & Risk Calculator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Calculate exact lot size, cash at risk, and contract units based on your stop loss distance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <option value="AUD">AUD ($)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Account Balance ({accountCurrency})
              </label>
              <NumericField value={balance} onChangeValue={setBalance} min={0} />
            </div>
          </div>

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
                {PAIRS.map((p) => (
                  <option key={p.pair} value={p.pair}>
                    {p.pair}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Stop Loss (in Pips)
              </label>
              <NumericField value={stopLossPips} onChangeValue={setStopLossPips} min={0} fallbackOnEmpty={0} />
            </div>
          </div>

          {/* Risk Toggle & Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Risk Model
              </label>
              <div className="flex items-center gap-1 p-0.5 rounded-md bg-slate-950 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound('click');
                    setRiskType('percent');
                  }}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    riskType === 'percent'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound('click');
                    setRiskType('cash');
                  }}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    riskType === 'cash'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Fixed Cash ($)
                </button>
              </div>
            </div>

            {riskType === 'percent' ? (
              <div>
                <NumericField value={riskPercent} onChangeValue={setRiskPercent} min={0} max={100} />
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[11px] text-slate-400">Quick presets:</span>
                  {[0.5, 1.0, 1.5, 2.0, 3.0].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        playClickSound('click');
                        setRiskPercent(preset);
                      }}
                      className={`text-xs px-2 py-0.5 rounded border ${
                        riskPercent === preset
                          ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40'
                          : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <NumericField value={riskCash} onChangeValue={setRiskCash} min={0} />
              </div>
            )}
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
            <span>Calculate Lot Size & Unlock Report</span>
          </button>
        </div>

        {/* Calculation Result Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-5 shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">
                Recommended Execution
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
                title="Copy Calculation Summary"
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

            {/* Hero Standard Lots output */}
            <div className="mb-5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4 text-center">
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Standard Lot Size
              </span>
              <div className="text-4xl font-extrabold text-cyan-300 font-mono tracking-tight drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                {standardLots.toFixed(2)}
              </div>
              <span className="text-[11px] text-cyan-400/80 mt-1 block">
                {units.toLocaleString()} Base Currency Units
              </span>
            </div>

            {/* Key Metrics Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Money at Risk:</span>
                <span className="font-mono font-semibold text-rose-400">
                  ${cashRisk.toFixed(2)} {dualRisk ? `(${dualRisk})` : accountCurrency}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Account Equity Risked:</span>
                <span className="font-mono font-semibold text-slate-200">
                  {((cashRisk / (balance || 1)) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Mini Lots (0.10):</span>
                <span className="font-mono font-semibold text-cyan-200">
                  {miniLots.toFixed(1)} Mini Lots
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Micro Lots (0.01):</span>
                <span className="font-mono font-semibold text-cyan-200">
                  {microLots.toFixed(0)} Micro Lots
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Pip Value at Position:</span>
                <span className="font-mono font-semibold text-slate-100">
                  ${pipValueAtCalculatedLot.toFixed(2)} {dualPip ? `(${dualPip})` : ''} / pip
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            Formula: Risk Capital ÷ (Stop Loss Pips × Pip Value). If price moves {stopLossPips} pips against you, your exact loss is limited to ${cashRisk.toFixed(2)}.
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
