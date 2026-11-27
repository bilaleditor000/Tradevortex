import React, { useState } from 'react';
import { playClickSound } from '../utils/sound';
import { Flame, Layers, TrendingUp, AlertTriangle } from 'lucide-react';

interface LiqCluster {
  price: number;
  type: 'SHORT_LIQUIDATION' | 'LONG_LIQUIDATION';
  volumeMillions: number;
  leverageTier: string;
}

export const LiquidationHeatmap: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<'BTC' | 'ETH'>('BTC');

  const btcPrice = 68450;
  const ethPrice = 2740;

  const currentPrice = selectedCoin === 'BTC' ? btcPrice : ethPrice;

  // Mock liquidation clusters
  const clusters: LiqCluster[] = selectedCoin === 'BTC' ? [
    { price: 71200, type: 'SHORT_LIQUIDATION', volumeMillions: 380, leverageTier: '50x-100x' },
    { price: 70100, type: 'SHORT_LIQUIDATION', volumeMillions: 540, leverageTier: '25x-50x' },
    { price: 69400, type: 'SHORT_LIQUIDATION', volumeMillions: 720, leverageTier: '50x-100x' },
    { price: 68450, type: 'SHORT_LIQUIDATION', volumeMillions: 0, leverageTier: 'CURRENT' },
    { price: 67200, type: 'LONG_LIQUIDATION', volumeMillions: 650, leverageTier: '50x-100x' },
    { price: 65900, type: 'LONG_LIQUIDATION', volumeMillions: 890, leverageTier: '25x-50x' },
    { price: 64500, type: 'LONG_LIQUIDATION', volumeMillions: 420, leverageTier: '25x' }
  ] : [
    { price: 2950, type: 'SHORT_LIQUIDATION', volumeMillions: 140, leverageTier: '50x-100x' },
    { price: 2860, type: 'SHORT_LIQUIDATION', volumeMillions: 220, leverageTier: '25x-50x' },
    { price: 2790, type: 'SHORT_LIQUIDATION', volumeMillions: 310, leverageTier: '50x-100x' },
    { price: 2740, type: 'SHORT_LIQUIDATION', volumeMillions: 0, leverageTier: 'CURRENT' },
    { price: 2680, type: 'LONG_LIQUIDATION', volumeMillions: 280, leverageTier: '50x-100x' },
    { price: 2590, type: 'LONG_LIQUIDATION', volumeMillions: 390, leverageTier: '25x-50x' },
    { price: 2480, type: 'LONG_LIQUIDATION', volumeMillions: 180, leverageTier: '25x' }
  ];

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 md:p-6 shadow-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              Crypto Futures Liquidation Heatmap Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify high-density liquidation clusters where forced market stops trigger cascade volatility.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              setSelectedCoin('BTC');
            }}
            className={`text-xs px-3 py-1 rounded font-mono font-bold transition-colors ${
              selectedCoin === 'BTC' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            BTC/USDT
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              setSelectedCoin('ETH');
            }}
            className={`text-xs px-3 py-1 rounded font-mono font-bold transition-colors ${
              selectedCoin === 'ETH' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            ETH/USDT
          </button>
        </div>
      </div>

      {/* Current Price Banner */}
      <div className="flex items-center justify-between rounded-lg bg-slate-950/80 p-3 text-xs font-mono border border-slate-800">
        <span className="text-slate-400">Current Index Mark:</span>
        <span className="text-base font-bold text-cyan-300">${currentPrice.toLocaleString()}</span>
      </div>

      {/* Heatmap Visual Bars */}
      <div className="space-y-2">
        {clusters.map((c, i) => {
          const isCurrent = c.leverageTier === 'CURRENT';
          if (isCurrent) {
            return (
              <div
                key={i}
                className="my-3 flex items-center justify-between rounded-lg bg-cyan-950/50 border border-cyan-500/40 px-3 py-2 text-xs font-mono text-cyan-300 font-bold"
              >
                <span>CURRENT MARKET PRICE: ${c.price.toLocaleString()}</span>
                <span>LIQUIDITY EQUILIBRIUM</span>
              </div>
            );
          }

          const isShortLiq = c.type === 'SHORT_LIQUIDATION';
          const maxVolume = 1000;
          const barWidthPercent = Math.min(100, Math.round((c.volumeMillions / maxVolume) * 100));

          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">
                  ${c.price.toLocaleString()}{' '}
                  <span className="text-slate-500 text-[10px]">({c.leverageTier})</span>
                </span>
                <span className={isShortLiq ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {isShortLiq ? 'Short Liq Pool:' : 'Long Liq Pool:'} ${c.volumeMillions}M
                </span>
              </div>

              <div className="h-3 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800/60">
                <div
                  style={{ width: `${barWidthPercent}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    isShortLiq
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
        Estimated cumulative liquidation pools from top Tier-1 derivatives exchanges (Binance, Bybit, OKX). Market makers frequently hunt these pools before sharp reversals.
      </div>
    </div>
  );
};
