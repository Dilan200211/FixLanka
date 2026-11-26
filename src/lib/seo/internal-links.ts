import { CATEGORY_LIST } from '../../data/categories';
import { getAllTools, getRelatedTools, getToolsByCategory } from '../../data/tools';
import type { BlogEntry } from '../blog/articles';
import type { ToolCategory } from '../../types/tool';

export interface LinkGraphNode {
  url: string;
  incomingCount: number;
  outgoingCount: number;
}

export function getArticlesForCategory(
  categoryId: ToolCategory,
  publishedArticles: BlogEntry[]
): BlogEntry[] {
  const catTools = new Set(getToolsByCategory(categoryId, true).map((t) => t.slug));
  return publishedArticles.filter((entry) =>
    entry.data.relatedTools.some((slug) => catTools.has(slug))
  );
}

export function buildInternalLinkGraph(publishedArticles: BlogEntry[]): {
  nodes: Map<string, LinkGraphNode>;
  orphans: string[];
} {
  const edges = new Map<string, Set<string>>();

  const addEdge = (from: string, to: string) => {
    if (from === to) return;
    if (!edges.has(from)) edges.set(from, new Set());
    edges.get(from)!.add(to);
  };

  const ensureNode = (url: string) => {
    if (!edges.has(url)) edges.set(url, new Set());
  };

  const staticRoutes = [
    '/',
    '/tools/',
    '/category/',
    '/blog/',
    '/about/',
    '/contact/',
    '/privacy-policy/',
    '/terms-of-service/',
    '/disclaimer/',
    '/editorial-policy/',
    '/how-we-work/',
  ];
  staticRoutes.forEach(ensureNode);

  const tools = getAllTools();
  const activeBlogCats = new Set(publishedArticles.map((a) => a.data.category));

  // Global Header + Footer links from every page
  const globalTargets = [
    '/',
    '/tools/',
    '/category/',
    '/blog/',
    '/about/',
    '/contact/',
    '/privacy-policy/',
    '/terms-of-service/',
    '/disclaimer/',
    '/editorial-policy/',
    '/how-we-work/',
    ...CATEGORY_LIST.map((c) => `/category/${c.slug}/`),
  ];

  for (const src of staticRoutes) {
    for (const target of globalTargets) addEdge(src, target);
  }

  // Homepage links to all tools and categories
  for (const t of tools) addEdge('/', `/tools/${t.slug}/`);
  for (const t of tools) addEdge('/tools/', `/tools/${t.slug}/`);

  // Category pages link to tools & matching articles
  for (const cat of CATEGORY_LIST) {
    const catUrl = `/category/${cat.slug}/`;
    ensureNode(catUrl);
    addEdge('/category/', catUrl);
    for (const target of globalTargets) addEdge(catUrl, target);

    for (const tool of getToolsByCategory(cat.id, true)) {
      addEdge(catUrl, `/tools/${tool.slug}/`);
    }
    for (const art of getArticlesForCategory(cat.id, publishedArticles)) {
      addEdge(catUrl, `/blog/${art.slug}/`);
    }
  }

  // Tool pages link to category, related tools, and related articles
  for (const tool of tools) {
    const toolUrl = `/tools/${tool.slug}/`;
    ensureNode(toolUrl);
    for (const target of globalTargets) addEdge(toolUrl, target);
    addEdge(toolUrl, `/category/${tool.category}/`);

    for (const rel of getRelatedTools(tool.slug)) {
      addEdge(toolUrl, `/tools/${rel.slug}/`);
    }
    for (const art of publishedArticles.filter((a) => a.data.relatedTools.includes(tool.slug))) {
      addEdge(toolUrl, `/blog/${art.slug}/`);
    }
  }

  // Blog index & category pages
  for (const catSlug of activeBlogCats) {
    const bCatUrl = `/blog/category/${catSlug}/`;
    ensureNode(bCatUrl);
    addEdge('/blog/', bCatUrl);
    for (const target of globalTargets) addEdge(bCatUrl, target);
  }

  for (const art of publishedArticles) {
    const artUrl = `/blog/${art.slug}/`;
    ensureNode(artUrl);
    addEdge('/blog/', artUrl);
    addEdge(`/blog/category/${art.data.category}/`, artUrl);
    for (const target of globalTargets) addEdge(artUrl, target);
    addEdge(artUrl, `/blog/category/${art.data.category}/`);
    for (const tSlug of art.data.relatedTools) {
      addEdge(artUrl, `/tools/${tSlug}/`);
    }
    for (const rSlug of art.data.relatedArticles) {
      addEdge(artUrl, `/blog/${rSlug}/`);
    }
  }

  const incoming = new Map<string, number>();
  for (const url of edges.keys()) incoming.set(url, 0);

  for (const targets of edges.values()) {
    for (const target of targets) {
      if (incoming.has(target)) {
        incoming.set(target, (incoming.get(target) ?? 0) + 1);
      }
    }
  }

  const nodes = new Map<string, LinkGraphNode>();
  const orphans: string[] = [];
  for (const [url, outSet] of edges.entries()) {
    const inc = incoming.get(url) ?? 0;
    nodes.set(url, { url, incomingCount: inc, outgoingCount: outSet.size });
    if (inc === 0 && url !== '/') {
      orphans.push(url);
    }
  }

  return { nodes, orphans };
}
