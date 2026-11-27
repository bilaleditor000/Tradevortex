import React, { useState } from 'react';
import { playClickSound } from '../../utils/sound';
import { RotateCcw, TrendingUp, AlertOctagon, Sparkles } from 'lucide-react';
import { AdInterstitialModal } from '../AdInterstitialModal';
import { NumericField, CalculatorCurrencyProps, formatDualCurrency } from './NumericField';
import { getAdminSettings } from '../../data/adminSettings';

export const CompoundDrawdownCalc: React.FC<CalculatorCurrencyProps> = ({
  displayCurrency = 'USD',
  fxRate = 1
}) => {
  const [initialCapital, setInitialCapital] = useState<number>(5000);
  const [monthlyReturn, setMonthlyReturn] = useState<number>(5.0);
  const [months, setMonths] = useState<number>(12);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(200);
  const [currentDrawdownPercent, setCurrentDrawdownPercent] = useState<number>(25);
  const [isAdOpen, setIsAdOpen] = useState(false);

  const settings = getAdminSettings();
  const xmUrl = settings.brokerLinks?.xm || 'https://clicks.pipaffiliates.com/c?c=tradevortex';

  const safeMonths = Math.min(60, Math.max(1, Math.round(months) || 1));
  let currentBalance = initialCapital;

  for (let m = 1; m <= safeMonths; m++) {
    const interest = (currentBalance * monthlyReturn) / 100;
    currentBalance = currentBalance + interest + monthlyContribution;
  }

  const finalBalance = currentBalance;
  const totalContributions = initialCapital + monthlyContribution * safeMonths;
  const totalProfitEarned = Math.max(0, finalBalance - totalContributions);
  const multiple = totalContributions > 0 ? (finalBalance / totalContributions).toFixed(2) : '1.00';

  const requiredGainPercent =
    currentDrawdownPercent < 100
      ? (currentDrawdownPercent / (100 - currentDrawdownPercent)) * 100
      : 9999;

  const r = monthlyReturn / 100;
  const monthsToRecover =
    r > 0 && requiredGainPercent > 0
      ? Math.ceil(Math.log(1 + requiredGainPercent / 100) / Math.log(1 + r))
      : 0;

  const dualFinal = formatDualCurrency(finalBalance, displayCurrency, fxRate);
  const dualProfit = formatDualCurrency(totalProfitEarned, displayCurrency, fxRate);
  const dualContrib = formatDualCurrency(totalContributions, displayCurrency, fxRate);

  const handleReset = () => {
    playClickSound('toggle');
    setInitialCapital(5000);
    setMonthlyReturn(5.0);
    setMonths(12);
    setMonthlyContribution(200);
    setCurrentDrawdownPercent(25);
  };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-7 shadow-xl shadow-cyan-950/20 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            Compound Growth & Drawdown Recovery Calculator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Model long-term exponential capital accumulation alongside institutional drawdown recovery mathematics.
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

      {/* Part 1: Compound Growth Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Starting Capital ($)
              </label>
              <NumericField value={initialCapital} onChangeValue={setInitialCapital} min={0} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Monthly Return (%)
              </label>
              <NumericField value={monthlyReturn} onChangeValue={setMonthlyReturn} min={0} max={50} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Investment Horizon (Months, max 60)
              </label>
              <NumericField
                value={months}
                onChangeValue={(v) => setMonths(Math.min(60, Math.max(0, v)))}
                min={1}
                max={60}
                integer
                fallbackOnEmpty={1}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Monthly Added Deposit ($)
              </label>
              <NumericField value={monthlyContribution} onChangeValue={setMonthlyContribution} min={0} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound('calculate');
              setIsAdOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-2.5 text-xs font-extrabold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-md shadow-cyan-500/25 uppercase tracking-wide"
          >
            <Sparkles className="h-4 w-4" />
            <span>Recalculate & Unlock Growth Trajectory</span>
          </button>
        </div>

        {/* Growth Projection Box */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-5 shadow-lg">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono block mb-2">
              Compound Projection After {safeMonths} Months
            </span>
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4 text-center mb-4">
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Projected Balance
              </span>
              <div className="text-4xl font-extrabold text-cyan-300 font-mono tracking-tight drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                ${Math.round(finalBalance).toLocaleString()}
              </div>
              {dualFinal && (
                <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                  ≈ {dualFinal} ({displayCurrency})
                </div>
              )}
              <span className="text-[11px] text-emerald-400 mt-1 block font-mono">
                +${Math.round(totalProfitEarned).toLocaleString()} Pure Compound Growth ({multiple}x return)
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Principal Deposits:</span>
                <span className="font-mono font-semibold text-slate-200">
                  ${totalContributions.toLocaleString()} {dualContrib ? `(${dualContrib})` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Compound Interest:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  +${Math.round(totalProfitEarned).toLocaleString()} {dualProfit ? `(${dualProfit})` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Net Portfolio Multiplier:</span>
                <span className="font-mono font-semibold text-cyan-300">
                  {multiple}x Return
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Drawdown Recovery Calculator */}
      <div className="rounded-xl border border-rose-500/30 bg-slate-950/80 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">
              The Asymmetric Mathematics of Drawdown Recovery
            </h3>
          </div>
          <span className="rounded bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] font-mono text-rose-300 font-bold uppercase">
            Risk Preservation Math
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Because capital loss permanently impairs your starting equity base, recovering from a loss requires an exponentially higher percentage gain just to return to breakeven.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center pt-2">
          <div className="sm:col-span-6 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>Account Drawdown:</span>
                <span className="font-mono font-bold text-rose-400">{currentDrawdownPercent}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                step="5"
                value={currentDrawdownPercent}
                onChange={(e) => setCurrentDrawdownPercent(parseInt(e.target.value, 10) || 5)}
                className="w-full accent-rose-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>-10%</span>
                <span>-25%</span>
                <span>-50% (Crash)</span>
                <span>-75%</span>
                <span>-90%</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {[10, 20, 30, 50, 75].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCurrentDrawdownPercent(preset)}
                  className={`text-[10px] px-2.5 py-1 rounded border font-mono ${
                    currentDrawdownPercent === preset
                      ? 'border-rose-500 bg-rose-950/40 text-rose-300 font-bold'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  -{preset}%
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-6 rounded-xl border border-rose-500/40 bg-gradient-to-b from-rose-950/30 to-slate-950 p-4 text-center space-y-2">
            <span className="text-xs text-slate-400 block">Gain Required Simply to Break Even:</span>
            <div className="font-mono text-3xl sm:text-4xl font-black text-rose-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]">
              +{requiredGainPercent.toFixed(1)}%
            </div>
            <div className="text-xs font-mono text-slate-300">
              Estimated Recovery Time:{' '}
              <span className="text-cyan-400 font-bold">~{monthsToRecover} Months</span> (at {monthlyReturn}% monthly return)
            </div>
          </div>
        </div>
      </div>

      <AdInterstitialModal
        isOpen={isAdOpen}
        onComplete={() => setIsAdOpen(false)}
        brokerName="XM Group"
        brokerAffiliateUrl={xmUrl}
      />
    </div>
  );
};
