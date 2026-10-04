import React from 'react';
import { Link } from '../lib/router';
import { RefreshCw, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <main className="page py-16 px-4 md:px-8 max-w-4xl mx-auto min-h-[75vh]">
      <div className="page-title text-center mb-14">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2">
          CLIENT SATISFACTION
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-normal text-neutral-900 tracking-tight">
          Returns &amp; Exchanges
        </h1>
        <p className="text-xs text-neutral-500 tracking-wider mt-2">
          7-Day Complimentary Size Exchanges &amp; Hassle-Free Returns
        </p>
      </div>

      <div className="space-y-10 text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
        <div className="bg-neutral-50 p-6 md:p-8 border border-neutral-200 space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl text-neutral-900 font-normal">
            Our 7-Day Commitment
          </h2>
          <p>
            At HAVEN, our garments are engineered to offer an exceptional tactile experience and architectural fit. If your piece doesn&apos;t fit exactly how you envisioned, we will arrange a doorstep reverse pickup and deliver the requested size with zero friction.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif text-lg text-neutral-900 font-semibold uppercase tracking-wider text-xs">
            Return &amp; Exchange Conditions
          </h3>
          <ul className="space-y-2 list-none pl-0">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
              <span>Garments must be unworn, unwashed, and in pristine original state.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
              <span>All original HAVEN tags, brand labels, and protective polybags must remain attached.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
              <span>Request must be submitted within 7 calendar days of confirmed courier delivery.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif text-lg text-neutral-900 font-semibold uppercase tracking-wider text-xs">
            How to Initiate
          </h3>
          <p>
            Please email our concierge team at{' '}
            <a href="mailto:support@havenclothing.com" className="font-semibold text-neutral-900 underline">
              support@havenclothing.com
            </a>{' '}
            or WhatsApp our support line with your <strong>Order Number (e.g. HVN-XXXXXXXX)</strong>, photos of the tags, and reason for exchange or return. Our logistics partner will pick up the package within 48 hours.
          </p>
        </div>

        <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-neutral-900 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
          >
            Contact Returns Desk
          </Link>
          <Link
            href="/track-order"
            className="text-xs font-semibold text-neutral-700 hover:text-black uppercase tracking-wider"
          >
            Check Shipment Tracking →
          </Link>
        </div>
      </div>
    </main>
  );
}
