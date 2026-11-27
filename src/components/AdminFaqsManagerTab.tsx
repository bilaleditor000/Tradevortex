import React, { useState } from 'react';
import { FAQItem } from '../types';
import { FAQS_DATA } from '../data/faqsData';
import { playClickSound } from '../utils/sound';
import { HelpCircle, Plus, Edit3, Trash2, Save, RotateCcw, Search } from 'lucide-react';

interface AdminFaqsManagerTabProps {
  faqsList: FAQItem[];
  onChangeFaqs: (nextFaqs: FAQItem[]) => void;
  onNotify: (msg: string) => void;
}

const FAQ_CATEGORIES: FAQItem['category'][] = [
  'Trading Basics',
  'Risk & Psychology',
  'Calculators',
  'Brokers',
  'Trading Mechanics',
  'Account & Security'
];

export const AdminFaqsManagerTab: React.FC<AdminFaqsManagerTabProps> = ({
  faqsList,
  onChangeFaqs,
  onNotify
}) => {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{
    category: FAQItem['category'];
    question: string;
    answer: string;
  }>({
    category: 'Trading Basics',
    question: '',
    answer: ''
  });

  const handleStartEdit = (faq: FAQItem) => {
    playClickSound('click');
    setEditingId(faq.id);
    setDraft({
      category: faq.category,
      question: faq.question,
      answer: faq.answer
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDraft({
      category: 'Trading Basics',
      question: '',
      answer: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.question.trim() || !draft.answer.trim()) return;
    playClickSound('calculate');

    let nextList: FAQItem[];
    if (editingId) {
      nextList = faqsList.map((f) =>
        f.id === editingId
          ? {
              ...f,
              category: draft.category,
              question: draft.question.trim(),
              answer: draft.answer.trim()
            }
          : f
      );
      setEditingId(null);
      onNotify('FAQ updated! Click "Save & Publish Globally" to sync worldwide.');
    } else {
      const created: FAQItem = {
        id: `faq-${Date.now()}`,
        category: draft.category,
        question: draft.question.trim(),
        answer: draft.answer.trim()
      };
      nextList = [created, ...faqsList];
      onNotify('New FAQ added! Click "Save & Publish Globally" to sync worldwide.');
    }

    onChangeFaqs(nextList);
    setDraft({
      category: 'Trading Basics',
      question: '',
      answer: ''
    });
  };

  const handleDelete = (id: string) => {
    playClickSound('click');
    const nextList = faqsList.filter((f) => f.id !== id);
    onChangeFaqs(nextList);
    if (editingId === id) {
      handleCancelEdit();
    }
    onNotify('FAQ deleted.');
  };

  const handleReset30 = () => {
    playClickSound('toggle');
    onChangeFaqs(FAQS_DATA);
    handleCancelEdit();
    onNotify('Restored default 30 Trading Q&As.');
  };

  const filtered = faqsList.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Add / Edit FAQ Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-4 space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>
              {editingId ? 'Editing Selected FAQ' : 'Add New Trading Question & Answer'}
            </span>
          </h4>
          <div className="flex items-center gap-2">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="button"
              onClick={handleReset30}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:border-amber-500/40"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Restore 30 Default FAQs</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <input
            type="text"
            required
            value={draft.question}
            onChange={(e) => setDraft((p) => ({ ...p, question: e.target.value }))}
            placeholder="Question (e.g. How does trailing Stop-Loss work?) *"
            className="sm:col-span-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
          <select
            value={draft.category}
            onChange={(e) =>
              setDraft((p) => ({ ...p, category: e.target.value as FAQItem['category'] }))
            }
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 font-mono"
          >
            {FAQ_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <textarea
          rows={3}
          required
          value={draft.answer}
          onChange={(e) => setDraft((p) => ({ ...p, answer: e.target.value }))}
          placeholder="Detailed clear answer *"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-cyan-400"
          >
            {editingId ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            <span>{editingId ? 'Update FAQ' : 'Add FAQ'}</span>
          </button>
        </div>
      </form>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${faqsList.length} FAQs...`}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white"
        />
      </div>

      {/* Existing FAQs List */}
      <div className="space-y-2">
        {filtered.map((faq) => (
          <div
            key={faq.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs"
          >
            <div className="min-w-0 space-y-1">
              <span className="inline-block rounded bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                {faq.category}
              </span>
              <div className="font-bold text-white">{faq.question}</div>
              <p className="text-slate-400 line-clamp-2">{faq.answer}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleStartEdit(faq)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-cyan-300 hover:border-cyan-500 flex items-center gap-1"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(faq.id)}
                className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-950/30"
                title="Delete FAQ"
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
