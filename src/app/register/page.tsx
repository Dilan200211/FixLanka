import type { Metadata } from 'next';
import { TechnicianRegistrationForm } from '@/components/TechnicianRegistrationForm';

export const metadata: Metadata = {
  title: 'Register as a Technician — FixLanka',
  description:
    'Join FixLanka to list your trade services. Connect directly with customers across Sri Lanka with zero commission or middleman fees.',
  openGraph: {
    title: 'Register as a Technician — FixLanka',
    description:
      'Join FixLanka to list your trade services. Connect directly with customers across Sri Lanka with zero commission.',
  },
};

export default function RegisterPage() {
  return <TechnicianRegistrationForm />;
}
