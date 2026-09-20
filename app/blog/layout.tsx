import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Astrology Blog & Cosmic Insights',
  description:
    'Read Vedic astrology articles, tarot insights, marriage and career guidance, gemstone tips and daily cosmic wisdom from Astro Suvid experts.',
  path: '/blog',
  keywords: [
    'astrology blog',
    'vedic astrology articles',
    'tarot insights',
    'horoscope blog',
    'spiritual guidance',
  ],
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
