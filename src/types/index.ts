export type CorePageView =
  | 'home'
  | 'calculators'
  | 'markets'
  | 'brokers'
  | 'academy'
  | 'quotex'
  | 'signals'
  | 'quiz'
  | 'journal'
  | 'about'
  | 'contact'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'risk-disclaimer'
  | 'affiliate-disclosure';

export type PageView = CorePageView | `custom:${string}`;

export interface Broker {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  minDeposit: string;
  maxLeverage: string;
  spreadFrom: string;
  regulation: string[];
  platforms: string[];
  category: 'Forex' | 'Multi-Asset' | 'Crypto' | 'Digital Options';
  affiliateUrl: string;
  pros: string[];
  cons: string[];
  badge?: string;
  description: string;
  payoutRate?: string;
  depositMethods: string[];
  specialOffer?: string;
  hasDemoButton?: boolean;
  executionSpeed?: string;
  rawSpreadEcn?: boolean;
  swapFree?: boolean;
  instantWithdrawal?: boolean;
  filterTags?: ('raw-ecn' | 'swap-free' | 'instant-withdrawal')[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Beginner' | 'Risk Management' | 'Technical Analysis' | 'Commodities & Indices' | 'Psychology';
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  summary: string;
  content: string;
  keyTakeaways: string[];
  faqs: { question: string; answer: string }[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FAQItem {
  id: string;
  category:
    | 'Trading Basics'
    | 'Risk & Psychology'
    | 'Calculators'
    | 'Brokers'
    | 'Trading Mechanics'
    | 'Account & Security';
  question: string;
  answer: string;
}

export interface CommunityProof {
  id: string;
  reviewerName: string;
  countryOrHandle?: string;
  rating: number;
  caption: string;
  profitHighlight?: string;
  proofImages: string[];
  videoUrl?: string;
  dateLabel: string;
  verifiedBadge?: boolean;
  source?: string;
}

export type CalculatorTab =
  | 'futures-pnl'
  | 'local-currency'
  | 'lot-size'
  | 'pip-value'
  | 'liquidation'
  | 'compound-drawdown'
  | 'gold-indices'
  | 'margin-leverage'
  | 'sl-tp'
  | 'breakeven'
  | 'dca';

export interface SponsorDeal {
  id: string;
  companyName: string;
  dealPrice: string;
  startDate: string;
  expiryDate: string;
  bannerImageUrl?: string;
  bannerScript?: string;
  targetUrl: string;
  placement?: 'header' | 'sidebar' | 'interstitial' | 'article' | 'all';
  active: boolean;
  notes?: string;
}

export interface PageAdSlots {
  homeHeader: string;
  homeInFeed: string;
  calcTop: string;
  calcSidebar: string;
  calcInterstitial: string;
  brokersHeader: string;
  signalsInContent: string;
  academyArticle: string;
  mobileAnchor: string;
}

export interface ThemeCustomizerSettings {
  accentColor: 'cyan' | 'emerald' | 'amber' | 'blue' | 'purple';
  cardGlow: boolean;
  contrastBooster: boolean;
}

export interface CustomContentBlock {
  id: string;
  page: PageView | 'all';
  title: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  active: boolean;
}

export interface CustomNavButton {
  id: string;
  label: string;
  targetType: 'page' | 'url';
  targetValue: string;
  badge?: string;
  active: boolean;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  categoryBadge: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  active: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  mediaType: 'image' | 'video' | 'audio';
  url: string;
  sizeBytes: number;
  placement: PageView | 'all' | 'none';
  caption?: string;
  createdAt: string;
}

export interface VipPartnerBannerConfig {
  enabled: boolean;
  badge: string;
  title: string;
  subtitle: string;
  benefits: string[];
  ctaLabel: string;
}

export interface AdminSettings {
  telegramCommunityUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  supportEmail: string;
  promoBanner: {
    enabled: boolean;
    badge: string;
    title: string;
    actionText: string;
    actionUrl: string;
    customOfferCode: string;
  };
  adSensePublisherId: string;
  adSenseScript: string;
  customAdScript: string;
  mobileAnchorAdEnabled: boolean;
  pageAdSlots: PageAdSlots;
  themeCustomizer: ThemeCustomizerSettings;
  sponsorDeals: SponsorDeal[];
  brokerLinks: Record<string, string>;
  // Full CMS dynamic overrides: edit/delete any site text, heading, button, or section
  cmsOverrides: Record<string, string>;
  hiddenSections: string[];
  customBlocks: CustomContentBlock[];
  disabledCalculators: CalculatorTab[];
  // Site Builder & Multi-Media extensions
  siteLogoUrl?: string;
  brandTagline?: string;
  customNavButtons?: CustomNavButton[];
  customPages?: CustomPage[];
  mediaLibrary?: MediaItem[];
  homeFaqs?: FAQItem[];
  communityProofs?: CommunityProof[];
  showCommunityProofs?: boolean;
  vipPartnerBanner?: VipPartnerBannerConfig;
  cloudSyncMeta?: {
    lastPublishedAt?: string;
    lastPublishedBy?: string;
  };
}

export type Language =
  | 'en'
  | 'ur'
  | 'ar'
  | 'fa'
  | 'ps'
  | 'hi'
  | 'es'
  | 'fr'
  | 'de'
  | 'tr'
  | 'zh'
  | 'ru'
  | 'pt'
  | 'ms'
  | 'id'
  | 'ja'
  | 'ko'
  | 'it'
  | 'vi'
  | 'bn'
  | 'th'
  | 'pl'
  | 'nl'
  | 'tl';

export interface WorldLanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  direction?: 'ltr' | 'rtl';
  isPopular?: boolean;
}

export interface GoogleLanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  direction: 'ltr' | 'rtl';
  isPopular?: boolean;
  coreCode?: Language;
}

export interface CookieConsentPreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
  timestamp: string;
  version: string;
}

export type AnalyticsEventType =
  | 'page_view'
  | 'referral_click'
  | 'telegram_click'
  | 'calculator_used'
  | 'session_start'
  | 'cookie_consent';

export interface AnalyticsEventRecord {
  eventId: string;
  type: AnalyticsEventType;
  page: string;
  label: string;
  country: string;
  countryCode: string;
  flag: string;
  device: 'Mobile' | 'Tablet' | 'PC';
  durationSec: number;
  createdAtMs: number;
}
