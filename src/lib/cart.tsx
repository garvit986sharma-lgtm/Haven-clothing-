import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  sku: string;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  add: (item: CartItem) => void;
  remove: (id: string, size: string, color: string) => void;
  update: (id: string, size: string, color: string, q: number) => void;
  clear: () => void;
  subtotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  appliedDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  couponCode: string;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('haven-cart');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem('haven-cart', JSON.stringify(items));
    } catch {
      // storage unavailable
    }
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const appliedDiscount = useMemo(() => {
    if (discountPercent > 0) {
      return Math.round((subtotal * discountPercent) / 100);
    }
    return 0;
  }, [subtotal, discountPercent]);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'HAVEN10') {
      setCouponCode('HAVEN10');
      setDiscountPercent(10);
      return { success: true, message: '10% OFF applied successfully!' };
    }
    if (clean === 'FIRSTDROP') {
      setCouponCode('FIRSTDROP');
      setDiscountPercent(15);
      return { success: true, message: 'Welcome code: 15% OFF applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code' };
  };

  const add = (newItem: CartItem) => {
    setItems(current => {
      const idx = current.findIndex(
        v => v.id === newItem.id && v.size === newItem.size && v.color === newItem.color
      );
      if (idx < 0) {
        return [...current, newItem];
      }
      const updated = [...current];
      updated[idx] = {
        ...updated[idx],
        quantity: updated[idx].quantity + newItem.quantity
      };
      return updated;
    });
    setIsCartDrawerOpen(true);
  };

  const remove = (id: string, size: string, color: string) => {
    setItems(current =>
      current.filter(x => !(x.id === id && x.size === size && x.color === color))
    );
  };

  const update = (id: string, size: string, color: string, q: number) => {
    if (q <= 0) {
      remove(id, size, color);
      return;
    }
    setItems(current =>
      current.map(x =>
        x.id === id && x.size === size && x.color === color
          ? { ...x, quantity: q }
          : x
      )
    );
  };

  const clear = () => {
    setItems([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const value = useMemo(
    () => ({
      items,
      itemCount,
      add,
      remove,
      update,
      clear,
      subtotal,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      appliedDiscount,
      applyCoupon,
      couponCode
    }),
    [items, itemCount, subtotal, isCartDrawerOpen, appliedDiscount, couponCode]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be inside CartProvider');
  }
  return ctx;
};
