import React from 'react';
import { playClickSound } from '../utils/sound';
import { trackAnalyticsEvent } from '../data/analyticsStore';
import { Send, Sparkles } from 'lucide-react';

interface FloatingTelegramWidgetProps {
  telegramUrl: string;
}

export const FloatingTelegramWidget: React.FC<FloatingTelegramWidgetProps> = ({ telegramUrl }) => {
  const safeTelegramUrl =
    telegramUrl && (telegramUrl.startsWith('https://') || telegramUrl.startsWith('http://'))
      ? telegramUrl
      : 'https://t.me/tradevortex_vip';

  return (
    <div className="fixed bottom-5 left-5 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <a
        href={safeTelegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          playClickSound('click');
          trackAnalyticsEvent('telegram_click', 'global', 'Floating VIP Telegram Community');
        }}
        className="group flex items-center gap-2.5 rounded-full border border-sky-400/40 bg-slate-950/90 py-2.5 px-4 shadow-xl shadow-sky-950/50 backdrop-blur-md hover:border-sky-300 hover:bg-slate-900 transition-all hover:scale-105"
        title="Join TradeVortex Free VIP Community"
      >
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 text-slate-950 shadow-md">
          <Send className="h-4 w-4 ml-0.5" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400"></span>
          </span>
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase font-mono font-bold text-sky-400 leading-tight flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5" /> VIP Community
          </span>
          <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors whitespace-nowrap">
            Join Telegram
          </span>
        </div>
      </a>
    </div>
  );
};
