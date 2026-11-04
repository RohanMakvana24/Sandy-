import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BRAND_COLORS,
  NAV_ITEMS,
  SPOTLIGHT_POSITIONS,
  resolveActiveNavId,
  isNavbarScrolled,
  validateBookingForm,
} from './navigation';

test('brand palette matches strict Sandy Mens Salon specification', () => {
  assert.equal(BRAND_COLORS.glossyBlack, '#171819');
  assert.equal(BRAND_COLORS.mutedOlive, '#77795B');
  assert.equal(BRAND_COLORS.warmIvory, '#E8DDC8');
  assert.equal(BRAND_COLORS.warmWhiteLed, '#E8DDC8');
  assert.equal(BRAND_COLORS.softIvory, '#E8DDC8');
});

test('navigation items contain the exact 6 required links in order', () => {
  assert.deepEqual(
    NAV_ITEMS.map((item) => item.label),
    ['Home', 'About', 'Services', 'Gallery', 'Pricing', 'Contact']
  );
});

test('overhead spotlights include 5 recessed fixtures across the signboard', () => {
  assert.equal(SPOTLIGHT_POSITIONS.length, 5);
  assert.ok(SPOTLIGHT_POSITIONS[0].leftPercent < 15);
  assert.ok(SPOTLIGHT_POSITIONS[4].leftPercent > 85);
});

test('resolveActiveNavId maps valid hashes and falls back to home', () => {
  assert.equal(resolveActiveNavId('#services'), 'services');
  assert.equal(resolveActiveNavId('PRICING'), 'pricing');
  assert.equal(resolveActiveNavId('#unknown-section'), 'home');
  assert.equal(resolveActiveNavId(''), 'home');
});

test('isNavbarScrolled detects sticky scroll threshold accurately', () => {
  assert.equal(isNavbarScrolled(0), false);
  assert.equal(isNavbarScrolled(18), false);
  assert.equal(isNavbarScrolled(24), true);
  assert.equal(isNavbarScrolled(150), true);
  assert.equal(isNavbarScrolled(-10), false);
});

test('validateBookingForm rejects empty or malformed fields and accepts valid booking', () => {
  const invalidResult = validateBookingForm({
    fullName: ' ',
    phone: '123',
    service: '',
    date: '',
    timeSlot: '',
  });
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.fullName);
  assert.ok(invalidResult.errors.phone);
  assert.ok(invalidResult.errors.service);
  assert.ok(invalidResult.errors.date);
  assert.ok(invalidResult.errors.timeSlot);

  const validResult = validateBookingForm({
    fullName: 'Aarav Jadeja',
    phone: '+91 98765 43210',
    service: 'Signature Executive Haircut & Styling',
    date: '2026-11-10',
    timeSlot: '04:30 PM',
  });
  assert.equal(validResult.valid, true);
  assert.deepEqual(validResult.errors, {});
});
