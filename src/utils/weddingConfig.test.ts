import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateWeddingRequest, buildWeddingInquiryUrl, type WeddingRequest } from './weddingConfig';

const valid: WeddingRequest = {
  event: 'Wedding', party: 'solo', partySize: 2, services: ['hair', 'beard'],
  eventDate: '2099-12-15', groomingDate: '2099-12-14', name: 'Test Groom',
  mobile: '9876543210', notes: 'Ivory outfit & evening reception',
};

test('allows a same-day wedding and grooming request', () => {
  assert.deepEqual(validateWeddingRequest({ ...valid, eventDate: '2026-11-05', groomingDate: '2026-11-05' }, '2026-11-05'), {});
});

test('rejects past dates, impossible dates, and grooming after the event', () => {
  assert.ok(validateWeddingRequest({ ...valid, eventDate: '2026-11-04' }, '2026-11-05').eventDate);
  assert.ok(validateWeddingRequest({ ...valid, eventDate: '2099-02-30' }).eventDate);
  assert.ok(validateWeddingRequest({ ...valid, groomingDate: '2099-12-16' }).groomingDate);
  assert.ok(validateWeddingRequest({ ...valid, groomingDate: '' }).groomingDate);
});

test('requires a valid customer and at least one known service', () => {
  const errors = validateWeddingRequest({ ...valid, name: ' ', mobile: '12345', services: [] });
  assert.ok(errors.name); assert.ok(errors.mobile); assert.ok(errors.services);
  assert.ok(validateWeddingRequest({ ...valid, services: ['unknown'] }).services);
});

test('crew size includes groom and stays within supported bounds', () => {
  for (const partySize of [1, 21, 2.5, NaN]) {
    assert.ok(validateWeddingRequest({ ...valid, party: 'crew', partySize }).partySize);
  }
  assert.deepEqual(validateWeddingRequest({ ...valid, party: 'crew', partySize: 5 }), {});
});

test('inquiry URL encodes complete request without sending it', () => {
  const result = buildWeddingInquiryUrl({ ...valid, party: 'crew', partySize: 5 }, '919876543210');
  assert.ok(result);
  const url = new URL(result);
  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, '/919876543210');
  const message = url.searchParams.get('text')!;
  assert.match(message, /Groom \+ crew \(5 people, including groom\)/);
  assert.match(message, /Signature haircut, Beard & shave/);
  assert.match(message, /Ivory outfit & evening reception/);
  assert.match(message, /not a confirmed booking/);
});

test('never produces links for invalid customer requests or unconfigured numbers', () => {
  assert.equal(buildWeddingInquiryUrl({ ...valid, mobile: '' }), null);
  assert.equal(buildWeddingInquiryUrl(valid, ''), null);
  assert.equal(buildWeddingInquiryUrl(valid, '123'), null);
});
