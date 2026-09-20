'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: t('how.step1.title'),
      desc: t('how.step1.desc'),
    },
    {
      num: '02',
      title: t('how.step2.title'),
      desc: t('how.step2.desc'),
    },
    {
      num: '03',
      title: t('how.step3.title'),
      desc: t('how.step3.desc'),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0f172a] py-20 text-[#f7f5f1] md:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(196,165,116,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(196,165,116,0.5) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
      />

      <div className="section-container relative">
        <div className="mb-14 max-w-2xl md:mb-20">
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl md:text-5xl">
            {t('how.title')}{' '}
            <span className="italic text-[#c4a574]">{t('how.title.highlight')}</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-stone-400 md:text-base">
            {t('how.subtitle')}
          </p>
        </div>

        <div className="grid gap-0 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.num}
              className={`relative border-t border-white/10 py-8 md:border-t-0 md:border-l md:px-8 md:py-0 ${
                index === 0 ? 'md:border-l-0 md:pl-0' : ''
              } ${index === steps.length - 1 ? 'md:pr-0' : ''}`}
            >
              <p className="font-serif text-5xl leading-none text-[#c4a574]/35 md:text-6xl">
                {step.num}
              </p>
              <h3 className="mt-5 font-serif text-xl text-white md:text-2xl">{step.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-400">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start gap-5 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone-500">{t('how.note')}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#c4a574] px-6 py-3 text-sm font-medium text-[#0f172a] transition-colors hover:bg-[#d4b884]"
          >
            {t('how.cta')}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
