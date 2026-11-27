import React, { useState, useEffect, useMemo } from 'react';
import { Language, PageView, QuizQuestion } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { playClickSound } from '../utils/sound';
import { getStoredQuizQuestions, QUIZ_EVENT_KEY } from '../data/quizData';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  Share2,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  BookOpen,
  UserCheck
} from 'lucide-react';

interface TradingQuizProps {
  language?: Language;
  onNavigate?: (page: PageView) => void;
}

export const TradingQuiz: React.FC<TradingQuizProps> = ({
  language = 'en',
  onNavigate
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [questions, setQuestions] = useState<QuizQuestion[]>(() => getStoredQuizQuestions());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useEffect(() => {
    const syncQuestions = () => {
      setQuestions(getStoredQuizQuestions());
    };
    window.addEventListener(QUIZ_EVENT_KEY, syncQuestions);
    return () => window.removeEventListener(QUIZ_EVENT_KEY, syncQuestions);
  }, []);

  const certId = useMemo(
    () => `TVX-${Math.floor(100000 + Math.random() * 900000)}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isCompleted]
  );

  const safeQuestions = questions.length > 0 ? questions : getStoredQuizQuestions();
  const currentQ = safeQuestions[Math.min(currentQuestionIndex, safeQuestions.length - 1)];

  const handleSelectOption = (optionIndex: number) => {
    if (showExplanation) return;
    playClickSound('click');
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(updated);
    setShowExplanation(true);
  };

  const handleNext = () => {
    playClickSound('toggle');
    setShowExplanation(false);
    if (currentQuestionIndex < safeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    playClickSound('toggle');
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowExplanation(false);
    setIsCompleted(false);
    setShareFeedback(null);
  };

  const score = selectedAnswers.reduce((total, ans, idx) => {
    return safeQuestions[idx] && ans === safeQuestions[idx].correctIndex ? total + 1 : total;
  }, 0);

  const scorePercent = safeQuestions.length > 0 ? Math.round((score / safeQuestions.length) * 100) : 0;
  // Pass threshold >= 40% unlocks certificate + name input
  const passed = scorePercent >= 40;
  const displayCandidate = candidateName.trim() || 'Certified Market Participant';
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownloadPngCertificate = () => {
    playClickSound('calculate');
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 980;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 1400, 980);
    bg.addColorStop(0, '#020617');
    bg.addColorStop(0.5, '#0f172a');
    bg.addColorStop(1, '#020617');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1400, 980);

    // Subtle radial glow
    const glow = ctx.createRadialGradient(700, 460, 40, 700, 460, 560);
    glow.addColorStop(0, 'rgba(6, 182, 212, 0.14)');
    glow.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1400, 980);

    // Outer & Inner Borders
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 6;
    ctx.strokeRect(36, 36, 1328, 908);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(56, 56, 1288, 868);

    // Corner gold accents
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    const corners = [
      [76, 76, 1, 1],
      [1324, 76, -1, 1],
      [76, 904, 1, -1],
      [1324, 904, -1, -1]
    ];
    corners.forEach(([x, y, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + dy * 48);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * 48, y);
      ctx.stroke();
    });

    // Header Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('TRADEVORTEX GLOBAL FINANCIAL STANDARDS', 700, 150);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Georgia, serif';
    ctx.fillText('Certificate of Risk Competency', 700, 235);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px monospace';
    ctx.fillText(`Official Institutional Accreditation  •  ID: ${certId}`, 700, 285);

    // Divider
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(320, 325);
    ctx.lineTo(1080, 325);
    ctx.stroke();

    // Recipient
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '24px sans-serif';
    ctx.fillText('THIS IS OFFICIALLY AWARDED TO', 700, 395);

    ctx.fillStyle = '#67e8f9';
    ctx.font = 'bold 64px Georgia, serif';
    ctx.fillText(displayCandidate, 700, 480);

    // Underline candidate name
    const nameWidth = Math.min(760, Math.max(320, ctx.measureText(displayCandidate).width + 60));
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(700 - nameWidth / 2, 505);
    ctx.lineTo(700 + nameWidth / 2, 505);
    ctx.stroke();

    // Body summary
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '25px sans-serif';
    ctx.fillText(
      `For successfully completing the ${safeQuestions.length}-Question TradeVortex Capital Preservation`,
      700,
      580
    );
    ctx.fillText(
      `& Risk Management Examination with an audited score of ${score}/${safeQuestions.length} (${scorePercent}%).`,
      700,
      620
    );

    // Verified Badge Pill inside Certificate
    ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.fillRect(510, 665, 380, 52);
    ctx.strokeRect(510, 665, 380, 52);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 21px monospace';
    ctx.fillText(`PASSED • SCORE ${scorePercent}% VERIFIED`, 700, 698);

    // Footer signatures
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px monospace';
    ctx.fillText('DATE OF ISSUE', 160, 815);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(issueDate, 160, 850);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px monospace';
    ctx.fillText('AUTHORIZED BY', 1240, 815);
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 26px Georgia, serif';
    ctx.fillText('TradeVortex Academic Board', 1240, 850);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `TradeVortex-Certificate-${displayCandidate.replace(/[^a-z0-9]/gi, '_')}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareCertificate = async () => {
    playClickSound('click');
    const text = `I just earned my TradeVortex Risk Competency Certificate (${scorePercent}% score, ID: ${certId}) on tradevortex.com!`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'TradeVortex Certificate of Risk Competency',
          text,
          url: window.location.href
        });
        setShareFeedback('Shared!');
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        setShareFeedback('Achievement copied to clipboard!');
      }
    } catch {
      // User dismissed share
    }
    setTimeout(() => setShareFeedback(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Quiz Header */}
      <div className="max-w-2xl border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300 mb-2">
          <Award className="h-3.5 w-3.5 text-cyan-400" />
          <span>Verified {safeQuestions.length}-Question Certification Test</span>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {t.quizTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
          {t.quizSubtitle}
        </p>
      </div>

      {!isCompleted ? (
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-6 sm:p-8 shadow-xl max-w-3xl space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>
              {t.questionLabel} {currentQuestionIndex + 1} {t.ofLabel} {safeQuestions.length}
            </span>
            <span>Passing Threshold: 40%</span>
          </div>

          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / safeQuestions.length) * 100}%`
              }}
            />
          </div>

          {/* Question Text */}
          <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
            {currentQ.question}
          </h4>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === idx;
              const isCorrect = currentQ.correctIndex === idx;

              let btnClasses =
                'border-slate-800 bg-slate-950/70 text-slate-200 hover:border-slate-700 hover:bg-slate-900';
              if (showExplanation) {
                if (isCorrect) {
                  btnClasses = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnClasses = 'border-rose-500 bg-rose-950/40 text-rose-200';
                }
              } else if (isSelected) {
                btnClasses = 'border-cyan-500 bg-cyan-950/30 text-cyan-200 font-bold';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={showExplanation}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm transition-all ${btnClasses}`}
                >
                  <span>{option}</span>
                  {showExplanation && isCorrect && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {showExplanation && isSelected && !isCorrect && (
                    <XCircle className="h-4 w-4 text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed animate-in fade-in">
              <span className="font-bold text-cyan-300 font-mono uppercase block text-[11px]">
                Technical Explanation:
              </span>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 uppercase"
              >
                <span>
                  {currentQuestionIndex < safeQuestions.length - 1 ? t.nextQuestion : t.viewResults}
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* SCREEN 2: RESULTS & CONDITIONAL CERTIFICATE */
        <div className="space-y-6 max-w-3xl">
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-6 sm:p-8 text-center space-y-4 shadow-xl">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 ${
                passed ? 'border-emerald-500 bg-emerald-950/30' : 'border-rose-500 bg-rose-950/30'
              }`}
            >
              {passed ? (
                <Sparkles className="h-8 w-8 text-emerald-400" />
              ) : (
                <XCircle className="h-8 w-8 text-rose-400" />
              )}
            </div>

            <h3 className="text-2xl font-bold text-white">
              {passed
                ? 'Congratulations! You Passed the Risk Assessment'
                : 'Score Below 40% — Assessment Not Passed'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              You scored{' '}
              <span className="font-mono font-bold text-cyan-300">
                {score} out of {safeQuestions.length} ({scorePercent}%)
              </span>
              .
              {passed
                ? ' Insert your name below to generate and download your official TradeVortex Certificate as a PNG image.'
                : ' A minimum score of 40% is required to unlock the certificate. Please review our Academy articles and retry the test.'}
            </p>

            {/* Fail (< 40%): ONLY Retry Test button (+ optional study button via Academy) */}
            {!passed ? (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-6 py-2.5 text-xs font-extrabold text-white hover:bg-rose-400 transition-all shadow-md uppercase tracking-wide"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>{t.retryTest}</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{t.retryTest}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPngCertificate}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 text-xs font-extrabold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-md shadow-cyan-500/20 uppercase"
                >
                  <Download className="h-4 w-4" />
                  <span>{t.downloadCertPng}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareCertificate}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-all"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>{shareFeedback || t.shareCert}</span>
                </button>
              </div>
            )}
          </div>

          {/* Passed (>= 40%): Insert Your Name + Live Certificate Preview + Prominent Academy CTA */}
          {passed && (
            <div className="space-y-5">
              <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-cyan-400" />
                  <span>{t.insertNameLabel}:</span>
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter your full name for the certificate..."
                  className="flex-1 max-w-sm rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-cyan-300 font-bold placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="relative overflow-hidden rounded-2xl border-4 border-cyan-500/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 text-center shadow-2xl shadow-cyan-950/80 space-y-6">
                <div className="absolute top-3 left-3 h-10 w-10 border-t-2 border-l-2 border-amber-400/70" />
                <div className="absolute top-3 right-3 h-10 w-10 border-t-2 border-r-2 border-amber-400/70" />
                <div className="absolute bottom-3 left-3 h-10 w-10 border-b-2 border-l-2 border-amber-400/70" />
                <div className="absolute bottom-3 right-3 h-10 w-10 border-b-2 border-r-2 border-amber-400/70" />

                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-widest font-mono text-cyan-400 font-bold">
                    TradeVortex Global Financial Standards
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide">
                    Certificate of Risk Competency
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Official Institutional Accreditation · Verification ID: {certId}
                  </p>
                </div>

                <div className="py-2">
                  <span className="text-xs text-slate-400 block mb-1">This is officially certified to:</span>
                  <div className="text-2xl sm:text-3xl font-serif font-extrabold text-cyan-300 underline decoration-cyan-500/50 decoration-2 underline-offset-8">
                    {displayCandidate}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Having successfully passed the {safeQuestions.length}-Question TradeVortex Capital Preservation & Position Sizing Examination with a score of{' '}
                  <strong className="text-emerald-400">
                    {score}/{safeQuestions.length} ({scorePercent}%)
                  </strong>
                  , demonstrating command of leverage, margin health, and risk-to-reward mechanics.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Date of Issue</span>
                    <span className="font-mono text-slate-300 font-semibold">{issueDate}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <ShieldCheck className="h-4 w-4" />
                      <span>TradeVortex Academic Board</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">CMT Audited Standards</span>
                  </div>
                </div>
              </div>

              {/* Prominent CTA Linking to Articles & Academy */}
              {onNavigate && (
                <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/60 to-slate-900 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-sm sm:text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                      <BookOpen className="h-4 w-4 text-cyan-400" />
                      <span>Continue Your Market Education</span>
                    </h4>
                    <p className="text-xs text-slate-300">
                      Explore complete guides on how P&L works, beginner roadmaps, local currency planning, and advice from legendary traders.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound('click');
                      onNavigate('academy');
                    }}
                    className="shrink-0 flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-cyan-400 transition-all shadow-md"
                  >
                    <span>{t.visitAcademyCta}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
