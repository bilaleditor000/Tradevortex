import React, { useState, useEffect } from 'react';
import { MediaItem, PageView } from '../types';
import { getAdminSettings, ADMIN_EVENT_KEY } from '../data/adminSettings';

interface MediaPlacementsRendererProps {
  page: PageView;
}

function isSafeMediaUrl(url: string, mediaType: MediaItem['mediaType']): boolean {
  if (!url) return false;
  if (url.startsWith('https://') || url.startsWith('http://')) return true;
  if (mediaType === 'image' && url.startsWith('data:image/')) return true;
  if (mediaType === 'video' && url.startsWith('data:video/')) return true;
  if (mediaType === 'audio' && url.startsWith('data:audio/')) return true;
  return false;
}

export const MediaPlacementsRenderer: React.FC<MediaPlacementsRendererProps> = ({ page }) => {
  const [items, setItems] = useState<MediaItem[]>(() => {
    const settings = getAdminSettings();
    return (settings.mediaLibrary || []).filter(
      (m) => m.placement === 'all' || m.placement === page
    );
  });

  useEffect(() => {
    const sync = () => {
      const settings = getAdminSettings();
      setItems(
        (settings.mediaLibrary || []).filter(
          (m) => m.placement === 'all' || m.placement === page
        )
      );
    };
    window.addEventListener(ADMIN_EVENT_KEY, sync);
    return () => window.removeEventListener(ADMIN_EVENT_KEY, sync);
  }, [page]);

  const safeItems = items.filter((m) => isSafeMediaUrl(m.url, m.mediaType));
  if (safeItems.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {safeItems.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-cyan-500/25 bg-slate-900/75 p-4 space-y-2.5 shadow-md"
        >
          {item.mediaType === 'image' && (
            <img
              src={item.url}
              alt={item.caption || item.name}
              className="w-full max-h-72 object-cover rounded-lg border border-slate-800"
            />
          )}
          {item.mediaType === 'video' && (
            <video
              src={item.url}
              controls
              className="w-full max-h-72 rounded-lg border border-slate-800 bg-black"
            />
          )}
          {item.mediaType === 'audio' && (
            <audio src={item.url} controls className="w-full" />
          )}
          {(item.caption || item.name) && (
            <p className="text-xs font-semibold text-slate-300 truncate">
              {item.caption || item.name}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
