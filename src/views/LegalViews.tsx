import React from 'react';
import { ShieldAlert, FileText, Lock, AlertTriangle } from 'lucide-react';
import { getAdminSettings } from '../data/adminSettings';

export const PrivacyView: React.FC = () => {
  const settings = getAdminSettings();
  const contactEmail = settings.supportEmail || 'support@tradevortex.com';

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase mb-1">
          <Lock className="h-4 w-4" />
          Privacy Policy
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Privacy Policy &amp; Google AdSense Cookie Notice
        </h1>
        <p className="text-slate-400 text-xs mt-1">Last Updated: November 2026 · GDPR, CCPA &amp; Google Publisher Policies</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
        <p>
          TradeVortex (tradevortex.com) is built with privacy-first principles. We do not require visitors to create an account or submit personal financial credentials to access our trading calculators, market charts, or educational guides.
        </p>
        <p>
          When you visit TradeVortex, standard server analytics may record non-personally-identifying technical metrics such as browser type, device category, language preference, referring URLs, and country-level region. If you voluntarily submit an inquiry via our Contact Us form, we collect your name and email address solely to respond to your message.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">2. Google AdSense, DoubleClick DART Cookie &amp; Advertising Partners</h2>
        <p>
          TradeVortex uses Google AdSense and third-party advertising partners to fund our free institutional tools. Third-party vendors, including Google, use cookies (such as the DoubleClick DART cookie) to serve advertisements based on a user&apos;s prior visits to TradeVortex or other websites across the Internet.
        </p>
        <p>
          Google&apos;s use of advertising cookies enables it and its partners to serve personalized ads based on your browsing history. Users may opt out of personalized advertising at any time by visiting{' '}
          <a
            href="https://adssettings.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline font-semibold"
          >
            Google Ads Settings
          </a>{' '}
          or by visiting{' '}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline font-semibold"
          >
            www.aboutads.info
          </a>{' '}
          to opt out of third-party vendor cookies for personalized advertising.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">3. Local Storage, Essential Cookies &amp; Affiliate Links</h2>
        <p>
          We utilize browser local storage to save your Light/Dark theme selection, click sound toggle, and preferred language. Outbound partner broker links (marked with <code className="text-cyan-300 font-mono">rel=&quot;sponsored nofollow&quot;</code>) may use referral tracking cookies set by the destination broker to attribute referrals at zero cost to you.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">4. Your Privacy Rights (GDPR &amp; CCPA)</h2>
        <p>
          Under the European Union General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), you have the right to request access to, correction of, or deletion of any personal inquiry data, and to opt out of non-essential analytics or advertising cookies via the Cookie Settings panel in our footer or by contacting <span className="text-cyan-300 font-mono">{contactEmail}</span>.
        </p>
      </section>
    </div>
  );
};

export const TermsView: React.FC = () => (
  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
    <div className="border-b border-slate-800 pb-4">
      <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase mb-1">
        <FileText className="h-4 w-4" />
        Terms &amp; Conditions
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
        Terms &amp; Conditions &amp; User Agreement
      </h1>
      <p className="text-slate-400 text-xs mt-1">Effective Date: November 2026</p>
    </div>

    <section className="space-y-3">
      <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
      <p>
        By accessing or using TradeVortex (tradevortex.com) and any associated web applications, calculators, charts, or editorial materials, you agree to comply with and be bound by these Terms &amp; Conditions. If you do not accept these terms, please discontinue use of the website.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-base font-bold text-white">2. Educational &amp; Informational Purpose Only</h2>
      <p>
        All calculations, TradingView charts, economic calendar data, articles, and broker comparisons published on TradeVortex are provided strictly for educational and informational purposes. TradeVortex is not a registered broker-dealer, financial advisor, or portfolio manager and does not offer personalized investment recommendations.
      </p>
      <p>
        Trading foreign exchange (Forex), contracts for difference (CFDs), commodities, indices, and digital options carries substantial risk of capital loss. Any trading or account registration decision is undertaken entirely at your own discretion.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-base font-bold text-white">3. Calculation Tool Accuracy</h2>
      <p>
        While TradeVortex engineers mathematical calculation tools and third-party market widgets for high precision, exchange rates, broker pip values, margin requirements, and swap schedules vary by liquidity provider. Always confirm final order parameters directly inside your regulated broker terminal prior to live execution.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-base font-bold text-white">4. Intellectual Property</h2>
      <p>
        All original articles, calculator workflows, UI layouts, trademarks, and codebase assets on TradeVortex are protected under applicable intellectual property laws. Automated scraping or commercial redistribution without written authorization is prohibited.
      </p>
    </section>
  </div>
);

