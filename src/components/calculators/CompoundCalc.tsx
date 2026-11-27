import React, { useState } from 'react';
import { playClickSound } from '../../utils/sound';
import { RotateCcw, TrendingUp } from 'lucide-react';

export const CompoundCalc: React.FC = () => {
  const [initialCapital, setInitialCapital] = useState<number>(5000);
  const [monthlyReturn, setMonthlyReturn] = useState<number>(5.0);
  const [months, setMonths] = useState<number>(12);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(200);

  // Month-by-month projection
  const schedule: { month: number; startBalance: number; interest: number; contribution: number; endBalance: number }[] = [];
  let currentBalance = initialCapital;

  for (let m = 1; m <= months; m++) {
    const interest = (currentBalance * monthlyReturn) / 100;
    const end = currentBalance + interest + monthlyContribution;
    schedule.push({
      month: m,
      startBalance: currentBalance,
      interest: interest,
      contribution: monthlyContribution,
      endBalance: end
    });
    currentBalance = end;
  }

  const finalBalance = currentBalance;
  const totalContributions = initialCapital + monthlyContribution * months;
  const totalProfitEarned = Math.max(0, finalBalance - totalContributions);
  const multiple = totalContributions > 0 ? (finalBalance / totalContributions).toFixed(2) : '1.00';

  const handleReset = () => {
    playClickSound('toggle');
    setInitialCapital(5000);
    setMonthlyReturn(5.0);
    setMonths(12);
    setMonthlyContribution(200);
  };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-7 shadow-xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            Compound Interest & Growth Calculator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate exponential account growth over time with monthly reinvestment and periodic deposits.
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
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Starting Capital ($)
              </label>
              <input
                type="number"
                min="100"
                step="500"
                value={initialCapital}
                onChange={(e) => setInitialCapital(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Monthly Return (%)
              </label>
              <input
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                value={monthlyReturn}
                onChange={(e) => setMonthlyReturn(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Investment Horizon (Months)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                step="1"
                value={months}
                onChange={(e) => setMonths(Math.min(60, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Monthly Added Deposit ($)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-slate-400">Quick Horizons:</span>
            {[6, 12, 24, 36].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  playClickSound('click');
                  setMonths(m);
                }}
                className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                  months === m
                    ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40 font-semibold'
                    : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {m} Months ({m / 12 >= 1 ? `${m / 12}y` : `${m}m`})
              </button>
            ))}
          </div>

          {/* Capital vs Profit Bar */}
          <div className="pt-2">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Capital Breakdown</span>
              <span className="font-mono text-cyan-300">{multiple}x Multiple</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
              <div
                style={{ width: `${(totalContributions / (finalBalance || 1)) * 100}%` }}
                className="bg-slate-600 transition-all duration-300"
                title={`Deposits: $${totalContributions.toLocaleString()}`}
              />
              <div
                style={{ width: `${(totalProfitEarned / (finalBalance || 1)) * 100}%` }}
                className="bg-cyan-400 transition-all duration-300"
                title={`Compound Profit: $${totalProfitEarned.toLocaleString()}`}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-500"></span> Principal: ${totalContributions.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400"></span> Profit: ${Math.round(totalProfitEarned).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Results Overview */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-5 shadow-lg">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono block mb-2">
              Growth Projection After {months} Months
            </span>
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4 text-center mb-4">
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Projected Balance
              </span>
              <div className="text-4xl font-extrabold text-cyan-300 font-mono tracking-tight drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                ${Math.round(finalBalance).toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-400 mt-1 block font-mono">
                +${Math.round(totalProfitEarned).toLocaleString()} Pure Compound Growth
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Deposits:</span>
                <span className="font-mono font-semibold text-slate-200">
                  ${totalContributions.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Compound Interest:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  +${Math.round(totalProfitEarned).toLocaleString()}
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

          {/* Month schedule preview */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-300 block mb-1.5 uppercase font-mono">
              Month-by-Month Snapshot (First 4 vs Final)
            </span>
            <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono">
              {schedule.slice(0, 4).map((s) => (
                <div key={s.month} className="rounded bg-slate-900 border border-slate-800 p-1">
                  <span className="text-slate-400 block">M{s.month}</span>
                  <span className="text-slate-200 font-bold">${Math.round(s.endBalance).toLocaleString()}</span>
                </div>
              ))}
              <div className="rounded bg-cyan-950/40 border border-cyan-500/30 p-1">
                <span className="text-cyan-400 block">M{months}</span>
                <span className="text-cyan-200 font-bold">${Math.round(finalBalance).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
