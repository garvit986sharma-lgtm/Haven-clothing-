import React from 'react';
import { usePathname } from '../lib/router';

export default function LegalPage() {
  const pathname = usePathname();

  let title = 'Privacy Policy';
  let subtitle = 'DATA INTEGRITY & USER PROTECTION';

  if (pathname === '/terms') {
    title = 'Terms of Service';
    subtitle = 'STORE POLICIES & CONTRACT OF SALE';
  } else if (pathname === '/refund') {
    title = 'Refund & Cancellation Policy';
    subtitle = 'SETTLEMENT TERMS & TIMELINES';
  }

  return (
    <main className="page py-16 px-4 md:px-8 max-w-4xl mx-auto min-h-[75vh]">
      <div className="page-title text-center mb-14">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2">
          {subtitle}
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-normal text-neutral-900 tracking-tight">
          {title}
        </h1>
        <p className="text-xs text-neutral-500 tracking-wider mt-2">
          Last revised: October 2026 · HAVEN Clothing Label
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
        {pathname === '/privacy' && (
          <>
            <section className="space-y-3">
              <h2 className="font-serif text-xl text-neutral-900 font-normal">1. Personal Information We Collect</h2>
              <p>
                When you visit the HAVEN website or place an order, we collect specific details necessary to fulfill your streetwear purchase, including your name, delivery address, phone number, email address, and order choices. Payment information is securely processed via 256-bit encrypted gateways and is never stored in plain text on our servers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-neutral-900 font-normal">2. Use of Your Information</h2>
              <p>
                We use this information exclusively to dispatch your orders through our certified print-on-demand fulfillment network (Qikink / GetPrintX), notify you of delivery status via SMS/email, and verify fraud prevention. We never sell, rent, or trade your data to third-party advertisers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-neutral-900 font-normal">3. Cookies &amp; Local Storage</h2>
              <p>
                We use minimal browser cookies and local storage strictly to preserve your active shopping bag items and track-order lookup histories across page reloads.
              </p>
            </section>
          </>
        )}

        {pathname === '/terms' && (
          <>
            <section className="space-y-3">
              <h2 className="font-serif text-xl text-neutral-900 font-normal">1. Acceptance of Terms</h2>
              <p>
                By navigating HAVEN Clothing or placing an order, you agree to be bound by these Terms of Service. All purchases represent a contract of sale governed by Indian commercial law.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-neutral-900 font-normal">2. Product Specifications &amp; Sizing</h2>
              <p>
                We strive for meticulous color accuracy and fabric representation across our product photography and descriptions. Minor variance (±0.5 inches in tailoring dimensions or subtle natural batch shade nuances) is intrinsic to heavyweight washed knitwear.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-neutral-900 font-normal">3. Intellectual Property</h2>
              <p>
                The name HAVEN, wordmarks, graphic typography, photographic assets, and original silhouette cuts are proprietary intellectual property of Garvit Sharma / HAVEN Clothing Label.
              </p>
            </section>
          </>
        )}

        {pathname === '/refund' && (
          <>
            <section className="space-y-3">
              <h2 className="font-serif text-xl text-neutral-900 font-normal">1. Refund Eligibility</h2>
              <p>
                Refunds are granted for unworn items returned within 7 days of delivery, or in the rare event of transit damage or manufacturing flaw verified by our quality control hub.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-neutral-900 font-normal">2. Settlement Timelines</h2>
              <p>
                Once returned merchandise is received and passed through twin-needle inspection at our hub, refunds are credited back to the original payment source (UPI/bank/card) within 5–7 business days. For Cash on Delivery orders, refunds are disbursed via direct bank transfer (NEFT/IMPS) or UPI handle provided by the client.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-neutral-900 font-normal">3. Cancellation Window</h2>
              <p>
                Orders may be cancelled free of charge prior to cutting/printing dispatch (typically within 4 hours of order placement). Once handed over to courier partners, cancellations must be handled via the standard 7-day return procedure.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
