import { layout } from './layout.js';
import { footer } from './footer.js';

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
    icon: '🔍',
    status: 'Active',
    category: 'Network',
    accent: 'mauve',
    title: 'DNS Lookup',
    desc: 'Query public DNS-over-HTTPS resolvers for A, AAAA, MX, TXT, CNAME, and other record types.',
    href: '/dns-lookup',
    active: true
  },
  {
    icon: '🔗',
    status: 'Active',
    category: 'Text',
    accent: 'green',
    title: 'Text Extractor',
    desc: 'Paste logs, HTML, or markdown and extract URLs, emails, domains, or IP addresses with deduplication, sorting, and one-click copy.',
    href: '/text-extractor',
    active: true
  },
  {
    icon: '🧩',
    status: 'Active',
    category: 'Regex',
    accent: 'mauve',
    title: 'Regex Playground',
    desc: 'Test, visualize, and debug regular expressions in real-time. Includes syntax highlighting, match breakdowns, and group captures.',
    href: '/regex-playground',
    active: true
  },
  {
    icon: '📊',
    status: 'Active',
    category: 'Data',
    accent: 'green',
    title: 'Spreadsheet Viewer',
    desc: 'Open CSV, TSV, Excel, ODS, JSON, or Markdown tables locally. Sort, filter, paginate, and export to CSV.',
    href: '/spreadsheet-viewer',
    active: true
  },
  {
    icon: '📝',
    status: 'Active',
    category: 'Writing',
    accent: 'blue',
    title: 'Markdown Editor',
    desc: 'Write Markdown with a live split-pane preview, formatting toolbar, and one-click HTML or .md export.',
    href: '/markdown-editor',
    active: true
  },
  {
    icon: '🌩️',
    status: 'Active',
    category: 'Fun',
    accent: 'red',
    title: 'DDoS Simulator',
    desc: 'Farm a botnet by clicking the map, manage your trace, buy upgrades, and pwn 7 targets — or play defense against waves. 100% simulated.',
    href: '/ddos-simulator',
    active: true
  },
];

const categories = Array.from(new Set(tools.map(t => t.category)));

