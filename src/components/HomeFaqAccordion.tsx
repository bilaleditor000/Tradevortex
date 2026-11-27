import React, { useState, useEffect } from 'react';
import { FAQItem } from '../types';
import { getStoredFaqs, FAQS_EVENT_KEY } from '../data/faqsData';
import { playClickSound } from '../utils/sound';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

export const HomeFaqAccordion: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(() => getStoredFaqs());
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>(() => {
    const initial = getStoredFaqs();
    return initial[0] ? { [initial[0].id]: true } : {};
  });

  useEffect(() => {
    const syncFaqs = () => setFaqs(getStoredFaqs());
    window.addEventListener(FAQS_EVENT_KEY, syncFaqs);
    return () => window.removeEventListener(FAQS_EVENT_KEY, syncFaqs);
  }, []);

  const categories = [
    'All',
    'Trading Basics',
    'Risk & Psychology',
    'Calculators',
    'Brokers',
    'Trading Mechanics',
    'Account & Security'
  ];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    playClickSound('click');
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300 mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
              <span>Comprehensive Trading Encyclopedia ({faqs.length} Q&amp;As)</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Everything About Trading: {faqs.length} Essential Questions &amp; Answers
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Clear answers covering market mechanics, legendary trader principles, trading psychology, the 1%–2% risk rule, leverage, stop-loss discipline, and demo-to-live transition.
            </p>
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter questions (e.g. leverage, gold)..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                playClickSound('click');
                setActiveCategory(cat);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-semibold ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expandable 30 Q&A Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
          {filteredFaqs.map((faq) => {
            const isOpen = !!openIds[faq.id];
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden shadow-sm hover:border-cyan-500/35 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-100 hover:text-cyan-300 transition-colors gap-3"
                >
                  <div className="min-w-0">
                    <span className="inline-block rounded bg-cyan-500/15 border border-cyan-500/25 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 mb-1">
                      {faq.category}
                    </span>
                    <div className="leading-snug">{faq.question}</div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-2 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/70 bg-slate-900/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-center text-xs text-slate-400">
            No matching questions found for &ldquo;{search}&rdquo;.
          </div>
        )}
      </div>
    </section>
  );
};
