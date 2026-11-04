export interface ChairStudioPose {
  chairRotY: number;
  chairRotX: number;
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  spotlightX: number;
  spotlightY: number;
  reclineAngle: number;
}

export type ChairViewPreset = 'signature' | 'recline' | 'profile';

export const HERO_COPY = {
  eyebrow: "SANDY MEN'S SALON — RAJKOT",
  headlineLine1: 'THE ART OF',
  headlineLine2: 'PRECISION.',
  description:
    'More than a haircut. A statement of confidence, craftsmanship, and timeless style.',
  primaryCta: 'BOOK YOUR EXPERIENCE',
  secondaryCta: 'EXPLORE SERVICES',
} as const;

export const MAX_POINTER_ROT_Y = 0.34; // ~19.5 deg max yaw from pointer
export const MAX_POINTER_ROT_X = 0.11; // ~6.3 deg max pitch from pointer
export const BASE_CHAIR_ROT_Y = -0.46; // Angled ¾ luxury studio presentation

export function clampNormalized(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(-1, Math.min(1, value));
}

export function clampScrollProgress(progress: number): number {
  if (!Number.isFinite(progress)) return 0;
  return Math.max(0, Math.min(1, progress));
}

export function dampValue(
  current: number,
  target: number,
  lambda: number,
  dt: number
): number {
  if (!Number.isFinite(dt) || dt <= 0) return current;
  const factor = 1 - Math.exp(-Math.max(0, lambda) * Math.min(dt, 0.1));
  return current + (target - current) * factor;
}

export function computeTargetChairPose(params: {
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
  isMobile?: boolean;
  preset?: ChairViewPreset;
}): ChairStudioPose {
  const px = clampNormalized(params.pointerX);
  const py = clampNormalized(params.pointerY);
  const scroll = clampScrollProgress(params.scrollProgress);
  const mobileFactor = params.isMobile ? 0.45 : 1;
  const preset = params.preset ?? 'signature';

  let presetRotYOffset = 0;
  let presetRecline = 0.18;
  let presetCamZOffset = 0;

  if (preset === 'recline') {
    presetRotYOffset = -0.28;
    presetRecline = 0.52;
    presetCamZOffset = -0.25;
  } else if (preset === 'profile') {
    presetRotYOffset = -0.68;
    presetRecline = 0.22;
    presetCamZOffset = -0.15;
  }

  // Chair rotates gently toward cursor + gradual scroll rotation
  const chairRotY =
    BASE_CHAIR_ROT_Y +
    presetRotYOffset +
    px * MAX_POINTER_ROT_Y * mobileFactor +
    scroll * 0.62;

  const chairRotX = py * MAX_POINTER_ROT_X * mobileFactor + scroll * 0.06;

  // Camera shifts subtly with cursor and moves slightly closer on scroll
  const baseCamZ = params.isMobile ? 5.35 : 4.45;
  const baseCamY = params.isMobile ? 1.35 : 1.48;
  const cameraX = px * 0.22 * mobileFactor;
  const cameraY = baseCamY - py * 0.12 * mobileFactor + scroll * 0.16;
  const cameraZ = baseCamZ + presetCamZOffset - scroll * 0.55;

  // Studio overhead key spotlight reacts gently to pointer & scroll
  const spotlightX = 2.2 + px * 0.85 - scroll * 0.9;
  const spotlightY = 4.6 - py * 0.35;

  return {
    chairRotY,
    chairRotX,
    cameraX,
    cameraY,
    cameraZ,
    spotlightX,
    spotlightY,
    reclineAngle: presetRecline + scroll * 0.15,
  };
}
