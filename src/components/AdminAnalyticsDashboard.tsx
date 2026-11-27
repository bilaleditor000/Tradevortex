import React, { useState, useEffect, useMemo } from 'react';
import {
  AnalyticsEventRecord
} from '../types';
import {
  ActiveSessionPresence,
  subscribeAnalyticsDashboard,
  computeAnalyticsSummary,
  exportAnalyticsCsv,
  resetAnalyticsData
} from '../data/analyticsStore';
import { playClickSound } from '../utils/sound';
import {
  Activity,
  Users,
  Eye,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  Download,
  Trash2,
  Filter
} from 'lucide-react';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

function formatEventTime(ms: number): string {
  return new Date(ms).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export const AdminAnalyticsDashboard: React.FC = () => {
  const [events, setEvents] = useState<AnalyticsEventRecord[]>([]);
  const [presences, setPresences] = useState<ActiveSessionPresence[]>([]);
  const [deviceFilter, setDeviceFilter] = useState<'All' | 'Mobile' | 'Tablet' | 'PC'>('All');
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const unsub = subscribeAnalyticsDashboard((evs, pres) => {
      setEvents(evs);
      setPresences(pres);
    });
    return unsub;
  }, []);

  const summary = useMemo(
    () => computeAnalyticsSummary(events, presences, deviceFilter),
    [events, presences, deviceFilter]
  );

  const handleReset = async () => {
    playClickSound('toggle');
    await resetAnalyticsData();
    setConfirmReset(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Toolbar: Filter & CSV/Excel Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-500/30 bg-slate-950/80 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
            <Filter className="h-3.5 w-3.5" />
            <span>Device Filter:</span>
          </span>
          {(['All', 'PC', 'Mobile', 'Tablet'] as const).map((dev) => (
            <button
              key={dev}
              type="button"
              onClick={() => {
                playClickSound('click');
                setDeviceFilter(dev);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                deviceFilter === dev
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
              }`}
            >
              {dev}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playClickSound('calculate');
              exportAnalyticsCsv(events, 'daily');
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Daily CSV/Excel</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound('calculate');
              exportAnalyticsCsv(events, 'weekly');
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/30 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Weekly CSV/Excel</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound('calculate');
              exportAnalyticsCsv(events, 'monthly');
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-950/30 px-3 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-500/20"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Monthly CSV/Excel</span>
          </button>

          {confirmReset ? (
            <div className="flex items-center gap-1.5 bg-rose-950/30 border border-rose-500/40 rounded-lg px-2.5 py-1">
              <span className="text-[11px] text-rose-300 font-semibold">Clear all logs?</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-bold text-rose-200 bg-rose-600 px-2 py-0.5 rounded"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="text-[11px] text-slate-300 px-1.5"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-slate-900 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-950/30"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300">
            <span>Active Online Now</span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1 flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-400" />
            <span>{summary.activeVisitorsNow}</span>
          </div>
          <span className="text-[10px] text-emerald-300/80 block mt-0.5">Live heartbeat stream</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Today&apos;s Views</span>
            <Eye className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">
            {summary.todayViews.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Current calendar day</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Weekly Views</span>
            <Calendar className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono mt-1">
            {summary.weeklyViews.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Last 7 days</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Monthly Views</span>
            <Activity className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-sky-300 font-mono mt-1">
            {summary.monthlyViews.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Last 30 days</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Avg Time On Site</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-mono mt-1">
            {formatDuration(summary.avgTimeSpentSec)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Across {summary.totalEvents} actions
          </span>
        </div>
      </div>

      {/* Audience Breakdown: Countries & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Countries Breakdown */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Visitor Countries Breakdown</span>
          </h4>
          {summary.countries.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              Waiting for incoming visitor traffic events...
            </p>
          ) : (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {summary.countries.map((c) => (
                <div key={`${c.countryCode}_${c.country}`} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span>{c.country}</span>
                    </span>
                    <span className="font-mono text-cyan-300">
                      {c.views} ({c.percent}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full transition-all"
                      style={{ width: `${Math.max(4, c.percent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Devices Breakdown */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>Device Distribution (Mobile vs Tablet vs PC)</span>
          </h4>
          <div className="space-y-3 pt-1">
            {summary.devices.map((d) => {
              const Icon =
                d.device === 'Mobile' ? Smartphone : d.device === 'Tablet' ? Tablet : Monitor;
              const barColor =
                d.device === 'Mobile'
                  ? 'from-emerald-500 to-teal-400'
                  : d.device === 'Tablet'
                  ? 'from-amber-500 to-orange-400'
                  : 'from-cyan-500 to-sky-400';

              return (
                <div key={d.device} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-2">
                      <Icon className="h-4 w-4 text-cyan-400" />
                      <span>{d.device}</span>
                    </span>
                    <span className="font-mono font-bold text-slate-200">
                      {d.count} events · {d.percent}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all`}
                      style={{ width: `${Math.max(3, d.percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-Time Live Activity Feed */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>Real-Time Live Visitor Activity Stream (1s Updates)</span>
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            Showing latest {summary.recentFeed.length} events
          </span>
        </div>

        <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/80 border border-slate-800 rounded-lg bg-slate-900/50">
          {summary.recentFeed.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No telemetry events recorded yet in this session. Browse pages or click links to see live events appear here.
            </div>
          ) : (
            summary.recentFeed.map((ev) => (
              <div
                key={ev.eventId}
                className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 text-xs hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-[11px] text-slate-400 shrink-0">
                    {formatEventTime(ev.createdAtMs)}
                  </span>
                  <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 text-[10px] font-mono font-bold text-cyan-300 uppercase shrink-0">
                    {ev.type.replace('_', ' ')}
                  </span>
                  <span className="font-semibold text-white truncate">{ev.label}</span>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    /{ev.page}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300 shrink-0">
                  <span>
                    {ev.flag} {ev.country}
                  </span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300 border border-slate-700">
                    {ev.device}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
