import React from 'react';
import { AdminSettings } from '../types';
import { playClickSound } from '../utils/sound';
import { Sparkles, ArrowRight, Tag } from 'lucide-react';

interface TopPromoBannerProps {
  bannerConfig: AdminSettings['promoBanner'];
}

export const TopPromoBanner: React.FC<TopPromoBannerProps> = ({ bannerConfig }) => {
  if (!bannerConfig || !bannerConfig.enabled) return null;

  return (
    <div className="relative z-30 border-b border-cyan-500/20 bg-gradient-to-r from-slate-950 via-cyan-950/60 to-slate-950 px-4 py-2 text-center text-xs text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 sm:gap-3">
        <span className="rounded bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wide">
          {bannerConfig.badge || 'PROMO'}
        </span>

        <span className="font-medium text-slate-100">
          {bannerConfig.title}
        </span>

        {bannerConfig.customOfferCode && (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-300 font-bold bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
            <Tag className="h-3 w-3" />
            Code: {bannerConfig.customOfferCode}
          </span>
        )}

        {bannerConfig.actionUrl && (
          <a
            href={bannerConfig.actionUrl}
            target="_blank"
            rel="sponsored nofollow"
            onClick={() => playClickSound('click')}
            className="inline-flex items-center gap-1 font-bold text-cyan-300 hover:text-cyan-200 underline decoration-cyan-400/60 underline-offset-4 transition-colors"
          >
            <span>{bannerConfig.actionText || 'Claim Now'}</span>
            <ArrowRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
};
