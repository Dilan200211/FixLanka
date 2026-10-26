'use client';

import {
  Wrench,
  Zap,
  Snowflake,
  WashingMachine,
  Hammer,
  PaintBucket,
  Smartphone,
  SprayCan,
  type LucideIcon,
} from 'lucide-react';
import type { ServiceCategory } from '@/lib/types';
import { useI18n } from '@/lib/i18n';
import { getCategoryName } from '@/lib/categories';

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Zap,
  Snowflake,
  WashingMachine,
  Hammer,
  PaintBucket,
  Smartphone,
  SprayCan,
};

// Vibrant color accent per category
const colorMap: Record<string, { bg: string; icon: string; selectedBg: string }> = {
  plumbing:   { bg: 'bg-blue-50',    icon: 'text-blue-600',   selectedBg: 'bg-blue-600' },
  electrical: { bg: 'bg-yellow-50',  icon: 'text-yellow-600', selectedBg: 'bg-yellow-500' },
  ac:         { bg: 'bg-sky-50',     icon: 'text-sky-600',    selectedBg: 'bg-sky-600' },
  appliances: { bg: 'bg-violet-50',  icon: 'text-violet-600', selectedBg: 'bg-violet-600' },
  carpentry:  { bg: 'bg-amber-50',   icon: 'text-amber-700',  selectedBg: 'bg-amber-600' },
  painting:   { bg: 'bg-rose-50',    icon: 'text-rose-600',   selectedBg: 'bg-rose-600' },
  phone:      { bg: 'bg-green-50',   icon: 'text-green-600',  selectedBg: 'bg-green-600' },
  cleaning:   { bg: 'bg-teal-50',    icon: 'text-teal-600',   selectedBg: 'bg-teal-600' },
};

const defaultColor = { bg: 'bg-slate-50', icon: 'text-slate-600', selectedBg: 'bg-slate-700' };

interface CategoryCardProps {
  category: ServiceCategory;
  selected: boolean;
  onClick: (slug: string) => void;
}

export function CategoryCard({ category, selected, onClick }: CategoryCardProps) {
  const { locale } = useI18n();
  const Icon = category.icon ? iconMap[category.icon] : Wrench;
  const name = getCategoryName(category, locale);
  const colors = colorMap[category.slug] ?? defaultColor;

  return (
    <button
      type="button"
      onClick={() => onClick(category.slug)}
      className={`group flex flex-col items-center justify-center p-4 rounded-2xl text-center transition-all duration-200 cursor-pointer border ${
        selected
          ? `${colors.selectedBg} text-white border-transparent shadow-lg scale-[1.03]`
          : 'bg-white border-[#DDE6F3] hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
      aria-pressed={selected}
      aria-label={name}
    >
      <div
        className={`mb-2.5 flex items-center justify-center w-11 h-11 rounded-xl transition-transform group-hover:scale-110 ${
          selected ? 'bg-white/20' : colors.bg
        }`}
      >
        {Icon && (
          <Icon
            size={22}
            strokeWidth={selected ? 2.5 : 2}
            className={selected ? 'text-white' : colors.icon}
          />
        )}
      </div>
      <span
        className={`text-[12px] sm:text-[13px] font-bold leading-tight line-clamp-2 ${
          selected ? 'text-white' : 'text-[#0F172A]'
        }`}
      >
        {name}
      </span>
    </button>
  );
}
