import test from 'node:test';
import assert from 'node:assert/strict';
import { SHOWROOM_PRODUCTS, cartSubtotal, isOrderable, normalizeCart, orderInquiryUrl, type GroomingProduct } from './showroomCatalog';
import { moveSafely, safePosition, TOUR_STOPS } from './showroomNavigation';

const product: GroomingProduct = { ...SHOWROOM_PRODUCTS[0], id: 'approved', demo: false, purchasable: true, pricePaise: 54950, stockStatus: 'available' };
const catalog = [product, ...SHOWROOM_PRODUCTS];
test('preview products can be saved in a basket without becoming purchasable', () => {
  assert.equal(SHOWROOM_PRODUCTS.some(isOrderable), false);
  assert.deepEqual(normalizeCart([{ productId: SHOWROOM_PRODUCTS[0].id, quantity: 1 }]), [{ productId: SHOWROOM_PRODUCTS[0].id, quantity: 1 }]);
  assert.equal(orderInquiryUrl([{ productId: product.id, quantity: 1 }], catalog), null);
});
test('cart normalization merges duplicates, caps quantities and rejects invalid stored data', () => {
  assert.deepEqual(normalizeCart([{ productId: product.id, quantity: 2 }, { productId: product.id, quantity: 3 }, { productId: 'missing', quantity: 1 }, { productId: product.id, quantity: 1.5 }], catalog), [{ productId: product.id, quantity: 5 }]);
  assert.deepEqual(normalizeCart([{ productId: product.id, quantity: 500 }], catalog), [{ productId: product.id, quantity: 99 }]);
  assert.deepEqual(normalizeCart({ broken: true }, catalog), []);
  assert.deepEqual(normalizeCart([{ productId: product.id, quantity: -1 }], catalog), []);
});
test('subtotal uses integer paise and unavailable products cannot enter checkout', () => {
  assert.equal(cartSubtotal([{ productId: product.id, quantity: 3 }], catalog), 164850);
  for (const change of [{ stockStatus: 'unavailable' }, { demo: true }, { pricePaise: null }, { pricePaise: -1 }, { pricePaise: 2.5 }, { purchasable: false }]) assert.equal(isOrderable({ ...product, ...change } as GroomingProduct), false);
});
test('WhatsApp request requires verified contact and encodes product details without claiming a placed order', () => {
  const contact = { verified: true, whatsappNumber: '919876543210' };
  const lines = [{ productId: product.id, quantity: 2 }];
  assert.equal(orderInquiryUrl(lines, catalog, { ...contact, verified: false }), null);
  assert.equal(orderInquiryUrl(lines, catalog, { ...contact, whatsappNumber: 'invalid' }), null);
  const url = new URL(orderInquiryUrl(lines, catalog, contact)!);
  assert.equal(url.hostname, 'wa.me');
  assert.match(url.searchParams.get('text')!, /Daily shampoo × 2/);
  assert.match(url.searchParams.get('text')!, /549.50/);
  assert.match(url.searchParams.get('text')!, /Please confirm availability/);
});
test('camera respects room, shelf and central island boundaries', () => {
  for (let i = -15; i < 15; i += .25) for (let j = -15; j < 15; j += .25) {
    const point = safePosition({ x: i, z: j });
    assert.ok(Math.abs(point.x) <= 4.15 && point.z >= -6.7 && point.z <= 8.1);
    assert.ok(Math.hypot(point.x, point.z) >= 2.15 - .00001);
  }
  for (const stop of TOUR_STOPS) assert.deepEqual(safePosition({ x: stop.position[0], z: stop.position[2] }), { x: stop.position[0], z: stop.position[2] });
});
test('long movement cannot tunnel across island or escape the room', () => {
  const stop = moveSafely({ x: 0, z: 5 }, { x: 0, z: -5 });
  assert.ok(stop.z >= 2.15 - .001);
  const wall = moveSafely({ x: 3, z: 3 }, { x: 200, z: 200 });
  assert.ok(wall.x <= 4.15 && wall.z <= 8.1);
});

test('basket supports unknown prices without fabricating a subtotal or order', () => {
  const lines = [{ productId: SHOWROOM_PRODUCTS[0].id, quantity: 2 }];
  assert.equal(cartSubtotal(lines), 0);
  const url = new URL(orderInquiryUrl(lines, SHOWROOM_PRODUCTS, { verified: true, whatsappNumber: '919876543210' })!);
  assert.match(url.searchParams.get('text')!, /Price on request/);
  assert.doesNotMatch(url.searchParams.get('text')!, /Subtotal|INR|NaN/);
  assert.equal(orderInquiryUrl(lines), null);
});