const toolCard = (tool: typeof tools[0], index: number) => `
  <div class="tb-card tool-card tool-card--${tool.accent} ${tool.active ? 'active' : ''}" style="animation-delay: ${index * 60}ms" data-tool-card data-tool-title="${tool.title}" data-tool-icon="${tool.icon}" data-tool-category="${tool.category}">
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
  title: 'Skiddle Toolbox · Cloudflare Workers Hub',
  centered: true,
  compactHeader: true,
  themeVariant: 'pills',
  body: `
    <section class="home-hero">
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="hero-badge">
        <span class="pulse-dot"></span>
        Running on Cloudflare Workers + Hono
      </div>
      <h1 class="home-hero__title">Skiddle Toolbox</h1>
      <p class="home-hero__subtitle">A collection of responsive client-side utilities hosted at the edge. Pick a tool below and start debugging in your browser.</p>
      <div class="home-stats">
        <div class="home-stat">
          <span class="home-stat__value">${tools.length}</span>
          <span class="home-stat__label">Tools</span>
        </div>
        <div class="home-stat">
          <span class="home-stat__value">${categories.length}</span>
          <span class="home-stat__label">Categories</span>
        </div>
      </div>
    </section>

    <section class="tb-card home-controls">
      <div class="home-search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" id="home-search-input" class="tb-input" placeholder="Search tools by name or keyword..." oninput="filterHomeTools()">
        <button type="button" class="tb-btn tb-btn-secondary home-shortcuts-btn" onclick="window.toolbox.openShortcuts()" title="Keyboard shortcuts" aria-label="Keyboard shortcuts">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6" y2="8.01"></line><line x1="10" y1="8" x2="10" y2="8.01"></line><line x1="14" y1="8" x2="14" y2="8.01"></line><line x1="18" y1="8" x2="18" y2="8.01"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          Shortcuts
        </button>
      </div>
      <div class="home-categories" id="home-categories" role="group" aria-label="Filter by category">
        <button type="button" class="category-chip active" data-category="all" onclick="filterHomeCategory('all')" aria-pressed="true">All</button>
        ${categories.map(c => `<button type="button" class="category-chip" data-category="${c}" onclick="filterHomeCategory('${c}')" aria-pressed="false">${c}</button>`).join('\n        ')}
      </div>
    </section>

    <section class="tb-card recent-tools-card" id="recent-tools-card" style="display:none;">
      <div class="section-header">
        <h2 class="section-title">Recent Tools</h2>
        <button type="button" class="tb-btn tb-btn-secondary" style="padding:6px 12px;font-size:0.78rem;" onclick="window.toolbox.clearRecentTools()">Clear</button>
      </div>
      <div data-recent-tools></div>
    </section>

    <div class="tools-grid" id="tools-grid">
      ${tools.map((t, i) => toolCard(t, i)).join('\n')}
    </div>

    <div id="home-empty" class="empty-state tb-hidden">
      <p>No tools match your search</p>
      <span>Try a different keyword or category.</span>
    </div>

    ${footer()}

    <style>
      .tb-header-center {
        padding-bottom: 12px;
        border-bottom: none;
      }
      .tb-header-center .tb-logo {
        margin-bottom: 4px;
      }

      .home-hero {
        position: relative;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 18px;
        padding: 24px 0 32px;
        overflow: hidden;
      }

      .hero-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 520px;
        height: 320px;
        background: radial-gradient(ellipse at center, color-mix(in srgb, var(--accent-primary) 22%, transparent) 0%, transparent 70%);
        filter: blur(40px);
        pointer-events: none;
        z-index: -1;
        opacity: 0.8;
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
        backdrop-filter: blur(8px);
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

      .home-hero__title {
        font-size: 3.4rem;
        font-weight: 800;
        letter-spacing: -1.5px;
        line-height: 1.05;
        background: var(--gradient-accent);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0;
      }

      .home-hero__subtitle {
        font-size: 1.15rem;
        color: var(--text-secondary);
        max-width: 620px;
        line-height: 1.65;
        margin: 0;
      }

      .home-stats {
        display: flex;
        gap: 28px;
        margin-top: 8px;
      }

      .home-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .home-stat__value {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--text-primary);
        line-height: 1;
      }

      .home-stat__label {
        font-size: 0.72rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: var(--text-muted);
      }

      .home-controls {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
        position: sticky;
        top: 66px;
        z-index: 50;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
      }

      .home-search {
        position: relative;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .home-search > svg {
        position: absolute;
        left: 14px;
        color: var(--text-muted);
        pointer-events: none;
      }

      .home-search .tb-input {
        padding-left: 42px;
        background: color-mix(in srgb, var(--ctp-mantle) 50%, transparent);
        flex: 1;
      }

      .home-shortcuts-btn {
        flex-shrink: 0;
        padding: 10px 14px;
        white-space: nowrap;
      }

      .home-categories {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .category-chip {
        background: color-mix(in srgb, var(--ctp-surface0) 40%, transparent);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: 999px;
        padding: 7px 16px;
        font-family: var(--font-sans);
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .category-chip:hover {
        border-color: var(--border-color-glow);
        color: var(--text-primary);
        background: color-mix(in srgb, var(--ctp-surface0) 65%, transparent);
      }

      .category-chip.active {
        background: var(--gradient-accent);
        color: var(--ctp-crust);
        border-color: transparent;
        box-shadow: 0 4px 14px color-mix(in srgb, var(--accent-primary) 35%, transparent);
      }

      .recent-tools-card {
        margin-bottom: 24px;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
      }

      .section-title {
        font-size: 0.85rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.7px;
        color: var(--text-secondary);
        margin: 0;
      }

      .recent-tools-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .recent-tool-link {
        gap: 8px;
        padding: 8px 12px;
        font-size: 0.82rem;
      }

      .recent-tool-icon {
        font-size: 1rem;
      }

      .tools-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 26px;
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

      .tool-card.tb-hidden {
        display: none;
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
        border-color: color-mix(in srgb, var(--card-accent-color, var(--accent-primary)) 50%, var(--border-color));
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
      .tool-card--mauve {
        --card-accent: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        --card-accent-color: var(--accent-primary);
      }
      .tool-card--green {
        --card-accent: linear-gradient(135deg, var(--ctp-green), var(--ctp-teal));
        --card-accent-color: var(--ctp-green);
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
        width: 52px;
        height: 52px;
        border-radius: var(--radius-md);
        background: color-mix(in srgb, var(--ctp-surface1) 55%, transparent);
        border: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
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

      @media (max-width: 640px) {
        .home-hero__title { font-size: 2.4rem; }
        .home-hero__subtitle { font-size: 1rem; }
        .home-stats { gap: 18px; }
        .home-controls { top: 58px; }
        .tools-grid { grid-template-columns: 1fr; }
      }
    </style>

    <script>
      (function () {
        let activeCategory = 'all';

        function updateEmptyState() {
          const visible = document.querySelectorAll('.tool-card:not(.tb-hidden)');
          const empty = document.getElementById('home-empty');
          empty.classList.toggle('tb-hidden', visible.length > 0);
        }

        window.filterHomeTools = function () {
          const term = document.getElementById('home-search-input').value.toLowerCase().trim();
          document.querySelectorAll('.tool-card').forEach(card => {
            const title = card.dataset.toolTitle.toLowerCase();
            const desc = card.querySelector('.tool-desc').innerText.toLowerCase();
            const category = card.dataset.toolCategory.toLowerCase();
            const matchesTerm = !term || title.includes(term) || desc.includes(term) || category.includes(term);
            const matchesCategory = activeCategory === 'all' || card.dataset.toolCategory === activeCategory;
            card.classList.toggle('tb-hidden', !(matchesTerm && matchesCategory));
          });
          updateEmptyState();
        };

        window.filterHomeCategory = function (category) {
          activeCategory = category;
          document.querySelectorAll('.category-chip').forEach(btn => {
            const isActive = btn.dataset.category === category;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
          });
          filterHomeTools();
        };

        function showRecentIfAny() {
          try {
            const raw = localStorage.getItem('toolbox-recent');
            const recent = raw ? JSON.parse(raw) : [];
            if (Array.isArray(recent) && recent.length > 0) {
              document.getElementById('recent-tools-card').style.display = '';
            }
          } catch (e) {
            console.error('Recent tools parse error:', e);
          }
        }

        showRecentIfAny();
      })();
    </script>
  `
});
