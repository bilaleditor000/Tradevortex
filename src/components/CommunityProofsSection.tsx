import React, { useState, useEffect } from 'react';
import { AdminSettings, CommunityProof } from '../types';
import { getStoredCommunityProofs, PROOFS_EVENT_KEY } from '../data/communityProofsData';
import { getAdminSettings, ADMIN_EVENT_KEY, isSectionVisible } from '../data/adminSettings';
import { playClickSound } from '../utils/sound';
import { trackAnalyticsEvent } from '../data/analyticsStore';
import {
  ShieldCheck,
  Star,
  Send,
  Image as ImageIcon,
  PlayCircle,
  X,
  ZoomIn,
  Award
} from 'lucide-react';

export const CommunityProofsSection: React.FC = () => {
  const [proofs, setProofs] = useState<CommunityProof[]>(() => getStoredCommunityProofs());
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getAdminSettings());
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    const syncProofs = () => setProofs(getStoredCommunityProofs());
    const syncSettings = () => setAdminSettings(getAdminSettings());
    window.addEventListener(PROOFS_EVENT_KEY, syncProofs);
    window.addEventListener(ADMIN_EVENT_KEY, syncSettings);
    return () => {
      window.removeEventListener(PROOFS_EVENT_KEY, syncProofs);
      window.removeEventListener(ADMIN_EVENT_KEY, syncSettings);
    };
  }, []);

  if (
    !adminSettings.showCommunityProofs ||
    !isSectionVisible(adminSettings, 'community-proofs') ||
    proofs.length === 0
  ) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 text-xs font-mono text-emerald-300 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Community Trust & Verified Results</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-cyan-400 shrink-0" />
            <span>Verified Trader Reviews &amp; Winning Proofs</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real feedback, payout milestones, profit screenshots, and community member videos from our global Telegram desk.
          </p>
        </div>

        <a
          href={adminSettings.telegramCommunityUrl || 'https://t.me/tradevortex_vip'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            playClickSound('click');
            trackAnalyticsEvent('telegram_click', 'home', 'Community Proofs Telegram CTA');
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/30 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors whitespace-nowrap shrink-0"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Join Telegram For Live Proofs</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proofs.map((item) => {
          const safeRating = Math.min(5, Math.max(1, Math.round(item.rating || 5)));
          const images = Array.isArray(item.proofImages) ? item.proofImages.filter(Boolean) : [];
          const hasVideo = Boolean(item.videoUrl && item.videoUrl.trim());

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-cyan-500/20 bg-slate-900/75 p-5 shadow-lg hover:border-cyan-500/40 transition-all space-y-4"
            >
              <div className="space-y-3">
                {/* Reviewer Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold font-mono text-sm">
                      {item.reviewerName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-white truncate">
                          {item.reviewerName}
                        </h3>
                        {item.verifiedBadge !== false && (
                          <ShieldCheck
                            className="h-4 w-4 text-emerald-400 shrink-0"
                            aria-label="Verified Community Member"
                          />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {item.countryOrHandle || item.source || 'Telegram Community'}
                      </p>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5 text-amber-400 shrink-0 pt-0.5">
                    {Array.from({ length: safeRating }).map((_, sIdx) => (
                      <Star key={sIdx} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Profit / Result Highlight */}
                {item.profitHighlight && (
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-300">
                    <span>{item.profitHighlight}</span>
                  </div>
                )}

                {/* Caption / Review */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  &ldquo;{item.caption}&rdquo;
                </p>

                {/* Proof Images Gallery (supports 1 or multiple screenshots) */}
                {images.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                      <ImageIcon className="h-3 w-3" />
                      <span>
                        {images.length === 1 ? 'Winning Proof Screenshot' : `${images.length} Proof Screenshots`}
                      </span>
                    </div>
                    <div
                      className={`grid gap-2 ${
                        images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                      }`}
                    >
                      {images.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            playClickSound('click');
                            setLightboxImage(imgUrl);
                          }}
                          className="group relative overflow-hidden rounded-xl border border-slate-700 bg-slate-950 aspect-video focus:outline-none focus:border-cyan-400"
                        >
                          <img
                            src={imgUrl}
                            alt={`${item.reviewerName} trading proof ${idx + 1}`}
                            loading="lazy"
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                            <ZoomIn className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional Testimonial / Profit Video */}
                {hasVideo && item.videoUrl && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                      <PlayCircle className="h-3 w-3" />
                      <span>Verified Video Proof</span>
                    </div>
                    <video
                      src={item.videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 max-h-56"
                    />
                  </div>
                )}
              </div>

              {/* Footer Meta */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                <span>{item.source || 'Telegram VIP Desk'}</span>
                <span>{item.dateLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-Size Screenshot Lightbox */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Proof Screenshot Preview"
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-2xl border border-cyan-500/40 bg-slate-950 p-3 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              aria-label="Close image preview"
              className="absolute right-4 top-4 z-10 rounded-full bg-slate-900/90 border border-slate-700 p-2 text-slate-200 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={lightboxImage}
              alt="Enlarged trading proof"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};
