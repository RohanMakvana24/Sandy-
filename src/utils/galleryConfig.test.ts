import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  GALLERY_SECTION_COPY,
  GALLERY_CATEGORIES,
  DEFAULT_PORTFOLIO_ITEMS,
} from './galleryConfig';

test('Phase 6 section copy matches exact specification without fabricated claims', () => {
  assert.equal(GALLERY_SECTION_COPY.sectionId, 'gallery');
  assert.equal(GALLERY_SECTION_COPY.eyebrow, '06 / OUR WORK');
  assert.equal(GALLERY_SECTION_COPY.headlineLine1, 'EVERY CUT.');
  assert.equal(GALLERY_SECTION_COPY.headlineLine2, 'A MASTERPIECE.');
  assert.equal(
    GALLERY_SECTION_COPY.supportingDescription,
    'Explore the looks. Discover the details. Find your signature style.'
  );
});

test('GALLERY_CATEGORIES contains configurable categories including All Work and styles', () => {
  const ids = GALLERY_CATEGORIES.map((c) => c.id);
  assert.ok(ids.includes('all'));
  assert.ok(ids.includes('haircuts'));
  assert.ok(ids.includes('fades'));
  assert.ok(ids.includes('beard'));
  assert.ok(ids.includes('styling'));
  assert.ok(ids.includes('transformations'));
});

test('DEFAULT_PORTFOLIO_ITEMS contains 6 initial gallery entries with valid image paths and no invented customer identities', () => {
  assert.equal(DEFAULT_PORTFOLIO_ITEMS.length, 6);

  DEFAULT_PORTFOLIO_ITEMS.forEach((item) => {
    assert.ok(item.number.length === 2, 'Number must be 2-digit formatted');
    assert.ok(item.title.length > 0, 'Must have a title');
    assert.ok(item.description.length > 0, 'Must have a description');
    assert.ok(
      item.imageUrl.startsWith('/assets/gallery/'),
      'Image URL must reference local asset'
    );
    // Ensure no fake customer names or fabricated reviews
    assert.ok(
      !/\b(?:john|david|client says|5 stars|review|verified customer)\b/i.test(
        item.description
      ),
      'Must not fabricate customer names or reviews'
    );
  });
});
