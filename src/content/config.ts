import { defineCollection, z } from 'astro:content';
import { BLOG_CATEGORY_SLUGS } from '../data/blogCategories';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(10),
    seoTitle: z.string().max(65).optional(),
    metaDescription: z.string().min(80).max(165),
    excerpt: z.string().min(40),
    status: z.enum(['draft', 'in-review', 'scheduled', 'published', 'archived']).default('published'),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('dilan-vinod'),
    category: z.enum(BLOG_CATEGORY_SLUGS),
    tags: z.array(z.string()).default([]),
    featuredImage: z.string().default('/blog-covers/default.svg'),
    imageAlt: z.string().min(10),
    canonicalUrl: z.string().url().optional(),
    noindex: z.boolean().default(false),
    relatedTools: z.array(z.string()).default([]),
    relatedArticles: z.array(z.string()).default([]),
    references: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
        })
      )
      .default([]),
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .default([]),
  }),
});

export const collections = {
  blog: blogCollection,
};
