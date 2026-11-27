import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, googleProvider, OperationType, handleFirestoreError } from '../firebase';
import {
  AdminSettings,
  Article,
  Broker,
  CommunityProof,
  FAQItem,
  MediaItem,
  QuizQuestion
} from '../types';
import { saveAdminSettings } from './adminSettings';
import { saveBrokers } from './brokersData';
import { saveArticles } from './articlesData';
import { saveQuizQuestions } from './quizData';
import { saveFaqs } from './faqsData';
import { saveCommunityProofs } from './communityProofsData';

export interface GlobalSitePayload {
  settings: AdminSettings;
  brokers: Broker[];
  articles: Article[];
  quizQuestions: QuizQuestion[];
  faqs?: FAQItem[];
  proofs?: CommunityProof[];
}

export interface CloudPublishResult {
  localSaved: boolean;
  syncedToCloud: boolean;
  latencyMs: number;
  requiresCloudAuth?: boolean;
  error?: string;
}

const SYNC_CHANNEL_NAME = 'tradevortex_global_sync_v1';
const GLOBAL_DOC_PATH = 'site_config/global';

function sanitizeForFirestore(payload: GlobalSitePayload): Record<string, unknown> {
  // Firestore documents have a strict 1MB limit. Keep external URLs intact and trim huge inline data URIs for cloud sync while keeping local preview full-res.
  const cleanMedia: MediaItem[] = (payload.settings.mediaLibrary || [])
    .slice(0, 100)
    .map((m) => ({
      ...m,
      url: m.url.startsWith('data:') && m.url.length > 90000 ? '' : m.url
    }))
    .filter((m) => m.url.length > 0);

  const safeLogo =
    payload.settings.siteLogoUrl &&
    payload.settings.siteLogoUrl.length <= 190000
      ? payload.settings.siteLogoUrl
      : '';

  const cleanProofs = (payload.proofs || payload.settings.communityProofs || [])
    .slice(0, 40)
    .map((p) => ({
      ...p,
      proofImages: (p.proofImages || [])
        .filter((img) => !(img.startsWith('data:') && img.length > 85000))
        .slice(0, 6),
      videoUrl:
        p.videoUrl && p.videoUrl.startsWith('data:') && p.videoUrl.length > 120000
          ? ''
          : p.videoUrl || ''
    }));

  const cleanFaqs = (payload.faqs || payload.settings.homeFaqs || []).slice(0, 80);

  const settingsForCloud: AdminSettings = {
    ...payload.settings,
    siteLogoUrl: safeLogo,
    mediaLibrary: cleanMedia,
    ...(cleanFaqs.length > 0 ? { homeFaqs: cleanFaqs } : {}),
    ...(cleanProofs.length > 0 ? { communityProofs: cleanProofs } : {}),
    cloudSyncMeta: {
      lastPublishedAt: new Date().toISOString(),
      lastPublishedBy: auth.currentUser?.email || 'admin'
    }
  };

  return {
    settings: settingsForCloud,
    brokers: payload.brokers.slice(0, 100),
    articles: payload.articles.slice(0, 100),
    quizQuestions: payload.quizQuestions.slice(0, 100),
    customPages: (payload.settings.customPages || []).slice(0, 50),
    customNavButtons: (payload.settings.customNavButtons || []).slice(0, 30),
    mediaLibrary: cleanMedia,
    siteLogoUrl: safeLogo,
    brandTagline: (payload.settings.brandTagline || '').slice(0, 200),
    updatedAt: serverTimestamp(),
    updatedBy: auth.currentUser?.uid || ''
  };
}

export async function signInCloudAdmin(): Promise<{ ok: boolean; email?: string; error?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { ok: true, email: result.user.email || undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Google sign-in cancelled' };
  }
}

export async function signOutCloudAdmin(): Promise<void> {
  await signOut(auth);
}

