import type { Metadata } from 'next';
import Header from '@/components/Header';
import { buildMetadata } from '@/lib/seo';
import CosmicBackground from '@/components/CosmicBackground';
import DepthAtmosphere from '@/components/effects/DepthAtmosphere';
import TouchConstellation from '@/components/effects/TouchConstellation';
import ScrollReveal3D from '@/components/effects/ScrollReveal3D';
import Hero from '@/components/Hero';
import WhyChooseUs from '@/components/WhyChooseUs';
import OurServices from '@/components/OurServices';
import HowItWorks from '@/components/HowItWorks';
import AstroMall from '@/components/AstroMall';
import Testimonials from '@/components/Testimonials';
import CTABanner from '@/components/CTABanner';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

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

export default function Home() {
  return (
    <main className="relative overflow-x-hidden bg-background">
      <CosmicBackground />
      <DepthAtmosphere />
      <TouchConstellation />
      <Header />
      <Hero />
      <OurServices />
      <ScrollReveal3D>
        <WhyChooseUs />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <HowItWorks />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <AstroMall />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <Testimonials />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <CTABanner />
      </ScrollReveal3D>
      <ScrollReveal3D>
        <ContactForm />
      </ScrollReveal3D>
      <Footer />
    </main>
  );
}
