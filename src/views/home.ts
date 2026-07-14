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
    <footer class="tb-footer">
      <div>Build & Deploy this Worker: <code>npm run deploy</code></div>
      <div class="tb-crafted">Crafted with <span>♥</span> and Catppuccin</div>
    </footer>
  `
});
