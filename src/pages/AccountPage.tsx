import React, { useState, useEffect } from 'react';
import { getStoredOrders, Order } from '../lib/orders';
import { Link, useRouter } from '../lib/router';
import { User, Package, MapPin, ExternalLink, ChevronRight } from 'lucide-react';

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { navigate } = useRouter();

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  return (
    <main className="page py-16 px-4 md:px-8 max-w-6xl mx-auto min-h-[75vh]">
      <div className="page-title text-center mb-14">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2">
          CLIENT PORTAL
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-normal text-neutral-900 tracking-tight">
          My Account
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Profile Details Left */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-50 p-6 border border-neutral-200 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
              <div className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                GS
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 text-sm">Garvit Sharma</h3>
                <p className="text-xs text-neutral-500">garvit986sharma@gmail.com</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-neutral-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                <div>
                  <b className="text-neutral-900 block uppercase tracking-wider text-[10px]">Saved Delivery Address</b>
                  <span>B-12, Sector 44, New Delhi NCR, 110001, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 text-white p-6 space-y-3">
            <h4 className="font-serif text-lg font-normal">Need assistance?</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Reach our concierge regarding returns, size exchanges, or shipment updates.
            </p>
            <Link
              href="/contact"
              className="inline-block pt-2 text-xs font-bold uppercase tracking-widest text-white underline hover:text-neutral-300"
            >
              Contact Concierge →
            </Link>
          </div>
        </div>

        {/* Order History Right */}
        <div className="lg:col-span-8">
          <div className="border border-neutral-200 bg-white">
            <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-2xl text-neutral-900 font-normal">
                  Order History
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Track and review your recent drops and purchases
                </p>
              </div>
              <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-3 py-1">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-neutral-700">No orders placed yet</p>
                <p className="text-xs text-neutral-500 mt-1 mb-6">Explore our latest drops to initiate your wardrobe.</p>
                <Link
                  href="/shop"
                  className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {orders.map(order => (
                  <div key={order.id} className="p-6 space-y-4 hover:bg-neutral-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-neutral-900 text-sm">
                          {order.orderNumber}
                        </span>
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-900 text-white'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="text-xs text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-neutral-500 mb-1">Items ({order.items.length}):</p>
                        <ul className="space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="font-medium text-neutral-800">
                              {item.name} ({item.size}) × {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="sm:text-right space-y-1">
                        <p className="text-neutral-500">Total Paid:</p>
                        <p className="text-sm font-bold text-neutral-900">
                          ₹{order.total.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Mode: {order.paymentStatus === 'COD' ? 'Cash on Delivery' : 'Paid Online'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center border-t border-neutral-100 text-xs">
                      <span className="text-neutral-500 text-[11px]">
                        AWB #{order.trackingNumber}
                      </span>
                      <button
                        onClick={() => navigate(`/track-order?id=${order.orderNumber}`)}
                        className="text-neutral-900 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Live Tracking</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
