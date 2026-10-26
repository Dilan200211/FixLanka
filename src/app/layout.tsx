import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fixlanka.lk';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'FixLanka — Find Trusted Technicians in Sri Lanka',
    template: '%s | FixLanka',
  },
  description:
    'Direct contact with verified plumbers, electricians, AC technicians, and repair pros across all 25 districts in Sri Lanka. No middleman.',
  keywords: [
    'Sri Lanka technicians',
    'plumber Colombo',
    'electrician Sri Lanka',
    'AC repair Colombo',
    'technician directory Sri Lanka',
    'handyman services',
    'FixLanka',
  ],
  authors: [{ name: 'FixLanka' }],
  creator: 'FixLanka',
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    url: baseUrl,
    siteName: 'FixLanka',
    title: 'FixLanka — Find Trusted Technicians in Sri Lanka',
    description:
      'Direct contact with verified plumbers, electricians, AC technicians, and repair pros across all 25 districts in Sri Lanka.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FixLanka — Find Trusted Technicians in Sri Lanka',
    description:
      'Direct contact with verified plumbers, electricians, AC technicians, and repair pros across all 25 districts in Sri Lanka.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Noto+Sans+Sinhala:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
