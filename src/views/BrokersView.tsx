import React, { useState, useEffect } from 'react';
import { AdminSettings, Broker, Language } from '../types';
import { getAdminSettings, ADMIN_EVENT_KEY } from '../data/adminSettings';
import { playClickSound } from '../utils/sound';
import { BrokerDemoSimulator } from '../components/BrokerDemoSimulator';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { CustomBlocksRenderer } from '../components/CustomBlocksRenderer';
import { MediaPlacementsRenderer } from '../components/MediaPlacementsRenderer';
import { VipPartnerBanner } from '../components/VipPartnerBanner';
import { trackAnalyticsEvent } from '../data/analyticsStore';
import {
  Shield,
  Search,
  ExternalLink,
  Star,
  SlidersHorizontal,
  Activity,
  Award,
  Sparkles,
  Layers,
  CheckCircle2,
  Zap
} from 'lucide-react';

interface BrokersViewProps {
  brokers: Broker[];
  onOpenBroker: (broker: Broker) => void;
  onOpenOwnerPanel: () => void;
  language?: Language;
}

export const BrokersView: React.FC<BrokersViewProps> = ({
  brokers,
  onOpenBroker,
  onOpenOwnerPanel,
  language = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'simulator'>('directory');
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getAdminSettings());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [featureFilter, setFeatureFilter] = useState<'all' | 'raw-ecn' | 'swap-free' | 'instant-withdrawal'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');

  useEffect(() => {
    const sync = () => setAdminSettings(getAdminSettings());
    window.addEventListener(ADMIN_EVENT_KEY, sync);
    return () => window.removeEventListener(ADMIN_EVENT_KEY, sync);
  }, []);

  const categories = ['All', 'Forex', 'Multi-Asset', 'Digital Options', 'Crypto'];

  const filteredBrokers = brokers
    .filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase()) ||
        b.regulation.some((r) => r.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || b.category === selectedCategory;

      let matchesFeature = true;
      if (featureFilter === 'raw-ecn') {
        matchesFeature = Boolean(b.rawSpreadEcn || b.spreadFrom.includes('0.0'));
      } else if (featureFilter === 'swap-free') {
        matchesFeature = b.swapFree !== false;
      } else if (featureFilter === 'instant-withdrawal') {
        matchesFeature = Boolean(b.instantWithdrawal);
      }

      return matchesSearch && matchesCategory && matchesFeature;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300 mb-3">
            <Shield className="h-3.5 w-3.5 text-cyan-400" />
            <span>Top 10 Tier-1 Regulated &amp; ECN/Raw Spread Brokers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Institutional Broker Comparison &amp; Live Simulator
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Compare Tier-1 regulated ECN and multi-asset brokers featuring 0.0 raw spreads, sub-25ms fiber execution, and swap-free accounts, or practice on our interactive demo simulator.
          </p>
        </div>

        {/* View Mode Toggle: Directory vs Simulator */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              setActiveTab('directory');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'directory'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Top 10 Matrix</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound('calculate');
              setActiveTab('simulator');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'simulator'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Demo Platform Simulator</span>
          </button>
        </div>
      </div>

      <CustomBlocksRenderer page="brokers" />
      <MediaPlacementsRenderer page="brokers" />

      {/* Mandatory Slot 1: Header Top Leaderboard Slot (728x90 / 320x50) */}
      <AdPlaceholder
        page="brokers"
        format="leaderboard"
        placement="header"
        slotLabel="Header Top Leaderboard Slot (728x90 / 320x50)"
      />

      {/* RENDER SIMULATOR TAB OR DIRECTORY TAB */}
      {activeTab === 'simulator' ? (
        <BrokerDemoSimulator brokers={brokers} language={language} />
      ) : (
        <div className="space-y-6">
          <VipPartnerBanner adminSettings={adminSettings} pageName="brokers" />

          {/* Institutional Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
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
                  setFeatureFilter(tab.id);
                }}
                className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  featureFilter === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'border border-slate-800 bg-slate-900/70 text-slate-300 hover:text-white hover:border-cyan-500/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-cyan-500/20 bg-slate-900/60 p-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search brokers by name, license (FCA, ASIC), or spread..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    playClickSound('click');
                    setSelectedCategory(cat);
                  }}
                  className={`text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  playClickSound('click');
                  setSortBy(e.target.value as 'rating' | 'name');
                }}
                className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="rating">Highest Rating</option>
                <option value="name">Broker Name</option>
              </select>
            </div>
          </div>

          {/* Mandatory Slot 2: Mid-Page High-CPM Ad Slot (728x90) */}
          <AdPlaceholder
            page="brokers"
            format="leaderboard"
            placement="midpage"
            slotLabel="Mid-Page High-CPM Ad Slot (728x90)"
          />

          {/* Top 10 Tier-1 ECN Brokers List Cards */}
          <div className="space-y-4">
            {filteredBrokers.map((broker, index) => (
              <React.Fragment key={broker.id}>
                <div
                  className="flex flex-col gap-4 rounded-xl border border-cyan-500/20 bg-slate-900/80 p-5 shadow-lg hover:border-cyan-500/40 transition-all"
                >
                  {/* Top Info Row: Brand, Key Metrics & Pros */}
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
                    {/* Broker Brand & Badge */}
                    <div className="flex items-start gap-4 lg:w-1/3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 font-bold font-mono text-base shadow-sm">
                        {broker.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white hover:text-cyan-300 transition-colors">
                            {broker.name}
                          </h3>
                          {broker.badge && (
                            <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-bold">
                              {broker.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <div className="flex items-center text-amber-400">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span className="ml-1 font-mono font-bold text-slate-200">{broker.rating}</span>
                          </div>
                          <span>·</span>
                          <span>{broker.reviewCount} Reviews</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {broker.regulation.slice(0, 3).map((reg) => (
                            <span
                              key={reg}
                              className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-cyan-400 font-mono"
                            >
                              {reg}
                            </span>
                          ))}
                          {broker.swapFree !== false && (
                            <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] text-emerald-300 font-mono">
                              Swap-Free
                            </span>
                          )}
                          {broker.instantWithdrawal && (
                            <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 text-[10px] text-cyan-300 font-mono inline-flex items-center gap-0.5">
                              <Zap className="h-2.5 w-2.5" /> Instant
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Key Institutional Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-lg bg-slate-950/70 p-3 text-center text-xs lg:w-5/12">
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-0.5">Spreads From</span>
                        <span className="font-mono text-sm font-bold text-cyan-300">{broker.spreadFrom}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-0.5">Execution</span>
                        <span className="font-mono text-sm font-bold text-white">
                          {broker.executionSpeed || '< 30ms'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-0.5">Max Leverage</span>
                        <span className="font-mono text-sm font-bold text-white">{broker.maxLeverage}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-0.5">Min Start</span>
                        <span className="font-mono text-xs font-semibold text-slate-300">{broker.minDeposit}</span>
                      </div>
                    </div>

                    {/* Pros and Promo */}
                    <div className="lg:w-1/3 hidden xl:block text-xs text-slate-300 space-y-1">
                      {broker.specialOffer && (
                        <div className="text-[11px] font-bold text-amber-300 font-mono flex items-center gap-1 mb-1">
                          <Sparkles className="h-3 w-3 text-amber-400" />
                          <span>{broker.specialOffer}</span>
                        </div>
                      )}
                      {broker.pros.slice(0, 2).map((pro, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 line-clamp-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="truncate text-slate-300">{pro}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons: Clean 2-Button Full-Width Row (Review & Start Trading) */}
                  <div className="grid grid-cols-2 w-full gap-2.5 sm:gap-3 pt-3.5 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound('click');
                        onOpenBroker(broker);
                      }}
                      className="w-full min-w-0 flex items-center justify-center px-3 py-2.5 rounded-lg border border-slate-700 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors overflow-hidden"
                    >
                      <span className="truncate">Review</span>
                    </button>
                    <a
                      href={(() => {
                        const rawUrl = adminSettings.brokerLinks?.[broker.id] || broker.affiliateUrl || '';
                        return rawUrl.startsWith('https://') || rawUrl.startsWith('http://')
                          ? rawUrl
                          : 'https://tradevortex.com';
                      })()}
                      target="_blank"
                      rel="sponsored nofollow"
                      onClick={() => {
                        playClickSound('calculate');
                        trackAnalyticsEvent('referral_click', 'brokers', `Broker: ${broker.name}`);
                      }}
                      className="w-full min-w-0 flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-md shadow-cyan-500/25 uppercase tracking-tight overflow-hidden"
                    >
                      <span className="truncate">Start Trading</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Mandatory Slot 3: In-Article / Between Brokers Native Ad Slot (inserted after index 1) */}
                {index === 1 && (
                  <div className="py-2">
                    <AdPlaceholder
                      page="brokers"
                      format="infeed"
                      placement="article"
                      slotLabel="In-Article / Between Brokers Native Ad Slot"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Broker Diligence Notes & Mandatory Slot 4: Sidebar Vertical Banner Ad Slot (300x600) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  Regulatory Due Diligence Standards
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every broker featured on TradeVortex undergoes stringent licensing verification. We cross-reference registration numbers against tier-1 regulators including the UK FCA, Australian ASIC, Cyprus CySEC, and South African FSCA. Client funds must be held in segregated tier-1 banking institutions.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-cyan-400" />
                  Institutional Execution Speed, Raw Spreads &amp; Liquidity Depth
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  High-volume intraday and algorithmic traders rely on NY4/LD4 Equinix fiber cross-connections, sub-25ms order routing, and true 0.0-pip ECN raw spreads to minimize slippage during London and New York liquidity overlaps.
                </p>
              </div>
            </div>

            {/* Mandatory Slot 4: Sidebar Vertical Banner Ad Slot (300x600) */}
            <div className="lg:col-span-4 flex justify-center">
              <AdPlaceholder
                page="brokers"
                format="halfpage"
                placement="sidebar"
                slotLabel="Sidebar Vertical Banner Ad Slot (300x600)"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Slot 5: Pre-Footer / Content Bottom Banner Slot (728x90) */}
      <AdPlaceholder
        page="brokers"
        format="leaderboard"
        placement="prefooter"
        slotLabel="Pre-Footer / Content Bottom Banner Slot (728x90)"
      />
    </div>
  );
};
