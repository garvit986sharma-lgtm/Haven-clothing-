import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts, Product } from '../lib/products';
import { useSearchParams, useRouter } from '../lib/router';
import { SlidersHorizontal } from 'lucide-react';

export default function ShopPage() {
  const { products } = useProducts();
  const searchParams = useSearchParams();
  const { navigate } = useRouter();
  const categoryFromUrl = searchParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [searchFilter, setSearchFilter] = useState('');

  // Keep state in sync if URL changes
  React.useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${encodeURIComponent(cat)}`);
    }
  };

  const filteredProducts = useMemo(() => {
    let list: Product[] = [...products];

    // Category filter
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Text search filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return list;
  }, [activeCategory, searchFilter, sortBy]);

  const categories = ['All', 'Waffle Collection', 'Oversized', 'Essentials'];

  return (
    <main className="page py-16 px-4 md:px-8 max-w-7xl mx-auto min-h-[70vh]">
      {/* Header */}
      <div className="page-title text-center mb-12">
        <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-2">
          THE CATALOGUE
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-normal text-neutral-900 tracking-tight">
          {activeCategory === 'All' ? 'All Pieces' : activeCategory}
        </h1>
        <p className="text-xs text-neutral-500 tracking-wider uppercase mt-2">
          Crafted with 240–280 GSM heavyweight cotton
        </p>
      </div>

      {/* Control Bar: Categories & Sorting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-neutral-200">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-colors cursor-pointer border ${
                activeCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter / Sort Actions */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter pieces..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-neutral-200 focus:outline-none focus:border-neutral-900 w-36 sm:w-48"
          />

          <div className="flex items-center gap-2 border border-neutral-200 px-3 py-2 bg-white">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="text-xs bg-transparent focus:outline-none text-neutral-800 cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center">
          <h3 className="font-serif text-2xl text-neutral-800 mb-2">No items found</h3>
          <p className="text-neutral-500 text-xs mb-6">
            Try adjusting your category filter or search keywords.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchFilter('');
              navigate('/shop');
            }}
            className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="text-right text-xs text-neutral-500 tracking-wider mb-4">
            Showing {filteredProducts.length} of {products.length} garments
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
