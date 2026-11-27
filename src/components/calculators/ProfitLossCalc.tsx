import React, { useState } from 'react';
import { playClickSound } from '../../utils/sound';
import { RotateCcw, Copy, Check } from 'lucide-react';

export const ProfitLossCalc: React.FC = () => {
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');
  const [assetType, setAssetType] = useState<'forex' | 'gold' | 'index'>('forex');
  const [entryPrice, setEntryPrice] = useState<number>(1.085);
  const [exitPrice, setExitPrice] = useState<number>(1.092);
  const [lots, setLots] = useState<number>(1.0);
  const [commissionPerLot, setCommissionPerLot] = useState<number>(6.0); // typical $6 round-turn
  const [swapFee, setSwapFee] = useState<number>(0.0);
  const [copied, setCopied] = useState(false);

  // Multiplier depending on asset
  let unitMultiplier = 100000; // forex standard lot
  if (assetType === 'gold') unitMultiplier = 100; // gold 100 oz
  if (assetType === 'index') unitMultiplier = 1; // 1 point = $1

  const isBuy = direction === 'buy';
  const priceDiff = isBuy ? exitPrice - entryPrice : entryPrice - exitPrice;
  const grossProfit = priceDiff * (lots * unitMultiplier);
  const totalCommission = lots * commissionPerLot;
  const netProfit = grossProfit - totalCommission - swapFee;

  const handleAssetChange = (type: 'forex' | 'gold' | 'index') => {
    playClickSound('click');
    setAssetType(type);
    if (type === 'forex') {
      setEntryPrice(1.085);
      setExitPrice(1.092);
    } else if (type === 'gold') {
      setEntryPrice(2650.0);
      setExitPrice(2665.0);
    } else {
      setEntryPrice(42200);
      setExitPrice(42450);
    }
  };

  const handleCopy = () => {
    playClickSound('click');
    navigator.clipboard.writeText(
      `P&L Calculation: Net ${netProfit >= 0 ? '+' : ''}$${netProfit.toFixed(
        2
      )} | Gross: $${grossProfit.toFixed(2)} | Lots: ${lots}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    playClickSound('toggle');
    setDirection('buy');
    handleAssetChange('forex');
    setLots(1.0);
    setCommissionPerLot(6.0);
    setSwapFee(0.0);
  };

  const isProfitable = netProfit > 0;

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-7 shadow-xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            Profit & Loss (P&L) Calculator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Calculate gross and net realized returns including broker commission fees and overnight swaps.
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => {
                  playClickSound('click');
                  setDirection('buy');
                }}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
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
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  direction === 'sell'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SELL (Short)
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
              <button
                type="button"
                onClick={() => handleAssetChange('forex')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  assetType === 'forex' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
                }`}
              >
                Forex
              </button>
              <button
                type="button"
                onClick={() => handleAssetChange('gold')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  assetType === 'gold' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
                }`}
              >
                Gold (XAU)
              </button>
              <button
                type="button"
                onClick={() => handleAssetChange('index')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  assetType === 'index' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
                }`}
              >
                Index (US30)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Entry Price ($)
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
                Exit Price ($)
              </label>
              <input
                type="number"
                step="0.0001"
                value={exitPrice}
                onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Trade Volume (Lots)
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

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Commission / Lot ($)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={commissionPerLot}
                onChange={(e) => setCommissionPerLot(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Overnight Swap ($)
              </label>
              <input
                type="number"
                step="0.5"
                value={swapFee}
                onChange={(e) => setSwapFee(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-5 shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">
                Realized Trade Return
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

            {/* Net P&L Hero Card */}
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
                {netProfit >= 0 ? '+' : ''}${netProfit.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {priceDiff >= 0 ? '+' : ''}
                {assetType === 'forex'
                  ? `${(priceDiff * 10000).toFixed(1)} Pips`
                  : `${priceDiff.toFixed(2)} Points`}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Gross Trade Return:</span>
                <span
                  className={`font-mono font-semibold ${
                    grossProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {grossProfit >= 0 ? '+' : ''}${grossProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Broker Round-Turn Commission:</span>
                <span className="font-mono font-semibold text-rose-300">
                  -${totalCommission.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Overnight Financing / Swap:</span>
                <span className="font-mono font-semibold text-slate-300">
                  -${swapFee.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            Net Profit = Gross P&L - Broker Commissions - Overnight Swaps. Accurate down to the penny.
          </div>
        </div>
      </div>
    </div>
  );
};
