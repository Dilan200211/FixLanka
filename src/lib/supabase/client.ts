import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type ArticleStatus = 'draft' | 'in_review' | 'scheduled' | 'published' | 'archived';

export interface SupabaseArticleRow {
  id: string;
  slug: string;
  title: string;
  seo_title: string | null;
  meta_description: string;
  excerpt: string;
  body_markdown: string;
  status: ArticleStatus;
  category_slug: string;
  author_id: string;
  tags: string[];
  featured_image: string;
  image_alt: string;
  canonical_url: string | null;
  noindex: boolean;
  related_tools: string[];
  related_articles: string[];
  references_json: { title: string; url: string }[];
  faqs_json: { question: string; answer: string }[];
  published_at: string | null;
  scheduled_for: string | null;
  updated_at: string;
  created_at: string;
}

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === 'undefined' || !isSupabaseConfigured) return null;
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return cachedClient;
}
