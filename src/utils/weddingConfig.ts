import { getKolkataDateString, validateIndianMobile } from './bookingConfig';

export const WEDDING_EVENTS = ['Engagement', 'Sangeet', 'Wedding', 'Reception'] as const;
export type WeddingEvent = typeof WEDDING_EVENTS[number];
export const WEDDING_SERVICES = [
  { id: 'hair', name: 'Signature haircut', detail: 'A cut shaped around your look' },
  { id: 'beard', name: 'Beard & shave', detail: 'Clean contours. A considered finish.' },
  { id: 'facial', name: 'Facial care', detail: 'Discuss a skin-care ritual with us' },
  { id: 'spa', name: 'Hair spa', detail: 'Care for your hair before the day' },
  { id: 'styling', name: 'Event styling', detail: 'The finishing touch for your occasion' },
] as const;

export const WEDDING_CONFIG = {
  // Publicly listed Mavdi business phone; salon should confirm WhatsApp availability.
  whatsappNumber: '919129176876',
  source: 'https://magicpin.in/Rajkot/Mavdi/Restaurant/Sandy-Mens-Salon/store/1b7b515',
  maxPartySize: 20,
} as const;

export interface WeddingRequest {
  event: WeddingEvent;
  party: 'solo' | 'crew';
  partySize: number; // Includes the groom.
  services: string[];
  eventDate: string;
  groomingDate: string;
  name: string;
  mobile: string;
  notes: string;
}
export type WeddingErrors = Partial<Record<keyof WeddingRequest, string>>;

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function validateWeddingRequest(request: WeddingRequest, today = getKolkataDateString()): WeddingErrors {
  const errors: WeddingErrors = {};
  if (!WEDDING_EVENTS.includes(request.event)) errors.event = 'Choose your occasion.';
  if (!['solo', 'crew'].includes(request.party)) errors.party = 'Choose who the booking is for.';
  if (request.party === 'crew' && (!Number.isInteger(request.partySize) || request.partySize < 2 || request.partySize > WEDDING_CONFIG.maxPartySize)) {
    errors.partySize = `Choose between 2 and ${WEDDING_CONFIG.maxPartySize} people, including the groom.`;
  }
  if (!request.services.length || request.services.some(id => !WEDDING_SERVICES.some(service => service.id === id))) {
    errors.services = 'Select at least one grooming service.';
  }
  if (!validDate(request.eventDate) || request.eventDate < today) errors.eventDate = 'Choose today or a future event date.';
  if (!validDate(request.groomingDate) || request.groomingDate < today) errors.groomingDate = 'Choose today or a future grooming date.';
  else if (validDate(request.eventDate) && request.groomingDate > request.eventDate) errors.groomingDate = 'Grooming must be on or before your event date.';
  if (request.name.trim().length < 2) errors.name = 'Enter your full name (at least 2 characters).';
  if (!validateIndianMobile(request.mobile)) errors.mobile = 'Enter a valid 10-digit Indian mobile number.';
  return errors;
}

export function buildWeddingInquiryUrl(request: WeddingRequest, number: string = WEDDING_CONFIG.whatsappNumber): string | null {
  if (Object.keys(validateWeddingRequest(request)).length) return null;
  const phone = number.replace(/\D/g, '');
  if (!/^91[6-9]\d{9}$/.test(phone)) return null;
  const services = WEDDING_SERVICES.filter(service => request.services.includes(service.id)).map(service => service.name);
  const message = [
    "Hello Sandy Men's Salon, I'd like to request a wedding grooming consultation.", '',
    `Name: ${request.name.trim()}`, `Mobile: ${request.mobile.trim()}`,
    `Occasion: ${request.event}`, `Event date: ${request.eventDate}`,
    `Preferred grooming date: ${request.groomingDate}`,
    `For: ${request.party === 'solo' ? 'Just the groom (1 person)' : `Groom + crew (${request.partySize} people, including groom)`}`,
    `Services: ${services.join(', ')}`, request.notes.trim() ? `Notes: ${request.notes.trim()}` : '', '',
    'Please share package options, a quote and availability. I understand this is an inquiry, not a confirmed booking.',
  ].filter(line => line !== '').join('\n');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