export async function publishGlobalSiteConfig(payload: GlobalSitePayload): Promise<CloudPublishResult> {
  const start = performance.now();

  const updatedSettings: AdminSettings = {
    ...payload.settings,
    ...(payload.faqs ? { homeFaqs: payload.faqs } : {}),
    ...(payload.proofs ? { communityProofs: payload.proofs } : {}),
    cloudSyncMeta: {
      lastPublishedAt: new Date().toISOString(),
      lastPublishedBy: auth.currentUser?.email || 'Local Admin'
    }
  };

  // 1. Always persist immediately to localStorage + cross-tab BroadcastChannel
  saveAdminSettings(updatedSettings);
  saveBrokers(payload.brokers);
  saveArticles(payload.articles);
  saveQuizQuestions(payload.quizQuestions);
  if (payload.faqs) saveFaqs(payload.faqs);
  if (payload.proofs) saveCommunityProofs(payload.proofs);

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const ch = new BroadcastChannel(SYNC_CHANNEL_NAME);
      ch.postMessage({
        type: 'GLOBAL_PUBLISH',
        payload: { ...payload, settings: updatedSettings },
        sentAt: Date.now()
      });
      ch.close();
    } catch {
      // ignore broadcast errors
    }
  }

  // 2. Push to Firestore global document when signed in as verified Cloud Admin
  if (!auth.currentUser || !auth.currentUser.emailVerified) {
    return {
      localSaved: true,
      syncedToCloud: false,
      requiresCloudAuth: true,
      latencyMs: Math.round(performance.now() - start)
    };
  }

  try {
    const docData = sanitizeForFirestore({ ...payload, settings: updatedSettings });
    await setDoc(doc(db, 'site_config', 'global'), docData);
    return {
      localSaved: true,
      syncedToCloud: true,
      latencyMs: Math.round(performance.now() - start)
    };
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.WRITE, GLOBAL_DOC_PATH);
    } catch (wrappedErr) {
      return {
        localSaved: true,
        syncedToCloud: false,
        latencyMs: Math.round(performance.now() - start),
        error: wrappedErr instanceof Error ? wrappedErr.message : String(wrappedErr)
      };
    }
  }
}

export function subscribeGlobalSiteConfig(
  onSync: (payload: Partial<GlobalSitePayload>, source: 'firestore' | 'broadcast') => void
): () => void {
  let unsubFirestore: (() => void) | null = null;
  let channel: BroadcastChannel | null = null;

  try {
    unsubFirestore = onSnapshot(
      doc(db, 'site_config', 'global'),
      (snapshot) => {
        if (!snapshot.exists()) return;
        const data = snapshot.data();
        if (!data || !data.settings) return;

        const mergedSettings = data.settings as AdminSettings;
        saveAdminSettings(mergedSettings);
        if (Array.isArray(data.brokers) && data.brokers.length > 0) {
          saveBrokers(data.brokers as Broker[]);
        }
        if (Array.isArray(data.articles) && data.articles.length > 0) {
          saveArticles(data.articles as Article[]);
        }
        if (Array.isArray(data.quizQuestions) && data.quizQuestions.length > 0) {
          saveQuizQuestions(data.quizQuestions as QuizQuestion[]);
        }
        if (Array.isArray(mergedSettings.homeFaqs) && mergedSettings.homeFaqs.length > 0) {
          saveFaqs(mergedSettings.homeFaqs);
        }
        if (Array.isArray(mergedSettings.communityProofs)) {
          saveCommunityProofs(mergedSettings.communityProofs);
        }

        onSync(
          {
            settings: mergedSettings,
            brokers: data.brokers as Broker[] | undefined,
            articles: data.articles as Article[] | undefined,
            quizQuestions: data.quizQuestions as QuizQuestion[] | undefined,
            faqs: mergedSettings.homeFaqs,
            proofs: mergedSettings.communityProofs
          },
          'firestore'
        );
      },
      (error) => {
        console.warn('Firestore global listener notice:', error.message);
      }
    );
  } catch {
    // fallback silently to localStorage/BroadcastChannel if offline
  }

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === 'GLOBAL_PUBLISH' && event.data?.payload) {
          const p = event.data.payload as GlobalSitePayload;
          saveAdminSettings(p.settings);
          saveBrokers(p.brokers);
          saveArticles(p.articles);
          saveQuizQuestions(p.quizQuestions);
          if (p.faqs) saveFaqs(p.faqs);
          if (p.proofs) saveCommunityProofs(p.proofs);
          onSync(p, 'broadcast');
        }
      };
    } catch {
      // ignore
    }
  }

  return () => {
    if (unsubFirestore) unsubFirestore();
    if (channel) channel.close();
  };
}
