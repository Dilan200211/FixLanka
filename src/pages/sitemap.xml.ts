import type { APIRoute } from 'astro';
import { getAllTools } from '../data/tools';
import { CATEGORY_LIST } from '../data/categories';

export const GET: APIRoute = async () => {
  const baseUrl = 'https://fixlanka.com';
  const tools = getAllTools();

  const staticPages = [
    '',
    '/about',
    '/privacy',
    '/terms',
    '/contact',
  ];

  const categoryPages = CATEGORY_LIST.map((c) => `/categories/${c.slug}`);
  const toolPages = tools.map((t) => `/tools/${t.slug}`);

  const allPages = [...staticPages, ...categoryPages, ...toolPages];
  const today = new Date().toISOString().split('T')[0];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map((page) => {
    const priority = page === '' ? '1.0' : page.startsWith('/tools/') ? '0.8' : '0.6';
    const changefreq = page === '' ? 'daily' : page.startsWith('/tools/') ? 'weekly' : 'monthly';
    return `  <url>
    <loc>${baseUrl}${page ? `${page}/` : '/'}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`.trim();

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
