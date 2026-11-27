import { CommunityProof } from '../types';

export const PROOFS_STORAGE_KEY = 'tradevortex_community_proofs_v1';
export const PROOFS_EVENT_KEY = 'tradevortex_proofs_changed';

export const DEFAULT_COMMUNITY_PROOFS: CommunityProof[] = [
  {
    id: 'proof-member-1',
    reviewerName: 'Usman Tariq',
    countryOrHandle: '@usman_fx · Telegram VIP Member',
    rating: 5,
    profitHighlight: '+$1,240 Weekly Payout',
    caption:
      'Using the TradeVortex Lot Size Calculator and keeping strict 1% risk on XAU/USD completely stopped me from blowing small accounts. Executed clean London session pullbacks and withdrew profits smoothly.',
    proofImages: [],
    videoUrl: '',
    dateLabel: 'Verified Community Review',
    verifiedBadge: true,
    source: 'Telegram Community'
  },
  {
    id: 'proof-member-2',
    reviewerName: 'Ahmed Al-Mansoor',
    countryOrHandle: '@ahmed_gold · Dubai, UAE',
    rating: 5,
    profitHighlight: '1:3.4 R:R Discipline',
    caption:
      'The Gold & Indices Sizer and 30-question fundamentals helped me understand why I used to lose during New York news spikes. Now every trade has a calculated Stop-Loss before entry.',
    proofImages: [],
    videoUrl: '',
    dateLabel: 'Verified Community Review',
    verifiedBadge: true,
    source: 'Telegram Community'
  },
  {
    id: 'proof-member-3',
    reviewerName: 'Mateo Silva',
    countryOrHandle: '@mateo_charts · São Paulo',
    rating: 5,
    profitHighlight: '+18.6% Monthly Account Growth',
    caption:
      'Started with a $20 micro account from the TradeVortex verified broker list, logged 60 trades in the journal, and stayed patient for A+ setups. Zero emotional revenge trades this month.',
    proofImages: [],
    videoUrl: '',
    dateLabel: 'Verified Community Review',
    verifiedBadge: true,
    source: 'Telegram Community'
  }
];

export function getStoredCommunityProofs(): CommunityProof[] {
  if (typeof window === 'undefined') return DEFAULT_COMMUNITY_PROOFS;
  try {
    const raw = localStorage.getItem(PROOFS_STORAGE_KEY);
    if (!raw) return DEFAULT_COMMUNITY_PROOFS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return DEFAULT_COMMUNITY_PROOFS;
  } catch {
    return DEFAULT_COMMUNITY_PROOFS;
  }
}

export function saveCommunityProofs(proofs: CommunityProof[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROOFS_STORAGE_KEY, JSON.stringify(proofs));
    window.dispatchEvent(new CustomEvent(PROOFS_EVENT_KEY, { detail: proofs }));
  } catch (err) {
    console.error('Failed to save community proofs', err);
  }
}

export function resetCommunityProofsToDefault(): CommunityProof[] {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PROOFS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(PROOFS_EVENT_KEY, { detail: DEFAULT_COMMUNITY_PROOFS }));
  }
  return DEFAULT_COMMUNITY_PROOFS;
}
