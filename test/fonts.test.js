import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../fonts.css', import.meta.url), 'utf8');

test('imports the three TRON typefaces at the required weights', () => {
  assert.match(css, /@fontsource\/orbitron\/400\.css/);
  assert.match(css, /@fontsource\/orbitron\/600\.css/);
  assert.match(css, /@fontsource\/orbitron\/700\.css/);
  assert.match(css, /@fontsource\/jetbrains-mono\/400\.css/);
  assert.match(css, /@fontsource\/jetbrains-mono\/600\.css/);
  assert.match(css, /@fontsource\/jetbrains-mono\/700\.css/);
  assert.match(css, /@fontsource\/inter\/400\.css/);
  assert.match(css, /@fontsource\/inter\/600\.css/);
});
