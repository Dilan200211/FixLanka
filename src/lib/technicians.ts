import { createPublicServerClient } from '@/lib/supabase/server';
import { formatTechnician } from '@/lib/technician-format';
import type { TechnicianWithServices } from '@/lib/types';

export { formatTechnician };

/**
 * Fetches all published technicians from Supabase.
 * Returns empty array if Supabase is unconfigured or has no published technicians.
 */
export async function getPublishedTechnicians(): Promise<TechnicianWithServices[]> {
  try {
    const supabase = createPublicServerClient();
    if (!supabase) {
      return [];
    }

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

    if (error || !data) {
      if (error) {
        console.error('Error fetching published technicians from Supabase:', error);
      }
      return [];
    }

    return data.map(formatTechnician);
  } catch (err) {
    console.error('Failed to get published technicians:', err);
    return [];
  }
}

/**
 * Fetches a single published technician by slug from Supabase.
 */
export async function getTechnicianBySlug(
  slug: string
): Promise<TechnicianWithServices | null> {
  try {
    const supabase = createPublicServerClient();
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from('technicians')
      .select(`
        *,
        district:districts(*),
        services:technician_services(
          category:service_categories(*)
        )
      `)
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return formatTechnician(data);
  } catch (err) {
    console.error(`Failed to get technician by slug (${slug}):`, err);
    return null;
  }
}

/**
 * Fetches all published slugs for static routes & sitemap generation.
 */
export async function getAllPublishedSlugs(): Promise<string[]> {
  try {
    const supabase = createPublicServerClient();
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('technicians')
      .select('slug')
      .eq('published', true);

    if (error || !data) {
      return [];
    }

    return data.map((t: { slug: string }) => t.slug);
  } catch {
    return [];
  }
}
