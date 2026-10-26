import { TechnicianDetailView } from '@/components/TechnicianDetailView';
import { demoTechnicians } from '@/lib/demo-data';

import type { Metadata } from 'next';

export async function generateStaticParams() {
  return demoTechnicians.map((tech) => ({
    id: tech.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tech = demoTechnicians.find((t) => t.slug === id);

  if (!tech) {
    return { title: 'Technician Not Found' };
  }

  const primaryService = tech.services[0]?.name_en || 'Technician';
  const location = `${tech.town}, ${tech.district.name_en}`;
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

  return <TechnicianDetailView id={id} />;
}
