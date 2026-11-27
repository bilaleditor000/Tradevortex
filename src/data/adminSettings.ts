import { AdminSettings, SponsorDeal, PageAdSlots, ThemeCustomizerSettings } from '../types';

export const DEFAULT_SPONSORS: SponsorDeal[] = [
  {
    id: 'sponsor-exness-vip',
    companyName: 'Exness Global Markets',
    dealPrice: '$2,500/month',
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    bannerImageUrl: '',
    targetUrl: 'https://one.exness-track.com/a/custom_tradevortex',
    placement: 'all',
    active: true,
    notes: 'Primary liquidity partner: raw spreads from 0.0 pips, $10 minimum deposit.'
  },
  {
    id: 'sponsor-quotex-pro',
    companyName: 'Quotex Digital Trading',
    dealPrice: '$1,800/month',
    startDate: '2026-02-01',
    expiryDate: '2026-12-31',
    bannerImageUrl: '',
    targetUrl: 'https://broker-qx.pro/sign-up/?lid=tradevortex',
    placement: 'sidebar',
    active: true,
    notes: 'Up to 98% digital contract returns with $10 instant start.'
  },
  {
    id: 'sponsor-ic-markets',
    companyName: 'IC Markets True ECN',
    dealPrice: '$1,500/month',
    startDate: '2026-03-01',
    expiryDate: '2026-12-31',
    bannerImageUrl: '',
    targetUrl: 'https://icmarkets.com/?camp=tradevortex',
    placement: 'article',
    active: true,
    notes: 'Institutional depth and ultra-fast MT4/MT5/cTrader execution.'
  }
];

export const DEFAULT_PAGE_AD_SLOTS: PageAdSlots = {
  homeHeader: 'tv_home_header_728x90',
  homeInFeed: 'tv_home_infeed_responsive',
  calcTop: 'tv_calc_top_728x90',
  calcSidebar: 'tv_calc_sidebar_300x250',
  calcInterstitial: 'tv_calc_interstitial_highrpm',
  brokersHeader: 'tv_brokers_header_728x90',
  signalsInContent: 'tv_signals_infeed_slot',
  academyArticle: 'tv_academy_sidebar_300x250',
  mobileAnchor: 'tv_mobile_sticky_anchor_320x50'
};

export const DEFAULT_THEME_CUSTOMIZER: ThemeCustomizerSettings = {
  accentColor: 'cyan',
  cardGlow: true,
  contrastBooster: true
};

export const DEFAULT_VIP_PARTNER_BANNER = {
  enabled: true,
  badge: 'INSTITUTIONAL DESK ACCESS',
  title: 'VIP Partner Benefits & Priority Liquidity Desk',
  subtitle:
    'Access Tier-1 ECN execution, institutional spread audits, and priority partner support when comparing verified brokers on TradeVortex.',
  benefits: [
    '0.0 Pip Raw ECN Accounts & Verified Tier-1 Licenses',
    'Priority Partner Support & Fee Rebate Eligibility',
    'Full 11-Tool Risk Calculator & Daily Session Intelligence'
  ],
  ctaLabel: 'Join VIP Desk'
};

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  telegramCommunityUrl: 'https://t.me/tradevortex_vip',
  instagramUrl: 'https://instagram.com/tradevortex_official',
  facebookUrl: 'https://facebook.com/tradevortex.portal',
  supportEmail: 'support@tradevortex.com',
  promoBanner: {
    enabled: false,
    badge: 'INSTITUTIONAL ACCESS',
    title: 'Trade on Tier-1 Regulated ECN Brokers With 0.0 Raw Spreads & Sub-25ms Execution!',
    actionText: 'Compare Brokers',
    actionUrl: 'https://one.exness-track.com/a/custom_tradevortex',
    customOfferCode: 'VORTEX100'
  },
  adSensePublisherId: 'ca-pub-9482910482910482',
  adSenseScript: '',
  customAdScript: '',
  mobileAnchorAdEnabled: true,
  pageAdSlots: DEFAULT_PAGE_AD_SLOTS,
  themeCustomizer: DEFAULT_THEME_CUSTOMIZER,
  sponsorDeals: DEFAULT_SPONSORS,
  brokerLinks: {
    exness: 'https://one.exness-track.com/a/custom_tradevortex',
    quotex: 'https://broker-qx.pro/sign-up/?lid=tradevortex',
    xm: 'https://clicks.pipaffiliates.com/c?c=tradevortex',
    'pocket-option': 'https://pocketoption.com/smart/tradevortex',
    deriv: 'https://track.deriv.com/_tradevortex',
    'ic-markets': 'https://icmarkets.com/?camp=tradevortex',
    octafx: 'https://octafx.com/?refid=tradevortex',
    fbs: 'https://fbs.com/?ppk=tradevortex',
    vantage: 'https://vantagefx.com/?affid=tradevortex',
    'fp-markets': 'https://fpmarkets.com/?fpa=tradevortex'
  },
  cmsOverrides: {},
  hiddenSections: [],
  customBlocks: [],
  disabledCalculators: [],
  siteLogoUrl: '',
  brandTagline: 'Institutional Trading Terminal',
  customNavButtons: [],
  customPages: [],
  mediaLibrary: [],
  showCommunityProofs: false,
  vipPartnerBanner: DEFAULT_VIP_PARTNER_BANNER,
  cloudSyncMeta: {}
};

const STORAGE_KEY = 'tradevortex_admin_settings_v5';
export const ADMIN_EVENT_KEY = 'tradevortex_settings_changed';

/**
 * Safely injects dynamic Google AdSense tags/meta/scripts into the DOM
 */
