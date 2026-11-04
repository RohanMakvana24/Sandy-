/**
 * Phase 5: The Sandy Difference editorial configuration.
 * Contains zero invented awards, experience claims, or unverified statistics.
 */

export interface EditorialFeatureRowItem {
  id: string;
  number: string;
  title: string;
  description: string;
  ariaLabel: string;
}

export const DIFFERENCE_SECTION_COPY = {
  sectionId: 'difference',
  eyebrow: '05 / THE SANDY DIFFERENCE',
  headlineLine1: 'NOT JUST A CUT.',
  headlineLine2: 'A STATEMENT.',
  supportingDescription:
    'Where precision, personal style, and thoughtful grooming come together.',
  bottomStatementLabel: 'THE SANDY PHILOSOPHY',
  bottomStatementLine1: 'YOUR STYLE.',
  bottomStatementLine2: 'OUR PASSION.',
} as const;

export const EDITORIAL_FEATURE_ROWS: readonly EditorialFeatureRowItem[] = [
  {
    id: 'art-of-precision',
    number: '01',
    title: 'THE ART OF PRECISION',
    description:
      'Every detail is considered. Every style is approached with intention.',
    ariaLabel: 'Row 01 — The Art of Precision',
  },
  {
    id: 'personal-style',
    number: '02',
    title: 'PERSONAL STYLE',
    description:
      'Grooming that complements your individuality and personal expression.',
    ariaLabel: 'Row 02 — Personal Style',
  },
  {
    id: 'grooming-experience',
    number: '03',
    title: 'THE GROOMING EXPERIENCE',
    description: 'A thoughtful approach to comfort, style, and self-care.',
    ariaLabel: 'Row 03 — The Grooming Experience',
  },
  {
    id: 'confidence-redefined',
    number: '04',
    title: 'CONFIDENCE REDEFINED',
    description:
      'A refined look that helps you feel ready for every occasion.',
    ariaLabel: 'Row 04 — Confidence Redefined',
  },
] as const;
