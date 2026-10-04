import React, { useEffect, useState } from 'react';
import { Link } from '../lib/router';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero() {
  const [index, setIndex] = useState(0);

  const slides = [
    {
      id: 'drop',
      type: 'lawn-drop',
      badge: 'LIMITED DROP',
      mainHeadline: '25% OFF',
      extraBox: '+10% OFF',
      subText: 'LIMITED TIME OFFER',
      ctaText: 'SHOP THE DROP →',
      ctaSub: 'WHILE STOCKS LAST',
      bgImage: '/hero-drop-lawn.svg'
    },
    {
      id: 'season',
      type: 'standard',
      badge: 'NEW SEASON',
      mainHeadline: 'THE HAVEN COLLECTION',
      extraBox: null,
      subText: 'Made for the ones who move different.',
      ctaText: 'SHOP THE DROP',
      ctaSub: null,
      bgImage: '/product-cream.svg'
    },
    {
      id: 'waffle',
      type: 'standard',
      badge: 'WAFFLE COLLECTION',
      mainHeadline: 'TEXTURE MEETS COMFORT',
      extraBox: null,
      subText: 'Premium 280 GSM texture, everyday ease.',
      ctaText: 'EXPLORE WAFFLE',
      ctaSub: null,
      bgImage: '/product-black.svg'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[index];

  return (
    <section className="hero relative h-[52vh] min-h-[420px] sm:min-h-[480px] md:min-h-[560px] max-h-[720px] overflow-hidden bg-[#0c0c0e] text-white select-none">
      {/* Background Graphic / Photo */}
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
        style={{
          backgroundImage: `url(${currentSlide.bgImage})`,
          filter:
            currentSlide.type === 'lawn-drop'
              ? 'brightness(0.95) contrast(1.05)'
              : 'brightness(0.38) contrast(1.1)'
        }}
      />

      {/* Atmospheric Vignette Scrim (Tailored for slide type) */}
      {currentSlide.type === 'lawn-drop' ? (
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/40 to-black/85 md:to-black/90 pointer-events-none" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60 pointer-events-none" />
      )}

      {/* Hero Slide 1: Exact layout matching user's reference */}
      {currentSlide.type === 'lawn-drop' ? (
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-8 md:px-14 flex items-center justify-end">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg text-right flex flex-col items-end pt-2 pb-6 animate-in fade-in duration-500">
            {/* Top rule & badge */}
            <div className="flex items-center gap-2 sm:gap-3 mb-1 text-neutral-300">
              <span className="w-4 sm:w-8 h-[1px] bg-neutral-300/60" />
              <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.3em] uppercase font-semibold text-neutral-200">
                LIMITED DROP
              </p>
              <span className="w-4 sm:w-8 h-[1px] bg-neutral-300/60" />
            </div>

            {/* Big 25% OFF in high-contrast serif */}
            <h1 className="font-serif font-normal text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.92] my-1 sm:my-2 drop-shadow-md">
              25% OFF
            </h1>

            {/* Outlined +10% OFF Box */}
            <div className="my-2 sm:my-3 px-4 sm:px-6 py-1.5 sm:py-2 border border-white/90 bg-black/40 backdrop-blur-xs shadow-sm">
              <span className="text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] text-white">
                +10% OFF
              </span>
            </div>

            {/* LIMITED TIME OFFER */}
            <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-neutral-300 font-semibold mb-3 sm:mb-4">
              LIMITED TIME OFFER
            </p>

            {/* SHOP THE DROP -> with WHILE STOCKS LAST */}
            <Link
              href="/shop"
              className="group inline-flex flex-col items-end text-white hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <span className="text-xs sm:text-sm font-bold tracking-[0.22em] uppercase flex items-center gap-1.5 border-b border-white pb-0.5 group-hover:border-neutral-300">
                SHOP THE DROP →
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-neutral-400 mt-1">
                WHILE STOCKS LAST
              </span>
            </Link>
          </div>
        </div>
      ) : (
        /* Alternate Slides: Centered Editorial */
        <div className="hero-overlay relative z-10 h-full flex flex-col justify-center items-center text-center px-6 max-w-4xl mx-auto">
          <p className="text-[11px] md:text-xs tracking-[0.35em] uppercase font-semibold text-neutral-300 mb-3 animate-in fade-in duration-500">
            {currentSlide.badge}
          </p>

          <h1 className="font-serif font-normal text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-white mb-4 animate-in fade-in duration-700 text-balance">
            {currentSlide.mainHeadline}
          </h1>

          <div className="hero-line w-20 md:w-32 h-[1px] bg-white/40 my-3" />

          <p className="sub text-xs md:text-sm tracking-[0.18em] text-neutral-300 max-w-md mb-8 font-light">
            {currentSlide.subText}
          </p>

          <Link
            href="/shop"
            className="btn light bg-white text-black hover:bg-neutral-200 transition-colors font-bold text-xs tracking-[0.2em] px-8 py-4 border border-white uppercase shadow-lg hover:shadow-white/10"
          >
            {currentSlide.ctaText}
          </Link>
        </div>
      )}

      {/* Navigation Arrows */}
      <button
        className="arrow left absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 bg-black/40 hover:bg-black/80 text-white flex items-center justify-center transition-colors backdrop-blur-xs z-20 cursor-pointer"
        onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        className="arrow right absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 bg-black/40 hover:bg-black/80 text-white flex items-center justify-center transition-colors backdrop-blur-xs z-20 cursor-pointer"
        onClick={() => setIndex((index + 1) % slides.length)}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicator Dots */}
      <div className="dots absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === index
                ? 'w-7 h-1.5 bg-white'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
            }`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
