import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  EXPERIENCE_COPY,
  PHILOSOPHY_BLOCKS,
  computeTargetScissorsPose,
} from './experienceKinematics';

test('Section 03 copy matches exact specification with zero fabricated claims', () => {
  assert.equal(EXPERIENCE_COPY.eyebrow, '03 / THE SANDY EXPERIENCE');
  assert.equal(EXPERIENCE_COPY.headlineLine1, 'BEYOND');
  assert.equal(EXPERIENCE_COPY.headlineLine2, 'THE ORDINARY.');
  assert.equal(
    EXPERIENCE_COPY.supportingStatement,
    'More than a haircut. An experience shaped by precision, personal style, and attention to every detail.'
  );
});

test('Brand philosophy contains the exact 3 editorial blocks in order', () => {
  assert.equal(PHILOSOPHY_BLOCKS.length, 3);
  assert.equal(PHILOSOPHY_BLOCKS[0].headline, '01 — PRECISION');
  assert.equal(
    PHILOSOPHY_BLOCKS[0].description,
    'Every detail matters. Every cut is crafted with intention.'
  );
  assert.equal(PHILOSOPHY_BLOCKS[1].headline, '02 — INDIVIDUAL STYLE');
  assert.equal(
    PHILOSOPHY_BLOCKS[1].description,
    'Grooming that complements your personality and confidence.'
  );
  assert.equal(PHILOSOPHY_BLOCKS[2].headline, '03 — THE EXPERIENCE');
  assert.equal(
    PHILOSOPHY_BLOCKS[2].description,
    'A refined environment designed around your comfort.'
  );
});

test('computeTargetScissorsPose bounds blade articulation and moves camera closer on scroll', () => {
  const startPose = computeTargetScissorsPose({
    pointerX: 0,
    pointerY: 0,
    scrollProgress: 0,
    isMobile: false,
    focusMode: 'precision',
  });
  const endPose = computeTargetScissorsPose({
    pointerX: 0,
    pointerY: 0,
    scrollProgress: 1,
    isMobile: false,
    focusMode: 'precision',
  });

  assert.ok(endPose.cameraZ < startPose.cameraZ, 'Camera should move closer on scroll');
  assert.ok(
    startPose.bladeOpenAngle >= 0.06 && startPose.bladeOpenAngle <= 0.58,
    'Blade open angle stays within realistic mechanical range'
  );
  assert.ok(endPose.keyLightIntensityFactor >= startPose.keyLightIntensityFactor);
});

test('computeTargetScissorsPose adapts framing for mobile viewports and focus modes', () => {
  const desktopPose = computeTargetScissorsPose({
    pointerX: 0.4,
    pointerY: -0.3,
    scrollProgress: 0.5,
    isMobile: false,
    focusMode: 'style',
  });
  const mobilePose = computeTargetScissorsPose({
    pointerX: 0.4,
    pointerY: -0.3,
    scrollProgress: 0.5,
    isMobile: true,
    focusMode: 'style',
  });

  assert.ok(
    mobilePose.cameraZ > desktopPose.cameraZ,
    'Mobile camera should sit further back for complete 3D framing'
  );
  assert.ok(desktopPose.bladeOpenAngle > 0.35);
});
