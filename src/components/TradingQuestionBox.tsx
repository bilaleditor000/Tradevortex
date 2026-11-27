import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { playClickSound } from '../utils/sound';
import { HelpCircle, Send, CheckCircle2, BookOpen, Calculator, Quote } from 'lucide-react';

interface TradingQuestionBoxProps {
  language?: Language;
}

interface StructuredAnswer {
  topic: string;
  summary: string;
  formulaOrRule: string;
  example: string;
  traderWisdom: string;
}

const QUICK_TOPICS: { label: string; query: string }[] = [
  { label: 'How much capital to start?', query: 'How much capital should a beginner start trading with?' },
  { label: 'How P&L works?', query: 'How is profit and loss calculated in Forex and Crypto?' },
  { label: '1% Risk Rule', query: 'Why is the 1% risk rule so important?' },
  { label: 'Lot size & Pips', query: 'How do lot size and stop loss pips work together?' },
  { label: 'Leverage & Liquidation', query: 'How does leverage affect liquidation risk?' },
  { label: 'Best Quote for Discipline', query: 'What is the best risk advice from top traders?' }
];

function generateStructuredAnswer(questionRaw: string): StructuredAnswer {
  const q = questionRaw.toLowerCase();

  if (
    q.includes('p&l') ||
    q.includes('pnl') ||
    q.includes('profit') ||
    q.includes('loss') ||
    q.includes('calculate') ||
    q.includes('نفع') ||
    q.includes('منافع') ||
    q.includes('ربح') ||
    q.includes('لاگت')
  ) {
    return {
      topic: 'Profit & Loss (P&L) & Position Math',
      summary:
        'Profit or Loss is determined by the price movement between your Entry and Exit multiplied by your Position Size (Contracts or Lots), minus broker spread or exchange fees. Because brokers quote in USD, you can multiply USD P&L by your live local FX rate (PKR, SAR, AED, INR, MYR) to know the exact domestic impact.',
      formulaOrRule:
        'Net P&L = [(Exit Price − Entry Price) × Units] − Trading Fees | Risk-Reward Ratio = Target Gain ÷ Stop Loss Risk',
      example:
        'Example: Buying 0.10 Lots of EUR/USD ($1/pip) and capturing +45 pips produces +$45.00 USD (≈ PKR 12,532 or SAR 168.75).',
      traderWisdom:
        '“It is not whether you are right or wrong that is important, but how much money you make when you are right and how much you lose when you are wrong.” — George Soros'
    };
  }

  if (
    q.includes('lot') ||
    q.includes('pip') ||
    q.includes('size') ||
    q.includes('لاٹ') ||
    q.includes('حجم')
  ) {
    return {
      topic: 'Dynamic Lot Sizing & Pip Value',
      summary:
        'Never trade a fixed lot size on every chart setup. Your lot size should shrink when your Stop Loss distance is wide and grow only when your Stop Loss is tight—keeping your dollar risk identical on every trade.',
      formulaOrRule:
        'Standard Lots = (Account Balance × Risk %) ÷ (Stop Loss Pips × Pip Value per Standard Lot)',
      example:
        'Example: With a $1,000 account and 1% risk ($10), if your Stop Loss is 25 pips on EUR/USD ($10/pip per standard lot), your exact volume is $10 ÷ (25 × $10) = 0.04 Lots (4 Micro Lots).',
      traderWisdom:
        '“The most important rule of trading is to play great defense, not great offense.” — Paul Tudor Jones'
    };
  }

  if (
    q.includes('leverage') ||
    q.includes('margin') ||
    q.includes('liquidat') ||
    q.includes('لیوریج') ||
    q.includes('مارجن')
  ) {
    return {
      topic: 'Leverage, Margin & Liquidation Safety',
      summary:
        'High leverage reduces the margin collateral required to open a trade, but it also compresses the distance to forced liquidation. A 1% adverse move at 100x leverage wipes 100% of isolated margin collateral.',
      formulaOrRule:
        'Approximate Isolated Liquidation Distance (%) ≈ (100 ÷ Leverage) − Maintenance Margin Rate',
      example:
        'Example: At 20x leverage on BTC/USDT ($68,000 entry), liquidation sits roughly 4.5% away (~$64,940). Always place your Stop Loss well before liquidation.',
      traderWisdom:
        '“There are old traders and there are bold traders, but there are very few old, bold traders.” — Ed Seykota'
    };
  }

  if (
    q.includes('capital') ||
    q.includes('begin') ||
    q.includes('start') ||
    q.includes('deposit') ||
    q.includes('شروع') ||
    q.includes('بداية') ||
    q.includes('پیل')
  ) {
    return {
      topic: 'Beginner Roadmap & Starting Capital',
      summary:
        'Start in a $10,000 virtual demo simulator until you log at least 30 disciplined trades with positive expectancy. When moving to real markets, start with a modest $10–$100 regulated micro account and risk strictly 1% ($0.10–$1.00) per trade using 0.01 micro lots.',
      formulaOrRule:
        'Phase 1: Demo Mastery -> Phase 2: 0.01 Micro Lots ($10–$100 live) -> Phase 3: Scale only after 90 days of audited journal data.',
      example:
        'Example: Starting with $50 at 1% risk allows 50 cents risk per trade—meaning even 10 losses in a row costs only $5 while building real execution psychology.',
      traderWisdom:
        '“Losers average losers. Respect risk first and profits will take care of themselves.” — Paul Tudor Jones'
    };
  }

  if (
    q.includes('quote') ||
    q.includes('advice') ||
    q.includes('psych') ||
    q.includes('mind') ||
    q.includes('discipline') ||
    q.includes('نصیحت')
  ) {
    return {
      topic: 'Institutional Trading Psychology & Legendary Advice',
      summary:
        'Consistently profitable traders think in probabilities over a 20-trade sample rather than reacting emotionally to a single win or loss. Acceptance of predefined risk eliminates hesitation and revenge trading.',
      formulaOrRule:
        'Think in Samples of 20+ Trades: Never move a Stop Loss wider after entry; pre-define Exit before clicking Buy/Sell.',
      example:
        'Example: A strategy with just a 40% win rate and a 1:3 Risk-Reward ratio yields +0.60R profit per trade over 100 trades.',
      traderWisdom:
        '“When you genuinely accept the risks, you will be at peace with any outcome.” — Mark Douglas'
    };
  }

  return {
    topic: 'Complete Risk & Trade Execution Guidance',
    summary:
      'Every high-probability trade starts with four numbers before execution: (1) Account Equity, (2) Maximum Risk % (1%–2%), (3) Technical Invalidation Stop Loss, and (4) Minimum 1:2 Take Profit target. Convert your USD risk into your local currency before placing the order so emotions never override your plan.',
    formulaOrRule:
      'Expectancy = (Win Rate × Average Win) − (Loss Rate × Average Loss) | Golden Rule: Risk ≤ 1%–2% per setup.',
    example:
      'Example: On Gold (XAU/USD) at $2,650 with a $10 Stop Loss ($2,640) and $20 Take Profit ($2,670), risking $20 requires 0.02 Lots to target +$40 (1:2 R:R).',
    traderWisdom:
      '“The elements of good trading are: (1) cutting losses, (2) cutting losses, and (3) cutting losses.” — Ed Seykota'
  };
}

