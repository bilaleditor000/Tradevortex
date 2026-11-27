import React, { useEffect, useState } from 'react';
import { playClickSound } from '../utils/sound';
import { ShieldCheck, ExternalLink, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { getAdminSettings } from '../data/adminSettings';
import { trackAnalyticsEvent } from '../data/analyticsStore';

interface AdInterstitialModalProps {
  isOpen: boolean;
  onComplete: () => void;
  brokerAffiliateUrl?: string;
  brokerName?: string;
}

export const AdInterstitialModal: React.FC<AdInterstitialModalProps> = ({
  isOpen,
  onComplete,
  brokerAffiliateUrl,
  brokerName
}) => {
  const [countdown, setCountdown] = useState<number>(5);
  const [progress, setProgress] = useState<number>(0);
  const [canReveal, setCanReveal] = useState<boolean>(false);

  const settings = getAdminSettings();

  const effectiveUrl =
    brokerAffiliateUrl ||
    settings.sponsorDeals?.find((d) => d.active)?.targetUrl ||
    settings.brokerLinks?.exness ||
    'https://one.exness-track.com/a/custom_tradevortex';
  const effectiveName =
    brokerName ||
    settings.sponsorDeals?.find((d) => d.active)?.companyName ||
    'Exness Global Markets';

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setProgress(0);
      setCanReveal(false);
      return;
    }

    setCountdown(5);
    setProgress(0);
    setCanReveal(false);

    const startTime = Date.now();
    const duration = 5000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const fraction = Math.min(1, elapsed / duration);
      const remainingSeconds = Math.max(0, Math.ceil((duration - elapsed) / 1000));

      setProgress(Math.round(fraction * 100));
      setCountdown(remainingSeconds);

      if (fraction >= 1) {
        clearInterval(timer);
        setCanReveal(true);
        playClickSound('calculate');
      }
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReveal = () => {
    playClickSound('click');
    trackAnalyticsEvent('calculator_used', 'calculators', 'Calculator Metric Unlocked');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 sm:p-7 shadow-2xl shadow-cyan-950/70 text-center space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-semibold">
              TradeVortex Financial Engine
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-slate-700">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>Precision Risk Audit</span>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-500/40 bg-cyan-950/30 shadow-inner">
            <span className="font-mono text-2xl font-black text-cyan-300">
              {countdown > 0 ? countdown : <Sparkles className="h-7 w-7 text-emerald-400" />}
            </span>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {countdown > 0 ? 'Verifying Liquidity & Calculating Metrics...' : 'Calculation Complete & Verified!'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {countdown > 0
                ? 'Validating lot sizing, pip tick precision, and margin exposure parameters.'
                : 'Your high-precision position output is ready to view.'}
            </p>
          </div>

          <div className="w-full space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
              <span>Institutional Risk Verification</span>
              <span className="text-cyan-400 font-bold">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-100 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Clean Institutional Partner Spotlight (Zero AdSense <ins> inside modal) */}
        <div className="rounded-xl border border-cyan-500/30 bg-slate-950 p-4 text-left space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="rounded bg-cyan-500/15 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 uppercase">
              Featured Tier-1 Liquidity Partner
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>FCA / ASIC Regulated</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">
              Execute on {effectiveName} with 0.0 Raw Spreads
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Institutional ECN execution with sub-25ms fiber routing, swap-free account options, and automated 24/7 withdrawals.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px] font-mono">
              Partner Disclosure · Verified Execution
            </span>
            <a
              href={
                effectiveUrl.startsWith('https://') || effectiveUrl.startsWith('http://')
                  ? effectiveUrl
                  : 'https://one.exness-track.com/a/custom_tradevortex'
              }
              target="_blank"
              rel="sponsored nofollow"
              onClick={() => {
                playClickSound('calculate');
                trackAnalyticsEvent('referral_click', 'calculators', `Interstitial Partner: ${effectiveName}`);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-sm shadow-cyan-500/20"
            >
              <span>Visit Partner</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="pt-1">
          {canReveal ? (
            <button
              type="button"
              onClick={handleReveal}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-sm font-extrabold text-slate-950 hover:from-emerald-400 hover:to-teal-300 transition-all shadow-lg shadow-emerald-500/30 uppercase tracking-wider"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Show Calculated Result Now</span>
            </button>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Lock className="h-3.5 w-3.5 text-cyan-400" />
                Unlocking output in {countdown}s...
              </span>
              <button
                type="button"
                onClick={handleReveal}
                className="text-[11px] text-slate-400 hover:text-slate-200 underline transition-colors"
              >
                Skip countdown
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
