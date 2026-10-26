'use client';

import { useI18n } from '@/lib/i18n';
import { districts } from '@/lib/districts';
import { MapPin, Navigation } from 'lucide-react';

interface DistrictFilterProps {
  selectedDistrict: string;
  onDistrictChange: (code: string) => void;
  townSearch: string;
  onTownSearchChange: (value: string) => void;
}

export function DistrictFilter({
  selectedDistrict,
  onDistrictChange,
  townSearch,
  onTownSearchChange,
}: DistrictFilterProps) {
  const { locale, t } = useI18n();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
      {/* District Select */}
      <div className="relative w-full sm:w-52">
        <MapPin
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70 pointer-events-none"
        />
        <select
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="w-full pl-9 pr-8 py-2 rounded-xl border border-border bg-white text-sm font-medium text-navy focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none transition-all"
          aria-label={t.listings.filterByDistrict}
        >
          <option value="">{t.listings.filterByDistrict}</option>
          {districts.map((d) => (
            <option key={d.code} value={d.code}>
              {locale === 'si' ? d.name_si : d.name_en}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
          ▼
        </span>
      </div>

      {/* Town Input */}
      <div className="relative w-full sm:w-48">
        <Navigation
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={townSearch}
          onChange={(e) => onTownSearchChange(e.target.value)}
          placeholder={t.listings.filterByTown}
          className="w-full pl-8 pr-3 py-2 rounded-xl border border-border bg-white text-sm text-navy focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
          aria-label={t.listings.filterByTown}
        />
      </div>
    </div>
  );
}
