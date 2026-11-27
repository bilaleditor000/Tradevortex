import React, { useState, useEffect } from 'react';
import { PageView, Broker, Article, Language, AdminSettings } from '../types';
import { playClickSound } from '../utils/sound';
import { TRANSLATIONS } from '../utils/translations';
import { getAdminSettings, ADMIN_EVENT_KEY, getCmsValue, isSectionVisible } from '../data/adminSettings';
import { TradingViewChart } from '../components/TradingViewChart';
import { TradingViewTickerTape } from '../components/TradingViewTickerTape';
import { TradingViewCalendar } from '../components/TradingViewCalendar';
import { FuturesPnLCalc } from '../components/calculators/FuturesPnLCalc';
import { MarketSignalsWidget } from '../components/MarketSignalsWidget';
import { LiquidationHeatmap } from '../components/LiquidationHeatmap';
import { TradingJournalDownload } from '../components/TradingJournalDownload';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { CustomBlocksRenderer } from '../components/CustomBlocksRenderer';
import { MediaPlacementsRenderer } from '../components/MediaPlacementsRenderer';
import { CommunityProofsSection } from '../components/CommunityProofsSection';
import { HomeFaqAccordion } from '../components/HomeFaqAccordion';
import { LiveMarketIntelligenceHub } from '../components/LiveMarketIntelligenceHub';
import { VipPartnerBanner } from '../components/VipPartnerBanner';
import { trackAnalyticsEvent } from '../data/analyticsStore';
import {
  ArrowRight,
  Shield,
  Calculator,
  LineChart,
  BookOpen,
  Star,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (page: PageView) => void;
  onOpenArticle: (article: Article) => void;
  onOpenBroker: (broker: Broker) => void;
  brokers: Broker[];
  articles: Article[];
  theme: 'dark' | 'light';
  language: Language;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenArticle,
  onOpenBroker,
  brokers,
  articles,
  theme,
  language
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getAdminSettings());
  const [brokerFilter, setBrokerFilter] = useState<'all' | 'raw-ecn' | 'swap-free' | 'instant-withdrawal'>('all');

  useEffect(() => {
    const sync = () => setAdminSettings(getAdminSettings());
    window.addEventListener(ADMIN_EVENT_KEY, sync);
    return () => window.removeEventListener(ADMIN_EVENT_KEY, sync);
  }, []);

  const displayBrokers = brokers.filter((b) => {
    if (brokerFilter === 'all') return true;
    if (brokerFilter === 'raw-ecn') return Boolean(b.rawSpreadEcn || b.spreadFrom.includes('0.0'));
    if (brokerFilter === 'swap-free') return b.swapFree !== false;
    if (brokerFilter === 'instant-withdrawal') return Boolean(b.instantWithdrawal);
    return true;
  });
  const blogArticles = articles;
  const activeCalcCount = Math.max(1, 11 - (adminSettings.disabledCalculators?.length || 0));

  return (
    <div className="space-y-12 pb-16">
      {/* Live TradingView Ticker Tape */}
      <TradingViewTickerTape theme={theme} />

      {/* Admin Custom Content Blocks & Uploaded Media */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <CustomBlocksRenderer page="home" />
        <MediaPlacementsRenderer page="home" />
      </div>

      {/* Hero Section */}
      {isSectionVisible(adminSettings, 'hero') && (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            <span>Institutional Risk Calculators &amp; Tier-1 Regulated ECN Brokers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {getCmsValue(adminSettings, 'heroHeadline', t.heroHeadline)}{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">
              {getCmsValue(adminSettings, 'heroHighlight', t.heroHighlight)}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {getCmsValue(adminSettings, 'heroSubtitle', t.heroSubtitle)}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                playClickSound('calculate');
                onNavigate('calculators');
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-3 text-sm font-bold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-lg shadow-cyan-500/25"
            >
              <Calculator className="h-4 w-4" />
              <span>{t.launchCalculators}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound('click');
                onNavigate('brokers');
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-200 hover:border-cyan-500/40 hover:text-white transition-all"
            >
              <Award className="h-4 w-4 text-cyan-400" />
              <span>{t.compareBrokers}</span>
            </button>
          </div>

          {/* Key Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3">
              <span className="font-mono text-xl sm:text-2xl font-bold text-cyan-300">{brokers.length}</span>
              <span className="block text-xs text-slate-400 mt-0.5">Tier-1 Regulated &amp; ECN Brokers</span>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3">
              <span className="font-mono text-xl sm:text-2xl font-bold text-cyan-300">{activeCalcCount}</span>
              <span className="block text-xs text-slate-400 mt-0.5">Institutional Calculators</span>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3">
              <span className="font-mono text-xl sm:text-2xl font-bold text-cyan-300">$10K</span>
              <span className="block text-xs text-slate-400 mt-0.5">Interactive Demo Simulator</span>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3">
              <span className="font-mono text-xl sm:text-2xl font-bold text-cyan-300">0.0</span>
              <span className="block text-xs text-slate-400 mt-0.5">Raw Spreads &amp; &lt;25ms Latency</span>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Slot 1: Header Top Leaderboard Slot (728x90 / 320x50) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdPlaceholder
          page="home"
          format="leaderboard"
          placement="header"
          slotLabel="Header Top Leaderboard Slot (728x90 / 320x50)"
        />
      </section>

      {/* Real TradingView Live Chart Hub */}
      {isSectionVisible(adminSettings, 'chart') && (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <LineChart className="h-6 w-6 text-cyan-400" />
              Institutional Market Terminal
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Live multi-timeframe TradingView charting engine with instant universal symbol switcher.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              onNavigate('markets');
            }}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Full Screen & Calendar</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <TradingViewChart theme={theme} defaultSymbol="FX:EURUSD" searchPlaceholder={t.searchAnyCoin} />

        {/* Slot 2: Mid-Page High-CPM Ad Slot (728x90) */}
        <AdPlaceholder
          page="home"
          format="leaderboard"
          placement="midpage"
          slotLabel="Mid-Page High-CPM Ad Slot (728x90)"
        />
      </section>
      )}

      {/* Pro Trader Daily Terminal: Live Market Intelligence Hub */}
      {isSectionVisible(adminSettings, 'market-intelligence') && (
        <LiveMarketIntelligenceHub theme={theme} />
      )}

      {/* Featured Calculator Showcase */}
      {isSectionVisible(adminSettings, 'quick-calc') && (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Calculator className="h-6 w-6 text-cyan-400" />
              Spot & Futures Profit/Loss Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Instant PnL, leverage returns, and fee estimations with 5-second result verification.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              onNavigate('calculators');
            }}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All {activeCalcCount} Calculators</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <FuturesPnLCalc />

        {/* Slot 3: In-Article / Between Calculators Native Ad Slot */}
        <div className="pt-4">
          <AdPlaceholder
            page="home"
            format="infeed"
            placement="article"
            slotLabel="In-Article / Between Calculators Native Ad Slot"
          />
        </div>
      </section>
      )}

      {/* Top 10 Tier-1 Regulated & ECN/Raw Spread Brokers Directly on Home Page */}
      {isSectionVisible(adminSettings, 'brokers-preview') && (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <VipPartnerBanner adminSettings={adminSettings} pageName="home" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-cyan-400 shrink-0" />
              <span>Top {brokers.length} Tier-1 Regulated &amp; ECN/Raw Spread Brokers</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Compare verified Tier-1 licensing, raw 0.0 spreads, sub-25ms execution speeds, and swap-free Islamic account support.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              onNavigate('brokers');
            }}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
          >
            <span>Open Full Comparison Matrix</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Institutional Quick Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {(
            [
              { id: 'all', label: `All (${brokers.length})` },
              { id: 'raw-ecn', label: '0.0 Raw Spread (Pro/ECN)' },
              { id: 'swap-free', label: 'Swap-Free (Islamic)' },
              { id: 'instant-withdrawal', label: 'Instant Withdrawal' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playClickSound('click');
                setBrokerFilter(tab.id);
              }}
              className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                brokerFilter === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'border border-slate-800 bg-slate-900/70 text-slate-300 hover:text-white hover:border-cyan-500/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayBrokers.map((broker) => {
            const resolvedAffiliateUrl =
              adminSettings.brokerLinks?.[broker.id] || broker.affiliateUrl || '';
            const safeAffiliateUrl =
              resolvedAffiliateUrl.startsWith('https://') ||
              resolvedAffiliateUrl.startsWith('http://')
                ? resolvedAffiliateUrl
                : 'https://tradevortex.com';

            return (
              <div
                key={broker.id}
                className="flex flex-col justify-between rounded-xl border border-cyan-500/20 bg-slate-900/75 p-5 shadow-lg hover:border-cyan-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 font-bold text-cyan-400 font-mono">
                        {broker.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors truncate">
                          {broker.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-amber-400">
                          <Star className="h-3 w-3 fill-current shrink-0" />
                          <span className="font-mono text-slate-200 font-bold">{broker.rating}</span>
                          <span className="text-slate-500 text-[10px]">({broker.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                    {broker.badge && (
                      <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-bold shrink-0">
                        {broker.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {broker.description}
                  </p>

                  {/* Institutional Specs Row (Spreads, Execution Speed, Swap-Free, subtle Min Deposit) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg bg-slate-950/80 p-2.5 text-center text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Spreads From</span>
                      <span className="font-mono font-bold text-cyan-300">{broker.spreadFrom}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Execution</span>
                      <span className="font-mono font-bold text-white">
                        {broker.executionSpeed || '< 30ms'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Max Lev.</span>
                      <span className="font-mono font-bold text-white">{broker.maxLeverage}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Min Start</span>
                      <span className="font-mono font-semibold text-slate-300">{broker.minDeposit}</span>
                    </div>
                  </div>

                  {/* Regulation & Institutional Feature Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    {broker.regulation.slice(0, 3).map((r) => (
                      <span
                        key={r}
                        className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700/60"
                      >
                        {r}
                      </span>
                    ))}
                    {broker.swapFree !== false && (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-300 font-mono">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Swap-Free
                      </span>
                    )}
                    {broker.instantWithdrawal && (
                      <span className="inline-flex items-center gap-1 rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] text-cyan-300 font-mono">
                        <Zap className="h-2.5 w-2.5" />
                        Instant Payout
                      </span>
                    )}
                  </div>
                </div>

                {/* Clean 2-Button Full-Width Row (Review & Start Trading Only - Zero Overflow) */}
                <div className="grid grid-cols-2 w-full gap-2.5 sm:gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound('click');
                      onOpenBroker(broker);
                    }}
                    className="w-full min-w-0 flex items-center justify-center rounded-lg border border-slate-700 py-2.5 px-3 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors overflow-hidden"
                  >
                    <span className="truncate">Review</span>
                  </button>
                  <a
                    href={safeAffiliateUrl}
                    target="_blank"
                    rel="sponsored nofollow"
                    onClick={() => {
                      playClickSound('calculate');
                      trackAnalyticsEvent('referral_click', 'home', `Broker: ${broker.name}`);
                    }}
                    className="w-full min-w-0 flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 py-2.5 px-3 text-xs sm:text-sm font-bold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-md shadow-cyan-500/20 uppercase tracking-tight overflow-hidden"
                  >
                    <span className="truncate">Start Trading</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      )}

      {/* Daily Market Signals & Analysis Disclaimer Cards */}
      {isSectionVisible(adminSettings, 'signals-preview') && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MarketSignalsWidget />
        </section>
      )}

      {/* Crypto Futures Liquidation Heatmap Matrix */}
      {isSectionVisible(adminSettings, 'heatmap') && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LiquidationHeatmap />
        </section>
      )}

      {/* Economic Calendar & Sidebar Vertical Banner Slot 4 */}
      {isSectionVisible(adminSettings, 'calendar') && (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-cyan-400" />
              Live Global Macro Economic Calendar
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Stay ahead of high-impact CPI, NFP, interest rate decisions, and central bank speeches.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <TradingViewCalendar theme={theme} height={520} />
          </div>
          <div className="lg:col-span-4 flex justify-center">
            {/* Slot 4: Sidebar Vertical Banner Ad Slot (300x600) */}
            <AdPlaceholder
              page="home"
              format="halfpage"
              placement="sidebar"
              slotLabel="Sidebar Vertical Banner Ad Slot (300x600)"
            />
          </div>
        </div>
      </section>
      )}

      {/* Trading Journal Download Lead Magnet */}
      {isSectionVisible(adminSettings, 'journal') && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TradingJournalDownload />
        </section>
      )}

      {/* AdSense In-Content Slot 2 */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdPlaceholder
          page="home"
          format="infeed"
          placement="article"
          slotLabel="Home Native In-Feed Market Spotlight"
        />
      </section>

      {/* Expanded Trading Blogs & Deep-Dive Guides */}
      {isSectionVisible(adminSettings, 'blogs-home') && (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-cyan-400 shrink-0" />
              <span>Trading Blogs &amp; Deep-Dive Guides</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Complete institutional handbooks written to build disciplined, profitable long-term market participants.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              onNavigate('academy');
            }}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
          >
            <span>Open Academy Library ({articles.length})</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => {
                playClickSound('click');
                onOpenArticle(article);
              }}
              className="cursor-pointer rounded-xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-lg hover:border-cyan-500/50 hover:bg-slate-900/95 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2.5">
                  <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] text-cyan-300 font-bold font-mono">
                    {article.category}
                  </span>
                  <span>·</span>
                  <span>{article.readTime}</span>
                  <span>·</span>
                  <span>{article.date}</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-2">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {article.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs gap-2">
                <span className="text-slate-400 font-mono text-[11px] truncate">
                  By {article.author}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound('click');
                    onOpenArticle(article);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/40 px-3 py-1.5 text-xs font-bold text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shrink-0"
                >
                  <span>Read Full Blog</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      )}

      {/* Community Reviews & Winning Proofs (Trust Builder) */}
      {isSectionVisible(adminSettings, 'community-proofs') && (
        <CommunityProofsSection />
      )}

      {/* Everything About Trading: 30 Essential Questions & Answers */}
      {isSectionVisible(adminSettings, 'faqs-home') && (
        <HomeFaqAccordion />
      )}

      {/* Slot 5: Pre-Footer / Content Bottom Banner Slot (728x90) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2">
        <AdPlaceholder
          page="home"
          format="leaderboard"
          placement="prefooter"
          slotLabel="Pre-Footer / Content Bottom Banner Slot (728x90)"
        />
      </section>
    </div>
  );
};
