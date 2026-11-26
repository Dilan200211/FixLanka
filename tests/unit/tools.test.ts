import { describe, it, expect } from 'vitest';
import {
  getAllTools,
  getToolBySlug,
  getToolsByCategory,
  getFeaturedTools,
  searchTools,
  getRelatedTools,
} from '../../src/data/tools';
import { CATEGORY_LIST } from '../../src/data/categories';

describe('Tool Registry', () => {
  it('contains exactly 20 initial working tools', () => {
    const tools = getAllTools();
    expect(tools.length).toBe(20);
  });

  it('contains all 6 canonical categories without empty categories', () => {
    expect(CATEGORY_LIST.length).toBe(6);
    for (const cat of CATEGORY_LIST) {
      expect(getToolsByCategory(cat.id, true).length).toBeGreaterThanOrEqual(3);
    }
  });

  it('can query tools by slug', () => {
    const compressor = getToolBySlug('image-compressor');
    expect(compressor).toBeDefined();
    expect(compressor?.name).toBe('Image Compressor');
    expect(compressor?.category).toBe('image-tools');
  });

  it('returns related tools for a given tool', () => {
    const related = getRelatedTools('exif-metadata-viewer');
    expect(related.length).toBeGreaterThan(0);
    expect(related.some((t) => t.slug === 'exif-privacy-cleaner')).toBe(true);
  });

  it('performs search across names, categories and keywords', () => {
    const results = searchTools('exif');
    expect(results.length).toBeGreaterThanOrEqual(2);
    expect(results.some((t) => t.slug === 'exif-metadata-viewer')).toBe(true);

    const pdfResults = searchTools('pdf');
    expect(pdfResults.length).toBeGreaterThanOrEqual(3);
  });

  it('ensures every tool has unique primaryKeyword and complete SEO data', () => {
    const tools = getAllTools();
    const primaries = new Set<string>();
    for (const tool of tools) {
      expect(tool.seoTitle).toBeTruthy();
      expect(tool.seoTitle.length).toBeLessThanOrEqual(65);
      expect(tool.seoDescription).toBeTruthy();
      expect(tool.seoDescription.length).toBeGreaterThanOrEqual(110);
      expect(tool.seoDescription.length).toBeLessThanOrEqual(165);
      expect(tool.primaryKeyword).toBeTruthy();
      const normalized = tool.primaryKeyword.toLowerCase().trim();
      expect(primaries.has(normalized)).toBe(false);
      primaries.add(normalized);
      expect(tool.instructions.length).toBeGreaterThanOrEqual(3);
      expect(tool.featuresList.length).toBeGreaterThanOrEqual(3);
      expect(tool.maxFileSize).toBeGreaterThanOrEqual(0);
    }
  });
});
