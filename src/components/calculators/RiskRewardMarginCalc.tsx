import React, { useState } from 'react';
import { playClickSound } from '../../utils/sound';
import { RotateCcw, ShieldAlert, Award } from 'lucide-react';

export const RiskRewardMarginCalc: React.FC = () => {
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');
  const [balance, setBalance] = useState<number>(10000);
  const [leverage, setLeverage] = useState<number>(500);
  const [entryPrice, setEntryPrice] = useState<number>(1.085);
  const [stopLoss, setStopLoss] = useState<number>(1.082);
  const [takeProfit, setTakeProfit] = useState<number>(1.093);
  const [lots, setLots] = useState<number>(1.0);

  // Calculations
  const units = lots * 100000;
  const isBuy = direction === 'buy';

  const riskDistance = isBuy
    ? Math.max(0, entryPrice - stopLoss)
    : Math.max(0, stopLoss - entryPrice);

  const rewardDistance = isBuy
    ? Math.max(0, takeProfit - entryPrice)
    : Math.max(0, entryPrice - takeProfit);

  const riskPips = riskDistance * 10000;
  const rewardPips = rewardDistance * 10000;

  const cashRisk = riskDistance * units;
  const cashReward = rewardDistance * units;

  const rrRatio =
    cashRisk > 0 ? (cashReward / cashRisk).toFixed(2) : '0.00';

  // Margin calculation
  // Required Margin = (Units * EntryPrice) / Leverage
  const requiredMargin = (units * entryPrice) / (leverage || 1);
  const freeMargin = Math.max(0, balance - requiredMargin);
  const marginLevel =
    requiredMargin > 0 ? ((balance / requiredMargin) * 100).toFixed(1) : '1000+';

  const handleReset = () => {
    playClickSound('toggle');
    setDirection('buy');
    setBalance(10000);
    setLeverage(500);
    setEntryPrice(1.085);
    setStopLoss(1.082);
    setTakeProfit(1.093);
    setLots(1.0);
  };

  const isFavorableRR = parseFloat(rrRatio) >= 2.0;
  const isAcceptableRR = parseFloat(rrRatio) >= 1.5 && parseFloat(rrRatio) < 2.0;

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-7 shadow-xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            Risk:Reward & Required Margin Calculator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate mathematical trade expectancy, payout ratio, and broker margin collateral usage.
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
          {/* Long / Short Switcher */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-300">
              Position Direction:
            </label>
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => {
                  playClickSound('click');
                  setDirection('buy');
                }}
                className={`px-4 py-1 text-xs font-semibold rounded transition-colors ${
                  direction === 'buy'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                BUY (Long)
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound('click');
                  setDirection('sell');
                }}
                className={`px-4 py-1 text-xs font-semibold rounded transition-colors ${
                  direction === 'sell'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SELL (Short)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Account Balance ($)
              </label>
              <input
                type="number"
                min="100"
                step="500"
                value={balance}
                onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Account Leverage
              </label>
              <select
                value={leverage}
                onChange={(e) => {
                  playClickSound('click');
                  setLeverage(parseInt(e.target.value) || 100);
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
              >
                <option value={30}>1:30 (EU/ASIC Retail)</option>
                <option value={100}>1:100</option>
                <option value={200}>1:200</option>
                <option value={500}>1:500 (Standard Global)</option>
                <option value={1000}>1:1000</option>
                <option value={2000}>1:2000 (Exness Max)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Entry Price
              </label>
              <input
                type="number"
                step="0.0001"
                value={entryPrice}
                onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Stop Loss Price
              </label>
              <input
                type="number"
                step="0.0001"
                value={stopLoss}
                onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Take Profit Price
              </label>
              <input
                type="number"
                step="0.0001"
                value={takeProfit}
                onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Position Size (Lots)
            </label>
            <input
              type="number"
              min="0.01"
              step="0.1"
              value={lots}
              onChange={(e) => setLots(parseFloat(e.target.value) || 0.01)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Output Diagnostics Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-5 shadow-lg">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono block mb-2">
              Risk:Reward Evaluation
            </span>

            {/* R:R Hero Box */}
            <div
              className={`mb-4 rounded-lg border p-4 text-center ${
                isFavorableRR
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : isAcceptableRR
                  ? 'border-cyan-500/40 bg-cyan-950/20'
                  : 'border-rose-500/40 bg-rose-950/20'
              }`}
            >
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Risk-to-Reward Ratio
              </span>
              <div
                className={`text-4xl font-extrabold font-mono tracking-tight ${
                  isFavorableRR
                    ? 'text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : isAcceptableRR
                    ? 'text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'text-rose-400'
                }`}
              >
                1 : {rrRatio}
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[11px]">
                {isFavorableRR ? (
                  <>
                    <Award className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-medium">Optimal Institutional Asymmetry (≥ 1:2)</span>
                  </>
                ) : isAcceptableRR ? (
                  <span className="text-cyan-300">Acceptable R:R Profile</span>
                ) : (
                  <>
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                    <span className="text-rose-300">Unfavorable R:R (Negative Expectancy)</span>
                  </>
                )}
              </div>
            </div>

            {/* Diagnostics Specs */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Cash at Risk (SL):</span>
                <span className="font-mono font-semibold text-rose-400">
                  -${cashRisk.toFixed(2)} ({riskPips.toFixed(1)} pips)
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Cash Target (TP):</span>
                <span className="font-mono font-semibold text-emerald-400">
                  +${cashReward.toFixed(2)} ({rewardPips.toFixed(1)} pips)
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Required Margin Collateral:</span>
                <span className="font-mono font-semibold text-cyan-200">
                  ${requiredMargin.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Remaining Free Margin:</span>
                <span className="font-mono font-semibold text-slate-100">
                  ${freeMargin.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Account Margin Level:</span>
                <span className="font-mono font-semibold text-slate-100">
                  {marginLevel}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            With 1:{leverage} leverage, your required margin is just ${(requiredMargin).toFixed(2)}, leaving {(freeMargin).toFixed(2)} in free margin to buffer market noise.
          </div>
        </div>
      </div>
    </div>
  );
};
