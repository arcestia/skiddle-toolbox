import { layout } from './layout.js';
import { footer } from './footer.js';

export const creditsView = (): string => layout({
  title: 'Credits · Skiddle Toolbox',
  body: `
    <div class="tb-page-header">
      <div class="tb-tool-icon">🙏</div>
      <div class="tb-page-header__text">
        <h1>Credits</h1>
        <p>Standing on the shoulders of open source libraries, tools, and communities.</p>
      </div>
    </div>

    <section class="tb-card">
      <h2 class="section-title" style="margin-bottom: 16px;">Project</h2>
      <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 18px;">
        Skiddle Toolbox is a server-side rendered developer utility suite built for Cloudflare Workers.
        It is maintained by <a href="https://labs.skiddle.id/" target="_blank" rel="noopener" class="tb-back-link" style="padding: 0; border: none; background: transparent;">Skiddle Labs</a>.
      </p>
      <div class="tb-summary">
        <span class="tb-badge tb-badge-info">Cloudflare Workers</span>
        <span class="tb-badge tb-badge-info">Hono</span>
        <span class="tb-badge tb-badge-info">TypeScript</span>
      </div>
    </section>

    <section class="tb-card">
      <h2 class="section-title" style="margin-bottom: 16px;">Runtime Dependencies</h2>
      <div class="credits-list">
        <a href="https://hono.dev/" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>Hono</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">Web framework</span>
        </a>
      </div>
    </section>

    <section class="tb-card">
      <h2 class="section-title" style="margin-bottom: 16px;">Development Dependencies</h2>
      <div class="credits-list">
        <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>TypeScript</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">Typed JavaScript</span>
        </a>
        <a href="https://developers.cloudflare.com/workers/" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>Wrangler</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">CLI & bundler</span>
        </a>
        <a href="https://github.com/cloudflare/workers-types" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>@cloudflare/workers-types</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">Worker type definitions</span>
        </a>
      </div>
    </section>

    <section class="tb-card">
      <h2 class="section-title" style="margin-bottom: 16px;">Browser Libraries</h2>
      <div class="credits-list">
        <a href="https://sheetjs.com/" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>SheetJS</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">Spreadsheet parsing</span>
        </a>
        <a href="https://marked.js.org/" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>marked</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">Markdown rendering</span>
        </a>
        <a href="https://github.com/cure53/DOMPurify" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>DOMPurify</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">HTML sanitization</span>
        </a>
      </div>
    </section>

    <section class="tb-card">
      <h2 class="section-title" style="margin-bottom: 16px;">Themes & Design Inspiration</h2>
      <div class="credits-list">
        <a href="https://catppuccin.com/" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>Catppuccin</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">Pastel color palette</span>
        </a>
        <a href="https://github.com/enkia/tokyo-night-vscode-theme" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>Tokyo Night</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">VS Code theme</span>
        </a>
        <a href="https://www.nordtheme.com/" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>Nord</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">Arctic color palette</span>
        </a>
        <a href="https://draculatheme.com/" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>Dracula</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">Dark theme</span>
        </a>
        <a href="https://github.com/morhetz/gruvbox" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>Gruvbox</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">Retro groove color scheme</span>
        </a>
        <a href="https://github.com/atom/one-dark-ui" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>One Dark</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">Atom theme</span>
        </a>
        <a href="https://primer.style/" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>GitHub Primer</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">GitHub color system</span>
        </a>
        <a href="https://ethanschoonover.com/solarized/" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>Solarized</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">Precision colors</span>
        </a>
      </div>
    </section>

    <section class="tb-card">
      <h2 class="section-title" style="margin-bottom: 16px;">Typography</h2>
      <div class="credits-list">
        <a href="https://fonts.google.com/specimen/Outfit" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>Outfit</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">Primary typeface</span>
        </a>
        <a href="https://fonts.google.com/specimen/JetBrains+Mono" target="_blank" rel="noopener" class="tb-back-link credit-link">
          <span>JetBrains Mono</span>
          <span class="tb-muted" style="font-size: 0.78rem; font-weight: 500;">Monospace typeface</span>
        </a>
      </div>
    </section>

    ${footer()}

    <style>
      .credits-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 10px;
      }
      .credit-link {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
      }
    </style>
  `,
});
