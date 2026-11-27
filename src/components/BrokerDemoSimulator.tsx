import React, { useState, useEffect, useRef } from 'react';
import { Broker, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { playClickSound } from '../utils/sound';
import {
  MarketAssetItem,
  TOP_10_FEATURED_ASSETS,
  searchAllMarketCoins,
  fetchLiveAssetPrice
} from '../data/assetsCatalog';
import { NumericField } from './calculators/NumericField';
import {
  TrendingUp,
  TrendingDown,
  RotateCcw,
  ExternalLink,
  Search,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface Position {
  id: string;
  asset: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice: number;
  sizeLots: number;
  leverage: number;
  floatingPnL: number;
  openTime: string;
}

interface BrokerDemoSimulatorProps {
  brokers: Broker[];
  language?: Language;
}

function getAssetSpec(asset: MarketAssetItem) {
  const ticker = asset.ticker.toUpperCase();
  if (ticker.includes('EUR/USD') || ticker.includes('GBP/USD') || ticker.includes('AUD/USD')) {
    return { pipScale: 10000, pipValueLot: 10, vol: 0.00025 };
  }
  if (ticker.includes('JPY')) {
    return { pipScale: 100, pipValueLot: 6.67, vol: 0.02 };
  }
  if (ticker.includes('XAU') || ticker.includes('GOLD')) {
    return { pipScale: 1, pipValueLot: 100, vol: 0.85 };
  }
  if (ticker.includes('US30') || ticker.includes('NAS100') || ticker.includes('SPX')) {
    return { pipScale: 1, pipValueLot: 1, vol: 12 };
  }
  // Crypto & general assets: 1 lot = 1 coin/contract unit
  const baseVol = Math.max(0.000001, (asset.approxPrice || 100) * 0.00045);
  return { pipScale: 1, pipValueLot: 1, vol: baseVol };
}

export const BrokerDemoSimulator: React.FC<BrokerDemoSimulatorProps> = ({
  brokers,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [selectedBrokerId, setSelectedBrokerId] = useState<string>(brokers[0]?.id || 'exness');
  const [selectedAsset, setSelectedAsset] = useState<MarketAssetItem>(TOP_10_FEATURED_ASSETS[1]); // BTC default
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MarketAssetItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [virtualBalance, setVirtualBalance] = useState<number>(10000);
  const [lotSize, setLotSize] = useState<number>(1.0);
  const [leverage, setLeverage] = useState<number>(100);
  const [positions, setPositions] = useState<Position[]>([]);
  const [chartPrices, setChartPrices] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(91250);
  const [orderNotification, setOrderNotification] = useState<string | null>(null);

  const targetPriceRef = useRef<number>(91250);
  const displayPriceRef = useRef<number>(91250);
  const activeAssetRef = useRef<MarketAssetItem>(selectedAsset);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeAssetRef.current = selectedAsset;
  }, [selectedAsset]);

  // Close search dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Debounced universal coin search
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults(TOP_10_FEATURED_ASSETS);
        return;
      }
      const res = await searchAllMarketCoins(searchQuery);
      if (active) setSearchResults(res);
    }, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Initialize live base price and series when asset changes
  useEffect(() => {
    let mounted = true;
    const spec = getAssetSpec(selectedAsset);
    const seedPrice = selectedAsset.approxPrice > 0 ? selectedAsset.approxPrice : 100;

    targetPriceRef.current = seedPrice;
    displayPriceRef.current = seedPrice;
    setCurrentPrice(seedPrice);

    const initialSeries = Array.from({ length: 48 }, (_, i) => {
      const variation = Math.sin(i / 4) * spec.vol * 2.5 + (Math.random() - 0.5) * spec.vol;
      return Math.max(0.0000001, seedPrice + variation);
    });
    setChartPrices(initialSeries);

    fetchLiveAssetPrice(selectedAsset).then((quote) => {
      if (!mounted || quote.price <= 0) return;
      targetPriceRef.current = quote.price;
      displayPriceRef.current = quote.price;
      setCurrentPrice(quote.price);
      const qVol = Math.max(0.000001, quote.price * 0.00045);
      setChartPrices(
        Array.from({ length: 48 }, (_, i) =>
          Math.max(0.0000001, quote.price + Math.sin(i / 4) * qVol * 2 + (Math.random() - 0.5) * qVol)
        )
      );
    });

    return () => {
      mounted = false;
    };
  }, [selectedAsset]);

  // Smooth 60fps requestAnimationFrame interpolation + periodic micro-tick targets
  useEffect(() => {
    const spec = getAssetSpec(selectedAsset);
    const stepInterval = setInterval(() => {
      const vol = Math.max(spec.vol, targetPriceRef.current * 0.00035);
      const delta = (Math.random() - 0.492) * vol;
      targetPriceRef.current = Math.max(0.0000001, targetPriceRef.current + delta);
    }, 650);

    let rafId = 0;
    let frameCount = 0;

    const animate = () => {
      const currentDisplay = displayPriceRef.current;
      const target = targetPriceRef.current;
      const next = currentDisplay + (target - currentDisplay) * 0.08;
      displayPriceRef.current = next;
      frameCount += 1;

      // Update React state at ~20fps so chart line glides seamlessly without excess re-renders
      if (frameCount % 3 === 0) {
        const assetNow = activeAssetRef.current;
        const decimals = next < 0.01 ? 7 : next < 2 ? 4 : 2;
        const rounded = Number(next.toFixed(decimals));
        setCurrentPrice(rounded);

        setChartPrices((old) => {
          if (old.length === 0) return [rounded];
          return [...old.slice(1), next];
        });

        setPositions((oldPositions) =>
          oldPositions.map((pos) => {
            if (pos.asset !== assetNow.ticker) return pos;
            const posSpec = getAssetSpec(assetNow);
            const diff = pos.direction === 'BUY' ? next - pos.entryPrice : pos.entryPrice - next;
            const pips = diff * posSpec.pipScale;
            const pnl = Number((pips * pos.sizeLots * posSpec.pipValueLot).toFixed(2));
            return {
              ...pos,
              currentPrice: rounded,
              floatingPnL: pnl
            };
          })
        );
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      clearInterval(stepInterval);
      cancelAnimationFrame(rafId);
    };
  }, [selectedAsset]);

  const activeBroker = brokers.find((b) => b.id === selectedBrokerId) || brokers[0];

  const handleOpenTrade = (direction: 'BUY' | 'SELL') => {
    playClickSound('calculate');
    const safeLots = Math.max(0.01, lotSize || 0.1);
    const newPosition: Position = {
      id: `pos_${Date.now()}`,
      asset: selectedAsset.ticker,
      direction,
      entryPrice: currentPrice,
      currentPrice,
      sizeLots: safeLots,
      leverage,
      floatingPnL: 0,
      openTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setPositions((prev) => [newPosition, ...prev]);
    setOrderNotification(`${direction} ${safeLots} Lot ${selectedAsset.ticker} executed at ${currentPrice}`);
    setTimeout(() => setOrderNotification(null), 3000);
  };

  const handleClosePosition = (id: string) => {
    playClickSound('toggle');
    const target = positions.find((p) => p.id === id);
    if (target) {
      setVirtualBalance((prev) => Number((prev + target.floatingPnL).toFixed(2)));
      setPositions((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleResetBalance = () => {
    playClickSound('toggle');
    setVirtualBalance(10000);
    setPositions([]);
  };

  const totalFloatingPnL = positions.reduce((acc, p) => acc + p.floatingPnL, 0);
  const totalEquity = Number((virtualBalance + totalFloatingPnL).toFixed(2));

  const minPrice = Math.min(...chartPrices, currentPrice);
  const maxPrice = Math.max(...chartPrices, currentPrice);
  const priceRange = maxPrice - minPrice || 0.0001;
  const svgWidth = 600;
  const svgHeight = 180;

  const points = chartPrices
    .map((p, i) => {
      const x = (i / Math.max(1, chartPrices.length - 1)) * svgWidth;
      const y = svgHeight - ((p - minPrice) / priceRange) * (svgHeight - 24) - 12;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = points ? `0,${svgHeight} ${points} ${svgWidth},${svgHeight}` : '';
  const isPriceUp = chartPrices.length > 1 && chartPrices[chartPrices.length - 1] >= chartPrices[chartPrices.length - 2];

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-5 sm:p-7 shadow-2xl shadow-cyan-950/30 space-y-6">
      {/* Top Simulator Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-lg font-bold text-white">
              {t.demoTitle}
            </h3>
            <span className="rounded bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-bold">
              $10,000 DEMO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Search any cryptocurrency, Gold, Forex pair, or Index and practice real-time simulated execution risk-free.
          </p>
        </div>

        {/* Clean Broker Selector (no mini-deposit clutter) */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Execution Desk:</span>
          <select
            value={selectedBrokerId}
            onChange={(e) => {
              playClickSound('click');
              setSelectedBrokerId(e.target.value);
            }}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
          >
            {brokers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Account Virtual Equity Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-center text-xs">
        <div>
          <span className="text-slate-400 block text-[11px] mb-0.5">{t.virtualBalance}</span>
          <span className="font-mono text-sm font-bold text-white">
            ${virtualBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] mb-0.5">{t.floatingPnl}</span>
          <span
            className={`font-mono text-sm font-bold ${
              totalFloatingPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalFloatingPnL >= 0 ? '+' : '-'}${Math.abs(totalFloatingPnL).toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] mb-0.5">{t.realTimeEquity}</span>
          <span className="font-mono text-sm font-bold text-cyan-300">
            ${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={handleResetBalance}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{t.resetDemo}</span>
          </button>
        </div>
      </div>

      {/* Main Terminal View: Chart & Order Pad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Live Smooth Chart Simulation + Universal Coin Search */}
        <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            {/* Universal Coin Search in Demo Terminal */}
            <div ref={searchBoxRef} className="relative flex-1 max-w-xs">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  placeholder={t.searchAnyCoin}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {showDropdown && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 z-30 max-h-56 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 shadow-2xl divide-y divide-slate-800">
                  {searchResults.slice(0, 12).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        playClickSound('click');
                        setSelectedAsset(item);
                        setSearchQuery('');
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800 text-xs transition-colors"
                    >
                      <div>
                        <span className="font-bold text-white block">{item.ticker}</span>
                        <span className="text-[10px] text-slate-400">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400">{item.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Current Tick Price Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400">{selectedAsset.ticker}</span>
              <span className="text-xs text-slate-400 font-mono">Live Bid:</span>
              <span
                className={`font-mono text-base font-extrabold flex items-center gap-1 ${
                  isPriceUp ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPriceUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {currentPrice.toLocaleString('en-US', {
                  maximumFractionDigits: currentPrice < 1 ? 6 : 2
                })}
              </span>
            </div>
          </div>

          {/* Quick Asset Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {TOP_10_FEATURED_ASSETS.slice(0, 8).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  playClickSound('click');
                  setSelectedAsset(a);
                }}
                className={`text-[11px] px-2.5 py-1 rounded font-mono transition-colors shrink-0 ${
                  selectedAsset.id === a.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {a.ticker}
              </button>
            ))}
          </div>

          {/* Smooth 60fps Interpolated SVG Chart */}
          <div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800/60">
            <svg
              className="w-full h-full"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="demoChartArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {areaPoints && <polygon fill="url(#demoChartArea)" points={areaPoints} />}
              {points && (
                <polyline
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  points={points}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>

            <div className="absolute top-2 left-3 text-[10px] text-slate-500 font-mono">
              High: {maxPrice.toFixed(currentPrice < 1 ? 6 : 2)} | Low: {minPrice.toFixed(currentPrice < 1 ? 6 : 2)} · 60fps Smooth Feed
            </div>
          </div>

          {orderNotification && (
            <div className="rounded-lg bg-cyan-950/60 border border-cyan-500/40 p-2 text-center text-xs text-cyan-300 font-mono">
              ✓ {orderNotification}
            </div>
          )}
        </div>

        {/* Right Side: Execution Controls */}
        <div className="lg:col-span-4 rounded-xl border border-cyan-500/25 bg-slate-950/90 p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                {activeBroker?.name || 'TradeVortex'} Order Pad
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                Spread: {activeBroker?.spreadFrom || '0.0 Pips'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Order Volume (Lots / Contracts)
              </label>
              <NumericField
                value={lotSize}
                onChangeValue={setLotSize}
                min={0.01}
                fallbackOnEmpty={0}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
              <div className="flex gap-1.5 mt-1.5">
                {[0.1, 0.5, 1.0, 2.0].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setLotSize(quick)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>Leverage:</span>
                <span className="font-mono text-cyan-400 font-bold">1:{leverage}</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value, 10) || 100)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Instant Buy / Sell Buttons */}
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleOpenTrade('BUY')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 uppercase"
              >
                <TrendingUp className="h-4 w-4" />
                <span>BUY (Long)</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenTrade('SELL')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 py-3 text-xs font-bold text-slate-950 hover:bg-rose-400 transition-all shadow-md shadow-rose-500/20 uppercase"
              >
                <TrendingDown className="h-4 w-4" />
                <span>SELL (Short)</span>
              </button>
            </div>

            {activeBroker && (
              <a
                href={activeBroker.affiliateUrl}
                target="_blank"
                rel="sponsored nofollow"
                onClick={() => playClickSound('calculate')}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all"
              >
                <span>Open Live Account on {activeBroker.name}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Active Positions Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Active Open Simulator Positions ({positions.length})
          </h4>
        </div>

        {positions.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-center text-xs text-slate-400">
            No open simulator positions. Search any coin or select a market above and click BUY or SELL.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-3 py-2">Asset</th>
                  <th className="px-3 py-2">Side</th>
                  <th className="px-3 py-2">Volume</th>
                  <th className="px-3 py-2">Entry</th>
                  <th className="px-3 py-2">Current</th>
                  <th className="px-3 py-2">Floating PnL</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {positions.map((pos) => (
                  <tr key={pos.id} className="hover:bg-slate-900/40">
                    <td className="px-3 py-2 font-bold text-white">{pos.asset}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          pos.direction === 'BUY'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {pos.direction}
                      </span>
                    </td>
                    <td className="px-3 py-2">{pos.sizeLots} Lots</td>
                    <td className="px-3 py-2">{pos.entryPrice}</td>
                    <td className="px-3 py-2">{pos.currentPrice}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`font-bold ${
                          pos.floatingPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {pos.floatingPnL >= 0 ? '+' : '-'}${Math.abs(pos.floatingPnL).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleClosePosition(pos.id)}
                        className="rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] text-slate-200 transition-colors"
                      >
                        Close Trade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
