export interface MarketAssetItem {
  id: string;
  symbol: string; // TradingView symbol e.g. BINANCE:BTCUSDT or OANDA:XAUUSD
  ticker: string; // Short symbol e.g. BTC, XAU/USD
  name: string;
  category: 'Top 10' | 'Crypto' | 'Meme' | 'Forex' | 'Metals & Oil' | 'Indices';
  binanceSymbol?: string; // e.g. BTCUSDT for live price polling
  coingeckoId?: string;
  approxPrice: number;
  decimals: number;
  featured?: boolean;
}

export const TOP_10_FEATURED_ASSETS: MarketAssetItem[] = [
  { id: 'xauusd', symbol: 'OANDA:XAUUSD', ticker: 'XAU/USD', name: 'Gold (Spot)', category: 'Metals & Oil', approxPrice: 2665.4, decimals: 2, featured: true },
  { id: 'btc', symbol: 'BINANCE:BTCUSDT', ticker: 'BTC/USDT', name: 'Bitcoin', category: 'Crypto', binanceSymbol: 'BTCUSDT', coingeckoId: 'bitcoin', approxPrice: 91250, decimals: 2, featured: true },
  { id: 'eth', symbol: 'BINANCE:ETHUSDT', ticker: 'ETH/USDT', name: 'Ethereum', category: 'Crypto', binanceSymbol: 'ETHUSDT', coingeckoId: 'ethereum', approxPrice: 3180, decimals: 2, featured: true },
  { id: 'sol', symbol: 'BINANCE:SOLUSDT', ticker: 'SOL/USDT', name: 'Solana', category: 'Crypto', binanceSymbol: 'SOLUSDT', coingeckoId: 'solana', approxPrice: 215.4, decimals: 2, featured: true },
  { id: 'bnb', symbol: 'BINANCE:BNBUSDT', ticker: 'BNB/USDT', name: 'BNB', category: 'Crypto', binanceSymbol: 'BNBUSDT', coingeckoId: 'binancecoin', approxPrice: 632.5, decimals: 2, featured: true },
  { id: 'xrp', symbol: 'BINANCE:XRPUSDT', ticker: 'XRP/USDT', name: 'XRP (Ripple)', category: 'Crypto', binanceSymbol: 'XRPUSDT', coingeckoId: 'ripple', approxPrice: 1.42, decimals: 4, featured: true },
  { id: 'eurusd', symbol: 'FX:EURUSD', ticker: 'EUR/USD', name: 'Euro / US Dollar', category: 'Forex', approxPrice: 1.0585, decimals: 5, featured: true },
  { id: 'gbpusd', symbol: 'FX:GBPUSD', ticker: 'GBP/USD', name: 'British Pound / USD', category: 'Forex', approxPrice: 1.2645, decimals: 5, featured: true },
  { id: 'us30', symbol: 'FOREXCOM:DJI', ticker: 'US30', name: 'Dow Jones 30', category: 'Indices', approxPrice: 43850, decimals: 1, featured: true },
  { id: 'nas100', symbol: 'FOREXCOM:NSXUSD', ticker: 'NAS100', name: 'Nasdaq 100', category: 'Indices', approxPrice: 20890, decimals: 1, featured: true }
];

