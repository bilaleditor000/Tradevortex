import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../firebase';
import { AnalyticsEventRecord, AnalyticsEventType } from '../types';

const EVENTS_KEY = 'tradevortex_analytics_events_v1';
const PRESENCE_KEY = 'tradevortex_analytics_presence_v1';
const SESSION_KEY = 'tradevortex_visitor_session_id';
const ANALYTICS_CHANNEL = 'tradevortex_analytics_sync_v1';
export const ANALYTICS_EVENT_KEY = 'tradevortex_analytics_updated';

export interface ActiveSessionPresence {
  sessionId: string;
  device: 'Mobile' | 'Tablet' | 'PC';
  country: string;
  countryCode: string;
  flag: string;
  currentPage: string;
  active: boolean;
  lastSeenMs: number;
}

export interface CountryStat {
  country: string;
  countryCode: string;
  flag: string;
  views: number;
  percent: number;
}

export interface DeviceStat {
  device: 'Mobile' | 'Tablet' | 'PC';
  count: number;
  percent: number;
}

export interface AnalyticsSummary {
  activeVisitorsNow: number;
  todayViews: number;
  weeklyViews: number;
  monthlyViews: number;
  totalEvents: number;
  avgTimeSpentSec: number;
  countries: CountryStat[];
  devices: DeviceStat[];
  recentFeed: AnalyticsEventRecord[];
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'sess_ssr';
  let existing = sessionStorage.getItem(SESSION_KEY);
  if (!existing) {
    existing = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(SESSION_KEY, existing);
  }
  return existing;
}

export function detectDeviceType(): 'Mobile' | 'Tablet' | 'PC' {
  if (typeof window === 'undefined') return 'PC';
  const w = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(ua) || (w >= 640 && w < 1024 && 'ontouchstart' in window)) {
    return 'Tablet';
  }
  if (/mobi|android|iphone|ipod/.test(ua) || w < 640) {
    return 'Mobile';
  }
  return 'PC';
}

const TIMEZONE_COUNTRY_MAP: Record<string, { country: string; code: string; flag: string }> = {
  'Asia/Karachi': { country: 'Pakistan', code: 'PK', flag: '🇵🇰' },
  'Asia/Dubai': { country: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
  'Asia/Riyadh': { country: 'Saudi Arabia', code: 'SA', flag: '🇸🇦' },
  'Asia/Kuala_Lumpur': { country: 'Malaysia', code: 'MY', flag: '🇲🇾' },
  'Asia/Kolkata': { country: 'India', code: 'IN', flag: '🇮🇳' },
  'Asia/Calcutta': { country: 'India', code: 'IN', flag: '🇮🇳' },
  'Asia/Dhaka': { country: 'Bangladesh', code: 'BD', flag: '🇧🇩' },
  'Asia/Jakarta': { country: 'Indonesia', code: 'ID', flag: '🇮🇩' },
  'Asia/Singapore': { country: 'Singapore', code: 'SG', flag: '🇸🇬' },
  'Asia/Tokyo': { country: 'Japan', code: 'JP', flag: '🇯🇵' },
  'Asia/Seoul': { country: 'South Korea', code: 'KR', flag: '🇰🇷' },
  'Asia/Shanghai': { country: 'China', code: 'CN', flag: '🇨🇳' },
  'Asia/Tehran': { country: 'Iran', code: 'IR', flag: '🇮🇷' },
  'Asia/Kabul': { country: 'Afghanistan', code: 'AF', flag: '🇦🇫' },
  'Europe/London': { country: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  'Europe/Berlin': { country: 'Germany', code: 'DE', flag: '🇩🇪' },
  'Europe/Paris': { country: 'France', code: 'FR', flag: '🇫🇷' },
  'Europe/Istanbul': { country: 'Turkey', code: 'TR', flag: '🇹🇷' },
  'Europe/Madrid': { country: 'Spain', code: 'ES', flag: '🇪🇸' },
  'Europe/Rome': { country: 'Italy', code: 'IT', flag: '🇮🇹' },
  'Europe/Moscow': { country: 'Russia', code: 'RU', flag: '🇷🇺' },
  'America/New_York': { country: 'United States', code: 'US', flag: '🇺🇸' },
  'America/Chicago': { country: 'United States', code: 'US', flag: '🇺🇸' },
  'America/Los_Angeles': { country: 'United States', code: 'US', flag: '🇺🇸' },
  'America/Toronto': { country: 'Canada', code: 'CA', flag: '🇨🇦' },
  'America/Sao_Paulo': { country: 'Brazil', code: 'BR', flag: '🇧🇷' },
  'Australia/Sydney': { country: 'Australia', code: 'AU', flag: '🇦🇺' }
};

export function detectVisitorCountry(): { country: string; countryCode: string; flag: string } {
  if (typeof Intl === 'undefined') {
    return { country: 'Global', countryCode: 'GL', flag: '🌍' };
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_COUNTRY_MAP[tz]) {
      const m = TIMEZONE_COUNTRY_MAP[tz];
      return { country: m.country, countryCode: m.code, flag: m.flag };
    }
    if (tz && tz.includes('/')) {
      const region = tz.split('/')[1].replace(/_/g, ' ');
      return { country: region, countryCode: tz.slice(0, 2).toUpperCase(), flag: '🌍' };
    }
  } catch {
    // ignore
  }
  return { country: 'International', countryCode: 'GL', flag: '🌍' };
}

function getLocalEvents(): AnalyticsEventRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalEvents(events: AnalyticsEventRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(0, 1500)));
    window.dispatchEvent(new CustomEvent(ANALYTICS_EVENT_KEY));
  } catch {
    // ignore storage quota errors
  }
}

