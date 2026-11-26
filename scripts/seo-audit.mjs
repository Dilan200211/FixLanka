import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
if (!fs.existsSync(distDir)) {
  console.error('ERROR: dist/ does not exist. Run "npm run build" first.');
  process.exit(1);
}

function walkHtml(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(full, list);
    } else if (entry.name.endsWith('.html')) {
      list.push(full);
    }
  }
  return list;
}

function filePathToRoute(filePath) {
  const rel = path.relative(distDir, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404.html';
  if (rel.endsWith('/index.html')) {
    return '/' + rel.slice(0, -'index.html'.length);
  }
  return '/' + rel;
}

function routeExistsInDist(route) {
  const clean = route.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return fs.existsSync(path.join(distDir, 'index.html'));
  const stripped = clean.replace(/^\/+/, '');
  const asIndex = path.join(distDir, stripped, 'index.html');
  const asFile = path.join(distDir, stripped);
  return fs.existsSync(asIndex) || fs.existsSync(asFile);
}

const htmlFiles = walkHtml(distDir);
const sitemapPath = path.join(distDir, 'sitemap.xml');
const sitemapXml = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const sitemapLocs = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) =>
  m[1].replace('https://fixlanka.com', '')
);

const titles = new Map();
const descriptions = new Map();
const incomingLinks = new Map();
const errors = [];
const warnings = [];

for (const file of htmlFiles) {
  incomingLinks.set(filePathToRoute(file), 0);
}

for (const file of htmlFiles) {
  const route = filePathToRoute(file);
  const html = fs.readFileSync(file, 'utf8');
  const isNoindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
  const isSpecial = route === '/404.html' || route === '/admin/';

  if (isSpecial && !isNoindex) {
    errors.push(`${route}: expected noindex meta tag`);
  }

  // Title check
  const titleMatch = html.match(/<title>(.*?)<\/title>/is);
  const title = titleMatch ? titleMatch[1].trim() : '';
  if (!title) {
    errors.push(`${route}: missing <title>`);
  } else if (!isNoindex) {
    if (title.length > 65) warnings.push(`${route}: title length ${title.length} > 65 ("${title}")`);
    if (!titles.has(title)) titles.set(title, []);
    titles.get(title).push(route);
  }

  // Meta description check
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  const desc = descMatch ? descMatch[1].trim() : '';
  if (!desc) {
    errors.push(`${route}: missing meta description`);
  } else if (!isNoindex) {
    if (desc.length < 80 || desc.length > 165) {
      warnings.push(`${route}: meta description length ${desc.length} outside 80-165 chars`);
    }
    if (!descriptions.has(desc)) descriptions.set(desc, []);
    descriptions.get(desc).push(route);
  }

  // Canonical check
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  if (!canonicalMatch) {
    errors.push(`${route}: missing canonical link`);
  }

  // H1 & heading hierarchy check
  const h1Matches = [...html.matchAll(/<h1\b[^>]*>/gi)];
  if (h1Matches.length !== 1) {
    errors.push(`${route}: expected 1 <h1>, found ${h1Matches.length}`);
  }

  const headingLevels = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((m) => Number(m[1]));
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] > headingLevels[i - 1] + 1) {
      warnings.push(
        `${route}: skipped heading level h${headingLevels[i - 1]} -> h${headingLevels[i]}`
      );
      break;
    }
  }

  // Image alt check
  for (const imgTag of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = imgTag[1];
    const altMatch = attrs.match(/\balt=["']([^"']*)["']/i);
    if (!altMatch || !altMatch[1].trim()) {
      errors.push(`${route}: <img> missing non-empty alt attribute`);
    }
  }

  // JSON-LD validity check
  for (const ld of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(ld[1]);
    } catch (e) {
      errors.push(`${route}: invalid JSON-LD (${e.message})`);
    }
  }

  // Internal link validation
  if (!isSpecial) {
    for (const a of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
      const href = a[1];
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('#')
      ) {
        continue;
      }
      const cleanRoute = href.split('#')[0].split('?')[0] || '/';
      if (!routeExistsInDist(cleanRoute)) {
        errors.push(`${route}: broken internal link "${href}"`);
      } else if (incomingLinks.has(cleanRoute) && cleanRoute !== route) {
        incomingLinks.set(cleanRoute, (incomingLinks.get(cleanRoute) ?? 0) + 1);
      }
    }
  }
}

for (const [title, pages] of titles.entries()) {
  if (pages.length > 1) {
    errors.push(`Duplicate title "${title}" on: ${pages.join(', ')}`);
  }
}

for (const [desc, pages] of descriptions.entries()) {
  if (pages.length > 1) {
    errors.push(`Duplicate meta description "${desc.slice(0, 50)}..." on: ${pages.join(', ')}`);
  }
}

for (const loc of sitemapLocs) {
  if (!routeExistsInDist(loc)) {
    errors.push(`sitemap.xml contains missing route: ${loc}`);
  }
}

const orphans = [];
for (const [route, count] of incomingLinks.entries()) {
  if (route === '/' || route === '/404.html' || route === '/admin/') continue;
  if (count === 0) orphans.push(route);
}
if (orphans.length > 0) {
  errors.push(`Orphan pages with 0 incoming links: ${orphans.join(', ')}`);
}

console.log(`SEO Audit Summary:`);
console.log(`  HTML pages scanned: ${htmlFiles.length}`);
console.log(`  Sitemap URLs:       ${sitemapLocs.length}`);
console.log(`  Orphan pages:       ${orphans.length}`);
console.log(`  Warnings:           ${warnings.length}`);
console.log(`  Errors:             ${errors.length}`);

if (warnings.length > 0) {
  console.log('\nWarnings:');
  warnings.forEach((w) => console.log('  -', w));
}

if (errors.length > 0) {
  console.error('\nErrors:');
  errors.forEach((e) => console.error('  -', e));
  process.exit(1);
}

console.log('\nAll technical SEO checks passed.');
