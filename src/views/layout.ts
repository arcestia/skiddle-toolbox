import { scriptTag, styleTag } from '../lib/assets.js';

export interface PageContext {
  title: string;
  subtitle?: string;
  centered?: boolean;
  compactHeader?: boolean;
  backHref?: string;
  themeVariant?: 'dots' | 'pills';
  body: string;
}

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
  ${scriptTag()}
  <script>
    (function() {
      try {
        const layouts = ['default', 'compact', 'wide'];
        const raw = localStorage.getItem('toolbox-layout');
        const layout = layouts.includes(raw) ? raw : 'default';
        document.documentElement.classList.add('tb-layout-' + layout);
      } catch (e) {}
    })();
  </script>
</head>
<body>
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

  <div class="tb-container ${ctx.centered ? 'tb-container--centered' : ''}">
    ${ctx.body}
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
          <div data-tb-theme-bar="pills"></div>
        </label>
        <label class="tb-settings-row tb-settings-row--stack">
          <span>Layout template</span>
          <div class="tb-layout-options" id="tb-layout-options">
            <button type="button" class="tb-layout-option" data-layout="default" onclick="window.toolbox.setLayout('default')">
              <strong>Default</strong>
              <span>Balanced spacing and card size</span>
            </button>
            <button type="button" class="tb-layout-option" data-layout="compact" onclick="window.toolbox.setLayout('compact')">
              <strong>Compact</strong>
              <span>Smaller hero and tighter spacing</span>
            </button>
            <button type="button" class="tb-layout-option" data-layout="wide" onclick="window.toolbox.setLayout('wide')">
              <strong>Wide</strong>
              <span>Full-width container for large screens</span>
            </button>
          </div>
        </label>
        <label class="tb-settings-row">
          <span>Compact mode</span>
          <input type="checkbox" id="tb-setting-compact" onchange="window.toolbox.toggleCompact(this.checked)">
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
