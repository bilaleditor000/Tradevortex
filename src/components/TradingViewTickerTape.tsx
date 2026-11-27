import React, { useEffect, useRef } from 'react';

interface TradingViewTickerTapeProps {
  theme?: 'dark' | 'light';
}

export const TradingViewTickerTape: React.FC<TradingViewTickerTapeProps> = ({
  theme = 'dark'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      container.innerHTML = '';
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      container.appendChild(widgetDiv);

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [
          { proName: 'FOREXCOM:EURUSD', title: 'EUR/USD' },
          { proName: 'FOREXCOM:GBPUSD', title: 'GBP/USD' },
          { proName: 'FOREXCOM:USDJPY', title: 'USD/JPY' },
          { proName: 'OANDA:XAUUSD', title: 'Gold' },
          { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
          { proName: 'FOREXCOM:DJI', title: 'US30' },
          { proName: 'FOREXCOM:NSXUSD', title: 'NAS100' },
          { proName: 'BINANCE:BTCUSDT', title: 'BTC/USD' }
        ],
        showSymbolLogo: true,
        colorTheme: theme === 'dark' ? 'dark' : 'light',
        isTransparent: true,
        displayMode: 'adaptive',
        locale: 'en'
      });

      container.appendChild(script);
    } catch {
      // Safe error catch for widget initialization
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [theme]);

  return (
    <div className="w-full border-y border-cyan-500/15 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
      <div
        ref={containerRef}
        className="tradingview-widget-container w-full min-h-[46px]"
      />
    </div>
  );
};
