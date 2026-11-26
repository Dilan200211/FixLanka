import type { CategoryDefinition, ToolCategory } from '../types/tool';

export const CATEGORIES: Record<ToolCategory, CategoryDefinition> = {
  'image-tools': {
    id: 'image-tools',
    name: 'Image Tools',
    slug: 'image-tools',
    seoTitle: 'Free Online Image Tools — FixLanka Tools',
    description:
      'Compress, resize, convert, and prepare images for the web and social media directly inside your browser with zero server uploads.',
    shortDescription: 'Compress, resize, and prepare photos locally in your browser.',
    icon: 'Image',
    color: '#06b6d4',
  },
  'developer-tools': {
    id: 'developer-tools',
    name: 'Developer Tools',
    slug: 'developer-tools',
    seoTitle: 'Free Online Developer Tools — FixLanka Tools',
    description:
      'Fast, client-side developer utilities for formatting and validating JSON, encoding UTF-8 Base64 strings, and generating HTML meta tags.',
    shortDescription: 'JSON formatter, Base64 encoder/decoder, and meta tag generator.',
    icon: 'Code2',
    color: '#3b82f6',
  },
  'text-tools': {
    id: 'text-tools',
    name: 'Text Tools',
    slug: 'text-tools',
    seoTitle: 'Free Online Text & Writing Tools — FixLanka Tools',
    description:
      'Analyze text statistics, calculate reading time, optimize AI prompts, and preview social media copy locally with complete privacy.',
    shortDescription: 'Word counter, AI prompt optimizer, and social post preview.',
    icon: 'FileText',
    color: '#ec4899',
  },
  'security-tools': {
    id: 'security-tools',
    name: 'Security & Privacy Tools',
    slug: 'security-tools',
    seoTitle: 'Security & Privacy Tools — FixLanka Tools',
    description:
      'Protect your privacy with local EXIF metadata inspection, GPS scrubbing, C2PA Content Credentials analysis, and cryptographic password generation.',
    shortDescription: 'Password generator, EXIF privacy cleaner, and C2PA inspector.',
    icon: 'ShieldCheck',
    color: '#10b981',
  },
  'file-tools': {
    id: 'file-tools',
    name: 'File & PDF Tools',
    slug: 'file-tools',
    seoTitle: 'Free Online File & PDF Tools — FixLanka Tools',
    description:
      'Merge, split, and compress PDF documents directly in browser memory so sensitive contracts and personal files never touch external servers.',
    shortDescription: 'Merge, split, and compress PDF documents on your device.',
    icon: 'FolderOpen',
    color: '#ef4444',
  },
  'converter-tools': {
    id: 'converter-tools',
    name: 'Converter Tools',
    slug: 'converter-tools',
    seoTitle: 'Free Online Converter Tools — FixLanka Tools',
    description:
      'Convert video clips into animated GIFs, extract WAV audio tracks, switch image formats, and generate static PNG/SVG QR codes client-side.',
    shortDescription: 'Video to GIF, audio extractor, format converter, and QR codes.',
    icon: 'RefreshCw',
    color: '#8b5cf6',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORY_LIST.find((cat) => cat.slug === slug || cat.id === slug);
}
