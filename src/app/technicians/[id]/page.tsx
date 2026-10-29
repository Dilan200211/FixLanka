import { TechnicianDetailView } from '@/components/TechnicianDetailView';
import { getTechnicianBySlug, getAllPublishedSlugs } from '@/lib/technicians';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({
    id: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tech = await getTechnicianBySlug(id);

  if (!tech) {
    return { title: 'Technician Not Found' };
  }

  const primaryService = tech.services[0]?.name_en || 'Technician';
  const location = `${tech.town}${tech.district?.name_en ? `, ${tech.district.name_en}` : ''}`;
  const title = `${tech.name} — ${primaryService} in ${location}`;
  const description = `${tech.name} is a verified ${primaryService.toLowerCase()} based in ${location}. Contact directly on FixLanka.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
    },
  };
}

export default async function TechnicianPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tech = await getTechnicianBySlug(id);

  if (!tech) {
    notFound();
  }

  return <TechnicianDetailView id={id} initialTechnician={tech} />;
}
