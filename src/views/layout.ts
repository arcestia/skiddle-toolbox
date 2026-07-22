import { scriptTag, styleTag } from '../lib/assets.js';
import { defaultTheme, themes } from '../lib/themes.js';
import { defaultLayout, layouts, renderLayoutOptions } from '../lib/layouts.js';
import { accents, defaultAccent } from '../lib/accents.js';
import { defaultRadius, radii } from '../lib/radius.js';
import { defaultDensity, densities } from '../lib/density.js';

export interface PageContext {
  title: string;
  subtitle?: string;
  centered?: boolean;
  compactHeader?: boolean;
  backHref?: string;
  themeVariant?: 'dots' | 'pills';
  body: string;
}

const layoutIds = layouts.map(l => l.id);
const accentIds = accents.map(a => a.id);
const radiusIds = radii.map(r => r.id);
const densityIds = densities.map(d => d.id);

const runtimeConfig = JSON.stringify({
  themes: themes.map(t => ({ id: t.id, name: t.name, swatch: t.swatch, pack: t.pack })),
  layouts: layouts.map(l => ({ id: l.id, name: l.name, description: l.description })),
  accents: accents.map(a => ({ id: a.id, name: a.name, hue: a.hue })),
  radii: radii.map(r => ({ id: r.id, name: r.name })),
  densities: densities.map(d => ({ id: d.id, name: d.name, description: d.description })),
  defaultTheme,
  defaultLayout,
  defaultAccent,
  defaultRadius,
  defaultDensity,
});

export const layout = (ctx: PageContext): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ctx.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  ${styleTag()}
  <script id="tb-config" type="application/json">${runtimeConfig}</script>
  ${scriptTag()}
  <script>
    (function() {
      try {
        const layouts = ${JSON.stringify(layoutIds)};
        const rawLayout = localStorage.getItem('toolbox-layout');
        const layout = layouts.includes(rawLayout) ? rawLayout : ${JSON.stringify(defaultLayout)};
        document.documentElement.classList.add('tb-layout-' + layout);

        const accents = ${JSON.stringify(accentIds)};
        const rawAccent = localStorage.getItem('toolbox-accent');
        const accent = accents.includes(rawAccent) ? rawAccent : ${JSON.stringify(defaultAccent)};
        document.documentElement.setAttribute('data-accent', accent);

        const radii = ${JSON.stringify(radiusIds)};
        const rawRadius = localStorage.getItem('toolbox-radius');
        const radius = radii.includes(rawRadius) ? rawRadius : ${JSON.stringify(defaultRadius)};
        document.documentElement.setAttribute('data-radius', radius);

        const densities = ${JSON.stringify(densityIds)};
        let rawDensity = localStorage.getItem('toolbox-density');
        if (!rawDensity) {
          try {
            const settings = JSON.parse(localStorage.getItem('toolbox-settings') || '{}');
            if (settings.compact) rawDensity = 'compact';
          } catch (e) {}
        }
        const density = densities.includes(rawDensity) ? rawDensity : ${JSON.stringify(defaultDensity)};
        document.documentElement.setAttribute('data-density', density);
      } catch (e) {}
    })();
  </script>
