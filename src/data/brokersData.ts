import { Broker } from '../types';
import { getAdminSettings } from './adminSettings';

export const BROKERS_EVENT_KEY = 'tradevortex_brokers_changed';

export const INITIAL_BROKERS: Broker[] = [
  {
    id: 'exness',
    name: 'Exness',
    logo: '',
    rating: 4.9,
    reviewCount: 3840,
    minDeposit: '$10',
    maxLeverage: '1:2000 (Unlimited)',
    spreadFrom: '0.0 pips',
    regulation: ['FCA (UK)', 'CySEC', 'FSA', 'FSCA'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'Exness Terminal', 'Mobile App'],
    category: 'Forex',
    affiliateUrl: 'https://one.exness-track.com/a/custom_tradevortex',
    pros: [
      'Raw spreads starting from 0.0 pips on Pro/Zero accounts',
      'Instant automated withdrawals 24/7 with zero commission',
      'Ultra-high leverage up to 1:2000 or Unlimited on standard tiers',
      'Zero overnight swap charges on major pairs and crypto'
    ],
    cons: [
      'Not available to retail traders residing in the USA',
      'Does not offer US stock trading via physical shares'
    ],
    badge: 'Tier-1 ECN Flagship',
    executionSpeed: '< 20ms',
    rawSpreadEcn: true,
    swapFree: true,
    instantWithdrawal: true,
    filterTags: ['raw-ecn', 'swap-free', 'instant-withdrawal'],
    description: 'Exness is a world-renowned multi-asset broker trusted by millions of volume traders worldwide for raw spreads, lightning fast automated withdrawals, and zero swap fees.',
    depositMethods: ['Tether (USDT)', 'Bank Card (Visa/Mastercard)', 'Binance Pay', 'Skrill', 'Neteller', 'Local Bank Wire'],
    specialOffer: 'Instant 24/7 Crypto & Fiat Withdrawals'
  },
  {
    id: 'quotex',
    name: 'Quotex',
    logo: '',
    rating: 4.8,
    reviewCount: 4120,
    minDeposit: '$10',
    maxLeverage: 'N/A (Fixed Yield)',
    spreadFrom: '0 pips (Fixed Payout)',
    payoutRate: 'Up to 98%',
    regulation: ['IFMRRC Verified', 'International Broker License'],
    platforms: ['Quotex Web Platform', 'Quotex Android App'],
    category: 'Digital Options',
    affiliateUrl: 'https://broker-qx.pro/sign-up/?lid=tradevortex',
    pros: [
      'Instant $10,000 renewable free demo account (no registration required)',
      'Lowest barrier to entry with just $10 minimum deposit and $1 min trade',
      'Up to 98% profit yield on winning digital contract positions',
      'Fast crypto and e-wallet deposits and withdrawals'
    ],
    cons: [
      'Digital contracts carry high all-or-nothing volatility risk',
      'MetaTrader 4 / 5 terminal integration is not supported'
    ],
    badge: 'High-Yield Digital Desk',
    executionSpeed: '< 35ms',
    rawSpreadEcn: false,
    swapFree: true,
    instantWithdrawal: true,
    filterTags: ['swap-free', 'instant-withdrawal'],
    description: 'Quotex is an innovative, sleek high-speed digital trading platform tailored for quick contract executions, offering high payout percentages and zero deposit fees.',
    depositMethods: ['Crypto (USDT, BTC, ETH)', 'Credit/Debit Card', 'Perfect Money', 'Volet', 'Binance Pay'],
    specialOffer: 'Up to 98% Payout + $10,000 Demo'
  },
  {
    id: 'xm',
    name: 'XM Group',
    logo: '',
    rating: 4.8,
    reviewCount: 4950,
    minDeposit: '$5',
    maxLeverage: '1:1000',
    spreadFrom: '0.6 pips',
    regulation: ['FCA', 'ASIC', 'CySEC', 'DFSA'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'XM App'],
    category: 'Multi-Asset',
    affiliateUrl: 'https://clicks.pipaffiliates.com/c?c=tradevortex',
    pros: [
      'Ultra-accessible $5 minimum deposit and free VPS for active accounts',
      'Extensive daily market analysis, webinars, and live trading rooms',
      'Negative balance protection guaranteed on all retail accounts',
      'Over 1,000 tradeable instruments including shares, indices, and metals'
    ],
    cons: [
      'Standard account spreads are wider than pure ECN commission accounts',
      'No proprietary cTrader platform integration'
    ],
    badge: 'Multi-Regulated Global',
    executionSpeed: '< 30ms',
    rawSpreadEcn: false,
    swapFree: true,
    instantWithdrawal: false,
    filterTags: ['swap-free'],
    description: 'XM Group is an award-winning regulated global broker famous for its exceptional educational content, daily technical research, and micro lot options for active traders.',
    depositMethods: ['Bank Wire', 'Credit Card', 'Crypto', 'Sticpay', 'Skrill', 'Neteller'],
    specialOffer: 'Free Institutional VPS + Daily Research'
  },
  {
    id: 'pocket-option',
    name: 'Pocket Option',
    logo: '',
    rating: 4.7,
    reviewCount: 3620,
    minDeposit: '$10',
    maxLeverage: '1:1000',
    spreadFrom: '0.0 pips',
    payoutRate: 'Up to 96%',
    regulation: ['Mwali International Services Authority (MISA)'],
    platforms: ['Web Platform', 'Mobile App', 'Telegram Bot Trader'],
    category: 'Digital Options',
    affiliateUrl: 'https://pocketoption.com/smart/tradevortex',
    pros: [
      '50% deposit bonus on first qualifying deposit ($50+)',
      '100+ global assets including OTC weekend trading',
      'Built-in social trading and automated copy-trading module',
      'Low $10 minimum deposit with instant crypto funding'
    ],
    cons: [
      'Bonus terms require trading volume before withdrawal',
      'Regulated offshore'
    ],
    badge: 'Social Copy Platform',
    executionSpeed: '< 40ms',
    rawSpreadEcn: false,
    swapFree: true,
    instantWithdrawal: true,
    filterTags: ['swap-free', 'instant-withdrawal'],
    description: 'Pocket Option provides seamless social copy-trading, 24/7 OTC markets on weekends, high digital option yields, and instant crypto funding.',
    depositMethods: ['Tether USDT', 'Bitcoin', 'Ethereum', 'Credit Card', 'WebMoney', 'Advcash'],
    specialOffer: '50% Welcome Bonus on 1st Deposit'
  },
  {
    id: 'deriv',
    name: 'Deriv',
    logo: '',
    rating: 4.8,
    reviewCount: 3400,
    minDeposit: '$5',
    maxLeverage: '1:1000',
    spreadFrom: '0.5 pips',
    regulation: ['MFSA (Malta)', 'LFSA', 'VFSC', 'BVI FSC'],
    platforms: ['Deriv MT5', 'Deriv Bot', 'Deriv Trader', 'Deriv X'],
    category: 'Multi-Asset',
    affiliateUrl: 'https://track.deriv.com/_tradevortex',
    pros: [
      'Exclusive 24/7 synthetic indices (Volatility 75, Crash & Boom, Step Index)',
      'Automated visual bot builder requiring zero coding knowledge',
      'Micro contracts and multiplier trades with capped downside risk',
      'Lowest $5 minimum entry threshold'
    ],
    cons: [
      'Synthetic indices are mathematically simulated (proprietary algorithmic RNG)',
      'Spreads can widen during periods of low market liquidity'
    ],
    badge: '24/7 Synthetic Markets',
    executionSpeed: '< 25ms',
    rawSpreadEcn: false,
    swapFree: true,
    instantWithdrawal: true,
    filterTags: ['swap-free', 'instant-withdrawal'],
    description: 'Deriv pioneered 24/7 synthetic volatility indices, automated trading bots, and flexible CFD multipliers that can be traded even on weekends and bank holidays.',
    depositMethods: ['Cryptocurrency', 'Credit Card', 'Deriv P2P', 'Skrill', 'AstroPay'],
    specialOffer: 'Trade 24/7 Even on Weekends'
  },
  {
    id: 'ic-markets',
    name: 'IC Markets',
    logo: '',
    rating: 4.9,
    reviewCount: 5210,
    minDeposit: '$20',
    maxLeverage: '1:500',
    spreadFrom: '0.0 pips',
    regulation: ['ASIC (Australia)', 'CySEC', 'SCB'],
    platforms: ['cTrader', 'MetaTrader 4', 'MetaTrader 5', 'TradingView'],
    category: 'Forex',
    affiliateUrl: 'https://icmarkets.com/?camp=tradevortex',
    pros: [
      'True ECN environment with direct Tier-1 bank liquidity',
      'Direct TradingView chart integration for seamless execution',
      'Average EUR/USD spread of 0.02 pips during London/NY sessions',
      'Full algorithmic and scalping allowance with zero restrictions'
    ],
    cons: [
      'Standard raw account has $200 recommendation, micro options start at $20',
      'Support queues during high-impact news'
    ],
    badge: 'True Raw 0.0 ECN',
    executionSpeed: '< 15ms (NY4)',
    rawSpreadEcn: true,
    swapFree: true,
    instantWithdrawal: false,
    filterTags: ['raw-ecn', 'swap-free'],
    description: 'IC Markets is the premiere choice for algorithmic, scalping, and EA traders seeking genuine institutional liquidity and raw zero-spread trading conditions.',
    depositMethods: ['PayPal', 'Credit Card', 'Wire Transfer', 'Skrill', 'Neteller', 'Crypto'],
    specialOffer: 'True Institutional ECN Execution'
  },
  {
    id: 'octafx',
    name: 'OctaFX',
    logo: '',
    rating: 4.7,
    reviewCount: 2880,
    minDeposit: '$25',
    maxLeverage: '1:500',
    spreadFrom: '0.6 pips',
    regulation: ['CySEC', 'FSCA', 'Mwali'],
    platforms: ['OctaTrader', 'MetaTrader 4', 'MetaTrader 5'],
    category: 'Forex',
    affiliateUrl: 'https://octafx.com/?refid=tradevortex',
    pros: [
      'Zero commission on deposits and withdrawals',
      'Micro-lot trading starting from 0.01 with 1:500 leverage',
      'Copy trading app with verified master trader rankings',
      'Negative balance protection guaranteed'
    ],
    cons: [
      'Limited equity share CFD instruments',
      'Not available in the US or UK'
    ],
    badge: 'Zero Commission Tier',
    executionSpeed: '< 30ms',
    rawSpreadEcn: false,
    swapFree: true,
    instantWithdrawal: true,
    filterTags: ['swap-free', 'instant-withdrawal'],
    description: 'OctaFX is favored for transparent fee-free deposits, intuitive mobile copy-trading, and competitive floating spreads tailored for swing and intraday traders.',
    depositMethods: ['Crypto (USDT/BTC)', 'Mastercard/Visa', 'Local Bank Wire', 'Neteller'],
    specialOffer: '50% Bonus on Every Qualifying Deposit'
  },
  {
    id: 'fbs',
    name: 'FBS',
    logo: '',
    rating: 4.6,
    reviewCount: 3120,
    minDeposit: '$10',
    maxLeverage: '1:3000',
    spreadFrom: '0.7 pips',
    regulation: ['CySEC', 'ASIC', 'FSCA', 'IFSC'],
    platforms: ['FBS Trader', 'MetaTrader 4', 'MetaTrader 5'],
    category: 'Multi-Asset',
    affiliateUrl: 'https://fbs.com/?ppk=tradevortex',
    pros: [
      'Micro cent accounts allowing live testing with minimal capital',
      'Ultra-high leverage up to 1:3000 on standard accounts',
      '100% deposit bonus promotional matches',
      'Multilingual customer support active 24/7'
    ],
    cons: [
      'Spreads widen on cent accounts',
      'High leverage requires extreme personal discipline'
    ],
    badge: 'Flexible Margin Tiers',
    executionSpeed: '< 35ms',
    rawSpreadEcn: false,
    swapFree: true,
    instantWithdrawal: false,
    filterTags: ['swap-free'],
    description: 'FBS provides ultra-flexible account tiers from Cent micro-accounts to ECN tiers with up to 1:3000 leverage and deposit doubling promos.',
    depositMethods: ['Visa', 'Skrill', 'Neteller', 'Crypto', 'Sticpay', 'Local Bank Wire'],
    specialOffer: 'Cent Micro Accounts + 100% Match'
  },
  {
    id: 'vantage',
    name: 'Vantage Markets',
    logo: '',
    rating: 4.8,
    reviewCount: 2750,
    minDeposit: '$20',
    maxLeverage: '1:500',
    spreadFrom: '0.0 pips',
    regulation: ['ASIC (Australia)', 'FCA (UK)', 'VFSC', 'FSCA'],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'ProTrader (TradingView)', 'Vantage App'],
    category: 'Multi-Asset',
    affiliateUrl: 'https://vantagefx.com/?affid=tradevortex',
    pros: [
      'Ultra-competitive ECN spreads with sub-millisecond execution',
      'Regulated by ASIC and FCA with segregated tier-1 client trust accounts',
      'Integrated TradingView charting directly in the web platform',
      'Automated trade signals and market sentiment analysis included'
    ],
    cons: [
      'Inactivity fee applies after 12 months of zero trades',
      'US clients not permitted'
    ],
    badge: 'ASIC & FCA Regulated',
    executionSpeed: '< 25ms (Equinix)',
    rawSpreadEcn: true,
    swapFree: true,
    instantWithdrawal: false,
    filterTags: ['raw-ecn', 'swap-free'],
    description: 'Vantage is an Australian heavyweight broker delivering institutional grade ECN liquidity, ProTrader TradingView powered interface, and sub-30ms execution.',
    depositMethods: ['Credit/Debit Cards', 'Crypto (USDT/BTC)', 'Neteller', 'Skrill', 'Bank Transfer'],
    specialOffer: 'Direct TradingView Terminal + Pro Signals'
  },
  {
    id: 'fp-markets',
    name: 'FP Markets',
    logo: '',
    rating: 4.8,
    reviewCount: 1890,
    minDeposit: '$20',
    maxLeverage: '1:500',
    spreadFrom: '0.0 pips',
    regulation: ['ASIC', 'CySEC', 'FSCA'],
    platforms: ['cTrader', 'MT4', 'MT5', 'Iress'],
    category: 'Multi-Asset',
    affiliateUrl: 'https://fpmarkets.com/?fpa=tradevortex',
    pros: [
      'Direct Market Access (DMA) for global equities through Iress platform',
      'Sub-40 millisecond execution speeds hosted in NY4 data centers',
      'Competitive commission rates ($3 per side on Raw accounts)',
      'Multi-jurisdiction regulatory pedigree spanning over 18 years'
    ],
    cons: [
      'Iress platform requires monthly platform fee if volume minimums not met',
      'Fixed leverage caps for European and Australian retail clients'
    ],
    badge: 'NY4 Ultra-Low Latency',
    executionSpeed: '< 18ms (NY4)',
    rawSpreadEcn: true,
    swapFree: true,
    instantWithdrawal: true,
    filterTags: ['raw-ecn', 'swap-free', 'instant-withdrawal'],
    description: 'FP Markets is an Australian-headquartered heavyweight delivering top-tier ECN pricing and low latency fiber optic cross-connections for high-frequency strategies.',
    depositMethods: ['Credit/Debit Cards', 'Crypto', 'POLi', 'Neteller', 'Fasapay', 'Bank Transfer'],
    specialOffer: 'NY4 Equinix Low-Latency Servers'
  }
];