export const RiskDisclaimerView: React.FC = () => (
  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
    <div className="border-b border-slate-800 pb-4">
      <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase mb-1">
        <ShieldAlert className="h-4 w-4" />
        Regulatory Risk &amp; Affiliate Disclosure
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
        Risk Disclaimer &amp; Affiliate Disclosure
      </h1>
      <p className="text-slate-400 text-xs mt-1">CFTC, FCA, ESMA, ASIC &amp; FTC (16 CFR § 255) Compliance</p>
    </div>

    <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-3">
      <h2 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
        HIGH RISK INVESTMENT WARNING: 70% TO 89% OF RETAIL INVESTOR ACCOUNTS LOSE MONEY WHEN TRADING CFDS
      </h2>
      <p className="text-slate-200">
        Trading leveraged financial instruments—including Foreign Exchange (Forex), Contracts for Difference (CFDs), Commodities, Stock Market Indices, Cryptocurrencies, and Digital Options—carries a high level of risk and may not be suitable for all investors. Leverage can magnify both gains and losses rapidly.
      </p>
    </div>

    <section className="space-y-3">
      <h2 className="text-base font-bold text-white">1. Leverage, Volatility &amp; No Profit Guarantees</h2>
      <p>
        Marginal trading allows you to control large notional exposure with a fraction of total contract value. Adverse price gaps or high-impact macro releases (CPI, NFP, FOMC) can cause losses exceeding expectations. TradeVortex never promises guaranteed profits or risk-free trading systems; historical performance does not guarantee future results.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-base font-bold text-white">2. Independent Financial Suitability</h2>
      <p>
        Never risk capital you cannot afford to lose, such as emergency reserves, household living funds, or borrowed money. Seek independent advice from a licensed financial professional if you are uncertain about any leveraged product.
      </p>
    </section>

    <section className="space-y-3 border-t border-slate-800 pt-5">
      <h2 className="text-base font-bold text-white">3. Affiliate Disclosure &amp; Broker Transparency</h2>
      <p>
        To keep our 11 professional trading calculators, market intelligence tools, and educational guides 100% free, TradeVortex participates in partner affiliate programs with select regulated brokerage firms. Links marked &quot;Start Trading&quot; or &quot;Visit Partner&quot; use <code className="text-cyan-300 font-mono">rel=&quot;sponsored nofollow&quot;</code>, and TradeVortex may earn a referral commission if you open an account—at zero additional cost to you.
      </p>
      <p>
        Our editorial ratings, spread reviews, and regulatory license checks remain strictly independent of partner commissions.
      </p>
    </section>
  </div>
);

export const AffiliateDisclosureView: React.FC = () => (
  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
    <div className="border-b border-slate-800 pb-4">
      <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase mb-1">
        <AlertTriangle className="h-4 w-4" />
        FTC Compliance
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
        Affiliate Marketing Disclosure
      </h1>
      <p className="text-slate-400 text-xs mt-1">Federal Trade Commission (16 CFR § 255) Compliance</p>
    </div>

    <section className="space-y-3">
      <h2 className="text-base font-bold text-white">1. Full Transparency Regarding Affiliate Partnerships</h2>
      <p>
        TradeVortex is an independently operated financial education and software portal. To provide our suite of professional lot size calculators, pip calculators, real-time TradingView charting terminals, and in-depth educational guides 100% free of charge to all users, we partner with selected regulated brokerage firms through affiliate referral programs.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-base font-bold text-white">2. How Affiliate Links Work</h2>
      <p>
        When you click external links on TradeVortex labeled &quot;Start Trading&quot;, &quot;Visit Partner&quot;, or similar call-to-action buttons (appropriately tagged with rel=&quot;sponsored nofollow&quot;), you may be redirected to a partner broker&apos;s website. If you register an account and fund that account, TradeVortex may receive a referral commission from the broker.
      </p>
      <p className="font-semibold text-cyan-300">
        This affiliate commission comes at ZERO additional cost to you.
      </p>
      <p>
        Your trading spreads, commissions, deposit conditions, and withdrawal rights remain identical (or eligible for partner fee rebates) whether you register through our link or directly through the broker&apos;s homepage.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-base font-bold text-white">3. Editorial Integrity Guarantee</h2>
      <p>
        Our reviews, comparison rankings, pros/cons, and technical assessments are never influenced by affiliate remuneration. If a broker suffers regulatory enforcement actions, widens spreads excessively, or delays client withdrawals, their rating on TradeVortex is penalized or removed from our directory immediately.
      </p>
    </section>
  </div>
);
