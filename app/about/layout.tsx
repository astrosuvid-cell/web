import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About Us',
  description:
    'Meet Astro Suvid — trusted Vedic astrologers and tarot readers in Lucknow offering honest, tradition-rooted guidance for career, marriage, health and life decisions.',
  path: '/about',
  keywords: [
    'about Astro Suvid',
    'vedic astrologer lucknow',
    'astrology team',
    'spiritual guidance india',
  ],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
