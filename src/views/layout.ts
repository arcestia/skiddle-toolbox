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
</head>
<body>
  <div class="tb-container">
    <header class="tb-header ${ctx.centered ? 'tb-header-center' : ''}">
      <div class="tb-brand">
        <div class="tb-logo ${ctx.centered ? 'tb-logo-lg' : ''}">TB</div>
        ${ctx.compactHeader ? '' : `
        <div class="tb-brand-title">
          <h1 class="tb-gradient-text">${ctx.title.replace(' · Developer Toolbox', '').replace(' · ', ' ')}</h1>
          ${ctx.subtitle ? `<p>${ctx.subtitle}</p>` : ''}
        </div>
        `}
      </div>
      ${ctx.backHref ? `
      <div class="tb-header-actions">
        <div data-tb-theme-bar="${ctx.themeVariant ?? 'dots'}"></div>
        <a href="${ctx.backHref}" class="tb-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="transform: rotate(180deg);"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          Back
        </a>
      </div>
      ` : `
      <div data-tb-theme-bar="${ctx.themeVariant ?? 'pills'}"></div>
      `}
    </header>
    ${ctx.body}
  </div>
</body>
</html>`;
