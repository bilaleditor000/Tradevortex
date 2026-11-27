import React, { useState } from 'react';
import { playClickSound } from '../../utils/sound';
import { RotateCcw, Copy, Check, Sparkles } from 'lucide-react';
import { AdInterstitialModal } from '../AdInterstitialModal';
import { NumericField, CalculatorCurrencyProps, formatDualCurrency } from './NumericField';

interface AssetSpec {
  name: string;
  ticker: string;
  contractMultiplier: number;
  defaultPrice: number;
  stepPrice: number;
  unitLabel: string;
  category: 'Metals' | 'Index' | 'Commodity';
  note: string;
}

const ASSETS: AssetSpec[] = [
  {
    name: 'Gold (Spot Ounce)',
    ticker: 'XAU/USD',
    contractMultiplier: 100,
    defaultPrice: 2650.0,
    stepPrice: 0.1,
    unitLabel: 'Troy Ounces',
    category: 'Metals',
    note: '1 standard lot represents 100 troy ounces. A $1.00 price move equals $100 profit/loss.'
  },
  {
    name: 'US30 (Dow Jones 30)',
    ticker: 'US30',
    contractMultiplier: 1,
    defaultPrice: 42200,
    stepPrice: 1,
    unitLabel: 'Index Points',
    category: 'Index',
    note: 'Standard CFD contract: 1 point move = $1.00 per 1.00 lot. Large daily swings (300-600 points).'
  },
  {
    name: 'NAS100 (Nasdaq 100)',
    ticker: 'NAS100',
    contractMultiplier: 20,
    defaultPrice: 20150,
    stepPrice: 0.25,
    unitLabel: 'Index Points',
    category: 'Index',
    note: 'Tech heavy and highly volatile. Check if your broker treats 1 lot as $1 or $20 per point.'
  },
  {
    name: 'SPX500 (S&P 500)',
    ticker: 'SPX500',
    contractMultiplier: 50,
    defaultPrice: 5750,
    stepPrice: 0.1,
    unitLabel: 'Index Points',
    category: 'Index',
    note: 'Benchmark US index. Smooth trends, lower slippage during regular US trading hours.'
  },
  {
    name: 'GER40 (German DAX)',
    ticker: 'GER40',
    contractMultiplier: 25,
    defaultPrice: 19100,
    stepPrice: 0.5,
    unitLabel: 'Index Points',
    category: 'Index',
    note: 'Primary European equities benchmark. Peak liquidity during London/Frankfurt open.'
  },
  {
    name: 'US Crude Oil (WTI)',
    ticker: 'USOIL',
    contractMultiplier: 1000,
    defaultPrice: 74.5,
    stepPrice: 0.01,
    unitLabel: 'Barrels',
    category: 'Commodity',
    note: '1 standard lot = 1,000 barrels. A $1.00 price shift equals $1,000 profit/loss.'
  }
];

