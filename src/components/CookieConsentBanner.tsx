import React, { useState, useEffect } from 'react';
import { CookieConsentPreferences } from '../types';
import { playClickSound } from '../utils/sound';
import { trackAnalyticsEvent } from '../data/analyticsStore';
import { Cookie, ShieldCheck, Settings, X, Check } from 'lucide-react';

const COOKIE_STORAGE_KEY = 'tradevortex_cookie_consent_v1';

export function getSavedCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsentPreferences;
  } catch {
    return null;
  }
}

function applyAdSenseConsentFlags(advertisingAllowed: boolean): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as {
    adsbygoogle?: { requestNonPersonalizedAds?: number };
    gtag?: (...args: unknown[]) => void;
  };
  if (w.adsbygoogle) {
    w.adsbygoogle.requestNonPersonalizedAds = advertisingAllowed ? 0 : 1;
  }
  if (typeof w.gtag === 'function') {
    w.gtag('consent', 'update', {
      ad_storage: advertisingAllowed ? 'granted' : 'denied',
      ad_user_data: advertisingAllowed ? 'granted' : 'denied',
      ad_personalization: advertisingAllowed ? 'granted' : 'denied'
    });
  }
}

interface CookieConsentBannerProps {
  forceOpenSettings?: boolean;
  onCloseSettings?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  forceOpenSettings = false,
  onCloseSettings
}) => {
  const [visible, setVisible] = useState<boolean>(() => !getSavedCookieConsent());
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(() => {
    const saved = getSavedCookieConsent();
    return saved ? saved.analytics : true;
  });
  const [advertisingEnabled, setAdvertisingEnabled] = useState<boolean>(() => {
    const saved = getSavedCookieConsent();
    return saved ? saved.advertising : true;
  });

  useEffect(() => {
    const saved = getSavedCookieConsent();
    if (saved) {
      applyAdSenseConsentFlags(saved.advertising);
    }
  }, []);

  useEffect(() => {
    if (forceOpenSettings) {
      setSettingsOpen(true);
    }
  }, [forceOpenSettings]);

  const persistConsent = (analytics: boolean, advertising: boolean, label: string) => {
    const prefs: CookieConsentPreferences = {
      essential: true,
      analytics,
      advertising,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    applyAdSenseConsentFlags(advertising);
    setAnalyticsEnabled(analytics);
    setAdvertisingEnabled(advertising);
    setVisible(false);
    setSettingsOpen(false);
    if (onCloseSettings) onCloseSettings();
    trackAnalyticsEvent('cookie_consent', 'global', label);
  };

  if (!visible && !settingsOpen) return null;

  return (
    <>
      {/* Cookie Settings Modal */}
      {settingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cookie Preferences"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Cookie & AdSense Privacy Settings</h3>
                  <p className="text-[11px] text-slate-400">GDPR & Google Consent Mode v2 Compliant</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSettingsOpen(false);
                  if (onCloseSettings) onCloseSettings();
                }}
                aria-label="Close cookie settings"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Essential */}
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                <div className="pr-4">
                  <div className="font-bold text-white">Essential Cookies</div>
                  <p className="text-slate-400 mt-0.5">
                    Required for theme preferences, language selection, calculator state, and security.
                  </p>
                </div>
                <span className="rounded-md bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-300 shrink-0">
                  Always Active
                </span>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                <div className="pr-4">
                  <div className="font-bold text-white">Analytics Cookies</div>
                  <p className="text-slate-400 mt-0.5">
                    Helps measure page views, device compatibility, and calculator performance anonymously.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
                </label>
              </div>

              {/* Advertising */}
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                <div className="pr-4">
                  <div className="font-bold text-white">AdSense Advertising Cookies</div>
                  <p className="text-slate-400 mt-0.5">
                    Enables Google AdSense to serve relevant, policy-compliant financial advertisements.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={advertisingEnabled}
                    onChange={(e) => setAdvertisingEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => {
                  playClickSound('click');
                  persistConsent(false, false, 'Reject Non-Essential (Modal)');
                }}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound('calculate');
                  persistConsent(analyticsEnabled, advertisingEnabled, 'Custom Cookie Settings');
                }}
                className="rounded-xl border border-cyan-500/40 bg-cyan-950/60 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-900/60"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound('calculate');
                  persistConsent(true, true, 'Accept All Cookies (Modal)');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:from-cyan-400 hover:to-sky-400"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Accept All Cookies</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Non-Intrusive Bottom Cookie Consent Banner */}
      {visible && !settingsOpen && (
        <div
          role="region"
          aria-label="Cookie Consent Banner"
          className="fixed bottom-16 md:bottom-4 left-4 right-4 z-40 mx-auto max-w-5xl rounded-2xl border border-cyan-500/40 bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl shadow-cyan-950/70"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mt-0.5">
                <Cookie className="h-5 w-5" />
              </div>
              <div className="text-xs leading-relaxed text-slate-300">
                <strong className="text-white block text-sm mb-0.5">
                  We Respect Your Privacy &amp; AdSense Transparency
                </strong>
                TradeVortex uses essential cookies to keep calculators fast, plus optional analytics and Google AdSense advertising cookies to support free institutional trading tools.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  playClickSound('click');
                  setSettingsOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-500/40 hover:text-white transition-colors"
              >
                <Settings className="h-3.5 w-3.5 text-cyan-400" />
                <span>Cookie Settings</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound('click');
                  persistConsent(false, false, 'Reject Non-Essential');
                }}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Reject Non-Essential
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound('calculate');
                  persistConsent(true, true, 'Accept All Cookies');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:from-cyan-400 hover:to-sky-400 shadow-md shadow-cyan-500/25 transition-all"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Accept All Cookies</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
