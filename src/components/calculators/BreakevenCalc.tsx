import React, { useState } from 'react';
import { playClickSound } from '../../utils/sound';
import { NumericField, CalculatorCurrencyProps, formatDualCurrency } from './NumericField';
import { AdInterstitialModal } from '../AdInterstitialModal';
import { RotateCcw, Sparkles } from 'lucide-react';

export const BreakevenCalc: React.FC<CalculatorCurrencyProps> = ({
  displayCurrency = 'USD',
  fxRate = 1
}) => {
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [entryPrice, setEntryPrice] = useState<number>(68000);
  const [positionNotional, setPositionNotional] = useState<number>(10000);
  const [entryFeePercent, setEntryFeePercent] = useState<number>(0.05);
  const [exitFeePercent, setExitFeePercent] = useState<number>(0.05);
  const [fundingOrSwapUSD, setFundingOrSwapUSD] = useState<number>(4);
  const [isAdOpen, setIsAdOpen] = useState(false);

  const entryFeeUSD = (positionNotional * entryFeePercent) / 100;
  const exitFeeUSD = (positionNotional * exitFeePercent) / 100;
  const totalCostUSD = entryFeeUSD + exitFeeUSD + fundingOrSwapUSD;
  const requiredMovePercent = positionNotional > 0 ? (totalCostUSD / positionNotional) * 100 : 0;

  const breakevenPrice =
    direction === 'LONG'
      ? entryPrice * (1 + requiredMovePercent / 100)
      : Math.max(0, entryPrice * (1 - requiredMovePercent / 100));

  const dualCost = formatDualCurrency(totalCostUSD, displayCurrency, fxRate);

  const handleReset = () => {
    playClickSound('toggle');
    setDirection('LONG');
    setEntryPrice(68000);
    setPositionNotional(10000);
    setEntryFeePercent(0.05);
    setExitFeePercent(0.05);
    setFundingOrSwapUSD(4);
  };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-7 shadow-xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            True Breakeven Price Calculator (Fees & Swap)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Find the exact market price needed to cover entry fees, exit commissions, and overnight funding or swap costs.
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
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-300">Side:</label>
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
              {(['LONG', 'SHORT'] as const).map((side) => (
                <button
                  key={side}
                  type="button"
                  onClick={() => {
                    playClickSound('click');
                    setDirection(side);
                  }}
                  className={`px-4 py-1 text-xs font-bold rounded transition-colors ${
                    direction === side
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {side}
                </button>
              ))}
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
                Position Size ($ Notional)
              </label>
              <NumericField value={positionNotional} onChangeValue={setPositionNotional} min={0} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Entry Fee (%)
              </label>
              <NumericField value={entryFeePercent} onChangeValue={setEntryFeePercent} min={0} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Exit Fee (%)
              </label>
              <NumericField value={exitFeePercent} onChangeValue={setExitFeePercent} min={0} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Funding / Swap ($)
              </label>
              <NumericField value={fundingOrSwapUSD} onChangeValue={setFundingOrSwapUSD} min={0} />
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
            <span>Calculate True Breakeven & Unlock Report</span>
          </button>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-5 shadow-lg">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">
                Zero-Loss Breakeven Level
              </span>
            </div>

            <div className="mb-4 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4 text-center">
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Exact Breakeven Price
              </span>
              <div className="text-4xl font-extrabold text-cyan-300 font-mono">
                ${breakevenPrice.toFixed(entryPrice < 10 ? 5 : 2)}
              </div>
              <span className="text-xs text-emerald-400 font-mono mt-1 block">
                +{requiredMovePercent.toFixed(3)}% move needed to cover costs
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Fee & Carry Cost:</span>
                <span className="font-mono font-bold text-rose-400">
                  -${totalCostUSD.toFixed(2)} {dualCost ? `(${dualCost})` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Price Delta From Entry:</span>
                <span className="font-mono font-semibold text-slate-200">
                  ${Math.abs(breakevenPrice - entryPrice).toFixed(entryPrice < 10 ? 5 : 2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            Moving your stop loss to the raw entry price still results in a small net fee loss. Place breakeven stops at ${breakevenPrice.toFixed(2)} for true zero loss.
          </div>
        </div>
      </div>

      <AdInterstitialModal isOpen={isAdOpen} onComplete={() => setIsAdOpen(false)} />
    </div>
  );
};