export const injectDynamicAdSense = (scriptCode: string): void => {
  if (typeof document === 'undefined') return;

  const CONTAINER_ID = 'tradevortex-dynamic-adsense-container';
  let container = document.getElementById(CONTAINER_ID);

  if (!container) {
    container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.style.display = 'none';
    document.head.appendChild(container);
  }

  container.innerHTML = '';

  if (!scriptCode || !scriptCode.trim()) return;

  try {
    const temp = document.createElement('div');
    temp.innerHTML = scriptCode.trim();

    Array.from(temp.childNodes).forEach((node) => {
      if (node.nodeName.toLowerCase() === 'script') {
        const scriptElement = document.createElement('script');
        const originalScript = node as HTMLScriptElement;

        Array.from(originalScript.attributes).forEach((attr) => {
          scriptElement.setAttribute(attr.name, attr.value);
        });

        if (originalScript.innerHTML) {
          scriptElement.innerHTML = originalScript.innerHTML;
        }

        container?.appendChild(scriptElement);
      } else if (node.nodeName.toLowerCase() === 'meta' || node.nodeName.toLowerCase() === 'link') {
        container?.appendChild(node.cloneNode(true));
      }
    });
  } catch (err) {
    console.warn('AdSense dynamic injection notice:', err);
  }
};

export const getAdminSettings = (): AdminSettings => {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('tradevortex_admin_settings_v4');
    if (!raw) {
      return DEFAULT_ADMIN_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    const resolved: AdminSettings = {
      ...DEFAULT_ADMIN_SETTINGS,
      ...parsed,
      promoBanner: {
        ...DEFAULT_ADMIN_SETTINGS.promoBanner,
        ...(parsed.promoBanner || {})
      },
      pageAdSlots: {
        ...DEFAULT_PAGE_AD_SLOTS,
        ...(parsed.pageAdSlots || {})
      },
      themeCustomizer: {
        ...DEFAULT_THEME_CUSTOMIZER,
        ...(parsed.themeCustomizer || {})
      },
      brokerLinks: {
        ...DEFAULT_ADMIN_SETTINGS.brokerLinks,
        ...(parsed.brokerLinks || {})
      },
      sponsorDeals:
        Array.isArray(parsed.sponsorDeals) && parsed.sponsorDeals.length > 0
          ? parsed.sponsorDeals
          : DEFAULT_SPONSORS,
      cmsOverrides: parsed.cmsOverrides || {},
      hiddenSections: Array.isArray(parsed.hiddenSections) ? parsed.hiddenSections : [],
      customBlocks: Array.isArray(parsed.customBlocks) ? parsed.customBlocks : [],
      disabledCalculators: Array.isArray(parsed.disabledCalculators) ? parsed.disabledCalculators : [],
      customNavButtons: Array.isArray(parsed.customNavButtons) ? parsed.customNavButtons : [],
      customPages: Array.isArray(parsed.customPages) ? parsed.customPages : [],
      mediaLibrary: Array.isArray(parsed.mediaLibrary) ? parsed.mediaLibrary : [],
      homeFaqs: Array.isArray(parsed.homeFaqs) ? parsed.homeFaqs : undefined,
      communityProofs: Array.isArray(parsed.communityProofs) ? parsed.communityProofs : undefined,
      showCommunityProofs: Boolean(parsed.showCommunityProofs),
      vipPartnerBanner: {
        ...DEFAULT_VIP_PARTNER_BANNER,
        ...(parsed.vipPartnerBanner || {}),
        benefits:
          Array.isArray(parsed.vipPartnerBanner?.benefits) && parsed.vipPartnerBanner.benefits.length > 0
            ? parsed.vipPartnerBanner.benefits
            : DEFAULT_VIP_PARTNER_BANNER.benefits
      },
      siteLogoUrl: typeof parsed.siteLogoUrl === 'string' ? parsed.siteLogoUrl : '',
      brandTagline: typeof parsed.brandTagline === 'string' ? parsed.brandTagline : 'Institutional Trading Terminal',
      cloudSyncMeta: parsed.cloudSyncMeta || {}
    };

    if (resolved.adSenseScript) {
      injectDynamicAdSense(resolved.adSenseScript);
    }

    return resolved;
  } catch (err) {
    console.error('Failed to parse admin settings', err);
    return DEFAULT_ADMIN_SETTINGS;
  }
};

export const saveAdminSettings = (settings: AdminSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    injectDynamicAdSense(settings.adSenseScript);
    window.dispatchEvent(new CustomEvent(ADMIN_EVENT_KEY, { detail: settings }));
  } catch (err) {
    console.error('Failed to save admin settings', err);
  }
};

export const resetAdminSettings = (): AdminSettings => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('tradevortex_admin_settings_v4');
    injectDynamicAdSense('');
    window.dispatchEvent(new CustomEvent(ADMIN_EVENT_KEY, { detail: DEFAULT_ADMIN_SETTINGS }));
  }
  return DEFAULT_ADMIN_SETTINGS;
};

export const getCmsValue = (
  settings: AdminSettings | undefined,
  key: string,
  fallback: string
): string => {
  if (!settings || !settings.cmsOverrides) return fallback;
  if (Object.prototype.hasOwnProperty.call(settings.cmsOverrides, key)) {
    return settings.cmsOverrides[key];
  }
  return fallback;
};

export const isSectionVisible = (
  settings: AdminSettings | undefined,
  sectionId: string
): boolean => {
  if (!settings || !Array.isArray(settings.hiddenSections)) return true;
  return !settings.hiddenSections.includes(sectionId);
};
