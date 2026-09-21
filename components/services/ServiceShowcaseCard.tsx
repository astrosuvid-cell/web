'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  imageAlt: string;
  imageBg: string;
  imageFit: 'contain' | 'cover';
  btnText: string;
  accentBar: string;
  accentGlow: string;
  cardHref: string;
  buttonHref?: string;
  detailHref?: string;
  actionType: 'ask' | 'modal' | 'link';
}

interface ServiceShowcaseCardProps {
  service: ServiceItem;
  index: number;
  featured?: boolean;
  onCardClick: () => void;
  onActionClick: (e: React.MouseEvent) => void;
}

export default function ServiceShowcaseCard({
  service,
  index,
  featured = false,
  onCardClick,
  onActionClick,
}: ServiceShowcaseCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCardClick();
        }
      }}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/70 bg-card opacity-0 shadow-sm animate-fade-up transition-all duration-500 hover:-translate-y-1 hover:border-border hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:translate-y-0 sm:rounded-3xl ${
        featured ? 'min-h-[360px] sm:min-h-[400px]' : 'min-h-[300px]'
      }`}
      style={{
        animationDelay: `${index * 70}ms`,
        animationFillMode: 'forwards',
      }}
    >
      <div className={`absolute left-0 top-0 z-20 h-full w-1 ${service.accentBar}`} />

      {/* Image zone */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${service.imageBg} ${
          featured ? 'min-h-[200px] flex-[1.2]' : 'min-h-[160px] flex-1'
        }`}
      >
        <img
          src={service.image}
          alt={service.imageAlt}
          width={800}
          height={600}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.05] ${
            service.imageFit === 'contain'
              ? 'object-contain p-4 sm:p-5'
              : 'object-cover object-center'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

        <div className={`absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 ${featured ? 'sm:p-6' : ''}`}>
          <h3
            className={`font-serif leading-tight text-foreground transition-colors group-hover:text-primary ${
              featured ? 'text-xl sm:text-2xl md:text-[1.65rem]' : 'text-lg sm:text-xl'
            }`}
          >
            {service.title}
          </h3>
        </div>
      </div>

      {/* Content zone */}
      <div className="relative flex flex-col p-4 sm:p-5">
        <p
          className={`leading-relaxed text-muted-foreground ${
            featured ? 'text-sm sm:text-[15px]' : 'text-xs sm:text-sm line-clamp-2'
          }`}
        >
          {service.desc}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Button
            type="button"
            onClick={onActionClick}
            className="h-11 flex-1 rounded-xl border-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.18em] shadow-md shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/40 active:scale-[0.98] sm:text-[11px]"
          >
            <span>{service.btnText}</span>
            <ArrowRight size={13} className="ml-1.5 transition-transform group-hover:translate-x-1" />
          </Button>

          {service.detailHref && (
            <Link
              href={service.detailHref}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              aria-label={`View ${service.title} details`}
            >
              <ArrowUpRight size={16} />
            </Link>
          )}
        </div>
      </div>

      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${service.accentGlow}`}
        aria-hidden
      />
    </article>
  );
}
