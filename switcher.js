// switcher.js — <grid-switcher>: cross-app switcher for the basedsecurity.net platform.
// Zero dependencies, no imports. Colors come from the host page's tron.css custom
// properties (with hardcoded fallbacks so it works on unthemed pages too).
(() => {
  const DEFAULT_REGISTRY = 'https://home.basedsecurity.net/api/apps';
  const HOME_URL = 'https://home.basedsecurity.net';

  const STYLE = `
    :host { all: initial; }
    .fab {
      position: fixed; z-index: 2147483000; width: 44px; height: 44px;
      bottom: 16px; border-radius: 10px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      background: rgba(5, 10, 14, 0.85);
      border: 1px solid var(--accent-primary, #00d4ff);
      box-shadow: 0 0 12px rgba(0, 212, 255, 0.35);
      transition: box-shadow .2s ease;
    }
    .fab:hover { box-shadow: 0 0 20px rgba(0, 212, 255, 0.7); }
    .fab.right { right: 16px; } .fab.left { left: 16px; }
    .fab svg { width: 22px; height: 22px; stroke: var(--accent-primary, #00d4ff); }
    .overlay {
      position: fixed; inset: 0; z-index: 2147483001;
      background: rgba(2, 6, 10, 0.92); backdrop-filter: blur(6px);
      display: none; align-items: center; justify-content: center;
    }
    .overlay.open { display: flex; }
    .panel { max-width: 720px; width: 90%; max-height: 80vh; overflow-y: auto; padding: 24px; }
    .title {
      font-family: var(--font-display, 'Orbitron', sans-serif);
      color: var(--accent-primary, #00d4ff); font-size: 14px;
      letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 20px; text-align: center;
    }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 14px; }
    .app {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 14px 8px; text-decoration: none; border-radius: 10px;
      border: 1px solid rgba(0, 212, 255, 0.25); background: rgba(5, 10, 14, 0.6);
      transition: border-color .15s ease, box-shadow .15s ease;
    }
    .app:hover { border-color: var(--accent-primary, #00d4ff); box-shadow: 0 0 14px rgba(0, 212, 255, 0.4); }
    .dot { width: 34px; height: 34px; border-radius: 8px; }
    .name {
      font-family: var(--font-display, 'Orbitron', sans-serif);
      color: var(--text-primary, #e0f7ff); font-size: 11px; letter-spacing: 0.08em; text-align: center;
    }
    .fallback { color: var(--text-primary, #e0f7ff); font-family: var(--font-display, 'Orbitron', sans-serif); text-align: center; }
    .fallback a { color: var(--accent-primary, #00d4ff); }
  `;

  const GRID_GLYPH = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>`;

  class GridSwitcher extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({ mode: 'open' });
      const pos = this.getAttribute('position') === 'bottom-left' ? 'left' : 'right';
      root.innerHTML = `
        <style>${STYLE}</style>
        <button class="fab ${pos}" aria-label="Open app switcher" title="The Grid">${GRID_GLYPH}</button>
        <div class="overlay" role="dialog" aria-label="Apps"><div class="panel"></div></div>
      `;
      this._overlay = root.querySelector('.overlay');
      this._panel = root.querySelector('.panel');
      this._loaded = false;
      root.querySelector('.fab').addEventListener('click', () => this._toggle());
      this._overlay.addEventListener('click', (e) => { if (e.target === this._overlay) this._toggle(false); });
      this._onKey = (e) => { if (e.key === 'Escape') this._toggle(false); };
      document.addEventListener('keydown', this._onKey);
    }

    disconnectedCallback() { document.removeEventListener('keydown', this._onKey); }

    _toggle(force) {
      const open = force !== undefined ? force : !this._overlay.classList.contains('open');
      this._overlay.classList.toggle('open', open);
      if (open && !this._loaded) this._load();
    }

    async _load() {
      const url = this.getAttribute('registry') || DEFAULT_REGISTRY;
      try {
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) throw new Error(`registry ${res.status}`);
        const data = await res.json();
        this._render(data.apps || []);
        this._loaded = true;
      } catch {
        this._panel.innerHTML = `<p class="fallback">Registry unreachable — <a href="${HOME_URL}">Grid Home</a></p>`;
      }
    }

    _render(apps) {
      const current = location.hostname;
      const filtered = apps.filter((a) => {
        try { return new URL(a.href).hostname !== current; } catch { return true; }
      });

      this._panel.innerHTML = '<h2 class="title">The Grid</h2>';
      const grid = document.createElement('div');
      grid.className = 'grid';

      for (const a of filtered) {
        let safeHref = null;
        try {
          const parsed = new URL(a.href);
          if (parsed.protocol === 'http:' || parsed.protocol === 'https:') safeHref = a.href;
        } catch { /* skip unparseable URLs */ }
        if (!safeHref) continue;

        const link = document.createElement('a');
        link.className = 'app';
        link.href = safeHref;

        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.style.background = /^#[0-9a-fA-F]{3,8}$/.test(a.color)
          ? a.color : 'var(--accent-primary, #00d4ff)';

        const name = document.createElement('span');
        name.className = 'name';
        name.textContent = a.name;

        link.appendChild(dot);
        link.appendChild(name);
        grid.appendChild(link);
      }

      this._panel.appendChild(grid);
    }
  }

  if (!customElements.get('grid-switcher')) customElements.define('grid-switcher', GridSwitcher);
})();
