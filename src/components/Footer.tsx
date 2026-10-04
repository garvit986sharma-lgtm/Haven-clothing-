import React from 'react';
import { Link } from '../lib/router';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] text-white pt-16 pb-12 px-6 md:px-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-12">
          <div>
            <div className="footer-brand font-black text-3xl md:text-5xl tracking-[-0.05em] uppercase">
              HAVEN
            </div>
            <p className="text-neutral-400 text-xs md:text-sm tracking-widest uppercase mt-2 font-light">
              Made for the ones who move different.
            </p>
          </div>
          <div className="text-xs text-neutral-500 tracking-wider">
            Premium Heavyweight Streetwear · Worldwide Shipping
          </div>
        </div>

        <div className="footer-grid grid grid-cols-2 md:grid-cols-4 gap-10 py-10 border-y border-neutral-900">
          {/* Column 1: SHOP */}
          <div className="flex flex-col gap-3">
            <b className="text-[11px] tracking-[0.25em] uppercase text-white font-bold mb-1">
              SHOP
            </b>
            <Link href="/shop" className="text-xs text-neutral-400 hover:text-white transition-colors">
              New Arrivals
            </Link>
            <Link
              href="/shop?category=Waffle%20Collection"
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Waffle Collection
            </Link>
            <Link
              href="/shop?category=Oversized"
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Oversized Drops
            </Link>
            <Link
              href="/shop?category=Essentials"
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Essentials
            </Link>
          </div>

          {/* Column 2: HELP */}
          <div className="flex flex-col gap-3">
            <b className="text-[11px] tracking-[0.25em] uppercase text-white font-bold mb-1">
              HELP
            </b>
            <Link href="/track-order" className="text-xs text-neutral-400 hover:text-white transition-colors">
              Track Order
            </Link>
            <Link href="/contact" className="text-xs text-neutral-400 hover:text-white transition-colors">
              Contact Support
            </Link>
            <Link href="/returns" className="text-xs text-neutral-400 hover:text-white transition-colors">
              Returns &amp; Exchanges
            </Link>
            <Link href="/account" className="text-xs text-neutral-400 hover:text-white transition-colors">
              My Account
            </Link>
          </div>

          {/* Column 3: LEGAL */}
          <div className="flex flex-col gap-3">
            <b className="text-[11px] tracking-[0.25em] uppercase text-white font-bold mb-1">
              LEGAL
            </b>
            <Link href="/privacy" className="text-xs text-neutral-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-neutral-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/refund" className="text-xs text-neutral-400 hover:text-white transition-colors">
              Refund &amp; Cancellation
            </Link>
          </div>

          {/* Column 4: FOUNDERS */}
          <div className="flex flex-col gap-2">
            <b className="text-[11px] tracking-[0.25em] uppercase text-white font-bold mb-1">
              FOUNDERS
            </b>
            <p className="text-xs font-semibold text-white">Garvit &amp; Ankit</p>
            <small className="text-[11px] text-neutral-400">Co-Founders &amp; Creative Directors</small>
            <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
              Curating architectural cuts and enduring fabrics for the discerning individual.
            </p>
          </div>
        </div>

        <div className="copyright pt-8 flex flex-col sm:flex-row items-center justify-between text-neutral-400 text-xs gap-4">
          <p>© {currentYear} HAVEN Clothing. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>COD Available Across India</span>
            <span>·</span>
            <span>Secured by SSL</span>
            <span>·</span>
            {/* Discreet staff entrance for admin only */}
            <Link
              href="/admin"
              className="text-neutral-600 hover:text-neutral-400 transition-colors text-[10px]"
              title="Staff Portal"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
