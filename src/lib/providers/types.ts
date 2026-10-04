export type FulfillmentItem = {
  sku: string;
  quantity: number;
  size: string;
  color: string;
};

export type FulfillmentOrder = {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: FulfillmentItem[];
};

export interface PodProvider {
  createOrder(order: FulfillmentOrder): Promise<{ providerOrderId: string }>;
  getTracking(providerOrderId: string): Promise<{ status: string; trackingNumber?: string }>;
  cancelOrder(providerOrderId: string): Promise<void>;
}
