import React, { useState } from 'react';
import { playClickSound } from '../../utils/sound';
import { NumericField, CalculatorCurrencyProps, formatDualCurrency } from './NumericField';
import { AdInterstitialModal } from '../AdInterstitialModal';
import { RotateCcw, Sparkles, Plus, Trash2 } from 'lucide-react';

interface DcaOrder {
  id: number;
  price: number;
  amountUSD: number;
}

export const DcaScalingCalc: React.FC<CalculatorCurrencyProps> = ({
  displayCurrency = 'USD',
  fxRate = 1
}) => {
  const [orders, setOrders] = useState<DcaOrder[]>([
    { id: 1, price: 92000, amountUSD: 500 },
    { id: 2, price: 86000, amountUSD: 750 },
    { id: 3, price: 80000, amountUSD: 1000 }
  ]);
  const [targetExitPrice, setTargetExitPrice] = useState<number>(98000);
  const [isAdOpen, setIsAdOpen] = useState(false);

  const totalInvested = orders.reduce((acc, o) => acc + (o.amountUSD || 0), 0);
  const totalUnits = orders.reduce(
    (acc, o) => acc + (o.price > 0 ? (o.amountUSD || 0) / o.price : 0),
    0
  );
  const averageEntry = totalUnits > 0 ? totalInvested / totalUnits : 0;
  const projectedValue = totalUnits * targetExitPrice;
  const projectedProfit = projectedValue - totalInvested;
  const roiPercent = totalInvested > 0 ? (projectedProfit / totalInvested) * 100 : 0;

  const dualInvested = formatDualCurrency(totalInvested, displayCurrency, fxRate);
  const dualProfit = formatDualCurrency(projectedProfit, displayCurrency, fxRate);

  const updateOrder = (id: number, field: 'price' | 'amountUSD', val: number) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: val } : o)));
  };

  const handleAddOrder = () => {
    if (orders.length >= 6) return;
    playClickSound('click');
    const last = orders[orders.length - 1];
    setOrders((prev) => [
      ...prev,
      {
        id: Date.now(),
        price: last ? Math.round(last.price * 0.92) : 75000,
        amountUSD: 500
      }
    ]);
  };

  const handleRemoveOrder = (id: number) => {
    if (orders.length <= 1) return;
    playClickSound('click');
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleReset = () => {
    playClickSound('toggle');
    setOrders([
      { id: 1, price: 92000, amountUSD: 500 },
      { id: 2, price: 86000, amountUSD: 750 },
      { id: 3, price: 80000, amountUSD: 1000 }
    ]);
    setTargetExitPrice(98000);
  };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-7 shadow-xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            DCA & Multi-Entry Average Price Calculator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Plan tiered Dollar-Cost Averaging entries across dips to calculate your exact weighted average cost basis.
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
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Scaled Entry Orders ({orders.length}/6)
            </span>
            {orders.length < 6 && (
              <button
                type="button"
                onClick={handleAddOrder}
                className="flex items-center gap-1 rounded-lg bg-cyan-500/15 border border-cyan-500/40 px-2.5 py-1 text-xs font-bold text-cyan-300 hover:bg-cyan-500/25"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Entry Layer</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {orders.map((order, idx) => (
              <div
                key={order.id}
                className="grid grid-cols-12 gap-2 items-end rounded-lg border border-slate-800 bg-slate-950/70 p-3"
              >
                <div className="col-span-5">
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Order #{idx + 1} Price ($)
                  </label>
                  <NumericField
                    value={order.price}
                    onChangeValue={(v) => updateOrder(order.id, 'price', v)}
                    min={0}
                  />
                </div>
                <div className="col-span-5">
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Capital ($ USD)
                  </label>
                  <NumericField
                    value={order.amountUSD}
                    onChangeValue={(v) => updateOrder(order.id, 'amountUSD', v)}
                    min={0}
                  />
                </div>
                <div className="col-span-2 flex justify-end pb-1">
                  <button
                    type="button"
                    disabled={orders.length <= 1}
                    onClick={() => handleRemoveOrder(order.id)}
                    className="rounded-lg p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Target Exit Price ($)
            </label>
            <NumericField value={targetExitPrice} onChangeValue={setTargetExitPrice} min={0} />
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
            <span>Calculate Weighted Average & Unlock Report</span>
          </button>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-5 shadow-lg">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">
                Weighted Average Cost Basis
              </span>
            </div>

            <div className="mb-4 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4 text-center">
              <span className="text-xs font-medium text-slate-400 block mb-1">
                New Average Entry Price
              </span>
              <div className="text-4xl font-extrabold text-cyan-300 font-mono">
                ${averageEntry.toFixed(averageEntry < 10 ? 4 : 2)}
              </div>
              <span className="text-[11px] font-mono text-slate-300 mt-1 block">
                Total Units Accumulated: {totalUnits.toFixed(5)}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Capital Allocated:</span>
                <span className="font-mono font-bold text-white">
                  ${totalInvested.toLocaleString()} {dualInvested ? `(${dualInvested})` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Projected Exit Profit:</span>
                <span
                  className={`font-mono font-bold ${
                    projectedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {projectedProfit >= 0 ? '+' : ''}${projectedProfit.toFixed(2)}{' '}
                  {dualProfit ? `(${dualProfit})` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Projected Net ROI:</span>
                <span
                  className={`font-mono font-bold ${
                    roiPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {roiPercent >= 0 ? '+' : ''}
                  {roiPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            Tip: Scale spot buys during structural support dips rather than averaging down losing high-leverage futures positions.
          </div>
        </div>
      </div>

      <AdInterstitialModal isOpen={isAdOpen} onComplete={() => setIsAdOpen(false)} />
    </div>
  );
};
