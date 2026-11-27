import React, { useState } from 'react';
import {
  AdminSettings,
  Article,
  Broker,
  CustomNavButton,
  CustomPage,
  MediaItem,
  PageView
} from '../types';
import { playClickSound } from '../utils/sound';
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Video,
  Music,
  Upload,
  Globe,
  Link as LinkIcon,
  FileText,
  Layers,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';

interface AdminSiteBuilderMediaTabProps {
  settings: AdminSettings;
  onUpdateSettings: (updater: (prev: AdminSettings) => AdminSettings) => void;
  onAddBroker: (broker: Broker) => void;
  onAddArticle: (article: Article) => void;
}

export const AdminSiteBuilderMediaTab: React.FC<AdminSiteBuilderMediaTabProps> = ({
  settings,
  onUpdateSettings,
  onAddBroker,
  onAddArticle
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick Add Broker
  const [brokerForm, setBrokerForm] = useState({
    name: '',
    affiliateUrl: 'https://',
    minDeposit: '$10',
    maxLeverage: '1:500',
    spreadFrom: '0.0 pips',
    description: ''
  });

  // Quick Add Blog/Article
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'Beginner' as Article['category'],
    readTime: '7 min read',
    body: ''
  });

  // Add Custom Nav Button
  const [navBtnForm, setNavBtnForm] = useState({
    label: '',
    targetType: 'page' as 'page' | 'url',
    targetValue: 'markets',
    badge: ''
  });

  // Add Standalone Page
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    categoryBadge: 'Special Briefing',
    subtitle: '',
    body: '',
    ctaLabel: '',
    ctaUrl: ''
  });

  // Add Media by URL
  const [mediaUrlForm, setMediaUrlForm] = useState({
    name: '',
    mediaType: 'image' as MediaItem['mediaType'],
    url: '',
    placement: 'none' as PageView | 'all' | 'none',
    caption: ''
  });

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        playClickSound('calculate');
        const dataUrl = reader.result;
        onUpdateSettings((prev) => ({ ...prev, siteLogoUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleMultiMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    playClickSound('calculate');

    const readAsDataUrl = (file: File): Promise<MediaItem | null> =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result !== 'string') {
            resolve(null);
            return;
          }
          const mediaType: MediaItem['mediaType'] = file.type.startsWith('video/')
            ? 'video'
            : file.type.startsWith('audio/')
            ? 'audio'
            : 'image';
          resolve({
            id: `media_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            name: file.name,
            mediaType,
            url: reader.result,
            sizeBytes: file.size,
            placement: 'none',
            caption: file.name.replace(/\.[^.]+$/, ''),
            createdAt: new Date().toISOString()
          });
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });

    const loaded = (await Promise.all(files.map(readAsDataUrl))).filter(
      (item): item is MediaItem => item !== null
    );

    if (loaded.length > 0) {
      onUpdateSettings((prev) => ({
        ...prev,
        mediaLibrary: [...loaded, ...(prev.mediaLibrary || [])]
      }));
    }
    e.target.value = '';
  };

  const handleAddMediaUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrlForm.url.trim()) return;
    playClickSound('calculate');
    const item: MediaItem = {
      id: `media_${Date.now()}`,
      name: mediaUrlForm.name.trim() || 'External Media Asset',
      mediaType: mediaUrlForm.mediaType,
      url: mediaUrlForm.url.trim(),
      sizeBytes: 0,
      placement: mediaUrlForm.placement,
      caption: mediaUrlForm.caption.trim() || undefined,
      createdAt: new Date().toISOString()
    };
    onUpdateSettings((prev) => ({
      ...prev,
      mediaLibrary: [item, ...(prev.mediaLibrary || [])]
    }));
    setMediaUrlForm({
      name: '',
      mediaType: 'image',
      url: '',
      placement: 'none',
      caption: ''
    });
  };

  const handleCreateBroker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brokerForm.name.trim()) return;
    playClickSound('calculate');
    const id =
      brokerForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      Date.now().toString().slice(-3);

    onAddBroker({
      id,
      name: brokerForm.name.trim(),
      logo: '',
      rating: 4.9,
      reviewCount: 310,
      minDeposit: brokerForm.minDeposit.trim() || '$10',
      maxLeverage: brokerForm.maxLeverage.trim() || '1:500',
      spreadFrom: brokerForm.spreadFrom.trim() || '0.0 pips',
      regulation: ['FCA', 'ASIC', 'FSA'],
      platforms: ['MT4', 'MT5', 'WebTerminal'],
      category: 'Multi-Asset',
      affiliateUrl: brokerForm.affiliateUrl.trim() || 'https://',
      pros: ['Low minimum deposit', 'Fast order execution'],
      cons: ['Standard market volatility risk'],
      badge: 'New Partner',
      description:
        brokerForm.description.trim() ||
        'Verified global trading platform added via TradeVortex Site Builder.',
      depositMethods: ['USDT', 'Cards', 'Bank Wire']
    });

    setBrokerForm({
      name: '',
      affiliateUrl: 'https://',
      minDeposit: '$10',
      maxLeverage: '1:500',
      spreadFrom: '0.0 pips',
      description: ''
    });
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title.trim() || !articleForm.body.trim()) return;
    playClickSound('calculate');
    onAddArticle({
      id: `art_${Date.now()}`,
      slug: articleForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 60),
      title: articleForm.title.trim(),
      subtitle: articleForm.body.trim().slice(0, 140),
      category: articleForm.category,
      readTime: articleForm.readTime.trim() || '6 min read',
      date: 'Updated 2026',
      author: 'TradeVortex Editorial Desk',
      authorRole: 'Market Strategist',
      summary: articleForm.body.trim().slice(0, 180),
      content: articleForm.body.trim(),
      keyTakeaways: ['Protect capital with disciplined 1%-2% position sizing.'],
      faqs: []
    });
    setArticleForm({
      title: '',
      category: 'Beginner',
      readTime: '7 min read',
      body: ''
    });
  };

  const handleCreateNavButton = (e: React.FormEvent) => {
    e.preventDefault();
    if (!navBtnForm.label.trim() || !navBtnForm.targetValue.trim()) return;
    playClickSound('calculate');
    const btn: CustomNavButton = {
      id: `nav_${Date.now()}`,
      label: navBtnForm.label.trim(),
      targetType: navBtnForm.targetType,
      targetValue: navBtnForm.targetValue.trim(),
      badge: navBtnForm.badge.trim() || undefined,
      active: true
    };
    onUpdateSettings((prev) => ({
      ...prev,
      customNavButtons: [...(prev.customNavButtons || []), btn]
    }));
    setNavBtnForm({ label: '', targetType: 'page', targetValue: 'markets', badge: '' });
  };

  const handleCreateCustomPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageForm.title.trim() || !pageForm.body.trim()) return;
    playClickSound('calculate');
    const cleanSlug = (
      pageForm.slug.trim() || pageForm.title.trim()
    )
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const page: CustomPage = {
      id: `page_${Date.now()}`,
      slug: cleanSlug || `page-${Date.now()}`,
      title: pageForm.title.trim(),
      subtitle: pageForm.subtitle.trim(),
      categoryBadge: pageForm.categoryBadge.trim() || 'TradeVortex Brief',
      body: pageForm.body.trim(),
      ctaLabel: pageForm.ctaLabel.trim() || undefined,
      ctaUrl: pageForm.ctaUrl.trim() || undefined,
      active: true
    };

    const autoNavBtn: CustomNavButton = {
      id: `nav_for_${page.id}`,
      label: page.title.slice(0, 22),
      targetType: 'page',
      targetValue: `custom:${page.slug}`,
      badge: 'NEW',
      active: true
    };

    onUpdateSettings((prev) => ({
      ...prev,
      customPages: [page, ...(prev.customPages || [])],
      customNavButtons: [...(prev.customNavButtons || []), autoNavBtn]
    }));

    setPageForm({
      title: '',
      slug: '',
      categoryBadge: 'Special Briefing',
      subtitle: '',
      body: '',
      ctaLabel: '',
      ctaUrl: ''
    });
  };

  const mediaLibrary = settings.mediaLibrary || [];
  const customNavButtons = settings.customNavButtons || [];
  const customPages = settings.customPages || [];

  return (
    <div className="space-y-6">
      {/* 1. Site Logo Switcher */}
      <div className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Site Logo Switcher (Navbar &amp; Brand Identity)</span>
          </h4>
          {settings.siteLogoUrl && (
            <button
              type="button"
              onClick={() => onUpdateSettings((prev) => ({ ...prev, siteLogoUrl: '' }))}
              className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Restore Default V Logo</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <div className="md:col-span-2 space-y-2">
            <input
              type="url"
              value={settings.siteLogoUrl || ''}
              onChange={(e) =>
                onUpdateSettings((prev) => ({ ...prev, siteLogoUrl: e.target.value }))
              }
              placeholder="Paste custom logo image URL (https://...) or upload below"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-cyan-300 font-mono"
            />
            <label className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-950/30 px-3 py-1.5 text-xs font-semibold text-cyan-300 cursor-pointer hover:bg-cyan-500/20">
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Logo Image File</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-3 min-h-[72px]">
            {settings.siteLogoUrl ? (
              <img
                src={settings.siteLogoUrl}
                alt="Site Logo Preview"
                className="max-h-12 w-auto object-contain"
              />
            ) : (
              <span className="text-xs text-slate-400 font-mono">Default V Badge Active</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Multi-Media Uploader (Images, Videos, Audio) */}
      <div className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Multi-Media Manager (Images, Videos &amp; Audio — {mediaLibrary.length})</span>
          </h4>
          <label className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3.5 py-2 text-xs font-extrabold text-slate-950 cursor-pointer hover:bg-cyan-400 shadow-sm">
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Multiple Files</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={handleMultiMediaUpload}
              className="hidden"
            />
          </label>
        </div>

        <form onSubmit={handleAddMediaUrl} className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          <input
            type="text"
            value={mediaUrlForm.name}
            onChange={(e) => setMediaUrlForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Media Title"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
          />
          <select
            value={mediaUrlForm.mediaType}
            onChange={(e) =>
              setMediaUrlForm((p) => ({
                ...p,
                mediaType: e.target.value as MediaItem['mediaType']
              }))
            }
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
          <input
            type="url"
            required
            value={mediaUrlForm.url}
            onChange={(e) => setMediaUrlForm((p) => ({ ...p, url: e.target.value }))}
            placeholder="Paste Media URL (https://...)"
            className="sm:col-span-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 font-mono"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-800 border border-cyan-500/40 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
          >
            + Add URL
          </button>
        </form>

        {mediaLibrary.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mediaLibrary.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-2"
              >
                <div className="h-32 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                  {item.mediaType === 'image' && (
                    <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                  )}
                  {item.mediaType === 'video' && (
                    <video src={item.url} controls className="h-full w-full object-contain" />
                  )}
                  {item.mediaType === 'audio' && (
                    <div className="w-full px-2 space-y-2 text-center">
                      <Music className="h-6 w-6 text-cyan-400 mx-auto" />
                      <audio src={item.url} controls className="w-full h-8" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-white truncate flex items-center gap-1.5">
                    {item.mediaType === 'video' ? (
                      <Video className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    ) : item.mediaType === 'audio' ? (
                      <Music className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <ImageIcon className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    )}
                    <span className="truncate">{item.name}</span>
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(item.url).catch(() => {});
                        setCopiedId(item.id);
                        window.setTimeout(() => setCopiedId(null), 1500);
                      }}
                      title="Copy Media URL"
                      className="p-1 text-slate-400 hover:text-cyan-300"
                    >
                      {copiedId === item.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSettings((prev) => ({
                          ...prev,
                          mediaLibrary: (prev.mediaLibrary || []).filter((m) => m.id !== item.id)
                        }))
                      }
                      className="p-1 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <select
                  value={item.placement}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      mediaLibrary: (prev.mediaLibrary || []).map((m) =>
                        m.id === item.id
                          ? { ...m, placement: e.target.value as MediaItem['placement'] }
                          : m
                      )
                    }))
                  }
                  className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-300 font-mono"
                >
                  <option value="none">Library Only (Hidden on pages)</option>
                  <option value="all">Show on All Pages</option>
                  <option value="home">Show on Home Page</option>
                  <option value="academy">Show on Academy</option>
                  <option value="brokers">Show on Brokers</option>
                  <option value="markets">Show on Markets</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Add New Broker / Platform */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span>Add New Broker / Platform</span>
        </h4>
        <form onSubmit={handleCreateBroker} className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <input
              type="text"
              required
              value={brokerForm.name}
              onChange={(e) => setBrokerForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Platform Name *"
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
            />
            <input
              type="url"
              required
              value={brokerForm.affiliateUrl}
              onChange={(e) => setBrokerForm((p) => ({ ...p, affiliateUrl: e.target.value }))}
              placeholder="Referral Link (https://...)"
              className="sm:col-span-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 font-mono"
            />
            <input
              type="text"
              value={brokerForm.minDeposit}
              onChange={(e) => setBrokerForm((p) => ({ ...p, minDeposit: e.target.value }))}
              placeholder="Min Deposit ($10)"
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center">
            <input
              type="text"
              value={brokerForm.description}
              onChange={(e) => setBrokerForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Platform Description"
              className="sm:col-span-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-cyan-400"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Platform</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Quick Add Blog / Article */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Quick Publish New Blog / Academy Article</span>
        </h4>
        <form onSubmit={handleCreateArticle} className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <input
              type="text"
              required
              value={articleForm.title}
              onChange={(e) => setArticleForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Article Title *"
              className="sm:col-span-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
            />
            <select
              value={articleForm.category}
              onChange={(e) =>
                setArticleForm((p) => ({ ...p, category: e.target.value as Article['category'] }))
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
              value={articleForm.readTime}
              onChange={(e) => setArticleForm((p) => ({ ...p, readTime: e.target.value }))}
              placeholder="Read Time (7 min read)"
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
            />
          </div>
          <textarea
            rows={3}
            required
            value={articleForm.body}
            onChange={(e) => setArticleForm((p) => ({ ...p, body: e.target.value }))}
            placeholder="Write full article body (supports ### Headings, bullet points, > Quotes)..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white font-mono"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-cyan-400"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Publish Article</span>
            </button>
          </div>
        </form>
      </div>

      {/* 5. Custom Navigation Buttons & Standalone Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Custom Nav Buttons */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            <span>Add Custom Navbar Buttons ({customNavButtons.length})</span>
          </h4>
          <form onSubmit={handleCreateNavButton} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={navBtnForm.label}
                onChange={(e) => setNavBtnForm((p) => ({ ...p, label: e.target.value }))}
                placeholder="Button Label *"
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
              />
              <input
                type="text"
                value={navBtnForm.badge}
                onChange={(e) => setNavBtnForm((p) => ({ ...p, badge: e.target.value }))}
                placeholder="Badge (e.g. VIP, NEW)"
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={navBtnForm.targetType}
                onChange={(e) =>
                  setNavBtnForm((p) => ({
                    ...p,
                    targetType: e.target.value as 'page' | 'url'
                  }))
                }
                className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-cyan-300"
              >
                <option value="page">Internal Page</option>
                <option value="url">External URL</option>
              </select>
              <input
                type="text"
                required
                value={navBtnForm.targetValue}
                onChange={(e) => setNavBtnForm((p) => ({ ...p, targetValue: e.target.value }))}
                placeholder={
                  navBtnForm.targetType === 'page' ? 'home, signals, or custom:slug' : 'https://...'
                }
                className="col-span-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-slate-800 border border-cyan-500/40 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
            >
              + Add Navbar Button
            </button>
          </form>

          {customNavButtons.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              {customNavButtons.map((btn) => (
                <div
                  key={btn.id}
                  className="flex items-center justify-between text-xs rounded-lg bg-slate-900 px-3 py-1.5 border border-slate-800"
                >
                  <span className="font-semibold text-white truncate">
                    {btn.label}{' '}
                    <span className="text-[10px] font-mono text-slate-400">({btn.targetValue})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSettings((prev) => ({
                        ...prev,
                        customNavButtons: (prev.customNavButtons || []).filter(
                          (b) => b.id !== btn.id
                        )
                      }))
                    }
                    className="text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Standalone Pages */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Create Standalone Pages ({customPages.length})</span>
          </h4>
          <form onSubmit={handleCreateCustomPage} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={pageForm.title}
                onChange={(e) => setPageForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Page Title *"
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
              />
              <input
                type="text"
                value={pageForm.slug}
                onChange={(e) => setPageForm((p) => ({ ...p, slug: e.target.value }))}
                placeholder="URL Slug (auto)"
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 font-mono"
              />
            </div>
            <textarea
              rows={2}
              required
              value={pageForm.body}
              onChange={(e) => setPageForm((p) => ({ ...p, body: e.target.value }))}
              placeholder="Standalone Page Content *"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={pageForm.ctaLabel}
                onChange={(e) => setPageForm((p) => ({ ...p, ctaLabel: e.target.value }))}
                placeholder="Optional CTA Label"
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
              />
              <input
                type="url"
                value={pageForm.ctaUrl}
                onChange={(e) => setPageForm((p) => ({ ...p, ctaUrl: e.target.value }))}
                placeholder="Optional CTA URL"
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-500 py-1.5 text-xs font-extrabold text-slate-950 hover:bg-cyan-400"
            >
              + Create Page &amp; Add Nav Link
            </button>
          </form>

          {customPages.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              {customPages.map((pg) => (
                <div
                  key={pg.id}
                  className="flex items-center justify-between text-xs rounded-lg bg-slate-900 px-3 py-1.5 border border-slate-800"
                >
                  <span className="font-semibold text-white truncate">
                    {pg.title}{' '}
                    <span className="text-[10px] font-mono text-cyan-400">
                      #custom:{pg.slug}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSettings((prev) => ({
                        ...prev,
                        customPages: (prev.customPages || []).filter((p) => p.id !== pg.id),
                        customNavButtons: (prev.customNavButtons || []).filter(
                          (b) => b.targetValue !== `custom:${pg.slug}`
                        )
                      }))
                    }
                    className="text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
