'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Wrench, Menu, X, PlusCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const { locale, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Wrench size={22} className="text-primary shrink-0" strokeWidth={2.5} />
          <div className="flex flex-col">
            <span className="font-extrabold text-navy text-xl leading-none tracking-tight">
              FixLanka
            </span>
            <span className="text-[13px] font-semibold text-slate-500 leading-tight mt-0.5">
              {locale === 'si' ? 'කාර්මික නාමාවලිය' : 'Technician Directory'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg text-sm font-semibold text-navy hover:bg-slate-100 transition-colors"
          >
            {t.nav.home}
          </Link>

          <a
            href="https://wa.me/?text=I%20want%20to%20register%20as%20a%20technician%20on%20FixLanka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary-hover transition-colors shadow-none"
          >
            <PlusCircle size={15} />
            <span>{t.nav.registerTechnician}</span>
          </a>

          <LanguageSwitcher />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-navy transition-colors"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-white px-4 py-3 space-y-2">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-navy hover:bg-slate-50 transition-colors"
          >
            {t.nav.home}
          </Link>
          <a
            href="https://wa.me/?text=I%20want%20to%20register%20as%20a%20technician%20on%20FixLanka"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold bg-primary text-white transition-colors"
          >
            <PlusCircle size={16} />
            <span>{t.nav.registerTechnician}</span>
          </a>
        </nav>
      )}
    </header>
  );
}
