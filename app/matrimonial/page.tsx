import MatrimonialPageClient from '@/components/matrimonial/MatrimonialPageClient';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Premium Matrimonial Services',
  description:
    'Connect with verified profiles based on traditional values and astrological compatibility. Join Astro Suvid Matrimonial for meaningful connections.',
  path: '/matrimonial',
  keywords: [
    'matrimonial services',
    'kundli matching',
    'happy marriage',
    'lucknow matrimonial',
    'verified profiles',
  ],
});

export default function MatrimonialPage() {
  return <MatrimonialPageClient />;
}
