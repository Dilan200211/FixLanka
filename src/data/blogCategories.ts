export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: 'tutorials',
    name: 'Tutorials',
    description:
      'Step-by-step browser tutorials covering everyday image conversion, PDF editing, audio extraction, and developer workflows.',
  },
  {
    slug: 'how-to-guides',
    name: 'How-To Guides',
    description: 'Practical guides focused on solving specific file, formatting, and web tasks cleanly.',
  },
  {
    slug: 'technology',
    name: 'Technology',
    description: 'Clear explanations of browser APIs, file formats, encoding standards, and web fundamentals.',
  },
  {
    slug: 'image-optimization',
    name: 'Image Optimization',
    description: 'Techniques for reducing image byte size, choosing formats, and speeding up web pages.',
  },
  {
    slug: 'file-management',
    name: 'File Management',
    description: 'Practical workflows for merging, splitting, compressing, and organizing PDFs and files.',
  },
  {
    slug: 'developer-guides',
    name: 'Developer Guides',
    description: 'Reference guides on JSON validation, UTF-8 Base64 encoding, meta tags, and debugging.',
  },
  {
    slug: 'online-security',
    name: 'Online Security',
    description: 'Guides on EXIF privacy, password entropy, cryptographic hashing, and safe file handling.',
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    description:
      'Time-saving browser workflows for document assembly, image prep, text counting, and prompt structuring without sign-ups.',
  },
  {
    slug: 'digital-tools',
    name: 'Digital Tools',
    description: 'Comparisons and practical setups for free, privacy-friendly browser utilities.',
  },
  {
    slug: 'educational-guides',
    name: 'Educational Guides',
    description: 'Foundational concepts behind storage units, metadata standards, and document formats.',
  },
];

export const BLOG_CATEGORY_SLUGS = BLOG_CATEGORIES.map((c) => c.slug) as [string, ...string[]];

export function getBlogCategoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}
