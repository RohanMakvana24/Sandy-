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
  source: 'Verified Client' | 'Google Review' | 'Editorial Visit' | 'Sample Review';
  image?: string;
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

export { SAMPLE_REVIEWS as DEFAULT_TESTIMONIALS } from './reviewSamples';
