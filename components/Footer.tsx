'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import {
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Youtube,
  Facebook,
  MapPin,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useSiteSettings } from '@/lib/SiteSettingsContext';

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-4 text-sm font-medium text-foreground">{title}</p>
      {children}
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm leading-7 text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const { t } = useLanguage();
  const { settings, telHref, whatsappHref, mailtoHref } = useSiteSettings();

  const socialLinks = [
    {
      icon: Instagram,
      href: settings.social.instagram,
      label: 'Instagram',
      color: 'text-[#E4405F] hover:text-[#c13584]',
    },
    {
      icon: Youtube,
      href: settings.social.youtube,
      label: 'YouTube',
      color: 'text-[#FF0000] hover:text-[#cc0000]',
    },
    {
      icon: Facebook,
      href: settings.social.facebook,
      label: 'Facebook',
      color: 'text-[#1877F2] hover:text-[#0d65d9]',
    },
  ].filter((link) => link.href);

  const exploreLinks = [
    { name: t('link.home'), href: '/' },
    { name: t('link.services'), href: '/services' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.about'), href: '/about' },
    { name: t('link.contact'), href: '/contact' },
    { name: t('link.horoscope'), href: '/daily-horoscope' },
  ];

  const serviceLinks = [
    { name: t('service.kundli.title'), href: '/vedic-astrology' },
    { name: t('service.tarot.title'), href: '/tarot-reading' },
    { name: t('service.matchmaking.title'), href: '/matchmaking' },
    { name: t('service.vastu.title'), href: '/vastu-consultation' },
    { name: t('service.gemstone.title'), href: '/astromall' },
    { name: t('service.business.title'), href: '/business-growth' },
    { name: t('service.matrimonial.title'), href: '/matrimonial' },
  ];

  const guideLinks = [
    { name: t('link.guide1'), href: '/best-vedic-astrologer-in-lucknow' },
    { name: t('link.guide2'), href: '/best-tarot-readers-in-lucknow' },
    { name: t('link.guide3'), href: '/best-astrologers-in-lucknow' },
    { name: t('link.guide4'), href: '/best-astrologers' },
  ];

  const legalLinks = [
    { name: t('link.privacy'), href: '/privacy-policy' },
    { name: t('link.terms'), href: '/terms-of-service' },
    { name: t('link.cancellation'), href: '/cancellation-refund' },
    { name: t('link.shipping'), href: '/shipping-delivery' },
    { name: t('link.contact'), href: '/contact' },
  ];

  return (
    <footer className="border-t border-border bg-[#fafafa] pb-32 md:pb-28">
      <div className="section-container">
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-16">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo
              variant="full"
              imageClassName="h-11 w-auto max-w-[200px] shrink-0"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t('footer.description')}
            </p>

            <div className="mt-8 space-y-2 text-sm text-muted-foreground">
              <a
                href={telHref}
                className="flex items-center gap-2.5 transition-colors hover:text-foreground"
              >
                <Phone size={15} className="shrink-0 text-foreground/70" />
                {settings.phoneDisplay}
              </a>
              <a
                href={mailtoHref}
                className="flex items-center gap-2.5 transition-colors hover:text-foreground"
              >
                <Mail size={15} className="shrink-0 text-foreground/70" />
                {settings.email}
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-colors hover:text-[#128C7E]"
              >
                <MessageCircle size={15} className="shrink-0 text-[#25D366]" />
                {t('footer.whatsapp')}
              </a>
              <p className="flex items-start gap-2.5 pt-1">
                <MapPin size={15} className="mt-0.5 shrink-0 text-foreground/70" />
                {settings.addressLine}
              </p>

              <div className="flex items-center gap-5 pt-4">
                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`transition-colors ${color}`}
                  >
                    <Icon size={20} strokeWidth={1.75} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5">
            <FooterColumn title={t('footer.navigation')}>
              <nav className="flex flex-col">
                {exploreLinks.map((item) => (
                  <FooterLink key={item.href} href={item.href}>
                    {item.name}
                  </FooterLink>
                ))}
              </nav>
            </FooterColumn>

            <FooterColumn title={t('footer.services')}>
              <nav className="flex flex-col">
                {serviceLinks.map((item) => (
                  <FooterLink key={item.href} href={item.href}>
                    {item.name}
                  </FooterLink>
                ))}
              </nav>
            </FooterColumn>

            <FooterColumn title={t('footer.guides')}>
              <nav className="flex flex-col">
                {guideLinks.map((item) => (
                  <FooterLink key={item.href} href={item.href}>
                    {item.name}
                  </FooterLink>
                ))}
              </nav>
            </FooterColumn>
          </div>

          {/* Consult */}
          <div className="lg:col-span-3 lg:pl-4">
            <p className="mb-4 text-sm font-medium text-foreground">{t('footer.consult.title')}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t('footer.consult.desc')}
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              {t('nav.consult')} →
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-6 border-t border-border py-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {t('footer.rights')}
          </p>

          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
