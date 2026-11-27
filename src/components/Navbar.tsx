import React, { useState, useEffect } from 'react';
import { PageView, Language, AdminSettings } from '../types';
import { playClickSound } from '../utils/sound';
import { TRANSLATIONS } from '../utils/translations';
import { GOOGLE_WORLD_LANGUAGES, getGoogleLanguageOption } from '../utils/googleTranslate';
import { getAdminSettings, ADMIN_EVENT_KEY } from '../data/adminSettings';
import { Volume2, VolumeX, Sun, Moon, Menu, X, ArrowUpRight, Globe, ChevronDown, ExternalLink } from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  language: Language;
  activeLangCode: string;
  onLanguageChange: (langCode: string) => void;
  onOpenLanguageModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  theme,
  onToggleTheme,
  language,
  activeLangCode,
  onLanguageChange,
  onOpenLanguageModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(getSoundEnabledSafe());
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getAdminSettings());

  useEffect(() => {
    const sync = () => setAdminSettings(getAdminSettings());
    window.addEventListener(ADMIN_EVENT_KEY, sync);
    return () => window.removeEventListener(ADMIN_EVENT_KEY, sync);
  }, []);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currentLangObj = getGoogleLanguageOption(activeLangCode);
  const popularLanguages = GOOGLE_WORLD_LANGUAGES.filter((l) => l.isPopular);
  const customNavButtons = (adminSettings.customNavButtons || []).filter((b) => b.active);
  const siteLogoUrl = adminSettings.siteLogoUrl?.trim();

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) {
      playClickSound('toggle');
    }
  };

  const navLinks: { id: PageView; label: string; badge?: string }[] = [
    { id: 'home', label: t.home },
    { id: 'calculators', label: t.calculators },
    { id: 'markets', label: t.markets },
    { id: 'brokers', label: t.brokers, badge: 'ECN' },
    { id: 'signals', label: t.signals, badge: 'LIVE' },
    { id: 'quiz', label: t.quiz },
    { id: 'journal', label: t.journal },
    { id: 'academy', label: t.academy },
    { id: 'quotex', label: t.quotex, badge: 'Ad-Free' }
  ];

  const handleCustomNavClick = (btn: NonNullable<AdminSettings['customNavButtons']>[number]) => {
    playClickSound('click');
    if (btn.targetType === 'page') {
      onNavigate(btn.targetValue as PageView);
    } else if (
      btn.targetValue.startsWith('https://') ||
      btn.targetValue.startsWith('http://')
    ) {
      const a = document.createElement('a');
      a.href = btn.targetValue;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark / Dynamic Admin Site Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              onNavigate('home');
            }}
            className="group flex items-center gap-2 text-left"
          >
            {siteLogoUrl &&
            (siteLogoUrl.startsWith('https://') ||
              siteLogoUrl.startsWith('http://') ||
              siteLogoUrl.startsWith('data:image/')) ? (
              <img
                src={siteLogoUrl}
                alt="TradeVortex Logo"
                className="h-9 w-auto max-w-[140px] object-contain rounded-lg border border-cyan-500/30 bg-slate-900/50 p-0.5"
              />
            ) : (
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 shadow-md shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all notranslate">
                <span className="font-extrabold text-slate-950 text-lg font-mono">V</span>
                <div className="absolute inset-0 rounded-lg border border-cyan-200/40" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white font-sans flex items-center notranslate">
                Trade<span className="text-cyan-400">Vortex</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold overflow-x-auto max-w-[54%]">
          {navLinks.slice(0, 7).map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  playClickSound('click');
                  onNavigate(link.id);
                }}
                className={`relative py-1 transition-colors flex items-center gap-1 whitespace-nowrap ${
                  isActive
                    ? 'text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-1 py-0.2 text-[9px] font-mono text-cyan-300">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full" />
                )}
              </button>
            );
          })}

          {customNavButtons.slice(0, 3).map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => handleCustomNavClick(btn)}
              className={`relative py-1 transition-colors flex items-center gap-1 whitespace-nowrap ${
                btn.targetType === 'page' && currentPage === btn.targetValue
                  ? 'text-cyan-400 font-bold'
                  : 'text-cyan-200 hover:text-white'
              }`}
            >
              <span>{btn.label}</span>
              {btn.badge && (
                <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-1 text-[9px] font-mono text-emerald-300">
                  {btn.badge}
                </span>
              )}
              {btn.targetType === 'url' && <ExternalLink className="h-3 w-3 opacity-75" />}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions (Language, Sound, Theme, CTA) */}
        <div className="flex items-center gap-2">
          {/* Multi-Language Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                playClickSound('click');
                setLangDropdownOpen(!langDropdownOpen);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors notranslate"
              title="Change Portal Language (100+ Languages)"
            >
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-mono text-xs">{currentLangObj.flag}</span>
              <span className="font-mono text-[11px] uppercase font-bold text-slate-200">
                {activeLangCode}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-60 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl p-1.5 z-50 animate-in fade-in notranslate">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800 mb-1 flex items-center justify-between">
                  <span>Full-Site Translation</span>
                  <span className="text-cyan-400">{GOOGLE_WORLD_LANGUAGES.length}+ Total</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-0.5">
                  {popularLanguages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        playClickSound('click');
                        onLanguageChange(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        activeLangCode === l.code
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.nativeName}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 uppercase">{l.code}</span>
                    </button>
                  ))}
                </div>

                {/* More Languages Modal Opener */}
                <div className="border-t border-slate-800 pt-1 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound('toggle');
                      setLangDropdownOpen(false);
                      onOpenLanguageModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-2.5 py-2 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
                  >
                    <Globe className="h-3.5 w-3.5 text-cyan-400" />
                    <span>All {GOOGLE_WORLD_LANGUAGES.length}+ Languages...</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={soundOn ? 'Mute click sounds' : 'Enable click sounds'}
            title={soundOn ? 'Click Sound: Enabled' : 'Click Sound: Muted'}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
              soundOn
                ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-400 shadow-sm shadow-cyan-500/20'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => {
              playClickSound('toggle');
              onToggleTheme();
            }}
            aria-label="Toggle dark/light mode"
            title={theme === 'dark' ? t.lightMode : t.darkMode}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-cyan-400" />
            )}
          </button>

          {/* Quick Brokers CTA Button */}
          <button
            type="button"
            onClick={() => {
              playClickSound('calculate');
              onNavigate('brokers');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-md shadow-cyan-500/25 whitespace-nowrap"
          >
            <span>Top 10 Brokers</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Open navigation menu"
            className={`lg:hidden flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
              theme === 'light'
                ? 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className={`lg:hidden border-b px-4 pt-2 pb-5 space-y-2 ${
            theme === 'light'
              ? 'border-slate-200 bg-white text-slate-900 shadow-xl'
              : 'border-slate-800 bg-slate-950/98 text-slate-200'
          }`}
        >
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                type="button"
                data-active={isActive ? 'true' : 'false'}
                onClick={() => {
                  playClickSound('click');
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-xs transition-colors ${
                  theme === 'light'
                    ? isActive
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : 'text-slate-900 font-bold hover:bg-slate-100 hover:text-blue-700'
                    : isActive
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                      theme === 'light'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}

          {customNavButtons.map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => handleCustomNavClick(btn)}
              className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                theme === 'light'
                  ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200'
                  : 'text-cyan-300 bg-cyan-950/20 hover:bg-cyan-950/40'
              }`}
            >
              <span>{btn.label}</span>
              {btn.badge && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                    theme === 'light'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {btn.badge}
                </span>
              )}
            </button>
          ))}

          <div className={`pt-2 border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-800/80'}`}>
            <button
              type="button"
              onClick={() => {
                playClickSound('toggle');
                setMobileMenuOpen(false);
                onOpenLanguageModal();
              }}
              className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-xs font-bold border notranslate ${
                theme === 'light'
                  ? 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200'
                  : 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className={`h-4 w-4 ${theme === 'light' ? 'text-blue-700' : 'text-cyan-400'}`} />
                <span>
                  Language: {currentLangObj.flag} {currentLangObj.nativeName}
                </span>
              </div>
              <span
                className={`font-mono text-[10px] uppercase font-bold ${
                  theme === 'light' ? 'text-blue-700' : 'text-cyan-400'
                }`}
              >
                Change
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

import { getSoundEnabled, setSoundEnabled } from '../utils/sound';
function getSoundEnabledSafe(): boolean {
  try {
    return getSoundEnabled();
  } catch {
    return true;
  }
}
