import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../lib/cart';
import { Link } from '../lib/router';

export default function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    remove,
    update,
    subtotal
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = freeShippingThreshold - subtotal;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h3 className="font-serif text-xl tracking-tight text-neutral-900">Your Bag</h3>
            <span className="text-xs text-neutral-500">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-200 text-xs">
          {amountNeeded <= 0 ? (
            <p className="font-semibold text-emerald-800">
              ✓ You have unlocked FREE Express Shipping!
            </p>
          ) : (
            <p className="text-neutral-700">
              Add <span className="font-bold text-neutral-900">₹{amountNeeded.toLocaleString('en-IN')}</span> more to qualify for <span className="font-bold">FREE Shipping</span>
            </p>
          )}
          <div className="w-full bg-neutral-200 h-1.5 mt-2 rounded-full overflow-hidden">
            <div
              className="bg-neutral-900 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-neutral-100">
          {items.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif text-2xl text-neutral-900 mb-2">Your bag is empty.</p>
              <p className="text-neutral-500 text-xs max-w-xs mb-6">
                Discover modern minimalist essentials and waffle knit drops crafted for lasting presence.
              </p>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="px-6 py-3 bg-neutral-900 text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="pt-4 first:pt-0 flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-26 object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-semibold text-neutral-900 leading-snug">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => remove(item.id, item.size, item.color)}
                        className="text-neutral-400 hover:text-neutral-900 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Size: <span className="font-medium text-neutral-800">{item.size}</span> · Color: <span className="font-medium text-neutral-800">{item.color}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-neutral-300">
                      <button
                        onClick={() => update(item.id, item.size, item.color, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-sm hover:bg-neutral-100"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => update(item.id, item.size, item.color, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-sm hover:bg-neutral-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-bold text-neutral-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-neutral-200 bg-neutral-50">
            <div className="flex justify-between items-center text-sm mb-1 text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-neutral-500 mb-4">
              <span>Shipping</span>
              <span>{subtotal >= 999 ? 'FREE' : '₹79 calculated at checkout'}</span>
            </div>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-4 bg-neutral-900 text-white text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-2.5 text-center text-xs font-semibold text-neutral-700 hover:text-neutral-900 underline block"
              >
                View Full Shopping Bag
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
