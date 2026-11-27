export interface LocalCurrencyOption {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  ratePerUSD: number; // Approximate fallback rate: 1 USD = ratePerUSD
}

export const LOCAL_CURRENCIES: LocalCurrencyOption[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', ratePerUSD: 1.0 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', flag: '🇵🇰', ratePerUSD: 278.5 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦', ratePerUSD: 3.75 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', ratePerUSD: 3.6725 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', ratePerUSD: 4.42 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', ratePerUSD: 84.4 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', ratePerUSD: 0.925 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', ratePerUSD: 0.785 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', ratePerUSD: 34.5 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', ratePerUSD: 15850 },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩', ratePerUSD: 119.5 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', ratePerUSD: 1660 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', ratePerUSD: 58.6 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', ratePerUSD: 34.4 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳', ratePerUSD: 25400 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', ratePerUSD: 1.39 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', ratePerUSD: 1.53 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', ratePerUSD: 153.8 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', ratePerUSD: 7.24 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', ratePerUSD: 5.78 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', ratePerUSD: 18.1 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬', ratePerUSD: 49.5 }
];

const CACHE_KEY = 'tradevortex_fx_rates_cache_v1';

export async function fetchLiveExchangeRates(): Promise<Record<string, number>> {
  const defaults: Record<string, number> = {};
  LOCAL_CURRENCIES.forEach((c) => {
    defaults[c.code] = c.ratePerUSD;
  });

  if (typeof window === 'undefined') return defaults;

  try {
    const cachedRaw = sessionStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const parsed = JSON.parse(cachedRaw);
      if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < 30 * 60 * 1000 && parsed.rates) {
        return { ...defaults, ...parsed.rates };
      }
    }

    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        const merged = { ...defaults, ...data.rates };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), rates: merged }));
        return merged;
      }
    }
  } catch {
    // Fallback gracefully to accurate static baseline rates
  }

  return defaults;
}

export function formatCurrencyAmount(amount: number, currencyCode: string): string {
  const cur = LOCAL_CURRENCIES.find((c) => c.code === currencyCode) || LOCAL_CURRENCIES[0];
  const abs = Math.abs(amount);
  const decimals = abs >= 1000 || ['IDR', 'VND', 'JPY', 'NGN'].includes(currencyCode) ? 0 : 2;
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  return `${amount < 0 ? '-' : ''}${cur.symbol} ${formatted}`;
}