</head>
<body>
  <a class="tb-skip-link" href="#tb-main-content">Skip to main content</a>

  <div class="tb-top-bar">
    <a href="/" class="tb-top-bar__brand" aria-label="Skiddle Toolbox home">
      <div class="tb-logo tb-logo-sm">TB</div>
      <span class="tb-top-bar__title">
        ${ctx.centered ? 'Skiddle Toolbox' : `<span class="tb-top-bar__breadcrumb"><span class="tb-top-bar__breadcrumb-home">Skiddle Toolbox</span><span class="tb-top-bar__breadcrumb-sep" aria-hidden="true">/</span><span class="tb-top-bar__breadcrumb-current">${ctx.title.replace(' · Skiddle Toolbox', '')}</span></span>`}
      </span>
    </a>
    <div class="tb-top-bar__actions">
      <div class="tb-top-bar__actions-group">
        ${ctx.backHref ? `
        <a href="${ctx.backHref}" class="tb-top-bar__action" aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </a>
        ` : ''}
        <button type="button" class="tb-top-bar__action" onclick="window.toolbox.openSettings()" aria-label="Open settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
      </div>
    </div>
  </div>

  <div id="tb-main-content" class="tb-container ${ctx.centered ? 'tb-container--centered' : ''}">
    ${ctx.body}
  </div>

  <div id="tb-shortcuts-overlay" class="tb-overlay tb-hidden" onclick="if(event.target===this) window.toolbox.closeShortcuts()"></div>
  <div id="tb-shortcuts-modal" class="tb-settings-modal tb-shortcuts-modal tb-hidden" role="dialog" aria-modal="true" aria-labelledby="tb-shortcuts-title">
    <div class="tb-settings-modal__header">
      <h2 id="tb-shortcuts-title">Keyboard Shortcuts</h2>
      <button type="button" class="tb-settings-modal__close" onclick="window.toolbox.closeShortcuts()" aria-label="Close shortcuts">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
    <div class="tb-shortcuts-modal__body" id="tb-shortcuts-list">
      <!-- Populated dynamically by toolbox.js -->
    </div>
    <div class="tb-shortcuts-footer">
      <span class="tb-shortcuts-hint">Press <kbd>?</kbd> anywhere to open this dialog</span>
      <a href="https://github.com/arcestia/skiddle-toolbox" target="_blank" rel="noopener" class="tb-back-link" style="font-size:0.75rem;padding:5px 10px;">View on GitHub</a>
    </div>
  </div>

  <div id="tb-settings-overlay" class="tb-overlay tb-hidden" onclick="if(event.target===this) window.toolbox.closeSettings()"></div>
  <div id="tb-settings-modal" class="tb-settings-modal tb-hidden" role="dialog" aria-modal="true" aria-labelledby="tb-settings-title">
    <div class="tb-settings-modal__header">
      <h2 id="tb-settings-title">Settings</h2>
      <button type="button" class="tb-settings-modal__close" onclick="window.toolbox.closeSettings()" aria-label="Close settings">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
    <div class="tb-settings-modal__body">
      <div class="tb-settings-section">
        <h3>Appearance</h3>
        <label class="tb-settings-row tb-settings-row--stack">
          <span>Theme</span>
          <div class="tb-theme-select-row">
            <span class="tb-theme-swatch" id="tb-theme-swatch" aria-hidden="true"></span>
            <select id="tb-theme-select" class="tb-select" onchange="window.toolbox.setTheme(this.value)"></select>
          </div>
        </label>
        <label class="tb-settings-row tb-settings-row--stack">
          <span>Accent color</span>
          <div class="tb-accent-options" id="tb-accent-options">
            ${accents.map(a => `<button type="button" class="tb-accent-option" data-accent="${a.id}" onclick="window.toolbox.setAccent('${a.id}')" aria-label="${a.name} accent" aria-pressed="false">
              <span class="tb-accent-swatch" style="background:hsl(${a.hue} 85% 75%)" aria-hidden="true"></span>
              <span>${a.name}</span>
            </button>`).join('\n            ')}
          </div>
        </label>
        <label class="tb-settings-row tb-settings-row--stack">
          <span>Corner radius</span>
          <div class="tb-radius-options" id="tb-radius-options">
            ${radii.map(r => `<button type="button" class="tb-radius-option" data-radius="${r.id}" onclick="window.toolbox.setRadius('${r.id}')" aria-pressed="false">
              <strong>${r.name}</strong>
            </button>`).join('\n            ')}
          </div>
        </label>
        <label class="tb-settings-row tb-settings-row--stack">
          <span>Layout template</span>
          <div class="tb-layout-options" id="tb-layout-options">
            ${renderLayoutOptions()}
          </div>
        </label>
        <label class="tb-settings-row tb-settings-row--stack">
          <span>Density</span>
          <div class="tb-density-options" id="tb-density-options">
            ${densities.map(d => `<button type="button" class="tb-density-option" data-density="${d.id}" onclick="window.toolbox.setDensity('${d.id}')" aria-pressed="false">
              <strong>${d.name}</strong>
              <span>${d.description}</span>
            </button>`).join('\n            ')}
          </div>
        </label>
      </div>
      <div class="tb-settings-section">
        <h3>Data</h3>
        <button type="button" class="tb-btn tb-btn-secondary" onclick="window.toolbox.clearRecentTools()">Clear recent tools</button>
      </div>
      <div class="tb-settings-section">
        <h3>About</h3>
        <p class="tb-settings-about">Skiddle Toolbox — a developer utility suite on Cloudflare Workers + Hono.</p>
        <a href="https://github.com/arcestia/skiddle-toolbox" target="_blank" rel="noopener" class="tb-back-link">View on GitHub</a>
      </div>
    </div>
  </div>
</body>
</html>`;