const LOCAL_STORAGE_KEY = 'tradevortex_brokers_list_v3';

export const getStoredBrokers = (): Broker[] => {
  const adminSettings = getAdminSettings();
  const brokerLinks = adminSettings.brokerLinks || {};

  let baseBrokers = INITIAL_BROKERS;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('tradevortex_brokers_list_v2');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          baseBrokers = parsed.map((b: Broker) => ({
            ...b,
            logo: b.logo && b.logo.includes('unsplash.com') ? '' : b.logo || ''
          }));
        }
      }
    } catch {
      // fallback to initial
    }
  }

  return baseBrokers.map((b) => {
    const fallback = INITIAL_BROKERS.find((init) => init.id === b.id);
    const overrideUrl = brokerLinks[b.id];
    const cleanBadge = (b.badge || fallback?.badge || '').replace(/\s*\(\$?\d+\s*Min\)/gi, '').trim();
    const rawSpreadEcn =
      typeof b.rawSpreadEcn === 'boolean'
        ? b.rawSpreadEcn
        : fallback?.rawSpreadEcn ?? b.spreadFrom.includes('0.0');
    const swapFree = typeof b.swapFree === 'boolean' ? b.swapFree : fallback?.swapFree ?? true;
    const instantWithdrawal =
      typeof b.instantWithdrawal === 'boolean'
        ? b.instantWithdrawal
        : fallback?.instantWithdrawal ?? false;

    const computedTags: ('raw-ecn' | 'swap-free' | 'instant-withdrawal')[] = [];
    if (rawSpreadEcn) computedTags.push('raw-ecn');
    if (swapFree) computedTags.push('swap-free');
    if (instantWithdrawal) computedTags.push('instant-withdrawal');

    return {
      ...b,
      badge: cleanBadge || fallback?.badge,
      executionSpeed: b.executionSpeed || fallback?.executionSpeed || '< 30ms',
      rawSpreadEcn,
      swapFree,
      instantWithdrawal,
      filterTags: b.filterTags && b.filterTags.length > 0 ? b.filterTags : computedTags,
      affiliateUrl: overrideUrl || b.affiliateUrl
    };
  });
};

export const saveBrokers = (brokers: Broker[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(brokers));
    window.dispatchEvent(new CustomEvent(BROKERS_EVENT_KEY, { detail: brokers }));
  } catch (e) {
    console.error('Failed to save brokers', e);
  }
};

export const resetBrokersToDefault = (): Broker[] => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem('tradevortex_brokers_list_v2');
    window.dispatchEvent(new CustomEvent(BROKERS_EVENT_KEY, { detail: INITIAL_BROKERS }));
  }
  return INITIAL_BROKERS;
};
