import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SERVICES_SECTION_COPY,
  DEFAULT_GROOMING_SERVICES,
  computeServiceObjectPose,
} from './servicesKinematics';

test('Section 04 introduction copy matches exact specification', () => {
  assert.equal(SERVICES_SECTION_COPY.exhibitionTitle, 'THE ART OF GROOMING');
  assert.equal(
    SERVICES_SECTION_COPY.subtitle,
    'Every detail matters. Every style tells a story.'
  );
  assert.equal(SERVICES_SECTION_COPY.eyebrow, '04 / OUR SERVICES');
  assert.equal(SERVICES_SECTION_COPY.headlineLine1, 'PRECISION IN');
  assert.equal(SERVICES_SECTION_COPY.headlineLine2, 'EVERY DETAIL.');
  assert.equal(
    SERVICES_SECTION_COPY.supportingDescription,
    'Explore grooming experiences crafted to elevate your individual style.'
  );
});

test('DEFAULT_GROOMING_SERVICES contains the exact 6 configurable service entries with no invented prices', () => {
  assert.equal(DEFAULT_GROOMING_SERVICES.length, 6);

  const expected = [
    {
      number: '01',
      title: 'Signature Haircut',
      description: 'Precision haircuts tailored to your personality.',
      objectType: 'scissors',
    },
    {
      number: '02',
      title: 'Beard Styling',
      description: 'Refined beard shaping and detailed finishing.',
      objectType: 'razor',
    },
    {
      number: '03',
      title: 'Hair Spa',
      description: 'A relaxing hair and scalp care experience.',
      objectType: 'bottle',
    },
    {
      number: '04',
      title: 'Hair Styling',
      description: 'Modern styling for a polished appearance.',
      objectType: 'dryer',
    },
    {
      number: '05',
      title: 'Facial & Skin Care',
      description: 'Refreshing grooming and skin care treatments.',
      objectType: 'skincare',
    },
    {
      number: '06',
      title: 'Hair Color',
      description: 'Contemporary hair color and finishing.',
      objectType: 'colorbowl',
    },
  ];

  expected.forEach((exp, idx) => {
    const item = DEFAULT_GROOMING_SERVICES[idx];
    assert.equal(item.number, exp.number);
    assert.equal(item.title, exp.title);
    assert.equal(item.description, exp.description);
    assert.equal(item.objectType, exp.objectType);
    assert.ok(
      !/[₹$]|\b(?:INR|Rs\.?)\b/i.test(item.description),
      'Must not invent prices'
    );
  });
});

test('computeServiceObjectPose scales from 0.72 to 1.0 during object transition and adapts to mobile', () => {
  const enteringPose = computeServiceObjectPose({
    pointerX: 0,
    pointerY: 0,
    scrollProgress: 0.5,
    transitionProgress: 0,
    activeIndex: 1,
    isMobile: false,
  });
  const settledPose = computeServiceObjectPose({
    pointerX: 0,
    pointerY: 0,
    scrollProgress: 0.5,
    transitionProgress: 1,
    activeIndex: 1,
    isMobile: false,
  });
  const mobilePose = computeServiceObjectPose({
    pointerX: 0,
    pointerY: 0,
    scrollProgress: 0.5,
    transitionProgress: 1,
    activeIndex: 1,
    isMobile: true,
  });

  assert.ok(enteringPose.objectScale < settledPose.objectScale);
  assert.ok(Math.abs(settledPose.objectScale - 1.0) < 1e-6);
  assert.ok(mobilePose.cameraZ > settledPose.cameraZ);
});
