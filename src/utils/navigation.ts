export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface SpotlightConfig {
  id: string;
  leftPercent: number;
  intensity: number;
  spreadPx: number;
}

export interface BookingFormInput {
  fullName: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
}

export interface BookingValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof BookingFormInput, string>>;
}

export const BRAND_COLORS = {
  glossyBlack: '#171819',
  mutedOlive: '#77795B',
  warmIvory: '#E8DDC8',
  warmWhiteLed: '#E8DDC8',
  softIvory: '#E8DDC8',
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'gallery', label: 'Gallery', href: '#gallery' },
  { id: 'products', label: 'Products', href: '#products' },
  { id: 'pricing', label: 'Pricing', href: '#pricing' },
  { id: 'contact', label: 'Contact', href: '#contact' },
] as const;

export const SPOTLIGHT_POSITIONS: readonly SpotlightConfig[] = [
  { id: 'spot-logo-monogram', leftPercent: 10.2, intensity: 0.95, spreadPx: 190 },
  { id: 'spot-logo-wordmark', leftPercent: 36.2, intensity: 0.92, spreadPx: 210 },
  { id: 'spot-nav-left', leftPercent: 55.6, intensity: 0.88, spreadPx: 200 },
  { id: 'spot-nav-right', leftPercent: 73.1, intensity: 0.88, spreadPx: 200 },
  { id: 'spot-cta-button', leftPercent: 90.0, intensity: 0.95, spreadPx: 195 },
] as const;

export const SALON_SERVICES: readonly string[] = [
  'Signature Executive Haircut & Styling',
  'Luxury Hot Towel Royal Shave',
  'Beard Sculpting & Essential Oil Ritual',
  'Charcoal Detox & Revitalizing Facial',
  'Complete Grooming Lounge Package',
] as const;

export const TIME_SLOTS: readonly string[] = [
  '10:30 AM',
  '12:00 PM',
  '02:00 PM',
  '04:30 PM',
  '06:30 PM',
  '08:00 PM',
] as const;

export function resolveActiveNavId(hashOrId: string): string {
  const normalized = hashOrId.trim().replace(/^#/, '').toLowerCase();
  const match = NAV_ITEMS.find((item) => item.id === normalized);
  return match ? match.id : 'home';
}

export function isNavbarScrolled(scrollY: number, threshold = 24): boolean {
  if (!Number.isFinite(scrollY) || scrollY < 0) {
    return false;
  }
  return scrollY >= threshold;
}

export function validateBookingForm(input: BookingFormInput): BookingValidationResult {
  const errors: Partial<Record<keyof BookingFormInput, string>> = {};

  const trimmedName = input.fullName.trim();
  if (!trimmedName) {
    errors.fullName = 'Please enter your full name.';
  } else if (trimmedName.length < 2) {
    errors.fullName = 'Name must be at least 2 characters.';
  }

  const digitsOnly = input.phone.replace(/[\s\-()+]/g, '');
  if (!digitsOnly) {
    errors.phone = 'Please enter a contact phone number.';
  } else if (!/^\d{10,13}$/.test(digitsOnly)) {
    errors.phone = 'Enter a valid 10-digit phone number.';
  }

  if (!input.service.trim()) {
    errors.service = 'Please select a grooming service.';
  }

  if (!input.date.trim()) {
    errors.date = 'Please choose a preferred date.';
  }

  if (!input.timeSlot.trim()) {
    errors.timeSlot = 'Please select a preferred time slot.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
