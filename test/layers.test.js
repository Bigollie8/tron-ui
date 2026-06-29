import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const base = readFileSync(new URL('../base.css', import.meta.url), 'utf8');
const comp = readFileSync(new URL('../components.css', import.meta.url), 'utf8');

test('base.css has global base + scanline + a11y', () => {
  assert.match(base, /#root::before/);            // scanline overlay
  assert.match(base, /::-webkit-scrollbar/);
  assert.match(base, /:focus-visible/);
  assert.match(base, /prefers-reduced-motion/);
});

test('base.css does NOT redefine theme tokens (those live in tron.css)', () => {
  assert.doesNotMatch(base, /:root\[data-theme="legacy"\]/);
});

test('components.css has the core .tron-* classes and keyframes', () => {
  for (const cls of ['.tron-card', '.tron-btn', '.tron-input', '.tron-tab', '.tron-badge', '.tron-md', '.tron-grid-bg']) {
    assert.ok(comp.includes(cls), `missing ${cls}`);
  }
  assert.match(comp, /@keyframes tron-breathe/);
});

test('components.css does NOT contain recharts or PWA app-specific rules', () => {
  assert.doesNotMatch(comp, /recharts/);
  assert.doesNotMatch(comp, /offline-bar/);
});
