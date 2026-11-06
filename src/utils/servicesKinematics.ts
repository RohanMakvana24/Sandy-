import { clampNormalized } from './heroKinematics';
import { clampProgress } from './experienceKinematics';

export type Service3DObjectType =
  | 'scissors'
  | 'razor'
  | 'bottle'
  | 'dryer'
  | 'skincare'
  | 'colorbowl';

export interface GroomingServiceItem {
  id: string;
  number: string;
  title: string;
  fullHeading: string;
  description: string;
  objectType: Service3DObjectType;
  instrumentLabel: string;
  craftDetail: string;
  startingPriceINR?: number;
  durationMinutes?: number;
}

/**
 * Strict editorial copy for Phase 4: Our Premium Services.
 * Contains zero invented prices or unverified factual claims.
 */
export const SERVICES_SECTION_COPY = {
  exhibitionTitle: 'THE ART OF GROOMING',
  subtitle: 'Every detail matters. Every style tells a story.',
  eyebrow: '04 / OUR SERVICES',
  headlineLine1: 'PRECISION IN',
  headlineLine2: 'EVERY DETAIL.',
  supportingDescription:
    'Explore grooming experiences crafted to elevate your individual style.',
} as const;

/**
 * Configurable grooming service collection (6 editable services from Phase 4 specification).
 */
export const DEFAULT_GROOMING_SERVICES: readonly GroomingServiceItem[] = [
  {
    id: 'signature-haircut',
    number: '01',
    title: 'Signature Haircut',
    fullHeading: '01 — Signature Haircut',
    description: 'Precision haircuts tailored to your personality.',
    objectType: 'scissors',
    instrumentLabel: 'JAPANESE CONVEX BARBER SHEARS',
    craftDetail: 'Hand-honed surgical steel blades with micro-tension pivot.',
  },
  {
    id: 'beard-styling',
    number: '02',
    title: 'Beard Styling',
    fullHeading: '02 — Beard Styling',
    description: 'Refined beard shaping and detailed finishing.',
    objectType: 'razor',
    instrumentLabel: 'ARTICULATED STRAIGHT RAZOR',
    craftDetail: 'Hollow-ground Damascus steel blade with anodized olive scales.',
  },
  {
    id: 'hair-spa',
    number: '03',
    title: 'Hair Spa',
    fullHeading: '03 — Hair Spa',
    description: 'A relaxing hair and scalp care experience.',
    objectType: 'bottle',
    instrumentLabel: 'BOTANICAL ELIXIR SERUM FLACON',
    craftDetail: 'Heavy obsidian apothecary glass with precision pipette dropper.',
  },
  {
    id: 'hair-styling',
    number: '04',
    title: 'Hair Styling',
    fullHeading: '04 — Hair Styling',
    description: 'Modern styling for a polished appearance.',
    objectType: 'dryer',
    instrumentLabel: 'ARCHITECTURAL SUPERSONIC DRYER',
    craftDetail: 'Balanced acoustic turbine barrel with magnetic styling nozzle.',
  },
  {
    id: 'facial-skin-care',
    number: '05',
    title: 'Facial & Skin Care',
    fullHeading: '05 — Facial & Skin Care',
    description: 'Refreshing grooming and skin care treatments.',
    objectType: 'skincare',
    instrumentLabel: 'LUXURY SKINCARE VESSEL & SPATULA',
    craftDetail: 'Double-walled onyx jar with brushed champagne-gold lid.',
  },
  {
    id: 'hair-color',
    number: '06',
    title: 'Hair Color',
    fullHeading: '06 — Hair Color',
    description: 'Contemporary hair color and finishing.',
    objectType: 'colorbowl',
    instrumentLabel: 'ATELIER MIXING BOWL & TINT BRUSH',
    craftDetail: 'Fluted matte-onyx vessel with precision tapering bristle brush.',
  },
] as const;

export interface ServiceObjectKinematicInput {
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
  transitionProgress: number; // 0 (entering) -> 1 (settled)
  activeIndex: number;
  isMobile: boolean;
}

export interface ServiceObjectKinematicPose {
  objectRotX: number;
  objectRotY: number;
  objectRotZ: number;
  objectScale: number;
  objectOffsetY: number;
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  oliveLightIntensity: number;
  keyLightIntensity: number;
}

/**
 * Computes the target 3D pose, transition scale/rotation, and studio lighting response
 * for the active grooming service instrument.
 */
export function computeServiceObjectPose(
  input: ServiceObjectKinematicInput
): ServiceObjectKinematicPose {
  const px = clampNormalized(input.pointerX);
  const py = clampNormalized(input.pointerY);
  const scroll = clampProgress(input.scrollProgress);
  const trans = clampProgress(input.transitionProgress);

  // Smooth cubic ease-out for object switch transition
  const easeTrans = 1 - Math.pow(1 - trans, 3);

  // Each service has a distinct signature presentation angle
  const indexAngleOffsets = [-0.26, 0.34, -0.18, 0.42, -0.22, 0.28];
  const safeIdx =
    ((input.activeIndex % indexAngleOffsets.length) + indexAngleOffsets.length) %
    indexAngleOffsets.length;
  const signatureYaw = indexAngleOffsets[safeIdx];

  // Spin-in offset during object transition
  const transitionSpinY = (1 - easeTrans) * 0.85;
  const transitionLiftY = (1 - easeTrans) * -0.18;

  const objectRotY =
    signatureYaw + transitionSpinY + (scroll - 0.5) * 0.42 + px * 0.36;
  const objectRotX = 0.16 - py * 0.24 + (scroll - 0.5) * 0.14;
  const objectRotZ = px * 0.08 - (1 - easeTrans) * 0.15;

  const objectScale = 0.72 + easeTrans * 0.28;
  const objectOffsetY = transitionLiftY + (scroll - 0.5) * -0.08;

  const baseCamZ = input.isMobile ? 4.25 : 3.65;
  const cameraZ = Math.max(2.85, baseCamZ - scroll * 0.22 + (1 - easeTrans) * 0.18);
  const cameraX = px * 0.16;
  const cameraY = (input.isMobile ? 0.12 : 0.18) - py * 0.12;

  // Studio lighting subtly pulses when switching services
  const lightPulse = 1 + Math.sin(easeTrans * Math.PI) * 0.22;
  const oliveLightIntensity = 30 * lightPulse;
  const keyLightIntensity = 38 * (0.65 + easeTrans * 0.35);

  return {
    objectRotX,
    objectRotY,
    objectRotZ,
    objectScale,
    objectOffsetY,
    cameraX,
    cameraY,
    cameraZ,
    oliveLightIntensity,
    keyLightIntensity,
  };
}