function getLocalPresence(): Record<string, ActiveSessionPresence> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PRESENCE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

function saveLocalPresence(map: Record<string, ActiveSessionPresence>): void {
  if (typeof window === 'undefined') return;
  try {
    const cutoff = Date.now() - 120000;
    const pruned: Record<string, ActiveSessionPresence> = {};
    Object.values(map).forEach((p) => {
      if (p.lastSeenMs >= cutoff) pruned[p.sessionId] = p;
    });
    localStorage.setItem(PRESENCE_KEY, JSON.stringify(pruned));
  } catch {
    // ignore
  }
}

let sessionStartTimeMs = Date.now();

export function getSessionDurationSec(): number {
  return Math.max(1, Math.round((Date.now() - sessionStartTimeMs) / 1000));
}

export function trackAnalyticsEvent(
  type: AnalyticsEventType,
  page: string,
  label: string
): void {
  if (typeof window === 'undefined') return;

  const geo = detectVisitorCountry();
  const device = detectDeviceType();
  const eventId = `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const durationSec = getSessionDurationSec();

  const record: AnalyticsEventRecord = {
    eventId,
    type,
    page: page.slice(0, 64),
    label: label.slice(0, 160),
    country: geo.country.slice(0, 64),
    countryCode: geo.countryCode.slice(0, 8),
    flag: geo.flag.slice(0, 16),
    device,
    durationSec: Math.min(86400, Math.max(0, durationSec)),
    createdAtMs: Date.now()
  };

  const current = getLocalEvents();
  saveLocalEvents([record, ...current]);

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const ch = new BroadcastChannel(ANALYTICS_CHANNEL);
      ch.postMessage({ type: 'EVENT', record });
      ch.close();
    } catch {
      // ignore
    }
  }

  // Push anonymized telemetry event to Firestore
  setDoc(doc(db, 'analytics_events', eventId), {
    eventId: record.eventId,
    type: record.type,
    page: record.page,
    label: record.label,
    country: record.country,
    countryCode: record.countryCode,
    flag: record.flag,
    device: record.device,
    durationSec: record.durationSec,
    createdAt: serverTimestamp()
  }).catch(() => {
    // silently stay resilient offline or if quota/rules limit
  });
}

export function updateVisitorPresence(currentPage: string, active = true): void {
  if (typeof window === 'undefined') return;
  const sessionId = getOrCreateSessionId();
  const geo = detectVisitorCountry();
  const device = detectDeviceType();

  const localMap = getLocalPresence();
  localMap[sessionId] = {
    sessionId,
    device,
    country: geo.country,
    countryCode: geo.countryCode,
    flag: geo.flag,
    currentPage: currentPage.slice(0, 64),
    active,
    lastSeenMs: Date.now()
  };
  saveLocalPresence(localMap);

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const ch = new BroadcastChannel(ANALYTICS_CHANNEL);
      ch.postMessage({ type: 'PRESENCE', presence: localMap[sessionId] });
      ch.close();
    } catch {
      // ignore
    }
  }

  setDoc(doc(db, 'analytics_presence', sessionId), {
    sessionId,
    device,
    country: geo.country.slice(0, 64),
    countryCode: geo.countryCode.slice(0, 8),
    flag: geo.flag.slice(0, 16),
    currentPage: currentPage.slice(0, 64),
    active,
    lastSeen: serverTimestamp()
  }).catch(() => {
    // ignore offline/permission notices cleanly
  });
}

export function computeAnalyticsSummary(
  events: AnalyticsEventRecord[],
  activePresences: ActiveSessionPresence[],
  deviceFilter: 'All' | 'Mobile' | 'Tablet' | 'PC' = 'All'
): AnalyticsSummary {
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const todayCutoff = startOfDay.getTime();
  const weekCutoff = now - 7 * 24 * 60 * 60 * 1000;
  const monthCutoff = now - 30 * 24 * 60 * 60 * 1000;

  const filteredEvents =
    deviceFilter === 'All' ? events : events.filter((e) => e.device === deviceFilter);

  const viewEvents = filteredEvents.filter(
    (e) => e.type === 'page_view' || e.type === 'session_start'
  );

  const todayViews = viewEvents.filter((e) => e.createdAtMs >= todayCutoff).length;
  const weeklyViews = viewEvents.filter((e) => e.createdAtMs >= weekCutoff).length;
  const monthlyViews = viewEvents.filter((e) => e.createdAtMs >= monthCutoff).length;

  const durations = filteredEvents.map((e) => e.durationSec).filter((d) => d > 0);
  const avgTimeSpentSec =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

  const countryBuckets = new Map<string, CountryStat>();
  filteredEvents.forEach((e) => {
    const key = `${e.countryCode}_${e.country}`;
    const prev = countryBuckets.get(key);
    if (prev) {
      prev.views += 1;
    } else {
      countryBuckets.set(key, {
        country: e.country,
        countryCode: e.countryCode,
        flag: e.flag,
        views: 1,
        percent: 0
      });
    }
  });

  const totalForPct = Math.max(1, filteredEvents.length);
  const countries = Array.from(countryBuckets.values())
    .sort((a, b) => b.views - a.views)
    .map((c) => ({ ...c, percent: Math.round((c.views / totalForPct) * 100) }));

  const deviceCounts: Record<'Mobile' | 'Tablet' | 'PC', number> = {
    Mobile: 0,
    Tablet: 0,
    PC: 0
  };
  events.forEach((e) => {
    deviceCounts[e.device] = (deviceCounts[e.device] || 0) + 1;
  });
  const totalDevices = Math.max(1, events.length);
  const devices: DeviceStat[] = (['PC', 'Mobile', 'Tablet'] as const).map((d) => ({
    device: d,
    count: deviceCounts[d],
    percent: Math.round((deviceCounts[d] / totalDevices) * 100)
  }));

  const presenceCutoff = now - 90000;
  const activeNow = activePresences.filter(
    (p) => p.active && p.lastSeenMs >= presenceCutoff
  ).length;

  return {
    activeVisitorsNow: Math.max(1, activeNow),
    todayViews,
    weeklyViews,
    monthlyViews,
    totalEvents: filteredEvents.length,
    avgTimeSpentSec,
    countries,
    devices,
    recentFeed: [...filteredEvents].sort((a, b) => b.createdAtMs - a.createdAtMs).slice(0, 40)
  };
}

export function subscribeAnalyticsDashboard(
  onUpdate: (events: AnalyticsEventRecord[], presences: ActiveSessionPresence[]) => void
): () => void {
  let cloudEvents: AnalyticsEventRecord[] = [];
  let cloudPresences: ActiveSessionPresence[] = [];

  const emitMerged = () => {
    const localEv = getLocalEvents();
    const mapEv = new Map<string, AnalyticsEventRecord>();
    [...cloudEvents, ...localEv].forEach((ev) => mapEv.set(ev.eventId, ev));

    const localPres = Object.values(getLocalPresence());
    const mapPres = new Map<string, ActiveSessionPresence>();
    [...localPres, ...cloudPresences].forEach((p) => mapPres.set(p.sessionId, p));

    onUpdate(Array.from(mapEv.values()), Array.from(mapPres.values()));
  };

  emitMerged();

  let unsubPresence: (() => void) | null = null;
  let unsubEvents: (() => void) | null = null;

  try {
    unsubPresence = onSnapshot(
      query(collection(db, 'analytics_presence'), where('active', '==', true), limit(100)),
      (snap) => {
        cloudPresences = snap.docs.map((d) => {
          const data = d.data();
          const ts = data.lastSeen instanceof Timestamp ? data.lastSeen.toMillis() : Date.now();
          return {
            sessionId: String(data.sessionId || d.id),
            device: (data.device || 'PC') as 'Mobile' | 'Tablet' | 'PC',
            country: String(data.country || 'Global'),
            countryCode: String(data.countryCode || 'GL'),
            flag: String(data.flag || '🌍'),
            currentPage: String(data.currentPage || 'home'),
            active: Boolean(data.active),
            lastSeenMs: ts
          };
        });
        emitMerged();
      },
      () => {
        // fallback cleanly
      }
    );
  } catch {
    // ignore
  }

  // Only query cloud analytics_events if signed in as verified Cloud Admin
  if (auth.currentUser && auth.currentUser.emailVerified) {
    try {
      unsubEvents = onSnapshot(
        query(collection(db, 'analytics_events'), orderBy('createdAt', 'desc'), limit(250)),
        (snap) => {
          cloudEvents = snap.docs.map((d) => {
            const data = d.data();
            const ts = data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now();
            return {
              eventId: String(data.eventId || d.id),
              type: data.type as AnalyticsEventType,
              page: String(data.page || 'home'),
              label: String(data.label || ''),
              country: String(data.country || 'Global'),
              countryCode: String(data.countryCode || 'GL'),
              flag: String(data.flag || '🌍'),
              device: (data.device || 'PC') as 'Mobile' | 'Tablet' | 'PC',
              durationSec: Number(data.durationSec || 0),
              createdAtMs: ts
            };
          });
          emitMerged();
        },
        () => {
          // ignore
        }
      );
    } catch {
      // ignore
    }
  }

  const handleLocal = () => emitMerged();
  window.addEventListener(ANALYTICS_EVENT_KEY, handleLocal);

  let channel: BroadcastChannel | null = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      channel = new BroadcastChannel(ANALYTICS_CHANNEL);
      channel.onmessage = () => emitMerged();
    } catch {
      // ignore
    }
  }

  const timer = window.setInterval(emitMerged, 1000);

  return () => {
    if (unsubPresence) unsubPresence();
    if (unsubEvents) unsubEvents();
    window.removeEventListener(ANALYTICS_EVENT_KEY, handleLocal);
    if (channel) channel.close();
    window.clearInterval(timer);
  };
}

export function exportAnalyticsCsv(
  events: AnalyticsEventRecord[],
  range: 'daily' | 'weekly' | 'monthly'
): void {
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const cutoff =
    range === 'daily'
      ? startOfDay.getTime()
      : range === 'weekly'
      ? now - 7 * 24 * 60 * 60 * 1000
      : now - 30 * 24 * 60 * 60 * 1000;

  const rows = events
    .filter((e) => e.createdAtMs >= cutoff)
    .sort((a, b) => b.createdAtMs - a.createdAtMs);

  const escapeCsv = (val: string | number) => {
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headers = [
    'Timestamp (ISO)',
    'Event Type',
    'Page',
    'Action / Target',
    'Country',
    'Country Code',
    'Device',
    'Session Duration (sec)'
  ];

  const csvLines = [
    headers.map(escapeCsv).join(','),
    ...rows.map((r) =>
      [
        new Date(r.createdAtMs).toISOString(),
        r.type,
        r.page,
        r.label,
        r.country,
        r.countryCode,
        r.device,
        r.durationSec
      ]
        .map(escapeCsv)
        .join(',')
    )
  ];

  // UTF-8 BOM for clean Excel opening across all languages
  const blob = new Blob(['\uFEFF' + csvLines.join('\r\n')], {
    type: 'text/csv;charset=utf-8;'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tradevortex-${range}-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function resetAnalyticsData(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(EVENTS_KEY);
    localStorage.removeItem(PRESENCE_KEY);
    sessionStartTimeMs = Date.now();
    window.dispatchEvent(new CustomEvent(ANALYTICS_EVENT_KEY));
  }

  if (auth.currentUser && auth.currentUser.emailVerified) {
    try {
      const snap = await getDocs(query(collection(db, 'analytics_events'), limit(100)));
      await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, 'analytics_events');
      } catch {
        // handled cleanly
      }
    }
  }
}
