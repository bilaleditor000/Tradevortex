import React, { useEffect, useRef, useState } from 'react';

interface TradingViewCalendarProps {
  theme?: 'dark' | 'light';
  height?: number;
}

export const TradingViewCalendar: React.FC<TradingViewCalendarProps> = ({
  theme = 'dark',
  height = 540
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

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
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        width: '100%',
        height: height,
        colorTheme: theme === 'dark' ? 'dark' : 'light',
        isTransparent: false,
        locale: 'en',
        importanceFilter: '0,1',
        countryFilter: 'us,eu,gb,jp,ca,au,ch,cn'
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
  }, [isInView, theme, height]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-900/60 shadow-xl shadow-cyan-950/20">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400"></div>
          <h3 className="text-sm font-semibold tracking-wide text-slate-100">
            Real-Time Economic Calendar
          </h3>
        </div>
        <span className="font-mono text-xs text-slate-400">
          Global Macro Releases (UTC)
        </span>
      </div>
      <div
        ref={containerRef}
        className="tradingview-widget-container w-full"
        style={{ minHeight: `${height}px` }}
      />
    </div>
  );
};
