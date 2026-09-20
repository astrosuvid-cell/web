'use client';

import { useLanguage } from '@/lib/LanguageContext';

function TestimonialCard({
  name,
  location,
  text,
  large = false,
}: {
  name: string;
  location: string;
  text: string;
  large?: boolean;
}) {
  return (
    <article
      className={`flex h-full flex-col border border-stone-200 bg-white ${
        large ? 'p-8 md:p-10' : 'p-6'
      }`}
    >
      <p
        className={`flex-grow font-serif leading-snug text-stone-800 ${
          large ? 'text-2xl md:text-3xl md:leading-[1.25]' : 'text-base md:text-lg'
        }`}
      >
        &ldquo;{text}&rdquo;
      </p>
      <footer className="mt-8 border-t border-stone-200 pt-5">
        <p className="text-sm font-medium text-stone-900">{name}</p>
        <p className="mt-0.5 text-xs text-stone-500">{location}</p>
      </footer>
    </article>
  );
}

export default function Testimonials() {
  const { t } = useLanguage();

  const testimonials = [1, 2, 3, 4, 5].map((id) => ({
    id,
    name: t(`testimonials.item.${id}.name`),
    location: t(`testimonials.item.${id}.location`),
    text: t(`testimonials.item.${id}.text`),
    featured: id === 1,
  }));

  const featured = testimonials.find((item) => item.featured) || testimonials[0];
  const rest = testimonials.filter((item) => item.id !== featured.id);

  return (
    <section className="relative overflow-hidden bg-[#f7f5f1] py-20 md:py-28">
      <div className="section-container">
        <div className="mb-12 flex flex-col gap-4 border-b border-stone-300/70 pb-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
              {t('testimonials.heading')}{' '}
              <span className="italic text-[#8a6d42]">{t('testimonials.heading.highlight')}</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-stone-500 md:text-right">{t('testimonials.note')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <TestimonialCard
              name={featured.name}
              location={featured.location}
              text={featured.text}
              large
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {rest.slice(0, 2).map((item) => (
              <TestimonialCard
                key={item.id}
                name={item.name}
                location={item.location}
                text={item.text}
              />
            ))}
          </div>
          {rest.slice(2).map((item) => (
            <div key={item.id} className="md:col-span-1 lg:col-span-4">
              <TestimonialCard name={item.name} location={item.location} text={item.text} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
