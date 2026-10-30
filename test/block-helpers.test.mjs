import assert from 'node:assert/strict';
import test from 'node:test';

import { formatPrice } from '../blocks/eth-ticker/eth-ticker.js';
import { shouldLoadMotionMedia } from '../blocks/video-hero/video-hero.js';

test('motion media respects reduced-motion, save-data and slow connections', () => {
  assert.equal(shouldLoadMotionMedia(), true);
  assert.equal(shouldLoadMotionMedia({ reducedMotion: true }), false);
  assert.equal(shouldLoadMotionMedia({ saveData: true }), false);
  assert.equal(shouldLoadMotionMedia({ effectiveType: 'slow-2g' }), false);
  assert.equal(shouldLoadMotionMedia({ effectiveType: '2g' }), false);
  assert.equal(shouldLoadMotionMedia({ effectiveType: '3g' }), true);
});

test('price formatting refuses invalid values and supports both currencies', () => {
  assert.equal(formatPrice(Number.NaN, 'USD'), '—');
  assert.match(formatPrice(1900, 'USD'), /1,900/);
  assert.match(formatPrice(2680, 'CAD'), /2,680/);
});
