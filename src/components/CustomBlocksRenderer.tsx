import React, { useEffect, useState } from 'react';
import { PageView, CustomContentBlock } from '../types';
import { getAdminSettings, ADMIN_EVENT_KEY } from '../data/adminSettings';
import { ExternalLink, Sparkles } from 'lucide-react';

interface CustomBlocksRendererProps {
  page: PageView;
}

export const CustomBlocksRenderer: React.FC<CustomBlocksRendererProps> = ({ page }) => {
  const [blocks, setBlocks] = useState<CustomContentBlock[]>(() => {
    const settings = getAdminSettings();
    return (settings.customBlocks || []).filter(
      (b) => b.active && (b.page === 'all' || b.page === page)
    );
  });

  useEffect(() => {
    const sync = () => {
      const settings = getAdminSettings();
      setBlocks(
        (settings.customBlocks || []).filter(
          (b) => b.active && (b.page === 'all' || b.page === page)
        )
      );
    };
    window.addEventListener(ADMIN_EVENT_KEY, sync);
    return () => window.removeEventListener(ADMIN_EVENT_KEY, sync);
  }, [page]);

  if (blocks.length === 0) return null;

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <div
          key={block.id}
          className="rounded-xl border border-cyan-500/30 bg-slate-900/80 p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>{block.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {block.body}
            </p>
          </div>
          {block.ctaLabel && block.ctaUrl && (
            <a
              href={block.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              <span>{block.ctaLabel}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
};
