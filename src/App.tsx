import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { PageView, Broker, Article, AdminSettings } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LanguageModal } from './components/LanguageModal';
import { FloatingTelegramWidget } from './components/FloatingTelegramWidget';
import { MobileAnchorAd } from './components/MobileAnchorAd';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { CustomPageView } from './components/CustomPageView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { FAQView } from './views/FAQView';
import { PrivacyView, TermsView, RiskDisclaimerView, AffiliateDisclosureView } from './views/LegalViews';

const CalculatorsView = lazy(() => import('./views/CalculatorsView').then((m) => ({ default: m.CalculatorsView })));
const MarketsView = lazy(() => import('./views/MarketsView').then((m) => ({ default: m.MarketsView })));
const BrokersView = lazy(() => import('./views/BrokersView').then((m) => ({ default: m.BrokersView })));
const AcademyView = lazy(() => import('./views/AcademyView').then((m) => ({ default: m.AcademyView })));
const SignalsView = lazy(() => import('./views/SignalsView').then((m) => ({ default: m.SignalsView })));
const QuotexView = lazy(() => import('./views/QuotexView').then((m) => ({ default: m.QuotexView })));
const AdminPanelModal = lazy(() => import('./components/AdminPanelModal').then((m) => ({ default: m.AdminPanelModal })));
import { TradingQuiz } from './components/TradingQuiz';
import { TradingJournalDownload } from './components/TradingJournalDownload';
import { OwnerBrokerModal } from './components/OwnerBrokerModal';
import { BrokerDetailModal } from './components/BrokerDetailModal';
import { getStoredBrokers, saveBrokers, resetBrokersToDefault, BROKERS_EVENT_KEY } from './data/brokersData';
import { getAdminSettings, ADMIN_EVENT_KEY } from './data/adminSettings';
import { getStoredArticles, ARTICLES_EVENT_KEY } from './data/articlesData';
import { subscribeGlobalSiteConfig } from './data/cloudSync';
import { trackAnalyticsEvent, updateVisitorPresence } from './data/analyticsStore';
import { initSoundPreference } from './utils/sound';
import { TRANSLATIONS } from './utils/translations';
import {
  GOOGLE_LANG_STORAGE_KEY,
  initGoogleTranslateElement,
  applyGoogleTranslation,
  retriggerActiveGoogleTranslation,
  isRtlLanguageCode,
  resolveCoreLanguage
} from './utils/googleTranslate';
import { Award, FileSpreadsheet } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeLangCode, setActiveLangCode] = useState<string>(() => {
    if (typeof window === 'undefined') return 'en';
    return (
      localStorage.getItem(GOOGLE_LANG_STORAGE_KEY) ||
      localStorage.getItem('tradevortex_lang') ||
      'en'
    );
  });
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getAdminSettings());
  const [brokers, setBrokers] = useState<Broker[]>(() => getStoredBrokers());
  const [articles, setArticles] = useState<Article[]>(() => getStoredArticles());
  const [selectedBrokerModal, setSelectedBrokerModal] = useState<Broker | null>(null);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const currentPageRef = useRef<PageView>(currentPage);
  currentPageRef.current = currentPage;

  // Initialize theme, sound, Google Translate, Global Cloud Sync, Analytics & URL hash routing
  useEffect(() => {
    initSoundPreference();

    // Theme initialization
    const storedTheme = localStorage.getItem('tradevortex_theme') as 'dark' | 'light' | null;
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.add('dark');
    }

    // Initialize full-site Google Translate element
    const savedLang =
      localStorage.getItem(GOOGLE_LANG_STORAGE_KEY) ||
      localStorage.getItem('tradevortex_lang') ||
      'en';
    setActiveLangCode(savedLang);
    document.documentElement.dir = isRtlLanguageCode(savedLang) ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
    initGoogleTranslateElement(savedLang);

    // URL hash route check
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      const hash = rawHash.toLowerCase();
      if (hash.startsWith('custom:')) {
        setCurrentPage(rawHash as PageView);
      } else if (hash === 'quotex' || window.location.pathname.includes('quotex')) {
        setCurrentPage('quotex');
      } else if (hash === 'calculators') {
        setCurrentPage('calculators');
      } else if (hash === 'markets') {
        setCurrentPage('markets');
      } else if (hash === 'brokers') {
        setCurrentPage('brokers');
      } else if (hash === 'academy') {
        setCurrentPage('academy');
      } else if (hash === 'signals') {
        setCurrentPage('signals');
      } else if (hash === 'quiz') {
        setCurrentPage('quiz');
      } else if (hash === 'journal') {
        setCurrentPage('journal');
      } else if (hash === 'about') {
        setCurrentPage('about');
      } else if (hash === 'contact') {
        setCurrentPage('contact');
      } else if (hash === 'faq') {
        setCurrentPage('faq');
      } else if (hash === 'privacy') {
        setCurrentPage('privacy');
      } else if (hash === 'terms') {
        setCurrentPage('terms');
      } else if (hash === 'risk-disclaimer') {
        setCurrentPage('risk-disclaimer');
      } else if (hash === 'affiliate-disclosure') {
        setCurrentPage('affiliate-disclosure');
      } else if (hash === 'home' || hash === '') {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    // Real-time local Admin / Brokers / Articles sync listeners
    const handleAdminSettingsSync = (e: Event) => {
      const customEvent = e as CustomEvent<AdminSettings>;
      if (customEvent.detail) {
        setAdminSettings(customEvent.detail);
      } else {
        setAdminSettings(getAdminSettings());
      }
      setBrokers(getStoredBrokers());
    };

    const handleBrokersSync = () => setBrokers(getStoredBrokers());
    const handleArticlesSync = () => setArticles(getStoredArticles());

    window.addEventListener(ADMIN_EVENT_KEY, handleAdminSettingsSync);
    window.addEventListener(BROKERS_EVENT_KEY, handleBrokersSync);
    window.addEventListener(ARTICLES_EVENT_KEY, handleArticlesSync);

    // Real-Time Global Cloud Sync (Firestore onSnapshot + BroadcastChannel)
    const unsubCloudSync = subscribeGlobalSiteConfig((payload) => {
      if (payload.settings) setAdminSettings(payload.settings);
      if (payload.brokers && payload.brokers.length > 0) setBrokers(payload.brokers);
      if (payload.articles && payload.articles.length > 0) setArticles(payload.articles);
    });

    // Real-time Visitor Telemetry (Session start + active presence heartbeat)
    trackAnalyticsEvent('session_start', currentPageRef.current, 'Portal Session Started');
    updateVisitorPresence(currentPageRef.current, true);

    const heartbeatTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        updateVisitorPresence(currentPageRef.current, true);
      }
    }, 20000);

    const handleVisibility = () => {
      updateVisitorPresence(currentPageRef.current, document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener(ADMIN_EVENT_KEY, handleAdminSettingsSync);
      window.removeEventListener(BROKERS_EVENT_KEY, handleBrokersSync);
      window.removeEventListener(ARTICLES_EVENT_KEY, handleArticlesSync);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.clearInterval(heartbeatTimer);
      unsubCloudSync();
    };
  }, []);

  // Synchronize dynamic accent theme customizer
  useEffect(() => {
    const accent = adminSettings.themeCustomizer?.accentColor || 'cyan';
    document.documentElement.setAttribute('data-accent', accent);
  }, [adminSettings.themeCustomizer?.accentColor]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('tradevortex_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLanguageChange = (langCode: string) => {
    setActiveLangCode(langCode);
    const core = resolveCoreLanguage(langCode);
    localStorage.setItem('tradevortex_lang', core);
    applyGoogleTranslation(langCode);
    trackAnalyticsEvent('page_view', currentPage, `Language Changed: ${langCode}`);
  };

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page !== 'academy') {
      setSelectedArticle(null);
    }
    trackAnalyticsEvent('page_view', page, `Viewed /${page}`);
    updateVisitorPresence(page, true);
    retriggerActiveGoogleTranslation();
  };

  const handleOpenArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentPage('academy');
    window.location.hash = `academy-${article.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackAnalyticsEvent('page_view', 'academy', `Article: ${article.title}`);
    updateVisitorPresence('academy', true);
    retriggerActiveGoogleTranslation();
  };

  const handleAddBroker = (newBroker: Broker) => {
    const updated = [newBroker, ...brokers];
    setBrokers(updated);
    saveBrokers(updated);
  };

  const handleResetBrokers = () => {
    const defaults = resetBrokersToDefault();
    setBrokers(defaults);
  };

  const language = resolveCoreLanguage(activeLangCode);
  const isRtl = isRtlLanguageCode(activeLangCode);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const customPageMatch =
    typeof currentPage === 'string' && currentPage.startsWith('custom:')
      ? (adminSettings.customPages || []).find(
          (pg) => pg.active && `custom:${pg.slug}` === currentPage
        )
      : undefined;

  return (
    <ErrorBoundary>
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`min-h-screen flex flex-col transition-colors duration-200 ${
          theme === 'dark' ? 'bg-[#080d1a] text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        {/* Offscreen Google Translate Mount Point (must not use display:none so element.js initializes .goog-te-combo) */}
        <div
          id="google_translate_element"
          className="fixed -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0 pointer-events-none"
          aria-hidden="true"
        />

        {/* Primary Global Navigation */}
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          language={language}
          activeLangCode={activeLangCode}
          onLanguageChange={handleLanguageChange}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        />

        {/* Main Content Router */}
        <main className="flex-1">
          <Suspense
            fallback={
              <div className="mx-auto max-w-7xl px-4 py-16 text-center text-xs font-mono text-slate-400">
                Loading TradeVortex Module...
              </div>
            }
          >
          {customPageMatch && (
            <CustomPageView pageData={customPageMatch} onNavigate={handleNavigate} />
          )}

          {!customPageMatch && currentPage === 'home' && (
            <HomeView
              onNavigate={handleNavigate}
              onOpenArticle={handleOpenArticle}
              onOpenBroker={(b) => setSelectedBrokerModal(b)}
              brokers={brokers}
              articles={articles}
              theme={theme}
              language={language}
            />
          )}

          {!customPageMatch && currentPage.startsWith('custom:') && (
            <HomeView
              onNavigate={handleNavigate}
              onOpenArticle={handleOpenArticle}
              onOpenBroker={(b) => setSelectedBrokerModal(b)}
              brokers={brokers}
              articles={articles}
              theme={theme}
              language={language}
            />
          )}

          {currentPage === 'calculators' && <CalculatorsView language={language} />}

          {currentPage === 'markets' && <MarketsView theme={theme} language={language} />}

          {currentPage === 'brokers' && (
            <BrokersView
              brokers={brokers}
              onOpenBroker={(b) => setSelectedBrokerModal(b)}
              onOpenOwnerPanel={() => setIsOwnerModalOpen(true)}
              language={language}
            />
          )}

          {currentPage === 'academy' && (
            <AcademyView
              articles={articles}
              selectedArticle={selectedArticle}
              onSelectArticle={setSelectedArticle}
              onNavigate={handleNavigate}
              language={language}
            />
          )}

          {/* Dedicated Standalone Daily Market Signals View with all 5 AdSense slots */}
          {currentPage === 'signals' && <SignalsView onNavigate={handleNavigate} />}

          {/* Dedicated Risk Management Quiz & Certificate View */}
          {currentPage === 'quiz' && (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono text-cyan-300">
                  <Award className="h-3.5 w-3.5 text-cyan-400" />
                  <span>TRADER COMPETENCY BENCHMARK</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {t.quizTitle}
                </h1>
                <p className="text-sm text-slate-300">{t.quizSubtitle}</p>
              </div>

              <TradingQuiz language={language} onNavigate={handleNavigate} />
            </div>
          )}

          {/* Dedicated Downloadable Risk Journal View */}
          {currentPage === 'journal' && (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono text-cyan-300">
                  <FileSpreadsheet className="h-3.5 w-3.5 text-cyan-400" />
                  <span>LEAD MAGNET & TRADING DISCIPLINE TOOL</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Risk Management <span className="text-cyan-400">Trading Journal</span>
                </h1>
                <p className="text-sm text-slate-300">
                  Download our institutional Excel / CSV trade execution log engineered with automated risk:reward and emotional drawdown tracking fields.
                </p>
              </div>

              <TradingJournalDownload />
            </div>
          )}

          {/* Quotex Dedicated Page (STRICTLY AD-FREE) */}
          {currentPage === 'quotex' && <QuotexView />}

          {/* Mandatory Information & Policy Pages */}
          {currentPage === 'about' && <AboutView onNavigate={handleNavigate} />}
          {currentPage === 'contact' && <ContactView />}
          {currentPage === 'faq' && <FAQView />}
          {currentPage === 'privacy' && <PrivacyView />}
          {currentPage === 'terms' && <TermsView />}
          {currentPage === 'risk-disclaimer' && <RiskDisclaimerView />}
          {currentPage === 'affiliate-disclosure' && <AffiliateDisclosureView />}
          </Suspense>
        </main>

        {/* Global Floating Community Widget (Synchronized with Admin Settings) */}
        <FloatingTelegramWidget telegramUrl={adminSettings.telegramCommunityUrl} />

        {/* Global Footer with Cookie Settings & Admin Portal */}
        <Footer
          onNavigate={handleNavigate}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          onOpenCookieSettings={() => setCookieSettingsOpen(true)}
          language={language}
        />

        {/* Modals & Governance Panels */}
        <BrokerDetailModal
          broker={selectedBrokerModal}
          onClose={() => setSelectedBrokerModal(null)}
        />

        <OwnerBrokerModal
          isOpen={isOwnerModalOpen}
          onClose={() => setIsOwnerModalOpen(false)}
          onAddBroker={handleAddBroker}
          onResetBrokers={handleResetBrokers}
        />

        {/* World-Wide Multi-Language Modal (108+ Languages via Google Translate) */}
        <LanguageModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
          currentLanguageCode={activeLangCode}
          onSelectLanguage={handleLanguageChange}
        />

        {/* Secret Hardcoded Admin Panel Modal (bilaleditor / bilaleditor000@) */}
        {isAdminModalOpen && (
          <Suspense fallback={null}>
            <AdminPanelModal
              isOpen={isAdminModalOpen}
              onClose={() => setIsAdminModalOpen(false)}
              brokers={brokers}
              onSettingsUpdated={(newSettings) => {
                setAdminSettings(newSettings);
                setBrokers(getStoredBrokers());
                setArticles(getStoredArticles());
              }}
            />
          </Suspense>
        )}

        {/* Google AdSense & GDPR Compliant Cookie Consent Banner */}
        <CookieConsentBanner
          forceOpenSettings={cookieSettingsOpen}
          onCloseSettings={() => setCookieSettingsOpen(false)}
        />

        {/* Policy-Compliant Mobile-Sticky Anchor Ad (320x50 with Dismiss Control) */}
        <MobileAnchorAd />
      </div>
    </ErrorBoundary>
  );
}

