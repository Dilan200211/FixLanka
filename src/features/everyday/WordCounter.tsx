import React, { useState } from 'react';
import { FileText, Copy, Check, Trash2, Clock, Mic } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = useState<string>(
    'FixLanka Tools is a modern online toolbox for files, privacy, developers, and creators. Everything runs locally inside your browser.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Compute metrics
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = trimmed ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;

  // Reading time (average 200 words per minute)
  const readingTimeMinutes = (words / 200).toFixed(1);
  // Speaking time (average 130 words per minute)
  const speakingTimeMinutes = (words / 130).toFixed(1);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-dark-surface border border-dark-border text-center">
          <span className="text-slate-400 block mb-1">Total Words</span>
          <span className="text-2xl font-extrabold text-white font-mono">{words}</span>
        </div>

        <div className="p-4 rounded-xl bg-dark-surface border border-dark-border text-center">
          <span className="text-slate-400 block mb-1">Characters (All)</span>
          <span className="text-2xl font-extrabold text-white font-mono">{characters}</span>
        </div>

        <div className="p-4 rounded-xl bg-dark-surface border border-dark-border text-center">
          <span className="text-slate-400 block mb-1">Chars (No Space)</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono">{charactersNoSpaces}</span>
        </div>

        <div className="p-4 rounded-xl bg-dark-surface border border-dark-border text-center">
          <span className="text-slate-400 block mb-1">Sentences</span>
          <span className="text-2xl font-extrabold text-white font-mono">{sentences}</span>
        </div>
      </div>

      {/* Secondary Estimates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-dark-surface border border-dark-border flex items-center gap-3">
          <FileText className="w-5 h-5 text-purple-400" />
          <div>
            <span className="text-slate-400 block text-[11px]">Paragraphs</span>
            <span className="text-sm font-bold text-white">{paragraphs}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-surface border border-dark-border flex items-center gap-3">
          <Clock className="w-5 h-5 text-cyan-400" />
          <div>
            <span className="text-slate-400 block text-[11px]">Est. Reading Time</span>
            <span className="text-sm font-bold text-white">~{readingTimeMinutes} min (200 wpm)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-surface border border-dark-border flex items-center gap-3">
          <Mic className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-slate-400 block text-[11px]">Est. Speaking Time</span>
            <span className="text-sm font-bold text-white">~{speakingTimeMinutes} min (130 wpm)</span>
          </div>
        </div>
      </div>

      {/* Text Area & Action Controls */}
      <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-slate-300 font-semibold">Enter or Paste Text:</label>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={!text}
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-card border border-slate-700/60 hover:border-slate-500 text-slate-300 disabled:opacity-30 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>

            <button
              type="button"
              disabled={!text}
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-card border border-slate-700/60 hover:border-rose-500 hover:text-rose-400 text-slate-300 disabled:opacity-30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>

        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your content here..."
          className="w-full p-4 bg-dark-card border border-slate-700/60 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 leading-relaxed resize-y"
        />
      </div>
    </div>
  );
}
