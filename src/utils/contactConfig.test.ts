import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LOCATION_SECTION_COPY,
  SALON_LOCATION_CONFIG,
  FOOTER_NAV_LINKS,
  getVerifiedContactRows,
} from './contactConfig';

test('Phase 9 location copy matches exact specifications', () => {
  assert.equal(LOCATION_SECTION_COPY.sectionId, 'contact');
  assert.equal(LOCATION_SECTION_COPY.eyebrow, '09 / VISIT SANDY');
  assert.equal(LOCATION_SECTION_COPY.headlineLine1, 'YOUR NEXT');
  assert.equal(LOCATION_SECTION_COPY.headlineLine2, 'DESTINATION.');
  assert.equal(
    LOCATION_SECTION_COPY.supportingDescription,
    'Great style begins with a visit. Find your grooming experience in Rajkot.'
  );
  assert.equal(LOCATION_SECTION_COPY.directionsButtonText, 'GET DIRECTIONS');
  assert.equal(LOCATION_SECTION_COPY.oversizedBrandText, 'SANDY.');
  assert.equal(LOCATION_SECTION_COPY.footerBrandTagline, 'THE ART OF GROOMING.');
  assert.equal(LOCATION_SECTION_COPY.footerBrandSub, 'Precision. Style. Confidence.');
});

test('SALON_LOCATION_CONFIG supports Rajkot and optional configured contacts', () => {
  assert.equal(SALON_LOCATION_CONFIG.salonName, "Sandy Men's Salon");
  assert.equal(SALON_LOCATION_CONFIG.city, 'Rajkot');
  assert.equal(SALON_LOCATION_CONFIG.state, 'Gujarat');
  assert.equal(SALON_LOCATION_CONFIG.country, 'India');
  assert.ok(SALON_LOCATION_CONFIG.googleMapsDirectionsUrl.startsWith('https://www.google.com/maps'));
  assert.ok(SALON_LOCATION_CONFIG.googleMapsEmbedUrl.startsWith('https://maps.google.com/maps'));
  assert.ok(!SALON_LOCATION_CONFIG.phone || /^\+?91[6-9]\d{9}$/.test(SALON_LOCATION_CONFIG.phone));
});

test('FOOTER_NAV_LINKS contains all real existing website section links in order', () => {
  const ids = FOOTER_NAV_LINKS.map((link) => link.id);
  assert.deepEqual(ids, [
    'home',
    'about',
    'services',
    'difference',
    'gallery',
    'testimonials',
    'wedding',
    'booking',
    'contact',
  ]);

  for (const link of FOOTER_NAV_LINKS) {
    assert.ok(link.href.startsWith('#'));
    assert.ok(link.label.length > 0);
  }
});

test('getVerifiedContactRows filters and formats verified contact items with proper protocols', () => {
  const rows = getVerifiedContactRows({ ...SALON_LOCATION_CONFIG, phone: '+919876543210', displayPhone: '+91 98765 43210', whatsapp: '+919876543210' });

  assert.equal(rows.length, 5);
  assert.equal(rows[0].id, 'visit');
  assert.equal(rows[0].label, 'VISIT US');
  assert.ok(rows[0].href?.startsWith('https://www.google.com/maps'));

  assert.equal(rows[1].id, 'call');
  assert.equal(rows[1].label, 'CALL US');
  assert.ok(rows[1].href?.startsWith('tel:+91'));

  assert.equal(rows[2].id, 'whatsapp');
  assert.equal(rows[2].label, 'WHATSAPP');
  assert.ok(rows[2].href?.startsWith('https://wa.me/91'));

  assert.equal(rows[3].id, 'follow');
  assert.equal(rows[3].label, 'FOLLOW US');
  assert.ok(rows[3].href?.startsWith('https://instagram.com/'));

  assert.equal(rows[4].id, 'hours');
  assert.equal(rows[4].label, 'OPENING HOURS');
  assert.equal(rows[4].value, SALON_LOCATION_CONFIG.openingHours);
});

test('getVerifiedContactRows omits fields gracefully when values are empty', () => {
  const partialConfig = {
    ...SALON_LOCATION_CONFIG,
    phone: '+919876543210',
    displayPhone: '+91 98765 43210',
    instagramUrl: '',
    instagramHandle: '',
    whatsapp: '',
  };

  const rows = getVerifiedContactRows(partialConfig);
  assert.equal(rows.some((r) => r.id === 'follow'), false);
  assert.equal(rows.some((r) => r.id === 'whatsapp'), false);
  assert.equal(rows.length, 3);
});
