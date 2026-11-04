import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initSmoothScroll,
  getSmoothScroll,
  scrollToTarget,
  setSmoothScrollLocked,
  destroySmoothScroll,
} from './smoothScroll';

test('smoothScroll exports valid utility functions that handle SSR and browser gracefully', () => {
  assert.strictEqual(typeof initSmoothScroll, 'function');
  assert.strictEqual(typeof getSmoothScroll, 'function');
  assert.strictEqual(typeof scrollToTarget, 'function');
  assert.strictEqual(typeof setSmoothScrollLocked, 'function');
  assert.strictEqual(typeof destroySmoothScroll, 'function');

  // In Node environment without window, initSmoothScroll returns null safely
  const instance = initSmoothScroll();
  assert.strictEqual(instance, null);
  assert.strictEqual(getSmoothScroll(), null);

  // setSmoothScrollLocked and scrollToTarget do not throw without DOM
  assert.doesNotThrow(() => {
    scrollToTarget('#services');
    setSmoothScrollLocked(true);
    setSmoothScrollLocked(false);
    destroySmoothScroll();
  });
});
