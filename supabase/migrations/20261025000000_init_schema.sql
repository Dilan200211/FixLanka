-- FixLanka Database Schema
-- Version 1.0.0

-- 1. Enable UUID extension
create extension if not exists "pgcrypto";

-- 2. Districts table
create table if not exists public.districts (
  code text primary key,
  name_si text not null,
  name_en text not null
);

-- 3. Service Categories table
create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_si text not null,
  name_en text not null,
  icon text,
  active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Technicians table
create table if not exists public.technicians (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  phone text not null default '',
  whatsapp_number text not null default '',
  description_si text not null default '',
  description_en text not null default '',
  district_code text references public.districts(code) on update cascade on delete set null,
  town text not null default '',
  profile_image_url text,
  indicative_price_lkr integer,
  published boolean not null default false,
  verified boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Technician Services junction table
create table if not exists public.technician_services (
  technician_id uuid not null references public.technicians(id) on delete cascade,
  category_id uuid not null references public.service_categories(id) on delete cascade,
  primary key (technician_id, category_id)
);

-- 6. Admin Users table (server-validated admin role)
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists idx_technicians_district on public.technicians(district_code);
create index if not exists idx_technicians_published on public.technicians(published);
create index if not exists idx_technicians_slug on public.technicians(slug);
create index if not exists idx_technician_services_category on public.technician_services(category_id);

-- Auto-update updated_at timestamp function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_technicians_updated
  before update on public.technicians
  for each row execute function public.handle_updated_at();

-- Helper function to check if current user is an admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users
    where id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- 7. Row Level Security (RLS) Setup
alter table public.districts enable row level security;
alter table public.service_categories enable row level security;
alter table public.technicians enable row level security;
alter table public.technician_services enable row level security;
alter table public.admin_users enable row level security;

-- Districts RLS: Everyone can read
create policy "Allow public read access to districts"
  on public.districts for select
  using (true);

-- Categories RLS: Public can view active categories, Admin can manage all
create policy "Allow public read access to active service categories"
  on public.service_categories for select
  using (active = true or public.is_admin());

create policy "Allow admin full access to service categories"
  on public.service_categories for all
  using (public.is_admin());

-- Technicians RLS: Public can view published listings, Admin can manage all
create policy "Allow public read access to published technicians"
  on public.technicians for select
  using (published = true or public.is_admin());

create policy "Allow admin full access to technicians"
  on public.technicians for all
  using (public.is_admin());

-- Technician Services RLS: Public can view services of published technicians, Admin can manage all
create policy "Allow public read access to services of published technicians"
  on public.technician_services for select
  using (
    exists (
      select 1 from public.technicians
      where technicians.id = technician_services.technician_id
        and (technicians.published = true or public.is_admin())
    )
  );

create policy "Allow admin full access to technician services"
  on public.technician_services for all
  using (public.is_admin());

-- Admin Users RLS: Only admins can view admin table
create policy "Allow admins to view admin users"
  on public.admin_users for select
  using (public.is_admin());
