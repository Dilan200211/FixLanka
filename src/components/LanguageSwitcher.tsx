'use client';

import { useI18n } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div
      role="group"
      aria-label="Language selection"
      className="inline-flex items-center p-0.5 rounded-lg bg-surface border border-border text-[13px] font-semibold"
    >
      <button
        type="button"
        onClick={() => setLocale('si')}
        className={`px-2.5 py-1 rounded-md transition-all ${
          locale === 'si'
            ? 'bg-white text-primary shadow-xs font-bold'
            : 'text-navy-muted hover:text-navy'
        }`}
        aria-pressed={locale === 'si'}
      >
        සිංහල
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`px-2.5 py-1 rounded-md transition-all ${
          locale === 'en'
            ? 'bg-white text-primary shadow-xs font-bold'
            : 'text-navy-muted hover:text-navy'
        }`}
        aria-pressed={locale === 'en'}
      >
        English
      </button>
    </div>
  );
}
