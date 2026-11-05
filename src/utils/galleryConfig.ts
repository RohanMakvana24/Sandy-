/**
 * Phase 6 — Portfolio Gallery Configuration
 * Sandy Men's Salon — Rajkot, India
 *
 * Centralized, editable portfolio data schema.
 * Contains zero fabricated customer identities, testimonials, or before/after claims.
 * Marked as development portfolio demo entries with clear replacement paths for salon assets.
 */

export type GalleryCategoryId =
  | 'all'
  | 'haircuts'
  | 'fades'
  | 'beard'
  | 'styling'
  | 'transformations';

export interface GalleryCategory {
  id: GalleryCategoryId;
  label: string;
}

export interface GalleryPortfolioItem {
  id: string;
  number: string;
  title: string;
  category: GalleryCategoryId;
  categoryLabel: string;
  description: string;
  imageUrl: string;
  aspectRatioClass: string; // Tailored for asymmetric masonry
  colSpanClass: string; // Desktop grid layout positioning
  craftTag: string;
  altText: string;
}

export const GALLERY_SECTION_COPY = {
  sectionId: 'gallery',
  eyebrow: '06 / OUR WORK',
  headlineLine1: 'EVERY CUT.',
  headlineLine2: 'A MASTERPIECE.',
  supportingDescription:
    'Explore the looks. Discover the details. Find your signature style.',
  noticeTag: 'SANDY ARCHITECTURAL PORTFOLIO ARCHIVE',
} as const;

export const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  { id: 'all', label: 'All Work' },
  { id: 'haircuts', label: 'Haircuts' },
  { id: 'fades', label: 'Fade Styles' },
  { id: 'beard', label: 'Beard Grooming' },
  { id: 'styling', label: 'Hair Styling' },
  { id: 'transformations', label: 'Transformations' },
] as const;

export const DEFAULT_PORTFOLIO_ITEMS: readonly GalleryPortfolioItem[] = [
  {
    id: 'textured-crop',
    number: '01',
    title: 'Textured Crop',
    category: 'haircuts',
    categoryLabel: 'HAIRCUTS / FADES',
    description:
      'Blunt forward fringe with micro-scissor point texture and mid-drop fade.',
    imageUrl: '/assets/gallery/textured_crop.webp',
    aspectRatioClass: 'aspect-[3/4]',
    colSpanClass: 'lg:col-span-7',
    craftTag: 'TEXTURE & LOW BLEND',
    altText:
      'Textured crop haircut styling with clean mid-drop fade silhouette',
  },
  {
    id: 'classic-taper',
    number: '02',
    title: 'Classic Taper Fade',
    category: 'fades',
    categoryLabel: 'FADE STYLES',
    description:
      'Low-compression temple taper blended seamlessly into tailored neckline.',
    imageUrl: '/assets/gallery/classic_taper.webp',
    aspectRatioClass: 'aspect-[4/5]',
    colSpanClass: 'lg:col-span-5',
    craftTag: 'TEMPLE COMPRESSION',
    altText:
      'Classic taper fade haircut contour seamlessly blended at neckline',
  },
  {
    id: 'modern-pompadour',
    number: '03',
    title: 'Modern Pompadour',
    category: 'styling',
    categoryLabel: 'HAIR STYLING',
    description:
      'High-volume architectural sweep with matte clay finish and disconnected side part.',
    imageUrl: '/assets/gallery/modern_pompadour.webp',
    aspectRatioClass: 'aspect-[3/4]',
    colSpanClass: 'lg:col-span-5',
    craftTag: 'MATTE ARCHITECTURE',
    altText:
      'Modern pompadour with sweeping volume and matte styling finish',
  },
  {
    id: 'precision-beard',
    number: '04',
    title: 'Precision Beard Styling',
    category: 'beard',
    categoryLabel: 'BEARD GROOMING',
    description:
      'Razor-defined cheek line, contoured jawline gradation, and botanical oil treatment.',
    imageUrl: '/assets/gallery/precision_beard.webp',
    aspectRatioClass: 'aspect-[16/10]',
    colSpanClass: 'lg:col-span-7',
    craftTag: 'RAZOR SCULPTURE',
    altText:
      'Precision beard styling with sharp razor-honed cheek and jaw contours',
  },
  {
    id: 'contemporary-styling',
    number: '05',
    title: 'Contemporary Hair Styling',
    category: 'styling',
    categoryLabel: 'HAIR STYLING',
    description:
      'Natural flow scissor sculpture styled with sea salt mist and diffuser airflow.',
    imageUrl: '/assets/gallery/contemporary_styling.webp',
    aspectRatioClass: 'aspect-[4/5]',
    colSpanClass: 'lg:col-span-5',
    craftTag: 'DIFFUSED NATURAL FLOW',
    altText:
      'Contemporary layered hair styling with organic wave definition',
  },
  {
    id: 'signature-transformation',
    number: '06',
    title: 'Signature Transformation',
    category: 'transformations',
    categoryLabel: 'TRANSFORMATIONS',
    description:
      'Complete bespoke redesign tailored to facial geometry, density, and lifestyle.',
    imageUrl: '/assets/gallery/signature_transformation.webp',
    aspectRatioClass: 'aspect-[16/9]',
    colSpanClass: 'lg:col-span-12',
    craftTag: 'BESPOKE REDESIGN',
    altText:
      'Signature hair and beard transformation tailored to facial anatomy',
  },
] as const;
