# Connecting Supabase CMS to FixLanka Tools

FixLanka Tools supports both Git-tracked static blog content (`src/content/blog/*.md`) and an authenticated **Supabase CMS** via the `/admin/` dashboard.

## 1. Database Schema & Row Level Security (RLS)
1. Create a new Supabase project at [supabase.com](https://supabase.com/).
2. Open the **SQL Editor** and run `supabase/migrations/001_blog_cms.sql`.
   - Creates `public.articles`, `public.authors`, `public.blog_categories`, and `public.cms_admins`.
   - Enforces RLS: public users can only `SELECT` rows where `status = 'published'` and `scheduled_for` has passed. All writes require membership in `public.cms_admins`.
   - Creates the `blog-images` public Storage bucket with admin-only upload/delete policies.

## 2. Create Your Admin Account
1. In **Authentication → Users**, create or invite your admin email/password account.
2. Copy the user's UUID and insert it into `public.cms_admins`:
   ```sql
   insert into public.cms_admins (user_id, email, role)
   values ('YOUR-USER-UUID', 'your-email@example.com', 'admin');
   ```

## 3. Environment Variables
Add these public client variables locally in `.env` and in Cloudflare Workers / Pages environment settings:
```env
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```
*(Never expose `SUPABASE_SERVICE_ROLE_KEY` in client builds or `PUBLIC_*` variables.)*

## 4. Rebuild & Use `/admin/`
Visit `https://fixlanka.com/admin/` (marked `noindex, nofollow`) and sign in with your Supabase Auth credentials to create, edit, schedule, preview, publish, or archive articles.
