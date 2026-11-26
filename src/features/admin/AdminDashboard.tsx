import React, { useEffect, useMemo, useState } from 'react';
import {
  getSupabaseClient,
  isSupabaseConfigured,
  type ArticleStatus,
  type SupabaseArticleRow,
} from '../../lib/supabase/client';
import { BLOG_CATEGORIES } from '../../data/blogCategories';
import { CATEGORY_LIST } from '../../data/categories';
import { TOOLS } from '../../data/tools';

const EMPTY_FORM = {
  id: '',
  title: '',
  slug: '',
  seo_title: '',
  meta_description: '',
  excerpt: '',
  body_markdown: '',
  status: 'draft' as ArticleStatus,
  category_slug: BLOG_CATEGORIES[0].slug,
  author_id: 'dilan-vinod',
  tags_csv: '',
  featured_image: '/blog-covers/default.svg',
  image_alt: '',
  canonical_url: '',
  noindex: false,
  related_tools: [] as string[],
  related_articles_csv: '',
  scheduled_for: '',
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<'cms' | 'seo'>('cms');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [sessionUser, setSessionUser] = useState<{ id: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [authError, setAuthError] = useState('');
  const [cmsStatusMsg, setCmsStatusMsg] = useState('');
  const [articles, setArticles] = useState<SupabaseArticleRow[]>([]);
  const [sitemapUrlCount, setSitemapUrlCount] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPreview, setShowPreview] = useState(false);
  const [busy, setBusy] = useState(false);

  const supabase = useMemo(() => getSupabaseClient(), []);

  const verifyAdminRole = async (userId: string) => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('cms_admins')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      setIsAdmin(false);
      setAdminRole(null);
      return;
    }
    setIsAdmin(true);
    setAdminRole(data.role);
  };

  useEffect(() => {
    if (!supabase) {
      setAuthChecked(true);
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (user && user.email) {
        setSessionUser({ id: user.id, email: user.email });
        await verifyAdminRole(user.id);
      } else {
        setSessionUser(null);
        setIsAdmin(false);
      }
      setAuthChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      const user = session?.user;
      if (user && user.email) {
        setSessionUser({ id: user.id, email: user.email });
        await verifyAdminRole(user.id);
      } else {
        setSessionUser(null);
        setIsAdmin(false);
        setAdminRole(null);
        setArticles([]);
      }
      setAuthChecked(true);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const loadSupabaseArticles = async () => {
    if (!supabase || !isAdmin) return;
    setBusy(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('updated_at', { ascending: false });
    setBusy(false);
    if (error) {
      setCmsStatusMsg(`Error loading articles: ${error.message}`);
      return;
    }
    setArticles((data as SupabaseArticleRow[]) ?? []);
  };

  useEffect(() => {
    if (sessionUser && isAdmin && supabase) {
      loadSupabaseArticles();
      fetch('/sitemap.xml')
        .then((r) => (r.ok ? r.text() : ''))
        .then((xml) => {
          const matches = xml.match(/<loc>/g);
          if (matches) setSitemapUrlCount(matches.length);
        })
        .catch(() => {});
    }
  }, [sessionUser, isAdmin, supabase]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setAuthError('');
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setAuthError(error.message);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSessionUser(null);
    setIsAdmin(false);
    setArticles([]);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase || !isAdmin) return;
    setBusy(true);
    setCmsStatusMsg('');
    const ext = file.name.split('.').pop() || 'png';
    const path = `covers/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ''))}.${ext}`;
    const { error } = await supabase.storage.from('blog-images').upload(path, file, { upsert: true });
    if (error) {
      setBusy(false);
      setCmsStatusMsg(`Image upload failed: ${error.message}`);
      return;
    }
    const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
    setForm((prev) => ({ ...prev, featured_image: data.publicUrl }));
    setBusy(false);
    setCmsStatusMsg('Featured image uploaded to Supabase Storage.');
  };

  const handleSaveArticle = async (overrideStatus?: ArticleStatus) => {
    if (!supabase || !isAdmin) return;
    setBusy(true);
    setCmsStatusMsg('');
    const targetStatus = overrideStatus ?? form.status;
    const payload = {
      title: form.title.trim(),
      slug: (form.slug || slugify(form.title)).trim(),
      seo_title: form.seo_title.trim() || null,
      meta_description: form.meta_description.trim(),
      excerpt: form.excerpt.trim(),
      body_markdown: form.body_markdown,
      status: targetStatus,
      category_slug: form.category_slug,
      author_id: form.author_id,
      tags: form.tags_csv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      featured_image: form.featured_image.trim() || '/blog-covers/default.svg',
      image_alt: form.image_alt.trim() || form.title.trim(),
      canonical_url: form.canonical_url.trim() || null,
      noindex: form.noindex,
      related_tools: form.related_tools,
      related_articles: form.related_articles_csv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      scheduled_for: form.scheduled_for ? new Date(form.scheduled_for).toISOString() : null,
      published_at: targetStatus === 'published' ? new Date().toISOString() : null,
    };

    const res = form.id
      ? await supabase.from('articles').update(payload).eq('id', form.id).select().single()
      : await supabase.from('articles').insert(payload).select().single();

    setBusy(false);
    if (res.error) {
      setCmsStatusMsg(`Save failed: ${res.error.message}`);
      return;
    }
    setCmsStatusMsg(`Saved "${payload.title}" (${targetStatus}).`);
    setForm(EMPTY_FORM);
    await loadSupabaseArticles();
  };

  const handleDeleteArticle = async (id: string) => {
    if (!supabase || !isAdmin || !confirm('Delete this article permanently?')) return;
    setBusy(true);
    const { error } = await supabase.from('articles').delete().eq('id', id);
    setBusy(false);
    if (error) {
      setCmsStatusMsg(`Delete failed: ${error.message}`);
      return;
    }
    setCmsStatusMsg('Article deleted.');
    await loadSupabaseArticles();
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-md mx-auto p-6 rounded-2xl bg-dark-card border border-dark-border text-xs text-dark-secondary">
        Authentication service is not configured for this build.
      </div>
    );
  }

  if (!authChecked) {
    return (
      <div className="max-w-md mx-auto p-6 rounded-2xl bg-dark-card border border-dark-border text-xs text-dark-muted">
        Checking authentication...
      </div>
    );
  }

  // Gate 1: Unauthenticated users ONLY see the Sign-In form
  if (!sessionUser) {
    return (
      <form
        onSubmit={handleSignIn}
        className="max-w-md mx-auto p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4 text-xs"
      >
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-dark-text">Admin Sign In</h2>
          <p className="text-dark-muted">Sign in with an authorized FixLanka CMS account.</p>
        </div>
        {authError && (
          <p className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
            {authError}
          </p>
        )}
        <div>
          <label htmlFor="cms-email" className="block text-dark-text font-medium mb-1">
            Email
          </label>
          <input
            id="cms-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text"
          />
        </div>
        <div>
          <label htmlFor="cms-password" className="block text-dark-text font-medium mb-1">
            Password
          </label>
          <input
            id="cms-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium"
        >
          {busy ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    );
  }

  // Gate 2: Authenticated users not in public.cms_admins are blocked
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto p-6 rounded-2xl bg-dark-card border border-rose-500/30 space-y-4 text-xs">
        <h2 className="text-base font-semibold text-dark-text">Access Denied</h2>
        <p className="text-dark-secondary">
          Signed in as <strong className="text-dark-text">{sessionUser.email}</strong>, which is not listed in{' '}
          <code className="font-mono">public.cms_admins</code>.
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          className="px-4 py-2 rounded-lg border border-dark-border text-dark-text hover:bg-dark-raised"
        >
          Sign out
        </button>
      </div>
    );
  }

  const filteredArticles =
    statusFilter === 'all' ? articles : articles.filter((a) => a.status === statusFilter);
  const publishedCmsCount = articles.filter((a) => a.status === 'published').length;
  const draftCmsCount = articles.filter((a) => a.status === 'draft' || a.status === 'in_review').length;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-dark-card border border-dark-border text-xs">
        <div>
          <h2 className="text-lg font-semibold text-dark-text">FixLanka Admin &amp; CMS</h2>
          <p className="text-dark-muted">
            Signed in as <strong className="text-dark-text">{sessionUser.email}</strong> ({adminRole})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTab('cms');
              setForm(EMPTY_FORM);
            }}
            className="px-3 py-1.5 rounded-lg bg-dark-surface border border-dark-border text-dark-text"
          >
            New article
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="px-3 py-1.5 rounded-lg border border-dark-border text-dark-secondary hover:text-dark-text"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-dark-border pb-3">
        <button
          type="button"
          onClick={() => setTab('cms')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            tab === 'cms'
              ? 'bg-brand-600 text-white'
              : 'bg-dark-card border border-dark-border text-dark-secondary hover:text-dark-text'
          }`}
        >
          Supabase CMS ({articles.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('seo')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            tab === 'seo'
              ? 'bg-brand-600 text-white'
              : 'bg-dark-card border border-dark-border text-dark-secondary hover:text-dark-text'
          }`}
        >
          SEO Health Overview
        </button>
      </div>

      {tab === 'seo' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
              <div className="text-xs text-dark-muted">Active Tools</div>
              <div className="text-2xl font-semibold text-dark-text mt-1 tabular-nums">{TOOLS.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
              <div className="text-xs text-dark-muted">Tool Categories</div>
              <div className="text-2xl font-semibold text-dark-text mt-1 tabular-nums">{CATEGORY_LIST.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
              <div className="text-xs text-dark-muted">Sitemap URLs</div>
              <div className="text-2xl font-semibold text-dark-text mt-1 tabular-nums">
                {sitemapUrlCount ?? '—'}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
              <div className="text-xs text-dark-muted">CMS Published / Drafts</div>
              <div className="text-2xl font-semibold text-dark-text mt-1 tabular-nums">
                {publishedCmsCount} / {draftCmsCount}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-dark-card border border-dark-border text-xs text-dark-secondary space-y-2">
            <h2 className="text-sm font-semibold text-dark-text">Build-Time SEO Validation</h2>
            <p>
              Run <code className="font-mono">npm run seo:audit</code> after building to check duplicate titles/descriptions, missing canonicals, broken internal links, orphan pages, missing image alt tags, and sitemap parity across all static pages.
            </p>
          </div>
        </div>
      )}

      {tab === 'cms' && (
        <div className="space-y-6">
          {cmsStatusMsg && (
            <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/20 text-xs text-brand-700 dark:text-brand-400">
              {cmsStatusMsg}
            </div>
          )}

          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-dark-text">
                {form.id ? 'Edit Article' : 'Create Article'}
              </h2>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-3 py-1 rounded border border-dark-border text-dark-secondary"
              >
                {showPreview ? 'Edit Markdown' : 'Preview'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-dark-text mb-1">H1 Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      title: e.target.value,
                      slug: p.id ? p.slug : slugify(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text"
                />
              </div>
              <div>
                <label className="block font-medium text-dark-text mb-1">URL Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-dark-text mb-1">
                  SEO Title ({form.seo_title.length}/60)
                </label>
                <input
                  type="text"
                  value={form.seo_title}
                  onChange={(e) => setForm((p) => ({ ...p, seo_title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text"
                />
              </div>
              <div>
                <label className="block font-medium text-dark-text mb-1">Category</label>
                <select
                  value={form.category_slug}
                  onChange={(e) => setForm((p) => ({ ...p, category_slug: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text"
                >
                  {BLOG_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-dark-text mb-1">
                Meta Description ({form.meta_description.length}/160)
              </label>
              <textarea
                rows={2}
                value={form.meta_description}
                onChange={(e) => setForm((p) => ({ ...p, meta_description: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text"
              />
            </div>

            <div>
              <label className="block font-medium text-dark-text mb-1">Excerpt</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium text-dark-text mb-1">Featured Image URL</label>
                <input
                  type="text"
                  value={form.featured_image}
                  onChange={(e) => setForm((p) => ({ ...p, featured_image: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text"
                />
                <input type="file" accept="image/*" onChange={handleUploadImage} className="mt-1.5 text-[11px]" />
              </div>
              <div>
                <label className="block font-medium text-dark-text mb-1">Image Alt Text</label>
                <input
                  type="text"
                  value={form.image_alt}
                  onChange={(e) => setForm((p) => ({ ...p, image_alt: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text"
                />
              </div>
              <div>
                <label className="block font-medium text-dark-text mb-1">Canonical URL (optional)</label>
                <input
                  type="url"
                  value={form.canonical_url}
                  onChange={(e) => setForm((p) => ({ ...p, canonical_url: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block font-medium text-dark-text mb-1">Workflow Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ArticleStatus }))}
                  className="w-full px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text"
                >
                  <option value="draft">Draft</option>
                  <option value="in_review">In Review</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-dark-text mb-1">Schedule Date (optional)</label>
                <input
                  type="datetime-local"
                  value={form.scheduled_for}
                  onChange={(e) => setForm((p) => ({ ...p, scheduled_for: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text"
                />
              </div>
              <label className="flex items-center gap-2 pt-5 text-dark-text">
                <input
                  type="checkbox"
                  checked={form.noindex}
                  onChange={(e) => setForm((p) => ({ ...p, noindex: e.target.checked }))}
                />
                <span>Set robots noindex</span>
              </label>
            </div>

            <div>
              <label className="block font-medium text-dark-text mb-1">Related Tools</label>
              <div className="flex flex-wrap gap-2">
                {TOOLS.map((t) => {
                  const active = form.related_tools.includes(t.slug);
                  return (
                    <button
                      key={t.slug}
                      type="button"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          related_tools: active
                            ? p.related_tools.filter((s) => s !== t.slug)
                            : [...p.related_tools, t.slug],
                        }))
                      }
                      className={`px-2 py-1 rounded border text-[11px] ${
                        active
                          ? 'bg-brand-600 border-brand-600 text-white'
                          : 'bg-dark-surface border-dark-border text-dark-secondary'
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-medium text-dark-text mb-1">Article Markdown Body</label>
              {showPreview ? (
                <pre className="p-4 rounded-xl bg-dark-surface border border-dark-border whitespace-pre-wrap text-dark-text max-h-96 overflow-y-auto">
                  {form.body_markdown}
                </pre>
              ) : (
                <textarea
                  rows={10}
                  value={form.body_markdown}
                  onChange={(e) => setForm((p) => ({ ...p, body_markdown: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text font-mono"
                />
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => handleSaveArticle('draft')}
                className="px-4 py-2 rounded-lg bg-dark-surface border border-dark-border text-dark-text font-medium"
              >
                Save Draft
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => handleSaveArticle()}
                className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium"
              >
                Save Status ({form.status})
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => handleSaveArticle('published')}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
              >
                Publish Now
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-dark-card border border-dark-border overflow-hidden text-xs">
            <div className="px-5 py-3.5 border-b border-dark-border flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-dark-text">Supabase Articles ({filteredArticles.length})</h3>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1 rounded bg-dark-surface border border-dark-border text-dark-text"
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="in_review">In Review</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="divide-y divide-dark-border">
              {filteredArticles.map((art) => (
                <div key={art.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-dark-text">{art.title}</div>
                    <div className="text-dark-muted font-mono">
                      /{art.slug}/ • {art.status} • {art.category_slug}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          id: art.id,
                          title: art.title,
                          slug: art.slug,
                          seo_title: art.seo_title ?? '',
                          meta_description: art.meta_description,
                          excerpt: art.excerpt,
                          body_markdown: art.body_markdown,
                          status: art.status,
                          category_slug: art.category_slug,
                          author_id: art.author_id,
                          tags_csv: art.tags.join(', '),
                          featured_image: art.featured_image,
                          image_alt: art.image_alt,
                          canonical_url: art.canonical_url ?? '',
                          noindex: art.noindex,
                          related_tools: art.related_tools,
                          related_articles_csv: art.related_articles.join(', '),
                          scheduled_for: art.scheduled_for ? art.scheduled_for.slice(0, 16) : '',
                        })
                      }
                      className="px-2.5 py-1 rounded border border-dark-border text-dark-text"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteArticle(art.id)}
                      className="px-2.5 py-1 rounded border border-rose-500/30 text-rose-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {filteredArticles.length === 0 && (
                <div className="p-6 text-center text-dark-muted">No articles in Supabase yet.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
