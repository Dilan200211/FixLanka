'use client';

import { useState, useMemo, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { CategoryCard } from '@/components/CategoryCard';
import { TechnicianCard } from '@/components/TechnicianCard';
import { DistrictFilter } from '@/components/DistrictFilter';
import { EmptyState } from '@/components/EmptyState';
import { useI18n } from '@/lib/i18n';
import { serviceCategories, getCategoryName } from '@/lib/categories';
import { formatTechnician } from '@/lib/technician-format';
import { districts } from '@/lib/districts';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { TechnicianWithServices } from '@/lib/types';
import { MessageSquare, RotateCcw, ShieldCheck, Wrench, Sparkles } from 'lucide-react';

interface HomePageProps {
  initialTechnicians?: TechnicianWithServices[];
}

export function HomePage({ initialTechnicians }: HomePageProps = {}) {
  const { locale, t } = useI18n();
  const [technicians, setTechnicians] = useState<TechnicianWithServices[]>(
    initialTechnicians ?? []
  );
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [townSearch, setTownSearch] = useState('');

  useEffect(() => {
    async function loadPublishedTechnicians() {
      try {
        if (!isSupabaseConfigured()) {
          return;
        }

        const supabase = createClient();
        const { data, error } = await supabase
          .from('technicians')
          .select(`
            *,
            district:districts(*),
            services:technician_services(
              category:service_categories(*)
            )
          `)
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const formatted = data.map(formatTechnician);
          setTechnicians(formatted);
        }
      } catch (err) {
        console.error('Error loading published technicians:', err);
      }
    }

    loadPublishedTechnicians();
  }, []);

  const filteredTechnicians = useMemo(() => {
    let results = technicians.filter((tech) => tech.published);

    // Search query filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      results = results.filter((tech) => {
        const name = tech.name.toLowerCase();
        const descEn = tech.description_en.toLowerCase();
        const descSi = tech.description_si.toLowerCase();
        const town = tech.town.toLowerCase();
        const districtEn = tech.district?.name_en.toLowerCase() ?? '';
        const districtSi = tech.district?.name_si.toLowerCase() ?? '';
        const serviceNames = tech.services
          ?.map((s) => `${s.name_en} ${s.name_si}`.toLowerCase())
          .join(' ') ?? '';
        return (
          name.includes(q) ||
          descEn.includes(q) ||
          descSi.includes(q) ||
          town.includes(q) ||
          districtEn.includes(q) ||
          districtSi.includes(q) ||
          serviceNames.includes(q)
        );
      });
    }

    // Category filter
    if (selectedCategory) {
      results = results.filter((tech) =>
        tech.services?.some((s) => s.slug === selectedCategory)
      );
    }

    // District filter
    if (selectedDistrict) {
      results = results.filter(
        (tech) => tech.district_code === selectedDistrict
      );
    }

    // Town filter
    if (townSearch.trim()) {
      const q = townSearch.toLowerCase().trim();
      results = results.filter((tech) =>
        tech.town.toLowerCase().includes(q)
      );
    }

    return results;
  }, [search, selectedCategory, selectedDistrict, townSearch]);

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory((prev) => (prev === slug ? '' : slug));
  };

  const hasActiveFilters = Boolean(
    search || selectedCategory || selectedDistrict || townSearch
  );

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedDistrict('');
    setTownSearch('');
  };

  return (
    <main className="min-h-screen bg-[#EEF2FF]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0F172A] pt-10 sm:pt-16 pb-10 sm:pb-14 px-4">
        {/* Dot grid background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.18) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Blue glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.35) 0%, transparent 70%)' }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[13px] font-semibold mb-5 tracking-wide">
            <ShieldCheck size={15} className="text-blue-400" />
            <span>
              {locale === 'si'
                ? 'ශ්‍රී ලංකාවේ විශ්වාසවන්ත කාර්මික ශිල්පීන්ගේ නාමාවලිය'
                : 'Sri Lanka\'s Trusted Local Technician Directory'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] mb-4" style={{ letterSpacing: '-0.02em' }}>
            {t.hero.headline}
          </h1>

          <p className="text-blue-200/80 text-sm sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            {t.hero.subheadline}
          </p>

          {/* Search Bar Container */}
          <div className="max-w-2xl mx-auto">
            <SearchBar
              value={search}
              onChange={setSearch}
              className="w-full"
              dark
            />

            {/* Quick Keyword Shortcuts */}
            <div className="flex items-center justify-center flex-wrap gap-2 mt-4 text-[13px]">
              <span className="font-bold text-blue-300/70">
                {locale === 'si' ? 'ජනප්‍රිය:' : 'Popular:'}
              </span>
              {[
                { slug: 'plumbing', labelSi: 'නළ කාර්මික', labelEn: 'Plumber' },
                { slug: 'electrical', labelSi: 'විදුලි කාර්මික', labelEn: 'Electrician' },
                { slug: 'ac', labelSi: 'AC අලුත්වැඩියා', labelEn: 'AC Repair' },
              ].map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => handleCategoryClick(item.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                    selectedCategory === item.slug
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 border border-white/20 text-blue-100 hover:bg-white/20'
                  }`}
                >
                  {locale === 'si' ? item.labelSi : item.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-4 py-8 sm:py-10" style={{ background: 'linear-gradient(180deg, #1E3A8A08 0%, #EEF2FF 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A] flex items-center gap-2" style={{ letterSpacing: '-0.01em' }}>
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white">
                <Wrench size={16} strokeWidth={2.5} />
              </span>
              <span>{t.categories.heading}</span>
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="text-[13px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                {locale === 'si' ? 'සියල්ල බලන්න' : 'Show all'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {serviceCategories
              .filter((c) => c.active)
              .map((cat) => (
                <CategoryCard
                  key={cat.slug}
                  category={cat}
                  selected={selectedCategory === cat.slug}
                  onClick={handleCategoryClick}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Technician Listings Section */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        {/* Listings Header & Filters */}
        <div className="rounded-2xl border border-[#DDE6F3] p-4 mb-6" style={{ background: 'linear-gradient(135deg, #1E40AF08 0%, #ffffff 50%)' }}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A] flex items-center gap-2" style={{ letterSpacing: '-0.01em' }}>
                <span>{t.listings.heading}</span>
                <span className="text-[13px] font-bold px-2.5 py-1 rounded-full bg-blue-600 text-white">
                  {filteredTechnicians.length}
                </span>
                {selectedCategory && (
                  <span className="text-[13px] font-medium text-slate-500">
                    — {getCategoryName(
                      serviceCategories.find((c) => c.slug === selectedCategory)!,
                      locale
                    )}
                  </span>
                )}
              </h2>
              <p className="text-[13px] sm:text-sm text-slate-500 mt-1">
                {locale === 'si'
                  ? 'දුරකථනයෙන් හෝ WhatsApp මගින් සෘජුවම සම්බන්ධ වන්න'
                  : 'Contact technicians directly via phone or WhatsApp'}
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              <DistrictFilter
                selectedDistrict={selectedDistrict}
                onDistrictChange={setSelectedDistrict}
                townSearch={townSearch}
                onTownSearchChange={setTownSearch}
              />

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-slate-600 hover:text-[#0F172A] hover:bg-blue-50 transition-colors"
                  title="Clear all filters"
                >
                  <RotateCcw size={14} />
                  <span>{locale === 'si' ? 'පෙරහන් ඉවත් කරන්න' : 'Reset'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Listings Grid or Empty State */}
        {filteredTechnicians.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredTechnicians.map((tech) => (
              <TechnicianCard key={tech.id} technician={tech} />
            ))}
          </div>
        ) : (
          <div className="card p-8">
            <EmptyState />
            {hasActiveFilters && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <RotateCcw size={15} />
                  <span>{locale === 'si' ? 'සියලු පෙරහන් ඉවත් කර නැවත සොයන්න' : 'Clear filters and try again'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Community Technician Registration CTA */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #312E81 100%)' }}>
        {/* Subtle dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 py-14 sm:py-16 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/20 mb-5">
            <Sparkles size={28} className="text-yellow-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
            {t.register.heading}
          </h2>
          <p className="text-sm sm:text-base text-blue-200 max-w-lg mx-auto mb-8 leading-relaxed">
            {t.register.description}
          </p>
          <a
            href="https://wa.me/?text=I%20want%20to%20register%20as%20a%20technician%20on%20FixLanka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl text-sm sm:text-base transition-all shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 hover:-translate-y-0.5 active:translate-y-0"
          >
            <MessageSquare size={20} />
            <span>{t.register.whatsappCta}</span>
          </a>
          <p className="text-[13px] text-blue-300/70 mt-5 max-w-md mx-auto">
            {t.register.info}
          </p>
        </div>
      </section>
    </main>
  );
}
