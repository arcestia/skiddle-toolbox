# Agent Notes for Skiddle Toolbox

This document contains project-specific guidance for AI coding agents working on this repository.

## Project Overview

**Skiddle Toolbox** is a server-side rendered utility suite running on **Cloudflare Workers** with **Hono**. All HTML pages, shared assets, and the CORS proxy are served by a single Worker.

- The root route (`/`) serves the landing page.
- Each tool is a server-rendered HTML page generated from a TypeScript view.
- The CORS proxy is available at `/api/cors?url=<encodedUrl>`.
- The project uses **TypeScript** and is bundled by Wrangler v3.

## Technology Stack

- **Runtime / Platform:** Cloudflare Workers.
- **Framework:** Hono (`hono`).
- **Language:** TypeScript (ES modules).
- **Markup / Styling:** HTML generated via template literals, styled by the shared design tokens in `assets/toolbox.css.txt`.
- **Bundler:** Wrangler v3.
- **Package Manager:** npm.

## Project Structure

```
├── assets/
│   ├── toolbox.css.txt        # Shared design system & component styles
│   ├── toolbox.js.txt         # Shared theme, settings & UI sync
│   ├── themes/                # Per-theme CSS overrides
│   │   ├── latte.css.txt
│   │   ├── frappe.css.txt
│   │   ├── macchiato.css.txt
│   │   ├── mocha.css.txt
│   │   ├── tokyo-night.css.txt
│   │   ├── nord.css.txt
│   │   ├── dracula.css.txt
│   │   ├── gruvbox.css.txt
│   │   ├── one-dark.css.txt
│   │   ├── github-dark.css.txt
│   │   ├── github-light.css.txt
│   │   ├── solarized-dark.css.txt
│   │   └── solarized-light.css.txt
│   └── layouts/               # Per-layout CSS overrides
│       ├── default.css.txt
│       ├── compact.css.txt
│       └── wide.css.txt
├── src/
│   ├── index.ts               # Hono app bootstrap + middleware
│   ├── routes/
│   │   ├── pages.ts           # HTML page routes
│   │   └── cors.ts            # CORS proxy route
│   ├── views/
│   │   ├── layout.ts          # Shared page shell
│   │   ├── footer.ts          # Shared page footer
│   │   ├── home.ts            # Landing page
│   │   ├── cdnValidator.ts    # Image CDN Validator page
│   │   ├── apiTester.ts       # API Tester page
│   │   ├── textExtractor.ts   # Text Extractor page
│   │   └── regexPlayground.ts # Regex Playground page
│   ├── lib/
│   │   ├── assets.ts          # Composes & inlines CSS/JS as raw strings
│   │   ├── themes.ts          # Theme registry & CSS composer
│   │   ├── layouts.ts         # Layout registry & options renderer
│   │   ├── accents.ts         # Accent color registry
│   │   ├── radius.ts          # Corner-radius preset registry
│   │   └── density.ts         # Density preset registry
│   └── types/
│       └── assets.d.ts        # Type declarations for raw asset imports
├── package.json
├── tsconfig.json
├── wrangler.toml
├── README.md
└── .gitignore
```

### Routing

- `src/routes/pages.ts` mounts routes at the root.
  - `GET /` → `homeView()`
  - `GET /cdn-validator` → `cdnValidatorView()`
  - `GET /api-tester` → `apiTesterView()`
  - `GET /dns-lookup` → `dnsLookupView()`
  - `GET /text-extractor` → `textExtractorView()`
  - `GET /regex-playground` → `regexPlaygroundView()`
  - `GET /spreadsheet-viewer` → `spreadsheetViewerView()`
  - `GET /markdown-editor` → `markdownEditorView()`
  - `GET /ddos-simulator` → `ddosSimulatorView()`
- `src/routes/cors.ts` mounts under `/api`.
  - `ALL /api/cors?url=...` → forwards the request to the target URL with permissive CORS headers.

### Static Assets

The shared CSS and JS live in `assets/` and are imported as raw text modules. `src/lib/assets.ts` composes the final inline stylesheet from the base CSS, theme registry, layout registry, accent registry, and radius registry, then inlines it into every page response via `src/views/layout.ts`.

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Type-check without emitting
npm run check

