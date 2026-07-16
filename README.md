# Skiddle Toolbox

A developer utility suite served from a single [Cloudflare Worker](https://workers.cloudflare.com/) using [Hono](https://hono.dev/). Every page is server-rendered HTML with all CSS and JavaScript inlined; all tool logic runs client-side in the browser. The Worker serves pages and proxies cross-origin requests for the tools that need them.

**Repository:** https://github.com/arcestia/skiddle-toolbox
**License:** [![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://unlicense.org) — public domain, use it however you like

## Contents

- [Features](#features)
- [Tools](#tools)
- [API endpoints](#api-endpoints)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Security considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Single-Worker architecture** — 11 server-rendered pages; shared styles and scripts are bundled as text modules and inlined into every response. There is no static file serving.
- **Theming system** — 13 themes (4 Catppuccin flavors and 9 IDE-inspired variants), 7 accent colors, 3 corner-radius presets, 3 density presets, and 3 layouts, managed from a global settings modal.
- **Persistent preferences** — settings are stored in `localStorage`, applied before first paint to avoid a theme flash, and synchronized across open tabs.
- **Tool discovery** — landing page with keyword search and recently-used tool tracking.
- **No client build step** — tool logic is plain browser JavaScript embedded in each page; TypeScript compilation covers the Worker only.

## Tools

| Tool | Route | Description |
|---|---|---|
| Image CDN Validator | `/cdn-validator` | Bulk validation of image URLs grouped by provider; checks response status and Content-Type, flags duplicates, and exports broken URLs. |
| API Tester | `/api-tester` | Browser-local HTTP client with custom methods, headers, and request body, optional CORS proxy, and a 10-second timeout. |
| DNS Lookup | `/dns-lookup` | DNS-over-HTTPS queries against Cloudflare, Google, or Quad9 resolvers for common record types. |
| Text Extractor | `/text-extractor` | Extracts URLs, emails, domains, and IP addresses from logs, HTML, or Markdown, with deduplication and sorting. |
| Regex Playground | `/regex-playground` | Real-time compilation, match highlighting, capture-group breakdowns, pattern templates, and a reference cheatsheet. |
| Spreadsheet Viewer | `/spreadsheet-viewer` | Local viewing of CSV, TSV, Excel (.xlsx/.xls), ODS, JSON, and Markdown tables via SheetJS, with sorting, filtering, and pagination. |
| Markdown Editor | `/markdown-editor` | Split-pane editor with live preview (marked + DOMPurify), formatting toolbar, and `.md`/HTML export. |
| DDoS Simulator | `/ddos-simulator` | Educational, fully client-side simulation game; see [DDoS Simulator](#ddos-simulator). |
| Credits | `/credits` | About and credits page. |
| Changelog | `/changelog` | Release notes rendered from `src/lib/changelog.ts`. |

### DDoS Simulator

An incremental game that is entirely simulated — no real network traffic is ever generated.

- **Campaign mode** — farm a botnet from zero, attack 7 progressively defended targets, and manage a trace level to avoid seizure. Includes a keyboard-accessible alternative to map clicking.
- **Persistence** — auto-save every 5 seconds and on page unload, a manual save button, and JSON export/import for moving saves between browsers.
- **Offline progress** — botnet growth continues while the page is closed (capped at 4 hours); trace decays slowly while away.
- **Progression systems** — lifetime statistics and a prestige reset granting permanent bonuses.
- **Additional modes** — Sandbox (free play across 5 attack types and 4 mitigations) and Defense (escalating waves).

## API endpoints

| Endpoint | Methods | Description |
|---|---|---|
| `/api/cors?url=...` | All | Permissive CORS proxy used by the browser-based tools. |
| `/api/dns?domain=...&type=...&provider=...` | GET | DNS-over-HTTPS proxy. Providers: `cloudflare` (default), `google`, `quad9`. |

## Tech stack

- **Runtime:** Cloudflare Workers
- **Framework:** Hono v4
- **Language:** TypeScript (strict mode, ESM)
- **Bundler:** Wrangler v4
- **Styling:** Custom Catppuccin-based design system; no CSS framework

## Project structure

```
├── assets/
│   ├── toolbox.css.txt        # Shared design system & component styles
│   ├── toolbox.js.txt         # Theme/settings sync, recent tools (inlined into every page)
│   ├── themes/                # 13 per-theme CSS overrides (Catppuccin + IDE packs)
│   └── layouts/               # Per-layout CSS overrides (default, compact, wide)
├── src/
│   ├── index.ts               # Hono app bootstrap + middleware
│   ├── routes/
│   │   ├── pages.ts           # All HTML page routes
│   │   ├── cors.ts            # Permissive CORS proxy
│   │   └── dns.ts             # DNS-over-HTTPS proxy
│   ├── views/
│   │   ├── layout.ts          # Shared page shell (top bar, settings modal)
│   │   ├── footer.ts          # Shared footer
│   │   ├── home.ts            # Landing page with tool search & recent tools
│   │   └── …                  # One view per tool (see table above)
│   ├── lib/
│   │   ├── assets.ts          # Composes & inlines CSS/JS as raw strings
│   │   ├── themes.ts          # Theme registry & CSS composer
│   │   ├── layouts.ts         # Layout registry
│   │   ├── accents.ts         # Accent color registry
│   │   ├── radius.ts          # Corner-radius presets
│   │   ├── density.ts         # Density presets
│   │   └── changelog.ts       # Changelog entries
│   └── types/
│       └── assets.d.ts        # Type declarations for raw text imports
├── scratch/                   # Ad-hoc Node scratch scripts (not part of the Worker)
├── package.json
├── tsconfig.json
└── wrangler.toml
```

## Getting started

Prerequisites: Node.js 18 or later and npm.

```bash
# Install dependencies
npm install

# Start the local development server
npm run dev
```

The server runs at http://localhost:8788.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local Wrangler development server |
| `npm run check` | Type-check with `tsc --noEmit` (the only automated verification) |
| `npm run deploy` | Deploy to Cloudflare Workers |

There are no automated tests. After making changes, run `npm run check` and verify the tools manually at http://localhost:8788. The proxy can be checked with:

```bash
curl -I "http://localhost:8788/api/cors?url=https%3A%2F%2Fexample.com"
```

## Deployment

```bash
npm run deploy
```

Requires a Cloudflare account and `wrangler login`.

## Security considerations

- `/api/cors` forwards arbitrary methods, headers, and bodies to arbitrary targets, returns `Access-Control-Allow-Origin: *`, strips upstream `Content-Security-Policy`, and has no authentication or rate limiting. This is intentional for a development utility — do not expose a deployed instance to untrusted traffic without adding restrictions.
- Do not store secrets in source files. Use `wrangler secret` or `vars` in `wrangler.toml`.

## Contributing

This is a personal project I build and maintain for myself — I'm not accepting pull requests or feature requests. If you want to change something, fork it: the code is [Unlicensed](LICENSE), so it's yours as much as mine. See [CONTRIBUTING.md](CONTRIBUTING.md).

If you're poking around a fork, behavior contracts for the tools and architecture notes (asset inlining, design-token registries, page shell) live in [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md).

## License

[The Unlicense](LICENSE) — released into the public domain. Copy, modify, sell, remix, whatever you want, for any purpose; no attribution required and no warranty given.
