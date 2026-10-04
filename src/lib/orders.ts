import { CartItem } from './cart';

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'PRINTING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'COD' | 'FAILED';

export type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  payment: 'COD' | 'ONLINE';
};

export type Order = {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  trackingNumber: string;
  createdAt: string;
  podProvider: 'qikink' | 'getprintx';
  podOrderId: string;
  timeline: {
    status: string;
    timestamp: string;
    description: string;
    completed: boolean;
  }[];
};

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'HVN-84920193',
    customer: {
      name: 'Aarav Malhotra',
      email: 'aarav.m@example.com',
      phone: '9876543210',
      address: 'Flat 402, Skyline Residency, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      payment: 'ONLINE'
    },
    items: [
      {
        id: '1',
        name: 'Haven Waffle Tee — Black',
        price: 1299,
        image: '/product-black.svg',
        size: 'L',
        color: 'Black',
        quantity: 1,
        sku: 'HAVEN-WAFFLE-BLK'
      },
      {
        id: '3',
        name: 'The Escape Oversized Tee',
        price: 999,
        image: '/product-escape.svg',
        size: 'XL',
        color: 'Black',
        quantity: 1,
        sku: 'HAVEN-ESCAPE-BLK'
      }
    ],
    subtotal: 2298,
    discount: 0,
    shipping: 0,
    total: 2298,
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    trackingNumber: 'QK-77382910IN',
    createdAt: '2026-10-02T14:32:00Z',
    podProvider: 'qikink',
    podOrderId: 'QIKINK-HVN-84920193',
    timeline: [
      { status: 'ORDER PLACED', timestamp: 'Oct 02, 2:32 PM', description: 'Order verified and confirmed', completed: true },
      { status: 'PAYMENT CONFIRMED', timestamp: 'Oct 02, 2:33 PM', description: 'Razorpay payment verified', completed: true },
      { status: 'PRINTING & QC', timestamp: 'Oct 03, 10:15 AM', description: 'Garment woven & quality checked at print hub', completed: true },
      { status: 'SHIPPED', timestamp: 'Oct 04, 09:40 AM', description: 'Handed over to BlueDart express courier (QK-77382910IN)', completed: true },
      { status: 'OUT FOR DELIVERY', timestamp: 'Estimated Oct 06', description: 'Arriving at local delivery station', completed: false }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'HVN-72319401',
    customer: {
      name: 'Rohan Verma',
      email: 'rohan.v@example.com',
      phone: '9988776655',
      address: 'B-12, Sector 44',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      payment: 'COD'
    },
    items: [
      {
        id: '2',
        name: 'Haven Waffle Tee — Cream',
        price: 1199,
        image: '/product-cream.svg',
        size: 'M',
        color: 'Cream',
        quantity: 1,
        sku: 'HAVEN-WAFFLE-CRM'
      }
    ],
    subtotal: 1199,
    discount: 0,
    shipping: 0,
    total: 1199,
    status: 'PROCESSING',
    paymentStatus: 'COD',
    trackingNumber: 'QK-88912304IN',
    createdAt: '2026-10-03T18:10:00Z',
    podProvider: 'qikink',
    podOrderId: 'QIKINK-HVN-72319401',
    timeline: [
      { status: 'ORDER PLACED', timestamp: 'Oct 03, 6:10 PM', description: 'Order received with Cash on Delivery', completed: true },
      { status: 'ORDER CONFIRMED', timestamp: 'Oct 03, 6:15 PM', description: 'Customer phone confirmation verified', completed: true },
      { status: 'PROCESSING', timestamp: 'Oct 04, 08:30 AM', description: 'Bespoke waffle batch queued for cutting', completed: true },
      { status: 'SHIPPED', timestamp: 'Pending dispatch', description: 'Preparing package and shipping label', completed: false },
      { status: 'DELIVERED', timestamp: 'Estimated Oct 07', description: 'Collect ₹1,199 on delivery', completed: false }
    ]
  }
];

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return SEED_ORDERS;
  try {
    const raw = localStorage.getItem('haven-orders');
    if (!raw) {
      localStorage.setItem('haven-orders', JSON.stringify(SEED_ORDERS));
      return SEED_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_ORDERS;
  } catch {
    return SEED_ORDERS;
  }
}

export function saveOrder(order: Order): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredOrders();
    const updated = [order, ...current];
    localStorage.setItem('haven-orders', JSON.stringify(updated));
  } catch {
    // fallback
  }
}

export function findOrderByNumber(query: string): Order | undefined {
  const clean = query.trim().toUpperCase();
  const all = getStoredOrders();
  return all.find(
    o =>
      o.orderNumber.toUpperCase() === clean ||
      o.id.toUpperCase() === clean ||
      o.trackingNumber.toUpperCase() === clean
  );
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredOrders();
    const updated = current.map(o => {
      if (o.id === orderId || o.orderNumber === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    localStorage.setItem('haven-orders', JSON.stringify(updated));
  } catch {
    // fallback
  }
}