export const EXTENDED_MARKET_CATALOG: MarketAssetItem[] = [
  ...TOP_10_FEATURED_ASSETS,
  // Additional Major Altcoins & Meme Coins
  { id: 'doge', symbol: 'BINANCE:DOGEUSDT', ticker: 'DOGE/USDT', name: 'Dogecoin', category: 'Meme', binanceSymbol: 'DOGEUSDT', approxPrice: 0.39, decimals: 5 },
  { id: 'pepe', symbol: 'BINANCE:PEPEUSDT', ticker: 'PEPE/USDT', name: 'Pepe', category: 'Meme', binanceSymbol: 'PEPEUSDT', approxPrice: 0.000021, decimals: 8 },
  { id: 'shib', symbol: 'BINANCE:SHIBUSDT', ticker: 'SHIB/USDT', name: 'Shiba Inu', category: 'Meme', binanceSymbol: 'SHIBUSDT', approxPrice: 0.000025, decimals: 8 },
  { id: 'wif', symbol: 'BINANCE:WIFUSDT', ticker: 'WIF/USDT', name: 'dogwifhat', category: 'Meme', binanceSymbol: 'WIFUSDT', approxPrice: 3.15, decimals: 4 },
  { id: 'bonk', symbol: 'BINANCE:BONKUSDT', ticker: 'BONK/USDT', name: 'Bonk', category: 'Meme', binanceSymbol: 'BONKUSDT', approxPrice: 0.000042, decimals: 8 },
  { id: 'floki', symbol: 'BINANCE:FLOKIUSDT', ticker: 'FLOKI/USDT', name: 'FLOKI', category: 'Meme', binanceSymbol: 'FLOKIUSDT', approxPrice: 0.00024, decimals: 6 },
  { id: 'ada', symbol: 'BINANCE:ADAUSDT', ticker: 'ADA/USDT', name: 'Cardano', category: 'Crypto', binanceSymbol: 'ADAUSDT', approxPrice: 0.98, decimals: 4 },
  { id: 'avax', symbol: 'BINANCE:AVAXUSDT', ticker: 'AVAX/USDT', name: 'Avalanche', category: 'Crypto', binanceSymbol: 'AVAXUSDT', approxPrice: 41.2, decimals: 2 },
  { id: 'sui', symbol: 'BINANCE:SUIUSDT', ticker: 'SUI/USDT', name: 'Sui', category: 'Crypto', binanceSymbol: 'SUIUSDT', approxPrice: 3.45, decimals: 4 },
  { id: 'ton', symbol: 'BINANCE:TONUSDT', ticker: 'TON/USDT', name: 'Toncoin', category: 'Crypto', binanceSymbol: 'TONUSDT', approxPrice: 5.95, decimals: 3 },
  { id: 'link', symbol: 'BINANCE:LINKUSDT', ticker: 'LINK/USDT', name: 'Chainlink', category: 'Crypto', binanceSymbol: 'LINKUSDT', approxPrice: 17.8, decimals: 3 },
  { id: 'dot', symbol: 'BINANCE:DOTUSDT', ticker: 'DOT/USDT', name: 'Polkadot', category: 'Crypto', binanceSymbol: 'DOTUSDT', approxPrice: 8.2, decimals: 3 },
  { id: 'trx', symbol: 'BINANCE:TRXUSDT', ticker: 'TRX/USDT', name: 'TRON', category: 'Crypto', binanceSymbol: 'TRXUSDT', approxPrice: 0.21, decimals: 5 },
  { id: 'ltc', symbol: 'BINANCE:LTCUSDT', ticker: 'LTC/USDT', name: 'Litecoin', category: 'Crypto', binanceSymbol: 'LTCUSDT', approxPrice: 95.4, decimals: 2 },
  { id: 'bch', symbol: 'BINANCE:BCHUSDT', ticker: 'BCH/USDT', name: 'Bitcoin Cash', category: 'Crypto', binanceSymbol: 'BCHUSDT', approxPrice: 485, decimals: 2 },
  { id: 'near', symbol: 'BINANCE:NEARUSDT', ticker: 'NEAR/USDT', name: 'NEAR Protocol', category: 'Crypto', binanceSymbol: 'NEARUSDT', approxPrice: 6.4, decimals: 3 },
  { id: 'apt', symbol: 'BINANCE:APTUSDT', ticker: 'APT/USDT', name: 'Aptos', category: 'Crypto', binanceSymbol: 'APTUSDT', approxPrice: 12.1, decimals: 3 },
  { id: 'tao', symbol: 'BINANCE:TAOUSDT', ticker: 'TAO/USDT', name: 'Bittensor', category: 'Crypto', binanceSymbol: 'TAOUSDT', approxPrice: 540, decimals: 2 },
  { id: 'fet', symbol: 'BINANCE:FETUSDT', ticker: 'FET/USDT', name: 'Artificial Superintelligence', category: 'Crypto', binanceSymbol: 'FETUSDT', approxPrice: 1.55, decimals: 4 },
  { id: 'render', symbol: 'BINANCE:RENDERUSDT', ticker: 'RENDER/USDT', name: 'Render', category: 'Crypto', binanceSymbol: 'RENDERUSDT', approxPrice: 7.9, decimals: 3 },
  { id: 'arb', symbol: 'BINANCE:ARBUSDT', ticker: 'ARB/USDT', name: 'Arbitrum', category: 'Crypto', binanceSymbol: 'ARBUSDT', approxPrice: 0.88, decimals: 4 },
  { id: 'op', symbol: 'BINANCE:OPUSDT', ticker: 'OP/USDT', name: 'Optimism', category: 'Crypto', binanceSymbol: 'OPUSDT', approxPrice: 2.15, decimals: 4 },
  { id: 'uni', symbol: 'BINANCE:UNIUSDT', ticker: 'UNI/USDT', name: 'Uniswap', category: 'Crypto', binanceSymbol: 'UNIUSDT', approxPrice: 11.4, decimals: 3 },
  { id: 'atom', symbol: 'BINANCE:ATOMUSDT', ticker: 'ATOM/USDT', name: 'Cosmos', category: 'Crypto', binanceSymbol: 'ATOMUSDT', approxPrice: 7.6, decimals: 3 },
  { id: 'inj', symbol: 'BINANCE:INJUSDT', ticker: 'INJ/USDT', name: 'Injective', category: 'Crypto', binanceSymbol: 'INJUSDT', approxPrice: 26.8, decimals: 3 },
  // Commodities, Metals & Indices
  { id: 'xagusd', symbol: 'OANDA:XAGUSD', ticker: 'XAG/USD', name: 'Silver (Spot)', category: 'Metals & Oil', approxPrice: 31.4, decimals: 3 },
  { id: 'usoil', symbol: 'TVC:USOIL', ticker: 'WTI OIL', name: 'US Crude Oil (WTI)', category: 'Metals & Oil', approxPrice: 70.2, decimals: 2 },
  { id: 'ukoil', symbol: 'TVC:UKOIL', ticker: 'BRENT', name: 'Brent Crude Oil', category: 'Metals & Oil', approxPrice: 74.1, decimals: 2 },
  { id: 'spx500', symbol: 'FOREXCOM:SPXUSD', ticker: 'SPX500', name: 'S&P 500 Index', category: 'Indices', approxPrice: 5950, decimals: 1 },
  { id: 'ger40', symbol: 'FOREXCOM:GER40', ticker: 'GER40', name: 'Germany DAX 40', category: 'Indices', approxPrice: 19350, decimals: 1 },
  { id: 'usdjpy', symbol: 'FX:USDJPY', ticker: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'Forex', approxPrice: 154.2, decimals: 3 },
  { id: 'usdcad', symbol: 'FX:USDCAD', ticker: 'USD/CAD', name: 'US Dollar / Canadian Dollar', category: 'Forex', approxPrice: 1.398, decimals: 5 },
  { id: 'audusd', symbol: 'FX:AUDUSD', ticker: 'AUD/USD', name: 'Australian Dollar / USD', category: 'Forex', approxPrice: 0.651, decimals: 5 },
  { id: 'usdchf', symbol: 'FX:USDCHF', ticker: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'Forex', approxPrice: 0.884, decimals: 5 },
  { id: 'gbpjpy', symbol: 'FX:GBPJPY', ticker: 'GBP/JPY', name: 'British Pound / Yen', category: 'Forex', approxPrice: 194.8, decimals: 3 },
  { id: 'eurjpy', symbol: 'FX:EURJPY', ticker: 'EUR/JPY', name: 'Euro / Japanese Yen', category: 'Forex', approxPrice: 163.2, decimals: 3 }
];

