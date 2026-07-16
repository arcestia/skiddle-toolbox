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
- **Markup / Styling:** HTML generated via template literals, styled by the shared Catppuccin `assets/toolbox.css`.
- **Bundler:** Wrangler v3.
- **Package Manager:** npm.

## Project Structure

```
├── assets/
│   ├── toolbox.css            # Shared Catppuccin design system
│   └── toolbox.js             # Shared theme switcher & cross-page sync
├── src/
│   ├── index.ts               # Hono app bootstrap + middleware
│   ├── routes/
│   │   ├── pages.ts           # HTML page routes
│   │   └── cors.ts            # CORS proxy route
│   ├── views/
│   │   ├── layout.ts          # Shared page shell
│   │   ├── home.ts            # Landing page
│   │   ├── cdnValidator.ts    # Image CDN Validator page
│   │   ├── apiTester.ts       # API Tester page
│   │   ├── textExtractor.ts   # Text Extractor page
│   │   └── regexPlayground.ts # Regex Playground page
│   ├── lib/
│   │   └── assets.ts          # Imports toolbox.css/toolbox.js as raw strings
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
- `src/routes/cors.ts` mounts under `/api`.
  - `ALL /api/cors?url=...` → forwards the request to the target URL with permissive CORS headers.

### Static Assets

The shared CSS and JS live in `assets/` and are imported as raw text modules via Wrangler's `rules` config in `wrangler.toml`. They are inlined into every page response by `src/lib/assets.ts` and `src/views/layout.ts`.

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
  - Shared styles live in `assets/toolbox.css`.
  - Component classes are prefixed with `tb-`.
  - Catppuccin token system with four switchable themes (Latte, Frappé, Macchiato, Mocha).
  - Page-specific styles can live in a small inline `<style>` block inside the view.
- **Theme:** The theme switcher is auto-injected by `assets/toolbox.js` into any element with `data-tb-theme-bar`. The chosen theme is persisted in `localStorage` under `toolbox-theme` and synced across pages.

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
4. Re-use the shared `tb-*` component classes and inline any page-specific styles in a `<style>` block inside the view.
5. If server-side logic is needed, add it in `src/lib/` or directly in `src/routes/`.
