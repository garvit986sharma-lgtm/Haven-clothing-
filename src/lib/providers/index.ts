import { PodProvider } from './types';
import { QikinkProvider } from './qikink';
import { GetPrintXProvider } from './getprintx';

export function getPodProvider(): PodProvider {
  return typeof process !== 'undefined' && process.env?.POD_PROVIDER === 'getprintx'
    ? new GetPrintXProvider()
    : new QikinkProvider();
}
