'use client';

import { I18nProvider } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </I18nProvider>
  );
}
