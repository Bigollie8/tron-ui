import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../switcher.js', import.meta.url), 'utf8');

test('registers the grid-switcher custom element', () => {
  assert.match(src, /customElements\.define\(\s*['"]grid-switcher['"]/);
});

test('defaults to the platform registry and sends credentials', () => {
  assert.match(src, /https:\/\/home\.basedsecurity\.net\/api\/apps/);
  assert.match(src, /credentials:\s*['"]include['"]/);
});

test('supports the registry and position attributes', () => {
  assert.match(src, /getAttribute\(['"]registry['"]\)/);
  assert.match(src, /getAttribute\(['"]position['"]\)/);
});

test('uses shadow DOM and inherits tron tokens with fallbacks', () => {
  assert.match(src, /attachShadow\(\{\s*mode:\s*['"]open['"]\s*\}\)/);
  assert.match(src, /var\(--accent-primary,\s*#00d4ff\)/);
});

test('degrades to a Grid Home link when the registry is unreachable', () => {
  assert.match(src, /https:\/\/home\.basedsecurity\.net(?!\/api)/);
  assert.match(src, /Grid Home/);
});

test('has no framework imports (must run in plain HTML pages)', () => {
  assert.doesNotMatch(src, /^import\s/m);
  assert.doesNotMatch(src, /require\(/);
});
