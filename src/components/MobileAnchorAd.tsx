import React, { useState, useEffect } from 'react';
import { getAdminSettings, ADMIN_EVENT_KEY } from '../data/adminSettings';
import { AdminSettings } from '../types';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { playClickSound } from '../utils/sound';

export const MobileAnchorAd: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings>(() => getAdminSettings());
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent<AdminSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        setSettings(getAdminSettings());
      }
    };

    window.addEventListener(ADMIN_EVENT_KEY, handleSettingsChange);
    return () => window.removeEventListener(ADMIN_EVENT_KEY, handleSettingsChange);
  }, []);

  const hasInjectedAdSense = Boolean(settings.adSenseScript && settings.adSenseScript.trim().length > 0);

  useEffect(() => {
    if (!hasInjectedAdSense || !settings.mobileAnchorAdEnabled || isDismissed) return;

    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 45000);

    return () => clearInterval(interval);
  }, [hasInjectedAdSense, settings.mobileAnchorAdEnabled, isDismissed]);

  useEffect(() => {
    if (!hasInjectedAdSense || typeof window === 'undefined' || !settings.mobileAnchorAdEnabled || isDismissed) {
      return;
    }
    try {
      ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
    } catch {
      // Safe catch
    }
  }, [hasInjectedAdSense, refreshKey, settings.mobileAnchorAdEnabled, isDismissed]);

  // Do not render any fake mobile sticky placeholder bar unless real AdSense script is active
  if (!hasInjectedAdSense || !settings.mobileAnchorAdEnabled || isDismissed) {
    return null;
  }

  const adClient = settings.adSensePublisherId || 'ca-pub-9482910482910482';
  const adSlot = settings.pageAdSlots?.mobileAnchor || 'tv_mobile_sticky_anchor_320x50';

  return (
    <aside
      aria-label="Sponsored Mobile Anchor"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center justify-center bg-slate-950/95 border-t border-slate-800 backdrop-blur-md shadow-2xl transition-all"
    >
      <div className="flex items-center justify-between w-full px-3 py-1 bg-slate-900/90 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
        <span className="uppercase tracking-wider font-semibold text-slate-300">
          Advertisement
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              setIsCollapsed(!isCollapsed);
            }}
            className="flex items-center gap-0.5 text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand ad' : 'Collapse ad'}
          >
            {isCollapsed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            <span>{isCollapsed ? 'Show' : 'Hide'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              setIsDismissed(true);
            }}
            className="text-slate-400 hover:text-rose-400 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
            title="Dismiss mobile anchor ad"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="w-full max-w-[360px] py-1.5 px-2 flex flex-col items-center justify-center">
          <div
            key={refreshKey}
            className="relative flex items-center justify-center w-[320px] h-[50px] overflow-hidden"
          >
            <ins
              className="adsbygoogle"
              style={{ display: 'inline-block', width: '320px', height: '50px' }}
              data-ad-client={adClient}
              data-ad-slot={adSlot}
            />
          </div>
        </div>
      )}
    </aside>
  );
};
