import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description:
    'Book a Vedic astrology or tarot consultation with Astro Suvid in Lucknow. Call, WhatsApp or send an enquiry — we respond within 24 hours.',
  path: '/contact',
  keywords: [
    'contact astrologer lucknow',
    'book astrology consultation',
    'whatsapp astrologer',
  ],
});

export default function ContactPage() {
  return <ContactPageClient />;
}
