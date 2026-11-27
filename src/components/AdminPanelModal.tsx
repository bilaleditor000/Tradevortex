import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AdminSettings,
  Article,
  Broker,
  CalculatorTab,
  CommunityProof,
  CustomContentBlock,
  FAQItem,
  PageView,
  QuizQuestion,
  SponsorDeal
} from '../types';
import {
  DEFAULT_VIP_PARTNER_BANNER,
  getAdminSettings,
  resetAdminSettings,
  injectDynamicAdSense
} from '../data/adminSettings';
import {
  getStoredArticles,
  saveArticles,
  resetArticlesToDefault
} from '../data/articlesData';
import {
  getStoredQuizQuestions,
  saveQuizQuestions,
  resetQuizQuestions
} from '../data/quizData';
import {
  getStoredBrokers,
  saveBrokers,
  resetBrokersToDefault
} from '../data/brokersData';
import {
  getStoredFaqs,
  saveFaqs,
  resetFaqsToDefault
} from '../data/faqsData';
import {
  getStoredCommunityProofs,
  saveCommunityProofs,
  resetCommunityProofsToDefault
} from '../data/communityProofsData';
import { publishGlobalSiteConfig } from '../data/cloudSync';
import { AdminAnalyticsDashboard } from './AdminAnalyticsDashboard';
import { AdminSiteBuilderMediaTab } from './AdminSiteBuilderMediaTab';
import { AdminCloudSyncTab } from './AdminCloudSyncTab';
import { AdminFaqsManagerTab } from './AdminFaqsManagerTab';
import { AdminCommunityProofsTab } from './AdminCommunityProofsTab';
import { playClickSound } from '../utils/sound';
import {
  Lock,
  X,
  ShieldAlert,
  Save,
  RotateCcw,
  LogOut,
  CheckCircle2,
  Send,
  Link as LinkIcon,
  Share2,
  ExternalLink,
  Code2,
  DollarSign,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Palette,
  FileText,
  HelpCircle,
  LayoutGrid,
  Edit3,
  Undo2,
  Redo2,
  BarChart3,
  Layers,
  Cloud,
  Award,
  MessageSquare
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokers: Broker[];
  onSettingsUpdated: (settings: AdminSettings) => void;
}

type AdminTab =
  | 'analytics'
  | 'builder'
  | 'cms'
  | 'articles'
  | 'faqs'
  | 'proofs'
  | 'quiz'
  | 'brokers'
  | 'adsense'
  | 'sponsors'
  | 'theme'
  | 'telegram'
  | 'social'
  | 'cloud';

interface AdminSnapshot {
  settings: AdminSettings;
  articlesList: Article[];
  quizList: QuizQuestion[];
  brokersList: Broker[];
  faqsList: FAQItem[];
  proofsList: CommunityProof[];
}

const MAX_HISTORY_STEPS = 30;

const CMS_TEXT_FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: 'heroHeadline', label: 'Home Hero Headline', placeholder: 'Master Every Trade With' },
  { key: 'heroHighlight', label: 'Home Hero Highlight Text', placeholder: 'Mathematical Precision' },
  {
    key: 'heroSubtitle',
    label: 'Home Hero Subtitle',
    placeholder: 'Calculate exact position sizes, convert P&L in any local currency...'
  },
  { key: 'calcHubTitle', label: 'Calculators Hub Title', placeholder: 'Institutional Risk & Position Calculators' },
  { key: 'marketsTitle', label: 'Markets & Live Search Title', placeholder: 'Global Markets, Live Charts & Sentiment' },
  { key: 'academyTitle', label: 'Trading Academy Title', placeholder: 'Institutional Trading Guides & Academy' },
  {
    key: 'riskWarning',
    label: 'Footer Risk Warning Notice',
    placeholder: 'High Risk Investment Warning: 70% to 89% of retail accounts lose money trading CFDs.'
  }
];

const TOGGLEABLE_SECTIONS: { id: string; label: string }[] = [
  { id: 'hero', label: 'Home Hero Banner' },
  { id: 'chart', label: 'Home Live TradingView Chart & Gauge' },
  { id: 'market-intelligence', label: 'Live Market Intelligence Hub' },
  { id: 'quick-calc', label: 'Home Quick Position Preview' },
  { id: 'vip-partner-banner', label: 'VIP Partner Benefits Banner' },
  { id: 'brokers-preview', label: 'Home Tier-1 ECN Brokers Showcase' },
  { id: 'signals-preview', label: 'Home Live Signals Preview' },
  { id: 'heatmap', label: 'Home Currency Heat Map' },
  { id: 'calendar', label: 'Home Economic Calendar' },
  { id: 'journal', label: 'Home Trade Journal Strip' },
  { id: 'blogs-home', label: 'Home Trading Blogs' },
  { id: 'community-proofs', label: 'Home Verified Proofs' },
  { id: 'faqs-home', label: 'Home 30 FAQs Section' }
];

