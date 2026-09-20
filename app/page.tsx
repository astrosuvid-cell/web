import type { Metadata } from 'next';
import Header from '@/components/Header';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Vedic Astrology & Tarot Reading in Lucknow',
  description:
    'Book expert Vedic astrology, tarot readings, kundli matching, Vastu and gemstone consultations with Astro Suvid. Trusted guidance for career, marriage, health and business success.',
  path: '/',
  keywords: [
    'vedic astrology lucknow',
    'tarot reading online',
    'best astrologer in lucknow',
    'kundli matching',
    'vastu consultant',
    'gemstone consultation',
  ],
});
import CosmicBackground from '@/components/CosmicBackground';
import Hero from '@/components/Hero';
import WhyChooseUs from '@/components/WhyChooseUs';
import OurServices from '@/components/OurServices';
import HowItWorks from '@/components/HowItWorks';
import AstroMall from '@/components/AstroMall';
import Testimonials from '@/components/Testimonials';
import CTABanner from '@/components/CTABanner';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative bg-background">
      <CosmicBackground />
      <Header />
      <Hero />
      <OurServices />
      <WhyChooseUs />
      <HowItWorks />
      <AstroMall />
      <Testimonials />
      <CTABanner />
      <ContactForm />
      <Footer />
    </main>
  );
}
