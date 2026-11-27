import React, { useState, useEffect } from 'react';
import { Article, PageView, Language, AdminSettings } from '../types';
import { playClickSound } from '../utils/sound';
import { TRANSLATIONS } from '../utils/translations';
import { getAdminSettings, ADMIN_EVENT_KEY, getCmsValue } from '../data/adminSettings';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { TradingQuestionBox } from '../components/TradingQuestionBox';
import { CustomBlocksRenderer } from '../components/CustomBlocksRenderer';
import { MediaPlacementsRenderer } from '../components/MediaPlacementsRenderer';
import {
  BookOpen,
  Search,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Share2,
  Check,
  Calculator,
  ChevronDown,
  ChevronUp,
  Quote
} from 'lucide-react';

interface AcademyViewProps {
  articles: Article[];
  selectedArticle: Article | null;
  onSelectArticle: (article: Article | null) => void;
  onNavigate: (page: PageView) => void;
  language?: Language;
}

function renderFormattedInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export const AcademyView: React.FC<AcademyViewProps> = ({
  articles,
  selectedArticle,
  onSelectArticle,
  onNavigate,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getAdminSettings());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const syncAdmin = () => setAdminSettings(getAdminSettings());
    window.addEventListener(ADMIN_EVENT_KEY, syncAdmin);
    return () => window.removeEventListener(ADMIN_EVENT_KEY, syncAdmin);
  }, []);

  const categories = [
    'All',
    'Beginner',
    'Risk Management',
    'Technical Analysis',
    'Commodities & Indices',
    'Psychology'
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase()) ||
      art.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // If a specific article is selected, render the full reader view
  if (selectedArticle) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Back button */}
        <button
          type="button"
          onClick={() => {
            playClickSound('click');
            onSelectArticle(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Articles</span>
        </button>

        {/* Article Header */}
        <header className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-mono font-bold text-cyan-300">
              {selectedArticle.category}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {selectedArticle.readTime}
            </span>
            <span>·</span>
            <span>{selectedArticle.date}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {selectedArticle.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {selectedArticle.subtitle}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold font-mono">
                {selectedArticle.author.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="block text-sm font-bold text-white">
                  {selectedArticle.author}
                </span>
                <span className="text-xs text-cyan-400 font-mono">
                  {selectedArticle.authorRole}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playClickSound('click');
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href).catch(() => {});
                }
                setShareCopied(true);
                window.setTimeout(() => setShareCopied(false), 2000);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              {shareCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Mandatory Slot 1: Header Top Leaderboard Slot (728x90 / 320x50) */}
        <AdPlaceholder
          page="academy"
          format="leaderboard"
          placement="header"
          slotLabel="Article Header Top Leaderboard Slot (728x90 / 320x50)"
        />

        {/* Key Takeaways Box */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-5 shadow-lg shadow-cyan-950/20">
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            Executive Summary & Key Takeaways
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
            {selectedArticle.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Article Body Content (800+ Words Structured Content) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <article className="prose prose-invert prose-cyan max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-6">
              {selectedArticle.content.split('\n\n').map((paragraph, index) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                // Headings
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3
                      key={index}
                      className="text-lg sm:text-xl font-bold text-white pt-4 pb-1 border-b border-slate-800 flex items-center gap-2"
                    >
                      <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }
                if (trimmed.startsWith('#### ')) {
                  return (
                    <h4
                      key={index}
                      className="text-base font-bold text-cyan-300 pt-2"
                    >
                      {trimmed.replace('#### ', '')}
                    </h4>
                  );
                }

                // Code or ASCII blocks
                if (trimmed.startsWith('```')) {
                  const codeContent = trimmed.replace(/```[a-z]*\n?/, '').replace(/```$/, '');
                  return (
                    <pre
                      key={index}
                      className="overflow-x-auto rounded-lg bg-slate-950 p-4 font-mono text-xs text-cyan-300 border border-slate-800 leading-normal"
                    >
                      {codeContent}
                    </pre>
                  );
                }

                // Table parsing (simple markdown table)
                if (trimmed.includes('|') && trimmed.includes('\n|')) {
                  const lines = trimmed.split('\n');
                  const headerLine = lines[0];
                  const bodyLines = lines.slice(2);
                  const headers = headerLine.split('|').filter(Boolean).map(h => h.trim());

                  return (
                    <div key={index} className="overflow-x-auto my-4 rounded-lg border border-slate-800 bg-slate-950/60">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-900 border-b border-slate-800 text-cyan-300">
                          <tr>
                            {headers.map((h, i) => (
                              <th key={i} className="px-3 py-2 font-bold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {bodyLines.map((row, rIdx) => {
                            const cells = row.split('|').filter(Boolean).map(c => c.trim());
                            return (
                              <tr key={rIdx} className="hover:bg-slate-900/40">
                                {cells.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-3 py-2">{cell}</td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                // Horizontal rule
                if (trimmed === '---') {
                  return <hr key={index} className="border-slate-800 my-4" />;
                }

                // Blockquotes (Legendary Trader Quotes & Callouts)
                if (trimmed.startsWith('> ')) {
                  const quoteText = trimmed
                    .split('\n')
                    .map((line) => line.replace(/^>\s?/, ''))
                    .join(' ');
                  return (
                    <blockquote
                      key={index}
                      className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-4 flex items-start gap-3 text-amber-200 italic text-sm sm:text-base"
                    >
                      <Quote className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{renderFormattedInline(quoteText)}</span>
                    </blockquote>
                  );
                }

                // Unordered list
                if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                  const items = trimmed.split('\n').filter(Boolean);
                  return (
                    <ul key={index} className="space-y-1.5 text-xs sm:text-sm pl-4 list-disc text-slate-300">
                      {items.map((it, itIdx) => (
                        <li key={itIdx}>
                          {renderFormattedInline(it.replace(/^[*|-]\s+/, ''))}
                        </li>
                      ))}
                    </ul>
                  );
                }

                // Numbered list
                if (/^\d+\.\s/.test(trimmed)) {
                  const items = trimmed.split('\n').filter(Boolean);
                  return (
                    <ol key={index} className="space-y-1.5 text-xs sm:text-sm pl-4 list-decimal text-slate-300">
                      {items.map((it, itIdx) => (
                        <li key={itIdx}>
                          {renderFormattedInline(it.replace(/^\d+\.\s+/, ''))}
                        </li>
                      ))}
                    </ol>
                  );
                }

                return (
                  <p key={index} className="text-slate-300 leading-relaxed text-sm sm:text-base">
                    {renderFormattedInline(trimmed)}
                  </p>
                );
              })}
            </article>

            {/* Mandatory Slot 3: In-Article Native Ad Slot */}
            <div className="pt-6">
              <AdPlaceholder
                page="academy"
                format="infeed"
                placement="article"
                slotLabel="In-Article Educational Native Ad Slot"
              />
            </div>

            {/* Article FAQs Section */}
            {selectedArticle.faqs && selectedArticle.faqs.length > 0 && (
              <div className="mt-8 border-t border-slate-800 pt-6 space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-cyan-400" />
                  Frequently Asked Questions About This Guide
                </h3>
                <div className="space-y-2">
                  {selectedArticle.faqs.map((faq, fIdx) => {
                    const isOpen = openFaqIndex === fIdx;
                    return (
                      <div
                        key={fIdx}
                        className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            playClickSound('click');
                            setOpenFaqIndex(isOpen ? null : fIdx);
                          }}
                          className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
                        >
                          <span>{faq.question}</span>
                          {isOpen ? <ChevronUp className="h-4 w-4 text-cyan-400 shrink-0 ml-2" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />}
                        </button>
                        {isOpen && (
                          <div className="p-4 pt-0 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 bg-slate-950/40 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar with 300x600 Vertical AdSlot and Related Tools */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Calculator Widget Launcher */}
            <div className="rounded-xl border border-cyan-500/25 bg-slate-900/80 p-5 shadow-lg">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono mb-2 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Practice With Calculators
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Apply this guide&apos;s risk formula directly to your live account with our position size calculator.
              </p>
              <button
                type="button"
                onClick={() => {
                  playClickSound('calculate');
                  onNavigate('calculators');
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
              >
                <span>Open Forex Lot Calculator</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Mandatory Slot 4: Sidebar Vertical Banner Ad Slot (300x600) */}
            <AdPlaceholder
              page="academy"
              format="halfpage"
              placement="sidebar"
              slotLabel="Sidebar Vertical Banner Ad Slot (300x600)"
            />

            {/* Other Guides list */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-3">
                More Educational Guides
              </h4>
              <div className="space-y-3">
                {articles
                  .filter((a) => a.id !== selectedArticle.id)
                  .slice(0, 3)
                  .map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => {
                        playClickSound('click');
                        onSelectArticle(rel);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="cursor-pointer group border-b border-slate-800/60 pb-2.5 last:border-0"
                    >
                      <span className="text-[10px] text-cyan-400 font-mono block">
                        {rel.category}
                      </span>
                      <h5 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {rel.title}
                      </h5>
                    </div>
                  ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Mandatory Slot 5: Pre-Footer / Content Bottom Banner Slot (728x90) */}
        <AdPlaceholder
          page="academy"
          format="leaderboard"
          placement="prefooter"
          slotLabel="Pre-Footer / Content Bottom Banner Slot (728x90)"
        />
      </div>
    );
  }

  // Articles Hub List View
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300 mb-3">
          <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
          <span>Institutional Research & Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {getCmsValue(adminSettings, 'academyTitle', t.academyTitle)}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
          {getCmsValue(adminSettings, 'academySubtitle', t.academySubtitle)}
        </p>
      </div>

      {/* Admin Custom Content Blocks & Uploaded Media */}
      <CustomBlocksRenderer page="academy" />
      <MediaPlacementsRenderer page="academy" />

      {/* Mandatory Slot 1: Header Top Leaderboard Slot (728x90 / 320x50) */}
      <AdPlaceholder
        page="academy"
        format="leaderboard"
        placement="header"
        slotLabel="Header Top Leaderboard Slot (728x90 / 320x50)"
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-cyan-500/20 bg-slate-900/60 p-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search guides by title, topic, or keyword (e.g. stop loss, gold, margin)..."
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
                setSelectedCategory(cat);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Slot 2: Mid-Page High-CPM Ad Slot (728x90) */}
      <AdPlaceholder
        page="academy"
        format="leaderboard"
        placement="midpage"
        slotLabel="Mid-Page High-CPM Ad Slot (728x90)"
      />

      {/* 8 Full Articles Grid with Mandatory Slot 3 in-feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article, index) => (
          <React.Fragment key={article.id}>
            <article
              onClick={() => {
                playClickSound('click');
                onSelectArticle(article);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer rounded-xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-lg hover:border-cyan-500/50 hover:bg-slate-900/95 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5">
                  <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[11px] font-mono font-bold text-cyan-300">
                    {article.category}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {article.readTime}
                  </span>
                  <span>·</span>
                  <span>{article.date}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-2">
                  {article.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {article.summary}
                </p>

                {/* Key Takeaways snippet */}
                <div className="rounded-lg bg-slate-950/80 p-3 text-[11px] text-slate-300 space-y-1 mb-4 border border-slate-800/60">
                  <span className="font-mono text-cyan-400 font-semibold block uppercase">
                    Highlights:
                  </span>
                  <p className="line-clamp-2 text-slate-400">
                    {article.keyTakeaways[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs gap-2">
                <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px] truncate">
                  <User className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{article.author}</span>
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound('click');
                    onSelectArticle(article);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/40 px-3 py-1.5 text-xs font-bold text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shrink-0"
                >
                  <span>{t.readFullArticle}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>

            {/* Mandatory Slot 3: In-Feed Native Ad Slot (inserted after index 1) */}
            {index === 1 && (
              <div className="md:col-span-2 py-2">
                <AdPlaceholder
                  page="academy"
                  format="infeed"
                  placement="article"
                  slotLabel="In-Article / Native In-Feed Catalog Ad Slot"
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Curriculum Overview & Mandatory Slot 4: Sidebar Vertical Banner Ad Slot (300x600) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              Core Academy Methodology & Philosophy
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every handbook in the TradeVortex Academy is engineered around verifiable mathematical expectancy rather than subjective intuition. We advocate asymmetric payoff structures, strict risk caps (1-2% maximum drawdown per position), and systematic logging.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              Recommended Learning Roadmap
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Begin with &apos;Position Sizing & Capital Preservation Math&apos; before advancing to &apos;Order Flow & Liquidity Engineering&apos;. Always test concepts in the TradeVortex Demo Simulator or with a low-deposit micro account prior to committing standard sizing.
            </p>
          </div>
        </div>

        {/* Mandatory Slot 4: Sidebar Vertical Banner Ad Slot (300x600) */}
        <div className="lg:col-span-4 flex justify-center">
          <AdPlaceholder
            page="academy"
            format="halfpage"
            placement="sidebar"
            slotLabel="Sidebar Vertical Banner Ad Slot (300x600)"
          />
        </div>
      </div>

      {/* Interactive Ask a Trading Question Box */}
      <TradingQuestionBox language={language} />

      {/* Mandatory Slot 5: Pre-Footer / Content Bottom Banner Slot (728x90) */}
      <AdPlaceholder
        page="academy"
        format="leaderboard"
        placement="prefooter"
        slotLabel="Pre-Footer / Content Bottom Banner Slot (728x90)"
      />
    </div>
  );
};