const CALCULATOR_OPTIONS: { id: CalculatorTab; label: string }[] = [
  { id: 'futures-pnl', label: 'Futures Profit/Loss' },
  { id: 'local-currency', label: 'Local Currency P&L' },
  { id: 'lot-size', label: 'Forex Lot Size & R:R' },
  { id: 'pip-value', label: 'Pip Value Matrix' },
  { id: 'liquidation', label: 'Liquidation Price' },
  { id: 'compound-drawdown', label: 'Compound & Drawdown' },
  { id: 'gold-indices', label: 'Gold & Indices Sizer' },
  { id: 'margin-leverage', label: 'Margin & Leverage' },
  { id: 'sl-tp', label: 'SL / TP Target & R:R' },
  { id: 'breakeven', label: 'Win Rate & Expectancy' },
  { id: 'dca', label: 'DCA Average Entry' }
];

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  brokers: propBrokers,
  onSettingsUpdated
}) => {
  // All hooks placed unconditionally at top level
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('tradevortex_admin_auth') === 'true';
    }
    return false;
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [settings, setSettings] = useState<AdminSettings>(() => getAdminSettings());
  const [articlesList, setArticlesList] = useState<Article[]>(() => getStoredArticles());
  const [quizList, setQuizList] = useState<QuizQuestion[]>(() => getStoredQuizQuestions());
  const [brokersList, setBrokersList] = useState<Broker[]>(() =>
    propBrokers.length > 0 ? propBrokers : getStoredBrokers()
  );
  const [faqsList, setFaqsList] = useState<FAQItem[]>(() => getStoredFaqs());
  const [proofsList, setProofsList] = useState<CommunityProof[]>(() => getStoredCommunityProofs());

  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // 30-step Undo/Redo History Stack
  const [historyStack, setHistoryStack] = useState<AdminSnapshot[]>(() => [
    {
      settings: getAdminSettings(),
      articlesList: getStoredArticles(),
      quizList: getStoredQuizQuestions(),
      brokersList: propBrokers.length > 0 ? propBrokers : getStoredBrokers(),
      faqsList: getStoredFaqs(),
      proofsList: getStoredCommunityProofs()
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const lastHistoryPushMsRef = useRef<number>(0);
  const snapshotRef = useRef<AdminSnapshot>({
    settings,
    articlesList,
    quizList,
    brokersList,
    faqsList,
    proofsList
  });
  snapshotRef.current = { settings, articlesList, quizList, brokersList, faqsList, proofsList };

  const pushHistorySnapshot = useCallback((next: AdminSnapshot, coalesceTyping = false) => {
    const now = Date.now();
    const shouldCoalesce = coalesceTyping && now - lastHistoryPushMsRef.current < 700;
    lastHistoryPushMsRef.current = now;

    setHistoryStack((prevStack) => {
      const base = prevStack.slice(0, historyIndex + 1);
      if (shouldCoalesce && base.length > 1) {
        const replaced = [...base.slice(0, -1), next];
        return replaced.slice(-MAX_HISTORY_STEPS);
      }
      const appended = [...base, next];
      const trimmed = appended.slice(-MAX_HISTORY_STEPS);
      setHistoryIndex(trimmed.length - 1);
      return trimmed;
    });
  }, [historyIndex]);

  const updateSettingsWithHistory = useCallback(
    (updater: (prev: AdminSettings) => AdminSettings, coalesceTyping = false) => {
      const curr = snapshotRef.current;
      const nextSettings = updater(curr.settings);
      setSettings(nextSettings);
      pushHistorySnapshot(
        {
          ...curr,
          settings: nextSettings
        },
        coalesceTyping
      );
    },
    [pushHistorySnapshot]
  );

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyStack.length - 1;

  // CMS Custom Block Form
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockBody, setNewBlockBody] = useState('');
  const [newBlockPage, setNewBlockPage] = useState<PageView | 'all'>('home');
  const [newBlockCtaLabel, setNewBlockCtaLabel] = useState('');
  const [newBlockCtaUrl, setNewBlockCtaUrl] = useState('');

  // Article / Blog Editor State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleDraft, setArticleDraft] = useState<Partial<Article>>({
    title: '',
    subtitle: '',
    category: 'Beginner',
    readTime: '6 min read',
    author: 'Bilal Editorial Desk',
    authorRole: 'Market Strategist',
    summary: '',
    content: '',
    keyTakeaways: []
  });

  // Quiz Editor State
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  const [quizDraft, setQuizDraft] = useState<{
    question: string;
    opt0: string;
    opt1: string;
    opt2: string;
    opt3: string;
    correctIndex: number;
    explanation: string;
  }>({
    question: '',
    opt0: '',
    opt1: '',
    opt2: '',
    opt3: '',
    correctIndex: 0,
    explanation: ''
  });

  // Broker Add Form State
  const [showAddBroker, setShowAddBroker] = useState(false);
  const [newBrokerDraft, setNewBrokerDraft] = useState({
    name: '',
    minDeposit: '$10',
    maxLeverage: '1:500',
    spreadFrom: '0.0 pips',
    category: 'Multi-Asset' as Broker['category'],
    badge: 'Verified Partner',
    specialOffer: '',
    rating: '4.8',
    description: '',
    affiliateUrl: 'https://'
  });

  // Sponsor Form State
  const [showAddSponsorModal, setShowAddSponsorModal] = useState(false);
  const [newSponsor, setNewSponsor] = useState<Partial<SponsorDeal>>({
    companyName: '',
    dealPrice: '$1,500/mo',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    bannerImageUrl: '',
    bannerScript: '',
    targetUrl: 'https://',
    placement: 'all',
    active: true,
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      const initSettings = getAdminSettings();
      const initArticles = getStoredArticles();
      const initQuiz = getStoredQuizQuestions();
      const initBrokers = propBrokers.length > 0 ? propBrokers : getStoredBrokers();
      const initFaqs = getStoredFaqs();
      const initProofs = getStoredCommunityProofs();
      setSettings(initSettings);
      setArticlesList(initArticles);
      setQuizList(initQuiz);
      setBrokersList(initBrokers);
      setFaqsList(initFaqs);
      setProofsList(initProofs);
      setHistoryStack([
        {
          settings: initSettings,
          articlesList: initArticles,
          quizList: initQuiz,
          brokersList: initBrokers,
          faqsList: initFaqs,
          proofsList: initProofs
        }
      ]);
      setHistoryIndex(0);
      setAuthError('');
    }
  }, [isOpen, propBrokers]);

  if (!isOpen) return null;

  const triggerToast = (msg = 'Changes saved and synchronized live across TradeVortex!') => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const handleUndo = () => {
    if (!canUndo) return;
    playClickSound('toggle');
    const targetIdx = historyIndex - 1;
    const snap = historyStack[targetIdx];
    if (!snap) return;
    setHistoryIndex(targetIdx);
    setSettings(snap.settings);
    setArticlesList(snap.articlesList);
    setQuizList(snap.quizList);
    setBrokersList(snap.brokersList);
    setFaqsList(snap.faqsList);
    setProofsList(snap.proofsList);
    triggerToast(`Reverted to step ${targetIdx + 1} of ${historyStack.length}. Click Save & Publish to push live.`);
  };

  const handleRedo = () => {
    if (!canRedo) return;
    playClickSound('toggle');
    const targetIdx = historyIndex + 1;
    const snap = historyStack[targetIdx];
    if (!snap) return;
    setHistoryIndex(targetIdx);
    setSettings(snap.settings);
    setArticlesList(snap.articlesList);
    setQuizList(snap.quizList);
    setBrokersList(snap.brokersList);
    setFaqsList(snap.faqsList);
    setProofsList(snap.proofsList);
    triggerToast(`Restored step ${targetIdx + 1} of ${historyStack.length}. Click Save & Publish to push live.`);
  };

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'bilaleditor' && password.trim() === 'bilaleditor000@') {
      playClickSound('calculate');
      setIsAuthenticated(true);
      sessionStorage.setItem('tradevortex_admin_auth', 'true');
      setAuthError('');
      setUsername('');
      setPassword('');
    } else {
      playClickSound('toggle');
      setAuthError('Invalid administrator credentials. Access denied.');
    }
  };

  const handleLogout = () => {
    playClickSound('toggle');
    setIsAuthenticated(false);
    sessionStorage.removeItem('tradevortex_admin_auth');
  };

  // Save everything live + publish globally via Cloud Firestore
  const handleSaveAll = async () => {
    playClickSound('calculate');
    setIsPublishing(true);
    const syncedLinks: Record<string, string> = { ...(settings.brokerLinks || {}) };
    brokersList.forEach((b) => {
      syncedLinks[b.id] = b.affiliateUrl;
    });
    const finalSettings: AdminSettings = {
      ...settings,
      brokerLinks: syncedLinks,
      homeFaqs: faqsList,
      communityProofs: proofsList
    };
    setSettings(finalSettings);

    const res = await publishGlobalSiteConfig({
      settings: finalSettings,
      brokers: brokersList,
      articles: articlesList,
      quizQuestions: quizList,
      faqs: faqsList,
      proofs: proofsList
    });

    onSettingsUpdated(getAdminSettings());
    setIsPublishing(false);

    if (res.syncedToCloud) {
      triggerToast(`Published globally to Cloud Firestore + all browsers in ${res.latencyMs}ms!`);
    } else if (res.requiresCloudAuth) {
      triggerToast('Saved locally & synced tabs! Sign in under "Cloud Sync" tab for worldwide Firestore broadcast.');
    } else if (res.error) {
      triggerToast(`Saved locally. Cloud sync notice: ${res.error}`);
    } else {
      triggerToast();
    }
  };

  const handleResetDefaults = async () => {
    playClickSound('toggle');
    const resetSettings = resetAdminSettings();
    const resetArt = resetArticlesToDefault();
    const resetQuiz = resetQuizQuestions();
    const resetBrk = resetBrokersToDefault();
    const resetFaqs = resetFaqsToDefault();
    const resetProofs = resetCommunityProofsToDefault();
    setSettings(resetSettings);
    setArticlesList(resetArt);
    setQuizList(resetQuiz);
    setBrokersList(resetBrk);
    setFaqsList(resetFaqs);
    setProofsList(resetProofs);
    pushHistorySnapshot({
      settings: resetSettings,
      articlesList: resetArt,
      quizList: resetQuiz,
      brokersList: resetBrk,
      faqsList: resetFaqs,
      proofsList: resetProofs
    });
    await publishGlobalSiteConfig({
      settings: resetSettings,
      brokers: resetBrk,
      articles: resetArt,
      quizQuestions: resetQuiz,
      faqs: resetFaqs,
      proofs: resetProofs
    });
    onSettingsUpdated(resetSettings);
    setConfirmReset(false);
    triggerToast('Reset all CMS settings, brokers, blogs, FAQs, proofs & quiz to defaults.');
  };

  // CMS Handlers
  const handleCmsFieldChange = (key: string, value: string) => {
    updateSettingsWithHistory(
      (prev) => ({
        ...prev,
        cmsOverrides: {
          ...(prev.cmsOverrides || {}),
          [key]: value
        }
      }),
      true
    );
  };

  const handleResetCmsField = (key: string) => {
    updateSettingsWithHistory((prev) => {
      const next = { ...(prev.cmsOverrides || {}) };
      delete next[key];
      return { ...prev, cmsOverrides: next };
    });
  };

  const handleToggleSection = (sectionId: string) => {
    playClickSound('click');
    updateSettingsWithHistory((prev) => {
      const hidden = prev.hiddenSections || [];
      const exists = hidden.includes(sectionId);
      return {
        ...prev,
        hiddenSections: exists ? hidden.filter((id) => id !== sectionId) : [...hidden, sectionId]
      };
    });
  };

  const handleAddCustomBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockTitle.trim() || !newBlockBody.trim()) return;
    playClickSound('calculate');
    const block: CustomContentBlock = {
      id: `block-${Date.now()}`,
      page: newBlockPage,
      title: newBlockTitle.trim(),
      body: newBlockBody.trim(),
      ctaLabel: newBlockCtaLabel.trim() || undefined,
      ctaUrl: newBlockCtaUrl.trim() || undefined,
      active: true
    };
    updateSettingsWithHistory((prev) => ({
      ...prev,
      customBlocks: [block, ...(prev.customBlocks || [])]
    }));
    setNewBlockTitle('');
    setNewBlockBody('');
    setNewBlockCtaLabel('');
    setNewBlockCtaUrl('');
  };

  const handleDeleteCustomBlock = (id: string) => {
    playClickSound('click');
    updateSettingsWithHistory((prev) => ({
      ...prev,
      customBlocks: (prev.customBlocks || []).filter((b) => b.id !== id)
    }));
  };

  // Article / Blog CRUD
  const handleStartEditArticle = (article: Article) => {
    setEditingArticleId(article.id);
    setArticleDraft({ ...article });
  };

  const handleSaveArticleDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleDraft.title?.trim()) return;
    playClickSound('calculate');

    const cleanedTakeaways = (articleDraft.keyTakeaways || [])
      .map((item) => item.trim())
      .filter(Boolean);

    let updated: Article[];
    if (editingArticleId) {
      updated = articlesList.map((a) =>
        a.id === editingArticleId
          ? {
              ...a,
              title: articleDraft.title || a.title,
              subtitle: articleDraft.subtitle || a.subtitle,
              category: (articleDraft.category as Article['category']) || a.category,
              readTime: articleDraft.readTime || a.readTime,
              author: articleDraft.author || a.author,
              authorRole: articleDraft.authorRole || a.authorRole,
              summary: articleDraft.summary || a.summary,
              content: articleDraft.content || a.content,
              keyTakeaways:
                cleanedTakeaways.length > 0 ? cleanedTakeaways : a.keyTakeaways
            }
          : a
      );
      setEditingArticleId(null);
    } else {
      const created: Article = {
        id: `custom-art-${Date.now()}`,
        slug: articleDraft.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 60) || `article-${Date.now()}`,
        title: articleDraft.title.trim(),
        subtitle: articleDraft.subtitle?.trim() || 'TradeVortex Market Briefing',
        category: (articleDraft.category as Article['category']) || 'Beginner',
        readTime: articleDraft.readTime || '6 min read',
        date: 'Updated 2026',
        author: articleDraft.author || 'Bilal Editorial Desk',
        authorRole: articleDraft.authorRole || 'Senior Strategist',
        summary: articleDraft.summary?.trim() || articleDraft.subtitle?.trim() || 'Institutional guide.',
        content: articleDraft.content?.trim() || '### Key Insight\n\nFull trading guide published via TradeVortex CMS.',
        keyTakeaways:
          cleanedTakeaways.length > 0
            ? cleanedTakeaways
            : ['Disciplined 1%–2% risk management protects capital across all market cycles.'],
        faqs: []
      };
      updated = [created, ...articlesList];
    }

    setArticlesList(updated);
    saveArticles(updated);
    pushHistorySnapshot({
      ...snapshotRef.current,
      articlesList: updated
    });

    setArticleDraft({
      title: '',
      subtitle: '',
      category: 'Beginner',
      readTime: '6 min read',
      author: 'Bilal Editorial Desk',
      authorRole: 'Market Strategist',
      summary: '',
      content: '',
      keyTakeaways: []
    });
    triggerToast();
  };

  const handleDeleteArticle = (id: string) => {
    playClickSound('click');
    const updated = articlesList.filter((a) => a.id !== id);
    setArticlesList(updated);
    saveArticles(updated);
    pushHistorySnapshot({
      ...snapshotRef.current,
      articlesList: updated
    });
    triggerToast();
  };

  // Quiz CRUD
  const handleStartEditQuiz = (q: QuizQuestion) => {
    setEditingQuizId(q.id);
    setQuizDraft({
      question: q.question,
      opt0: q.options[0] || '',
      opt1: q.options[1] || '',
      opt2: q.options[2] || '',
      opt3: q.options[3] || '',
      correctIndex: q.correctIndex,
      explanation: q.explanation
    });
  };

  const handleSaveQuizDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizDraft.question.trim() || !quizDraft.opt0.trim() || !quizDraft.opt1.trim()) return;
    playClickSound('calculate');
    const opts = [quizDraft.opt0, quizDraft.opt1, quizDraft.opt2 || 'None of the above', quizDraft.opt3 || 'All of the above'];

    let updated: QuizQuestion[];
    if (editingQuizId !== null) {
      updated = quizList.map((q) =>
        q.id === editingQuizId
          ? {
              ...q,
              question: quizDraft.question.trim(),
              options: opts,
              correctIndex: quizDraft.correctIndex,
              explanation: quizDraft.explanation.trim()
            }
          : q
      );
      setEditingQuizId(null);
    } else {
      const created: QuizQuestion = {
        id: Date.now(),
        question: quizDraft.question.trim(),
        options: opts,
        correctIndex: quizDraft.correctIndex,
        explanation: quizDraft.explanation.trim() || 'Verified TradeVortex risk rule.'
      };
      updated = [...quizList, created];
    }

    setQuizList(updated);
    saveQuizQuestions(updated);
    pushHistorySnapshot({
      ...snapshotRef.current,
      quizList: updated
    });

    setQuizDraft({
      question: '',
      opt0: '',
      opt1: '',
      opt2: '',
      opt3: '',
      correctIndex: 0,
      explanation: ''
    });
    triggerToast();
  };

  const handleDeleteQuiz = (id: number) => {
    if (quizList.length <= 1) return;
    playClickSound('click');
    const updated = quizList.filter((q) => q.id !== id);
    setQuizList(updated);
    saveQuizQuestions(updated);
    pushHistorySnapshot({
      ...snapshotRef.current,
      quizList: updated
    });
    triggerToast();
  };

  // Broker CRUD & Calculator Toggles
  const handleBrokerFieldUpdate = (id: string, field: keyof Broker, val: string) => {
    const nextBrokers = brokersList.map((b) =>
      b.id === id
        ? {
            ...b,
            [field]: field === 'rating' ? Math.min(5, Math.max(1, parseFloat(val) || 4.8)) : val
          }
        : b
    );
    setBrokersList(nextBrokers);
    saveBrokers(nextBrokers);
    let nextSettings = settings;
    if (field === 'affiliateUrl') {
      nextSettings = {
        ...settings,
        brokerLinks: {
          ...(settings.brokerLinks || {}),
          [id]: val
        }
      };
      setSettings(nextSettings);
    }
    pushHistorySnapshot(
      {
        ...snapshotRef.current,
        settings: nextSettings,
        brokersList: nextBrokers
      },
      true
    );
  };

  const handleBrokerBooleanToggle = (
    id: string,
    field: 'rawSpreadEcn' | 'swapFree' | 'instantWithdrawal'
  ) => {
    playClickSound('click');
    const nextBrokers = brokersList.map((b) => {
      if (b.id !== id) return b;
      const nextVal = !Boolean(b[field]);
      const updated = { ...b, [field]: nextVal };
      const tags: ('raw-ecn' | 'swap-free' | 'instant-withdrawal')[] = [];
      if (updated.rawSpreadEcn) tags.push('raw-ecn');
      if (updated.swapFree !== false) tags.push('swap-free');
      if (updated.instantWithdrawal) tags.push('instant-withdrawal');
      return { ...updated, filterTags: tags };
    });
    setBrokersList(nextBrokers);
    saveBrokers(nextBrokers);
    pushHistorySnapshot({
      ...snapshotRef.current,
      brokersList: nextBrokers
    });
  };

  const handleAddBrokerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrokerDraft.name.trim()) return;
    playClickSound('calculate');
    const id = newBrokerDraft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-3);
    const parsedRating = Math.min(5, Math.max(1, parseFloat(newBrokerDraft.rating) || 4.8));
    const created: Broker = {
      id,
      name: newBrokerDraft.name.trim(),
      logo: '',
      rating: parsedRating,
      reviewCount: 420,
      minDeposit: newBrokerDraft.minDeposit || '$10',
      maxLeverage: newBrokerDraft.maxLeverage || '1:500',
      spreadFrom: newBrokerDraft.spreadFrom || '0.0 pips',
      regulation: ['FCA', 'ASIC'],
      platforms: ['MT4', 'MT5', 'WebTrader'],
      category: newBrokerDraft.category,
      affiliateUrl: newBrokerDraft.affiliateUrl || 'https://',
      pros: ['Verified fast execution', 'Low minimum deposit'],
      cons: ['Standard CFD market risk applies'],
      badge: newBrokerDraft.badge || 'Verified Partner',
      specialOffer: newBrokerDraft.specialOffer.trim() || undefined,
      description: newBrokerDraft.description || 'Added via TradeVortex Admin Console.',
      depositMethods: ['Cards', 'Crypto', 'Bank Wire']
    };
    const nextBrokers = [...brokersList, created];
    const nextSettings: AdminSettings = {
      ...settings,
      brokerLinks: { ...(settings.brokerLinks || {}), [id]: created.affiliateUrl }
    };
    setBrokersList(nextBrokers);
    setSettings(nextSettings);
    saveBrokers(nextBrokers);
    pushHistorySnapshot({
      ...snapshotRef.current,
      settings: nextSettings,
      brokersList: nextBrokers
    });
    setShowAddBroker(false);
    setNewBrokerDraft({
      name: '',
      minDeposit: '$10',
      maxLeverage: '1:500',
      spreadFrom: '0.0 pips',
      category: 'Multi-Asset',
      badge: 'Verified Partner',
      specialOffer: '',
      rating: '4.8',
      description: '',
      affiliateUrl: 'https://'
    });
    triggerToast();
  };

  const handleDeleteBroker = (id: string) => {
    if (brokersList.length <= 1) return;
    playClickSound('click');
    const next = brokersList.filter((b) => b.id !== id);
    setBrokersList(next);
    saveBrokers(next);
    pushHistorySnapshot({
      ...snapshotRef.current,
      brokersList: next
    });
    triggerToast();
  };

  const handleResetBrokersToDefault10 = () => {
    playClickSound('toggle');
    const defaults = resetBrokersToDefault();
    const nextLinks: Record<string, string> = {};
    defaults.forEach((b) => {
      nextLinks[b.id] = b.affiliateUrl;
    });
    const nextSettings: AdminSettings = {
      ...settings,
      brokerLinks: nextLinks
    };
    setBrokersList(defaults);
    setSettings(nextSettings);
    pushHistorySnapshot({
      ...snapshotRef.current,
      settings: nextSettings,
      brokersList: defaults
    });
    triggerToast('Restored all 10 verified default brokers.');
  };

  const handleFaqsChange = (nextFaqs: FAQItem[]) => {
    setFaqsList(nextFaqs);
    saveFaqs(nextFaqs);
    const nextSettings: AdminSettings = {
      ...settings,
      homeFaqs: nextFaqs
    };
    setSettings(nextSettings);
    pushHistorySnapshot({
      ...snapshotRef.current,
      settings: nextSettings,
      faqsList: nextFaqs
    });
  };

  const handleProofsChange = (nextProofs: CommunityProof[]) => {
    setProofsList(nextProofs);
    saveCommunityProofs(nextProofs);
    const nextSettings: AdminSettings = {
      ...settings,
      communityProofs: nextProofs
    };
    setSettings(nextSettings);
    pushHistorySnapshot({
      ...snapshotRef.current,
      settings: nextSettings,
      proofsList: nextProofs
    });
  };

  const handleToggleCalculator = (calcId: CalculatorTab) => {
    playClickSound('click');
    updateSettingsWithHistory((prev) => {
      const disabled = prev.disabledCalculators || [];
      const exists = disabled.includes(calcId);
      return {
        ...prev,
        disabledCalculators: exists ? disabled.filter((c) => c !== calcId) : [...disabled, calcId]
      };
    });
  };

  // Sponsor Handlers
  const handleToggleSponsor = (sponsorId: string) => {
    playClickSound('toggle');
    updateSettingsWithHistory((prev) => ({
      ...prev,
      sponsorDeals: prev.sponsorDeals.map((deal) =>
        deal.id === sponsorId ? { ...deal, active: !deal.active } : deal
      )
    }));
  };

  const handleDeleteSponsor = (sponsorId: string) => {
    playClickSound('click');
    updateSettingsWithHistory((prev) => ({
      ...prev,
      sponsorDeals: prev.sponsorDeals.filter((deal) => deal.id !== sponsorId)
    }));
  };

  const handleAddSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSponsor.companyName || !newSponsor.targetUrl) return;

    const createdDeal: SponsorDeal = {
      id: `sponsor-${Date.now()}`,
      companyName: newSponsor.companyName || 'Brand Partner',
      dealPrice: newSponsor.dealPrice || '$1,000/mo',
      startDate: newSponsor.startDate || new Date().toISOString().split('T')[0],
      expiryDate: newSponsor.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bannerImageUrl: newSponsor.bannerImageUrl,
      bannerScript: newSponsor.bannerScript,
      targetUrl: newSponsor.targetUrl || 'https://',
      placement: (newSponsor.placement as SponsorDeal['placement']) || 'all',
      active: true,
      notes: newSponsor.notes || ''
    };

    updateSettingsWithHistory((prev) => ({
      ...prev,
      sponsorDeals: [createdDeal, ...prev.sponsorDeals]
    }));
    setShowAddSponsorModal(false);
    playClickSound('calculate');
  };

  const activeSponsors = settings.sponsorDeals?.filter((d) => d.active) || [];
  const totalRevenueNumber = activeSponsors.reduce((acc, deal) => {
    const match = deal.dealPrice.replace(/[^0-9.]/g, '');
    return acc + (parseFloat(match) || 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-5xl rounded-2xl border border-cyan-500/40 bg-slate-900 shadow-2xl shadow-cyan-950/70 p-5 sm:p-7 my-6 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-inner">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  TradeVortex Full CMS & Monetization Console
                </h2>
                <span className="rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Admin Access
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage site copy, sections, articles, quiz questions, brokers, calculators, AdSense, and sponsors live.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <div className="flex items-center gap-1.5 mr-1">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={!canUndo}
                  title="Undo last Admin Panel edit (up to 30 steps)"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-cyan-500/50 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Undo</span>
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={!canRedo}
                  title="Redo undone Admin Panel edit"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-cyan-500/50 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Redo2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Redo</span>
                </button>
                <span className="hidden md:inline-block rounded bg-slate-800 px-2 py-1 text-[10px] font-mono text-slate-400 border border-slate-700">
                  {historyIndex + 1}/{historyStack.length}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                playClickSound('click');
                onClose();
              }}
              aria-label="Close Admin Panel"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Saved Toast Notification */}
        {toastMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300 font-medium shrink-0">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* SCREEN 1: LOGIN FORM */}
        {!isAuthenticated ? (
          <div className="py-6 my-auto">
            <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto">
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block mb-0.5 text-sm">Administrator Authentication</strong>
                  Sign in with your administrator credentials to unlock full-site CMS editing, AdSense slot injection, and partner controls.
                </div>
              </div>

              {authError && (
                <div className="rounded-lg border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-300 font-medium">
                  {authError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider font-mono">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider font-mono">
                  Security Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-3 text-xs font-extrabold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-lg shadow-cyan-500/25 uppercase tracking-wider"
              >
                <Lock className="h-4 w-4" />
                <span>Verify Credentials & Enter Console</span>
              </button>
            </form>
          </div>
        ) : (
          /* SCREEN 2: FULL CMS DASHBOARD */
          <div className="flex flex-col flex-1 overflow-hidden space-y-4">
            {/* Dashboard Tabs Bar */}
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2.5 overflow-x-auto text-xs font-medium shrink-0">
              {[
                { id: 'analytics', label: 'Live Analytics & Views', icon: <BarChart3 className="h-3.5 w-3.5" /> },
                { id: 'builder', label: 'Site Builder & Media', icon: <Layers className="h-3.5 w-3.5" /> },
                { id: 'cloud', label: 'Cloud Sync Config', icon: <Cloud className="h-3.5 w-3.5" /> },
                { id: 'cms', label: 'Site Text & Sections', icon: <LayoutGrid className="h-3.5 w-3.5" /> },
                { id: 'brokers', label: `Brokers & Calcs (${brokersList.length})`, icon: <LinkIcon className="h-3.5 w-3.5" /> },
                { id: 'articles', label: `Blogs Manager (${articlesList.length})`, icon: <FileText className="h-3.5 w-3.5" /> },
                { id: 'faqs', label: `30 FAQs (${faqsList.length})`, icon: <MessageSquare className="h-3.5 w-3.5" /> },
                { id: 'proofs', label: `Winning Proofs (${proofsList.length})`, icon: <Award className="h-3.5 w-3.5" /> },
                { id: 'quiz', label: `Quiz (${quizList.length})`, icon: <HelpCircle className="h-3.5 w-3.5" /> },
                { id: 'adsense', label: 'AdSense Slots', icon: <Code2 className="h-3.5 w-3.5" /> },
                { id: 'sponsors', label: `Sponsors (${settings.sponsorDeals?.length || 0})`, icon: <DollarSign className="h-3.5 w-3.5" /> },
                { id: 'theme', label: 'Theme UI', icon: <Palette className="h-3.5 w-3.5" /> },
                { id: 'telegram', label: 'Telegram', icon: <Send className="h-3.5 w-3.5" /> },
                { id: 'social', label: 'Social & Support', icon: <Share2 className="h-3.5 w-3.5" /> }
              ].map((tabItem) => (
                <button
                  key={tabItem.id}
                  type="button"
                  onClick={() => {
                    playClickSound('click');
                    setActiveTab(tabItem.id as AdminTab);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tabItem.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tabItem.icon}
                  <span>{tabItem.label}</span>
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-5">
              {/* TAB: LIVE ANALYTICS & VIEWS */}
              {activeTab === 'analytics' && <AdminAnalyticsDashboard />}

              {/* TAB: UNIVERSAL SITE BUILDER & MEDIA MANAGER */}
              {activeTab === 'builder' && (
                <AdminSiteBuilderMediaTab
                  settings={settings}
                  onUpdateSettings={(updater) => updateSettingsWithHistory(updater, false)}
                  onAddBroker={(broker) => {
                    const nextBrokers = [broker, ...brokersList];
                    const nextSettings: AdminSettings = {
                      ...settings,
                      brokerLinks: { ...(settings.brokerLinks || {}), [broker.id]: broker.affiliateUrl }
                    };
                    setBrokersList(nextBrokers);
                    setSettings(nextSettings);
                    saveBrokers(nextBrokers);
                    pushHistorySnapshot({
                      ...snapshotRef.current,
                      settings: nextSettings,
                      brokersList: nextBrokers
                    });
                    triggerToast(`Added broker "${broker.name}". Click Save & Publish Globally to sync worldwide.`);
                  }}
                  onAddArticle={(article) => {
                    const updated = [article, ...articlesList];
                    setArticlesList(updated);
                    saveArticles(updated);
                    pushHistorySnapshot({
                      ...snapshotRef.current,
                      articlesList: updated
                    });
                    triggerToast(`Published "${article.title}". Click Save & Publish Globally to sync worldwide.`);
                  }}
                />
              )}

              {/* TAB: 30 TRADING FAQS MANAGER */}
              {activeTab === 'faqs' && (
                <AdminFaqsManagerTab
                  faqsList={faqsList}
                  onChangeFaqs={handleFaqsChange}
                  onNotify={(msg) => triggerToast(msg)}
                />
              )}

              {/* TAB: VERIFIED COMMUNITY REVIEWS & WINNING PROOFS */}
              {activeTab === 'proofs' && (
                <AdminCommunityProofsTab
                  proofsList={proofsList}
                  onChangeProofs={handleProofsChange}
                  showCommunityProofs={Boolean(settings.showCommunityProofs)}
                  onTogglePublicVisibility={(visible) => {
                    updateSettingsWithHistory((prev) => ({
                      ...prev,
                      showCommunityProofs: visible
                    }));
                    triggerToast(
                      visible
                        ? 'Community Reviews enabled! Click Save & Publish Globally to display live.'
                        : 'Community Reviews hidden from public Home Page.'
                    );
                  }}
                  onNotify={(msg) => triggerToast(msg)}
                />
              )}

              {/* TAB: CLOUD SYNC CONFIG */}
              {activeTab === 'cloud' && (
                <AdminCloudSyncTab
                  settings={settings}
                  onTriggerCloudPublish={handleSaveAll}
                />
              )}
              {/* TAB: SITE TEXT, HEADINGS, SECTIONS & CUSTOM BLOCKS */}
              {activeTab === 'cms' && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                      Edit Any Site Heading, Label, or Notice
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {CMS_TEXT_FIELDS.map((field) => {
                        const val = settings.cmsOverrides?.[field.key] ?? '';
                        return (
                          <div key={field.key} className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-slate-300">
                              <span className="font-semibold">{field.label}</span>
                              {val && (
                                <button
                                  type="button"
                                  onClick={() => handleResetCmsField(field.key)}
                                  className="text-amber-400 hover:underline text-[10px]"
                                >
                                  Restore Default
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              value={val}
                              placeholder={field.placeholder}
                              onChange={(e) => handleCmsFieldChange(field.key, e.target.value)}
                              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section Visibility Toggles */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                      Show / Hide Homepage & Portal Sections
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {TOGGLEABLE_SECTIONS.map((sec) => {
                        const isHidden = (settings.hiddenSections || []).includes(sec.id);
                        return (
                          <button
                            key={sec.id}
                            type="button"
                            onClick={() => handleToggleSection(sec.id)}
                            className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                              !isHidden
                                ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                                : 'border-rose-500/30 bg-rose-950/15 text-rose-300'
                            }`}
                          >
                            <span className="truncate pr-2">{sec.label}</span>
                            <span className="text-[10px] font-mono uppercase">
                              {isHidden ? 'Hidden' : 'Visible'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Custom Content Block */}
                  <form
                    onSubmit={handleAddCustomBlock}
                    className="rounded-xl border border-cyan-500/30 bg-slate-950/70 p-4 space-y-3"
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                      Add Custom Announcement / Content Block
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        value={newBlockTitle}
                        onChange={(e) => setNewBlockTitle(e.target.value)}
                        placeholder="Block Headline (e.g. Weekend Gold Outlook)"
                        className="sm:col-span-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                      <select
                        value={newBlockPage}
                        onChange={(e) => setNewBlockPage(e.target.value as PageView | 'all')}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 font-mono"
                      >
                        <option value="all">All Pages</option>
                        <option value="home">Home</option>
                        <option value="calculators">Calculators</option>
                        <option value="markets">Markets</option>
                        <option value="brokers">Brokers</option>
                        <option value="academy">Academy</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      required
                      value={newBlockBody}
                      onChange={(e) => setNewBlockBody(e.target.value)}
                      placeholder="Write your custom notice, insight, or educational section text..."
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                      <input
                        type="text"
                        value={newBlockCtaLabel}
                        onChange={(e) => setNewBlockCtaLabel(e.target.value)}
                        placeholder="Optional CTA Button Text"
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="url"
                        value={newBlockCtaUrl}
                        onChange={(e) => setNewBlockCtaUrl(e.target.value)}
                        placeholder="Optional CTA URL (https://...)"
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-cyan-400"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Block</span>
                      </button>
                    </div>

                    {(settings.customBlocks || []).length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        {(settings.customBlocks || []).map((blk) => (
                          <div
                            key={blk.id}
                            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs"
                          >
                            <div className="truncate pr-3">
                              <span className="font-mono text-cyan-400 mr-2">[{blk.page}]</span>
                              <span className="font-bold text-white">{blk.title}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomBlock(blk.id)}
                              className="text-rose-400 hover:text-rose-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* TAB: ARTICLES CRUD */}
              {activeTab === 'articles' && (
                <div className="space-y-4">
                  <form
                    onSubmit={handleSaveArticleDraft}
                    className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                        {editingArticleId ? 'Editing Selected Blog Post' : 'Create New Trading Blog Post'}
                      </h4>
                      {editingArticleId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingArticleId(null);
                            setArticleDraft({
                              title: '',
                              subtitle: '',
                              category: 'Beginner',
                              readTime: '6 min read',
                              author: 'Bilal Editorial Desk',
                              authorRole: 'Market Strategist',
                              summary: '',
                              content: '',
                              keyTakeaways: []
                            });
                          }}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <input
                        type="text"
                        required
                        value={articleDraft.title || ''}
                        onChange={(e) => setArticleDraft((p) => ({ ...p, title: e.target.value }))}
                        placeholder="Blog Title *"
                        className="sm:col-span-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                      <select
                        value={articleDraft.category || 'Beginner'}
                        onChange={(e) =>
                          setArticleDraft((p) => ({ ...p, category: e.target.value as Article['category'] }))
                        }
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Risk Management">Risk Management</option>
                        <option value="Technical Analysis">Technical Analysis</option>
                        <option value="Commodities & Indices">Commodities &amp; Indices</option>
                        <option value="Psychology">Psychology</option>
                      </select>
                      <input
                        type="text"
                        value={articleDraft.readTime || ''}
                        onChange={(e) => setArticleDraft((p) => ({ ...p, readTime: e.target.value }))}
                        placeholder="Read Time (e.g. 8 min read)"
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={articleDraft.subtitle || ''}
                        onChange={(e) => setArticleDraft((p) => ({ ...p, subtitle: e.target.value }))}
                        placeholder="Subtitle / Hook"
                        className="sm:col-span-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={articleDraft.author || ''}
                        onChange={(e) => setArticleDraft((p) => ({ ...p, author: e.target.value }))}
                        placeholder="Author Name"
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={articleDraft.summary || ''}
                      onChange={(e) => setArticleDraft((p) => ({ ...p, summary: e.target.value }))}
                      placeholder="Blog Card Summary (shown on Home Page & Academy cards)"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                    />

                    <textarea
                      rows={5}
                      value={articleDraft.content || ''}
                      onChange={(e) => setArticleDraft((p) => ({ ...p, content: e.target.value }))}
                      placeholder="Full Blog Markdown Content (### Headings, bullet lists, > quotes...)"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white font-mono"
                    />

                    <textarea
                      rows={2}
                      value={(articleDraft.keyTakeaways || []).join('\n')}
                      onChange={(e) =>
                        setArticleDraft((p) => ({
                          ...p,
                          keyTakeaways: e.target.value.split('\n')
                        }))
                      }
                      placeholder="Key Takeaways (one bullet per line)"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-emerald-300 font-mono"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-cyan-400"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>{editingArticleId ? 'Update Blog Post' : 'Publish Blog Post'}</span>
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {articlesList.map((art) => (
                      <div
                        key={art.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs"
                      >
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono text-cyan-400 uppercase">{art.category}</span>
                          <div className="font-bold text-white truncate">{art.title}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditArticle(art)}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-cyan-300 hover:border-cyan-500 flex items-center gap-1"
                          >
                            <Edit3 className="h-3 w-3" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(art.id)}
                            className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-950/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: QUIZ QUESTIONS CRUD */}
              {activeTab === 'quiz' && (
                <div className="space-y-4">
                  <form
                    onSubmit={handleSaveQuizDraft}
                    className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                        {editingQuizId !== null ? 'Edit Quiz Question' : 'Add New Certification Quiz Question'}
                      </h4>
                      {editingQuizId !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingQuizId(null);
                            setQuizDraft({
                              question: '',
                              opt0: '',
                              opt1: '',
                              opt2: '',
                              opt3: '',
                              correctIndex: 0,
                              explanation: ''
                            });
                          }}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      required
                      value={quizDraft.question}
                      onChange={(e) => setQuizDraft((p) => ({ ...p, question: e.target.value }))}
                      placeholder="Question Prompt *"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        required
                        value={quizDraft.opt0}
                        onChange={(e) => setQuizDraft((p) => ({ ...p, opt0: e.target.value }))}
                        placeholder="Option A *"
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        required
                        value={quizDraft.opt1}
                        onChange={(e) => setQuizDraft((p) => ({ ...p, opt1: e.target.value }))}
                        placeholder="Option B *"
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={quizDraft.opt2}
                        onChange={(e) => setQuizDraft((p) => ({ ...p, opt2: e.target.value }))}
                        placeholder="Option C"
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={quizDraft.opt3}
                        onChange={(e) => setQuizDraft((p) => ({ ...p, opt3: e.target.value }))}
                        placeholder="Option D"
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                      <select
                        value={quizDraft.correctIndex}
                        onChange={(e) =>
                          setQuizDraft((p) => ({ ...p, correctIndex: parseInt(e.target.value, 10) || 0 }))
                        }
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-emerald-300 font-mono"
                      >
                        <option value={0}>Correct: Option A</option>
                        <option value={1}>Correct: Option B</option>
                        <option value={2}>Correct: Option C</option>
                        <option value={3}>Correct: Option D</option>
                      </select>

                      <input
                        type="text"
                        value={quizDraft.explanation}
                        onChange={(e) => setQuizDraft((p) => ({ ...p, explanation: e.target.value }))}
                        placeholder="Explanation shown after answering"
                        className="sm:col-span-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-cyan-400"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>{editingQuizId !== null ? 'Update Question' : 'Add Question'}</span>
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {quizList.map((q, idx) => (
                      <div
                        key={q.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs"
                      >
                        <div className="min-w-0">
                          <span className="font-mono text-cyan-400 mr-2">Q{idx + 1}.</span>
                          <span className="font-semibold text-white">{q.question}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditQuiz(q)}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-cyan-300 hover:border-cyan-500 flex items-center gap-1"
                          >
                            <Edit3 className="h-3 w-3" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuiz(q.id)}
                            className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-950/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: BROKERS & CALCULATORS CRUD */}
              {activeTab === 'brokers' && (
                <div className="space-y-5">
                  {/* Calculator Visibility Toggles */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                      Enable / Disable Calculators in Hub
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {CALCULATOR_OPTIONS.map((calc) => {
                        const isDisabled = (settings.disabledCalculators || []).includes(calc.id);
                        return (
                          <button
                            key={calc.id}
                            type="button"
                            onClick={() => handleToggleCalculator(calc.id)}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold ${
                              !isDisabled
                                ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                                : 'border-slate-800 bg-slate-900 text-slate-400'
                            }`}
                          >
                            <span className="truncate pr-1">{calc.label}</span>
                            <span className="text-[10px] font-mono">{isDisabled ? 'OFF' : 'ON'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* VIP Partner Benefits Banner Editor */}
                  {(() => {
                    const vip = settings.vipPartnerBanner || DEFAULT_VIP_PARTNER_BANNER;
                    return (
                      <div className="rounded-xl border border-cyan-500/30 bg-slate-950/75 p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                            VIP Partner Benefits Banner (Displayed Above Brokers)
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              updateSettingsWithHistory((prev) => ({
                                ...prev,
                                vipPartnerBanner: {
                                  ...(prev.vipPartnerBanner || DEFAULT_VIP_PARTNER_BANNER),
                                  enabled: !(prev.vipPartnerBanner?.enabled ?? true)
                                }
                              }))
                            }
                            className={`rounded-lg px-3 py-1 text-[11px] font-bold font-mono ${
                              vip.enabled
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {vip.enabled ? 'BANNER ON' : 'BANNER OFF'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <input
                            type="text"
                            value={vip.badge}
                            onChange={(e) =>
                              updateSettingsWithHistory(
                                (prev) => ({
                                  ...prev,
                                  vipPartnerBanner: {
                                    ...(prev.vipPartnerBanner || DEFAULT_VIP_PARTNER_BANNER),
                                    badge: e.target.value
                                  }
                                }),
                                true
                              )
                            }
                            placeholder="Badge Label"
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 font-mono"
                          />
                          <input
                            type="text"
                            value={vip.title}
                            onChange={(e) =>
                              updateSettingsWithHistory(
                                (prev) => ({
                                  ...prev,
                                  vipPartnerBanner: {
                                    ...(prev.vipPartnerBanner || DEFAULT_VIP_PARTNER_BANNER),
                                    title: e.target.value
                                  }
                                }),
                                true
                              )
                            }
                            placeholder="VIP Banner Title"
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white font-semibold"
                          />
                          <input
                            type="text"
                            value={vip.ctaLabel}
                            onChange={(e) =>
                              updateSettingsWithHistory(
                                (prev) => ({
                                  ...prev,
                                  vipPartnerBanner: {
                                    ...(prev.vipPartnerBanner || DEFAULT_VIP_PARTNER_BANNER),
                                    ctaLabel: e.target.value
                                  }
                                }),
                                true
                              )
                            }
                            placeholder="CTA Button Label"
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-emerald-300 font-bold"
                          />
                        </div>

                        <input
                          type="text"
                          value={vip.subtitle}
                          onChange={(e) =>
                            updateSettingsWithHistory(
                              (prev) => ({
                                ...prev,
                                vipPartnerBanner: {
                                  ...(prev.vipPartnerBanner || DEFAULT_VIP_PARTNER_BANNER),
                                  subtitle: e.target.value
                                }
                              }),
                              true
                            )
                          }
                          placeholder="VIP Banner Subtitle"
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200"
                        />

                        <textarea
                          rows={2}
                          value={(vip.benefits || []).join('\n')}
                          onChange={(e) =>
                            updateSettingsWithHistory(
                              (prev) => ({
                                ...prev,
                                vipPartnerBanner: {
                                  ...(prev.vipPartnerBanner || DEFAULT_VIP_PARTNER_BANNER),
                                  benefits: e.target.value.split('\n')
                                }
                              }),
                              true
                            )
                          }
                          placeholder="VIP Benefits (one bullet per line)"
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-emerald-300 font-mono"
                        />
                      </div>
                    );
                  })()}

                  {/* Brokers Header + Add Button + Reset */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                      Manage Home Page 10 Tier-1 Brokers, Institutional Specs &amp; Referral URLs
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetBrokersToDefault10}
                        className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-amber-300 hover:border-amber-500/40"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reset 10 Default Brokers</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddBroker((s) => !s)}
                        className="flex items-center gap-1 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Broker</span>
                      </button>
                    </div>
                  </div>

                  {showAddBroker && (
                    <form
                      onSubmit={handleAddBrokerSubmit}
                      className="rounded-xl border border-cyan-500/40 bg-slate-950 p-4 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                        <input
                          type="text"
                          required
                          value={newBrokerDraft.name}
                          onChange={(e) => setNewBrokerDraft((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Broker Name *"
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={newBrokerDraft.minDeposit}
                          onChange={(e) => setNewBrokerDraft((p) => ({ ...p, minDeposit: e.target.value }))}
                          placeholder="Min Deposit ($10)"
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={newBrokerDraft.maxLeverage}
                          onChange={(e) => setNewBrokerDraft((p) => ({ ...p, maxLeverage: e.target.value }))}
                          placeholder="Max Leverage (1:500)"
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={newBrokerDraft.spreadFrom}
                          onChange={(e) => setNewBrokerDraft((p) => ({ ...p, spreadFrom: e.target.value }))}
                          placeholder="Spread (0.0 pips)"
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                        <select
                          value={newBrokerDraft.category}
                          onChange={(e) =>
                            setNewBrokerDraft((p) => ({ ...p, category: e.target.value as Broker['category'] }))
                          }
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300"
                        >
                          <option value="Multi-Asset">Multi-Asset</option>
                          <option value="Forex">Forex</option>
                          <option value="Crypto">Crypto</option>
                          <option value="Digital Options">Digital Options</option>
                        </select>
                        <input
                          type="text"
                          value={newBrokerDraft.badge}
                          onChange={(e) => setNewBrokerDraft((p) => ({ ...p, badge: e.target.value }))}
                          placeholder="Badge (e.g. Top Rated)"
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={newBrokerDraft.specialOffer}
                          onChange={(e) => setNewBrokerDraft((p) => ({ ...p, specialOffer: e.target.value }))}
                          placeholder="Special Offer (e.g. 50% Deposit Bonus)"
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-emerald-300"
                        />
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={newBrokerDraft.rating}
                          onChange={(e) => setNewBrokerDraft((p) => ({ ...p, rating: e.target.value }))}
                          placeholder="Rating (4.8)"
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-amber-300 font-mono"
                        />
                      </div>
                      <input
                        type="text"
                        value={newBrokerDraft.description}
                        onChange={(e) => setNewBrokerDraft((p) => ({ ...p, description: e.target.value }))}
                        placeholder="Broker Card Description"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <input
                          type="url"
                          required
                          value={newBrokerDraft.affiliateUrl}
                          onChange={(e) => setNewBrokerDraft((p) => ({ ...p, affiliateUrl: e.target.value }))}
                          placeholder="Affiliate Referral URL *"
                          className="sm:col-span-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 font-mono"
                        />
                        <button
                          type="submit"
                          className="rounded-lg bg-cyan-500 px-4 py-1.5 text-xs font-extrabold text-slate-950 hover:bg-cyan-400"
                        >
                          Save New Broker
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Broker List */}
                  <div className="space-y-3">
                    {brokersList.map((broker, idx) => (
                      <div
                        key={broker.id}
                        className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                            <input
                              type="text"
                              value={broker.name}
                              onChange={(e) => handleBrokerFieldUpdate(broker.id, 'name', e.target.value)}
                              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-bold text-white"
                            />
                            <select
                              value={broker.category}
                              onChange={(e) => handleBrokerFieldUpdate(broker.id, 'category', e.target.value)}
                              className="text-[10px] font-mono text-cyan-300 px-2 py-1 rounded bg-cyan-950 border border-cyan-500/30"
                            >
                              <option value="Multi-Asset">Multi-Asset</option>
                              <option value="Forex">Forex</option>
                              <option value="Crypto">Crypto</option>
                              <option value="Digital Options">Digital Options</option>
                            </select>
                            <input
                              type="number"
                              step="0.1"
                              min="1"
                              max="5"
                              value={broker.rating}
                              onChange={(e) => handleBrokerFieldUpdate(broker.id, 'rating', e.target.value)}
                              title="Star Rating (1.0 - 5.0)"
                              className="w-16 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-mono text-amber-300"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={broker.affiliateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline font-mono"
                            >
                              <span>Test Link</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteBroker(broker.id)}
                              className="p-1 text-rose-400 hover:bg-rose-950/30 rounded"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                          <input
                            type="text"
                            value={broker.minDeposit}
                            onChange={(e) => handleBrokerFieldUpdate(broker.id, 'minDeposit', e.target.value)}
                            placeholder="Min Deposit"
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 font-mono"
                          />
                          <input
                            type="text"
                            value={broker.maxLeverage}
                            onChange={(e) => handleBrokerFieldUpdate(broker.id, 'maxLeverage', e.target.value)}
                            placeholder="Leverage"
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 font-mono"
                          />
                          <input
                            type="text"
                            value={broker.spreadFrom}
                            onChange={(e) => handleBrokerFieldUpdate(broker.id, 'spreadFrom', e.target.value)}
                            placeholder="Spread"
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 font-mono"
                          />
                          <input
                            type="text"
                            value={broker.executionSpeed || ''}
                            onChange={(e) => handleBrokerFieldUpdate(broker.id, 'executionSpeed', e.target.value)}
                            placeholder="Execution (< 25ms)"
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-cyan-300 font-mono"
                          />
                          <input
                            type="text"
                            value={broker.badge || ''}
                            onChange={(e) => handleBrokerFieldUpdate(broker.id, 'badge', e.target.value)}
                            placeholder="Badge"
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-200"
                          />
                          <input
                            type="text"
                            value={broker.specialOffer || ''}
                            onChange={(e) => handleBrokerFieldUpdate(broker.id, 'specialOffer', e.target.value)}
                            placeholder="Special Offer"
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-emerald-300"
                          />
                        </div>

                        {/* Institutional Filter Tags Toggles */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          <span className="text-[10px] font-mono uppercase text-slate-400">Filter Tags:</span>
                          {(
                            [
                              ['rawSpreadEcn', '0.0 Raw Spread (Pro/ECN)'],
                              ['swapFree', 'Swap-Free (Islamic)'],
                              ['instantWithdrawal', 'Instant Withdrawal']
                            ] as const
                          ).map(([tagField, tagLabel]) => {
                            const active =
                              tagField === 'swapFree'
                                ? broker.swapFree !== false
                                : Boolean(broker[tagField]);
                            return (
                              <button
                                key={tagField}
                                type="button"
                                onClick={() => handleBrokerBooleanToggle(broker.id, tagField)}
                                className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold border transition-colors ${
                                  active
                                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                                    : 'border-slate-700 bg-slate-900 text-slate-400'
                                }`}
                              >
                                {tagLabel}: {active ? 'ON' : 'OFF'}
                              </button>
                            );
                          })}
                        </div>

                        <input
                          type="text"
                          value={broker.description}
                          onChange={(e) => handleBrokerFieldUpdate(broker.id, 'description', e.target.value)}
                          placeholder={`Short description for ${broker.name}...`}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200"
                        />

                        <input
                          type="url"
                          value={broker.affiliateUrl}
                          onChange={(e) => handleBrokerFieldUpdate(broker.id, 'affiliateUrl', e.target.value)}
                          placeholder={`Affiliate tracking URL for ${broker.name}...`}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: GOOGLE ADSENSE & PAGE-LEVEL SLOTS */}
              {activeTab === 'adsense' && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
                    <Code2 className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-cyan-300 mb-0.5 text-sm">
                        Page-Specific Google AdSense Slots Architecture
                      </h4>
                      <p>
                        Configure distinct <code className="text-cyan-300 font-mono">data-ad-slot</code> IDs for each page and section to serve targeted contextual ads and control the mobile sticky anchor banner.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider font-mono">
                        Global AdSense Publisher ID (data-ad-client)
                      </label>
                      <input
                        type="text"
                        value={settings.adSensePublisherId || ''}
                        onChange={(e) =>
                          updateSettingsWithHistory(
                            (prev) => ({ ...prev, adSensePublisherId: e.target.value }),
                            true
                          )
                        }
                        placeholder="ca-pub-9482910482910482"
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                          Mobile-Sticky Anchor Ad
                        </label>
                        <span className="text-[10px] text-slate-400">
                          Fixed responsive bottom ad for mobile screens (320x50).
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-2">
                        <input
                          type="checkbox"
                          checked={settings.mobileAnchorAdEnabled}
                          onChange={(e) =>
                            updateSettingsWithHistory((prev) => ({
                              ...prev,
                              mobileAnchorAdEnabled: e.target.checked
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono block">
                      Isolated Page Ad Slot Identifiers (data-ad-slot)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(
                        [
                          ['homeHeader', 'Home Top Leaderboard Slot'],
                          ['homeInFeed', 'Home Native In-Feed Slot'],
                          ['calcTop', 'Calculators Hub Top Slot'],
                          ['calcSidebar', 'Calculators Sidebar Slot'],
                          ['calcInterstitial', 'Calculators 5s Interstitial Slot'],
                          ['brokersHeader', 'Broker Directory Header Slot'],
                          ['signalsInContent', 'Daily Signals In-Feed Slot'],
                          ['academyArticle', 'Academy Article Sidebar Slot'],
                          ['mobileAnchor', 'Mobile Sticky Anchor Slot']
                        ] as const
                      ).map(([slotKey, slotLabel]) => (
                        <div key={slotKey}>
                          <label className="block text-[11px] text-slate-400 mb-1">{slotLabel}</label>
                          <input
                            type="text"
                            value={settings.pageAdSlots?.[slotKey] || ''}
                            onChange={(e) =>
                              updateSettingsWithHistory(
                                (prev) => ({
                                  ...prev,
                                  pageAdSlots: { ...prev.pageAdSlots, [slotKey]: e.target.value }
                                }),
                                true
                              )
                            }
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                        Global AdSense Header Script Tag
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound('click');
                          injectDynamicAdSense(settings.adSenseScript);
                          triggerToast();
                        }}
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Force Re-inject into DOM</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={settings.adSenseScript}
                      onChange={(e) =>
                        updateSettingsWithHistory(
                          (prev) => ({ ...prev, adSenseScript: e.target.value }),
                          true
                        )
                      }
                      placeholder='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>'
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB: SPONSORS & BRAND DEALS */}
              {activeTab === 'sponsors' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span>Active Direct Sponsors</span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mt-1">
                        {activeSponsors.length}{' '}
                        <span className="text-xs font-normal text-slate-400">
                          / {settings.sponsorDeals?.length || 0} total
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span>Monthly Ad Revenue</span>
                        <DollarSign className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div className="text-2xl font-bold text-cyan-300 mt-1">
                        ${totalRevenueNumber.toLocaleString()}{' '}
                        <span className="text-xs font-normal text-slate-400">/ mo</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400 font-mono">New Sponsorship</div>
                        <div className="text-xs font-bold text-white mt-1">Add Brand Deal</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound('click');
                          setShowAddSponsorModal(true);
                        }}
                        className="flex items-center gap-1 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Deal</span>
                      </button>
                    </div>
                  </div>

                  {showAddSponsorModal && (
                    <form
                      onSubmit={handleAddSponsorSubmit}
                      className="rounded-2xl border border-cyan-500/40 bg-slate-950 p-4 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          value={newSponsor.companyName}
                          onChange={(e) => setNewSponsor((p) => ({ ...p, companyName: e.target.value }))}
                          placeholder="Company Name *"
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                        />
                        <input
                          type="text"
                          required
                          value={newSponsor.dealPrice}
                          onChange={(e) => setNewSponsor((p) => ({ ...p, dealPrice: e.target.value }))}
                          placeholder="Deal Price ($2,000/mo)"
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 font-mono"
                        />
                        <input
                          type="url"
                          required
                          value={newSponsor.targetUrl}
                          onChange={(e) => setNewSponsor((p) => ({ ...p, targetUrl: e.target.value }))}
                          placeholder="Target URL *"
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 font-mono"
                        />
                        <input
                          type="date"
                          value={newSponsor.expiryDate}
                          onChange={(e) => setNewSponsor((p) => ({ ...p, expiryDate: e.target.value }))}
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddSponsorModal(false)}
                          className="text-xs text-slate-400 px-3 py-1.5"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-lg bg-cyan-500 px-4 py-1.5 text-xs font-bold text-slate-950"
                        >
                          Save Deal
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    {settings.sponsorDeals?.map((deal) => (
                      <div
                        key={deal.id}
                        className={`rounded-xl border p-4 ${
                          deal.active ? 'border-cyan-500/30 bg-slate-950/80' : 'border-slate-800 bg-slate-950/40 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 pb-2">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-white text-sm">{deal.companyName}</h5>
                            <span className="rounded bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-bold">
                              {deal.dealPrice}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleSponsor(deal.id)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-700 bg-slate-900 text-slate-200"
                            >
                              {deal.active ? (
                                <>
                                  <ToggleRight className="h-4 w-4 text-emerald-400" />
                                  <span>Active</span>
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="h-4 w-4 text-slate-400" />
                                  <span>Inactive</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSponsor(deal.id)}
                              className="p-1.5 text-rose-400 hover:bg-rose-950/30 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {deal.startDate} → {deal.expiryDate}
                          </span>
                          <a
                            href={deal.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline truncate max-w-xs"
                          >
                            {deal.targetUrl}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: THEME CUSTOMIZER */}
              {activeTab === 'theme' && (
                <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                      Site Primary Accent Theme
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {(
                        [
                          { id: 'cyan', label: 'Institutional Cyan', color: 'bg-cyan-500' },
                          { id: 'emerald', label: 'Emerald Profit', color: 'bg-emerald-500' },
                          { id: 'amber', label: 'Golden Yield', color: 'bg-amber-500' },
                          { id: 'blue', label: 'Royal Blue', color: 'bg-blue-500' },
                          { id: 'purple', label: 'Ultra Violet', color: 'bg-purple-500' }
                        ] as const
                      ).map((themeOpt) => (
                        <button
                          key={themeOpt.id}
                          type="button"
                          onClick={() => {
                            playClickSound('click');
                            updateSettingsWithHistory((prev) => ({
                              ...prev,
                              themeCustomizer: { ...prev.themeCustomizer, accentColor: themeOpt.id }
                            }));
                          }}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold ${
                            settings.themeCustomizer?.accentColor === themeOpt.id
                              ? 'border-cyan-400 bg-slate-900 text-white'
                              : 'border-slate-800 bg-slate-950 text-slate-400'
                          }`}
                        >
                          <span className={`h-3.5 w-3.5 rounded-full ${themeOpt.color}`} />
                          <span>{themeOpt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: TELEGRAM */}
              {activeTab === 'telegram' && (
                <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1">
                    Live Telegram Group / Channel Link
                  </label>
                  <input
                    type="url"
                    value={settings.telegramCommunityUrl}
                    onChange={(e) =>
                      updateSettingsWithHistory(
                        (prev) => ({ ...prev, telegramCommunityUrl: e.target.value }),
                        true
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-cyan-300 font-mono"
                  />
                </div>
              )}

              {/* TAB: SOCIAL & SUPPORT */}
              {activeTab === 'social' && (
                <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase font-mono">
                      Instagram Profile URL
                    </label>
                    <input
                      type="url"
                      value={settings.instagramUrl}
                      onChange={(e) =>
                        updateSettingsWithHistory((p) => ({ ...p, instagramUrl: e.target.value }), true)
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase font-mono">
                      Facebook Community URL
                    </label>
                    <input
                      type="url"
                      value={settings.facebookUrl}
                      onChange={(e) =>
                        updateSettingsWithHistory((p) => ({ ...p, facebookUrl: e.target.value }), true)
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase font-mono">
                      Support Inquiries Email
                    </label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) =>
                        updateSettingsWithHistory((p) => ({ ...p, supportEmail: e.target.value }), true)
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Exit Session</span>
                </button>
                <span className="text-slate-700">|</span>
                {confirmReset ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-amber-300">Reset all CMS data?</span>
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold"
                    >
                      Yes, Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset All Defaults</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 font-medium"
                >
                  Close
                </button>

                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={handleSaveAll}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 text-xs font-extrabold text-slate-950 hover:from-cyan-400 hover:to-sky-400 transition-all shadow-md shadow-cyan-500/20 uppercase tracking-wider disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  <span>{isPublishing ? 'Publishing Globally...' : 'Save & Publish Globally'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
