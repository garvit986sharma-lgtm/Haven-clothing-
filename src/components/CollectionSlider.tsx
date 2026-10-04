import React from 'react';
import { Link } from '../lib/router';
import { ArrowRight } from 'lucide-react';

const collectionsData = [
  {
    title: 'WAFFLE COLLECTION',
    subtitle: 'Texture meets comfort.',
    image: '/product-black.svg',
    category: 'Waffle Collection',
    tag: 'LIMITED DROP'
  },
  {
    title: 'OVERSIZED',
    subtitle: 'Room to move.',
    image: '/product-escape.svg',
    category: 'Oversized',
    tag: 'HEAVYWEIGHT'
  },
  {
    title: 'ESSENTIALS',
    subtitle: 'The everyday uniform.',
    image: '/product-white.svg',
    category: 'Essentials',
    tag: 'CORE UNIFORM'
  }
];

export default function CollectionSlider() {
  return (
    <section id="collections" className="section py-20 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="section-head text-center mb-12">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2">
          CURATED FOR YOU
        </p>
        <h2 className="font-serif text-3xl md:text-5xl font-normal text-neutral-900 tracking-tight">
          Shop Our Collection
        </h2>
      </div>

      <div className="collections grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory">
        {collectionsData.map(col => (
          <Link
            href={`/shop?category=${encodeURIComponent(col.category)}`}
            className="collection group relative h-[480px] md:h-[540px] overflow-hidden bg-neutral-950 text-white snap-center cursor-pointer block border border-neutral-800"
            key={col.title}
          >
            {/* Background image */}
            <img
              src={col.image}
              alt={col.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106 opacity-75 group-hover:opacity-85"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

            {/* Top Tag */}
            <div className="absolute top-5 left-5">
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-300 font-bold px-2.5 py-1 bg-black/60 border border-white/20 backdrop-blur-xs">
                {col.tag}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-semibold mb-1">
                {col.title}
              </p>
              <h3 className="font-serif text-2xl md:text-3xl text-white mb-4 leading-tight">
                {col.subtitle}
              </h3>
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-white group-hover:text-neutral-300 transition-colors">
                <span>SHOP NOW</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
