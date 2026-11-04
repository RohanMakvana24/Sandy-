import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TESTIMONIALS_SECTION_COPY,
  DEFAULT_TESTIMONIALS,
} from './testimonialsConfig';

test('Phase 7 copy matches exact specification without exaggerated claims', () => {
  assert.equal(TESTIMONIALS_SECTION_COPY.sectionId, 'testimonials');
  assert.equal(TESTIMONIALS_SECTION_COPY.eyebrow, '07 / CLIENT STORIES');
  assert.equal(TESTIMONIALS_SECTION_COPY.headlineLine1, 'THE EXPERIENCE');
  assert.equal(TESTIMONIALS_SECTION_COPY.headlineLine2, 'SPEAKS FOR ITSELF.');
  assert.equal(
    TESTIMONIALS_SECTION_COPY.supportingDescription,
    'Discover what makes every visit a story worth sharing.'
  );

  // Bottom CTA
  assert.equal(
    TESTIMONIALS_SECTION_COPY.bottomCta.smallLabel,
    'YOUR NEXT EXPERIENCE AWAITS'
  );
  assert.equal(
    TESTIMONIALS_SECTION_COPY.bottomCta.mainHeadingLine1,
    'READY FOR YOUR'
  );
  assert.equal(
    TESTIMONIALS_SECTION_COPY.bottomCta.mainHeadingLine2,
    'SIGNATURE LOOK?'
  );
  assert.equal(
    TESTIMONIALS_SECTION_COPY.bottomCta.buttonText,
    'BOOK AN APPOINTMENT'
  );
});

test('DEFAULT_TESTIMONIALS contains editable, valid items with verified ratings and zero fabricated counts', () => {
  assert.ok(DEFAULT_TESTIMONIALS.length >= 3, 'Must have at least 3 reviews');

  DEFAULT_TESTIMONIALS.forEach((item) => {
    assert.ok(item.quote.length > 20, 'Quote must be meaningful');
    assert.ok(item.clientName.length > 0, 'Must have client attribution');
    assert.ok(
      item.rating >= 1 && item.rating <= 5,
      'Rating must be between 1 and 5'
    );
    assert.ok(item.serviceTag.length > 0, 'Must have service category tag');
    // Ensure no fabricated aggregate counts
    assert.ok(
      !/\b(?:10,000|50,000|millions of|best in the world)\b/i.test(item.quote),
      'Must not make fabricated count claims'
    );
  });
});
