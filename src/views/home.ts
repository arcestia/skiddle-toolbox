import { layout } from './layout.js';

const tools = [
  {
    icon: '🖼️',
    status: 'Active',
    title: 'Image CDN Validator',
    desc: 'Check bulk image link availability, response codes, Content-Types, and providers concurrently. Supports edge CORS proxying for local validation testing.',
    href: '/cdn-validator',
    active: true
  },
  {
    icon: '🌐',
    status: 'Active',
    title: 'API Tester',
    desc: 'Inspect HTTP requests and responses right in your browser. Supports custom methods, headers, body, and an optional CORS proxy for cross-origin debugging.',
    href: '/api-tester',
    active: true
  },
  {
    icon: '🔀',
    status: 'Planned',
    title: 'Redirect Planner',
    desc: 'Map incoming request paths to custom destinations and compile real-time redirection scripts for serverless platforms.',
    active: false
  },
  {
    icon: '🛡️',
    status: 'Planned',
    title: 'Security Headers Shield',
    desc: 'Select security control parameters (CSP, HSTS, X-Frame-Options) and configure edge response middlewares.',
    active: false
  }
];

const toolCard = (tool: typeof tools[0]) => `
  <div class="tb-card tool-card ${tool.active ? 'active' : ''}">
    <div>
      <div class="card-header-row">
        <span class="tool-icon">${tool.icon}</span>
        <span class="tb-badge ${tool.active ? 'tb-badge-active' : 'tb-badge-pending'}">${tool.status}</span>
      </div>
      <h2 class="tool-title">${tool.title}</h2>
      <p class="tool-desc">${tool.desc}</p>
    </div>
    ${tool.active
      ? `<a href="${tool.href}" class="tb-btn btn-full">Launch Tool</a>`
      : `<button class="tb-btn tb-btn-disabled btn-full" disabled>Planned Tool</button>`}
  </div>
`;

export const homeView = (): string => layout({
  title: 'Developer Toolbox · Cloudflare Workers Hub',
  subtitle: 'A collection of responsive client-side utilities hosted at the edge using Cloudflare Workers + Hono.',
  centered: true,
  themeVariant: 'pills',
  body: `
    <div class="tools-grid">
      ${tools.map(toolCard).join('\n')}
    </div>
    <style>
      .tb-header-center {
        padding-bottom: 34px;
      }
      .tb-header-center .tb-logo {
        margin-bottom: 4px;
      }
      .tb-header-center h1 {
        font-size: 2.5rem;
        letter-spacing: -0.5px;
      }
      .tb-header-center p {
        font-size: 1.1rem;
        max-width: 620px;
      }
      .tools-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 26px;
      }
      @media (max-width: 768px) {
        .tools-grid { grid-template-columns: 1fr; }
        .tb-header-center h1 { font-size: 2rem; }
      }
      .tool-card {
        min-height: 260px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
      }
      .tool-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: transparent;
        transition: background 0.35s ease;
      }
      .tool-card:hover {
        transform: translateY(-6px);
        border-color: var(--border-color-glow);
        background: var(--bg-card-hover);
        box-shadow: var(--shadow-lg);
      }
      .tool-card.active:hover::before {
        background: var(--gradient-accent);
      }
      .tool-card.active:hover {
        border-color: color-mix(in srgb, var(--ctp-mauve) 55%, var(--border-color));
      }
      .card-header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
      }
      .tool-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-md);
        background: color-mix(in srgb, var(--ctp-surface1) 50%, transparent);
        border: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.6rem;
        box-shadow: var(--shadow-sm);
      }
      .tool-title {
        font-size: 1.35rem;
        font-weight: 700;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .tool-desc {
        font-size: 0.96rem;
        color: var(--text-secondary);
        line-height: 1.65;
      }
      .btn-full { width: 100%; }
    </style>

    <footer class="tb-footer">
      <div>Build & Deploy this Worker: <code>npm run deploy</code></div>
      <div class="tb-crafted">Crafted with <span>♥</span> and Catppuccin</div>
    </footer>
  `
});
