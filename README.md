# Skiddle Toolbox — Cloudflare Workers + Hono

A small developer utility suite served entirely from a single Cloudflare Worker using [Hono](https://hono.dev/). All tools run in the browser; the Worker only serves HTML and proxies cross-origin requests when needed.

Features a sticky top bar with theme switcher, a global settings modal, tool search/filter, and recently-used tools tracking.

Repository: https://github.com/arcestia/skiddle-toolbox

## Tools

- **Image CDN Validator** (`/cdn-validator`) — bulk-check image URLs by provider, response code, and Content-Type.
- **API Tester** (`/api-tester`) — browser-local HTTP client with custom methods, headers, body editor, and optional CORS proxy.
- **DNS Lookup** (`/dns-lookup`) — query public DNS-over-HTTPS resolvers for A, AAAA, MX, TXT, CNAME, and other records.
- **Text Extractor** (`/text-extractor`) — extract URLs, emails, domains, and IP addresses from logs, HTML, or markdown.
- **Regex Playground** (`/regex-playground`) — write, test, and debug regular expressions with match visualization and group breakdowns.
- **Spreadsheet Viewer** (`/spreadsheet-viewer`) — view CSV, TSV, Excel (.xlsx/.xls), ODS, JSON, and Markdown tables locally.
- **Markdown Editor** (`/markdown-editor`) — write Markdown with a live split-pane preview, formatting toolbar, and export.
- **CORS Proxy** (`/api/cors?url=...`) — edge proxy used by the tools above for cross-origin requests.

## Tech stack

- **Runtime:** Cloudflare Workers
- **Framework:** Hono
- **Language:** TypeScript
- **Bundler:** Wrangler v3
- **Styling:** Catppuccin (shared CSS/JS bundled into the Worker)

## Project structure

```
├── assets/
│   ├── toolbox.css            # Shared Catppuccin design system
│   └── toolbox.js             # Shared theme switcher & sync
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
│   │   ├── dnsLookup.ts       # DNS Lookup page
│   │   ├── textExtractor.ts   # Text Extractor page
│   │   ├── regexPlayground.ts # Regex Playground page
│   │   ├── spreadsheetViewer.ts # Spreadsheet Viewer page
│   │   └── markdownEditor.ts    # Markdown Editor page
│   ├── lib/
│   │   └── assets.ts          # Bundle CSS/JS as raw strings
│   └── types/
│       └── assets.d.ts        # Type declarations for raw asset imports
├── package.json
├── tsconfig.json
└── wrangler.toml
```

## Getting started

```bash
# Install dependencies
npm install

# Start local Wrangler dev server
npm run dev
```

Open http://localhost:8788 in your browser.

## Available scripts

```bash
npm run dev      # Start local development server
npm run check    # Type-check without emitting
npm run deploy   # Deploy to Cloudflare Workers
```

## Deploy

```bash
npm run deploy
```

Requires `wrangler login` and a Cloudflare account.
