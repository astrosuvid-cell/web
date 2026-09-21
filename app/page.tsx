import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { preload } from 'react-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { DeferredPageEffects } from '@/components/effects/DeferredEffects';
import { buildMetadata } from '@/lib/seo';

const ScrollReveal3D = dynamic(() => import('@/components/effects/ScrollReveal3D'));
const WhyChooseUs = dynamic(() => import('@/components/WhyChooseUs'));
const OurServices = dynamic(() => import('@/components/OurServices'));
const HowItWorks = dynamic(() => import('@/components/HowItWorks'));
const AstroMall = dynamic(() => import('@/components/AstroMall'));
const Testimonials = dynamic(() => import('@/components/Testimonials'));
const CTABanner = dynamic(() => import('@/components/CTABanner'));
const ContactForm = dynamic(() => import('@/components/ContactForm'));

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
  preload('/marriage.webp', { as: 'image' });

  return (
    <main className="relative overflow-x-hidden bg-background">
      <DeferredPageEffects />
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
