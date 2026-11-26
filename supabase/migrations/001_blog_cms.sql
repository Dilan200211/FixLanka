-- FixLanka Tools: Supabase Blog CMS & SEO Metadata Schema
-- Run this migration in your Supabase SQL Editor before connecting the /admin/ dashboard.

create extension if not exists "pgcrypto";

-- 1. Content status enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'article_status') then
    create type public.article_status as enum (
      'draft',
      'in_review',
      'scheduled',
      'published',
      'archived'
    );
  end if;
end $$;

-- 2. Admin role allow-list table (controls who can mutate CMS records)
create table if not exists public.cms_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.cms_admins enable row level security;

create policy "Admins can read own admin row"
  on public.cms_admins for select
  using (auth.uid() = user_id);

-- Helper function to check CMS admin authorization
create or replace function public.is_cms_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.cms_admins where user_id = auth.uid()
  );
$$;

-- 3. Authors table
create table if not exists public.authors (
  id text primary key,
  name text not null,
  role text not null,
  bio text not null,
  profile_url text not null default 'https://fixlanka.com/about/',
  same_as text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.authors enable row level security;

create policy "Public can read authors"
  on public.authors for select
  using (true);

create policy "Admins can manage authors"
  on public.authors for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- 4. Blog categories table
create table if not exists public.blog_categories (
  slug text primary key,
  name text not null,
  description text not null,
  created_at timestamptz not null default now()
);

alter table public.blog_categories enable row level security;

create policy "Public can read blog categories"
  on public.blog_categories for select
  using (true);

create policy "Admins can manage blog categories"
  on public.blog_categories for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- 5. Articles table
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  seo_title text,
  meta_description text not null,
  excerpt text not null,
  body_markdown text not null,
  status public.article_status not null default 'draft',
  category_slug text not null references public.blog_categories(slug),
  author_id text not null references public.authors(id) default 'dilan-vinod',
  tags text[] not null default '{}',
  featured_image text not null default '/blog-covers/default.svg',
  image_alt text not null,
  canonical_url text,
  noindex boolean not null default false,
  related_tools text[] not null default '{}',
  related_articles text[] not null default '{}',
  references_json jsonb not null default '[]'::jsonb,
  faqs_json jsonb not null default '[]'::jsonb,
  published_at timestamptz,
  scheduled_for timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists articles_status_published_idx
  on public.articles (status, published_at desc);

create index if not exists articles_category_idx
  on public.articles (category_slug);

alter table public.articles enable row level security;

-- Public readers only see published articles whose schedule time has passed
create policy "Public can read published articles"
  on public.articles for select
  using (
    status = 'published'
    and (scheduled_for is null or scheduled_for <= now())
  );

-- Authenticated CMS admins can read/write all drafts, reviews, scheduled, and archived articles
create policy "CMS admins can manage all articles"
  on public.articles for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- Automatic updated_at trigger
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_touch_updated_at on public.articles;
create trigger articles_touch_updated_at
  before update on public.articles
  for each row execute function public.touch_updated_at();

-- 6. Seed default authors and blog categories
insert into public.authors (id, name, role, bio, profile_url)
values
  ('dilan-vinod', 'Dilan Vinod', 'Creator & Software Engineer, FixLanka Tools', 'Builds privacy-first, client-side web utilities in Sri Lanka using Astro, TypeScript, and browser-native APIs.', 'https://fixlanka.com/about/'),
  ('fixlanka-editorial', 'FixLanka Editorial Team', 'Technical Documentation & Review', 'Maintains tool documentation, format specifications, and practical how-to guides grounded in web standards.', 'https://fixlanka.com/editorial-policy/')
on conflict (id) do nothing;

insert into public.blog_categories (slug, name, description)
values
  ('tutorials', 'Tutorials', 'Step-by-step walkthroughs for everyday image, PDF, media, and developer tasks.'),
  ('how-to-guides', 'How-To Guides', 'Practical guides focused on solving specific file, formatting, and web tasks cleanly.'),
  ('technology', 'Technology', 'Clear explanations of browser APIs, file formats, encoding standards, and web fundamentals.'),
  ('image-optimization', 'Image Optimization', 'Techniques for reducing image byte size, choosing formats, and speeding up web pages.'),
  ('file-management', 'File Management', 'Practical workflows for merging, splitting, compressing, and organizing PDFs and files.'),
  ('developer-guides', 'Developer Guides', 'Reference guides on JSON validation, UTF-8 Base64 encoding, meta tags, and debugging.'),
  ('online-security', 'Online Security', 'Guides on EXIF privacy, password entropy, cryptographic hashing, and safe file handling.'),
  ('productivity', 'Productivity', 'Time-saving workflows using lightweight browser utilities with zero sign-up.'),
  ('digital-tools', 'Digital Tools', 'Comparisons and practical setups for free, privacy-friendly browser utilities.'),
  ('educational-guides', 'Educational Guides', 'Foundational concepts behind storage units, metadata standards, and document formats.')
on conflict (slug) do nothing;

-- 7. Storage bucket for blog featured images (optional)
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy "Public read blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "CMS admins can upload blog images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and public.is_cms_admin());

create policy "CMS admins can update or delete blog images"
  on storage.objects for update
  using (bucket_id = 'blog-images' and public.is_cms_admin());

create policy "CMS admins can delete blog images"
  on storage.objects for delete
  using (bucket_id = 'blog-images' and public.is_cms_admin());

-- 8. Explicit schema and table grants (RLS still restricts writes to cms_admins and reads to published rows)
grant usage on schema public to anon, authenticated, service_role;

grant select on public.authors to anon, authenticated;
grant all on public.authors to authenticated, service_role;

grant select on public.blog_categories to anon, authenticated;
grant all on public.blog_categories to authenticated, service_role;

grant select on public.articles to anon, authenticated;
grant all on public.articles to authenticated, service_role;

grant select on public.cms_admins to authenticated;
grant all on public.cms_admins to service_role;

grant execute on function public.is_cms_admin() to anon, authenticated;
