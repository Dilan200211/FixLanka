import { HomePage } from '@/components/HomePage';
import { getPublishedTechnicians } from '@/lib/technicians';

// Revalidate every 60 seconds (Incremental Static Regeneration)
export const revalidate = 60;

export default async function Page() {
  const initialTechnicians = await getPublishedTechnicians();
  return <HomePage initialTechnicians={initialTechnicians} />;
}
