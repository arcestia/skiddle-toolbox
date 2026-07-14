# Developer Toolbox — Cloudflare Workers + Hono

A small developer utility suite served entirely from a single Cloudflare Worker using [Hono](https://hono.dev/).

## Tools

- **Image CDN Validator** (`/cdn-validator`) — bulk-check image URLs by provider.
- **API Tester** (`/api-tester`) — browser-local HTTP client with optional CORS proxy.
- **CORS Proxy** (`/api/cors?url=...`) — edge proxy used by the tools above.

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
│   ├── index.ts               # Hono app bootstrap
│   ├── routes/
│   │   ├── pages.ts           # HTML page routes
│   │   └── cors.ts            # CORS proxy route
│   ├── views/
│   │   ├── layout.ts          # Shared page shell
│   │   ├── home.ts            # Landing page
│   │   ├── cdnValidator.ts    # Image CDN Validator page
│   │   └── apiTester.ts       # API Tester page
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

## Deploy

```bash
npm run deploy
```

Requires `wrangler login` and a Cloudflare account.
