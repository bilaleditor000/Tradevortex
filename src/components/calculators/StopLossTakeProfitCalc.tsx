import React, { useState } from 'react';
import { playClickSound } from '../../utils/sound';
import { NumericField, CalculatorCurrencyProps, formatDualCurrency } from './NumericField';
import { AdInterstitialModal } from '../AdInterstitialModal';
import { RotateCcw, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

export const StopLossTakeProfitCalc: React.FC<CalculatorCurrencyProps> = ({
  displayCurrency = 'USD',
  fxRate = 1
}) => {
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [entryPrice, setEntryPrice] = useState<number>(2650);
  const [positionValueUSD, setPositionValueUSD] = useState<number>(5000);
  const [stopLossPercent, setStopLossPercent] = useState<number>(1.5);
  const [riskRewardRatio, setRiskRewardRatio] = useState<number>(2.5);
  const [isAdOpen, setIsAdOpen] = useState(false);

  const isLong = direction === 'LONG';
  const slMove = entryPrice * (stopLossPercent / 100);
  const tpMove = slMove * riskRewardRatio;

  const stopLossPrice = isLong ? Math.max(0, entryPrice - slMove) : entryPrice + slMove;
  const takeProfitPrice = isLong ? entryPrice + tpMove : Math.max(0, entryPrice - tpMove);

  const potentialLossUSD = positionValueUSD * (stopLossPercent / 100);
  const potentialProfitUSD = potentialLossUSD * riskRewardRatio;
  const requiredWinRate = (1 / (1 + riskRewardRatio)) * 100;

  const dualLoss = formatDualCurrency(potentialLossUSD, displayCurrency, fxRate);
  const dualProfit = formatDualCurrency(potentialProfitUSD, displayCurrency, fxRate);

  const handleReset = () => {
    playClickSound('toggle');
    setDirection('LONG');
    setEntryPrice(2650);
    setPositionValueUSD(5000);
    setStopLossPercent(1.5);
    setRiskRewardRatio(2.5);
  };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-7 shadow-xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Stop-Loss & Take-Profit Target Price Calculator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compute exact SL & TP execution levels, risk-reward payoff, and minimum breakeven win rate before placing orders.
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
            <label className="text-xs font-medium text-slate-300">Direction:</label>
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => {
                  playClickSound('click');
                  setDirection('LONG');
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded transition-colors ${
                  isLong
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                <span>LONG</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound('click');
                  setDirection('SHORT');
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded transition-colors ${
                  !isLong
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingDown className="h-3.5 w-3.5" />
                <span>SHORT</span>
              </button>
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
                Total Position Size ($ Notional)
              </label>
              <NumericField value={positionValueUSD} onChangeValue={setPositionValueUSD} min={0} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Stop Loss Distance (% from Entry)
              </label>
              <NumericField value={stopLossPercent} onChangeValue={setStopLossPercent} min={0} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Risk : Reward (1 : X)
              </label>
              <NumericField value={riskRewardRatio} onChangeValue={setRiskRewardRatio} min={0.1} />
              <div className="flex gap-1.5 mt-2">
                {[1.5, 2, 2.5, 3, 5].map((rr) => (
                  <button
                    key={rr}
                    type="button"
                    onClick={() => {
                      playClickSound('click');
                      setRiskRewardRatio(rr);
                    }}
                    className={`text-xs px-2 py-0.5 rounded border font-mono ${
                      riskRewardRatio === rr
                        ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40'
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    1:{rr}
                  </button>
                ))}
              </div>
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
            <span>Calculate SL/TP Targets & Unlock Report</span>
          </button>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-5 shadow-lg">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">
                Exact Order Targets
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-3 text-center">
                <span className="text-[11px] text-slate-400 block">Take Profit Price</span>
                <div className="text-xl font-extrabold font-mono text-emerald-300 mt-1">
                  ${takeProfitPrice.toFixed(entryPrice < 10 ? 4 : 2)}
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  +${potentialProfitUSD.toFixed(2)}
                </span>
                {dualProfit && (
                  <span className="block text-[10px] font-mono text-amber-400">+{dualProfit}</span>
                )}
              </div>

              <div className="rounded-lg border border-rose-500/40 bg-rose-950/20 p-3 text-center">
                <span className="text-[11px] text-slate-400 block">Stop Loss Price</span>
                <div className="text-xl font-extrabold font-mono text-rose-400 mt-1">
                  ${stopLossPrice.toFixed(entryPrice < 10 ? 4 : 2)}
                </div>
                <span className="text-[11px] font-mono text-rose-400 font-bold">
                  -${potentialLossUSD.toFixed(2)}
                </span>
                {dualLoss && (
                  <span className="block text-[10px] font-mono text-amber-400">-{dualLoss}</span>
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Risk : Reward Ratio:</span>
                <span className="font-mono font-bold text-cyan-300">1 : {riskRewardRatio}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Min Win Rate for Breakeven:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {requiredWinRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            With a 1:{riskRewardRatio} payoff ratio, you only need to win {requiredWinRate.toFixed(1)}% of trades to break even before fees.
          </div>
        </div>
      </div>

      <AdInterstitialModal isOpen={isAdOpen} onComplete={() => setIsAdOpen(false)} />
    </div>
  );
};
