import { clampNormalized } from './heroKinematics';

export function clampProgress(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export type ExperienceFocusMode = 'precision' | 'style' | 'experience';

export interface PhilosophyBlockItem {
  id: ExperienceFocusMode;
  number: string;
  title: string;
  headline: string;
  description: string;
}

/**
 * Strict editorial copy for Section 03: The Sandy Experience.
 * Contains zero fabricated business claims (no invented years, customer counts, or awards).
 */
export const EXPERIENCE_COPY = {
  eyebrow: '03 / THE SANDY EXPERIENCE',
  headlineLine1: 'BEYOND',
  headlineLine2: 'THE ORDINARY.',
  supportingStatement:
    'More than a haircut. An experience shaped by precision, personal style, and attention to every detail.',
} as const;

export const PHILOSOPHY_BLOCKS: readonly PhilosophyBlockItem[] = [
  {
    id: 'precision',
    number: '01',
    title: 'PRECISION',
    headline: '01 — PRECISION',
    description: 'Every detail matters. Every cut is crafted with intention.',
  },
  {
    id: 'style',
    number: '02',
    title: 'INDIVIDUAL STYLE',
    headline: '02 — INDIVIDUAL STYLE',
    description: 'Grooming that complements your personality and confidence.',
  },
  {
    id: 'experience',
    number: '03',
    title: 'THE EXPERIENCE',
    headline: '03 — THE EXPERIENCE',
    description: 'A refined environment designed around your comfort.',
  },
] as const;

export interface ScissorsKinematicInput {
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
  isMobile: boolean;
  focusMode?: ExperienceFocusMode;
}

export interface ScissorsKinematicPose {
  scissorsRotX: number;
  scissorsRotY: number;
  scissorsRotZ: number;
  bladeOpenAngle: number;
  combOffsetY: number;
  combRotY: number;
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  keyLightIntensityFactor: number;
}

/**
 * Computes the target 3D pose for the barber scissors, tapering comb, and studio camera
 * driven by cursor parallax, GSAP ScrollTrigger progress, and philosophy focus mode.
 */
export function computeTargetScissorsPose(
  input: ScissorsKinematicInput
): ScissorsKinematicPose {
  const px = clampNormalized(input.pointerX);
  const py = clampNormalized(input.pointerY);
  const scroll = clampProgress(input.scrollProgress);
  const focus = input.focusMode ?? 'precision';

  let modeRotYOffset = 0;
  let modeRotZOffset = 0;
  let modeBladeAngle = 0.22;
  let modeCamZOffset = 0;

  if (focus === 'style') {
    modeRotYOffset = 0.32;
    modeRotZOffset = -0.12;
    modeBladeAngle = 0.42; // Wider dynamic cutting articulation
    modeCamZOffset = -0.12;
  } else if (focus === 'experience') {
    modeRotYOffset = -0.26;
    modeRotZOffset = 0.08;
    modeBladeAngle = 0.14; // Poised closed-edge studio profile
    modeCamZOffset = 0.08;
  }

  // Smooth scroll-driven rotation & subtle blade articulation
  const scrollRotY = (scroll - 0.5) * 0.65;
  const scrollRotZ = (scroll - 0.5) * -0.22;
  const scrollBladeDelta = Math.sin(scroll * Math.PI) * 0.14;

  const scissorsRotY = -0.28 + modeRotYOffset + scrollRotY + px * 0.32;
  const scissorsRotX = 0.18 - py * 0.22 + (scroll - 0.5) * 0.12;
  const scissorsRotZ = -0.34 + modeRotZOffset + scrollRotZ + px * 0.08;

  const bladeOpenAngle = Math.max(
    0.06,
    Math.min(0.58, modeBladeAngle + scrollBladeDelta + Math.abs(px) * 0.05)
  );

  const combOffsetY = (scroll - 0.5) * -0.14 + py * -0.05;
  const combRotY = 0.35 - scrollRotY * 0.6 + px * 0.18;

  const baseCamZ = input.isMobile ? 4.45 : 3.75;
  const zoomDelta = scroll * 0.32;
  const cameraZ = Math.max(2.9, baseCamZ - zoomDelta + modeCamZOffset);
  const cameraX = px * 0.18;
  const cameraY = (input.isMobile ? 0.15 : 0.22) - py * 0.12;

  // Spotlight emerges smoothly as user scrolls into the section
  const keyLightIntensityFactor = Math.min(1, 0.35 + scroll * 1.15);

  return {
    scissorsRotX,
    scissorsRotY,
    scissorsRotZ,
    bladeOpenAngle,
    combOffsetY,
    combRotY,
    cameraX,
    cameraY,
    cameraZ,
    keyLightIntensityFactor,
  };
}
