import type { MetadataRoute } from 'next';
import { demoTechnicians } from '@/lib/demo-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fixlanka.com';

  const techUrls = demoTechnicians.map((tech) => ({
    url: `${baseUrl}/technicians/${tech.slug}`,
    lastModified: new Date(tech.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...techUrls,
  ];
}
