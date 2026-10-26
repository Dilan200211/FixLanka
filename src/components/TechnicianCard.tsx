'use client';

import Link from 'next/link';
import { MapPin, BadgeCheck, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import type { TechnicianWithServices } from '@/lib/types';
import { useI18n } from '@/lib/i18n';
import { getCategoryName } from '@/lib/categories';
import { telLink, whatsappLink } from '@/lib/phone';

// Avatar background colors — cycle by first letter
const avatarColors = [
  'from-blue-500 to-blue-700',
  'from-violet-500 to-violet-700',
  'from-emerald-500 to-emerald-700',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-rose-700',
  'from-cyan-500 to-cyan-700',
];

function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[idx];
}

interface TechnicianCardProps {
  technician: TechnicianWithServices;
}

export function TechnicianCard({ technician }: TechnicianCardProps) {
  const { locale, t } = useI18n();

  const description =
    locale === 'si' ? technician.description_si : technician.description_en;

  const districtName =
    locale === 'si'
      ? technician.district?.name_si
      : technician.district?.name_en;

  const hasPhone = !!technician.phone;
  const hasWhatsApp = !!technician.whatsapp_number;

  const initials = technician.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const avatarGradient = getAvatarColor(technician.name);

  return (
    <article className="card p-5 h-full flex flex-col justify-between group">
      <div>
        {/* Header row */}
        <div className="flex items-start gap-3.5 mb-3">
          {/* Avatar / Monogram */}
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarGradient} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md`}>
            {technician.profile_image_url ? (
              <img
                src={technician.profile_image_url}
                alt={technician.name}
                className="w-12 h-12 rounded-2xl object-cover"
              />
            ) : (
              <span className="font-black text-[15px] tracking-tight">{initials}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/technicians/${technician.slug}`}
                className="font-black text-[#0F172A] hover:text-blue-600 transition-colors text-base truncate"
                style={{ letterSpacing: '-0.01em' }}
              >
                {technician.name}
              </Link>
              {technician.verified && (
                <span title={t.listings.verified} className="text-blue-500 shrink-0">
                  <BadgeCheck size={17} />
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 mt-0.5">
              <MapPin size={13} className="text-blue-500 shrink-0" />
              <span className="truncate">
                {technician.town}
                {districtName && ` • ${districtName}`}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[13.5px] sm:text-sm text-slate-600 line-clamp-2 min-h-[2.6rem] mb-3 leading-relaxed">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[44px] content-start">
          {technician.services?.map((s) => (
            <span
              key={s.slug}
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-[12px] font-semibold bg-blue-50 text-blue-700 border border-blue-100"
            >
              {getCategoryName(s, locale)}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Price & Direct Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div>
          {technician.indicative_price_lkr ? (
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide leading-none mb-1">
                {locale === 'si' ? 'ආරම්භක මිල' : 'Starting from'}
              </span>
              <span className="text-sm sm:text-base font-black text-[#0F172A]" style={{ letterSpacing: '-0.01em' }}>
                {t.profile.pricingFrom} {technician.indicative_price_lkr.toLocaleString()}
              </span>
            </div>
          ) : technician.is_demo ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              {t.listings.demoLabel}
            </span>
          ) : null}
        </div>

        {/* Quick Contact or Profile button */}
        <div className="flex items-center gap-1.5">
          {hasPhone && (
            <a
              href={telLink(technician.phone)}
              aria-label={`${t.profile.callNow} ${technician.name}`}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <Phone size={15} />
            </a>
          )}
          {hasWhatsApp && (
            <a
              href={whatsappLink(technician.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.profile.whatsapp} ${technician.name}`}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
            >
              <MessageSquare size={15} />
            </a>
          )}
          <Link
            href={`/technicians/${technician.slug}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[13px] font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span>{t.listings.viewProfile}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
