import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { TOOLS } from '../../data/tools';
import type { ToolDefinition } from '../../types/tool';

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ToolDefinition[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(TOOLS.slice(0, 6)); // Display popular/featured defaults
      return;
    }
    const q = query.toLowerCase().trim();
    const filtered = TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query]);

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        aria-label="Search tools"
      >
        <Search className="w-3.5 h-3.5 text-slate-400" />
        <span className="hidden sm:inline">Search 20+ tools...</span>
        <span className="sm:hidden">Search</span>
        <kbd className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-400">
          ⌘K
        </kbd>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-slate-800">
              <Search className="w-5 h-5 text-emerald-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a tool name, format, or task (e.g., exif, compress, pdf)..."
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
              {results.length > 0 ? (
                results.map((tool) => (
                  <a
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/60 group transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-100 group-hover:text-emerald-400 transition-colors">
                          {tool.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{tool.shortDescription}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all ml-2 flex-shrink-0" />
                  </a>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm">
                  <p>No tools matched "{query}"</p>
                  <p className="text-xs text-slate-500 mt-1">Try searching for keywords like "metadata", "pdf", "image", or "base64".</p>
                </div>
              )}
            </div>

            {/* Footer Shortcuts */}
            <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>Press <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400">ESC</kbd> to exit</span>
              <span className="flex items-center gap-1 text-emerald-400/80">
                <Sparkles className="w-3 h-3" /> 100% In-Browser & Private
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
