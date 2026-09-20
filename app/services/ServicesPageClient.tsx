'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useServices } from '@/hooks/useServices';
import { SERVICE_ROUTE_META } from '@/lib/services';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  FileText,
  Search,
  Wand2,
  Home,
  Gem,
  Heart,
  Users,
  TrendingUp,
  ArrowRight,
  Phone,
  Check,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { formatServicePricing } from '@/lib/siteSettings';
import { Button } from '@/components/ui/button';

const validServiceIds = ['kundli', 'prashna', 'tarot', 'vastu', 'gemstone', 'matchmaking', 'matrimonial', 'business'] as const;
type ServiceId = (typeof validServiceIds)[number];

interface ServicesPageClientProps {
  initialService?: string;
}

const SERVICE_ICONS = {
  kundli: FileText,
  prashna: Search,
  tarot: Wand2,
  vastu: Home,
  gemstone: Gem,
  matchmaking: Heart,
  matrimonial: Users,
  business: TrendingUp,
} as const;

const SERVICE_COLORS: Record<ServiceId, { bar: string; bg: string; text: string; ring: string }> = {
  kundli: { bar: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-900', ring: 'ring-amber-200' },
  prashna: { bar: 'bg-orange-500', bg: 'bg-orange-50', text: 'text-orange-900', ring: 'ring-orange-200' },
  tarot: { bar: 'bg-violet-500', bg: 'bg-violet-50', text: 'text-violet-900', ring: 'ring-violet-200' },
  vastu: { bar: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-900', ring: 'ring-emerald-200' },
  gemstone: { bar: 'bg-amber-600', bg: 'bg-amber-50', text: 'text-amber-950', ring: 'ring-amber-300' },
  matchmaking: { bar: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-900', ring: 'ring-rose-200' },
  matrimonial: { bar: 'bg-sky-500', bg: 'bg-sky-50', text: 'text-sky-900', ring: 'ring-sky-200' },
  business: { bar: 'bg-slate-700', bg: 'bg-slate-100', text: 'text-slate-900', ring: 'ring-slate-300' },
};

export default function ServicesPageClient({ initialService }: ServicesPageClientProps) {
  const { t } = useLanguage();
  const hasScrolled = useRef(false);
  const { services: dbServices } = useServices();

  const fallbackServices = [
    {
      id: 'kundli' as const,
      title: t('service.kundli.title'),
      description: t('service.kundli.desc'),
      details: t('service.kundli.details'),
      btnText: t('service.kundli.btn'),
      href: '/contact',
      highlights: [
        'Personalized Janm Kundli with planetary positions and house analysis',
        'Career, marriage, health and wealth timing through Dasha predictions',
        'Remedies and guidance for the next 12–24 months',
      ],
    },
    {
      id: 'prashna' as const,
      title: t('service.prashna.title'),
      description: t('service.prashna.desc'),
      details: t('service.prashna.details'),
      btnText: t('service.prashna.btn'),
      href: '/contact',
      highlights: [
        'Horary answers for urgent life and relationship questions',
        'No birth chart required — timing from the moment you ask',
        'Ideal for travel, job offers, finance and relationship decisions',
      ],
    },
    {
      id: 'tarot' as const,
      title: t('service.tarot.title'),
      description: t('service.tarot.desc'),
      details: t('service.tarot.details'),
      btnText: t('service.tarot.btn'),
      href: '/tarot-reading',
      highlights: [
        'Spreads for current energy, obstacles, and future possibilities',
        'Clarity on relationships, career transitions, and purpose',
        'Practical next steps for your current situation',
      ],
    },
    {
      id: 'vastu' as const,
      title: t('service.vastu.title'),
      description: t('service.vastu.desc'),
      details: t('service.vastu.details'),
      btnText: t('service.vastu.btn'),
      href: '/vastu-consultation',
      highlights: [
        'Home and office Vastu changes without demolition',
        'Remedies for health, wealth and family harmony',
        'Layout optimization for doors, rooms and workplace flow',
      ],
    },
    {
      id: 'gemstone' as const,
      title: t('service.gemstone.title'),
      description: t('service.gemstone.desc'),
      details: t('service.gemstone.details'),
      btnText: t('service.gemstone.btn'),
      href: '/astromall',
      highlights: [
        'Lab-certified gemstones chosen for your chart',
        'Remedies to enhance confidence, career and relationships',
        'Guidance based on your unique planetary strengths',
      ],
    },
    {
      id: 'matchmaking' as const,
      title: t('service.matchmaking.title'),
      description: t('service.matchmaking.desc'),
      details: t('service.matchmaking.details'),
      btnText: t('service.matchmaking.btn'),
      href: '/matchmaking',
      highlights: [
        'Kundli matching with Guna Milan and Manglik checks',
        'Partner compatibility for long-term marriage success',
        'Advice on remedies, timing and relationship stability',
      ],
    },
    {
      id: 'matrimonial' as const,
      title: t('service.matrimonial.title'),
      description: t('service.matrimonial.desc'),
      details: t('service.matrimonial.details'),
      btnText: t('service.matrimonial.btn'),
      href: '/matrimonial',
      highlights: [
        'Astrology-backed matrimonial profiling and matching',
        'Verified profiles with family values and compatibility',
        'Submit your profile, receive matches and connect safely',
      ],
    },
    {
      id: 'business' as const,
      title: t('service.business.title'),
      description: t('service.business.desc'),
      details: t('service.business.details'),
      btnText: t('service.business.btn'),
      href: '/business-growth',
      highlights: [
        'Business chart analysis for growth, partnerships and recovery',
        'Timing guidance for launches, investments and contracts',
        'Practical remedies for financial and operational stability',
      ],
    },
  ];

  const services = useMemo(() => {
    if (dbServices.length === 0) return fallbackServices;
    return dbServices.map((s) => {
      const meta = SERVICE_ROUTE_META[s.slug];
      return {
        id: s.slug,
        title: s.title,
        description: s.description,
        details: s.long_description || s.description,
        btnText: meta ? t('services.book') : 'Book consultation',
        href: meta?.href || '/contact',
        highlights:
          s.features && s.features.length > 0 ? s.features : [s.description],
        pricingLabel:
          s.show_price
            ? formatServicePricing(s.price, s.duration_minutes, s.duration)
            : null,
      };
    });
  }, [dbServices, t]);

  useEffect(() => {
    if (!initialService || hasScrolled.current) return;
    const validIds = services.map((s) => s.id);
    if (!validIds.includes(initialService)) return;

    hasScrolled.current = true;
    const timer = setTimeout(() => {
      const el = document.getElementById(initialService);
      if (!el) return;
      // Account for fixed header on mobile
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 350);
    return () => clearTimeout(timer);
  }, [initialService, services]);

  const scrollToService = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#fafaf9] text-stone-900">
      <Header />

      {/* Hero */}
      <section className="border-b border-stone-200/80 bg-white pt-[110px] pb-12 md:pb-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-[2.35rem] leading-[1.08] tracking-tight sm:text-5xl md:text-[3.25rem]">
              {t('services.title')}{' '}
              <span className="font-serif italic text-amber-800">{t('services.title.highlight')}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone-600">
              {t('services.subtitle')}
            </p>
          </div>

          {/* Jump nav */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {services.map((service) => {
              const Icon =
                SERVICE_ROUTE_META[service.id]?.icon ||
                SERVICE_ICONS[service.id as ServiceId] ||
                FileText;
              const c = SERVICE_COLORS[service.id as ServiceId] || SERVICE_COLORS.kundli;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => scrollToService(service.id)}
                  className={`inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50 ${c.ring}`}
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${c.bg} ${c.text}`}>
                    <Icon size={13} />
                  </span>
                  {service.title}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* All services — fully visible */}
      <section className="py-12 md:py-16">
        <div className="section-container max-w-4xl space-y-8 md:space-y-10">
          {services.map((service, index) => {
            const Icon =
              SERVICE_ROUTE_META[service.id]?.icon ||
              SERVICE_ICONS[service.id as ServiceId] ||
              FileText;
            const colors = SERVICE_COLORS[service.id as ServiceId] || SERVICE_COLORS.kundli;
            const isHighlighted =
              initialService === service.id ||
              (!initialService && index === 0);

            return (
              <article
                key={service.id}
                id={service.id}
                className={`scroll-mt-28 rounded-2xl border bg-white shadow-sm sm:rounded-3xl ${
                  isHighlighted && initialService === service.id
                    ? `border-stone-400 ring-2 ${colors.ring}`
                    : 'border-stone-200/80'
                }`}
              >
                <div className={`h-1.5 rounded-t-2xl sm:rounded-t-3xl ${colors.bar}`} />

                <div className="p-6 sm:p-8 md:p-10">
                  {/* Header */}
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${colors.bg} ${colors.text}`}
                    >
                      <Icon size={26} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                        {service.title}
                      </h2>
                      <p className="mt-3 text-base leading-relaxed text-stone-600">
                        {service.description}
                      </p>
                      {'pricingLabel' in service && service.pricingLabel && (
                        <p className="mt-3 inline-flex rounded-full bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-900">
                          {service.pricingLabel}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Full details — always shown */}
                  <div className="mt-8 rounded-2xl border border-stone-100 bg-stone-50 p-5 sm:p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      What you get
                    </p>
                    <p className="mt-3 text-base leading-[1.75] text-stone-800">
                      {service.details}
                    </p>
                  </div>

                  {/* Highlights */}
                  <ul className="mt-6 space-y-3">
                    {service.highlights.map((point) => (
                      <li key={point} className="flex gap-3 text-sm leading-relaxed text-stone-700 sm:text-base">
                        <span
                          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${colors.bg}`}
                        >
                          <Check size={12} className={colors.text} strokeWidth={2.5} />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* CTAs */}
                  <div className="mt-8 flex flex-col gap-3 border-t border-stone-100 pt-8 sm:flex-row">
                    <Link href={service.href} className="sm:flex-1">
                      <Button className="h-12 w-full gap-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800">
                        {service.btnText}
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                    <Link href="/contact" className="sm:flex-1">
                      <Button
                        variant="outline"
                        className="h-12 w-full gap-2 rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50"
                      >
                        <Phone size={16} />
                        Book a consultation
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-stone-200/80 bg-white py-16 md:py-20">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t('services.ready')}</h2>
            <p className="mt-4 text-base leading-relaxed text-stone-600">{t('services.ready.subtitle')}</p>
            <Link href="/contact" className="mt-8 inline-block">
              <Button className="h-12 rounded-xl bg-amber-800 px-8 text-white hover:bg-amber-900">
                {t('services.book')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
