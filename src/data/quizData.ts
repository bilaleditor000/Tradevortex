import { QuizQuestion } from '../types';

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the maximum percentage of account equity professional risk desks recommend risking per individual trade?',
    options: ['1% to 2%', '10% to 15%', '25%', 'Whatever feels comfortable'],
    correctIndex: 0,
    explanation: 'Risking no more than 1% to 2% mathematically insulates your portfolio against inevitable losing streaks and avoids catastrophic drawdown.'
  },
  {
    id: 2,
    question: 'If a trading account suffers a 50% drawdown, what percentage gain is required simply to return to breakeven?',
    options: ['50%', '75%', '100%', '150%'],
    correctIndex: 2,
    explanation: 'Because your capital base is halved (e.g., $10,000 down to $5,000), you must double (+100%) your remaining $5,000 to return to your original $10,000.'
  },
  {
    id: 3,
    question: 'How should your position lot size be determined before entering a trade?',
    options: [
      'Use a fixed arbitrary lot size like 1.00 on every setup',
      'Calculate it dynamically based on the stop loss distance and fixed cash risk limit',
      'Based on how confident you feel about the market direction',
      'Always max out available margin leverage'
    ],
    correctIndex: 1,
    explanation: 'Position Size = Cash Risk / (Stop Loss Distance × Pip Value). Sizing dynamically guarantees consistent dollar risk regardless of stop distance.'
  },
  {
    id: 4,
    question: 'In EUR/USD, what is the approximate pip value of 1.00 Standard Lot (100,000 units)?',
    options: ['$1.00 per pip', '$10.00 per pip', '$100.00 per pip', '$0.10 per pip'],
    correctIndex: 1,
    explanation: 'For pairs with USD as the quote currency (EUR/USD, GBP/USD), 1 pip on 1.00 standard lot equals exactly $10.00 USD.'
  },
  {
    id: 5,
    question: 'What happens when your account Margin Level falls to your broker\'s mandatory Stop-Out threshold (e.g. 20% to 50%)?',
    options: [
      'The broker automatically deposits bonus margin into your account',
      'The broker\'s risk engine forcibly liquidates your open positions at market price',
      'Nothing happens until market close',
      'You are allowed to open larger positions'
    ],
    correctIndex: 1,
    explanation: 'When Margin Level hits the Stop-Out threshold, the broker forcibly closes active trades to prevent a negative account balance.'
  },
  {
    id: 6,
    question: 'What does a 1:3 Risk-to-Reward (R:R) ratio mean?',
    options: [
      'You risk $3 to make $1',
      'You risk $1 to potentially earn $3 in profit',
      'You must win 3 trades in a row',
      'You use 1:3 leverage on your account'
    ],
    correctIndex: 1,
    explanation: 'A 1:3 R:R ratio means your profit target is three times larger than your stop loss risk, allowing profitability even with a 35%–40% win rate.'
  },
  {
    id: 7,
    question: 'In Forex pricing, what is the "Spread"?',
    options: [
      'The total profit made on a trade',
      'The difference between the Ask (buy) price and the Bid (sell) price',
      'The overnight interest paid on positions',
      'The minimum deposit required by a broker'
    ],
    correctIndex: 1,
    explanation: 'The Spread (Ask minus Bid) is the direct transaction cost paid to enter a trade; tighter spreads reduce breakeven friction.'
  },
  {
    id: 8,
    question: 'On Spot Gold (XAU/USD), how much does 1.00 Standard Lot (100 troy ounces) gain or lose on a $1.00 price move?',
    options: ['$1.00', '$10.00', '$100.00', '$1,000.00'],
    correctIndex: 2,
    explanation: '1 standard lot of Gold equals 100 oz, meaning every $1.00 shift in spot Gold price produces a $100.00 profit or loss.'
  },
  {
    id: 9,
    question: 'In Japanese Yen currency pairs (e.g., USD/JPY, GBP/JPY), which decimal place represents 1 full Pip?',
    options: ['The 4th decimal (0.0001)', 'The 2nd decimal (0.01)', 'The 1st decimal (0.1)', 'The 5th decimal (0.00001)'],
    correctIndex: 1,
    explanation: 'Because JPY has smaller unit valuation, 1 pip on JPY pairs is measured at the second decimal place (0.01).'
  },
  {
    id: 10,
    question: 'What is the primary danger of using 100x leverage in Crypto Futures without a Stop Loss?',
    options: [
      'Your fees drop to zero',
      'A mere ~0.5% to 1.0% move against you can trigger total position liquidation',
      'Your position becomes immune to volatility',
      'The exchange pays you extra funding'
    ],
    correctIndex: 1,
    explanation: 'At 100x leverage, initial margin is only 1% of notional value. Accounting for maintenance margin, even a sub-1% adverse swing wipes out the position.'
  },
  {
    id: 11,
    question: 'Which trading practice is commonly called "Revenge Trading"?',
    options: [
      'Reviewing losing trades calmly in a trading journal',
      'Immediately doubling position size after a loss to win the money back quickly',
      'Setting a trailing stop loss on winning trades',
      'Practicing on a $10,000 demo simulator'
    ],
    correctIndex: 1,
    explanation: 'Revenge trading is an emotional reaction where a trader breaks risk limits after a loss, rapidly compounding drawdowns.'
  },
  {
    id: 12,
    question: 'When calculating Profit & Loss in your local currency (e.g., PKR, SAR, MYR, INR), why must exchange rates be factored in?',
    options: [
      'Because broker margins and pip values settle in USD/EUR and convert to your local purchasing power',
      'Exchange rates have no effect on trading profits',
      'Local currencies cannot be used to fund broker accounts',
      'Only Bitcoin requires currency conversion'
    ],
    correctIndex: 0,
    explanation: 'Understanding both USD exposure and exact local currency equivalent prevents over-sizing relative to your real-world household income and capital.'
  },
  {
    id: 13,
    question: 'Which global trading session overlap typically delivers the highest liquidity and tightest spreads in Forex?',
    options: [
      'Sydney Close / Weekend',
      'London & New York Session Overlap (13:00 – 17:00 UTC)',
      'Tokyo Lunch Hour',
      'Late Friday Afternoon'
    ],
    correctIndex: 1,
    explanation: 'When both London and New York institutional desks operate simultaneously, order books are deepest and spreads are tightest.'
  },
  {
    id: 14,
    question: 'What is Dollar-Cost Averaging (DCA) used for in Spot Investing?',
    options: [
      'Going all-in at the exact market top with 50x leverage',
      'Splitting capital into scheduled or tiered buys to lower your average entry cost during dips',
      'Canceling all stop losses on short positions',
      'Converting USD into EUR every hour'
    ],
    correctIndex: 1,
    explanation: 'DCA reduces timing risk by distributing spot purchases across price levels, lowering average entry cost without over-leveraging.'
  },
  {
    id: 15,
    question: 'Why did legendary trader Paul Tudor Jones emphasize "Losers average losers"?',
    options: [
      'Because you should add more money to losing leveraged trades hoping they bounce back',
      'Because adding size to a losing trade without invalidation destroys capital; cut losses quickly instead',
      'Because winning trades should always be closed immediately',
      'Because technical analysis never works'
    ],
    correctIndex: 1,
    explanation: 'Adding to a losing leveraged position compounds risk when your thesis is already wrong. Great traders respect stop losses and defend capital first.'
  }
];

const QUIZ_STORAGE_KEY = 'tradevortex_quiz_questions_v1';
export const QUIZ_EVENT_KEY = 'tradevortex_quiz_changed';

export function getStoredQuizQuestions(): QuizQuestion[] {
  if (typeof window === 'undefined') return INITIAL_QUIZ_QUESTIONS;
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return INITIAL_QUIZ_QUESTIONS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_QUIZ_QUESTIONS;
  } catch {
    return INITIAL_QUIZ_QUESTIONS;
  }
}

export function saveQuizQuestions(questions: QuizQuestion[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(questions));
    window.dispatchEvent(new CustomEvent(QUIZ_EVENT_KEY, { detail: questions }));
  } catch (err) {
    console.error('Failed to save quiz questions', err);
  }
}

export function resetQuizQuestions(): QuizQuestion[] {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(QUIZ_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(QUIZ_EVENT_KEY, { detail: INITIAL_QUIZ_QUESTIONS }));
  }
  return INITIAL_QUIZ_QUESTIONS;
}