export interface LiveTickerQuote {
  symbol: string;
  ticker: string;
  name: string;
  price: number;
  change24h?: number;
  source: 'binance' | 'coingecko' | 'catalog';
}

// Fetch all Binance spot USDT pairs or CoinGecko search so ANY crypto coin on the market can be found
let cachedBinancePairs: string[] | null = null;

export async function searchAllMarketCoins(query: string): Promise<MarketAssetItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return EXTENDED_MARKET_CATALOG;

  // 1. Filter built-in catalog first
  const localMatches = EXTENDED_MARKET_CATALOG.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.ticker.toLowerCase().includes(q) ||
      item.symbol.toLowerCase().includes(q)
  );

  // 2. Try CoinGecko search API for ANY cryptocurrency coin globally
  const remoteResults: MarketAssetItem[] = [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      const coins = Array.isArray(data?.coins) ? data.coins.slice(0, 12) : [];
      coins.forEach((c: any) => {
        const symUpper = String(c.symbol || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (!symUpper) return;
        const tvSymbol = `CRYPTO:${symUpper}USD`;
        const alreadyExists =
          localMatches.some((m) => m.ticker.startsWith(`${symUpper}/`)) ||
          remoteResults.some((r) => r.ticker.startsWith(`${symUpper}/`));
        if (!alreadyExists) {
          remoteResults.push({
            id: `cg-${c.id}`,
            symbol: `BINANCE:${symUpper}USDT`,
            ticker: `${symUpper}/USDT`,
            name: String(c.name || symUpper),
            category: 'Crypto',
            binanceSymbol: `${symUpper}USDT`,
            coingeckoId: String(c.id),
            approxPrice: 0,
            decimals: 4,
            featured: false
          });
          void tvSymbol;
        }
      });
    }
  } catch {
    // Offline or rate-limited fallback: allow direct Binance / TradingView symbol resolution
  }

  // 3. Also check cached Binance exchange symbols if available
  if (!cachedBinancePairs) {
    try {
      const r = await fetch('https://api.binance.com/api/v3/ticker/price');
      if (r.ok) {
        const arr = await r.json();
        if (Array.isArray(arr)) {
          cachedBinancePairs = arr
            .map((p: any) => String(p.symbol || ''))
            .filter((s: string) => s.endsWith('USDT'));
        }
      }
    } catch {
      cachedBinancePairs = [];
    }
  }

  if (cachedBinancePairs && cachedBinancePairs.length > 0) {
    const upperQ = q.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const binMatches = cachedBinancePairs
      .filter((s) => s.includes(upperQ))
      .slice(0, 10);
    binMatches.forEach((pair) => {
      const base = pair.replace(/USDT$/, '');
      const exists =
        localMatches.some((m) => m.binanceSymbol === pair) ||
        remoteResults.some((r) => r.binanceSymbol === pair);
      if (!exists && base) {
        remoteResults.push({
          id: `bin-${pair.toLowerCase()}`,
          symbol: `BINANCE:${pair}`,
          ticker: `${base}/USDT`,
          name: `${base} (Binance Market)`,
          category: 'Crypto',
          binanceSymbol: pair,
          approxPrice: 0,
          decimals: 4
        });
      }
    });
  }

  const combined = [...localMatches, ...remoteResults];

  // 4. Always offer direct custom symbol launch if user typed a ticker/symbol
  const cleanUpper = query.trim().toUpperCase();
  if (cleanUpper.length >= 2) {
    const directTvSymbol = cleanUpper.includes(':')
      ? cleanUpper
      : cleanUpper.includes('/')
      ? `FX:${cleanUpper.replace('/', '')}`
      : `BINANCE:${cleanUpper.replace(/[^A-Z0-9]/g, '')}USDT`;

    if (!combined.some((c) => c.symbol === directTvSymbol)) {
      combined.push({
        id: `custom-${cleanUpper}`,
        symbol: directTvSymbol,
        ticker: cleanUpper,
        name: `Direct Chart: ${directTvSymbol}`,
        category: 'Crypto',
        binanceSymbol: directTvSymbol.startsWith('BINANCE:') ? directTvSymbol.replace('BINANCE:', '') : undefined,
        approxPrice: 0,
        decimals: 4
      });
    }
  }

  return combined;
}

