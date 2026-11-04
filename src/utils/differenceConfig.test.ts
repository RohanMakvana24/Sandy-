import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DIFFERENCE_SECTION_COPY,
  EDITORIAL_FEATURE_ROWS,
} from './differenceConfig';

test('Phase 5 copy matches exact specification without invented awards or claims', () => {
  assert.equal(DIFFERENCE_SECTION_COPY.eyebrow, '05 / THE SANDY DIFFERENCE');
  assert.equal(DIFFERENCE_SECTION_COPY.headlineLine1, 'NOT JUST A CUT.');
  assert.equal(DIFFERENCE_SECTION_COPY.headlineLine2, 'A STATEMENT.');
  assert.equal(
    DIFFERENCE_SECTION_COPY.supportingDescription,
    'Where precision, personal style, and thoughtful grooming come together.'
  );
  assert.equal(
    DIFFERENCE_SECTION_COPY.bottomStatementLabel,
    'THE SANDY PHILOSOPHY'
  );
  assert.equal(DIFFERENCE_SECTION_COPY.bottomStatementLine1, 'YOUR STYLE.');
  assert.equal(DIFFERENCE_SECTION_COPY.bottomStatementLine2, 'OUR PASSION.');
});

test('EDITORIAL_FEATURE_ROWS contains the exact 4 editable horizontal rows', () => {
  assert.equal(EDITORIAL_FEATURE_ROWS.length, 4);

  const expected = [
    {
      number: '01',
      title: 'THE ART OF PRECISION',
      description:
        'Every detail is considered. Every style is approached with intention.',
    },
    {
      number: '02',
      title: 'PERSONAL STYLE',
      description:
        'Grooming that complements your individuality and personal expression.',
    },
    {
      number: '03',
      title: 'THE GROOMING EXPERIENCE',
      description:
        'A thoughtful approach to comfort, style, and self-care.',
    },
    {
      number: '04',
      title: 'CONFIDENCE REDEFINED',
      description:
        'A refined look that helps you feel ready for every occasion.',
    },
  ];

  expected.forEach((item, idx) => {
    const row = EDITORIAL_FEATURE_ROWS[idx];
    assert.equal(row.number, item.number);
    assert.equal(row.title, item.title);
    assert.equal(row.description, item.description);
    // Ensure no unverified claims or invented stats
    assert.ok(
      !/\b(?:award|certified|best salon|100%|guaranteed|\d+\s+years)\b/i.test(
        row.description
      ),
      'Must not include unverified marketing claims'
    );
  });
});
