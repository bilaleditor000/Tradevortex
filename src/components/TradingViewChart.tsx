import React, { useState, useEffect, useRef, useId } from 'react';
import {
  TOP_10_FEATURED_ASSETS,
  EXTENDED_MARKET_CATALOG,
  MarketAssetItem,
  searchAllMarketCoins
} from '../data/assetsCatalog';
import { playClickSound } from '../utils/sound';
import { Search, Sparkles, X, Loader2 } from 'lucide-react';

interface TradingViewChartProps {
  theme?: 'dark' | 'light';
  defaultSymbol?: string;
  searchPlaceholder?: string;
}

declare global {
  interface Window {
    TradingView?: {
      widget: new (config: Record<string, unknown>) => unknown;
    };
  }
}

let tvScriptPromise: Promise<boolean> | null = null;

function loadTradingViewTvScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.TradingView && typeof window.TradingView.widget === 'function') {
    return Promise.resolve(true);
  }
  if (tvScriptPromise) return tvScriptPromise;

  tvScriptPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
    if (existing) {
      const check = setInterval(() => {
        if (window.TradingView && typeof window.TradingView.widget === 'function') {
          clearInterval(check);
          resolve(true);
        }
      }, 100);
      setTimeout(() => {
        clearInterval(check);
        resolve(Boolean(window.TradingView?.widget));
      }, 4000);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      resolve(Boolean(window.TradingView?.widget));
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  return tvScriptPromise;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  theme = 'dark',
  defaultSymbol = 'OANDA:XAUUSD',
  searchPlaceholder = 'Search any coin, meme token, forex, gold, or index (e.g. BTC, PEPE, SUI, XAUUSD)...'
}) => {
  const initialAsset =
    EXTENDED_MARKET_CATALOG.find((a) => a.symbol === defaultSymbol) || TOP_10_FEATURED_ASSETS[0];

  const [selectedAsset, setSelectedAsset] = useState<MarketAssetItem>(initialAsset);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MarketAssetItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const uniqueId = useId().replace(/:/g, '');
  const containerId = `tv_chart_${uniqueId}`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
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

  // Close search dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Live debounced search across all crypto coins & markets
  useEffect(() => {
    let active = true;
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchAllMarketCoins(trimmed);
      if (active) {
        setSearchResults(results);
        setIsSearching(false);
      }
    }, 220);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Initialize official TradingView tv.js widget with allow_symbol_change: true once near viewport
  useEffect(() => {
    if (!isInView) return;
    let cancelled = false;
    setUseIframeFallback(false);

    const mountWidget = async () => {
      const loaded = await loadTradingViewTvScript();
      if (cancelled) return;

      if (!loaded || !window.TradingView?.widget || !containerRef.current) {
        setUseIframeFallback(true);
        return;
      }

      try {
        containerRef.current.innerHTML = '';
        new window.TradingView.widget({
          autosize: true,
          symbol: selectedAsset.symbol,
          interval: '60',
          timezone: 'Etc/UTC',
          theme: theme === 'dark' ? 'dark' : 'light',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          allow_symbol_change: true,
          hide_side_toolbar: false,
          withdateranges: true,
          container_id: containerId
        });
      } catch {
        if (!cancelled) setUseIframeFallback(true);
      }
    };

    mountWidget();

    return () => {
      cancelled = true;
    };
  }, [isInView, selectedAsset.symbol, theme, containerId]);

  const handleSelectAsset = (asset: MarketAssetItem) => {
    playClickSound('click');
    setSelectedAsset(asset);
    setDropdownOpen(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const results = searchResults.length > 0 ? searchResults : await searchAllMarketCoins(searchQuery);
    if (results.length > 0) {
      handleSelectAsset(results[0]);
    }
  };

  const embedUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_fallback&symbol=${encodeURIComponent(
    selectedAsset.symbol
  )}&interval=60&theme=${theme === 'dark' ? 'dark' : 'light'}&style=1&timezone=Etc%2FUTC&locale=en&hide_top_toolbar=0&hide_legend=0&save_image=0&withdateranges=1&allow_symbol_change=1`;

  return (
    <div className="flex flex-col w-full rounded-xl border border-cyan-500/25 bg-slate-900/70 overflow-hidden shadow-xl shadow-cyan-950/20">
      {/* Top Control & Universal Market Search Bar */}
      <div className="border-b border-slate-800 bg-slate-950/90 p-3.5 sm:px-5 space-y-3">
        <div>
          {/* Universal All-Coins & Market Search Input */}
          <div ref={searchBoxRef} className="relative w-full">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-cyan-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-8 pr-8 py-1.5 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
              />
              {isSearching ? (
                <Loader2 className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-cyan-400 animate-spin" />
              ) : searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </form>

            {dropdownOpen && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 max-h-72 overflow-y-auto rounded-xl border border-cyan-500/40 bg-slate-900 shadow-2xl z-50 divide-y divide-slate-800/80">
                {searchResults.length === 0 && !isSearching ? (
                  <div className="p-3 text-xs text-slate-400 text-center">
                    No matching asset found. Press Enter to launch direct symbol lookup.
                  </div>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectAsset(item)}
                      className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800/80 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-300">
                            {item.ticker}
                          </span>
                          <span className="text-xs text-white font-medium">{item.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.symbol}
                        </span>
                      </div>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                        {item.category}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Top 10 Featured Quick-Access Assets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold whitespace-nowrap mr-1">
            <Sparkles className="h-3 w-3" />
            Top 10:
          </span>
          {TOP_10_FEATURED_ASSETS.map((asset) => {
            const isActive = selectedAsset.symbol === asset.symbol;
            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => handleSelectAsset(asset)}
                className={`whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-md transition-all font-mono ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-sm'
                    : 'text-slate-300 bg-slate-900/70 border border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {asset.ticker}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart Canvas (tv.js primary with iframe fallback) */}
      <div ref={wrapperRef} className="h-[540px] w-full min-h-[460px] bg-slate-950 relative">
        {!isInView ? (
          <div className="flex h-full w-full items-center justify-center text-xs font-mono text-slate-400">
            Initializing Institutional TradingView Terminal...
          </div>
        ) : !useIframeFallback ? (
          <div id={containerId} ref={containerRef} className="h-full w-full" />
        ) : (
          <iframe
            key={`${selectedAsset.symbol}-${theme}`}
            title={`TradingView Chart ${selectedAsset.symbol}`}
            src={embedUrl}
            className="h-full w-full border-0"
            allow="fullscreen"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
};
