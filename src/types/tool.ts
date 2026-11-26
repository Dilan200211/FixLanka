export type ToolCategory =
  | 'image-tools'
  | 'developer-tools'
  | 'text-tools'
  | 'security-tools'
  | 'file-tools'
  | 'converter-tools';

export type ProcessingMode = 'client' | 'worker' | 'wasm' | 'external-spec';

export type AvailabilityStatus = 'available' | 'coming-soon' | 'planned';

export type SearchIntent = 'transactional-utility' | 'informational-utility';

export interface CategoryDefinition {
  id: ToolCategory;
  name: string;
  slug: string;
  seoTitle: string;
  description: string;
  shortDescription: string;
  icon: string;
  color: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolExample {
  title: string;
  input: string;
  output: string;
  note?: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  secondaryCategories?: ToolCategory[];
  description: string;
  shortDescription: string;
  icon: string;
  keywords: string[];
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  questionKeywords: string[];
  searchIntent: SearchIntent;
  supportedInputTypes: string[];
  supportedOutputTypes: string[];
  maxFileSize: number; // in bytes
  maxFileSizeFormatted: string;
  acceptsMultipleFiles: boolean;
  processingMode: ProcessingMode;
  availabilityStatus: AvailabilityStatus;
  featured: boolean;
  relatedTools: string[]; // slugs
  relatedArticles?: string[]; // blog slugs
  seoTitle: string;
  seoDescription: string;
  instructions: string[];
  featuresList: string[];
  examples?: ToolExample[];
  faqs: FAQItem[];
  privacyNotice: string;
}

export interface ToolFilterOptions {
  category?: ToolCategory;
  status?: AvailabilityStatus;
  searchQuery?: string;
  featuredOnly?: boolean;
}
