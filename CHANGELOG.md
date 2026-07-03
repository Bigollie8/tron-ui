# Changelog

## v3.0.0 — 2026-07-03
- New: `switcher.js` — `<grid-switcher>` web component (corner glyph → app overlay, fed by the launchpad registry, Authentik cookie auth). Import via `tron-ui/switcher.js` or a `<script type="module">` tag.
- Registry data is sanitized (DOM construction, http/https-only hrefs); failed registry fetches retry on next open.
- Policy: releases are immutable semver tags from now on. Pin exact tags (`#v3.0.0`).

## v2 — 2026-06-30
- `base.css` + `components.css` layers extracted from TheGrid.

## v1 — 2026-06-29
- Initial token contract (`tron.css`) + self-hosted fonts (`fonts.css`).
