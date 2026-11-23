export type ToolCategory =
  | 'privacy-metadata'
  | 'image'
  | 'pdf'
  | 'video-audio'
  | 'ai-creator'
  | 'developer'
  | 'seo'
  | 'social-media'
  | 'security'
  | 'everyday';

export type ProcessingMode = 'client' | 'worker' | 'wasm' | 'external-spec';

export type AvailabilityStatus = 'available' | 'coming-soon' | 'planned';

export interface CategoryDefinition {
  id: ToolCategory;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  color: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  shortDescription: string;
  icon: string;
  keywords: string[];
  supportedInputTypes: string[];
  supportedOutputTypes: string[];
  maxFileSize: number; // in bytes
  maxFileSizeFormatted: string;
  acceptsMultipleFiles: boolean;
  processingMode: ProcessingMode;
  availabilityStatus: AvailabilityStatus;
  featured: boolean;
  relatedTools: string[]; // slugs
  seoTitle: string;
  seoDescription: string;
  instructions: string[];
  featuresList: string[];
  faqs: FAQItem[];
  privacyNotice: string;
}

export interface ToolFilterOptions {
  category?: ToolCategory;
  status?: AvailabilityStatus;
  searchQuery?: string;
  featuredOnly?: boolean;
}
