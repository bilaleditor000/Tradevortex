import React, { useEffect, useRef, useState } from 'react';
import { MarketAssetItem, searchAllMarketCoins, TOP_10_FEATURED_ASSETS } from '../data/assetsCatalog';
import { playClickSound } from '../utils/sound';
import { Search, Loader2, X } from 'lucide-react';

interface TradingViewTechnicalGaugeProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  theme?: 'dark' | 'light';
  height?: number;
  allowSearch?: boolean;
}

export const TradingViewTechnicalGauge: React.FC<TradingViewTechnicalGaugeProps> = ({
  symbol = 'OANDA:XAUUSD',
  onSymbolChange,
  theme = 'dark',
  height = 420,
  allowSearch = true
}) => {
  const [internalSymbol, setInternalSymbol] = useState(symbol);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MarketAssetItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeSymbol = onSymbolChange ? symbol : internalSymbol;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setInternalSymbol(symbol);
  }, [symbol]);

  useEffect(() => {
    let active = true;
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      const list = await searchAllMarketCoins(q);
      if (active) {
        setResults(list);
        setSearching(false);
      }
    }, 220);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [query]);

  useEffect(() => {
    if (!isInView) return;
    const container = containerRef.current;
    if (!container) return;

    try {
      container.innerHTML = '';
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      container.appendChild(widgetDiv);

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        interval: '1h',
        width: '100%',
        isTransparent: false,
        height: height,
        symbol: activeSymbol,
        showIntervalTabs: true,
        displayMode: 'multiple',
        locale: 'en',
        colorTheme: theme === 'dark' ? 'dark' : 'light'
      });

      container.appendChild(script);
    } catch {
      // Safe error catch
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [isInView, activeSymbol, theme, height]);

  const applySymbol = (newSym: string) => {
    playClickSound('click');
    if (onSymbolChange) {
      onSymbolChange(newSym);
    } else {
      setInternalSymbol(newSym);
    }
    setDropdownOpen(false);
    setQuery('');
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-900/60 shadow-xl shadow-cyan-950/20">
      <div className="border-b border-slate-800 bg-slate-950/80 px-4 py-2.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Technical Sentiment & Buy/Sell Consensus
            </span>
          </div>
          <span className="font-mono text-xs text-cyan-400 font-bold">{activeSymbol}</span>
        </div>

        {allowSearch && (
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-cyan-400" />
              <input
                type="text"
                value={query}
                onFocus={() => setDropdownOpen(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                placeholder="Search any coin or asset for technical buy/sell signals..."
                className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-8 pr-8 py-1.5 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
              />
              {searching ? (
                <Loader2 className="absolute right-2.5 top-2 h-3.5 w-3.5 text-cyan-400 animate-spin" />
              ) : query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                  }}
                  className="absolute right-2.5 top-1.5 text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>

            {dropdownOpen && query.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-lg border border-cyan-500/40 bg-slate-900 shadow-2xl z-40 divide-y divide-slate-800">
                {results.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => applySymbol(item.symbol)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left text-xs hover:bg-slate-800 transition-colors"
                  >
                    <div>
                      <span className="font-mono font-bold text-cyan-300 mr-2">{item.ticker}</span>
                      <span className="text-slate-200">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{item.symbol}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1 overflow-x-auto pt-2">
              {TOP_10_FEATURED_ASSETS.slice(0, 6).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => applySymbol(a.symbol)}
                  className={`whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    activeSymbol === a.symbol
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {a.ticker}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className="tradingview-widget-container w-full"
        style={{ minHeight: `${height}px` }}
      />
    </div>
  );
};
