import type { APIRoute } from 'astro';
import { getAllTools } from '../data/tools';
import { CATEGORY_LIST } from '../data/categories';
import { BLOG_CATEGORIES } from '../data/blogCategories';
import { getPublishedArticles } from '../lib/blog/articles';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export const GET: APIRoute = async () => {
  const baseUrl = 'https://fixlanka.com';
  const today = new Date().toISOString().split('T')[0];

  const tools = getAllTools();
  const articles = (await getPublishedArticles()).filter((a) => !a.data.noindex);
  const activeBlogCatSlugs = new Set(articles.map((a) => a.data.category));

  const urls: SitemapUrl[] = [
    { loc: `${baseUrl}/`, lastmod: today, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/tools/`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/category/`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/blog/`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/about/`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
    { loc: `${baseUrl}/contact/`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
    { loc: `${baseUrl}/privacy-policy/`, lastmod: today, changefreq: 'monthly', priority: '0.4' },
    { loc: `${baseUrl}/terms-of-service/`, lastmod: today, changefreq: 'monthly', priority: '0.4' },
    { loc: `${baseUrl}/disclaimer/`, lastmod: today, changefreq: 'monthly', priority: '0.4' },
    { loc: `${baseUrl}/editorial-policy/`, lastmod: today, changefreq: 'monthly', priority: '0.4' },
    { loc: `${baseUrl}/how-we-work/`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
  ];

  for (const cat of CATEGORY_LIST) {
    urls.push({
      loc: `${baseUrl}/category/${cat.slug}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.7',
    });
  }

  for (const tool of tools) {
    urls.push({
      loc: `${baseUrl}/tools/${tool.slug}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  for (const bCat of BLOG_CATEGORIES) {
    if (activeBlogCatSlugs.has(bCat.slug)) {
      urls.push({
        loc: `${baseUrl}/blog/category/${bCat.slug}/`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.6',
      });
    }
  }

  for (const article of articles) {
    const mod = (article.data.updatedDate ?? article.data.publishDate).toISOString().split('T')[0];
    urls.push({
      loc: `${baseUrl}/blog/${article.slug}/`,
      lastmod: mod,
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`.trim();

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