# Deploy to Cloudflare Workers
npm run deploy
```

`npm run dev` runs `wrangler dev`, which bundles `src/index.ts` and starts a local Worker on http://localhost:8788.

## Wrangler Configuration

`wrangler.toml`:

```toml
name = "skiddle-toolbox"
main = "src/index.ts"
compatibility_date = "2024-07-01"

rules = [
  { type = "Text", globs = ["**/*.css", "**/*.js"], fallthrough = true }
]
```

- `main` points to the Hono entry file.
- `rules` tells Wrangler to bundle `.css` and `.js` files as raw strings so they can be imported in TypeScript.

## Code Style and Conventions

- **TypeScript:** Use `const`/`let`, `async`/`await`, and explicit types where helpful. Avoid `any`.
- **Routes:** Keep routes in `src/routes/*.ts`. Business logic belongs in `src/lib/` or `src/views/`.
- **Views:** Each page is a function in `src/views/*.ts` that returns an HTML string via `layout()`.
- **Inline scripts:** Tool-specific browser JS may live inside the view as an inline `<script>` block.
- **Shared components:** Use `layout()` for the page shell and `assets.ts` for CSS/JS inlining.
- **CSS conventions:**
  - Shared styles live in `assets/toolbox.css.txt`.
  - Component classes are prefixed with `tb-`.
  - Design tokens are split into themes (`assets/themes/*.css.txt`), layouts (`assets/layouts/*.css.txt`), accent hue, radius presets, and density presets.
  - Page-specific styles can live in a small inline `<style>` block inside the view.
- **Theme & Settings:** `assets/toolbox.js.txt` reads runtime configuration injected by `layout.ts` and drives theme, layout, accent color, corner radius, and density controls. Choices are persisted in `localStorage` (`toolbox-theme`, `toolbox-layout`, `toolbox-accent`, `toolbox-radius`, `toolbox-density`) and synced across tabs. It also provides a global settings modal and tracks recently used tools in `localStorage` under `toolbox-recent`.

## Current Tools

### Image CDN Validator (`/cdn-validator`)

Validates a bulk list of image URLs.

Behavior agents should preserve:
- Input URLs are grouped by provider using `====== Provider Name` separator lines.
- Each URL is checked for a valid URL structure and `http`/`https` scheme.
- A 10-second timeout is applied to each request via `AbortController`.
- If the CORS proxy checkbox is enabled, the browser calls `/api/cors?url=<encodedUrl>` for `GET` requests; when opened via `file://`, it falls back to `https://corsproxy.io/?`.
- HEAD requests are used for direct fetches; GET is used when proxied.
- Results are categorized as `ok`, `bad`, or `warn`.
- Duplicate URLs are flagged but still counted once.
- Broken URLs can be copied to the clipboard.

### API Tester (`/api-tester`)

A lightweight, browser-local HTTP client.

Behavior agents should preserve:
- Runs entirely in the browser using `fetch()`.
- Supports common HTTP methods, editable headers, and a request body for POST/PUT/PATCH.
- Adds a default `https://` scheme if the URL has none.
- Applies a 10-second timeout via `AbortController`.
- Offers an optional CORS proxy toggle that routes through `/api/cors?url=<encodedUrl>` (or `https://corsproxy.io/?` when opened via `file://`).
- Displays response status, duration, size, headers, and body.
- Pretty-prints JSON bodies and warns clearly when the browser blocks a request due to CORS.

### Text Extractor (`/text-extractor`)

A lightweight tool to parse text (logs, HTML, markdown) and extract structured data.

Behavior agents should preserve:
- Supports extracting URLs, Emails, Domains, and IP addresses.
- Supports deduplication and sorting options.
- Executes client-side in the browser.
- Domain extraction handles boundary checking (using `index` from regexp matches to avoid shadows) and filters out email domains.

### Regex Playground (`/regex-playground`)

Interactive regular expression editor and visualizer.

Behavior agents should preserve:
- Real-time compilation and error checking in a dedicated input block.
- Match visualization with highlight span wrappers displaying matches on the original test string.
- Detailed matches breakdown cards listing indices, lengths, and captured group labels/values.
- Pre-defined loadable patterns (templates) and interactive cheatsheet sidebar.
- Executes completely client-side in the browser.

### Spreadsheet Viewer (`/spreadsheet-viewer`)

Browser-local spreadsheet and table viewer.

Behavior agents should preserve:
- Supports CSV, TSV, Excel (.xlsx/.xls), ODS, JSON, and Markdown tables.
- Runs entirely in the browser; binary files are parsed locally via SheetJS loaded from CDN.
- Provides sortable columns, row filtering, pagination, and CSV export.
- Supports multi-sheet Excel/ODS files via a sheet selector.
- Falls back to the `/api/cors?url=<encodedUrl>` proxy when loading a spreadsheet by URL.

### Markdown Editor (`/markdown-editor`)

Browser-local Markdown editor with live preview.

Behavior agents should preserve:
- Runs entirely in the browser using `marked` and `DOMPurify` loaded from CDN.
- Provides a split-pane editor and preview.
- Includes a formatting toolbar for common Markdown syntax.
- Supports loading `.md` files and exporting the source as `.md` or the preview as HTML.
### DDoS Simulator (`/ddos-simulator`)

Educational, fully client-side DDoS game on a dot-matrix world map.

Behavior agents should preserve:
- Sends **zero real network traffic**; all packets/arcs are canvas-drawn simulation. Never wire it to `fetch()` or the CORS proxy.
- Three modes: Campaign (default), Sandbox (free play), Defense Game.
- Campaign: botnet starts at zero and is farmed by clicking land dots on the map plus auto-scan/Worm upgrades; 7 target levels with capacity/mitigation/weakness/payout; credits shop with 5 upgrades; trace mechanic (100% = busted, lose 40% of bots); save persisted in `localStorage` under `toolbox-ddos-campaign` — auto-saved every 5s during campaign and on key events, plus a manual 💾 Save progress button and save-on-unload/hide. The save includes trace level and a timestamp: returning players earn offline bot farming (auto-scan + worm rates, capped at 4h) and slow offline trace decay (0.5%/s), so refreshing no longer clears heat. Saves can also be exported/imported as a copy-paste JSON string from the campaign panel — import normalizes through the same clamped `applySave()` path as load, including offline earnings, and fully replaces (not merges) the current save. Lifetime stats (bots farmed, credits earned, busts, targets pwned, playtime) are tracked in the save under `st` and rendered in the campaign panel's Lifetime strip. Endgame: pwning the final target sets `fp` and unlocks Prestige — resetting bots/credits/trace/upgrades/level for permanent +25% credits and +50 starting bots per prestige level (`pr` in the save); lifetime stats are kept, and Reset save wipes prestige too.
- Defense Game: escalating waves, max 2 active mitigations, best score in `localStorage` under `toolbox-ddos-best`.
- Attack types: UDP Flood, SYN Flood, HTTP Flood, DNS Amplification (two-hop arcs via a reflector), Slowloris (slow lingering connections); each has its own packet rate/size/weight and a per-defense effectiveness matrix.
- The world map is an embedded 72×36 equirectangular span grid rendered to a static offscreen canvas layer; no external map assets.
- Colors are read from the active theme's CSS variables and refreshed periodically so theme switching works live.



## Testing

There are currently no automated tests.

When making changes, verify manually:
1. Run `npm run dev`.
2. Open http://localhost:8788.
3. Click through each tool and run representative requests.
4. Check the CORS proxy directly: `curl -I "http://localhost:8788/api/cors?url=https%3A%2F%2Fexample.com"`.
5. Run `npm run check` for TypeScript errors.

## Security Considerations

- The CORS proxy in `src/routes/cors.ts` allows any origin (`*`) and forwards arbitrary request bodies and headers. This is intentional for a development/debugging utility but should not be exposed to untrusted user traffic without origin restrictions.
- The proxy strips `Content-Security-Policy` from upstream responses and deletes the `Host` header before forwarding.
- There is no authentication, rate limiting, or allow-list for proxy targets.
- Do not store secrets in source files. Use `wrangler secret` or environment variables (`vars` in `wrangler.toml`) if secrets become necessary.

## Adding a New Tool

1. Create a new view function in `src/views/<tool-name>.ts` that returns an HTML string via `layout()`.
2. Add the route in `src/routes/pages.ts` (e.g., `app.get('/my-tool', ...)`).
3. Add a card to `src/views/home.ts`.
4. Include the shared footer with `footer()` from `src/views/footer.ts`.
5. Re-use the shared `tb-*` component classes and inline any page-specific styles in a `<style>` block inside the view. Use `.empty-state` for consistent empty/search-no-results UI.
6. If server-side logic is needed, add it in `src/lib/` or directly in `src/routes/`.
