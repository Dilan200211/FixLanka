import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
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
      setResults(TOOLS.slice(0, 6));
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
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-dark-secondary bg-dark-surface hover:bg-dark-raised border border-dark-border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        aria-label="Search tools"
      >
        <Search className="w-3.5 h-3.5 text-dark-muted" />
        <span className="hidden sm:inline">Search tools</span>
        <span className="sm:hidden">Search</span>
        <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[11px] font-mono bg-dark-card border border-dark-border rounded text-dark-muted">
          ⌘K
        </kbd>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-dark-border">
              <Search className="w-4 h-4 text-brand-500 mr-3 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools or tasks (compress photo, merge pdf, qr)..."
                className="w-full bg-transparent text-dark-text placeholder-dark-muted text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-dark-muted hover:text-dark-text rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-dark-border">
              {results.length > 0 ? (
                results.map((tool) => (
                  <a
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-raised/60 group transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-dark-text group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {tool.name}
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-surface text-dark-muted border border-dark-border">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-xs text-dark-secondary mt-0.5 line-clamp-1">{tool.shortDescription}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-dark-muted group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors ml-2 flex-shrink-0" />
                  </a>
                ))
              ) : (
                <div className="py-8 text-center text-dark-secondary text-sm">
                  <p>No tools matched "{query}"</p>
                  <p className="text-xs text-dark-muted mt-1">Try keywords like photo, pdf, qr code, or password.</p>
                </div>
              )}
            </div>

            {/* Footer Shortcuts */}
            <div className="px-4 py-2.5 bg-dark-bg border-t border-dark-border flex items-center justify-between text-xs text-dark-muted font-mono">
              <span>Press <kbd className="px-1 py-0.5 bg-dark-card border border-dark-border rounded text-dark-secondary">ESC</kbd> to exit</span>
              <span className="flex items-center gap-1.5 text-dark-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>On-device privacy</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}