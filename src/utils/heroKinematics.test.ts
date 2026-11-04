import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HERO_COPY,
  BASE_CHAIR_ROT_Y,
  MAX_POINTER_ROT_Y,
  clampNormalized,
  clampScrollProgress,
  dampValue,
  computeTargetChairPose,
} from './heroKinematics';

test('hero copy matches strict Sandy Mens Salon editorial specification', () => {
  assert.equal(HERO_COPY.eyebrow, "SANDY MEN'S SALON — RAJKOT");
  assert.equal(HERO_COPY.headlineLine1, 'THE ART OF');
  assert.equal(HERO_COPY.headlineLine2, 'PRECISION.');
  assert.equal(HERO_COPY.primaryCta, 'BOOK YOUR EXPERIENCE');
  assert.equal(HERO_COPY.secondaryCta, 'EXPLORE SERVICES');
});

test('clampNormalized bounds pointer inputs to [-1, 1]', () => {
  assert.equal(clampNormalized(-4.5), -1);
  assert.equal(clampNormalized(3.2), 1);
  assert.equal(clampNormalized(0.35), 0.35);
  assert.equal(clampNormalized(Number.NaN), 0);
});

test('computeTargetChairPose limits chair rotation to realistic angles', () => {
  const restPose = computeTargetChairPose({
    pointerX: 0,
    pointerY: 0,
    scrollProgress: 0,
  });
  assert.equal(restPose.chairRotY, BASE_CHAIR_ROT_Y);
  assert.equal(restPose.chairRotX, 0);

  const extremeRight = computeTargetChairPose({
    pointerX: 10,
    pointerY: -10,
    scrollProgress: 0,
  });
  assert.ok(
    Math.abs(extremeRight.chairRotY - BASE_CHAIR_ROT_Y - MAX_POINTER_ROT_Y) < 1e-6
  );
  // Chair never spins 360 degrees
  assert.ok(Math.abs(extremeRight.chairRotY) < Math.PI / 2);
});

test('scroll progress moves camera closer and rotates chair smoothly', () => {
  const topPose = computeTargetChairPose({
    pointerX: 0,
    pointerY: 0,
    scrollProgress: 0,
  });
  const scrolledPose = computeTargetChairPose({
    pointerX: 0,
    pointerY: 0,
    scrollProgress: 1,
  });

  assert.ok(scrolledPose.cameraZ < topPose.cameraZ);
  assert.ok(scrolledPose.chairRotY > topPose.chairRotY);
});

test('dampValue smoothly interpolates toward target and respects dt=0', () => {
  assert.equal(dampValue(0, 10, 8, 0), 0);
  const step = dampValue(0, 10, 8, 0.016);
  assert.ok(step > 0 && step < 10);
});