export const GoldIndicesCalc: React.FC<CalculatorCurrencyProps> = ({
  displayCurrency = 'USD',
  fxRate = 1
}) => {
  const [selectedTicker, setSelectedTicker] = useState('XAU/USD');
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [entryPrice, setEntryPrice] = useState<number>(2650.0);
  const [stopLossPrice, setStopLossPrice] = useState<number>(2642.0);
  const [copied, setCopied] = useState(false);
  const [isAdOpen, setIsAdOpen] = useState(false);

  const asset = ASSETS.find((a) => a.ticker === selectedTicker) || ASSETS[0];

  const handleAssetChange = (ticker: string) => {
    playClickSound('click');
    setSelectedTicker(ticker);
    const targetAsset = ASSETS.find((a) => a.ticker === ticker);
    if (targetAsset) {
      setEntryPrice(targetAsset.defaultPrice);
      if (ticker === 'XAU/USD') {
        setStopLossPrice(targetAsset.defaultPrice - 8);
      } else if (ticker === 'US30') {
        setStopLossPrice(targetAsset.defaultPrice - 120);
      } else if (ticker === 'NAS100') {
        setStopLossPrice(targetAsset.defaultPrice - 60);
      } else if (ticker === 'SPX500') {
        setStopLossPrice(targetAsset.defaultPrice - 20);
      } else if (ticker === 'GER40') {
        setStopLossPrice(targetAsset.defaultPrice - 50);
      } else {
        setStopLossPrice(targetAsset.defaultPrice - 1.2);
      }
    }
  };

  const cashRisk = (balance * riskPercent) / 100;
  const priceDistance = Math.abs(entryPrice - stopLossPrice);

  const calculatedLots =
    priceDistance > 0 && asset.contractMultiplier > 0
      ? cashRisk / (priceDistance * asset.contractMultiplier)
      : 0;

  const standardLots = Math.max(0, parseFloat(calculatedLots.toFixed(2)));
  const miniLots = Math.max(0, parseFloat((calculatedLots * 10).toFixed(2)));
  const contractValue = standardLots * entryPrice * asset.contractMultiplier;

  const dualRisk = formatDualCurrency(cashRisk, displayCurrency, fxRate);
  const dualNotional = formatDualCurrency(contractValue, displayCurrency, fxRate);

  const handleCopy = () => {
    playClickSound('click');
    navigator.clipboard.writeText(
      `${asset.name} Position: ${standardLots} Lots | Risk: $${cashRisk.toFixed(
        2
      )}${dualRisk ? ` (${dualRisk})` : ''} | SL Distance: ${priceDistance.toFixed(2)}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    playClickSound('toggle');
    handleAssetChange('XAU/USD');
    setBalance(10000);
    setRiskPercent(1.5);
  };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-7 shadow-xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            Gold & Indices Position Size Calculator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Specialized contract calculator for Gold (XAU/USD), US30, NAS100, S&P 500, DAX, and Crude Oil.
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
          {/* Asset Selection Buttons */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Commodity or Index Asset
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {ASSETS.map((a) => (
                <button
                  key={a.ticker}
                  type="button"
                  onClick={() => handleAssetChange(a.ticker)}
                  className={`px-2.5 py-2 rounded-lg border text-xs font-semibold transition-all ${
                    selectedTicker === a.ticker
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-sm shadow-cyan-500/20 font-mono'
                      : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:text-slate-200 hover:border-slate-700 font-mono'
                  }`}
                >
                  {a.ticker}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-cyan-400/90 mt-1.5 italic">
              {asset.note}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Account Balance ($)
              </label>
              <NumericField value={balance} onChangeValue={setBalance} min={0} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Risk Cap (%)
              </label>
              <NumericField value={riskPercent} onChangeValue={setRiskPercent} min={0} max={100} />
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
                Stop Loss Price ($)
              </label>
              <NumericField value={stopLossPrice} onChangeValue={setStopLossPrice} min={0} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound('calculate');
              setIsAdOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-3 text-xs font-extrabold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-md shadow-cyan-500/25 uppercase tracking-wide mt-4"
          >
            <Sparkles className="h-4 w-4" />
            <span>Calculate Contract Size & Unlock Report</span>
          </button>
        </div>

        {/* Output Diagnostics Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-5 shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">
                {asset.ticker} Recommended Lots
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

            <div className="mb-4 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4 text-center">
              <span className="text-xs font-medium text-slate-400 block mb-1">
                Calculated Lot Size
              </span>
              <div className="text-4xl font-extrabold text-cyan-300 font-mono tracking-tight drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                {standardLots.toFixed(2)}
              </div>
              <span className="text-[11px] text-cyan-400/80 mt-1 block">
                {asset.name} ({asset.unitLabel})
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Exact Stop Loss Distance:</span>
                <span className="font-mono font-semibold text-slate-200">
                  {priceDistance.toFixed(2)} points / $
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Maximum Money Risked:</span>
                <span className="font-mono font-semibold text-rose-400">
                  ${cashRisk.toFixed(2)} {dualRisk ? `(${dualRisk})` : ''} ({riskPercent}%)
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Mini Lot Equivalent (0.1):</span>
                <span className="font-mono font-semibold text-cyan-200">
                  {miniLots.toFixed(1)} Mini Lots
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Total Nominal Notional Value:</span>
                <span className="font-mono font-semibold text-slate-100">
                  ${Math.round(contractValue).toLocaleString()} {dualNotional ? `(${dualNotional})` : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            Formula: Stop Distance × Contract Units. Gold swings $20+ quickly; strictly executing {standardLots} lots ensures you lose no more than ${cashRisk.toFixed(2)}.
          </div>
        </div>
      </div>

      <AdInterstitialModal
        isOpen={isAdOpen}
        onComplete={() => setIsAdOpen(false)}
      />
    </div>
  );
};
