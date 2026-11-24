import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight, X } from 'lucide-react';
import { TOOLS } from '../../data/tools';
import type { ToolDefinition } from '../../types/tool';

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<ToolDefinition[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const q = query.toLowerCase().trim();
    const filtered = TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
    ).slice(0, 6);
    setResults(filtered);
    setIsOpen(true);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (results.length > 0) {
            window.location.href = `/tools/${results[0].slug}`;
          }
        }}
        className="relative flex items-center w-full shadow-sm dark:shadow-none rounded-xl"
      >
        <div className="relative flex-grow flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-dark-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim()) setIsOpen(true);
            }}
            placeholder="Search for a tool... (e.g. compress photo, merge pdf, qr code)"
            className="w-full pl-10 pr-12 py-3 bg-dark-card border border-dark-border border-r-0 focus:border-brand-500 rounded-l-xl text-sm text-dark-text placeholder-dark-muted focus:outline-none transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="absolute right-3 p-1 text-dark-muted hover:text-dark-text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm rounded-r-xl border border-brand-600 transition-colors flex-shrink-0 flex items-center gap-1.5"
        >
          <span>Search</span>
        </button>
      </form>

      {/* Live Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden divide-y divide-dark-border">
          {results.length > 0 ? (
            results.map((tool) => (
              <a
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="flex items-center justify-between p-3.5 hover:bg-dark-raised/60 transition-colors group"
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
                <ArrowRight className="w-4 h-4 text-dark-muted group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex-shrink-0 ml-3" />
              </a>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-dark-secondary">
              No tools matching "{query}". Try "photo", "pdf", or "qr code".
            </div>
          )}
        </div>
      )}
    </div>
  );
}