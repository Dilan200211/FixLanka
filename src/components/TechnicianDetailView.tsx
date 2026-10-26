'use client';

import { TechnicianProfile } from '@/components/TechnicianProfile';
import { getDemoTechnician } from '@/lib/demo-data';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft, UserX } from 'lucide-react';

export function TechnicianDetailView({ id }: { id: string }) {
  const { t } = useI18n();
  const technician = getDemoTechnician(id);

  if (!technician) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="bg-white border-b border-border">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-navy-light hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              {t.profile.backToListings}
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-14 h-14 rounded-full bg-white border border-border flex items-center justify-center mb-4">
            <UserX size={24} className="text-navy-light" />
          </div>
          <h1 className="text-lg font-semibold text-navy mb-1">
            {t.profile.notFound}
          </h1>
          <p className="text-sm text-navy-light">
            {t.profile.notFoundHint}
          </p>
        </div>
      </main>
    );
  }

  return <TechnicianProfile technician={technician} />;
}
