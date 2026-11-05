export interface SalonLocationConfig {
  salonName: string;
  tagline: string;
  subTagline: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  displayPhone: string;
  whatsapp: string;
  email?: string;
  openingHours: string;
  hoursBreakdown: readonly { days: string; hours: string }[];
  instagramUrl?: string;
  instagramHandle?: string;
  googleMapsDirectionsUrl: string;
  googleMapsEmbedUrl: string;
}

export interface ContactRowItem {
  id: string;
  index: string;
  label: string;
  value: string;
  href?: string;
  isExternal?: boolean;
  subText?: string;
}

export const SALON_LOCATION_CONFIG: SalonLocationConfig = {
  salonName: "Sandy Men's Salon",
  tagline: 'THE ART OF GROOMING.',
  subTagline: 'Precision. Style. Confidence.',
  address: 'Kalawad Road, Rajkot, Gujarat',
  landmark: 'Near Cosmoplex Cinema, Kalawad Road',
  city: 'Rajkot',
  state: 'Gujarat',
  country: 'India',
  pincode: '360005',
  phone: '+919825012345',
  displayPhone: '+91 98250 12345',
  whatsapp: '+919825012345',
  email: 'contact@sandymenssalon.com',
  openingHours: 'Monday – Sunday: 10:00 AM – 09:30 PM',
  hoursBreakdown: [
    { days: 'Monday – Friday', hours: '10:00 AM – 09:30 PM' },
    { days: 'Saturday – Sunday', hours: '09:30 AM – 10:00 PM' },
  ],
  instagramUrl: 'https://instagram.com/sandymenssalon',
  instagramHandle: '@sandymenssalon',
  googleMapsDirectionsUrl:
    'https://www.google.com/maps/search/?api=1&query=Sandy+Men%27s+Salon+Kalawad+Road+Rajkot+Gujarat',
  googleMapsEmbedUrl:
    'https://maps.google.com/maps?q=Kalawad+Road+Rajkot+Gujarat&t=&z=15&ie=UTF8&iwloc=&output=embed',
};

export const LOCATION_SECTION_COPY = {
  sectionId: 'contact',
  eyebrow: '09 / VISIT SANDY',
  headlineLine1: 'YOUR NEXT',
  headlineLine2: 'DESTINATION.',
  supportingDescription:
    'Great style begins with a visit. Find your grooming experience in Rajkot.',
  directionsButtonText: 'GET DIRECTIONS',
  oversizedBrandText: 'SANDY.',
  footerBrandTagline: 'THE ART OF GROOMING.',
  footerBrandSub: 'Precision. Style. Confidence.',
} as const;

export interface FooterNavLink {
  label: string;
  href: string;
  id: string;
}

export const FOOTER_NAV_LINKS: readonly FooterNavLink[] = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'The Difference', href: '#difference', id: 'difference' },
  { label: 'Our Work', href: '#gallery', id: 'gallery' },
  { label: 'Testimonials', href: '#testimonials', id: 'testimonials' },
  { label: 'Wedding Grooming', href: '#wedding', id: 'wedding' },
  { label: 'Book Appointment', href: '#booking', id: 'booking' },
  { label: 'Contact', href: '#contact', id: 'contact' },
] as const;

/**
 * Returns formatted contact row items based strictly on verified and configured fields.
 * Any empty or unconfigured field is excluded gracefully.
 */
export function getVerifiedContactRows(
  config: SalonLocationConfig = SALON_LOCATION_CONFIG
): ContactRowItem[] {
  const rows: ContactRowItem[] = [];

  // 01 — VISIT US
  if (config.address.trim()) {
    rows.push({
      id: 'visit',
      index: '01',
      label: 'VISIT US',
      value: `${config.address}, ${config.city}`,
      subText: config.landmark,
      href: config.googleMapsDirectionsUrl || undefined,
      isExternal: true,
    });
  }

  // 02 — CALL US
  if (config.displayPhone.trim() && config.phone.trim()) {
    rows.push({
      id: 'call',
      index: '02',
      label: 'CALL US',
      value: config.displayPhone,
      href: `tel:${config.phone.replace(/[^\d+]/g, '')}`,
      isExternal: false,
    });
  }

  // 03 — WHATSAPP
  if (config.whatsapp.trim()) {
    const sanitizedWhatsapp = config.whatsapp.replace(/\D/g, '');
    rows.push({
      id: 'whatsapp',
      index: '03',
      label: 'WHATSAPP',
      value: 'Chat on WhatsApp',
      subText: config.displayPhone,
      href: `https://wa.me/${sanitizedWhatsapp}?text=${encodeURIComponent(
        "Hello Sandy Men's Salon, I would like to inquire about your grooming services."
      )}`,
      isExternal: true,
    });
  }

  // 04 — FOLLOW US
  if (config.instagramUrl?.trim() && config.instagramHandle?.trim()) {
    rows.push({
      id: 'follow',
      index: '04',
      label: 'FOLLOW US',
      value: config.instagramHandle,
      subText: 'Editorial cuts & stories',
      href: config.instagramUrl,
      isExternal: true,
    });
  }

  // 05 — OPENING HOURS
  if (config.openingHours.trim()) {
    rows.push({
      id: 'hours',
      index: '05',
      label: 'OPENING HOURS',
      value: config.openingHours,
      subText: 'Walk-ins welcome based on availability',
    });
  }

  return rows;
}
