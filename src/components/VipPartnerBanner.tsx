import React from 'react';
import { AdminSettings } from '../types';
import { DEFAULT_VIP_PARTNER_BANNER, isSectionVisible } from '../data/adminSettings';
import { playClickSound } from '../utils/sound';
import { trackAnalyticsEvent } from '../data/analyticsStore';
import { Award, CheckCircle2, Send, ShieldCheck } from 'lucide-react';

interface VipPartnerBannerProps {
  adminSettings: AdminSettings;
  pageName?: string;
}

export const VipPartnerBanner: React.FC<VipPartnerBannerProps> = ({
  adminSettings,
  pageName = 'home'
}) => {
  const banner = adminSettings.vipPartnerBanner || DEFAULT_VIP_PARTNER_BANNER;

  if (!banner.enabled || !isSectionVisible(adminSettings, 'vip-partner-banner')) {
    return null;
  }

  const telegramUrl = adminSettings.telegramCommunityUrl || 'https://t.me/tradevortex_vip';

  return (
    <div className="rounded-2xl border border-cyan-500/35 bg-gradient-to-r from-slate-900 via-cyan-950/35 to-slate-900 p-5 sm:p-6 shadow-lg mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2.5 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-0.5 text-[11px] font-mono font-bold text-cyan-300 uppercase">
            <Award className="h-3.5 w-3.5 text-cyan-400" />
            <span>{banner.badge}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            {banner.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {banner.subtitle}
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
            {(banner.benefits || []).map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
          <a
            href={
              telegramUrl.startsWith('https://') || telegramUrl.startsWith('http://')
                ? telegramUrl
                : 'https://t.me/tradevortex_vip'
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              playClickSound('calculate');
              trackAnalyticsEvent('telegram_click', pageName, 'VIP Partner Banner CTA');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 text-xs font-extrabold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-md shadow-cyan-500/25 whitespace-nowrap"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{banner.ctaLabel || 'Join VIP Desk'}</span>
          </a>
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Verified Partner Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};
