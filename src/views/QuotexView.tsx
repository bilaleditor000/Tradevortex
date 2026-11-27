import React, { useState, useEffect } from 'react';
import { playClickSound } from '../utils/sound';
import { getAdminSettings, ADMIN_EVENT_KEY } from '../data/adminSettings';
import { CustomBlocksRenderer } from '../components/CustomBlocksRenderer';
import {
  ShieldAlert,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Zap,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Clock,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const QuotexView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [quotexAffiliateUrl, setQuotexAffiliateUrl] = useState<string>(() => {
    return getAdminSettings().brokerLinks?.quotex || 'https://broker-qx.pro/sign-up/?lid=tradevortex';
  });

  useEffect(() => {
    const sync = () => {
      setQuotexAffiliateUrl(
        getAdminSettings().brokerLinks?.quotex || 'https://broker-qx.pro/sign-up/?lid=tradevortex'
      );
    };
    window.addEventListener(ADMIN_EVENT_KEY, sync);
    return () => window.removeEventListener(ADMIN_EVENT_KEY, sync);
  }, []);

  const faqs = [
    {
      q: 'Is the $10,000 Quotex demo account completely free?',
      a: 'Yes. Quotex provisions a virtual $10,000 practice balance that can be renewed at any time directly inside the terminal without requiring identity verification or bank card information.'
    },
    {
      q: 'What is the minimum deposit and minimum trade size?',
      a: 'The minimum initial account deposit is $10 USD (or equivalent in supported cryptocurrencies and local currencies). The minimum trade position size is just $1 USD.'
    },
    {
      q: 'How fast are crypto withdrawals processed on Quotex?',
      a: 'Cryptocurrency withdrawals (USDT TRC20, Bitcoin, Binance Pay) are typically processed automatically within 1 to 24 hours, depending on network confirmations, with zero platform withdrawal fees.'
    },
    {
      q: 'Can profits be guaranteed when trading digital contracts?',
      a: 'No. There is no such thing as guaranteed profit in financial trading. Digital contracts carry significant financial risk: if your market prediction is incorrect at contract expiration, you lose 100% of the invested trade amount.'
    }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <CustomBlocksRenderer page="quotex" />

      {/* Hero Header */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950 p-6 sm:p-10 shadow-2xl shadow-cyan-950/30 text-center space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/50 px-4 py-1 text-xs font-mono text-cyan-300">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Independent Platform Review & Walkthrough · Ad-Free</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Quotex Platform Review & <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">
            Complete Beginner’s Guide
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An objective, in-depth evaluation of Quotex: explore the $10,000 renewable demo simulator, minimum deposit terms, payout percentages, available assets, and risk considerations.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={quotexAffiliateUrl}
            target="_blank"
            rel="sponsored nofollow"
            onClick={() => playClickSound('calculate')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-7 py-3 text-sm font-bold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-lg shadow-cyan-500/30 uppercase tracking-wide"
          >
            <span>Open Free $10,000 Demo Account</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={quotexAffiliateUrl}
            target="_blank"
            rel="sponsored nofollow"
            onClick={() => playClickSound('click')}
            className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-cyan-300 hover:border-cyan-400 hover:text-white transition-all"
          >
            <span>Start Live Trading ($10 Min)</span>
          </a>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
          <div className="rounded-lg bg-slate-950/60 p-3">
            <span className="text-xs text-slate-400 block mb-0.5">Min Deposit</span>
            <span className="font-mono text-lg font-bold text-cyan-300">$10 USD</span>
          </div>
          <div className="rounded-lg bg-slate-950/60 p-3">
            <span className="text-xs text-slate-400 block mb-0.5">Min Trade</span>
            <span className="font-mono text-lg font-bold text-cyan-300">$1 USD</span>
          </div>
          <div className="rounded-lg bg-slate-950/60 p-3">
            <span className="text-xs text-slate-400 block mb-0.5">Yield Payout</span>
            <span className="font-mono text-lg font-bold text-emerald-400">Up to 98%</span>
          </div>
          <div className="rounded-lg bg-slate-950/60 p-3">
            <span className="text-xs text-slate-400 block mb-0.5">Practice Account</span>
            <span className="font-mono text-lg font-bold text-cyan-300">$10,000 Free</span>
          </div>
        </div>
      </div>

      {/* Visible High-Risk & Regulatory Disclosure */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-5 text-xs text-slate-300 leading-relaxed space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Mandatory High-Risk Notice & Regulatory Facts</span>
        </div>
        <p>
          Digital contracts and fixed-time trades are high-risk financial derivatives. If the market does not close on your predicted side of the strike price at expiration, your entire invested trade amount is forfeited. Never trade with funds you cannot afford to lose. TradeVortex does not provide financial advice, and past market performance is never indicative of future outcomes.
        </p>
        <p className="text-slate-400">
          <strong>Affiliate Disclosure: </strong>
          TradeVortex maintains an affiliate relationship with Quotex. When you register or deposit via links on this page (rel=&quot;sponsored nofollow&quot;), we may receive an affiliate marketing commission at zero extra cost to you.
        </p>
      </div>

      {/* Core Platform Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            Ultra-Fast Web Terminal
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Quotex trading terminal runs smoothly inside any modern browser without requiring cumbersome desktop software installation. Built with responsive sub-millisecond execution engines.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <DollarSign className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            $10,000 Free Practice Simulator
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Test technical strategies, experiment with chart indicators, and build familiarity with price action completely risk-free using a renewable $10,000 virtual balance.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <CreditCard className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            Versatile Payment Gateways
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Fund and withdraw via Tether USDT (TRC-20, ERC-20), Bitcoin, Ethereum, Binance Pay, credit/debit cards, and Perfect Money with zero broker processing fees.
          </p>
        </div>
      </div>

      {/* How Digital Contracts Work (Educational Breakdown) */}
      <div className="rounded-xl border border-cyan-500/20 bg-slate-900/80 p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-cyan-400" />
          How Fixed-Time Trading Works on Quotex
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Unlike traditional CFD trading where profit depends on the number of pips or points price travels, digital contracts feature a fixed outcome based on whether price closes above or below the entry price at expiration:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <span className="font-mono text-cyan-400 font-bold text-sm block mb-1">01. Pick Asset</span>
            <p className="text-xs text-slate-400">
              Select from over 40+ currency pairs, metals, crypto, or synthetic volatility indices.
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <span className="font-mono text-cyan-400 font-bold text-sm block mb-1">02. Set Expiry</span>
            <p className="text-xs text-slate-400">
              Choose your timeframe: 5 seconds, 1 minute, 5 minutes, up to 4 hours.
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <span className="font-mono text-cyan-400 font-bold text-sm block mb-1">03. Enter Stake</span>
            <p className="text-xs text-slate-400">
              Allocate a trade size starting at $1 (never risk more than 1% to 2% of your capital).
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <span className="font-mono text-cyan-400 font-bold text-sm block mb-1">04. Up or Down</span>
            <p className="text-xs text-slate-400">
              Predict whether price will close higher (Call) or lower (Put) at expiry.
            </p>
          </div>
        </div>
      </div>

      {/* Pros & Cons Honest Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-6 space-y-3">
          <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Quotex Advantages
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Instant $10,000 renewable free practice demo account with no registration hurdles.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Accessible low entry point: only $10 minimum deposit and $1 minimum position size.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>High fixed payout rates reaching up to 98% on major currency pairs during peak hours.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Broad support for modern crypto funding (USDT TRC20, Bitcoin, Binance Pay).</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-6 space-y-3">
          <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risks & Limitations
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Fixed time contracts carry all-or-nothing binary risk: incorrect predictions lose 100% of stake.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Does not integrate with traditional MetaTrader 4 / MetaTrader 5 desktop platforms.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Not available to residents of the United States, Canada, and specific restricted jurisdictions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Requires strict personal discipline to avoid rapid over-trading on short timeframes.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Account Verification & Security */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">
            Security, 2FA, and Account Verification (KYC)
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Quotex implements standard Know Your Customer (KYC) procedures for live withdrawals to protect account holders against identity fraud and money laundering. Traders can enable two-factor authentication (2FA via Google Authenticator) in their account profile settings. Practice demo accounts require no documentation.
        </p>
      </div>

      {/* FAQs Accordion */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-cyan-400" />
          Frequently Asked Questions About Quotex
        </h3>
        <div className="space-y-2">
          {faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => {
                    playClickSound('click');
                    setOpenFaq(isOpen ? null : i);
                  }}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span>{f.q}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-cyan-400 shrink-0 ml-2" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 bg-slate-950/40 leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-8 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">
          Ready to Explore Quotex Risk-Free?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Start with a $10,000 renewable virtual practice balance. Zero deposit required to try the platform interface.
        </p>
        <div className="pt-2">
          <a
            href={quotexAffiliateUrl}
            target="_blank"
            rel="sponsored nofollow"
            onClick={() => playClickSound('calculate')}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25 uppercase tracking-wide"
          >
            <span>Launch Free $10,000 Demo</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
