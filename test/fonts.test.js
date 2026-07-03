import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../fonts.css', import.meta.url), 'utf8');

test('fonts.css uses @font-face declarations (not bundler @import)', () => {
  assert.match(css, /@font-face/);
});

test('fonts.css references all three TRON typefaces', () => {
  assert.match(css, /font-family:\s*['"]Orbitron['"]/);
  assert.match(css, /font-family:\s*['"]JetBrains Mono['"]/);
  assert.match(css, /font-family:\s*['"]Inter['"]/);
});

test('fonts.css uses relative woff2 urls into fonts/ directory', () => {
  assert.match(css, /url\(['"]?\.\/fonts\//);
  assert.match(css, /format\(['"]woff2['"]\)/);
});

test('fonts.css covers all required weights for each typeface', () => {
  // Orbitron 400/600/700
  assert.match(css, /orbitron-latin-400-normal\.woff2/);
  assert.match(css, /orbitron-latin-600-normal\.woff2/);
  assert.match(css, /orbitron-latin-700-normal\.woff2/);
  // JetBrains Mono 400/600/700
  assert.match(css, /jetbrains-mono-latin-400-normal\.woff2/);
  assert.match(css, /jetbrains-mono-latin-600-normal\.woff2/);
  assert.match(css, /jetbrains-mono-latin-700-normal\.woff2/);
  // Inter 400/600
  assert.match(css, /inter-latin-400-normal\.woff2/);
  assert.match(css, /inter-latin-600-normal\.woff2/);
});
