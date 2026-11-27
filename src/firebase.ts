import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  Firestore
} from 'firebase/firestore';
import defaultFirebaseConfig from '../firebase-applet-config.json';

export interface FirebaseConfigShape {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

const CUSTOM_CONFIG_KEY = 'tradevortex_custom_firebase_config_v1';

export function getActiveFirebaseConfig(): FirebaseConfigShape {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(CUSTOM_CONFIG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.projectId && parsed.apiKey && parsed.appId) {
          return parsed;
        }
      }
    } catch {
      // fall back to provisioned config
    }
  }
  return defaultFirebaseConfig;
}

export function saveCustomFirebaseConfig(configJson: string): { ok: boolean; error?: string } {
  try {
    const parsed = JSON.parse(configJson);
    if (!parsed.projectId || !parsed.apiKey || !parsed.appId) {
      return { ok: false, error: 'Config JSON must include projectId, apiKey, and appId.' };
    }
    localStorage.setItem(CUSTOM_CONFIG_KEY, JSON.stringify(parsed));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Invalid JSON format' };
  }
}

export function clearCustomFirebaseConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CUSTOM_CONFIG_KEY);
  }
}

const activeConfig = getActiveFirebaseConfig();
const app: FirebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(activeConfig);

export const db: Firestore = activeConfig.firestoreDatabaseId
  ? getFirestore(app, activeConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection(): Promise<{
  connected: boolean;
  latencyMs: number;
  projectId: string;
  databaseId: string;
  error?: string;
}> {
  const started = performance.now();
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return {
      connected: true,
      latencyMs: Math.round(performance.now() - started),
      projectId: activeConfig.projectId,
      databaseId: activeConfig.firestoreDatabaseId || '(default)'
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
    return {
      connected: false,
      latencyMs: Math.round(performance.now() - started),
      projectId: activeConfig.projectId,
      databaseId: activeConfig.firestoreDatabaseId || '(default)',
      error: msg
    };
  }
}

// Run startup connection check as required
testFirestoreConnection().catch(() => {});
