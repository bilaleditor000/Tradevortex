import React, { useState } from 'react';
import { CommunityProof } from '../types';
import { DEFAULT_COMMUNITY_PROOFS } from '../data/communityProofsData';
import { playClickSound } from '../utils/sound';
import {
  Award,
  Plus,
  Edit3,
  Trash2,
  Save,
  Star,
  Upload,
  Image as ImageIcon,
  Video,
  X,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminCommunityProofsTabProps {
  proofsList: CommunityProof[];
  onChangeProofs: (nextProofs: CommunityProof[]) => void;
  showCommunityProofs: boolean;
  onTogglePublicVisibility: (visible: boolean) => void;
  onNotify: (msg: string) => void;
}

async function compressProofImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => resolve(String(reader.result || ''));
      img.onload = () => {
        const maxDim = 960;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result || ''));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
}

export const AdminCommunityProofsTab: React.FC<AdminCommunityProofsTabProps> = ({
  proofsList,
  onChangeProofs,
  showCommunityProofs,
  onTogglePublicVisibility,
  onNotify
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reviewerName, setReviewerName] = useState('');
  const [countryOrHandle, setCountryOrHandle] = useState('@member · Telegram Community');
  const [rating, setRating] = useState<number>(5);
  const [profitHighlight, setProfitHighlight] = useState('');
  const [caption, setCaption] = useState('');
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setReviewerName('');
    setCountryOrHandle('@member · Telegram Community');
    setRating(5);
    setProfitHighlight('');
    setCaption('');
    setProofImages([]);
    setImageUrlInput('');
    setVideoUrl('');
  };

  const handleStartEdit = (item: CommunityProof) => {
    playClickSound('click');
    setEditingId(item.id);
    setReviewerName(item.reviewerName);
    setCountryOrHandle(item.countryOrHandle || '');
    setRating(item.rating || 5);
    setProfitHighlight(item.profitHighlight || '');
    setCaption(item.caption);
    setProofImages(item.proofImages || []);
    setVideoUrl(item.videoUrl || '');
  };

  const handleMultiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const converted: string[] = [];
      for (const file of Array.from(files).slice(0, 6)) {
        const dataUrl = await compressProofImageToDataUrl(file);
        if (dataUrl) converted.push(dataUrl);
      }
      setProofImages((prev) => [...prev, ...converted].slice(0, 8));
      onNotify(`Attached ${converted.length} proof image(s).`);
    } catch {
      onNotify('Some images could not be processed. Try smaller PNG/JPG files.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddExternalImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('https://') && !trimmed.startsWith('http://') && !trimmed.startsWith('data:image/')) {
      onNotify('Please enter a valid https:// image URL.');
      return;
    }
    setProofImages((prev) => [...prev, trimmed].slice(0, 8));
    setImageUrlInput('');
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3.5 * 1024 * 1024) {
      onNotify('For fast loading & browser storage, upload videos under 3.5MB or paste an external MP4/WebM URL.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setVideoUrl(reader.result);
        onNotify('Video proof attached!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !caption.trim()) return;
    playClickSound('calculate');

    const nowLabel = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    let nextList: CommunityProof[];
    if (editingId) {
      nextList = proofsList.map((item) =>
        item.id === editingId
          ? {
              ...item,
              reviewerName: reviewerName.trim(),
              countryOrHandle: countryOrHandle.trim() || 'Telegram Community',
              rating,
              profitHighlight: profitHighlight.trim() || undefined,
              caption: caption.trim(),
              proofImages,
              videoUrl: videoUrl.trim() || '',
              verifiedBadge: true
            }
          : item
      );
      onNotify('Proof updated! Click "Save & Publish Globally" to push live.');
    } else {
      const created: CommunityProof = {
        id: `proof-${Date.now()}`,
        reviewerName: reviewerName.trim(),
        countryOrHandle: countryOrHandle.trim() || 'Telegram Community',
        rating,
        profitHighlight: profitHighlight.trim() || undefined,
        caption: caption.trim(),
        proofImages,
        videoUrl: videoUrl.trim() || '',
        dateLabel: nowLabel,
        verifiedBadge: true,
        source: 'Telegram Community'
      };
      nextList = [created, ...proofsList];
      onNotify('New proof added! Click "Save & Publish Globally" to publish live.');
    }

    onChangeProofs(nextList);
    resetForm();
  };

  const handleDelete = (id: string) => {
    playClickSound('click');
    onChangeProofs(proofsList.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
    onNotify('Proof deleted.');
  };

  const handleRestoreDefaults = () => {
    playClickSound('toggle');
    onChangeProofs(DEFAULT_COMMUNITY_PROOFS);
    resetForm();
    onNotify('Restored default starter community reviews.');
  };

  return (
    <div className="space-y-5">
      {/* Public Visibility Control (Default OFF for AdSense Approval) */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-4 ${
          showCommunityProofs
            ? 'border-emerald-500/40 bg-emerald-950/20'
            : 'border-amber-500/35 bg-amber-950/15'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-white">
            {showCommunityProofs ? (
              <Eye className="h-4 w-4 text-emerald-400" />
            ) : (
              <EyeOff className="h-4 w-4 text-amber-400" />
            )}
            <span>
              Public Home Page Visibility:{' '}
              <span className={showCommunityProofs ? 'text-emerald-300' : 'text-amber-300'}>
                {showCommunityProofs ? 'ENABLED (VISIBLE)' : 'HIDDEN (ADSENSE SAFE DEFAULT)'}
              </span>
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Hidden by default to ensure a clean editorial layout during Google AdSense review. Toggle ON when ready to showcase verified trader reviews publicly.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound('toggle');
            onTogglePublicVisibility(!showCommunityProofs);
          }}
          className={`shrink-0 rounded-lg px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-all ${
            showCommunityProofs
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              : 'border border-cyan-500/50 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25'
          }`}
        >
          {showCommunityProofs ? 'Turn OFF (Hide)' : 'Turn ON (Show Live)'}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-4 space-y-3.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>
              {editingId
                ? 'Editing Community Review & Winning Proof'
                : 'Upload Trader Review, Profit Screenshots & Video Proof'}
            </span>
          </h4>
          <div className="flex items-center gap-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:border-amber-500/40"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Restore Starter Reviews</span>
            </button>
          </div>
        </div>

        {/* Reviewer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <input
            type="text"
            required
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="Reviewer Name (e.g. Hamza Khan) *"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
          />
          <input
            type="text"
            value={countryOrHandle}
            onChange={(e) => setCountryOrHandle(e.target.value)}
            placeholder="Handle or Country (@hamza_fx · UAE)"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
          />
          <input
            type="text"
            value={profitHighlight}
            onChange={(e) => setProfitHighlight(e.target.value)}
            placeholder="Result Badge (e.g. +$1,450 XAU/USD)"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-emerald-300 font-mono"
          />
        </div>

        {/* Star Rating */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-300">Star Rating:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((starVal) => (
              <button
                key={starVal}
                type="button"
                onClick={() => setRating(starVal)}
                className={`p-1 rounded transition-colors ${
                  starVal <= rating ? 'text-amber-400' : 'text-slate-600'
                }`}
              >
                <Star className="h-4 w-4 fill-current" />
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-amber-300 font-bold">{rating}.0 / 5.0</span>
        </div>

        {/* Caption / Review */}
        <textarea
          rows={3}
          required
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Trader review / Telegram feedback caption *"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
        />

        {/* Multiple Proof Images Upload */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Upload Multiple Proof Screenshots ({proofImages.length}/8)</span>
            </span>
            <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30">
              <Upload className="h-3.5 w-3.5" />
              <span>{isUploading ? 'Processing...' : 'Select Proof Images'}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultiImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="Or paste external screenshot URL (https://...)"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white"
            />
            <button
              type="button"
              onClick={handleAddExternalImageUrl}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white"
            >
              Add URL
            </button>
          </div>

          {proofImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
              {proofImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-lg overflow-hidden border border-slate-700 aspect-video bg-slate-950"
                >
                  <img src={img} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setProofImages((prev) => prev.filter((_, i) => i !== idx))}
                    aria-label="Remove image"
                    className="absolute top-1 right-1 rounded-full bg-black/80 p-0.5 text-rose-400 hover:text-rose-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Optional Video Proof Upload / URL */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5" />
              <span>Optional Testimonial / Profit Video Proof</span>
            </span>
            <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30">
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Video File</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Or paste direct MP4/WebM video URL (https://...)"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white font-mono"
            />
            {videoUrl && (
              <button
                type="button"
                onClick={() => setVideoUrl('')}
                className="rounded-lg border border-rose-500/40 bg-rose-950/30 px-3 py-1.5 text-xs text-rose-300"
              >
                Clear Video
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-cyan-400"
          >
            {editingId ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            <span>{editingId ? 'Update Winning Proof' : 'Publish Review & Proof'}</span>
          </button>
        </div>
      </form>

      {/* Existing Published Proofs */}
      <div className="space-y-2.5">
        {proofsList.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-white">{item.reviewerName}</span>
                <span className="text-amber-400 font-mono font-bold">★ {item.rating}.0</span>
                {item.profitHighlight && (
                  <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                    {item.profitHighlight}
                  </span>
                )}
                {item.proofImages?.length > 0 && (
                  <span className="rounded bg-cyan-500/15 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                    {item.proofImages.length} Image(s)
                  </span>
                )}
                {item.videoUrl && (
                  <span className="rounded bg-purple-500/15 px-2 py-0.5 text-[10px] font-mono text-purple-300">
                    Video
                  </span>
                )}
              </div>
              <p className="text-slate-400 line-clamp-2">{item.caption}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleStartEdit(item)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-cyan-300 hover:border-cyan-500 flex items-center gap-1"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-950/30"
                title="Delete Proof"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
