import type { MetadataRoute } from 'next';
import { getPublishedTechnicians } from '@/lib/technicians';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fixlanka.com';
  const technicians = await getPublishedTechnicians();

  const techUrls: MetadataRoute.Sitemap = technicians.map((tech) => ({
    url: `${baseUrl}/technicians/${tech.slug}`,
    lastModified: new Date(tech.updated_at || tech.created_at || new Date()),
    changeFrequency: 'weekly',
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
