import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BOOKING_SECTION_COPY,
  SALON_REQUEST_TIMESLOTS,
  validateIndianMobile,
  validateCustomerDetails,
  buildWhatsAppBookingUrl,
  getKolkataDateString,
  BookingState,
} from './bookingConfig';
import { DEFAULT_GROOMING_SERVICES } from './servicesKinematics';

test('Phase 8 copy matches exact specification without invented claims', () => {
  assert.equal(BOOKING_SECTION_COPY.sectionId, 'booking');
  assert.equal(BOOKING_SECTION_COPY.eyebrow, '08 / PRIVATE BOOKING EXPERIENCE');
  assert.equal(BOOKING_SECTION_COPY.headlineLine1, 'YOUR NEXT');
  assert.equal(BOOKING_SECTION_COPY.headlineLine2, 'LOOK STARTS HERE.');
  assert.equal(
    BOOKING_SECTION_COPY.supportingDescription,
    'Choose your grooming experience and request a time that works for you.'
  );
  assert.equal(
    BOOKING_SECTION_COPY.disclaimer,
    'Your selected time is a request and will be confirmed by the salon.'
  );
  assert.equal(
    BOOKING_SECTION_COPY.statusMessage,
    'Your appointment request is ready to send via WhatsApp.'
  );
  assert.equal(BOOKING_SECTION_COPY.steps.length, 3);
  assert.equal(BOOKING_SECTION_COPY.steps[0].title, 'SELECT YOUR SERVICE');
  assert.equal(BOOKING_SECTION_COPY.steps[1].title, 'CHOOSE DATE & TIME');
  assert.equal(BOOKING_SECTION_COPY.steps[2].title, 'YOUR DETAILS & CONFIRMATION');
});

test('validateIndianMobile accurately validates Indian 10-digit mobile numbers', () => {
  assert.equal(validateIndianMobile('9825012345'), true);
  assert.equal(validateIndianMobile('+91 98250 12345'), true);
  assert.equal(validateIndianMobile('09825012345'), false); // Extra 0
  assert.equal(validateIndianMobile('1234567890'), false); // Starts with 1
  assert.equal(validateIndianMobile(''), false);
  assert.equal(validateIndianMobile('98250'), false);
});

test('validateCustomerDetails enforces name and phone validity', () => {
  const invalid = validateCustomerDetails('', '123');
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.mobile);

  const valid = validateCustomerDetails('Aarav Mehta', '98250 99999');
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('buildWhatsAppBookingUrl constructs valid URL with encoded message and no leading + in phone', () => {
  const booking: BookingState = {
    step: 3,
    selectedService: DEFAULT_GROOMING_SERVICES[0],
    selectedDate: '2026-11-10',
    selectedTimeSlot: '11:30 AM',
    fullName: 'Rohan Sharma',
    mobile: '98250 11111',
    specialRequests: 'Short beard trim as well.',
  };

  const url = buildWhatsAppBookingUrl(booking, '+91 98250 12345');
  assert.ok(url);
  assert.ok(url.startsWith('https://wa.me/919825012345?text='));
  assert.ok(url.includes(encodeURIComponent('Rohan Sharma')));
  assert.ok(url.includes(encodeURIComponent('Signature Haircut')));
  assert.ok(url.includes(encodeURIComponent('2026-11-10')));
  assert.ok(url.includes(encodeURIComponent('11:30 AM')));
  assert.ok(url.includes(encodeURIComponent('Short beard trim as well.')));

  // Missing phone handling
  assert.equal(buildWhatsAppBookingUrl(booking, ''), null);
});

test('getKolkataDateString produces YYYY-MM-DD formatted date in Asia/Kolkata timezone', () => {
  const dateStr = getKolkataDateString();
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(dateStr));
});
