import SEOLayout from '@/components/SEOLayout';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Best Astrologers for Vedic & Tarot Guidance',
  description:
    "Connect with the world's best astrologers for deep Vedic insights and intuitive Tarot readings. Transform your life with expert cosmic guidance.",
  path: '/best-astrologers',
  keywords: [
    'best astrologers',
    'top vedic astrologers',
    'professional tarot readers',
    'cosmic guidance',
    'spiritual advisors',
  ],
});

export default function BestAstrologers() {
  return (
    <SEOLayout
      title="Best Astrologers for Your Cosmic Journey"
      description="Navigate your life's path with guidance from the best astrologers. Our experts combine ancient wisdom with modern psychological insights for truly transformative sessions."
      content={
        <div className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl text-foreground font-serif">What Makes an Astrologer the 'Best'?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The best astrologers are those who don't just predict the future, but empower you to create it. They serve as cosmic translators, helping you understand the planetary energies at play in your life.
            </p>
          </section>

          <section className="space-y-6 bg-card/50 p-8 md:p-12 rounded-[2rem] border border-border/50">
            <h2 className="text-3xl md:text-4xl text-foreground font-serif text-primary">Our Global Standards of Excellence</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At Astro Suvid, we maintain a rigorous standard for all our practitioners. Whether they specialize in Vedic Astrology or Tarot, they bring years of study and intuitive practice to every session.
            </p>
            <ul className="grid md:grid-cols-2 gap-4 text-muted-foreground">
              <li className="flex items-center gap-3">✨ Authenticity & Ethics</li>
              <li className="flex items-center gap-3">✨ Deep Scriptural Knowledge</li>
              <li className="flex items-center gap-3">✨ Intuitive & Empathetic Approach</li>
              <li className="flex items-center gap-3">✨ Practical & Actionable Advice</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl text-foreground font-serif">A Holistic Approach to Guidance</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We believe in a holistic approach that respects both the material and spiritual aspects of life. Our astrologers provide insights that are relevant to your career, health, relationships, and soul's evolution.
            </p>
          </section>
        </div>
      }
    />
  );
}
