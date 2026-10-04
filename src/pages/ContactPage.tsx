import React, { useState } from 'react';
import { Mail, MessageSquare, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    orderNumber: '',
    topic: 'Order Status & Tracking',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="page py-16 px-4 md:px-8 max-w-6xl mx-auto min-h-[75vh]">
      <div className="page-title text-center mb-14">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2">
          CLIENT CONCIERGE
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-normal text-neutral-900 tracking-tight">
          Contact HAVEN
        </h1>
        <p className="text-xs text-neutral-500 tracking-wider mt-2">
          We answer all inquiries within 24 business hours
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
        {/* Contact Info Left */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <h3 className="font-serif text-2xl text-neutral-900 font-normal">
              Direct Assistance
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Whether you need sizing advice on our waffle cuts or status updates on your custom shipment, our team is at your disposal.
            </p>
          </div>

          <div className="space-y-6 text-xs text-neutral-700">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-neutral-900 mt-0.5" />
              <div>
                <b className="block text-neutral-900 uppercase tracking-wider text-[11px]">Email Support</b>
                <a href="mailto:support@havenclothing.com" className="text-neutral-600 hover:text-black underline">
                  support@havenclothing.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-neutral-900 mt-0.5" />
              <div>
                <b className="block text-neutral-900 uppercase tracking-wider text-[11px]">WhatsApp Concierge</b>
                <span className="text-neutral-600">+91 98765 43210 (Mon–Sat, 10 AM – 7 PM IST)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-neutral-900 mt-0.5" />
              <div>
                <b className="block text-neutral-900 uppercase tracking-wider text-[11px]">Studio Operational Hours</b>
                <span className="text-neutral-600">Monday to Friday: 10:00 – 19:00 IST</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-neutral-900 mt-0.5" />
              <div>
                <b className="block text-neutral-900 uppercase tracking-wider text-[11px]">Fulfillment Studio</b>
                <span className="text-neutral-600">HAVEN Apparel Labs, Sector 44, New Delhi NCR, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Right */}
        <div className="lg:col-span-7 bg-neutral-50 p-6 sm:p-8 border border-neutral-200">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl text-neutral-900 font-normal">
                Message Received
              </h3>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                Thank you for getting in touch, {form.name}. Our concierge team has received your ticket and will respond via {form.email} promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-semibold mb-1">
                  Your Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-semibold mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-semibold mb-1">
                    Order Reference (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HVN-84920193"
                    value={form.orderNumber}
                    onChange={e => setForm({ ...form, orderNumber: e.target.value })}
                    className="w-full px-4 py-3 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-semibold mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={form.topic}
                  onChange={e => setForm({ ...form, topic: e.target.value })}
                  className="w-full px-4 py-3 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-white cursor-pointer"
                >
                  <option>Order Status &amp; Tracking</option>
                  <option>Sizing &amp; Fit Recommendation</option>
                  <option>Exchange or Return Request</option>
                  <option>Wholesale &amp; Editorial Press</option>
                  <option>Other Question</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-700 font-semibold mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist you?"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
              >
                SUBMIT INQUIRY
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
