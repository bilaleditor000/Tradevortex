import React, { useState } from 'react';
import { playClickSound } from '../../utils/sound';
import { NumericField, CalculatorCurrencyProps, formatDualCurrency } from './NumericField';
import { AdInterstitialModal } from '../AdInterstitialModal';
import { RotateCcw, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const MarginLeverageCalc: React.FC<CalculatorCurrencyProps> = ({
  displayCurrency = 'USD',
  fxRate = 1
}) => {
  const [accountBalance, setAccountBalance] = useState<number>(2000);
  const [lotSize, setLotSize] = useState<number>(0.5);
  const [contractUnitsPerLot, setContractUnitsPerLot] = useState<number>(100000);
  const [entryPrice, setEntryPrice] = useState<number>(1.085);
  const [leverage, setLeverage] = useState<number>(100);
  const [floatingPnL, setFloatingPnL] = useState<number>(0);
  const [isAdOpen, setIsAdOpen] = useState(false);

  const notionalValue = lotSize * contractUnitsPerLot * entryPrice;
  const requiredMargin = leverage > 0 ? notionalValue / leverage : 0;
  const equity = accountBalance + floatingPnL;
  const freeMargin = equity - requiredMargin;
  const marginLevel = requiredMargin > 0 ? (equity / requiredMargin) * 100 : 9999;

  const isHealthy = marginLevel >= 300;
  const isMarginCall = marginLevel < 100;

  const handleReset = () => {
    playClickSound('toggle');
    setAccountBalance(2000);
    setLotSize(0.5);
    setContractUnitsPerLot(100000);
    setEntryPrice(1.085);
    setLeverage(100);
    setFloatingPnL(0);
  };

  const dualReq = formatDualCurrency(requiredMargin, displayCurrency, fxRate);
  const dualFree = formatDualCurrency(freeMargin, displayCurrency, fxRate);

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-7 shadow-xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Margin, Free Margin & Leverage Health Calculator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify Required Margin collateral, Free Margin runway, and Margin Level (%) before opening leveraged positions.
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
                Account Balance ($)
              </label>
              <NumericField value={accountBalance} onChangeValue={setAccountBalance} min={0} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Trade Volume (Lots)
              </label>
              <NumericField value={lotSize} onChangeValue={setLotSize} min={0} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Contract Size / Lot
              </label>
              <NumericField
                value={contractUnitsPerLot}
                onChangeValue={setContractUnitsPerLot}
                min={1}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Asset Price ($)
              </label>
              <NumericField value={entryPrice} onChangeValue={setEntryPrice} min={0} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Floating P&L ($)
              </label>
              <NumericField value={floatingPnL} onChangeValue={setFloatingPnL} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
              <span>Account Leverage Ratio:</span>
              <span className="font-mono text-cyan-400 font-bold">1:{leverage}</span>
            </div>
            <input
              type="range"
              min="1"
              max="2000"
              step="10"
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value, 10) || 1)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {[20, 50, 100, 200, 500, 1000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    playClickSound('click');
                    setLeverage(preset);
                  }}
                  className={`text-xs px-2.5 py-0.5 rounded border font-mono ${
                    leverage === preset
                      ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  1:{preset}
                </button>
              ))}
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
            <span>Calculate Margin Health & Unlock Report</span>
          </button>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-5 shadow-lg">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">
                Margin Diagnostic Summary
              </span>
            </div>

            <div className="mb-4 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4 text-center">
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Required Margin Collateral
              </span>
              <div className="text-4xl font-extrabold text-cyan-300 font-mono">
                ${requiredMargin.toFixed(2)}
              </div>
              {dualReq && (
                <span className="text-xs font-mono font-bold text-amber-400 block mt-1">
                  ≈ {dualReq}
                </span>
              )}
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Free Margin Available:</span>
                <span
                  className={`font-mono font-bold ${
                    freeMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  ${freeMargin.toFixed(2)} {dualFree ? `(${dualFree})` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Account Margin Level:</span>
                <span
                  className={`font-mono font-bold flex items-center gap-1 ${
                    isHealthy ? 'text-emerald-400' : isMarginCall ? 'text-rose-400' : 'text-amber-400'
                  }`}
                >
                  {isHealthy ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                  {marginLevel > 9000 ? '9000%+' : `${marginLevel.toFixed(1)}%`}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Total Notional Exposure:</span>
                <span className="font-mono font-semibold text-slate-100">
                  ${Math.round(notionalValue).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            Institutional standard: maintain Margin Level above 500%. Below 100% triggers a Margin Call; 20%–50% triggers forced Stop-Out.
          </div>
        </div>
      </div>

      <AdInterstitialModal isOpen={isAdOpen} onComplete={() => setIsAdOpen(false)} />
    </div>
  );
};
