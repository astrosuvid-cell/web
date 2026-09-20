'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function WhyChooseUs() {
  const { t } = useLanguage();

  const stats = [
    { value: '10+', label: t('why.stat1.label') },
    { value: '500+', label: t('why.stat2.label') },
    { value: '100%', label: t('why.stat3.label') },
  ];

  const features = [
    { title: t('why.feature1.title'), desc: t('why.feature1.desc') },
    { title: t('why.feature2.title'), desc: t('why.feature2.desc') },
    { title: t('why.feature3.title'), desc: t('why.feature3.desc') },
    { title: t('why.feature4.title'), desc: t('why.feature4.desc') },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f7f5f1] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(ellipse_at_80%_20%,rgba(196,165,116,0.14),transparent_55%)] lg:block" />

      <div className="section-container relative">
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm text-[#8a6d42]">Astro Suvid</p>
            <h2 className="mt-3 max-w-md font-serif text-[2.25rem] leading-[1.1] tracking-tight text-stone-900 sm:text-5xl md:text-[3.1rem]">
              {t('why.title')}{' '}
              <span className="italic text-[#8a6d42]">{t('why.title.highlight')}</span>
              {t('why.title.suffix')}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-stone-600">
              {t('why.subtitle')}
            </p>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-stone-300/70 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-serif text-3xl text-stone-900 md:text-4xl">{stat.value}</dt>
                  <dd className="mt-1.5 text-xs leading-snug text-stone-500">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ol className="divide-y divide-stone-300/60 border-y border-stone-300/60">
            {features.map((feature, index) => (
              <li
                key={feature.title}
                className="group grid gap-3 py-7 transition-colors sm:grid-cols-[4.5rem_1fr] sm:gap-8 sm:py-8"
              >
                <span className="font-serif text-2xl text-[#c4a574] tabular-nums sm:pt-0.5">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-stone-900 transition-colors group-hover:text-[#6f5634] md:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600 md:text-[15px]">
                    {feature.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
