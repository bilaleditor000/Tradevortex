import { FAQItem } from '../types';

export const FAQS_STORAGE_KEY = 'tradevortex_faqs_v2';
export const FAQS_EVENT_KEY = 'tradevortex_faqs_changed';

export const FAQS_DATA: FAQItem[] = [
  {
    id: 'what-is-trading',
    category: 'Trading Basics',
    question: '1. What is financial trading and how do global markets actually work?',
    answer:
      'Financial trading is the active buying and selling of financial instruments—such as foreign currencies (Forex), Gold (XAU/USD), stock indices (NAS100, US30), commodities, and cryptocurrencies—to profit from price movements. Markets operate through a global network of banks, institutional funds, liquidity providers, and electronic exchanges where prices rise when buying demand exceeds selling supply and fall when selling pressure dominates.'
  },
  {
    id: 'risks-involved-in-trading',
    category: 'Risk & Psychology',
    question: '2. What are the real risks involved in trading and why do beginners lose money?',
    answer:
      'Trading carries substantial risk of capital loss due to price volatility, leveraged exposure, unexpected economic news spikes, and emotional decision-making. Most beginners lose money not because the markets are rigged, but because they over-leverage small accounts, trade without a Stop-Loss, risk 10%–30% on a single idea, and chase losses through revenge trading.'
  },
  {
    id: 'how-successful-traders-win',
    category: 'Trading Basics',
    question: '3. How do consistently profitable traders win over the long run?',
    answer:
      'Winning traders treat trading as a probability-based business rather than gambling. They rely on a tested strategy with a positive statistical expectancy, cap every single loss at 1%–2% of equity, target 1:2 or 1:3 Risk-to-Reward setups, execute only A+ setups during liquid sessions, and review every trade in a detailed journal.'
  },
  {
    id: 'top-legendary-traders',
    category: 'Trading Basics',
    question: '4. Who are the top legendary traders in history and what can we learn from them?',
    answer:
      'Iconic traders like Paul Tudor Jones, Stanley Druckenmiller, George Soros, Jesse Livermore, Richard Dennis, and quantitative pioneer Jim Simons built fortunes through extreme discipline and asymmetric risk control. Their universal lesson is identical: cut losers immediately, protect downside first, never average down into a losing leveraged position, and press size only when market structure and macro momentum align.'
  },
  {
    id: 'where-traders-earn-most',
    category: 'Trading Basics',
    question: '5. Which markets and instruments do traders earn the most from?',
    answer:
      'Professional traders focus on deep-liquidity instruments with predictable technical structure and low spreads: EUR/USD and GBP/USD in Forex, Spot Gold (XAU/USD) for high intraday range, US Indices (NAS100, S&P 500, US30) during the New York open, and top Crypto majors (BTC, ETH, SOL). Focusing on 1–3 core pairs yields far higher returns than overtrading dozens of random charts.'
  },
  {
    id: 'trading-psychology-explained',
    category: 'Risk & Psychology',
    question: '6. What is trading psychology and why does it control 80% of your results?',
    answer:
      'Trading psychology refers to managing fear, greed, FOMO (fear of missing out), hesitation, and overconfidence while real money is at risk. Even the best technical strategy fails if fear makes you close winning trades too early or greed convinces you to remove your Stop-Loss. Calm, detached execution is what separates consistent earners from emotional gamblers.'
  },
  {
    id: 'discipline-and-patience',
    category: 'Risk & Psychology',
    question: '7. How do professional traders build unbreakable discipline?',
    answer:
      'They follow a written pre-trade checklist before clicking Buy or Sell, trade fixed session hours (e.g., London or New York overlap), pre-define a maximum daily loss limit (such as 2 losing trades per day), and walk away from screens once that limit or their daily target is hit. Waiting patiently for price to reach key levels is a core edge.'
  },
  {
    id: 'one-percent-risk-rule',
    category: 'Risk & Psychology',
    question: '8. What is the 1%–2% Risk Management Rule and why is it mandatory?',
    answer:
      'The 1%–2% rule states that you should never risk more than 1% to 2% of your total account equity on any single trade. If you have a $1,000 account, your maximum loss if Stop-Loss is hit is $10–$20. Even if you suffer 10 consecutive losses, you still retain 80%–90% of your capital and can recover calmly without panic.'
  },
  {
    id: 'how-leverage-works',
    category: 'Trading Mechanics',
    question: '9. How does leverage work and is high leverage (1:500 or 1:1000) safe?',
    answer:
      'Leverage allows you to control a larger market position using a smaller margin deposit. High broker leverage (like 1:500 or 1:1000) reduces the required margin per trade, which is helpful for small accounts—but only if you calculate your exact lot size using a Stop-Loss. Using high leverage to open oversized lots turns tiny market noise into instant account liquidation.'
  },
  {
    id: 'stop-loss-importance',
    category: 'Risk & Psychology',
    question: '10. Why should every trader use a hard Stop-Loss on every single trade?',
    answer:
      'A hard Stop-Loss is an automated order placed with your broker that exits a trade at a predetermined price if your analysis is wrong. It acts as financial insurance against flash crashes, unexpected central bank announcements, or internet outages—guaranteeing that one bad trade can never wipe out weeks of hard-earned profits.'
  },
  {
    id: 'demo-vs-live-trading',
    category: 'Trading Basics',
    question: '11. Demo trading vs. Live trading: how long should I practice on demo first?',
    answer:
      'Practice on a Demo simulator until you fully master order execution, Stop-Loss placement, lot sizing, and achieve consistent profitability across at least 50–100 logged trades. Afterward, transition to a low-deposit live account ($10–$100 with 0.01 micro lots) so you learn to manage real emotional pressure with minimal financial exposure.'
  },
  {
    id: 'risk-to-reward-ratio',
    category: 'Risk & Psychology',
    question: '12. What is Risk-to-Reward Ratio (R:R) and how can you profit with a 40% win rate?',
    answer:
      'Risk-to-Reward measures how much you stand to lose versus how much you aim to gain. With a 1:3 R:R (risking $50 to make $150), winning just 4 out of 10 trades yields +$600 in gains minus -$300 in losses = +$300 net profit—even though 60% of your trades were losers.'
  },
  {
    id: 'lot-size-calc-usage',
    category: 'Calculators',
    question: '13. How do I use the TradeVortex Forex Lot Size Calculator properly?',
    answer:
      'Enter your account base currency (e.g., USD), your current account balance, and the exact percentage of capital you wish to risk (recommended 1% to 2%). Then enter your Stop-Loss distance in pips and select your currency pair. The calculator immediately outputs the exact standard lots, mini lots, and micro lots so your loss never exceeds your risk cap.'
  },
  {
    id: 'gold-point-calculation',
    category: 'Calculators',
    question: '14. Why does Gold (XAU/USD) move and calculate differently than EUR/USD?',
    answer:
      'Spot Gold is priced per troy ounce, where 1.00 standard lot equals 100 ounces. A $1.00 price move in XAU/USD equals $100 on a 1.00 lot ($1.00 on a 0.01 micro lot). Gold also exhibits much wider daily volatility ($25–$60 per day), so traders must use smaller lot sizes and wider structural Stop-Losses than on EUR/USD.'
  },
  {
    id: 'compound-growth-realism',
    category: 'Calculators',
    question: '15. Is compound growth realistic in live financial trading?',
    answer:
      'Compounding is mathematically powerful when profits are reinvested into larger position sizes over time, but real trading equity curves include losing weeks and drawdowns. Use our Compound & Drawdown Calculator to model realistic 3%–8% monthly targets while keeping risk per trade strictly capped.'
  },
  {
    id: 'broker-regulation-safety',
    category: 'Brokers',
    question: '16. Which broker regulatory authorities offer the highest client fund protection?',
    answer:
      'Tier-1 regulatory authorities enforce segregated bank accounts, negative balance protection, and regular financial audits. Top global regulators include the UK FCA (Financial Conduct Authority), Australian ASIC, Cyprus CySEC, and South African FSCA.'
  },
  {
    id: 'ecn-vs-market-maker',
    category: 'Brokers',
    question: '17. What is the difference between an ECN broker and a Market Maker broker?',
    answer:
      'An ECN (Electronic Communication Network) or STP broker routes your orders directly to Tier-1 bank liquidity pools, offering raw spreads from 0.0 pips plus a transparent per-lot commission. A Market Maker quotes fixed or wider zero-commission spreads and fills orders internally from its own liquidity book.'
  },
  {
    id: 'quotex-ad-free-page',
    category: 'Brokers',
    question: '18. What is Quotex and how do digital contracts differ from traditional Forex CFDs?',
    answer:
      'Quotex is a web-based digital contracts platform offering fixed payouts (up to 98%) over short time expiries starting from a $10 minimum deposit and $1 minimum trade. Unlike traditional MT4/MT5 CFDs where profit grows with pip distance, digital contracts settle with a predetermined fixed return based on directional expiry above or below entry.'
  },
  {
    id: 'margin-call-stop-out',
    category: 'Trading Mechanics',
    question: '19. What triggers a Margin Call vs. a Stop-Out in a trading account?',
    answer:
      'A Margin Call warns you when Margin Level falls near 100%, meaning your free margin is exhausted. A Stop-Out occurs when Margin Level drops to the broker liquidation threshold (typically 20%–50%), prompting automatic closure of open losing trades to protect against a negative balance.'
  },
  {
    id: 'slippage-explanation',
    category: 'Trading Mechanics',
    question: '20. What causes slippage and how do experienced traders minimize it?',
    answer:
      'Slippage happens when an order executes at a slightly different price than requested during sudden volatility gaps (like NFP, CPI, or FOMC releases) or thin midnight liquidity. Traders minimize slippage by avoiding entries right before major news releases and choosing fast NY4/LD4 ECN brokers.'
  },
  {
    id: 'best-trading-sessions',
    category: 'Trading Mechanics',
    question: '21. Which trading sessions offer the best liquidity and cleanest price moves?',
    answer:
      'The London Session (08:00–17:00 UTC) and New York Session (13:00–22:00 UTC)—especially the 4-hour London/New York Overlap (13:00–17:00 UTC)—deliver the tightest spreads, highest institutional volume, and cleanest breakout momentum for Forex, Gold, and US Indices.'
  },
  {
    id: 'technical-vs-fundamental',
    category: 'Trading Basics',
    question: '22. Technical Analysis vs. Fundamental Analysis: which one should you trust?',
    answer:
      'Fundamentals (interest rates, inflation CPI, central bank policy, employment NFP) drive long-term macro trends, while Technical Analysis (market structure, supply/demand zones, volume, price action) pinpoints exact entry, Stop-Loss, and Take-Profit prices. Combining macro bias with clean technical execution produces the strongest results.'
  },
  {
    id: 'market-structure-liquidity',
    category: 'Trading Mechanics',
    question: '23. What are market structure and liquidity sweeps in modern trading?',
    answer:
      'Market structure tracks sequences of Higher Highs/Higher Lows (uptrend) or Lower Highs/Lower Lows (downtrend). Institutional players frequently push price briefly past obvious support or resistance highs/lows—triggering clustered retail Stop-Losses (a liquidity sweep)—before reversing sharply in the true institutional direction.'
  },
  {
    id: 'realistic-starting-capital',
    category: 'Trading Basics',
    question: '24. How much capital do I really need to start live trading?',
    answer:
      'Verified brokers on TradeVortex accept $5–$20 minimum deposits so anyone can learn live execution and withdrawal workflows safely. However, for meaningful compounding with strict 1% risk per trade, traders gradually build toward $250–$1,000+ or combine micro accounts with disciplined savings.'
  },
  {
    id: 'importance-of-trading-journal',
    category: 'Risk & Psychology',
    question: '25. Why is keeping a Trading Journal essential for turning profitable?',
    answer:
      'Without a journal, traders repeat the exact same mistakes for years. Logging entry reason, Risk-to-Reward, session time, screenshot, and emotional state over 50–100 trades reveals immediately which setups make you money and which bad habits drain your account.'
  },
  {
    id: 'drawdown-recovery-math',
    category: 'Calculators',
    question: '26. Why is Drawdown Recovery Math asymmetric (e.g., a 50% loss needs +100% to recover)?',
    answer:
      'Because losses shrink your capital base. Losing 10% requires an 11.1% gain to break even, losing 25% requires a 33.3% gain, and losing 50% requires a massive 100% return just to get back to zero. Protecting your account from deep drawdowns is always easier than climbing out of one.'
  },
  {
    id: 'scalping-day-swing-styles',
    category: 'Trading Basics',
    question: '27. Scalping vs. Day Trading vs. Swing Trading: which style suits beginners best?',
    answer:
      'Scalping (1m–5m charts) demands split-second speed and ultra-low spreads and often overwhelms beginners. Swing Trading (4H–Daily charts) or structured Day Trading (15m–1H charts) gives beginners clear time to analyze structure, calculate position size calmly, and avoid spread noise.'
  },
  {
    id: 'high-impact-news-trading',
    category: 'Trading Mechanics',
    question: '28. How do NFP, CPI, and Federal Reserve rate decisions impact active trades?',
    answer:
      'Tier-1 macro releases inject massive sudden volume within milliseconds, causing spreads to widen and prices to whip in both directions. Beginners should inspect the TradeVortex Economic Calendar daily and flatten or protect positions prior to red-folder news events.'
  },
  {
    id: 'avoiding-fake-gurus-scams',
    category: 'Account & Security',
    question: '29. How can I avoid fake trading gurus, account managers, and signal scams?',
    answer:
      'Never send funds to strangers promising "guaranteed 50% weekly returns" or "account flipping." Real regulated brokers hold funds strictly in your own verified name. Legitimate education teaches independent risk math, Stop-Loss discipline, and realistic expectations rather than rented supercar hype.'
  },
  {
    id: 'affiliate-commission-cost',
    category: 'Account & Security',
    question: '30. Do TradeVortex partner broker links cost me extra spreads or fees?',
    answer:
      'No. Opening an account through any verified TradeVortex partner link gives you identical (or discounted) spreads, commissions, and withdrawal speeds at zero extra cost to you. Broker marketing partnerships help keep all 11 calculators, live charts, and academy guides 100% free.'
  }
];

export function getStoredFaqs(): FAQItem[] {
  if (typeof window === 'undefined') return FAQS_DATA;
  try {
    const raw = localStorage.getItem(FAQS_STORAGE_KEY);
    if (!raw) return FAQS_DATA;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return FAQS_DATA;
  } catch {
    return FAQS_DATA;
  }
}

export function saveFaqs(faqs: FAQItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(faqs));
    window.dispatchEvent(new CustomEvent(FAQS_EVENT_KEY, { detail: faqs }));
  } catch (err) {
    console.error('Failed to save FAQs', err);
  }
}

export function resetFaqsToDefault(): FAQItem[] {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(FAQS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(FAQS_EVENT_KEY, { detail: FAQS_DATA }));
  }
  return FAQS_DATA;
}
