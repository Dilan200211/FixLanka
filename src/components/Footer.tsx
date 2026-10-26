'use client';

import { Wrench } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

import { useState, useEffect } from 'react';

export function Footer() {
  const { t } = useI18n();
  const [year, setYear] = useState('2026');

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-lg font-bold mb-2">
              <Wrench size={20} />
              <span>FixLanka</span>
            </div>
            <p className="text-sm text-slate-300 max-w-xs">
              {t.footer.tagline}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
            <a href="#" className="hover:text-white transition-colors">
              {t.footer.contact}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t.footer.privacy}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t.footer.terms}
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700 text-sm text-slate-400">
          {t.footer.copyright.replace('{year}', String(year))}
        </div>
      </div>
    </footer>
  );
}
