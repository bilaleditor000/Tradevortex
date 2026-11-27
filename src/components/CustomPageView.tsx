import React from 'react';
import { CustomPage, PageView } from '../types';
import { AdPlaceholder } from './AdPlaceholder';
import { CustomBlocksRenderer } from './CustomBlocksRenderer';
import { MediaPlacementsRenderer } from './MediaPlacementsRenderer';
import { playClickSound } from '../utils/sound';
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';

interface CustomPageViewProps {
  pageData: CustomPage;
  onNavigate: (page: PageView) => void;
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({ pageData, onNavigate }) => {
  const safeCtaUrl =
    pageData.ctaUrl &&
    (pageData.ctaUrl.startsWith('https://') || pageData.ctaUrl.startsWith('http://'))
      ? pageData.ctaUrl
      : '';

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        type="button"
        onClick={() => {
          playClickSound('click');
          onNavigate('home');
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </button>

      <header className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-6 sm:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>{pageData.categoryBadge || 'TradeVortex Custom Briefing'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {pageData.title}
        </h1>
        {pageData.subtitle && (
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {pageData.subtitle}
          </p>
        )}
        {pageData.ctaLabel && safeCtaUrl && (
          <div className="pt-2">
            <a
              href={safeCtaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 text-xs font-extrabold text-slate-950 hover:from-cyan-400 hover:to-sky-400 shadow-md shadow-cyan-500/20"
            >
              <span>{pageData.ctaLabel}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </header>

      <AdPlaceholder
        page="home"
        format="leaderboard"
        placement="header"
        slotLabel="Header Top Leaderboard Slot (728x90 / 320x50)"
      />

      <CustomBlocksRenderer page={`custom:${pageData.slug}`} />
      <MediaPlacementsRenderer page={`custom:${pageData.slug}`} />

      <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-4 text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line">
        {pageData.body}
      </article>

      <AdPlaceholder
        page="home"
        format="leaderboard"
        placement="prefooter"
        slotLabel="Pre-Footer / Content Bottom Banner Slot (728x90)"
      />
    </div>
  );
};
