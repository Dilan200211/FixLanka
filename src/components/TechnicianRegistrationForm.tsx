'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Wrench,
  Sparkles,
  Phone,
  MessageSquare,
  MapPin,
  Coins,
  ShieldCheck,
  AlertCircle,
  Zap,
  Snowflake,
  WashingMachine,
  Hammer,
  PaintBucket,
  Smartphone,
  SprayCan,
  type LucideIcon,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { districts, getDistrictName } from '@/lib/districts';
import { serviceCategories, getCategoryName } from '@/lib/categories';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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

interface FormState {
  name: string;
  phone: string;
  whatsapp_number: string;
  sameAsPhone: boolean;
  district_code: string;
  town: string;
  category_ids: string[];
  indicative_price_lkr: string;
  description_en: string;
  description_si: string;
}

const initialForm: FormState = {
  name: '',
  phone: '',
  whatsapp_number: '',
  sameAsPhone: true,
  district_code: 'CMB',
  town: '',
  category_ids: [],
  indicative_price_lkr: '',
  description_en: '',
  description_si: '',
};

export function TechnicianRegistrationForm() {
  const { locale, t } = useI18n();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const toggleCategory = (catId: string) => {
    setForm((prev) => {
      const exists = prev.category_ids.includes(catId);
      const updated = exists
        ? prev.category_ids.filter((id) => id !== catId)
        : [...prev.category_ids, catId];
      return { ...prev, category_ids: updated };
    });
    if (fieldErrors.category_ids) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.category_ids;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Client-side quick checks
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = locale === 'si' ? 'නම ඇතුළත් කිරීම අනිවාර්යයි' : 'Name is required';
    if (!form.phone.trim()) errors.phone = locale === 'si' ? 'දුරකථන අංකය ඇතුළත් කිරීම අනිවාර්යයි' : 'Phone number is required';
    if (!form.town.trim()) errors.town = locale === 'si' ? 'නගරය ඇතුළත් කිරීම අනිවාර්යයි' : 'Town is required';
    if (form.category_ids.length === 0) {
      errors.category_ids = locale === 'si' ? 'අවම වශයෙන් එක් සේවා කාණ්ඩයක්වත් තෝරන්න' : 'Select at least one service category';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/technicians/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          whatsapp_number: form.sameAsPhone ? form.phone.trim() : form.whatsapp_number.trim(),
          district_code: form.district_code,
          town: form.town.trim(),
          category_ids: form.category_ids,
          indicative_price_lkr: form.indicative_price_lkr ? Number(form.indicative_price_lkr) : null,
          description_en: form.description_en.trim(),
          description_si: form.description_si.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
        } else {
          setError(data.error || 'Failed to submit registration. Please try again.');
        }
        return;
      }

      setSubmittedName(form.name.trim());
    } catch (err: any) {
      setError(err?.message || 'Network error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />

      <main className="flex-1 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb back */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>{t.profile.backToListings}</span>
            </Link>
          </div>

          {submittedName ? (
            /* Success confirmation card */
            <div className="bg-white rounded-3xl border border-[#DDE6F3] p-8 sm:p-12 text-center shadow-lg">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
                <CheckCircle2 size={44} strokeWidth={2.5} />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-3">
                {locale === 'si' ? 'අයදුම්පත ලැබිණි' : 'Application Received'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] mb-3 tracking-tight">
                {t.register.successTitle}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto mb-8">
                {t.register.successMessage}
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-8 text-left">
                <p className="font-bold text-[#0F172A] mb-1">
                  {locale === 'si' ? 'මීළඟ පියවර කුමක්ද?' : 'What happens next?'}
                </p>
                <p>
                  {locale === 'si'
                    ? 'අපගේ පරිපාලක කණ්ඩායම විසින් ඔබගේ විස්තර පරීක්ෂා කර අනුමත කරනු ඇත. අනුමත වූ වහාම ඔබගේ පැතිකඩ සෘජුවම වෙබ් අඩවියේ පාරිභෝගිකයින්ට දර්ශනය වේ.'
                    : 'Our admin team reviews your application for verification. Once approved, your profile goes live immediately for customers to call and message you directly.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 text-center"
                >
                  {t.register.backHome}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedName(null);
                    setForm(initialForm);
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-center cursor-pointer"
                >
                  {t.register.registerAnother}
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <div className="bg-white rounded-3xl border border-[#DDE6F3] overflow-hidden shadow-sm">
              {/* Header Banner */}
              <div
                className="p-6 sm:p-8 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 60%, #312E81 100%)' }}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-blue-200 backdrop-blur-sm border border-white/20 mb-3">
                  <Sparkles size={13} className="text-yellow-300" />
                  <span>{t.register.badge}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                  {t.register.pageTitle}
                </h1>
                <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-xl">
                  {t.register.pageSubtitle}
                </p>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7">
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-red-800">
                    <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Section 1: Personal Details */}
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
                    <span>{locale === 'si' ? 'පුද්ගලික විස්තර' : 'Personal Details'}</span>
                  </h2>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1.5">
                        {t.register.fullName} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t.register.fullNamePlaceholder}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-[#0F172A] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          fieldErrors.name ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      />
                      {fieldErrors.name && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.name}</p>
                      )}
                    </div>

                    {/* Phone & WhatsApp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                          <Phone size={14} className="text-blue-600" />
                          <span>{t.register.phone}</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder={t.register.phonePlaceholder}
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-[#0F172A] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                            fieldErrors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                          }`}
                        />
                        <p className="text-[11px] text-slate-500 mt-1">{t.register.phoneHint}</p>
                        {fieldErrors.phone && (
                          <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                          <MessageSquare size={14} className="text-emerald-600" />
                          <span>{t.register.whatsapp}</span>
                        </label>
                        <input
                          type="tel"
                          disabled={form.sameAsPhone}
                          placeholder={t.register.whatsappPlaceholder}
                          value={form.sameAsPhone ? form.phone : form.whatsapp_number}
                          onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all ${
                            form.sameAsPhone
                              ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                              : 'bg-slate-50/50 text-[#0F172A] border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                          }`}
                        />
                        <label className="inline-flex items-center gap-2 mt-2 cursor-pointer text-xs font-semibold text-slate-600">
                          <input
                            type="checkbox"
                            checked={form.sameAsPhone}
                            onChange={(e) => setForm({ ...form, sameAsPhone: e.target.checked })}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                          />
                          <span>{t.register.sameAsPhone}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Services / Trades */}
                <div className="pt-2 border-t border-slate-100">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">2</span>
                    <span>{t.register.services}</span>
                    <span className="text-red-500">*</span>
                  </h2>
                  <p className="text-xs text-slate-500 mb-4">{t.register.servicesHint}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {serviceCategories.map((cat) => {
                      const Icon = cat.icon ? iconMap[cat.icon] : Wrench;
                      const isSelected = form.category_ids.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]'
                              : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-white'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-white text-blue-600 border border-slate-200'
                            }`}
                          >
                            {Icon && <Icon size={18} strokeWidth={isSelected ? 2.5 : 2} />}
                          </div>
                          <span className="text-xs font-bold leading-tight">
                            {getCategoryName(cat, locale)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {fieldErrors.category_ids && (
                    <p className="text-xs text-red-600 mt-2 font-medium">{fieldErrors.category_ids}</p>
                  )}
                </div>

                {/* Section 3: Service Location */}
                <div className="pt-2 border-t border-slate-100">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">3</span>
                    <span>{locale === 'si' ? 'සේවා ප්‍රදේශය' : 'Service Location'}</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* District */}
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                        <MapPin size={14} className="text-blue-600" />
                        <span>{t.register.district}</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.district_code}
                        onChange={(e) => setForm({ ...form, district_code: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F172A] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        {districts.map((d) => (
                          <option key={d.code} value={d.code}>
                            {getDistrictName(d.code, locale)} ({d.name_en})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Town */}
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1.5">
                        {t.register.town} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t.register.townPlaceholder}
                        value={form.town}
                        onChange={(e) => setForm({ ...form, town: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-[#0F172A] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          fieldErrors.town ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      />
                      {fieldErrors.town && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.town}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 4: Pricing & Bio */}
                <div className="pt-2 border-t border-slate-100">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">4</span>
                    <span>{locale === 'si' ? 'ගාස්තු සහ හැඳින්වීම' : 'Pricing & Experience'}</span>
                  </h2>

                  <div className="space-y-4">
                    {/* Indicative Rate */}
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                        <Coins size={14} className="text-amber-500" />
                        <span>{t.register.price}</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400">LKR</span>
                        <input
                          type="number"
                          placeholder={t.register.pricePlaceholder}
                          value={form.indicative_price_lkr}
                          onChange={(e) => setForm({ ...form, indicative_price_lkr: e.target.value })}
                          className="w-full pl-13 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F172A] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{t.register.priceHint}</p>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1.5">
                        {t.register.description}
                      </label>
                      <textarea
                        rows={3}
                        placeholder={t.register.descriptionPlaceholder}
                        value={locale === 'si' ? form.description_si : form.description_en}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({
                            ...form,
                            description_en: val,
                            description_si: val,
                          });
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F172A] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-black rounded-2xl text-base shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>{t.register.submitting}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        <span>{t.register.submit}</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-3">
                    {t.register.info}
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
