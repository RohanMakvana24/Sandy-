import { SALON_LOCATION_CONFIG } from './contactConfig';
import {
  DEFAULT_GROOMING_SERVICES,
  GroomingServiceItem,
} from './servicesKinematics';

export interface BookingState {
  step: 1 | 2 | 3;
  selectedService: GroomingServiceItem | null;
  selectedDate: string; // YYYY-MM-DD in Asia/Kolkata timezone
  selectedTimeSlot: string;
  fullName: string;
  mobile: string;
  specialRequests: string;
}

export interface BookingFormErrors {
  fullName?: string;
  mobile?: string;
  selectedDate?: string;
  selectedTimeSlot?: string;
  selectedService?: string;
}

export const BOOKING_SECTION_COPY = {
  sectionId: 'booking',
  eyebrow: '08 / PRIVATE BOOKING EXPERIENCE',
  headlineLine1: 'YOUR NEXT',
  headlineLine2: 'LOOK STARTS HERE.',
  supportingDescription:
    'Choose your grooming experience and request a time that works for you.',
  steps: [
    { number: 1, title: 'SELECT YOUR SERVICE', short: 'SERVICE' },
    { number: 2, title: 'CHOOSE DATE & TIME', short: 'DATE & TIME' },
    { number: 3, title: 'YOUR DETAILS & CONFIRMATION', short: 'CONFIRM' },
  ],
  disclaimer:
    'Your selected time is a request and will be confirmed by the salon.',
  statusMessage:
    'Your appointment request is ready to send via WhatsApp.',
} as const;

/**
 * Salon configured business hours request timeslots (10:30 AM to 08:30 PM).
 * Verified request intervals in Asia/Kolkata timezone.
 */
export const SALON_REQUEST_TIMESLOTS: readonly string[] = [
  '10:30 AM',
  '11:30 AM',
  '12:30 PM',
  '02:00 PM',
  '03:30 PM',
  '04:30 PM',
  '05:30 PM',
  '06:30 PM',
  '07:30 PM',
  '08:30 PM',
] as const;

/**
 * Configurable salon WhatsApp contact number.
 * Note: If no official number is configured, WhatsApp request links will present a configuration-required message.
 * Default official salon line or placeholder format: "+91 98250 00000" (or configured value).
 */
export const SALON_CONFIG = {
  salonName: "Sandy Men's Salon",
  location: 'Kalawad Road, Rajkot, Gujarat',
  timezone: 'Asia/Kolkata',
  // Configurable WhatsApp number. If empty or unverified, graceful fallback UI renders.
  whatsappNumber: SALON_LOCATION_CONFIG.whatsapp,
  maxAdvanceDays: 45,
} as const;

/**
 * Validates Indian mobile number: 10 digits starting with 6, 7, 8, or 9
 * (optionally prefixed by +91 or 0).
 */
export function validateIndianMobile(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return /^[6-9]\d{9}$/.test(digits);
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return /^[6-9]\d{9}$/.test(digits.slice(2));
  }
  return false;
}

/**
 * Formats a clean click-to-chat WhatsApp link with properly encoded request message.
 * Sanitizes country code, stripping spaces, punctuation, and leading '+'.
 */
export function buildWhatsAppBookingUrl(
  booking: BookingState,
  configuredNumber: string
): string | null {
  const sanitizedNum = configuredNumber.replace(/\D/g, '');
  if (!/^91[6-9]\d{9}$/.test(sanitizedNum)) {
    return null;
  }

  const message = [
    `Hello Sandy Men's Salon,`,
    ``,
    `I would like to request an appointment.`,
    ``,
    `Name: ${booking.fullName.trim()}`,
    `Mobile: ${booking.mobile.trim()}`,
    `Service: ${booking.selectedService ? booking.selectedService.title : 'Not specified'}`,
    `Preferred Date: ${booking.selectedDate}`,
    `Preferred Time: ${booking.selectedTimeSlot}`,
    booking.specialRequests.trim()
      ? `Special Request: ${booking.specialRequests.trim()}`
      : `Special Request: None`,
    ``,
    `Please confirm whether this appointment time is available.`,
    ``,
    `Thank you.`,
  ].join('\n');

  return `https://wa.me/${sanitizedNum}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats a Date object into YYYY-MM-DD in Asia/Kolkata timezone.
 */
export function getKolkataDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

/**
 * Validates Step 3 form fields.
 */
export function validateCustomerDetails(
  fullName: string,
  mobile: string
): { valid: boolean; errors: BookingFormErrors } {
  const errors: BookingFormErrors = {};

  const trimmed = fullName.trim();
  if (!trimmed) {
    errors.fullName = 'Please enter your full name.';
  } else if (trimmed.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!mobile.trim()) {
    errors.mobile = 'Please enter your contact mobile number.';
  } else if (!validateIndianMobile(mobile)) {
    errors.mobile = 'Please enter a valid 10-digit Indian mobile number.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function isRequestSlotAvailable(date: string, slot: string, now = new Date()): boolean {
  if (!SALON_REQUEST_TIMESLOTS.includes(slot)) return false;
  const today = getKolkataDateString(now);
  const max = new Date(today + 'T00:00:00+05:30');
  max.setUTCDate(max.getUTCDate() + SALON_CONFIG.maxAdvanceDays);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today || date > getKolkataDateString(max)) return false;
  const [clock, period] = slot.split(' ');
  const [hour, minute] = clock.split(':').map(Number);
  const instant = new Date(date + 'T' + String(hour % 12 + (period === 'PM' ? 12 : 0)).padStart(2, '0') + ':' + String(minute).padStart(2, '0') + ':00+05:30');
  return Number.isFinite(instant.getTime()) && getKolkataDateString(instant) === date && instant > now;
}
export function validateBooking(booking: BookingState, now = new Date()) {
  const { errors } = validateCustomerDetails(booking.fullName, booking.mobile);
  if (!DEFAULT_GROOMING_SERVICES.some(service => service.id === booking.selectedService?.id)) errors.selectedService = 'Please select a service.';
  if (!isRequestSlotAvailable(booking.selectedDate, booking.selectedTimeSlot, now)) errors.selectedTimeSlot = 'Please choose a future time within the next 45 days.';
  return { valid: Object.keys(errors).length === 0, errors };
}
