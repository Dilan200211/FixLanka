import { districts } from '@/lib/districts';
import type { TechnicianWithServices, ServiceCategory } from '@/lib/types';

/**
 * Normalizes raw Supabase row join into typed TechnicianWithServices.
 * Safe to use in both Server and Client Components.
 */
export function formatTechnician(record: any): TechnicianWithServices {
  const services: ServiceCategory[] =
    record.services?.map((ts: any) => ts.category).filter(Boolean) ||
    record.categories ||
    [];

  const district =
    record.district ||
    districts.find((d) => d.code === record.district_code) || {
      code: record.district_code || '',
      name_si: record.district_code || '',
      name_en: record.district_code || '',
    };

  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    phone: record.phone || '',
    whatsapp_number: record.whatsapp_number || '',
    description_si: record.description_si || '',
    description_en: record.description_en || '',
    district_code: record.district_code || '',
    town: record.town || '',
    profile_image_url: record.profile_image_url || null,
    indicative_price_lkr: record.indicative_price_lkr ?? null,
    published: Boolean(record.published),
    verified: Boolean(record.verified),
    is_demo: Boolean(record.is_demo),
    created_at: record.created_at || new Date().toISOString(),
    updated_at: record.updated_at || new Date().toISOString(),
    services,
    district,
  };
}
