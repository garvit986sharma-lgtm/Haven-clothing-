import React, { useState } from 'react';
import { Link } from '../lib/router';
import { useCart } from '../lib/cart';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    subtotal,
    remove,
    update,
    clear,
    appliedDiscount,
    applyCoupon,
    couponCode
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const shippingCost = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const finalTotal = Math.max(0, subtotal - appliedDiscount + shippingCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      const res = applyCoupon(inputCoupon);
      setCouponFeedback(res);
    }
  };

  return (
    <main className="page py-16 px-4 md:px-8 max-w-7xl mx-auto min-h-[75vh]">
      <div className="page-title text-center mb-12">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2">
          YOUR HAVEN
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-normal text-neutral-900 tracking-tight">
          Shopping Bag
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="empty max-w-md mx-auto text-center py-20 px-6 border border-neutral-200 bg-neutral-50/50">
          <div className="w-16 h-16 rounded-full bg-neutral-200/60 flex items-center justify-center text-neutral-500 mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl text-neutral-900 mb-2">Your bag is empty.</h2>
          <p className="text-neutral-500 text-xs mb-8 leading-relaxed">
            There are no garments currently in your bag. Explore our latest drops and heavyweight staples.
          </p>
          <Link
            href="/shop"
            className="btn dark inline-flex items-center justify-center gap-2 bg-[#080808] text-white hover:bg-neutral-800 px-8 py-3.5 text-xs font-bold tracking-[0.2em] uppercase transition-colors"
          >
            <span>SHOP THE COLLECTION</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="cart-layout grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-6xl mx-auto">
          {/* Items Column */}
          <div className="lg:col-span-8 divide-y divide-neutral-200">
            <div className="flex justify-between items-center pb-4 text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              <span>Items ({items.length})</span>
              <button
                onClick={clear}
                className="text-neutral-400 hover:text-neutral-900 underline text-xs"
              >
                Clear Bag
              </button>
            </div>

            {items.map(x => (
              <div
                className="cart-item py-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                key={`${x.id}-${x.size}-${x.color}`}
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={x.image}
                    alt={x.name}
                    className="w-20 sm:w-24 h-26 sm:h-32 object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-neutral-900 mb-1">
                      {x.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mb-2">
                      Size: <span className="font-medium text-neutral-800">{x.size}</span> · Color: <span className="font-medium text-neutral-800">{x.color}</span>
                    </p>
                    <strong className="text-sm font-bold text-neutral-900">
                      ₹{x.price.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-center">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-neutral-300">
                    <button
                      onClick={() => update(x.id, x.size, x.color, x.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-sm hover:bg-neutral-100 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-9 text-center text-xs font-semibold">
                      {x.quantity}
                    </span>
                    <button
                      onClick={() => update(x.id, x.size, x.color, x.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-sm hover:bg-neutral-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm font-bold text-neutral-900 min-w-[70px] text-right">
                    ₹{(x.price * x.quantity).toLocaleString('en-IN')}
                  </span>

                  <button
                    onClick={() => remove(x.id, x.size, x.color)}
                    className="text-neutral-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <Link
                href="/shop"
                className="text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 flex items-center gap-2"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary Column */}
          <aside className="lg:col-span-4 summary bg-neutral-50 p-6 md:p-8 border border-neutral-200 h-fit space-y-6">
            <h2 className="font-serif text-2xl text-neutral-900 font-normal">
              Order Summary
            </h2>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Promo code (e.g. HAVEN10)"
                  value={inputCoupon}
                  onChange={e => setInputCoupon(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-neutral-300 uppercase tracking-wider focus:outline-none focus:border-neutral-900 bg-white"
                />
                <button
                  type="submit"
                  className="px-4 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponFeedback && (
                <p className={`text-xs ${couponFeedback.success ? 'text-emerald-700' : 'text-red-600'}`}>
                  {couponFeedback.message}
                </p>
              )}
              {couponCode && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Coupon active: {couponCode}</span>
                </div>
              )}
            </form>

            <div className="divide-y divide-neutral-200 text-xs space-y-3 pt-2">
              <div className="flex justify-between text-neutral-600 pt-2">
                <span>Subtotal</span>
                <b className="font-semibold text-neutral-900">₹{subtotal.toLocaleString('en-IN')}</b>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 pt-3">
                  <span>Discount</span>
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
                <span>Total</span>
                <span className="font-sans">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn dark full w-full py-4 bg-[#080808] hover:bg-neutral-800 text-white text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md block text-center"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-neutral-700" />
              <span>Cash on Delivery &amp; UPI / Cards Supported</span>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
