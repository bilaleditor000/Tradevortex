import React, { useState, useEffect } from 'react';
import { FAQItem } from '../types';
import { getStoredFaqs, FAQS_EVENT_KEY } from '../data/faqsData';
import { playClickSound } from '../utils/sound';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

export const FAQView: React.FC = () => {
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
    const matchesSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    playClickSound('click');
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300 mb-3">
          <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
          <span>Knowledge & Support Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
          Common queries regarding trading calculations, broker safety, margin call mechanics, and our affiliate partnerships.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs by question or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                playClickSound('click');
                setActiveCategory(cat);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = !!openIds[faq.id];
          return (
            <div
              key={faq.id}
              className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-semibold text-slate-100 hover:text-cyan-300 transition-colors"
              >
                <span className="pr-4">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-cyan-400 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400 text-xs">
            No FAQs match your search query.
          </div>
        )}
      </div>
    </div>
  );
};
