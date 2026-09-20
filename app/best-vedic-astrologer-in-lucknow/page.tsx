import SEOLayout from '@/components/SEOLayout';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Best Vedic Astrologer in Lucknow',
  description:
    'Experience the best Vedic Astrology services in Lucknow. Get deep insights into your birth chart, planetary positions, and future predictions.',
  path: '/best-vedic-astrologer-in-lucknow',
  keywords: [
    'best vedic astrologer in lucknow',
    'astrology lucknow',
    'birth chart reading',
    'kundli analysis',
  ],
});

export default function BestVedicAstrologerLucknow() {
  return (
    <SEOLayout
      title="Best Vedic Astrologer in Lucknow"
      description="Unlock your destiny with the most precise Vedic astrological guidance in Lucknow. Our deep-rooted wisdom and ancient sidereal calculations bring clarity to your life's path."
      content={
        <div className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl text-foreground font-serif">Why Choose Vedic Astrology?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Vedic Astrology, also known as Jyotish, is the "science of light" that has guided humanity for millennia. Unlike Western astrology, it uses the sidereal zodiac, providing a more accurate cosmic blueprint of your soul's journey.
            </p>
          </section>

          <section className="space-y-6 bg-card/50 p-8 md:p-12 rounded-[2rem] border border-border/50">
            <h2 className="text-3xl md:text-4xl text-foreground font-serif text-primary">Our Expertise in Lucknow</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At Astro Suvid, we provide personalized consultations that address your unique concerns, from career and wealth to relationships and spiritual growth. Our methods are rooted in Parasara and Jaimini systems, ensuring the highest level of accuracy.
            </p>
            <ul className="grid md:grid-cols-2 gap-4 text-muted-foreground">
              <li className="flex items-center gap-3">✨ Detailed Kundli Analysis</li>
              <li className="flex items-center gap-3">✨ Planetary Dasha Predictions</li>
              <li className="flex items-center gap-3">✨ Career & Wealth Guidance</li>
              <li className="flex items-center gap-3">✨ Gemstone Recommendations</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl text-foreground font-serif">Transform Your Life Today</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether you are facing obstacles or seeking new opportunities, a professional astrological consultation can provide the perspective you need to move forward with confidence.
            </p>
          </section>
        </div>
      }
    />
  );
}
