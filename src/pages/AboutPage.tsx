import React from 'react';
import { Link } from '../lib/router';
import { useFounderPhoto } from '../lib/founder';
import { Sparkles, Compass, Shield, Feather } from 'lucide-react';

export default function AboutPage() {
  const { photo: founderPhoto } = useFounderPhoto();

  return (
    <main className="page about py-16 px-4 md:px-8 max-w-5xl mx-auto min-h-[75vh]">
      {/* Title */}
      <div className="text-center mb-16">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2">
          THE HAVEN STORY
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-neutral-900 tracking-tight leading-tight max-w-3xl mx-auto text-balance">
          Made for the ones who move different.
        </h1>
        <div className="w-16 h-[2px] bg-neutral-900 mx-auto mt-6" />
      </div>

      {/* Main Narrative */}
      <div className="space-y-8 text-neutral-700 text-sm md:text-base leading-relaxed max-w-3xl mx-auto font-light">
        <p>
          HAVEN is a modern clothing label born from an uncompromising perspective: that everyday garments should carry the weight, architecture, and enduring presence of luxury design, without artificial exclusivity or fleeting fast-fashion cycles.
        </p>
        <p>
          We began with a single question: <em>why do modern tees feel so disposable?</em> The answer led us down a rabbit hole of textile engineering—studying thermal waffle knits, custom combed cottons, drop-shoulder silhouettes, and tension-calibrated neck ribbing that refuses to warp after twenty washes.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-16 py-12 border-y border-neutral-200">
        <div className="space-y-2">
          <Feather className="w-5 h-5 text-neutral-900" />
          <h3 className="font-serif text-lg text-neutral-900 font-normal">280 GSM Waffle</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Deep dimensional knit structure designed for breathable tactile comfort across all climates.
          </p>
        </div>

        <div className="space-y-2">
          <Compass className="w-5 h-5 text-neutral-900" />
          <h3 className="font-serif text-lg text-neutral-900 font-normal">Architectural Fit</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Dropped shoulder points, boxy body proportions, and tailored sleeves that command presence.
          </p>
        </div>

        <div className="space-y-2">
          <Sparkles className="w-5 h-5 text-neutral-900" />
          <h3 className="font-serif text-lg text-neutral-900 font-normal">Zero Waste POD</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Crafted on demand to avoid landfill accumulation, overproduction, and dead warehouse stock.
          </p>
        </div>

        <div className="space-y-2">
          <Shield className="w-5 h-5 text-neutral-900" />
          <h3 className="font-serif text-lg text-neutral-900 font-normal">Enduring Build</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            High-density twin-needle stitching on all stress seams and pre-shrunk combed long-staple yarns.
          </p>
        </div>
      </div>

      {/* Founders Card */}
      <div className="founder-card bg-[#f4f4f5] border border-neutral-300 p-8 md:p-12 my-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="founder-image w-56 h-48 shrink-0 bg-neutral-200 shadow-md border border-neutral-300 overflow-hidden">
          <img
            src={founderPhoto}
            alt="Garvit &amp; Ankit — Co-Founders, HAVEN"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-3 text-center md:text-left">
          <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-500 font-semibold">
            THE VISIONARIES
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-neutral-900 font-normal">
            Garvit &amp; Ankit
          </h2>
          <p className="text-xs uppercase tracking-widest text-neutral-600 font-medium">
            Co-Founders &amp; Creative Directors, HAVEN
          </p>
          <p className="text-xs md:text-sm text-neutral-600 leading-relaxed pt-2 max-w-xl">
            &ldquo;HAVEN isn&apos;t just another streetwear imprint. We created it as a creative sanctuary for those who value quiet confidence, intentional craftsmanship, and heavyweight pieces that feel better the longer you live in them.&rdquo;
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-8">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold tracking-[0.2em] uppercase transition-colors"
        >
          EXPERIENCE THE COLLECTION
        </Link>
      </div>
    </main>
  );
}
