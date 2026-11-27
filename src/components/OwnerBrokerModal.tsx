import React, { useState } from 'react';
import { Broker } from '../types';
import { playClickSound } from '../utils/sound';
import { X, Plus, ShieldCheck, RefreshCw } from 'lucide-react';

interface OwnerBrokerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBroker: (broker: Broker) => void;
  onResetBrokers: () => void;
}

export const OwnerBrokerModal: React.FC<OwnerBrokerModalProps> = ({
  isOpen,
  onClose,
  onAddBroker,
  onResetBrokers
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Broker['category']>('Forex');
  const [rating, setRating] = useState<number>(4.8);
  const [minDeposit, setMinDeposit] = useState('$10');
  const [maxLeverage, setMaxLeverage] = useState('1:500');
  const [spreadFrom, setSpreadFrom] = useState('0.1 pips');
  const [regulation, setRegulation] = useState('ASIC, FCA, CySEC');
  const [platforms, setPlatforms] = useState('MT4, MT5, Web');
  const [affiliateUrl, setAffiliateUrl] = useState('https://');
  const [badge, setBadge] = useState('Featured Partner');
  const [pros, setPros] = useState('Raw 0.0 spreads\nInstant withdrawals\nZero deposit fees');
  const [cons, setCons] = useState('Not available in USA\nCard fee on small amounts');
  const [description, setDescription] = useState('Leading regulated broker with institutional grade execution.');
  const [depositMethods, setDepositMethods] = useState('USDT, Credit Card, Bank Wire, Skrill');
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    playClickSound('calculate');

    const newBroker: Broker = {
      id: `broker_${Date.now()}`,
      name: name.trim(),
      logo: '',
      rating: parseFloat(rating.toString()) || 4.5,
      reviewCount: Math.floor(Math.random() * 2000) + 500,
      minDeposit: minDeposit.trim(),
      maxLeverage: maxLeverage.trim(),
      spreadFrom: spreadFrom.trim(),
      regulation: regulation.split(',').map((s) => s.trim()).filter(Boolean),
      platforms: platforms.split(',').map((s) => s.trim()).filter(Boolean),
      category: category,
      affiliateUrl: affiliateUrl.trim() || '#',
      badge: badge.trim() || undefined,
      description: description.trim(),
      pros: pros.split('\n').map((s) => s.trim()).filter(Boolean),
      cons: cons.split('\n').map((s) => s.trim()).filter(Boolean),
      depositMethods: depositMethods.split(',').map((s) => s.trim()).filter(Boolean)
    };

    onAddBroker(newBroker);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/40 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">
              Owner Panel – Add New Broker Listing
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound('click');
              onClose();
            }}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Broker Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vantage FX"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Broker['category'])}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Forex">Forex</option>
                <option value="Multi-Asset">Multi-Asset</option>
                <option value="Digital Options">Digital Options</option>
                <option value="Crypto">Crypto</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Rating (1 - 5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value) || 4.5)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Min Deposit
              </label>
              <input
                type="text"
                placeholder="$10"
                value={minDeposit}
                onChange={(e) => setMinDeposit(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Max Leverage
              </label>
              <input
                type="text"
                placeholder="1:500"
                value={maxLeverage}
                onChange={(e) => setMaxLeverage(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Spreads From
              </label>
              <input
                type="text"
                placeholder="0.0 pips"
                value={spreadFrom}
                onChange={(e) => setSpreadFrom(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Best ECN Spreads"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Affiliate Tracking URL * (will have rel=&quot;sponsored nofollow&quot;)
            </label>
            <input
              type="url"
              required
              placeholder="https://broker.com/?partner=YOUR_ID"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Regulators (comma-separated)
              </label>
              <input
                type="text"
                value={regulation}
                onChange={(e) => setRegulation(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Trading Platforms (comma-separated)
              </label>
              <input
                type="text"
                value={platforms}
                onChange={(e) => setPlatforms(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-emerald-400 mb-1">
                Key Pros (one per line)
              </label>
              <textarea
                rows={3}
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-rose-400 mb-1">
                Key Cons (one per line)
              </label>
              <textarea
                rows={3}
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Deposit & Funding Methods (comma-separated)
            </label>
            <input
              type="text"
              value={depositMethods}
              onChange={(e) => setDepositMethods(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {confirmReset ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-amber-300">Reset all?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetBrokers();
                    setConfirmReset(false);
                    onClose();
                  }}
                  className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] hover:bg-rose-500/40 font-bold"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] hover:bg-slate-700"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reset to Defaults
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
              >
                <Plus className="h-4 w-4" />
                Add Broker Listing
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
