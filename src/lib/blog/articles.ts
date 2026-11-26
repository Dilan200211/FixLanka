import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

export function estimateReadingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function isArticlePublished(entry: BlogEntry, now = new Date()): boolean {
  if (entry.data.status !== 'published') return false;
  return entry.data.publishDate.getTime() <= now.getTime();
}

export async function getPublishedArticles(): Promise<BlogEntry[]> {
  const all = await getCollection('blog');
  const now = new Date();
  return all
    .filter((entry) => isArticlePublished(entry, now))
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
}

export async function getAllArticles(): Promise<BlogEntry[]> {
  const all = await getCollection('blog');
  return all.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
}

export async function getArticlesByCategory(categorySlug: string): Promise<BlogEntry[]> {
  const published = await getPublishedArticles();
  return published.filter((entry) => entry.data.category === categorySlug);
}

export async function getArticlesForTool(toolSlug: string): Promise<BlogEntry[]> {
  const published = await getPublishedArticles();
  return published.filter((entry) => entry.data.relatedTools.includes(toolSlug));
}

export async function getRelatedArticles(current: BlogEntry, limit = 3): Promise<BlogEntry[]> {
  const published = await getPublishedArticles();
  const explicitSlugs = new Set(current.data.relatedArticles);

  const explicit = published.filter(
    (entry) => entry.slug !== current.slug && explicitSlugs.has(entry.slug)
  );
  if (explicit.length >= limit) {
    return explicit.slice(0, limit);
  }

  const sameCategory = published.filter(
    (entry) =>
      entry.slug !== current.slug &&
      !explicitSlugs.has(entry.slug) &&
      entry.data.category === current.data.category
  );

  const fallback = published.filter(
    (entry) =>
      entry.slug !== current.slug &&
      !explicitSlugs.has(entry.slug) &&
      entry.data.category !== current.data.category
  );

  return [...explicit, ...sameCategory, ...fallback].slice(0, limit);
}
