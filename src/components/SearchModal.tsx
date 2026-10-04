import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useProducts, Product } from '../lib/products';
import { Link } from '../lib/router';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results: Product[] = query.trim()
    ? products.filter(
        p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm transition-opacity">
      <div
        className="w-full max-w-2xl bg-[#09090b] text-white border border-neutral-800 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-2 transition-colors"
          aria-label="Close search"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="text-[10px] tracking-[4px] uppercase text-neutral-400 mb-2 font-semibold">
          Search HAVEN
        </p>

        <div className="relative border-b border-neutral-700 pb-3 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by collection, fit, color..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-lg text-white placeholder-neutral-500 focus:outline-none font-sans"
          />
        </div>

        {query.trim() === '' ? (
          <div className="mt-6">
            <p className="text-xs text-neutral-500 tracking-wider uppercase mb-3">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {['Waffle Collection', 'Oversized', 'Heavyweight', 'Cream', 'Black'].map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 text-xs text-neutral-300 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className="mt-6 max-h-[60vh] overflow-y-auto divide-y divide-neutral-900">
            <p className="text-xs text-neutral-500 tracking-wider uppercase mb-3">
              {results.length} {results.length === 1 ? 'Result' : 'Results'} Found
            </p>
            {results.map(product => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 py-3 hover:bg-neutral-900/60 px-2 transition-colors group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-18 object-cover bg-neutral-900 border border-neutral-800"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white group-hover:text-neutral-300">
                    {product.name}
                  </h4>
                  <p className="text-xs text-neutral-400">{product.category}</p>
                  <p className="text-xs text-white font-medium mt-1">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-neutral-400 text-sm">No pieces found matching &ldquo;{query}&rdquo;</p>
            <p className="text-neutral-600 text-xs mt-1">Try searching for &lsquo;Waffle&rsquo;, &lsquo;Oversized&rsquo;, or &lsquo;Essential&rsquo;.</p>
          </div>
        )}
      </div>
    </div>
  );
}
