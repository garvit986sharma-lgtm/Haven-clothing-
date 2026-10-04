import React, { useState } from 'react';
import { useProducts } from '../lib/products';
import { useCart } from '../lib/cart';
import { Link, useRouter } from '../lib/router';
import ProductCard from '../components/ProductCard';
import { Check, ShieldCheck, Truck, RefreshCw, ChevronDown, ChevronUp, Ruler } from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export default function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const { products } = useProducts();
  const product = products.find(p => p.slug === slug);
  const { add } = useCart();
  const { navigate } = useRouter();

  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0] || 'Black');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState({
    desc: true,
    specs: false,
    shipping: false
  });

  if (!product) {
    return (
      <main className="py-24 text-center px-4">
        <h2 className="font-serif text-3xl text-neutral-900 mb-4">Product Not Found</h2>
        <p className="text-neutral-500 text-sm mb-6">The requested garment could not be located in our catalogue.</p>
        <Link href="/shop" className="px-6 py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest">
          Return to Shop
        </Link>
      </main>
    );
  }

  const sale =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity,
      sku: product.sku
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <main className="py-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-xs text-neutral-400 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-neutral-900">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-neutral-900">Shop</Link>
        <span>/</span>
        <span className="text-neutral-800 font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Gallery Left */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full bg-[#f4f4f4] border border-neutral-200 overflow-hidden">
            {sale > 0 && (
              <span className="badge absolute top-4 left-4 z-10 bg-black text-white text-[11px] font-bold tracking-widest px-3 py-1 uppercase">
                {sale}% OFF
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Alternate Views / Detail Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-neutral-100 border border-neutral-200 cursor-pointer overflow-hidden opacity-90 hover:opacity-100"
                >
                  <img src={img} alt={`${product.name} alternate view ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Module Right */}
        <div className="flex flex-col justify-start">
          <p className="text-xs tracking-[0.25em] uppercase text-neutral-500 font-semibold mb-2">
            {product.category}
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-900 leading-tight mb-4">
            {product.name}
          </h1>

          {/* Pricing */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-200">
            <strong className="text-2xl font-bold text-neutral-900">
              ₹{product.price.toLocaleString('en-IN')}
            </strong>
            {product.compareAtPrice && (
              <del className="text-base text-neutral-400">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </del>
            )}
            {sale > 0 && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                SAVE ₹{(product.compareAtPrice! - product.price).toLocaleString('en-IN')} ({sale}% OFF)
              </span>
            )}
            <span className="text-xs text-neutral-400 ml-auto">Inclusive of all taxes</span>
          </div>

          {/* Size Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Select Size: <span className="font-normal text-neutral-600">{selectedSize}</span>
              </label>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 underline cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] h-11 px-4 text-xs font-semibold uppercase tracking-wider border transition-colors cursor-pointer ${
                    selectedSize === size
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-900'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-neutral-300 h-12">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-sm hover:bg-neutral-100"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-sm hover:bg-neutral-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <span>ADD TO BAG · ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                )}
              </button>
            </div>

            <button
              onClick={() => {
                handleAddToCart();
                navigate('/checkout');
              }}
              className="w-full py-3.5 border border-neutral-900 text-neutral-900 hover:bg-neutral-50 text-xs font-bold tracking-[0.2em] uppercase transition-colors"
            >
              BUY IT NOW (EXPRESS CHECKOUT)
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 py-4 border-y border-neutral-200 text-center text-[11px] text-neutral-600 mb-8">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-neutral-700" />
              <span>Free Delivery &gt;₹999</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-neutral-200">
              <ShieldCheck className="w-4 h-4 text-neutral-700" />
              <span>COD Verified</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw className="w-4 h-4 text-neutral-700" />
              <span>7 Days Return</span>
            </div>
          </div>

          {/* Accordions */}
          <div className="border-t border-neutral-200 divide-y divide-neutral-200">
            {/* Description & Fit */}
            <div className="py-4">
              <button
                onClick={() => setOpenAccordions(s => ({ ...s, desc: !s.desc }))}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-neutral-900 text-left"
              >
                <span>Description &amp; Fit</span>
                {openAccordions.desc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordions.desc && (
                <div className="pt-3 text-xs leading-relaxed text-neutral-600 space-y-2">
                  <p>{product.description}</p>
                  {product.details && (
                    <ul className="list-disc pl-4 space-y-1 text-neutral-700">
                      <li><strong>Silhouette:</strong> {product.details.fit}</li>
                      <li><strong>Weight:</strong> {product.details.weight}</li>
                      <li><strong>Construction:</strong> Twin-needle hem and neck binding</li>
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Material & Care */}
            <div className="py-4">
              <button
                onClick={() => setOpenAccordions(s => ({ ...s, specs: !s.specs }))}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-neutral-900 text-left"
              >
                <span>Fabric &amp; Care</span>
                {openAccordions.specs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordions.specs && (
                <div className="pt-3 text-xs leading-relaxed text-neutral-600 space-y-2">
                  <p><strong>Composition:</strong> {product.details?.fabric || '100% Combed Heavy Cotton'}</p>
                  <p><strong>Care Instructions:</strong> {product.details?.care || 'Cold wash inside-out, do not iron directly on graphics.'}</p>
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="py-4">
              <button
                onClick={() => setOpenAccordions(s => ({ ...s, shipping: !s.shipping }))}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-neutral-900 text-left"
              >
                <span>Shipping &amp; Hassle-Free Returns</span>
                {openAccordions.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordions.shipping && (
                <div className="pt-3 text-xs leading-relaxed text-neutral-600 space-y-2">
                  <p>Dispatched within 24–48 hours via BlueDart / Delhivery Express.</p>
                  <p>Expected delivery: 3–5 business days across metros and tier-1 cities.</p>
                  <p>Free exchanges or returns within 7 days of delivery if unworn with original tags attached.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full p-6 border border-neutral-200 shadow-xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
              <h3 className="font-serif text-xl font-normal text-neutral-900">HAVEN Sizing Chart</h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-neutral-500 hover:text-black">
                ✕
              </button>
            </div>
            <div className="py-4">
              <p className="text-xs text-neutral-500 mb-4">
                Measurements in inches. All HAVEN garments are cut with an intentional relaxed/boxy streetwear silhouette.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 text-neutral-700">
                      <th className="p-2 border border-neutral-200">Size</th>
                      <th className="p-2 border border-neutral-200">Chest</th>
                      <th className="p-2 border border-neutral-200">Length</th>
                      <th className="p-2 border border-neutral-200">Shoulder</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-neutral-200 font-bold">S</td>
                      <td className="p-2 border border-neutral-200">40&quot;</td>
                      <td className="p-2 border border-neutral-200">28&quot;</td>
                      <td className="p-2 border border-neutral-200">19&quot;</td>
                    </tr>
                    <tr className="bg-neutral-50">
                      <td className="p-2 border border-neutral-200 font-bold">M</td>
                      <td className="p-2 border border-neutral-200">42&quot;</td>
                      <td className="p-2 border border-neutral-200">29&quot;</td>
                      <td className="p-2 border border-neutral-200">20&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-neutral-200 font-bold">L</td>
                      <td className="p-2 border border-neutral-200">44&quot;</td>
                      <td className="p-2 border border-neutral-200">30&quot;</td>
                      <td className="p-2 border border-neutral-200">21&quot;</td>
                    </tr>
                    <tr className="bg-neutral-50">
                      <td className="p-2 border border-neutral-200 font-bold">XL</td>
                      <td className="p-2 border border-neutral-200">46&quot;</td>
                      <td className="p-2 border border-neutral-200">31&quot;</td>
                      <td className="p-2 border border-neutral-200">22&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-neutral-200 font-bold">XXL</td>
                      <td className="p-2 border border-neutral-200">48&quot;</td>
                      <td className="p-2 border border-neutral-200">32&quot;</td>
                      <td className="p-2 border border-neutral-200">23&quot;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full mt-4 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Related Products */}
      <section className="mt-24 pt-16 border-t border-neutral-200">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-semibold mb-1">
            COMPLETE THE LOOK
          </p>
          <h2 className="font-serif text-3xl font-normal text-neutral-900">
            You May Also Admire
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
