'use client';

import { useEffect, useState } from 'react';
import { TechnicianProfile } from '@/components/TechnicianProfile';
import { formatTechnician } from '@/lib/technician-format';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { TechnicianWithServices } from '@/lib/types';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft, UserX, Loader2 } from 'lucide-react';

interface TechnicianDetailViewProps {
  id: string;
  initialTechnician?: TechnicianWithServices | null;
}

export function TechnicianDetailView({ id, initialTechnician }: TechnicianDetailViewProps) {
  const { t } = useI18n();
  const [technician, setTechnician] = useState<TechnicianWithServices | null>(
    initialTechnician ?? null
  );
  const [loading, setLoading] = useState(!initialTechnician);

  useEffect(() => {
    if (initialTechnician) {
      setTechnician(initialTechnician);
      setLoading(false);
      return;
    }

    async function fetchTech() {
      try {
        if (!isSupabaseConfigured()) {
          setLoading(false);
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
          .eq('slug', id)
          .eq('published', true)
          .maybeSingle();

        if (data && !error) {
          setTechnician(formatTechnician(data));
        } else {
          setTechnician(null);
        }
      } catch (err) {
        console.error('Error fetching technician detail:', err);
        setTechnician(null);
      } finally {
        setLoading(false);
      }
    }

    fetchTech();
  }, [id, initialTechnician]);

  if (loading) {
    return (
      <main className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </main>
    );
  }

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
