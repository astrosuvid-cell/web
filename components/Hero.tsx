'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowUp, MessageCircle, Phone, Briefcase, Heart, Activity, ChevronLeft, ChevronRight, Home, TrendingUp, Users, Gem } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useSiteSettings } from '@/lib/SiteSettingsContext';
import { whatsappHref as buildWhatsappHref } from '@/lib/siteSettings';
import useEmblaCarousel from 'embla-carousel-react';

const slides = [
  {
    title: 'hero.relationship.title',
    highlight: 'hero.relationship.title.highlight',
    subtitle: 'hero.relationship.subtitle',
    bg: 'bg-[#FFF1F2]',
    accent: 'text-[#881337]',
    highlightColor: 'text-[#BE123C]',
    btnBg: 'bg-[#E11D48]',
    icon: <Heart className="w-12 h-12 md:w-20 md:h-20" />,
    image: '/love.gif',
    bottomImage: '/marriage.webp',
    questions: [
      'मेरी शादी कब होगी?', 
      'क्या मुझे सच्चा प्यार मिलेगा?', 
      'पति-पत्नी के बीच अनबन कैसे दूर करें?', 
      'लव मैरिज होगी या अरेंज मैरिज?',
      'शादी में आ रही बाधाएं कैसे दूर करें?',
      'मेरा जीवनसाथी कैसा होगा?',
      'तलाक के योग तो नहीं हैं?',
      'ससुराल में संबंध कैसे रहेंगे?',
      'विवाह का शुभ मुहूर्त कब है?'
    ]
  },
  {
    title: 'hero.career.title',
    highlight: 'hero.career.title.highlight',
    subtitle: 'hero.career.subtitle',
    bg: 'bg-[#FFFBEB]',
    accent: 'text-[#78350F]',
    highlightColor: 'text-[#B45309]',
    btnBg: 'bg-[#D97706]',
    icon: <Briefcase className="w-12 h-12 md:w-20 md:h-20" />,
    image: '/career.gif',
    bottomImage: '/wealth.jpg',
    questions: [
      'सरकारी नौकरी कब मिलेगी?', 
      'प्रमोशन के योग कब हैं?', 
      'धन लाभ के उपाय क्या हैं?', 
      'कर्ज से मुक्ति कैसे पाएं?',
      'विदेश यात्रा के योग कब हैं?',
      'नौकरी बदलनी चाहिए या नहीं?',
      'बॉस के साथ संबंध कैसे सुधारें?',
      'सैलरी में वृद्धि कब होगी?',
      'इंटरव्यू में सफलता कैसे पाएं?'
    ]
  },
  {
    title: 'hero.health.title',
    highlight: 'hero.health.title.highlight',
    subtitle: 'hero.health.subtitle',
    bg: 'bg-[#F5F3FF]',
    accent: 'text-[#4C1D95]',
    highlightColor: 'text-[#6D28D9]',
    btnBg: 'bg-[#7C3AED]',
    icon: <Activity className="w-12 h-12 md:w-20 md:h-20" />,
    image: '/health.gif',
    bottomImage: '/health.jpg',
    questions: [
      'सेहत में सुधार कब होगा?', 
      'बार-बार बीमार क्यों पड़ते हैं?', 
      'मानसिक शांति के उपाय?', 
      'बीमारी से बचाव के उपाय?',
      'योग और ध्यान का सही समय?',
      'नींद न आने की समस्या का समाधान?',
      'पुरानी बीमारी से कब छुटकारा मिलेगा?',
      'तनाव मुक्त जीवन कैसे जिएं?',
      'ऊर्जा का स्तर कैसे बढ़ाएं?'
    ]
  },
  {
    title: 'hero.vastu.title',
    highlight: 'hero.vastu.title.highlight',
    subtitle: 'hero.vastu.subtitle',
    bg: 'bg-[#F0FDF4]',
    accent: 'text-[#064E3B]',
    highlightColor: 'text-[#047857]',
    btnBg: 'bg-[#059669]',
    icon: <Home className="w-12 h-12 md:w-20 md:h-20" />,
    image: '/finance.gif',
    bottomImage: '/vastu.png',
    questions: [
      'अपना घर कब बनेगा?', 
      'नया घर लेते समय क्या सावधानी बरतें?', 
      'घर में वास्तु दोष कैसे पहचानें?', 
      'संपत्ति विवाद से छुटकारा कैसे पाएं?',
      'किचन की सही दिशा क्या है?',
      'बेडरूम में खुशहाली के उपाय?',
      'वास्तु अनुसार मुख्य द्वार कहाँ हो?',
      'घर में सकारात्मक ऊर्जा कैसे बढ़ाएं?',
      'ऑफिस का वास्तु कैसा होना चाहिए?'
    ]
  },
  {
    title: 'hero.business.title',
    highlight: 'hero.business.title.highlight',
    subtitle: 'hero.business.subtitle',
    bg: 'bg-[#EEF2FF]',
    accent: 'text-[#1E3A8A]',
    highlightColor: 'text-[#1D4ED8]',
    btnBg: 'bg-[#2563EB]',
    icon: <TrendingUp className="w-12 h-12 md:w-20 md:h-20" />,
    image: '/finance.gif',
    bottomImage: '/service-cards/business.jpg',
    questions: [
      'व्यापार में घाटा क्यों हो रहा है?', 
      'नया बिज़नेस शुरू करने का शुभ मुहूर्त?', 
      'बिजनेस में सफलता कैसे पाएं?', 
      'पार्टनरशिप में काम कैसा रहेगा?',
      'स्टॉक मार्केट में निवेश सही है?',
      'बिक्री बढ़ाने के उपाय?',
      'कर्मचारियों के साथ तालमेल कैसे बिठाएं?',
      'बिजनेस का नाम क्या रखें?',
      'नए निवेश के लिए सही समय?'
    ]
  },
  {
    title: 'hero.matchmaking.title',
    highlight: 'hero.matchmaking.title.highlight',
    subtitle: 'hero.matchmaking.subtitle',
    bg: 'bg-[#FEF2F2]',
    accent: 'text-[#7F1D1D]',
    highlightColor: 'text-[#B91C1C]',
    btnBg: 'bg-[#DC2626]',
    icon: <Users className="w-12 h-12 md:w-20 md:h-20" />,
    image: '/marriage.gif',
    bottomImage: '/match.png',
    questions: [
      'कुंडली मिलान क्यों जरूरी है?', 
      'गुण मिलान के साथ क्या देखें?', 
      'मांगलिक दोष का उपाय क्या है?', 
      'मैच मेकिंग से सुखद भविष्य कैसे?',
      'क्या हमारे स्वभाव मेल खाएंगे?',
      'भकूत और नाड़ी दोष का निवारण?',
      'संतान सुख के योग क्या हैं?',
      'शादी के बाद करियर कैसा रहेगा?',
      'क्या हम एक दूसरे के लिए सही हैं?'
    ]
  },
  {
    title: 'hero.matrimonial.title',
    highlight: 'hero.matrimonial.title.highlight',
    subtitle: 'hero.matrimonial.subtitle',
    bg: 'bg-[#FFFDF0]',
    accent: 'text-[#713F12]',
    highlightColor: 'text-[#A16207]',
    btnBg: 'bg-[#CA8A04]',
    icon: <Gem className="w-12 h-12 md:w-20 md:h-20" />,
    image: '/marriage.gif',
    bottomImage: '/matrimonial.png',
    questions: [
      'सर्वश्रेष्ठ जीवनसाथी कैसे चुनें?', 
      'विवाह में हो रही देरी के कारण?', 
      'सुखी वैवाहिक जीवन का रहस्य?', 
      'रिश्ते को मजबूत कैसे बनाएं?',
      'समान विचार वाला साथी कैसे मिले?',
      'शादी के लिए सही उम्र क्या है?',
      'क्या दूसरी शादी के योग हैं?',
      'पति/पत्नी के साथ विदेश योग?',
      'सफल वैवाहिक जीवन के ज्योतिष उपाय?'
    ]
  },
];

