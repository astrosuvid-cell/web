import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata, breadcrumbJsonLd, servicesItemListJsonLd } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Our Astrology & Tarot Services',
  description:
    'Explore Vedic astrology, tarot readings, kundli matching, Vastu, numerology, career and marriage guidance — personalized consultations from Astro Suvid.',
  path: '/services',
  keywords: [
    'astrology services',
    'tarot reading services',
    'kundli analysis',
    'vastu consultation',
    'numerology services',
  ],
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={[
          servicesItemListJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
          ]),
        ]}
      />
      {children}
    </>
  );
}
