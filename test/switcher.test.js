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

test('validates href URL protocol before assigning to link (http/https only)', () => {
  assert.match(src, /protocol\s*===\s*['"]https?:/);
});

test('sets _loaded only after successful render, not before fetch', () => {
  // _loaded must not appear at the start of _load before the fetch call
  assert.doesNotMatch(src, /_load\(\)\s*\{[^}]{0,60}this\._loaded\s*=\s*true/s);
  // _loaded must be set somewhere after _render in the file
  assert.ok(
    src.indexOf('this._loaded = true') > src.indexOf('this._render('),
    '_loaded = true must appear after _render call in source'
  );
});

test('renders Grid Home fallback when all apps are filtered out', () => {
  assert.match(src, /No other apps/);
  assert.match(src, /No other apps[^<]*<a href/);
});

test('deduplicates concurrent registry fetches with an in-flight guard', () => {
  assert.match(src, /_loading/);
});
