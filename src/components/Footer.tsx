import React, { useState, useEffect } from 'react';
import { PageView, Language, AdminSettings } from '../types';
import { playClickSound } from '../utils/sound';
import { TRANSLATIONS } from '../utils/translations';
import { getAdminSettings, ADMIN_EVENT_KEY, getCmsValue } from '../data/adminSettings';
import { ShieldAlert, AlertTriangle, Lock, Cookie } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenAdmin: () => void;
  onOpenCookieSettings?: () => void;
  language?: Language;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenAdmin,
  onOpenCookieSettings,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getAdminSettings());

  useEffect(() => {
    const sync = () => setAdminSettings(getAdminSettings());
    window.addEventListener(ADMIN_EVENT_KEY, sync);
    return () => window.removeEventListener(ADMIN_EVENT_KEY, sync);
  }, []);

  const handleNav = (page: PageView) => {
    playClickSound('click');
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-cyan-500/20 bg-slate-950 text-slate-400">
      {/* High-Risk Warning Banner (Mandatory Regulatory Transparency) */}
      <div className="border-b border-slate-800/80 bg-slate-950/80 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-950/10 p-4">
            <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-slate-300">
              <strong className="text-amber-300">
                {getCmsValue(adminSettings, 'riskWarning', t.riskWarning)}{' '}
              </strong>
              {t.disclaimerText}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              {adminSettings.siteLogoUrl &&
              (adminSettings.siteLogoUrl.startsWith('https://') ||
                adminSettings.siteLogoUrl.startsWith('http://') ||
                adminSettings.siteLogoUrl.startsWith('data:image/')) ? (
                <img
                  src={adminSettings.siteLogoUrl}
                  alt="TradeVortex Logo"
                  className="h-8 w-auto max-w-[120px] object-contain rounded-lg border border-cyan-500/30 bg-slate-900/50 p-0.5"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 font-extrabold text-slate-950 text-sm font-mono notranslate">
                  V
                </div>
              )}
              <span className="text-lg font-bold text-white tracking-tight notranslate">
                Trade<span className="text-cyan-400">Vortex</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering global currency, futures, and CFD traders with institutional-grade risk calculators, real-time TradingView charting, macroeconomic calendar feeds, and verified broker research.
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-cyan-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                Affiliate Transparency:
              </span>{' '}
              We may receive compensation from partner brokers when you register through our links, at no extra cost to you.
            </div>
          </div>

          {/* Calculators Column */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono mb-3">
              Trading Calculators
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('calculators')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Spot & Futures Profit/Loss
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('calculators')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Forex Lot Size & Risk
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('calculators')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Pip Value Calculator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('calculators')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Futures Liquidation Price
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('calculators')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Compound & Drawdown Sizer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('calculators')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Gold (XAU) & Indices Sizer
                </button>
              </li>
            </ul>
          </div>

          {/* Research & Platform */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono mb-3">
              Platform & Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('brokers')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Top 10 Tier-1 ECN Brokers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('brokers')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Interactive Demo Simulator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('signals')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Daily Market Signals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('markets')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  TradingView Live Terminal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('quiz')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Risk Management Quiz & Certificate
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('journal')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Download Trading Journal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('quotex')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Quotex Review (Ad-Free)
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono mb-3">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('about')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('contact')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('privacy')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('terms')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('risk-disclaimer')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Risk Disclaimer &amp; Affiliate Disclosure
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('faq')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Clearly Visible Professional Admin Portal Button */}
        <div className="mt-10 border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} TradeVortex. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-600">|</span>
            <p className="font-mono text-[11px] text-slate-400">
              Engineered for Precision & Financial Discipline
            </p>
          </div>

          {/* CLEARLY VISIBLE ADMIN PORTAL & COOKIE PREFERENCES */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenCookieSettings && (
              <button
                type="button"
                onClick={() => {
                  playClickSound('click');
                  onOpenCookieSettings();
                }}
                aria-label="Open Cookie Preferences"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors cursor-pointer"
              >
                <Cookie className="h-3.5 w-3.5 text-cyan-400" />
                <span>Cookie Settings</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                playClickSound('click');
                onOpenAdmin();
              }}
              aria-label="Open Secure Admin Portal"
              title="Secure Admin Portal - Manage Brokers, Banners & Links"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-950/60 transition-all shadow-sm shadow-cyan-950/50 cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5 text-cyan-400" />
              <span>{language === 'en' ? 'Admin Portal' : t.adminPanel}</span>
              <span className="rounded bg-cyan-500/20 px-1.5 py-0.2 text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
                Secure
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
