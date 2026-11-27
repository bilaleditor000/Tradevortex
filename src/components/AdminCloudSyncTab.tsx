import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  auth,
  getActiveFirebaseConfig,
  saveCustomFirebaseConfig,
  clearCustomFirebaseConfig,
  testFirestoreConnection
} from '../firebase';
import { signInCloudAdmin, signOutCloudAdmin } from '../data/cloudSync';
import { AdminSettings } from '../types';
import { playClickSound } from '../utils/sound';
import {
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogIn,
  LogOut,
  Database,
  RotateCcw
} from 'lucide-react';

interface AdminCloudSyncTabProps {
  settings: AdminSettings;
  onTriggerCloudPublish: () => Promise<void>;
}

export const AdminCloudSyncTab: React.FC<AdminCloudSyncTabProps> = ({
  settings,
  onTriggerCloudPublish
}) => {
  const [cloudUser, setCloudUser] = useState<User | null>(() => auth.currentUser);
  const [connStatus, setConnStatus] = useState<{
    checking: boolean;
    connected: boolean;
    latencyMs: number;
    projectId: string;
    databaseId: string;
    error?: string;
  }>({
    checking: true,
    connected: false,
    latencyMs: 0,
    projectId: getActiveFirebaseConfig().projectId,
    databaseId: getActiveFirebaseConfig().firestoreDatabaseId || '(default)'
  });

  const [customJson, setCustomJson] = useState('');
  const [configMsg, setConfigMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCloudUser(u));
    testFirestoreConnection().then((res) =>
      setConnStatus({ checking: false, ...res })
    );
    return unsub;
  }, []);

  const handleTestConnection = async () => {
    playClickSound('click');
    setConnStatus((p) => ({ ...p, checking: true }));
    const res = await testFirestoreConnection();
    setConnStatus({ checking: false, ...res });
  };

  const handleGoogleSignIn = async () => {
    playClickSound('calculate');
    const res = await signInCloudAdmin();
    if (!res.ok && res.error) {
      setConfigMsg({ ok: false, text: res.error });
    } else {
      setConfigMsg({ ok: true, text: `Cloud Admin authorized as ${res.email || 'Google Account'}` });
    }
  };

  const handleSaveCustomConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const res = saveCustomFirebaseConfig(customJson);
    if (res.ok) {
      setConfigMsg({
        ok: true,
        text: 'Custom Firebase config saved. Reloading portal to connect...'
      });
      window.setTimeout(() => window.location.reload(), 900);
    } else {
      setConfigMsg({ ok: false, text: res.error || 'Invalid config JSON' });
    }
  };

  return (
    <div className="space-y-5">
      {/* Live Status Banner */}
      <div className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Global Firebase Cloud Sync Engine</span>
                {connStatus.connected ? (
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                    Connected · {connStatus.latencyMs}ms
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                    {connStatus.checking ? 'Checking...' : 'Local Fallback Active'}
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                Project: {connStatus.projectId} · DB: {connStatus.databaseId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestConnection}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-cyan-500/40"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${connStatus.checking ? 'animate-spin' : ''}`} />
            <span>Ping Cloud DB</span>
          </button>
        </div>

        {settings.cloudSyncMeta?.lastPublishedAt && (
          <div className="text-[11px] font-mono text-slate-300 bg-slate-900/70 border border-slate-800 rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-2">
            <span>
              Last Published: {new Date(settings.cloudSyncMeta.lastPublishedAt).toLocaleString()}
            </span>
            <span>By: {settings.cloudSyncMeta.lastPublishedBy || 'Admin'}</span>
          </div>
        )}
      </div>

      {/* Cloud Admin Write Authorization */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Cloud Publish Authentication (2-Second Worldwide Sync)
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              All visitors worldwide read live updates automatically. Sign in with your verified Google Admin account to authorize cloud writes across Mobile, PC, Tablet, and Laptop.
            </p>
          </div>

          {cloudUser ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{cloudUser.email}</span>
              </span>
              <button
                type="button"
                onClick={() => signOutCloudAdmin()}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:from-cyan-400 hover:to-sky-400 shadow-md shadow-cyan-500/20"
            >
              <LogIn className="h-4 w-4" />
              <span>Authorize Google Cloud Sync</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-400">
            Immediate Local + BroadcastChannel preview always stays active as automatic fallback.
          </span>
          <button
            type="button"
            onClick={onTriggerCloudPublish}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
          >
            <Cloud className="h-3.5 w-3.5" />
            <span>Push Live Snapshot Now</span>
          </button>
        </div>
      </div>

      {configMsg && (
        <div
          className={`rounded-lg border p-3 text-xs flex items-center gap-2 ${
            configMsg.ok
              ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
              : 'border-amber-500/40 bg-amber-950/30 text-amber-300'
          }`}
        >
          {configMsg.ok ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          <span>{configMsg.text}</span>
        </div>
      )}

      {/* Optional Custom Firebase Config Override */}
      <form
        onSubmit={handleSaveCustomConfig}
        className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
            <Database className="h-4 w-4 text-cyan-400" />
            <span>Optional Custom Firebase Web Config Override (JSON)</span>
          </h4>
          <button
            type="button"
            onClick={() => {
              clearCustomFirebaseConfig();
              window.location.reload();
            }}
            className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Use Default Provisioned DB</span>
          </button>
        </div>
        <textarea
          rows={3}
          value={customJson}
          onChange={(e) => setCustomJson(e.target.value)}
          placeholder='{"apiKey":"...","authDomain":"...","projectId":"...","appId":"..."}'
          className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs font-mono text-cyan-300"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg border border-cyan-500/40 bg-cyan-950/40 px-4 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
          >
            Apply Custom Firebase Config
          </button>
        </div>
      </form>
    </div>
  );
};
