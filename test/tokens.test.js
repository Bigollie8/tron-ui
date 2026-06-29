import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../tron.css', import.meta.url), 'utf8');

test('defines the legacy theme with canonical tokens', () => {
  assert.match(css, /:root\[data-theme="legacy"\]/);
  assert.match(css, /--bg-primary:\s*#050a0e;/);
  assert.match(css, /--accent-primary:\s*#00d4ff;/);
  assert.match(css, /--accent-primary-rgb:\s*0,\s*212,\s*255;/);
  assert.match(css, /--status-error:\s*#ff1744;/);
  assert.match(css, /--font-display:\s*'Orbitron'/);
});

test('defines the original theme', () => {
  assert.match(css, /:root\[data-theme="original"\]/);
  assert.match(css, /--accent-primary:\s*#0080ff;/);
});

test('defines the high-contrast accessibility overrides', () => {
  assert.match(css, /\[data-high-contrast="true"\]/);
});
