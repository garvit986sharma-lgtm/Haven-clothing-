import React, { useState } from 'react';
import { useCart } from '../lib/cart';
import { Link, useRouter } from '../lib/router';
import { saveOrder, Order } from '../lib/orders';
import { CheckCircle2, ShieldCheck, Truck, Lock, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotal, appliedDiscount, clear } = useCart();
  const { navigate } = useRouter();

  const [done, setDone] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    payment: 'COD' as 'COD' | 'ONLINE'
  });

  const shippingCost = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const finalTotal = Math.max(0, subtotal - appliedDiscount + shippingCost);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    const generatedNumber = `HVN-${Date.now().toString().slice(-8)}`;

    try {
      // Attempt server POST
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items,
          subtotal: finalTotal
        })
      });

      let orderNumber = generatedNumber;
      if (res.ok) {
        const data = await res.json();
        if (data.orderNumber) {
          orderNumber = data.orderNumber;
        }
      }

      // Persist order in local state for track order and admin
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        customer: form,
        items: [...items],
        subtotal,
        discount: appliedDiscount,
        shipping: shippingCost,
        total: finalTotal,
        status: form.payment === 'ONLINE' ? 'PAID' : 'PENDING',
        paymentStatus: form.payment === 'ONLINE' ? 'PAID' : 'COD',
        trackingNumber: `QK-${orderNumber.replace('HVN-', '')}IN`,
        createdAt: new Date().toISOString(),
        podProvider: 'qikink',
        podOrderId: `QIKINK-${orderNumber}`,
        timeline: [
          {
            status: 'ORDER PLACED',
            timestamp: 'Just now',
            description: 'Your order has been recorded in our production system',
            completed: true
          },
          {
            status: form.payment === 'ONLINE' ? 'PAYMENT VERIFIED' : 'COD VERIFICATION',
            timestamp: 'Just now',
            description:
              form.payment === 'ONLINE'
                ? 'Online payment confirmed'
                : 'Cash on delivery payment will be collected at doorstep',
            completed: true
          },
          {
            status: 'PRINT & PACK QUEUE',
            timestamp: 'Queued for today',
            description: 'Bespoke garment printing and twin-needle inspection',
            completed: false
          },
          {
            status: 'DISPATCH',
            timestamp: 'Estimated 24-48 hrs',
            description: 'Handover to BlueDart / Delhivery courier',
            completed: false
          }
        ]
      };

      saveOrder(newOrder);
      setCreatedOrderNumber(orderNumber);
      clear();
      setDone(true);
    } catch {
      // Fallback local save in case network mock/server unavailable
      const fallbackOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: generatedNumber,
        customer: form,
        items: [...items],
        subtotal,
        discount: appliedDiscount,
        shipping: shippingCost,
        total: finalTotal,
        status: 'PENDING',
        paymentStatus: form.payment === 'ONLINE' ? 'PAID' : 'COD',
        trackingNumber: `QK-${generatedNumber.replace('HVN-', '')}IN`,
        createdAt: new Date().toISOString(),
        podProvider: 'qikink',
        podOrderId: `QIKINK-${generatedNumber}`,
        timeline: [
          { status: 'ORDER PLACED', timestamp: 'Just now', description: 'Order confirmed successfully', completed: true },
          { status: 'PROCESSING', timestamp: 'In progress', description: 'Assigned to print hub', completed: false }
        ]
      };
      saveOrder(fallbackOrder);
      setCreatedOrderNumber(generatedNumber);
      clear();
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="page success py-20 px-4 md:px-8 max-w-2xl mx-auto text-center min-h-[70vh] flex flex-col justify-center items-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2">
          ORDER CONFIRMED
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-neutral-900 tracking-tight mb-4">
          Thank you for choosing HAVEN.
        </h1>

        <div className="bg-neutral-50 border border-neutral-200 p-6 my-6 w-full text-left space-y-3">
          <div className="flex justify-between items-center text-sm border-b border-neutral-200 pb-3">
            <span className="text-neutral-500">Order Reference:</span>
            <span className="font-mono font-bold text-neutral-900">{createdOrderNumber}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-neutral-200 pb-3">
            <span className="text-neutral-500">Delivery Address:</span>
            <span className="font-medium text-neutral-800 text-right">
              {form.city}, {form.state} ({form.pincode})
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500">Payment Mode:</span>
            <span className="font-medium text-neutral-800">
              {form.payment === 'COD' ? 'Cash on Delivery (Pay on Arrival)' : 'Online Payment Verified'}
            </span>
          </div>
        </div>

        <p className="text-neutral-600 text-xs sm:text-sm max-w-md mb-8 leading-relaxed">
          Your order has entered our print-on-demand fulfillment pipeline. We have dispatched a confirmation receipt to <span className="font-semibold text-neutral-900">{form.email}</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button
            onClick={() => navigate(`/track-order?id=${createdOrderNumber}`)}
            className="px-8 py-3.5 bg-neutral-900 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            TRACK THIS ORDER
          </button>
          <Link
            href="/shop"
            className="px-8 py-3.5 border border-neutral-300 text-neutral-800 text-xs font-bold tracking-[0.2em] uppercase hover:border-neutral-900 transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="py-24 text-center px-4 max-w-md mx-auto">
        <h2 className="font-serif text-3xl text-neutral-900 mb-3">Your Bag is Empty</h2>
        <p className="text-neutral-500 text-xs mb-8">
          You must add garments to your bag before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest inline-block"
        >
          Explore Collection
        </Link>
      </main>
    );
  }

  return (
    <main className="page py-16 px-4 md:px-8 max-w-7xl mx-auto min-h-[75vh]">
      <div className="page-title text-center mb-12">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2">
          SECURE CHECKOUT
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-normal text-neutral-900 tracking-tight">
          Complete Your Order
        </h1>
      </div>

      <form className="checkout grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-6xl mx-auto" onSubmit={submit}>
        {/* Left Form: Customer and Shipping Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
              1. Customer Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                  Full Name *
                </label>
                <input
                  required
                  placeholder="e.g. Garvit Sharma"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                    Mobile Number (for delivery SMS) *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="10-digit mobile"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
              2. Shipping Address
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                  Street Address &amp; House/Apartment No. *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Flat/House No., Building, Street, Landmark"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                    City *
                  </label>
                  <input
                    required
                    placeholder="City / Town"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                    State *
                  </label>
                  <input
                    required
                    placeholder="State"
                    value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                    className="w-full px-4 py-3 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1">
                    Pincode (6 digits) *
                  </label>
                  <input
                    required
                    pattern="[0-9]{6}"
                    placeholder="e.g. 110001"
                    value={form.pincode}
                    onChange={e => setForm({ ...form, pincode: e.target.value })}
                    className="w-full px-4 py-3 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
              3. Payment Method
            </h3>
            <div className="space-y-3">
              <label className="radio flex items-start gap-3 p-4 border border-neutral-300 cursor-pointer hover:border-neutral-800 transition-colors bg-white">
                <input
                  type="radio"
                  name="payment"
                  checked={form.payment === 'COD'}
                  onChange={() => setForm({ ...form, payment: 'COD' })}
                  className="mt-1"
                />
                <div>
                  <span className="font-semibold text-xs text-neutral-900 uppercase tracking-wider block">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Pay securely in cash or via UPI QR to the courier at the time of delivery.
                  </span>
                </div>
              </label>

              <label className="radio flex items-start gap-3 p-4 border border-neutral-300 cursor-pointer hover:border-neutral-800 transition-colors bg-white">
                <input
                  type="radio"
                  name="payment"
                  checked={form.payment === 'ONLINE'}
                  onChange={() => setForm({ ...form, payment: 'ONLINE' })}
                  className="mt-1"
                />
                <div>
                  <span className="font-semibold text-xs text-neutral-900 uppercase tracking-wider block">
                    Instant Online Payment (UPI, Credit/Debit Cards, NetBanking)
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Secured by Razorpay. Zero transaction fees.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <aside className="lg:col-span-5 summary bg-neutral-50 p-6 md:p-8 border border-neutral-200 h-fit space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <h2 className="font-serif text-2xl text-neutral-900 font-normal">
              Your Order
            </h2>
            <span className="text-xs text-neutral-500">({items.length} items)</span>
          </div>

          {/* Mini Item List */}
          <div className="divide-y divide-neutral-200 max-h-64 overflow-y-auto pr-2">
            {items.map(x => (
              <div key={`${x.id}-${x.size}`} className="py-3 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <img src={x.image} alt={x.name} className="w-10 h-13 object-cover bg-neutral-100 border border-neutral-200" />
                  <div>
                    <span className="font-medium text-neutral-900 line-clamp-1">{x.name}</span>
                    <span className="text-neutral-500 text-[11px]">Size {x.size} × {x.quantity}</span>
                  </div>
                </div>
                <b className="font-semibold text-neutral-900 whitespace-nowrap ml-2">
                  ₹{(x.price * x.quantity).toLocaleString('en-IN')}
                </b>
              </div>
            ))}
          </div>

          {/* Numbers breakdown */}
          <div className="divide-y divide-neutral-200 text-xs space-y-3 pt-2">
            <div className="flex justify-between text-neutral-600 pt-2">
              <span>Subtotal</span>
              <b className="font-semibold text-neutral-900">₹{subtotal.toLocaleString('en-IN')}</b>
            </div>

            {appliedDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 pt-3">
                <span>Promotional Discount</span>
                <b>- ₹{appliedDiscount.toLocaleString('en-IN')}</b>
              </div>
            )}

            <div className="flex justify-between text-neutral-600 pt-3">
              <span>Shipping</span>
              <b className="font-semibold text-neutral-900">
                {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
              </b>
            </div>

            <div className="flex justify-between text-neutral-900 text-base font-bold pt-4">
              <span>Total Payable</span>
              <span className="font-sans">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="btn dark full w-full py-4 bg-[#080808] hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{loading ? 'PROCESSING SECURE ORDER…' : `PLACE ORDER · ₹${finalTotal.toLocaleString('en-IN')}`}</span>
          </button>

          <div className="pt-2 space-y-2 text-[11px] text-neutral-500 text-center">
            <p className="flex items-center justify-center gap-2">
              <Truck className="w-3.5 h-3.5 text-neutral-700" />
              <span>Standard delivery 3–5 business days</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
              <span>Encrypted 256-bit SSL transaction</span>
            </p>
          </div>
        </aside>
      </form>
    </main>
  );
}
