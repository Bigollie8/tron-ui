# tron-ui

Shared TRON design tokens for the basedsecurity.net app ecosystem. Single source of truth for the TRON visual language (colors, typography, glows, spacing), extracted from TheGrid.

## Usage

Install (pinned to a tag):

```bash
npm install github:Bigollie8/tron-ui#v1
```

Import both files in your app entry, **before** your own CSS:

```js
import 'tron-ui/tron.css';   // CSS custom properties (the token contract)
import 'tron-ui/fonts.css';  // self-hosted Orbitron / JetBrains Mono / Inter
import './index.css';        // your app styles, which reference the tokens
```

Set the theme on the `<html>` element: `data-theme="legacy"` (default) or `data-theme="original"`.

## Contract

`tron.css` defines CSS custom properties under `:root[data-theme="legacy"]`,
`:root[data-theme="original"]`, and `[data-high-contrast="true"]`. These variable
names/values are the public API — consume them, do not redefine them. Updates ship
as new git tags; bump your dependency when you want them.