const slideCtas: Record<string, { key: string; href: string }> = {
  'hero.relationship.title': { key: 'hero.cta.relationship', href: '/kundli-matching' },
  'hero.career.title': { key: 'hero.cta.career', href: '/services' },
  'hero.health.title': { key: 'hero.cta.health', href: '/services' },
  'hero.vastu.title': { key: 'hero.cta.vastu', href: '/vastu-consultation' },
  'hero.business.title': { key: 'hero.cta.business', href: '/business-growth' },
  'hero.matchmaking.title': { key: 'hero.cta.matchmaking', href: '/matchmaking' },
  'hero.matrimonial.title': { key: 'hero.cta.matrimonial', href: '/matrimonial' },
};

export default function Hero() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { t } = useLanguage();
  const { telHref, settings } = useSiteSettings();
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);

    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off('select', onSelect);
      clearInterval(intervalId);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const active = slides[selectedIndex];

  return (
    <section className={`hero-fonts relative flex h-[85svh] min-h-[600px] items-center justify-center overflow-hidden transition-colors duration-1000 md:h-[800px] ${active.bg}`}>
      {/* Ambient color wash */}
      <div
        className={`pointer-events-none absolute -left-[10%] top-[8%] h-[55%] w-[45%] rounded-full blur-[100px] transition-colors duration-1000 animate-hero-orb ${active.btnBg} opacity-[0.14]`}
      />
      <div
        className={`pointer-events-none absolute -right-[8%] bottom-[18%] h-[45%] w-[40%] rounded-full blur-[90px] transition-colors duration-1000 animate-hero-orb ${active.btnBg} opacity-[0.1]`}
        style={{ animationDelay: '2s' }}
      />

      {/* Fine grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Edge vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.06)_100%)]" />

      {/* Zodiac rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-[300px] w-[300px] md:h-[680px] md:w-[680px]">
          <div className="absolute inset-0 rounded-full border border-black/[0.06] animate-slow-rotate">
            <div className={`absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full shadow-md transition-colors duration-1000 ${active.btnBg}`} />
            <div className={`absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full opacity-40 transition-colors duration-1000 ${active.btnBg}`} />
            <div className={`absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full opacity-30 transition-colors duration-1000 ${active.btnBg}`} />
            <div className={`absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full opacity-30 transition-colors duration-1000 ${active.btnBg}`} />
          </div>
          <div className="absolute inset-[18%] rounded-full border border-dashed border-black/[0.05] animate-slow-rotate-reverse" />
          <div className="absolute inset-[36%] rounded-full border border-black/[0.04]" />
        </div>
      </div>

      {/* Slide progress */}
      <div className="absolute left-0 right-0 top-0 z-20 h-[3px] bg-black/[0.04]">
        <div
          className={`h-full transition-all duration-700 ease-out ${active.btnBg}`}
          style={{ width: `${((selectedIndex + 1) / slides.length) * 100}%` }}
        />
      </div>

      <div className="w-full h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => {
            const currentCta = slideCtas[slide.title] ?? { key: 'hero.cta.services', href: '/services' };
            return (
              <div key={index} className="relative flex h-full min-w-0 flex-[0_0_100%] items-center px-4 md:px-8 lg:px-12">
                <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
                  {/* Content — left on desktop */}
                  <div className="order-1 pt-12 text-center md:pt-0 md:text-left">
                    <div className="mb-4 space-y-1 md:mb-8 md:space-y-2">
                      <h1
                        className={`font-serif text-3xl leading-[1.05] tracking-tight transition-all duration-700 md:text-5xl lg:text-6xl xl:text-7xl ${index === selectedIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${slide.accent}`}
                        style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}
                      >
                        {t(slide.title)} <br />
                        <span className={`italic ${slide.highlightColor}`}>{t(slide.highlight)}</span>
                      </h1>

                      <p
                        className={`mx-auto max-w-[90vw] text-sm font-light tracking-wide text-black/60 transition-all delay-200 duration-700 md:mx-0 md:max-w-xl md:text-lg lg:text-xl ${index === selectedIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                      >
                        {t(slide.subtitle)}
                      </p>

                      <div
                        className={`mx-auto mt-4 h-px w-16 transition-all delay-300 duration-700 md:mx-0 md:mt-5 md:w-24 ${index === selectedIndex ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'} ${slide.btnBg}`}
                      />

                      {/* Hindi Questions Scrollable Marquee */}
                      <div
                        className={`relative mt-6 overflow-x-auto scrollbar-hide transition-all delay-300 duration-700 md:mt-10 ${index === selectedIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        style={{
                          maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
                          WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
                        }}
                      >
                        <div className="animate-marquee flex gap-3 py-1.5 hover:[animation-play-state:paused] active:[animation-play-state:paused] md:gap-5 md:py-2">
                          {slide.questions.map((q, i) => (
                            <div
                              key={i}
                              className={`flex-shrink-0 rounded-full border border-white/60 bg-white/55 px-4 py-2 text-[10px] font-medium shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/75 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)] md:px-6 md:py-2.5 md:text-base ${slide.accent}`}
                            >
                              {q}
                            </div>
                          ))}
                          {slide.questions.map((q, i) => (
                            <div
                              key={`dup-${i}`}
                              className={`flex-shrink-0 rounded-full border border-white/60 bg-white/55 px-4 py-2 text-[10px] font-medium shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/75 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)] md:px-6 md:py-2.5 md:text-base ${slide.accent}`}
                            >
                              {q}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      className={`flex flex-row items-center justify-center gap-2 transition-all delay-500 duration-700 md:justify-start md:gap-4 ${index === selectedIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    >
                      <Link
                        href={currentCta.href}
                        className={`group relative overflow-hidden whitespace-nowrap rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.05em] text-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] active:scale-95 md:px-8 md:py-3 md:text-sm md:tracking-[0.15em] ${slide.btnBg}`}
                      >
                        <span className="relative z-10">{t(currentCta.key)}</span>
                        <div className="absolute inset-0 translate-y-full bg-black/10 transition-transform duration-300 group-hover:translate-y-0" />
                      </Link>

                      <Link
                        href="/contact"
                        className="whitespace-nowrap rounded-full border border-black/10 bg-white/50 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.05em] text-black/70 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/80 md:px-8 md:py-3 md:text-sm md:tracking-[0.15em]"
                      >
                        {t('hero.cta.book')}
                      </Link>
                    </div>
                  </div>

                  {/* Image — right on desktop, below content on mobile */}
                  <div className="order-2 flex items-center justify-center md:justify-end">
                    <div className="relative animate-hero-float">
                      <div
                        className={`absolute -bottom-2 left-1/2 h-8 w-[70%] -translate-x-1/2 rounded-[100%] blur-2xl transition-colors duration-1000 ${slide.btnBg} opacity-20`}
                      />
                      {Math.abs(index - selectedIndex) <= 1 || index === 0 ? (
                        <img
                          src={slide.bottomImage}
                          alt=""
                          width={960}
                          height={720}
                          decoding="async"
                          loading={index === selectedIndex ? 'eager' : 'lazy'}
                          fetchPriority={index === selectedIndex ? 'high' : 'low'}
                          className="relative max-h-[220px] w-full max-w-md object-contain transition-all duration-1000 md:max-h-[420px] md:max-w-xl lg:max-h-[480px] lg:max-w-2xl"
                        />
                      ) : (
                        <div
                          className="relative max-h-[220px] w-full max-w-md md:max-h-[420px] md:max-w-xl lg:max-h-[480px] lg:max-w-2xl"
                          style={{ aspectRatio: '4 / 3' }}
                          aria-hidden
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows - Desktop Only */}
      <button
        onClick={scrollPrev}
        className="absolute left-6 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white/50 shadow-lg backdrop-blur-md transition-all hover:bg-white/80 md:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="text-black/50" size={20} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-6 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white/50 shadow-lg backdrop-blur-md transition-all hover:bg-white/80 md:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="text-black/50" size={20} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-black/5 bg-white/40 px-3 py-2 backdrop-blur-md">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`rounded-full transition-all duration-500 ${
              index === selectedIndex ? `h-2 w-7 ${slides[index].btnBg}` : 'h-1.5 w-1.5 bg-black/20 hover:bg-black/35'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-[4.5rem] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 opacity-30">
        <span className="text-[9px] uppercase tracking-[0.25em] text-black/50">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-black/40 to-transparent" />
      </div>

      {/* Floating Call/Chat - Premium Version */}
      <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 gap-1.5 rounded-full border border-black/5 bg-white/85 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        <a
          href={telHref}
          className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:opacity-90 md:gap-3 md:px-6 md:py-3 ${active.btnBg}`}
        >
          <Phone size={16} className="shrink-0" /> {t('hero.call')}
        </a>
        <a
          href={buildWhatsappHref(
            settings.phone,
            "Hi Astro Suvid! I'd like a consultation."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-green-700 md:gap-3 md:px-6 md:py-3"
        >
          <MessageCircle size={16} className="shrink-0" /> {t('hero.chat')}
        </a>
      </div>

      {/* Back to Top */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 z-50 w-12 h-12 bg-white border border-black/5 text-black/70 rounded-full shadow-2xl flex items-center justify-center hover:bg-black/5 transition-all"
          aria-label="Scroll to Top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </section>
  );
}
