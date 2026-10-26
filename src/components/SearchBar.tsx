'use client';

import { Search } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  dark?: boolean;
}

export function SearchBar({ value, onChange, className = '', dark = false }: SearchBarProps) {
  const { t } = useI18n();

  return (
    <div className={`relative ${className}`}>
      <Search
        size={20}
        className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
          dark ? 'text-blue-300' : 'text-slate-400'
        }`}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.hero.searchPlaceholder}
        className={`w-full pl-12 pr-5 rounded-2xl text-[15px] transition-all ${
          dark
            ? 'py-4 bg-white/10 border border-white/25 text-white placeholder-blue-300/60 focus:bg-white/15 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/30 focus:outline-none'
            : 'py-3 border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none'
        }`}
        aria-label={t.hero.searchPlaceholder}
      />
    </div>
  );
}
