# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Skiddle Toolbox** — a developer utility suite served entirely from a single Cloudflare Worker using Hono. Every tool page is server-rendered HTML generated from TypeScript template literals; all tool logic runs client-side in the browser. The Worker only serves HTML and proxies requests (`/api/cors`, `/api/dns`).

## Commands

```bash
npm run dev      # wrangler dev — local server on http://localhost:8788
npm run check    # tsc --noEmit — the only automated verification; run after every change
npm run deploy   # wrangler deploy — requires wrangler login
```

There are no automated tests. Manual verification: `npm run dev`, click through tools at http://localhost:8788, and check the proxy with `curl -I "http://localhost:8788/api/cors?url=https%3A%2F%2Fexample.com"`.

The `*.js` files in `scratch/` (`test-rgx-dom.js`, `escapetest4.js`, etc.) are ad-hoc Node scratch scripts, not part of the Worker or any test suite.

## Architecture

### Request flow

`src/index.ts` creates the Hono app and mounts three routers: `pagesRoute` at `/` (all HTML pages), and `corsRoute` + `dnsRoute` at `/api`. `src/routes/pages.ts` maps each route to a view function; `src/routes/cors.ts` is a permissive all-methods proxy; `src/routes/dns.ts` proxies DNS-over-HTTPS queries to Cloudflare/Google/Quad9.

### Asset inlining (the key mechanism)

There is no static file serving — every page inlines all CSS and JS:

- Shared styles/scripts live in `assets/` as `*.css.txt` / `*.js.txt` files. The `.txt` suffix makes Wrangler bundle them as Text modules (raw strings); `src/types/assets.d.ts` declares these modules for TypeScript.
- `src/lib/assets.ts` composes one `<style>` tag from base CSS + all theme/layout/accent/radius registries, and one `<script>` tag from `toolbox.js`. Both are inlined into every page via `layout()`.
- Consequence: adding a new asset file requires importing it in the matching `src/lib/*.ts` registry, or it won't ship.

### Design-token registries

`src/lib/themes.ts`, `layouts.ts`, `accents.ts`, `radius.ts`, and `density.ts` follow the same pattern: a registry array ({id, name, ...css}), a `default*` export, and a `render*Css()`/options function. To add a theme/layout/etc.: drop the `.css.txt` file into the right `assets/` subdirectory and add one registry entry.

### Page shell and pre-paint settings

`src/views/layout.ts` `layout(ctx)` wraps every page: top bar, settings modal, and fonts. Two things happen in `<head>`:

1. A `runtimeConfig` JSON blob (`#tb-config`) is injected, listing all registries and defaults. `assets/toolbox.js.txt` reads it and exposes `window.toolbox` (`setTheme`, `setAccent`, `setRadius`, `setDensity`, `openSettings`, ...), persisting choices to `localStorage` (`toolbox-theme`, `toolbox-layout`, etc.) and syncing across tabs.
2. A synchronous inline script reads those `localStorage` keys and sets the corresponding classes/attributes on `<html>` **before first paint** to avoid a theme flash. Changes to settings keys must be kept in sync across `layout.ts`, the registry defaults, and `toolbox.js.txt`.

### View pattern

Each view in `src/views/*.ts` is a function returning `layout({ title, body, ... })` where `body` is one template-literal HTML string. Tool-specific browser JS lives in an inline `<script>` at the end of the body; page-specific CSS in an inline `<style>`. Views reuse the shared `tb-*` component classes from `assets/toolbox.css.txt` and end with `footer()` from `src/views/footer.ts`.

## Conventions

- **ESM import specifiers use `.js` extensions** even though sources are `.ts` (e.g. `import { pagesRoute } from './routes/pages.js'`).
- Component CSS classes are prefixed `tb-`; use `.empty-state` for consistent empty/no-results UI.
- Routes stay in `src/routes/`; page markup in `src/views/`; reusable server logic in `src/lib/`.
- Avoid `any`; the project compiles under `strict`.

## Adding a new tool

1. Create `src/views/<tool>.ts` returning `layout({...})`, ending the body with `footer()`.
2. Add the route in `src/routes/pages.ts`.
3. Add a card in `src/views/home.ts`.
4. Server-side logic (if any) goes in `src/lib/` or a new file in `src/routes/`.

`AGENTS.md` documents the above plus detailed per-tool behavior that must be preserved when modifying existing tools (CDN validator timeout/categorization rules, API tester proxy fallback, spreadsheet viewer SheetJS integration, etc.) — read it before changing any existing tool.

## Security notes

- `/api/cors` forwards arbitrary methods, headers, and bodies to arbitrary targets with `Access-Control-Allow-Origin: *`, strips upstream CSP, and has no auth or rate limiting. Intentional for a dev utility — do not "fix" without discussing, but don't widen it either.
- Never hardcode secrets; use `wrangler secret` or `vars` in `wrangler.toml`.
