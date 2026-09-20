'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { useSiteSettings } from '@/lib/SiteSettingsContext';
import { whatsappHref as buildWhatsappHref, telHref as buildTelHref } from '@/lib/siteSettings';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitEnquiry } from '@/lib/submitEnquiry';
import { useToast } from '@/hooks/use-toast';
import ServiceShowcaseCard, { type ServiceItem } from '@/components/services/ServiceShowcaseCard';
import Tilt3D from '@/components/effects/Tilt3D';
import ScrollReveal3D from '@/components/effects/ScrollReveal3D';

const FEATURED_IDS = ['kundli', 'prashna'];

export default function OurServices() {
  const router = useRouter();
  const { t } = useLanguage();
  const { settings } = useSiteSettings();
  const { toast } = useToast();
  const [isMatchmakingOpen, setIsMatchmakingOpen] = useState(false);
  const [isAskNowOpen, setIsAskNowOpen] = useState(false);
  const [matchmakingDetails, setMatchmakingDetails] = useState({
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    p1Name: '',
    p1Dob: '',
    p1Tob: '',
    p1Pob: '',
    p2Name: '',
    p2Dob: '',
    p2Tob: '',
    p2Pob: '',
  });
  const [isMatchmakingSubmitting, setIsMatchmakingSubmitting] = useState(false);

  const handleMatchmakingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMatchmakingSubmitting(true);

    const message =
      `Matchmaking Analysis Inquiry:\n\n` +
      `Person 1:\nName: ${matchmakingDetails.p1Name}\nDOB: ${matchmakingDetails.p1Dob}\nTime: ${matchmakingDetails.p1Tob}\nPlace: ${matchmakingDetails.p1Pob}\n\n` +
      `Person 2:\nName: ${matchmakingDetails.p2Name}\nDOB: ${matchmakingDetails.p2Dob}\nTime: ${matchmakingDetails.p2Tob}\nPlace: ${matchmakingDetails.p2Pob}`;

    const result = await submitEnquiry({
      name: matchmakingDetails.contactName,
      email: matchmakingDetails.contactEmail,
      phone: matchmakingDetails.contactPhone,
      service_type: 'matchmaking',
      source_page: 'Homepage Services',
      message,
    });

    setIsMatchmakingSubmitting(false);

    if (result.success) {
      window.open(buildWhatsappHref(settings.phone, message), '_blank');
      setIsMatchmakingOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: result.error || 'Please try again or contact us on WhatsApp.',
      });
    }
  };

  const services: ServiceItem[] = [
    {
      id: 'kundli',
      title: t('service.kundli.title'),
      desc: t('service.kundli.desc'),
      image: '/service-cards/janm.svg',
      imageAlt: 'Janm kundli birth chart',
      imageBg: 'from-amber-50 via-orange-50 to-amber-100 dark:from-amber-950 dark:via-orange-950 dark:to-slate-900',
      imageFit: 'contain',
      btnText: t('service.kundli.btn'),
      accentBar: 'bg-amber-500',
      accentGlow: 'bg-amber-400/25',
      cardHref: '/services?service=kundli',
      actionType: 'ask',
    },
    {
      id: 'prashna',
      title: t('service.prashna.title'),
      desc: t('service.prashna.desc'),
      image: '/service-cards/prashna.jpg',
      imageAlt: 'Prashna kundli question chart',
      imageBg: 'from-orange-100 via-amber-50 to-orange-200 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-900',
      imageFit: 'cover',
      btnText: t('service.prashna.btn'),
      accentBar: 'bg-orange-500',
      accentGlow: 'bg-orange-400/25',
      cardHref: '/services?service=prashna',
      actionType: 'ask',
    },
    {
      id: 'tarot',
      title: t('service.tarot.title'),
      desc: t('service.tarot.desc'),
      image: '/service-cards/tarot.jpg',
      imageAlt: 'Tarot card reading spread',
      imageBg: 'from-purple-100 via-violet-50 to-purple-200 dark:from-purple-950 dark:via-violet-900 dark:to-slate-900',
      imageFit: 'cover',
      btnText: t('service.tarot.btn'),
      accentBar: 'bg-violet-500',
      accentGlow: 'bg-violet-400/25',
      cardHref: '/services?service=tarot',
      buttonHref: '/tarot-reading#contact-form',
      detailHref: '/tarot-reading',
      actionType: 'link',
    },
    {
      id: 'vastu',
      title: t('service.vastu.title'),
      desc: t('service.vastu.desc'),
      image: '/service-cards/Vastu-Shastra-Home-Layout.png',
      imageAlt: 'Vastu shastra home layout',
      imageBg: 'from-emerald-50 via-teal-50 to-emerald-100 dark:from-emerald-950 dark:via-slate-900 dark:to-black',
      imageFit: 'cover',
      btnText: t('service.vastu.btn'),
      accentBar: 'bg-emerald-500',
      accentGlow: 'bg-emerald-400/25',
      cardHref: '/services?service=vastu',
      buttonHref: '/vastu-consultation',
      detailHref: '/vastu-consultation',
      actionType: 'link',
    },
    {
      id: 'gemstone',
      title: t('service.gemstone.title'),
      desc: t('service.gemstone.desc'),
      image: '/service-cards/gemstones.webp',
      imageAlt: 'Gemstone consultation and navratna',
      imageBg: 'from-rose-50 via-red-50 to-rose-100 dark:from-rose-950 dark:via-red-900 dark:to-slate-900',
      imageFit: 'cover',
      btnText: t('service.gemstone.btn'),
      accentBar: 'bg-rose-500',
      accentGlow: 'bg-rose-400/25',
      cardHref: '/services?service=gemstone',
      buttonHref: '/astromall',
      detailHref: '/astromall',
      actionType: 'link',
    },
    {
      id: 'matchmaking',
      title: t('service.matchmaking.title'),
      desc: t('service.matchmaking.desc'),
      image: '/service-cards/matchmaking.jpg',
      imageAlt: 'Kundli matchmaking for couples',
      imageBg: 'from-rose-50 via-pink-50 to-rose-100 dark:from-rose-950 dark:via-pink-950 dark:to-slate-900',
      imageFit: 'cover',
      btnText: t('service.matchmaking.btn'),
      accentBar: 'bg-pink-500',
      accentGlow: 'bg-pink-400/25',
      cardHref: '/services?service=matchmaking',
      buttonHref: '/matchmaking',
      detailHref: '/matchmaking',
      actionType: 'link',
    },
    {
      id: 'matrimonial',
      title: t('service.matrimonial.title'),
      desc: t('service.matrimonial.desc'),
      image: '/service-cards/matrimonial.jpg',
      imageAlt: 'Matrimonial bride and groom',
      imageBg: 'from-cyan-50 via-sky-50 to-cyan-100 dark:from-cyan-950 dark:via-slate-900 dark:to-black',
      imageFit: 'cover',
      btnText: t('service.matrimonial.btn'),
      accentBar: 'bg-sky-500',
      accentGlow: 'bg-sky-400/25',
      cardHref: '/services?service=matrimonial',
      buttonHref: '/matrimonial',
      detailHref: '/matrimonial',
      actionType: 'link',
    },
    {
      id: 'business',
      title: t('service.business.title'),
      desc: t('service.business.desc'),
      image: '/service-cards/business.jpg',
      imageAlt: 'Business growth astrology',
      imageBg: 'from-orange-50 via-amber-50 to-yellow-100 dark:from-orange-950 dark:via-amber-950 dark:to-slate-900',
      imageFit: 'cover',
      btnText: t('service.business.btn'),
      accentBar: 'bg-yellow-500',
      accentGlow: 'bg-yellow-400/25',
      cardHref: '/services?service=business',
      buttonHref: '/business-growth',
      detailHref: '/business-growth',
      actionType: 'link',
    },
  ];

  const featured = services.filter((s) => FEATURED_IDS.includes(s.id));
  const standard = services.filter((s) => !FEATURED_IDS.includes(s.id));

  const handleAction = (service: ServiceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (service.actionType === 'ask') {
      setIsAskNowOpen(true);
      return;
    }
    if (service.actionType === 'modal') {
      setIsMatchmakingOpen(true);
      return;
    }
    if (service.buttonHref) {
      router.push(service.buttonHref);
    }
  };

  return (
    <section id="services" className="relative overflow-hidden bg-[#fbfbfa] py-20 pb-32 md:py-28 md:pb-28">
      <ScrollReveal3D>
      <div className="section-container relative">
        {/* Header */}
        <div className="mb-12 grid gap-6 border-b border-stone-200 pb-10 md:mb-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <h2 className="font-serif text-[2rem] leading-[1.08] tracking-tight text-stone-900 sm:text-4xl md:text-5xl lg:text-[3.1rem]">
              {t('home.services.title')}{' '}
              <span className="italic text-[#8a6d42]">{t('home.services.title.highlight')}</span>{' '}
              {t('home.services.title.suffix')}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-stone-600 sm:text-lg">
              {t('services.subtitle')}
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex h-fit items-center gap-2 self-start border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-800 transition-colors hover:border-stone-500 hover:bg-stone-50 lg:self-auto"
          >
            {t('home.services.all')}
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Featured pair */}
        <div className="mb-4 grid gap-4 sm:gap-5 md:grid-cols-2">
          {featured.map((service, index) => (
            <Tilt3D key={service.id} className="rounded-none" maxTilt={6} glare={false}>
              <ServiceShowcaseCard
                service={service}
                index={index}
                featured
                onCardClick={() => router.push(service.cardHref)}
                onActionClick={(e) => handleAction(service, e)}
              />
            </Tilt3D>
          ))}
        </div>

        {/* Standard grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {standard.map((service, index) => (
            <Tilt3D key={service.id} className="rounded-none" maxTilt={6} glare={false}>
              <ServiceShowcaseCard
                service={service}
                index={index + featured.length}
                onCardClick={() => router.push(service.cardHref)}
                onActionClick={(e) => handleAction(service, e)}
              />
            </Tilt3D>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-12 flex flex-col items-start justify-between gap-5 border border-stone-200 bg-white px-6 py-6 sm:flex-row sm:items-center sm:px-8">
          <p className="text-sm text-stone-600 sm:text-left">
            {t('home.services.notSure')}{' '}
            <span className="text-stone-900">{t('home.services.guideYou')}</span>
          </p>
          <Button
            type="button"
            onClick={() => setIsAskNowOpen(true)}
            className="h-11 shrink-0 rounded-none bg-[#0f172a] px-6 text-sm font-medium text-white hover:bg-[#1e293b]"
          >
            {t('home.services.askNow')}
            <ArrowRight size={14} className="ml-2" />
          </Button>
        </div>
      </div>
      </ScrollReveal3D>

      {/* Prashna / Kundli — Ask Now Dialog */}
      <Dialog open={isAskNowOpen} onOpenChange={setIsAskNowOpen}>
        <DialogContent className="glass-effect border-primary/20 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-3xl">{t('home.ask.title')}</DialogTitle>
            <DialogDescription className="text-base">
              {t('home.ask.desc')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-6">
            <Button
              onClick={() => window.open(buildWhatsappHref(settings.phone), '_blank')}
              className="group flex items-center justify-between rounded-2xl bg-[#25D366] px-8 py-8 text-lg text-white shadow-lg shadow-green-500/20 hover:bg-[#128C7E]"
            >
              <div className="flex items-center gap-4">
                <MessageCircle size={24} />
                <span className="font-serif">{t('home.ask.whatsapp')}</span>
              </div>
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              onClick={() => window.open(buildTelHref(settings.phone), '_self')}
              className="group flex items-center justify-between rounded-2xl bg-primary px-8 py-8 text-lg text-primary-foreground shadow-lg shadow-primary/20 hover:bg-foreground hover:text-background"
            >
              <div className="flex items-center gap-4">
                <Phone size={24} />
                <span className="font-serif">{t('home.ask.call')}</span>
              </div>
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Matchmaking Birth Details Modal */}
      <Dialog open={isMatchmakingOpen} onOpenChange={setIsMatchmakingOpen}>
        <DialogContent className="glass-effect max-h-[90vh] overflow-y-auto border-primary/20 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-3xl">{t('home.match.title')}</DialogTitle>
            <DialogDescription>
              {t('home.match.desc')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMatchmakingSubmit} className="space-y-8 py-4">
            <div className="space-y-4 rounded-2xl border border-border/50 bg-muted/30 p-4">
              <h4 className="font-serif text-lg text-foreground">{t('home.match.contact')}</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="contactName">{t('home.match.fullName')}</Label>
                  <Input
                    id="contactName"
                    required
                    value={matchmakingDetails.contactName}
                    onChange={(e) =>
                      setMatchmakingDetails({ ...matchmakingDetails, contactName: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">{t('home.match.phone')}</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    required
                    value={matchmakingDetails.contactPhone}
                    onChange={(e) =>
                      setMatchmakingDetails({ ...matchmakingDetails, contactPhone: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">{t('home.match.email')}</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={matchmakingDetails.contactEmail}
                    onChange={(e) =>
                      setMatchmakingDetails({ ...matchmakingDetails, contactEmail: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
              <h4 className="flex items-center gap-2 font-serif text-lg text-primary">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  1
                </span>
                {t('home.match.person1')}
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="p1Name">{t('home.match.fullName')}</Label>
                  <Input
                    id="p1Name"
                    required
                    value={matchmakingDetails.p1Name}
                    onChange={(e) =>
                      setMatchmakingDetails({ ...matchmakingDetails, p1Name: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p1Dob">{t('home.match.dob')}</Label>
                  <Input
                    id="p1Dob"
                    type="date"
                    required
                    value={matchmakingDetails.p1Dob}
                    onChange={(e) =>
                      setMatchmakingDetails({ ...matchmakingDetails, p1Dob: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p1Tob">{t('home.match.tob')}</Label>
                  <Input
                    id="p1Tob"
                    type="time"
                    required
                    value={matchmakingDetails.p1Tob}
                    onChange={(e) =>
                      setMatchmakingDetails({ ...matchmakingDetails, p1Tob: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p1Pob">{t('home.match.pob')}</Label>
                  <Input
                    id="p1Pob"
                    required
                    placeholder={t('home.match.placeholder.location')}
                    value={matchmakingDetails.p1Pob}
                    onChange={(e) =>
                      setMatchmakingDetails({ ...matchmakingDetails, p1Pob: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-accent/10 bg-accent/5 p-4">
              <h4 className="flex items-center gap-2 font-serif text-lg text-accent">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                  2
                </span>
                {t('home.match.person2')}
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="p2Name">{t('home.match.fullName')}</Label>
                  <Input
                    id="p2Name"
                    required
                    value={matchmakingDetails.p2Name}
                    onChange={(e) =>
                      setMatchmakingDetails({ ...matchmakingDetails, p2Name: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p2Dob">{t('home.match.dob')}</Label>
                  <Input
                    id="p2Dob"
                    type="date"
                    required
                    value={matchmakingDetails.p2Dob}
                    onChange={(e) =>
                      setMatchmakingDetails({ ...matchmakingDetails, p2Dob: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p2Tob">{t('home.match.tob')}</Label>
                  <Input
                    id="p2Tob"
                    type="time"
                    required
                    value={matchmakingDetails.p2Tob}
                    onChange={(e) =>
                      setMatchmakingDetails({ ...matchmakingDetails, p2Tob: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p2Pob">{t('home.match.pob')}</Label>
                  <Input
                    id="p2Pob"
                    required
                    placeholder={t('home.match.placeholder.location')}
                    value={matchmakingDetails.p2Pob}
                    onChange={(e) =>
                      setMatchmakingDetails({ ...matchmakingDetails, p2Pob: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isMatchmakingSubmitting}
              className="w-full rounded-2xl py-8 font-serif text-lg"
            >
              {isMatchmakingSubmitting ? t('home.match.submitting') : t('home.match.submit')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