export async function fetchLiveAssetPrice(asset: MarketAssetItem): Promise<LiveTickerQuote> {
  // Try Binance 24hr ticker for crypto assets first (fast, zero-key, accurate live price)
  if (asset.binanceSymbol) {
    try {
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${encodeURIComponent(asset.binanceSymbol)}`
      );
      if (res.ok) {
        const data = await res.json();
        const price = parseFloat(data.lastPrice);
        const change = parseFloat(data.priceChangePercent);
        if (!isNaN(price) && price > 0) {
          return {
            symbol: asset.symbol,
            ticker: asset.ticker,
            name: asset.name,
            price,
            change24h: isNaN(change) ? 0 : change,
            source: 'binance'
          };
        }
      }
    } catch {
      // Fall through to CoinGecko
    }
  }

  // Try CoinGecko simple price if coingeckoId is known
  if (asset.coingeckoId) {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(asset.coingeckoId)}&vs_currencies=usd&include_24hr_change=true`
      );
      if (res.ok) {
        const data = await res.json();
        const info = data[asset.coingeckoId];
        if (info && typeof info.usd === 'number') {
          return {
            symbol: asset.symbol,
            ticker: asset.ticker,
            name: asset.name,
            price: info.usd,
            change24h: info.usd_24h_change ?? 0,
            source: 'coingecko'
          };
        }
      }
    } catch {
      // Fallback
    }
  }

  return {
    symbol: asset.symbol,
    ticker: asset.ticker,
    name: asset.name,
    price: asset.approxPrice > 0 ? asset.approxPrice : 100.0,
    source: 'catalog'
  };
}
