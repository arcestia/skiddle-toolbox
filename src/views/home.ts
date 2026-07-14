import { layout } from './layout.js';

const tools = [
  {
    icon: '🖼️',
    status: 'Active',
    category: 'Validation',
    accent: 'teal',
    title: 'Image CDN Validator',
    desc: 'Bulk-check image URLs by provider, response code, and Content-Type. Concurrent validation with edge CORS proxying.',
    href: '/cdn-validator',
    active: true
  },
  {
    icon: '🌐',
    status: 'Active',
    category: 'HTTP',
    accent: 'blue',
    title: 'API Tester',
    desc: 'Browser-local HTTP client with custom methods, headers, body editor, and optional CORS proxy for cross-origin debugging.',
    href: '/api-tester',
    active: true
  },
  {
    icon: '🔀',
    status: 'Planned',
    category: 'Routing',
    accent: 'peach',
    title: 'Redirect Planner',
    desc: 'Map request paths to destinations and compile redirection rules for serverless platforms.',
    active: false
  },
  {
    icon: '🛡️',
    status: 'Planned',
    category: 'Security',
    accent: 'red',
    title: 'Security Headers Shield',
    desc: 'Configure CSP, HSTS, X-Frame-Options and other security response headers through an edge middleware builder.',
    active: false
  }
];

const toolCard = (tool: typeof tools[0], index: number) => `
  <div class="tb-card tool-card tool-card--${tool.accent} ${tool.active ? 'active' : ''}" style="animation-delay: ${index * 80}ms">
    <div class="card-top">
      <div class="card-header-row">
        <div class="tool-icon">${tool.icon}</div>
        <div class="card-badges">
          <span class="tb-tag tb-tag--${tool.accent}">${tool.category}</span>
          <span class="tb-badge ${tool.active ? 'tb-badge-active' : 'tb-badge-pending'}">${tool.status}</span>
        </div>
      </div>
      <h2 class="tool-title">${tool.title}</h2>
      <p class="tool-desc">${tool.desc}</p>
    </div>
    ${tool.active
      ? `<a href="${tool.href}" class="tb-btn btn-full">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          Launch Tool
        </a>`
      : `<button class="tb-btn tb-btn-disabled btn-full" disabled>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Planned Tool
        </button>`}
  </div>
`;

export const homeView = (): string => layout({
  title: 'Developer Toolbox · Cloudflare Workers Hub',
  centered: true,
  compactHeader: true,
  themeVariant: 'pills',
  body: `
    <section class="tb-hero">
      <div class="hero-badge">
        <span class="pulse-dot"></span>
        Running on Cloudflare Workers + Hono
      </div>
      <h1 class="tb-gradient-text">Developer Toolbox</h1>
      <p>A collection of responsive client-side utilities hosted at the edge. Pick a tool below and start debugging in your browser.</p>
    </section>

    <div class="tools-grid">
      ${tools.map((t, i) => toolCard(t, i)).join('\n')}
    </div>

    <footer class="tb-footer">
      <div>Build & deploy this Worker with <code>npm run deploy</code></div>
      <div class="tb-crafted">Crafted with <span>♥</span> and Catppuccin</div>
    </footer>

    <style>
      .tb-header-center {
        padding-bottom: 12px;
        border-bottom: none;
      }
      .tb-header-center .tb-logo {
        margin-bottom: 4px;
      }
      .tb-hero {
        padding: 8px 0 24px;
      }
      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--text-secondary);
        background: color-mix(in srgb, var(--ctp-surface0) 50%, transparent);
        border: 1px solid var(--border-color);
        padding: 6px 14px;
        border-radius: 999px;
      }
      .pulse-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--ctp-green);
        box-shadow: 0 0 0 0 color-mix(in srgb, var(--ctp-green) 50%, transparent);
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--ctp-green) 50%, transparent); }
        70% { box-shadow: 0 0 0 8px transparent; }
        100% { box-shadow: 0 0 0 0 transparent; }
      }
      .tools-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 26px;
      }
      @media (max-width: 768px) {
        .tools-grid { grid-template-columns: 1fr; }
      }
      .tool-card {
        min-height: 280px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
        background: linear-gradient(var(--ctp-mantle), var(--ctp-mantle)) padding-box,
                    var(--card-accent, var(--gradient-accent)) border-box;
        border: 1px solid transparent;
        opacity: 0;
        transform: translateY(18px);
        animation: cardEnter 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      @keyframes cardEnter {
        to { opacity: 1; transform: translateY(0); }
      }
      .tool-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--card-accent, var(--gradient-accent));
        opacity: 0;
        transition: opacity 0.35s ease;
      }
      .tool-card.active::before {
        opacity: 0.6;
      }
      .tool-card:hover {
        transform: translateY(-6px);
        border-color: color-mix(in srgb, var(--card-accent-color, var(--ctp-mauve)) 50%, var(--border-color));
        box-shadow: 0 20px 50px color-mix(in srgb, var(--ctp-crust) 60%, transparent);
      }
      .tool-card.active:hover::before {
        opacity: 1;
      }
      .tool-card--teal {
        --card-accent: linear-gradient(135deg, var(--ctp-teal), var(--ctp-green));
        --card-accent-color: var(--ctp-teal);
      }
      .tool-card--blue {
        --card-accent: linear-gradient(135deg, var(--ctp-sapphire), var(--ctp-lavender));
        --card-accent-color: var(--ctp-sapphire);
      }
      .tool-card--peach {
        --card-accent: linear-gradient(135deg, var(--ctp-peach), var(--ctp-yellow));
        --card-accent-color: var(--ctp-peach);
      }
      .tool-card--red {
        --card-accent: linear-gradient(135deg, var(--ctp-red), var(--ctp-maroon));
        --card-accent-color: var(--ctp-red);
      }
      .card-top {
        margin-bottom: 24px;
      }
      .card-header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 18px;
        gap: 12px;
      }
      .card-badges {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      .tool-icon {
        width: 50px;
        height: 50px;
        border-radius: var(--radius-md);
        background: color-mix(in srgb, var(--ctp-surface1) 55%, transparent);
        border: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.7rem;
        box-shadow: var(--shadow-sm);
        transition: transform 0.3s ease;
      }
      .tool-card:hover .tool-icon {
        transform: scale(1.08) rotate(-4deg);
      }
      .tool-title {
        font-size: 1.35rem;
        font-weight: 700;
        margin-bottom: 10px;
        color: var(--text-primary);
      }
      .tool-desc {
        font-size: 0.95rem;
        color: var(--text-secondary);
        line-height: 1.65;
      }
      .btn-full { width: 100%; }
    </style>
  `
});
