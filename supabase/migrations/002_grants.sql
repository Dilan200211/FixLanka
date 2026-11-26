-- FixLanka Tools: Explicit PostgreSQL role grants for Supabase API access
-- Run this in Supabase SQL Editor if you see: "permission denied for table authors/articles"

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
