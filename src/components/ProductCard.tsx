import React from 'react';
import { Product } from '../lib/products';
import { Link } from '../lib/router';
import { useCart } from '../lib/cart';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  p: Product;
}

export default function ProductCard({ p }: ProductCardProps) {
  const { add } = useCart();
  const sale =
    p.compareAtPrice && p.compareAtPrice > p.price
      ? Math.round((1 - p.price / p.compareAtPrice) * 100)
      : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      size: p.sizes[1] || p.sizes[0] || 'M',
      color: p.colors[0] || 'Black',
      quantity: 1,
      sku: p.sku
    });
  };

  return (
    <article className="product-card group relative flex flex-col bg-white">
      <Link href={`/products/${p.slug}`} className="block flex-1">
        <div className="product-image relative aspect-[3/4] w-full overflow-hidden bg-[#f4f4f4] border border-neutral-200/70">
          {sale > 0 && (
            <span className="badge absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase">
              SALE
            </span>
          )}

          {p.isNew && (
            <span className="absolute top-3 right-3 z-10 bg-white text-black border border-black/20 text-[10px] font-bold tracking-widest px-2 py-0.5 uppercase">
              NEW
            </span>
          )}

          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Quick Add Overlay on Desktop Hover */}
          <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex justify-center bg-gradient-to-t from-black/50 to-transparent">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-white/95 text-black hover:bg-white text-[11px] font-bold uppercase tracking-widest py-2.5 px-4 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Quick Add (M)</span>
            </button>
          </div>
        </div>

        <div className="product-info pt-3 pb-1">
          <p className="category text-[11px] tracking-widest text-neutral-500 uppercase font-medium mb-1">
            {p.category}
          </p>
          <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1 mb-1">
            {p.name}
          </h3>
          <div className="flex items-center gap-2 font-sans">
            <strong className="text-sm font-bold text-neutral-900">
              ₹{p.price.toLocaleString('en-IN')}
            </strong>
            {p.compareAtPrice && (
              <del className="text-xs text-neutral-400">
                ₹{p.compareAtPrice.toLocaleString('en-IN')}
              </del>
            )}
            {sale > 0 && (
              <em className="not-italic text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5">
                {sale}% OFF
              </em>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
