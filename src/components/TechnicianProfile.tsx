'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  MapPin,
  BadgeCheck,
  User,
  ShieldAlert,
  Coins,
  CheckCircle2,
} from 'lucide-react';
import type { TechnicianWithServices } from '@/lib/types';
import { useI18n } from '@/lib/i18n';
import { getCategoryName } from '@/lib/categories';
import { telLink, whatsappLink } from '@/lib/phone';

interface TechnicianProfileProps {
  technician: TechnicianWithServices;
}

export function TechnicianProfile({ technician }: TechnicianProfileProps) {
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

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 sm:pb-16">
      {/* Sub-nav / Breadcrumb */}
      <div className="bg-white border-b border-border sticky top-14 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] sm:text-sm font-semibold text-navy-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{t.profile.backToListings}</span>
          </Link>
          <span className="text-[13px] text-slate-500 font-medium truncate max-w-[200px]">
            {technician.town}{districtName ? `, ${districtName}` : ''}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {/* Header Profile Card */}
          <div className="p-6 sm:p-8 bg-white border-b border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Profile Image / Monogram */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 text-navy flex items-center justify-center shrink-0 border border-slate-300">
                {technician.profile_image_url ? (
                  <img
                    src={technician.profile_image_url}
                    alt={technician.name}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <span className="font-extrabold text-navy text-2xl sm:text-3xl tracking-tight">
                    {initials}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-navy tracking-tight">
                    {technician.name}
                  </h1>

                  {technician.verified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[13px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <BadgeCheck size={14} />
                      <span>{t.listings.verified}</span>
                    </span>
                  ) : null}

                  {technician.is_demo && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[13px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                      <ShieldAlert size={13} />
                      <span>{t.listings.demoLabel}</span>
                    </span>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-3">
                  <MapPin size={15} className="text-primary shrink-0" />
                  <span>
                    {technician.town}
                    {districtName && ` (${districtName} ${locale === 'si' ? 'දිස්ත්‍රික්කය' : 'District'})`}
                  </span>
                </div>

                {/* Category tags */}
                <div className="flex flex-wrap gap-1.5">
                  {technician.services?.map((s) => (
                    <span
                      key={s.slug}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[13px] font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {getCategoryName(s, locale)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Indicative Pricing Card */}
            {technician.indicative_price_lkr ? (
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <Coins size={24} className="text-primary" />
                  <div>
                    <h2 className="text-[13px] font-bold text-navy uppercase tracking-wider">
                      {t.profile.pricing}
                    </h2>
                    <p className="text-[13px] text-slate-600">
                      {locale === 'si'
                        ? 'මූලික ගාස්තුව (කාර්යය අනුව වෙනස් විය හැක)'
                        : 'Starting rate (may vary based on task)'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-black text-primary">
                    {t.profile.pricingFrom} {technician.indicative_price_lkr.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : null}

            {/* About / Description */}
            {description && (
              <div>
                <h2 className="text-sm font-bold text-navy uppercase tracking-wider mb-2">
                  {t.profile.about}
                </h2>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed">
                  {description}
                </div>
              </div>
            )}

            {/* Service Coverage */}
            <div>
              <h2 className="text-sm font-bold text-navy uppercase tracking-wider mb-2">
                {t.profile.serviceArea}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 p-3.5 rounded-xl border border-border bg-white">
                  <CheckCircle2 size={18} className="text-primary shrink-0" />
                  <div>
                    <span className="font-semibold text-navy block text-[13px]">
                      {locale === 'si' ? 'ප්‍රධාන නගරය' : 'Primary Town'}
                    </span>
                    <span className="text-slate-600 text-[13px]">{technician.town}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3.5 rounded-xl border border-border bg-white">
                  <CheckCircle2 size={18} className="text-primary shrink-0" />
                  <div>
                    <span className="font-semibold text-navy block text-[13px]">
                      {locale === 'si' ? 'දිස්ත්‍රික් ආවරණය' : 'District Coverage'}
                    </span>
                    <span className="text-slate-600 text-[13px]">
                      {districtName || technician.district_code}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Contact Buttons */}
            {(hasPhone || hasWhatsApp) && (
              <div className="hidden sm:flex items-center gap-3 pt-4 border-t border-border">
                {hasPhone && (
                  <a
                    href={telLink(technician.phone)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm transition-all"
                  >
                    <Phone size={18} />
                    <span>{t.profile.callNow}</span>
                  </a>
                )}
                {hasWhatsApp && (
                  <a
                    href={whatsappLink(technician.whatsapp_number)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm transition-all"
                  >
                    <MessageSquare size={18} />
                    <span>{t.profile.whatsapp}</span>
                  </a>
                )}
              </div>
            )}

            {/* Demo Notice */}
            {!hasPhone && !hasWhatsApp && technician.is_demo && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <p className="text-[13px] sm:text-sm text-amber-900 font-medium">
                  {locale === 'si'
                    ? 'මෙය පරීක්ෂණ නාමාවලි ලැයිස්තුවකි. සැබෑ සම්බන්ධතා තොරතුරු සපයා නොමැත.'
                    : 'This is a sample directory listing. Real contact details are not provided.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Thumb-Zone Bar */}
      {(hasPhone || hasWhatsApp) && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border p-3">
          <div className="flex gap-2.5 max-w-md mx-auto">
            {hasPhone && (
              <a
                href={telLink(technician.phone)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold text-sm"
              >
                <Phone size={16} />
                <span>{t.profile.callNow}</span>
              </a>
            )}
            {hasWhatsApp && (
              <a
                href={whatsappLink(technician.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-emerald-700 text-white rounded-xl font-bold text-sm"
              >
                <MessageSquare size={16} />
                <span>{t.profile.whatsapp}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
