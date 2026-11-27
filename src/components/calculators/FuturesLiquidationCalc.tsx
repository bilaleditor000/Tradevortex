import React, { useState } from 'react';
import { playClickSound } from '../../utils/sound';
import { RotateCcw, Copy, Check, AlertTriangle, ShieldCheck, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { AdInterstitialModal } from '../AdInterstitialModal';
import { NumericField, CalculatorCurrencyProps, formatDualCurrency } from './NumericField';
import { getAdminSettings } from '../../data/adminSettings';

export const FuturesLiquidationCalc: React.FC<CalculatorCurrencyProps> = ({
  displayCurrency = 'USD',
  fxRate = 1
}) => {
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [marginMode, setMarginMode] = useState<'ISOLATED' | 'CROSS'>('ISOLATED');
  const [entryPrice, setEntryPrice] = useState<number>(68000);
  const [accountBalance, setAccountBalance] = useState<number>(5000);
  const [positionMargin, setPositionMargin] = useState<number>(500);
  const [leverage, setLeverage] = useState<number>(20);
  const [maintenanceMarginRate, setMaintenanceMarginRate] = useState<number>(0.5);
  const [copied, setCopied] = useState(false);
  const [isAdOpen, setIsAdOpen] = useState(false);

  const settings = getAdminSettings();
  const quotexUrl = settings.brokerLinks?.quotex || 'https://broker-qx.pro/sign-up/?lid=tradevortex';

  const notionalPosition = positionMargin * leverage;
  const contractUnits = entryPrice > 0 ? notionalPosition / entryPrice : 0;
  const mmrDecimal = maintenanceMarginRate / 100;

  let liquidationPrice = 0;
  if (direction === 'LONG') {
    liquidationPrice = entryPrice * (1 - 1 / leverage + mmrDecimal);
  } else {
    liquidationPrice = entryPrice * (1 + 1 / leverage - mmrDecimal);
  }

  if (marginMode === 'CROSS') {
    const extraBalance = Math.max(0, accountBalance - positionMargin);
    const bufferDistance = contractUnits > 0 ? extraBalance / contractUnits : 0;
    if (direction === 'LONG') {
      liquidationPrice = Math.max(0, liquidationPrice - bufferDistance);
    } else {
      liquidationPrice = liquidationPrice + bufferDistance;
    }
  }

  const distanceDollars = Math.abs(entryPrice - liquidationPrice);
  const distancePercent = entryPrice > 0 ? (distanceDollars / entryPrice) * 100 : 0;

  const isHighRisk = distancePercent < 5;
  const isModerateRisk = distancePercent >= 5 && distancePercent < 15;

  const dualNotional = formatDualCurrency(notionalPosition, displayCurrency, fxRate);
  const dualLiq = formatDualCurrency(liquidationPrice, displayCurrency, fxRate);

  const handleCopy = () => {
    playClickSound('click');
    navigator.clipboard.writeText(
      `Futures Liquidation: ${direction} ${leverage}x | Entry: $${entryPrice} | Liquidation: $${liquidationPrice.toFixed(
        2
      )}${dualLiq ? ` (${dualLiq})` : ''} (Distance: ${distancePercent.toFixed(2)}%)`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    playClickSound('toggle');
    setDirection('LONG');
    setMarginMode('ISOLATED');
    setEntryPrice(68000);
    setAccountBalance(5000);
    setPositionMargin(500);
    setLeverage(20);
    setMaintenanceMarginRate(0.5);
  };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-7 shadow-xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            Futures Position Size & Liquidation Price Calculator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Predict your exact bankruptcy and forced liquidation threshold before placing leveraged crypto or index orders.
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
        {/* Input Parameters */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Position Direction
              </label>
              <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound('click');
                    setDirection('LONG');
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-bold rounded transition-colors ${
                    direction === 'LONG'
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
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-bold rounded transition-colors ${
                    direction === 'SHORT'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>SHORT</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Margin Mode
              </label>
              <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound('click');
                    setMarginMode('ISOLATED');
                  }}
                  className={`flex-1 py-1 text-xs font-bold rounded transition-colors ${
                    marginMode === 'ISOLATED'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Isolated
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound('click');
                    setMarginMode('CROSS');
                  }}
                  className={`flex-1 py-1 text-xs font-bold rounded transition-colors ${
                    marginMode === 'CROSS'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Cross Margin
                </button>
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
                Position Margin ($ Invested)
              </label>
              <NumericField value={positionMargin} onChangeValue={setPositionMargin} min={0} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                <span>Leverage:</span>
                <span className="font-mono text-cyan-400 font-bold">{leverage}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value, 10) || 1)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {marginMode === 'CROSS' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Total Wallet Balance ($)
                </label>
                <NumericField value={accountBalance} onChangeValue={setAccountBalance} min={0} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Maintenance Margin Rate (MMR %)
            </label>
            <NumericField value={maintenanceMarginRate} onChangeValue={setMaintenanceMarginRate} min={0} />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Default BTC/ETH futures MMR is 0.4%–0.5% on tier-1 exchanges (Binance, Bybit).
            </span>
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
            <span>Recalculate & Unlock Liquidation Matrix</span>
          </button>
        </div>

        {/* Results Output Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-5 shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">
                Liquidation Safety Diagnostics
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

            <div
              className={`mb-4 rounded-lg border p-4 text-center ${
                isHighRisk
                  ? 'border-rose-500/40 bg-rose-950/20'
                  : isModerateRisk
                  ? 'border-amber-500/40 bg-amber-950/20'
                  : 'border-emerald-500/40 bg-emerald-950/20'
              }`}
            >
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Estimated Liquidation Price
              </span>
              <div
                className={`text-4xl font-extrabold font-mono tracking-tight ${
                  isHighRisk
                    ? 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                    : isModerateRisk
                    ? 'text-amber-300'
                    : 'text-emerald-300'
                }`}
              >
                ${liquidationPrice.toFixed(2)}
              </div>
              {dualLiq && (
                <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                  ≈ {dualLiq} ({displayCurrency})
                </div>
              )}
              <div className="flex items-center justify-center gap-1.5 mt-2 text-xs font-mono font-bold">
                {isHighRisk ? (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> HIGH RISK: Liquidation Distance is only {distancePercent.toFixed(2)}%
                  </span>
                ) : isModerateRisk ? (
                  <span className="text-amber-300 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> MODERATE: {distancePercent.toFixed(2)}% buffer
                  </span>
                ) : (
                  <span className="text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> HEALTHY BUFFER: {distancePercent.toFixed(2)}% to Liquidation
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Position Notional:</span>
                <span className="font-mono font-semibold text-slate-100">
                  ${notionalPosition.toLocaleString()} {dualNotional ? `(${dualNotional})` : ''} · {contractUnits.toFixed(4)} Coins
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Distance to Bankruptcy:</span>
                <span className="font-mono font-semibold text-rose-300">
                  ${distanceDollars.toFixed(2)} ({distancePercent.toFixed(2)}%)
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Margin Mode:</span>
                <span className="font-mono font-semibold text-cyan-300">
                  {marginMode}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Maintenance Margin Rate:</span>
                <span className="font-mono font-semibold text-slate-200">
                  {maintenanceMarginRate}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            Formula: For {direction} at {leverage}x, liquidation occurs when price moves against you by approximately {(100 / leverage).toFixed(1)}%. Place stop loss well ahead of ${liquidationPrice.toFixed(2)}.
          </div>
        </div>
      </div>

      <AdInterstitialModal
        isOpen={isAdOpen}
        onComplete={() => setIsAdOpen(false)}
        brokerName="Quotex"
        brokerAffiliateUrl={quotexUrl}
      />
    </div>
  );
};
