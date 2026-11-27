import React, { useState, useEffect } from 'react';
import { getAdminSettings, ADMIN_EVENT_KEY } from '../data/adminSettings';
import { AdminSettings, PageView } from '../types';

interface AdPlaceholderProps {
  format?: 'leaderboard' | 'rectangle' | 'halfpage' | 'infeed';
  className?: string;
  slotLabel?: string;
  placement?: 'header' | 'sidebar' | 'article' | 'midpage' | 'prefooter';
  page?: PageView;
  slotId?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  format = 'leaderboard',
  className = '',
  placement = 'header',
  page = 'home',
  slotId
}) => {
  const [settings, setSettings] = useState<AdminSettings>(() => getAdminSettings());

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

  const getEffectiveSlotId = (): string => {
    if (slotId) return slotId;
    const slots = settings.pageAdSlots;
    if (!slots) return `tv_${page}_${placement}_slot`;

    if (placement === 'header') {
      if (page === 'home') return slots.homeHeader;
      if (page === 'calculators') return slots.calcTop;
      if (page === 'brokers') return slots.brokersHeader;
      return `${page}_top_leaderboard`;
    }

    if (placement === 'sidebar') {
      if (page === 'calculators') return slots.calcSidebar;
      if (page === 'academy') return slots.academyArticle;
      return `${page}_sidebar_300x600`;
    }

    if (placement === 'midpage') {
      return `tv_${page}_midpage_highcpm_slot`;
    }

    if (placement === 'prefooter') {
      return `tv_${page}_prefooter_leaderboard_slot`;
    }

    if (placement === 'article') {
      if (page === 'signals') return slots.signalsInContent;
      if (page === 'home') return slots.homeInFeed;
      return `tv_${page}_infeed_native_slot`;
    }

    return `tv_${page}_${format}_slot`;
  };

  const effectiveSlot = getEffectiveSlotId();
  const adClient = settings.adSensePublisherId || 'ca-pub-9482910482910482';

  useEffect(() => {
    if (!hasInjectedAdSense || typeof window === 'undefined') return;
    try {
      ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
    } catch {
      // Safe catch for ad blockers
    }
  }, [hasInjectedAdSense, format, placement, page, effectiveSlot]);

  // Keep layout 100% clean with zero visible dummy/fake placeholder boxes until real AdSense code is injected
  if (!hasInjectedAdSense) {
    return (
      <div
        className="hidden"
        style={{ display: 'none' }}
        data-adsense-slot={effectiveSlot}
        aria-hidden="true"
      />
    );
  }

  let containerDimensions = 'min-h-[90px] w-full max-w-[728px]';
  if (format === 'rectangle') {
    containerDimensions = 'min-h-[250px] w-full max-w-[300px]';
  } else if (format === 'halfpage') {
    containerDimensions = 'min-h-[600px] w-full max-w-[300px]';
  } else if (format === 'infeed') {
    containerDimensions = 'min-h-[100px] w-full max-w-[728px]';
  }

  return (
    <div
      className={`mx-auto my-4 flex flex-col items-center justify-center ${className}`}
      data-adsense-container={effectiveSlot}
    >
      <div className={`flex items-center justify-center overflow-hidden ${containerDimensions}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={adClient}
          data-ad-slot={effectiveSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
