import type { CategoryDefinition, ToolCategory } from '../types/tool';

export const CATEGORIES: Record<ToolCategory, CategoryDefinition> = {
  'privacy-metadata': {
    id: 'privacy-metadata',
    name: 'Privacy & Metadata',
    slug: 'privacy-metadata',
    description: 'Inspect, sanitize, and manage image and document metadata, GPS coordinates, and C2PA Content Credentials right in your browser.',
    shortDescription: 'Inspect & sanitize EXIF, IPTC, and C2PA metadata locally.',
    icon: 'ShieldCheck',
    color: '#10b981', // emerald
  },
  'image': {
    id: 'image',
    name: 'Image Tools',
    slug: 'image',
    description: 'Compress, resize, and convert images to modern formats with zero server upload. Fast, private, and high-quality.',
    shortDescription: 'Compress, resize, and convert images client-side.',
    icon: 'Image',
    color: '#06b6d4', // cyan
  },
  'pdf': {
    id: 'pdf',
    name: 'PDF & Document Tools',
    slug: 'pdf',
    description: 'Merge, split, compress, and organize PDF documents in private browser memory without uploading sensitive files.',
    shortDescription: 'Merge, split, and optimize PDFs locally with zero server uploads.',
    icon: 'FileText',
    color: '#ef4444', // red
  },
  'video-audio': {
    id: 'video-audio',
    name: 'Video & Audio',
    slug: 'video-audio',
    description: 'Convert video clips to animated GIFs, extract audio tracks, and inspect media attributes directly on your device.',
    shortDescription: 'Convert videos to GIFs and extract audio tracks in-browser.',
    icon: 'Video',
    color: '#8b5cf6', // purple
  },
  'ai-creator': {
    id: 'ai-creator',
    name: 'AI & Creator',
    slug: 'ai-creator',
    description: 'Optimize AI prompts, inspect generative model signals, and enhance creative workflows with zero API fees.',
    shortDescription: 'Optimize prompts and inspect AI generation signals.',
    icon: 'Sparkles',
    color: '#ec4899', // pink
  },
  'developer': {
    id: 'developer',
    name: 'Developer Tools',
    slug: 'developer',
    description: 'Essential client-side tools for engineers: JSON formatting and syntax validation, Base64 encoding, URL parsing, and code utilities.',
    shortDescription: 'JSON formatting, Base64 encoding, and developer essentials.',
    icon: 'Code2',
    color: '#3b82f6', // blue
  },
  'seo': {
    id: 'seo',
    name: 'SEO & Website',
    slug: 'seo',
    description: 'Generate comprehensive meta tags, Open Graph cards, Twitter metadata, and structured markup to improve search rankings.',
    shortDescription: 'Generate meta tags, Open Graph previews, and robots config.',
    icon: 'Search',
    color: '#f59e0b', // amber
  },
  'social-media': {
    id: 'social-media',
    name: 'Social Media',
    slug: 'social-media',
    description: 'Prepare and resize media for Instagram, YouTube, X (Twitter), Facebook, and LinkedIn with pixel-perfect aspect ratios.',
    shortDescription: 'Resize images and preview posts for all major social networks.',
    icon: 'Share2',
    color: '#6366f1', // indigo
  },
  'security': {
    id: 'security',
    name: 'Security & Privacy',
    slug: 'security',
    description: 'Generate cryptographically strong passwords, analyze file integrity, and inspect security tokens with no data retained.',
    shortDescription: 'Generate cryptographically strong passwords & verify integrity.',
    icon: 'Lock',
    color: '#14b8a6', // teal
  },
  'everyday': {
    id: 'everyday',
    name: 'Everyday Utilities',
    slug: 'everyday',
    description: 'Fast, clean daily utilities: QR code generator, word and character counters, unit conversions, and calculations.',
    shortDescription: 'QR code generator, word counter, and everyday daily tools.',
    icon: 'SlidersHorizontal',
    color: '#84cc16', // lime
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORY_LIST.find((cat) => cat.slug === slug || cat.id === slug);
}