export const TradingQuestionBox: React.FC<TradingQuestionBoxProps> = ({ language = 'en' }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [question, setQuestion] = useState('');
  const [askedQuestion, setAskedQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<StructuredAnswer | null>(() =>
    generateStructuredAnswer('How profit and loss works')
  );

  const handleAsk = (e?: React.FormEvent, presetQuery?: string) => {
    if (e) e.preventDefault();
    const target = (presetQuery ?? question).trim();
    if (!target) return;
    playClickSound('calculate');
    setAskedQuestion(target);
    if (presetQuery) setQuestion(presetQuery);
    setAnswer(generateStructuredAnswer(target));
  };

  return (
    <section className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-5 sm:p-7 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shrink-0">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {t.askQuestionTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ask about lot sizes, local currency P&L, leverage, stop losses, or beginner risk rules for an immediate structured explanation.
            </p>
          </div>
        </div>
      </div>

      {/* Quick topic buttons */}
      <div className="flex flex-wrap gap-2">
        {QUICK_TOPICS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleAsk(undefined, item.query)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Question Input + Answer Button */}
      <form onSubmit={(e) => handleAsk(e)} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.askQuestionPlaceholder}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-3 text-xs sm:text-sm font-extrabold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-md shadow-cyan-500/25 uppercase tracking-wider shrink-0"
        >
          <Send className="h-4 w-4" />
          <span>{t.answerBtn}</span>
        </button>
      </form>

      {/* Structured Answer Output */}
      {answer && (
        <div className="rounded-xl border border-cyan-500/25 bg-slate-950/90 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{answer.topic}</span>
            </div>
            {askedQuestion && (
              <span className="text-[11px] font-mono text-slate-400">
                Q: “{askedQuestion}”
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {answer.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 space-y-1">
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-cyan-400">
                <Calculator className="h-3.5 w-3.5" /> Key Formula / Rule
              </span>
              <p className="text-xs font-mono text-slate-200 leading-relaxed">
                {answer.formulaOrRule}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 space-y-1">
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-emerald-400">
                <BookOpen className="h-3.5 w-3.5" /> Practical Example
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {answer.example}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-amber-500/20 bg-amber-950/15 px-4 py-3 flex items-start gap-2.5">
            <Quote className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs italic text-amber-200 leading-relaxed">
              {answer.traderWisdom}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
