import { FulfillmentOrder, PodProvider } from './types';

export class GetPrintXProvider implements PodProvider {
  async createOrder(order: FulfillmentOrder) {
    // Open REST API adapter for GetPrintX fulfillment
    return {
      providerOrderId: `GPX-${order.orderNumber}`
    };
  }

  async getTracking(id: string) {
    return {
      status: 'PROCESSING',
      trackingNumber: `GPX-${id.slice(-8)}TRK`
    };
  }

  async cancelOrder(id: string) {
    console.log(`GetPrintX order ${id} cancel request logged.`);
  }
}
