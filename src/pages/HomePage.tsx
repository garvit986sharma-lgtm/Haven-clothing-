import React, { useState } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CollectionSlider from '../components/CollectionSlider';
import { useProducts } from '../lib/products';
import { useFounderPhoto } from '../lib/founder';
import { Link } from '../lib/router';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { products } = useProducts();
  const { photo: founderPhoto } = useFounderPhoto();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Carousel */}
      <Hero />

      {/* Promo Marquee Ribbon */}
      <div className="promo bg-[#090909] text-white py-3.5 px-4 text-center overflow-x-auto whitespace-nowrap border-y border-neutral-800 tracking-[0.25em] text-[11px] font-medium uppercase">
        <div className="flex items-center justify-center gap-6 md:gap-12 min-w-max mx-auto text-neutral-300">
          <span className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-neutral-400" />
            FREE SHIPPING ABOVE ₹999
          </span>
          <span className="text-neutral-600">•</span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            COD AVAILABLE PAN-INDIA
          </span>
          <span className="text-neutral-600">•</span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            280 GSM PREMIUM KNIT
          </span>
          <span className="text-neutral-600">•</span>
          <span className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
            7-DAY HASSLE-FREE RETURNS
          </span>
        </div>
      </div>

      {/* Fresh From Haven / New Arrivals */}
      <section className="section py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="section-head text-center mb-14">
          <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2">
            FRESH FROM HAVEN
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-normal text-neutral-900 tracking-tight">
            New Arrivals
          </h2>
          <div className="w-12 h-[2px] bg-neutral-900 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
          {products.slice(0, 4).map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>

        <div className="center text-center mt-14">
          <Link
            className="btn dark inline-flex items-center justify-center gap-3 bg-[#080808] text-white hover:bg-neutral-800 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase border border-neutral-900 transition-colors shadow-sm"
            href="/shop"
          >
            <span>VIEW ALL PRODUCTS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Collections Showcase */}
      <CollectionSlider />

      {/* The Story & Founders Section: Garvit & Ankit */}
      <section className="founder bg-[#f4f4f5] py-20 md:py-28 px-6 md:px-14 border-y border-neutral-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-6">
            <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold">
              THE STORY
            </p>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-neutral-900 font-normal leading-[1.08] tracking-tight">
              Built with intention.
            </h2>
            <p className="text-neutral-600 leading-relaxed text-sm md:text-base font-light">
              HAVEN is a modern clothing label co-founded by Garvit and Ankit, focused on clean architectural silhouettes, tactile thermal textures, and pieces that outlive fleeting seasonal hype. We build enduring garments engineered to hold their drape, weight, and presence every single day.
            </p>
            <div className="pt-4 border-t border-neutral-300">
              <h3 className="font-serif text-2xl text-neutral-900 font-normal">
                Garvit &amp; Ankit
              </h3>
              <p className="text-xs uppercase tracking-widest text-neutral-500 mt-1">
                Co-Founders, HAVEN
              </p>
            </div>
          </div>

          <div className="founder-image relative aspect-[3/4] sm:aspect-square max-w-md mx-auto w-full bg-[#e4e4e7] overflow-hidden shadow-xl border border-neutral-300">
            <img
              src={founderPhoto}
              alt="Garvit &amp; Ankit — Co-Founders, HAVEN"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter py-20 px-6 text-center max-w-3xl mx-auto">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2">
          JOIN THE HAVEN COMMUNITY
        </p>
        <h2 className="font-serif text-3xl md:text-5xl font-normal text-neutral-900 tracking-tight mb-4">
          Stay in the loop.
        </h2>
        <p className="text-neutral-600 text-xs md:text-sm max-w-md mx-auto mb-8 font-light">
          Get VIP early access to secret drops, archival waffle restocks, and private studio releases.
        </p>

        {subscribed ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 max-w-md mx-auto flex items-center justify-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-semibold tracking-wider uppercase">
              You are on the HAVEN VIP list. Check your inbox soon.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto shadow-sm">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3.5 border border-neutral-300 border-r-0 text-sm focus:outline-none focus:border-neutral-900"
            />
            <button
              type="submit"
              className="px-6 bg-black text-white hover:bg-neutral-800 font-bold text-sm tracking-widest flex items-center justify-center transition-colors cursor-pointer"
            >
              →
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
