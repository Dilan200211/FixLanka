'use client';

import { SearchX } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function EmptyState() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center mb-4">
        <SearchX size={24} className="text-navy-light" />
      </div>
      <p className="font-medium text-navy mb-1">{t.listings.noResults}</p>
      <p className="text-sm text-navy-light">{t.listings.noResultsHint}</p>
    </div>
  );
}
