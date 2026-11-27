import React from 'react';
import { Broker } from '../types';
import { playClickSound } from '../utils/sound';
import { X, ExternalLink, Star, CheckCircle, AlertTriangle, Shield, CreditCard } from 'lucide-react';

interface BrokerDetailModalProps {
  broker: Broker | null;
  onClose: () => void;
}

export const BrokerDetailModal: React.FC<BrokerDetailModalProps> = ({ broker, onClose }) => {
  if (!broker) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/40 my-8">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 font-bold text-cyan-400 text-lg">
              {broker.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{broker.name}</h3>
                {broker.badge && (
                  <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 font-mono">
                    {broker.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <div className="flex items-center text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="ml-1 font-bold font-mono text-slate-200">{broker.rating}</span>
                </div>
                <span>·</span>
                <span>{broker.reviewCount.toLocaleString()} Verified Reviews</span>
                <span>·</span>
                <span className="text-cyan-400">{broker.category}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              onClose();
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-2">
          {/* Summary description */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {broker.description}
          </p>

          {/* Quick specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">Min Deposit</span>
              <span className="font-mono text-sm font-bold text-white">{broker.minDeposit}</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">Max Leverage</span>
              <span className="font-mono text-sm font-bold text-white">{broker.maxLeverage}</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">Spreads From</span>
              <span className="font-mono text-sm font-bold text-cyan-300">{broker.spreadFrom}</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">
                {broker.payoutRate ? 'Max Payout' : 'Category'}
              </span>
              <span className="font-mono text-sm font-bold text-emerald-300">
                {broker.payoutRate || broker.category}
              </span>
            </div>
          </div>

          {/* Regulations & Licenses */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Regulatory Oversight & Licenses
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {broker.regulation.map((reg) => (
                <span
                  key={reg}
                  className="rounded-md border border-cyan-500/30 bg-cyan-950/30 px-2.5 py-1 text-xs font-medium text-cyan-300"
                >
                  {reg}
                </span>
              ))}
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2.5 font-mono flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                Key Advantages
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {broker.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-4">
              <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2.5 font-mono flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Considerations
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {broker.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-cyan-400" />
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Accepted Deposit & Withdrawal Methods
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
              {broker.depositMethods.map((m) => (
                <span
                  key={m}
                  className="rounded bg-slate-800/80 px-2.5 py-1 text-slate-300 border border-slate-700/60"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-5">
          <span className="text-[11px] text-slate-400">
            Official partner tracking link
          </span>
          <a
            href={broker.affiliateUrl}
            target="_blank"
            rel="sponsored nofollow"
            onClick={() => playClickSound('calculate')}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25 uppercase tracking-wide"
          >
            <span>Trade on {broker.name}</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
