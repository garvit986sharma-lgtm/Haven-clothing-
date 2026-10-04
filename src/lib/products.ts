import { useState, useEffect } from 'react';

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images?: string[];
  description: string;
  details?: {
    fabric: string;
    fit: string;
    weight: string;
    care: string;
  };
  sizes: string[];
  colors: string[];
  sku: string;
  isNew?: boolean;
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'haven-waffle-black',
    name: 'Cooking In Dark Waffle Tee',
    category: 'Waffle Collection',
    price: 1299,
    compareAtPrice: 1925,
    image: '/product-black.svg',
    images: ['/product-black.svg', '/product-cream.svg'],
    description: 'Heavyweight long-sleeve waffle tee featuring "Cooking In Dark." chest typography and bespoke "Grow In Shadow" sleeve script. Crafted from 280 GSM thermal knit with dropped shoulders.',
    details: {
      fabric: '100% Combed Compact Cotton',
      fit: 'Relaxed Streetwear Drop-Shoulder',
      weight: '280 GSM Heavyweight Waffle Knit',
      care: 'Machine wash cold inside out, air dry in shade'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    sku: 'HAVEN-COOKING-BLK',
    isNew: true
  },
  {
    id: '2',
    slug: 'haven-waffle-cream',
    name: 'Lead Your Life Waffle Tee',
    category: 'Waffle Collection',
    price: 1199,
    compareAtPrice: 1925,
    image: '/product-cream.svg',
    images: ['/product-cream.svg', '/product-black.svg'],
    description: 'Natural unbleached cream long-sleeve waffle knit tee with "LEAD YOUR LIFE / DON\'T FOLLOW THE CROWD" print. Built with 280 GSM texture for all-day structure and drape.',
    details: {
      fabric: '100% Raw Unbleached Cotton',
      fit: 'Relaxed Streetwear Drop-Shoulder',
      weight: '280 GSM Heavyweight Waffle Knit',
      care: 'Gentle cycle, cold water, do not bleach'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Cream'],
    sku: 'HAVEN-LEAD-CRM',
    isNew: true
  },
  {
    id: '3',
    slug: 'haven-escape-tee',
    name: 'The Escape Oversized Tee',
    category: 'Oversized',
    price: 999,
    compareAtPrice: 1399,
    image: '/product-escape.svg',
    images: ['/product-escape.svg', '/product-white.svg'],
    description: 'Heavyweight streetwear tee featuring our high-definition editorial architectural back print: "HAVEN / THE ESCAPE / MOVE DIFFERENT". Pre-shrunk for an enduring boxy silhouette.',
    details: {
      fabric: '100% Ring-Spun Combed Cotton',
      fit: 'Boxy Oversized Silhouette',
      weight: '240 GSM Heavyweight Jersey',
      care: 'Iron on reverse side, do not tumble dry'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    sku: 'HAVEN-ESCAPE-BLK',
    isNew: false
  },
  {
    id: '4',
    slug: 'haven-essential-white',
    name: 'HAVEN Essential Tee — White',
    category: 'Essentials',
    price: 899,
    compareAtPrice: 1199,
    image: '/product-white.svg',
    images: ['/product-white.svg', '/product-black.svg'],
    description: 'The foundation of the modern uniform. Ultra-clean optical white tee featuring high-grade combed cotton with subtle micro-embroidered HAVEN mark.',
    details: {
      fabric: '100% Super-Combed Cotton',
      fit: 'Modern Regular / Tailored Box',
      weight: '220 GSM Dense Knit',
      care: 'Machine wash with like colors'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White'],
    sku: 'HAVEN-ESS-WHT',
    isNew: false
  }
];

export const products = DEFAULT_PRODUCTS;

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
  try {
    const raw = localStorage.getItem('haven-custom-products');
    if (!raw) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export function updateProduct(id: string, updates: Partial<Product>): Product[] {
  const current = getStoredProducts();
  const updated = current.map(p => {
    if (p.id === id) {
      return { ...p, ...updates };
    }
    return p;
  });

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('haven-custom-products', JSON.stringify(updated));
      window.dispatchEvent(new Event('haven-products-updated'));
    } catch {
      // storage unavailable
    }
  }

  return updated;
}

export function addProduct(newProduct: Product): Product[] {
  const current = getStoredProducts();
  const updated = [newProduct, ...current];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('haven-custom-products', JSON.stringify(updated));
      window.dispatchEvent(new Event('haven-products-updated'));
    } catch {
      // storage unavailable
    }
  }

  return updated;
}

export function deleteProduct(id: string): Product[] {
  const current = getStoredProducts();
  const updated = current.filter(p => p.id !== id);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('haven-custom-products', JSON.stringify(updated));
      window.dispatchEvent(new Event('haven-products-updated'));
    } catch {
      // storage unavailable
    }
  }

  return updated;
}

export function resetProducts(): Product[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('haven-custom-products');
      window.dispatchEvent(new Event('haven-products-updated'));
    } catch {
      // storage unavailable
    }
  }
  return DEFAULT_PRODUCTS;
}

export function getProduct(slug: string): Product | undefined {
  const all = getStoredProducts();
  return all.find(p => p.slug === slug);
}

export function useProducts(): {
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  resetProducts: () => void;
} {
  const [productList, setProductList] = useState<Product[]>(getStoredProducts);

  useEffect(() => {
    const handleUpdate = () => {
      setProductList(getStoredProducts());
    };

    window.addEventListener('haven-products-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('haven-products-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    products: productList,
    addProduct: (product) => {
      const res = addProduct(product);
      setProductList(res);
    },
    deleteProduct: (id) => {
      const res = deleteProduct(id);
      setProductList(res);
    },
    updateProduct: (id, updates) => {
      const res = updateProduct(id, updates);
      setProductList(res);
    },
    resetProducts: () => {
      const res = resetProducts();
      setProductList(res);
    }
  };
}
