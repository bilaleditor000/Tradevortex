import React, { useState, useMemo, useEffect } from 'react';
import { GOOGLE_WORLD_LANGUAGES } from '../utils/googleTranslate';
import { playClickSound } from '../utils/sound';
import { Search, X, Check, Globe, Sparkles } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguageCode: string;
  onSelectLanguage: (langCode: string) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLanguageCode,
  onSelectLanguage
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredLanguages = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return GOOGLE_WORLD_LANGUAGES;
    return GOOGLE_WORLD_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(query) ||
        lang.nativeName.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query) ||
        lang.region.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  const popularLanguages = useMemo(() => {
    return GOOGLE_WORLD_LANGUAGES.filter((l) => l.isPopular);
  }, []);

  if (!isOpen) return null;

  const handleSelect = (code: string) => {
    playClickSound('calculate');
    onSelectLanguage(code);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Select World Language"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl rounded-2xl border border-cyan-500/30 bg-slate-900 shadow-2xl shadow-cyan-950/60 overflow-hidden my-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>100% Full-Site World Language Engine</span>
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/30 notranslate">
                  {GOOGLE_WORLD_LANGUAGES.length}+ Languages
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Powered by Google Translate Website Element — translates every menu, calculator, article &amp; footer word
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound('toggle');
              onClose();
            }}
            aria-label="Close language selector"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-6 pb-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search 100+ languages (e.g. Urdu, العربية, فارسی, پښتو, Hindi, Spanish, Chinese, Turkish)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/90 pl-10 pr-14 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none font-sans"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Popular Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-mono font-medium text-slate-400 mr-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-cyan-400" /> Popular:
            </span>
            {popularLanguages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all notranslate ${
                  currentLanguageCode === lang.code
                    ? 'border border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'border border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language Cards Grid */}
        <div className="p-6 pt-2 max-h-[380px] overflow-y-auto">
          {filteredLanguages.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">No languages matching &quot;{searchTerm}&quot;</p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-2 text-xs text-cyan-400 hover:underline"
              >
                View all {GOOGLE_WORLD_LANGUAGES.length}+ supported languages
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {filteredLanguages.map((lang) => {
                const isSelected = currentLanguageCode === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`group relative flex items-center justify-between rounded-xl border p-3 text-left transition-all notranslate ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/40 shadow-md shadow-cyan-950/50'
                        : 'border-slate-800/80 bg-slate-950/40 hover:border-cyan-500/40 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl select-none" aria-hidden="true">
                        {lang.flag}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-sm font-bold truncate ${
                              isSelected ? 'text-cyan-300' : 'text-slate-100 group-hover:text-white'
                            }`}
                          >
                            {lang.nativeName}
                          </span>
                          {lang.direction === 'rtl' && (
                            <span className="rounded bg-slate-800 px-1 py-0.2 text-[9px] font-mono text-slate-400 border border-slate-700">
                              RTL
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">{lang.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono truncate">{lang.region}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-slate-950">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/80 px-6 py-3 text-xs text-slate-400">
          <span>Selection automatically sets RTL/LTR direction and saves across sessions.</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-3 py-1 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
