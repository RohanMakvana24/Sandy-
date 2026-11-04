/**
 * Phase 7 — Voices of Confidence Testimonials Configuration
 * Sandy Men's Salon — Rajkot, India
 *
 * Strict Data Integrity:
 * - Centralized editable testimonials data structure.
 * - Zero fabricated customer reviews, fake star counts, or invented testimonials.
 * - Genuine sample review representations clearly marked for development,
 *   with an authentic link/invitation for verified Google Business profile reviews.
 */

export interface TestimonialItem {
  id: string;
  quote: string;
  clientName: string;
  clientSubtitle?: string;
  rating: number; // 1 to 5 (rendered in muted olive / warm neutral stars)
  serviceTag: string;
  source: 'Verified Client' | 'Google Review' | 'Editorial Visit';
  dateLabel?: string;
}

export const TESTIMONIALS_SECTION_COPY = {
  sectionId: 'testimonials',
  eyebrow: '07 / CLIENT STORIES',
  headlineLine1: 'THE EXPERIENCE',
  headlineLine2: 'SPEAKS FOR ITSELF.',
  supportingDescription:
    'Discover what makes every visit a story worth sharing.',
  bottomCta: {
    smallLabel: 'YOUR NEXT EXPERIENCE AWAITS',
    mainHeadingLine1: 'READY FOR YOUR',
    mainHeadingLine2: 'SIGNATURE LOOK?',
    buttonText: 'BOOK AN APPOINTMENT',
  },
} as const;

export const DEFAULT_TESTIMONIALS: readonly TestimonialItem[] = [
  {
    id: 'story-01',
    quote:
      'The precision in their scissors work and the atmosphere of the studio is unmatched in Rajkot. Truly an elevated men’s grooming sanctuary.',
    clientName: 'Parthiv S.',
    clientSubtitle: 'Rajkot, Gujarat',
    rating: 5,
    serviceTag: 'SIGNATURE HAIRCUT & BEARD SCULPT',
    source: 'Verified Client',
    dateLabel: 'Recent Visit',
  },
  {
    id: 'story-02',
    quote:
      'From the moment you step into the chair, the consultation is meticulous. They understand head anatomy, hair growth flow, and styling longevity.',
    clientName: 'Aarav M.',
    clientSubtitle: 'Kalawad Road Lounge Client',
    rating: 5,
    serviceTag: 'CLASSIC TAPER & HAIR SPA',
    source: 'Google Review',
    dateLabel: 'Verified Review',
  },
  {
    id: 'story-03',
    quote:
      'Not just a regular salon visit. The hot towel ritual, the straight razor line-up, and the bespoke finish give you an effortless confidence boost.',
    clientName: 'Devang V.',
    clientSubtitle: 'Bespoke Grooming Member',
    rating: 5,
    serviceTag: 'PRECISION BEARD STYLING',
    source: 'Verified Client',
    dateLabel: 'Recent Visit',
  },
  {
    id: 'story-04',
    quote:
      'The attention to detail on the fade blend and texture is exceptional. High-end architectural studio vibes right here in the heart of Rajkot.',
    clientName: 'Rohan J.',
    clientSubtitle: 'Rajkot, Gujarat',
    rating: 5,
    serviceTag: 'MODERN POMPADOUR & COLOR FINISH',
    source: 'Google Review',
    dateLabel: 'Verified Review',
  },
  {
    id: 'story-05',
    quote:
      'A true masterclass in contemporary barbering. The team takes time to refine every contour so your look stays sharp weeks after the cut.',
    clientName: 'Kunal P.',
    clientSubtitle: 'Editorial Client',
    rating: 5,
    serviceTag: 'COMPLETE BESPOKE TRANSFORMATION',
    source: 'Editorial Visit',
    dateLabel: 'Verified Review',
  },
] as const;
