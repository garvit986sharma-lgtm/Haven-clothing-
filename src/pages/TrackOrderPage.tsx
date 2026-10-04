import React, { useState, useEffect } from 'react';
import { useSearchParams } from '../lib/router';
import { findOrderByNumber, Order } from '../lib/orders';
import { Package, Truck, CheckCircle2, Clock, Search, MapPin } from 'lucide-react';

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [id, setId] = useState(initialId);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialId.trim()) {
      handleSearch(initialId);
    }
  }, [initialId]);

  const handleSearch = (queryId?: string) => {
    const target = queryId || id;
    if (!target.trim()) return;

    const found = findOrderByNumber(target);
    setSearchedOrder(found || null);
    setSearched(true);
  };

  return (
    <main className="page py-16 px-4 md:px-8 max-w-4xl mx-auto min-h-[70vh]">
      <div className="page-title text-center mb-10">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2">
          HAVEN LOGISTICS
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-normal text-neutral-900 tracking-tight">
          Track Your Order
        </h1>
        <p className="text-xs text-neutral-500 tracking-wider mt-2">
          Enter your HAVEN order ID (e.g. HVN-84920193) or airway bill number
        </p>
      </div>

      <div className="track max-w-xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row gap-2 shadow-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Order ID e.g. HVN-84920193"
              value={id}
              onChange={e => setId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full pl-11 pr-4 py-3.5 text-xs border border-neutral-300 focus:outline-none focus:border-neutral-900 uppercase tracking-wider"
            />
          </div>
          <button
            className="btn dark px-8 py-3.5 bg-[#080808] text-white hover:bg-neutral-800 text-xs font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
            onClick={() => handleSearch()}
          >
            TRACK ORDER
          </button>
        </div>

        {/* Quick Demo Hint */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Recent sample IDs:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setId('HVN-84920193');
                handleSearch('HVN-84920193');
              }}
              className="underline hover:text-neutral-900"
            >
              HVN-84920193
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setId('HVN-72319401');
                handleSearch('HVN-72319401');
              }}
              className="underline hover:text-neutral-900"
            >
              HVN-72319401
            </button>
          </div>
        </div>
      </div>

      {searched && (
        <div className="mt-8">
          {searchedOrder ? (
            <div className="timeline border border-neutral-200 bg-neutral-50 p-6 md:p-8 space-y-6">
              {/* Order Header Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-mono text-lg font-bold text-neutral-900">
                      {searchedOrder.orderNumber}
                    </h3>
                    <span className="text-[10px] font-bold tracking-widest px-2.5 py-0.5 uppercase bg-neutral-900 text-white">
                      {searchedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Courier: BlueDart / Delhivery Express · AWB #{searchedOrder.trackingNumber}
                  </p>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <p className="text-neutral-500">Recipient</p>
                  <p className="font-semibold text-neutral-900">{searchedOrder.customer.name}</p>
                  <p className="text-neutral-600">{searchedOrder.customer.city}, {searchedOrder.customer.state}</p>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="py-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-6">
                  Shipment Progress
                </h4>

                <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-300">
                  {searchedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Milestone Dot */}
                      <div
                        className={`absolute -left-6 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                          step.completed
                            ? 'border-neutral-900 text-neutral-900'
                            : 'border-neutral-300 text-neutral-300'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4 fill-neutral-900 text-white" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <p className={`text-xs font-bold uppercase tracking-wider ${step.completed ? 'text-neutral-900' : 'text-neutral-400'}`}>
                            {step.status}
                          </p>
                          <span className="text-[11px] text-neutral-500">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items in this order */}
              <div className="pt-6 border-t border-neutral-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
                  Package Contents ({searchedOrder.items.length} {searchedOrder.items.length === 1 ? 'item' : 'items'})
                </h4>
                <div className="divide-y divide-neutral-200">
                  {searchedOrder.items.map((item, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-13 object-cover bg-white border border-neutral-200" />
                        <div>
                          <p className="font-semibold text-neutral-900">{item.name}</p>
                          <p className="text-neutral-500">Size: {item.size} · Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium text-neutral-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-neutral-200 p-8 text-center bg-neutral-50/50">
              <Package className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="font-serif text-xl text-neutral-900 mb-1">
                Order not located
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto mb-4">
                We couldn&apos;t find an active order matching &ldquo;{id}&rdquo;. Please verify your order number in your confirmation email or SMS.
              </p>
              <div className="text-[11px] text-neutral-400">
                Need immediate help? Reach out to support at <a href="/contact" className="underline text-neutral-800">our contact desk</a>.
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
