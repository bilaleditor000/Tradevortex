import React, { useState } from 'react';
import { playClickSound } from '../../utils/sound';
import { RotateCcw, Copy, Check, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { AdInterstitialModal } from '../AdInterstitialModal';
import { NumericField, CalculatorCurrencyProps, formatDualCurrency } from './NumericField';
import { getAdminSettings } from '../../data/adminSettings';

export const FuturesPnLCalc: React.FC<CalculatorCurrencyProps> = ({
  displayCurrency = 'USD',
  fxRate = 1
}) => {
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [leverage, setLeverage] = useState<number>(20);
  const [entryPrice, setEntryPrice] = useState<number>(68000);
  const [exitPrice, setExitPrice] = useState<number>(71400);
  const [marginAmount, setMarginAmount] = useState<number>(500);
  const [makerTakerFeePercent, setMakerTakerFeePercent] = useState<number>(0.05);
  const [copied, setCopied] = useState(false);
  const [isAdOpen, setIsAdOpen] = useState(false);

  const settings = getAdminSettings();
  const exnessUrl = settings.brokerLinks?.exness || 'https://one.exness-track.com/a/custom_tradevortex';

  // Calculations
  const positionValue = marginAmount * leverage;
  const contractQuantity = entryPrice > 0 ? positionValue / entryPrice : 0;

  const isLong = direction === 'LONG';
  const priceDelta = isLong ? exitPrice - entryPrice : entryPrice - exitPrice;
  const grossPnL = entryPrice > 0 ? (priceDelta / entryPrice) * positionValue : 0;

  // Trading Fees (entry + exit)
  const entryFee = (positionValue * makerTakerFeePercent) / 100;
  const exitValue = contractQuantity * exitPrice;
  const exitFee = (exitValue * makerTakerFeePercent) / 100;
  const totalFees = entryFee + exitFee;

  const netPnL = grossPnL - totalFees;
  const roePercent = marginAmount > 0 ? (netPnL / marginAmount) * 100 : 0;
  const priceChangePercent = entryPrice > 0 ? ((exitPrice - entryPrice) / entryPrice) * 100 : 0;

  const dualNet = formatDualCurrency(netPnL, displayCurrency, fxRate);
  const dualGross = formatDualCurrency(grossPnL, displayCurrency, fxRate);
  const dualFees = formatDualCurrency(totalFees, displayCurrency, fxRate);
  const dualNotional = formatDualCurrency(positionValue, displayCurrency, fxRate);

  const handleCopy = () => {
    playClickSound('click');
    navigator.clipboard.writeText(
      `Futures Trade: ${direction} ${leverage}x | Entry: $${entryPrice} -> Exit: $${exitPrice} | Net PnL: ${
        netPnL >= 0 ? '+' : ''
      }$${netPnL.toFixed(2)}${dualNet ? ` (${dualNet})` : ''} (${roePercent >= 0 ? '+' : ''}${roePercent.toFixed(2)}% ROE)`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    playClickSound('toggle');
    setDirection('LONG');
    setLeverage(20);
    setEntryPrice(68000);
    setExitPrice(71400);
    setMarginAmount(500);
    setMakerTakerFeePercent(0.05);
  };

  const isProfitable = netPnL >= 0;

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-7 shadow-xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            Spot & Crypto Futures Profit/Loss Calculator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Calculate exact realized PnL, Return on Equity (ROE %), and exchange trading fee deductions across 1x-125x leverage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters */}
        <div className="lg:col-span-7 space-y-4">
          {/* Direction Long / Short */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-300">
              Position Side:
            </label>
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
                Initial Margin ($ Invested)
              </label>
              <NumericField value={marginAmount} onChangeValue={setMarginAmount} min={0} />
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
                <span>1x (Spot)</span>
                <span>20x</span>
                <span>50x</span>
                <span>100x</span>
                <span>125x</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Entry Price ($)
              </label>
              <NumericField value={entryPrice} onChangeValue={setEntryPrice} min={0} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Exit Price ($)
              </label>
              <NumericField value={exitPrice} onChangeValue={setExitPrice} min={0} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Exchange Trading Fee Rate (%)
            </label>
            <NumericField
              value={makerTakerFeePercent}
              onChangeValue={setMakerTakerFeePercent}
              min={0}
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Standard tier-1 futures rate is 0.02% maker / 0.05% taker.
            </span>
          </div>

          {/* Trigger 5-Second Ad Interstitial */}
          <button
            type="button"
            onClick={() => {
              playClickSound('calculate');
              setIsAdOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-3 text-xs font-extrabold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-md shadow-cyan-500/25 uppercase tracking-wide"
          >
            <Sparkles className="h-4 w-4" />
            <span>Recalculate & Unlock Institutional Report</span>
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-5 shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">
                Realized Trade Output
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

            {/* Hero Net Return Box */}
            <div
              className={`mb-4 rounded-lg border p-4 text-center ${
                isProfitable
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-rose-500/40 bg-rose-950/20'
              }`}
            >
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Net Profit / Loss (After Fees)
              </span>
              <div
                className={`text-4xl font-extrabold font-mono tracking-tight ${
                  isProfitable ? 'text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'text-rose-400'
                }`}
              >
                {netPnL >= 0 ? '+' : '-'}${Math.abs(netPnL).toFixed(2)}
              </div>
              {dualNet && (
                <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                  ≈ {netPnL >= 0 ? '+' : ''}{dualNet} ({displayCurrency})
                </div>
              )}
              <div className="flex items-center justify-center gap-2 mt-1.5 text-xs font-mono font-bold">
                <span className={roePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {roePercent >= 0 ? '+' : ''}{roePercent.toFixed(2)}% ROE
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">
                  Asset Move: {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Position Notional:</span>
                <span className="font-mono font-semibold text-slate-100">
                  ${positionValue.toLocaleString()} {dualNotional ? `(${dualNotional})` : ''} · {contractQuantity.toFixed(4)} Units
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Gross Trade Return:</span>
                <span
                  className={`font-mono font-semibold ${
                    grossPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {grossPnL >= 0 ? '+' : '-'}${Math.abs(grossPnL).toFixed(2)} {dualGross ? `(${dualGross})` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Exchange Trading Fees:</span>
                <span className="font-mono font-semibold text-rose-300">
                  -${totalFees.toFixed(2)} {dualFees ? `(${dualFees})` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Effective Leverage Factor:</span>
                <span className="font-mono font-semibold text-cyan-300">
                  {leverage}x
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            With {leverage}x leverage, a 1% price change produces a {leverage}% return on margin. Always use stop losses to limit maximum downside.
          </div>
        </div>
      </div>

      <AdInterstitialModal
        isOpen={isAdOpen}
        onComplete={() => setIsAdOpen(false)}
        brokerName="Exness"
        brokerAffiliateUrl={exnessUrl}
      />
    </div>
  );
};
