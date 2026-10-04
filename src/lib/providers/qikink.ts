import { FulfillmentOrder, PodProvider } from './types';

export class QikinkProvider implements PodProvider {
  async createOrder(order: FulfillmentOrder) {
    // Open API adapter for Qikink POD services
    return {
      providerOrderId: `QIKINK-${order.orderNumber}`
    };
  }

  async getTracking(id: string) {
    return {
      status: 'PROCESSING',
      trackingNumber: `QK-${id.slice(-8)}IN`
    };
  }

  async cancelOrder(id: string) {
    // cancel implementation
    console.log(`Qikink order ${id} cancel request logged.`);
  }
}
