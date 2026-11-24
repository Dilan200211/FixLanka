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
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-400 bg-dark-card hover:bg-dark-raised border border-dark-border rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
        aria-label="Search tools"
      >
        <Search className="w-3.5 h-3.5 text-neutral-400" />
        <span className="hidden sm:inline">Search catalog</span>
        <span className="sm:hidden">Search</span>
        <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-xs font-mono bg-dark-surface border border-dark-border rounded text-neutral-400">
          ⌘K
        </kbd>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-dark-border">
              <Search className="w-4 h-4 text-emerald-400 mr-3 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools or formats (exif, pdf, base64)..."
                className="w-full bg-transparent text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-dark-border/50">
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
                        <span className="text-sm font-medium text-neutral-100 group-hover:text-emerald-400 transition-colors">
                          {tool.name}
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-surface text-neutral-400 border border-dark-border">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{tool.shortDescription}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors ml-2 flex-shrink-0" />
                  </a>
                ))
              ) : (
                <div className="py-8 text-center text-neutral-400 text-sm">
                  <p>No tools matched "{query}"</p>
                  <p className="text-xs text-neutral-500 mt-1">Try keywords like metadata, pdf, image, or base64.</p>
                </div>
              )}
            </div>

            {/* Footer Shortcuts */}
            <div className="px-4 py-2.5 bg-dark-bg/90 border-t border-dark-border flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>Press <kbd className="px-1 py-0.5 bg-dark-surface border border-dark-border rounded text-neutral-400">ESC</kbd> to exit</span>
              <span className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Local memory execution</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
