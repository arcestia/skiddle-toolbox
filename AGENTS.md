# Agent Notes for Developer Toolbox

This document contains project-specific guidance for AI coding agents working on this repository.

## Project Overview

This is **Developer Toolbox**, a small client-side utility portal deployed to **Cloudflare Pages**.

- The root route (`/`) serves `index.html`, which renders a card-based menu of available tools.
- Each tool is a standalone HTML file. Currently only one tool is implemented: the **Image CDN Validator** served at `/cdn-validator` (`cdn-validator.html`).
- A single Cloudflare Pages Function at `functions/api/cors.js` provides a lightweight CORS proxy used by the Image CDN Validator during local development and when running via the deployed Pages domain.
- The project does not use a front-end framework, bundler, or build step. It is plain HTML, CSS, and vanilla JavaScript.

## Technology Stack

- **Runtime / Platform:** Cloudflare Pages with Pages Functions (Workers-like edge functions).
- **Language:** ES modules (JavaScript) for the edge function; vanilla JavaScript in the browser.
- **Markup / Styling:** Static HTML files with embedded `<style>` blocks. No external CSS files or component library.
- **Package Manager:** npm.
- **CLI Tool:** Wrangler v3 (`wrangler` is the only dependency).

## Project Structure

```
├── assets/
│   ├── toolbox.css            # Shared Catppuccin design system and components
│   └── toolbox.js             # Shared theme switcher and sync logic
├── functions/
│   └── api/
│       └── cors.js            # Pages Function: CORS proxy endpoint at /api/cors
├── index.html                 # Portal landing page listing all tools
├── cdn-validator.html         # Image CDN Validator tool
├── package.json               # npm manifest and Wrangler scripts
├── wrangler.toml              # Cloudflare Pages / Wrangler configuration
├── README.md                  # Human-facing setup and deploy guide
└── .gitignore                 # Excludes node_modules, .wrangler, IDE files, etc.
```

### Static Asset Routing

Cloudflare Pages automatically resolves clean URLs for `.html` files:
- `index.html` → `/`
- `cdn-validator.html` → `/cdn-validator`

### Pages Functions Routing

`functions/api/cors.js` is served at `/api/cors`.
- Required query parameter: `url`
- Supports `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- Forwards the incoming request to the target `url`, injects permissive CORS headers, deletes the upstream `Host` header, strips `Content-Security-Policy`, and returns the upstream response.

## Build and Development Commands

All commands are defined in `package.json`.

```bash
# Install dependencies
npm install

# Start the local development server on port 8788
npm run dev
```

`npm run dev` launches `wrangler pages dev .`, which serves static files from the project root alongside the Pages Function.

Open http://localhost:8788 in a browser.

### Deployment

```bash
# Deploy to Cloudflare Pages
npm run deploy
```

`npm run deploy` runs `wrangler pages deploy .`. The command requires the user to be authenticated with Cloudflare (`wrangler login`) and to select or specify a Pages project.

## Wrangler Configuration

`wrangler.toml`:

```toml
name = "workers-toolbox"
compatibility_date = "2024-03-12"
pages_build_output_dir = "."
```

- `compatibility_date` is pinned; when adding new Worker/platform features, update this only if the project requires capabilities introduced after `2024-03-12`.
- `pages_build_output_dir = "."` tells Wrangler that the project root is the static output directory. There is no separate build output folder.

## Code Style and Conventions

- **No transpiler or bundler:** Write plain HTML/CSS/ES5+ compatible JavaScript that runs directly in modern browsers and the Workers runtime.
- **Single-file utilities:** Each tool lives in one self-contained `.html` file with embedded `<style>` and `<script>` blocks.
- **Naming:** HTML pages use kebab-case (`cdn-validator.html`). Functions use camelCase file names (`cors.js`).
- **CSS conventions:**
  - Shared styles live in `assets/toolbox.css`. Every page links to it.
  - CSS variables are declared on `:root` and updated per `data-theme` attribute.
  - Color palette is based on **Catppuccin** with four switchable variants: Latte (light), Frappé, Macchiato, and Mocha (default).
  - Accent gradient uses Catppuccin Mauve → Pink → Lavender.
  - Status colors map to Catppuccin semantic colors: `--color-ok` (green), `--color-bad` (red), `--color-warn` (yellow), `--color-info` (blue).
  - Component classes are prefixed with `tb-` (e.g., `tb-card`, `tb-btn`, `tb-badge`).
  - Page-specific overrides can live in a small inline `<style>` block.
- **JavaScript conventions:**
  - Shared behavior lives in `assets/toolbox.js`. Every page links to it.
  - The theme switcher is auto-injected into any element with `data-tb-theme-bar` (`dots` or `pills`).
  - The chosen theme is persisted in `localStorage` under `toolbox-theme` and synced across open tabs/pages.
  - Use `const`/`let` and `async/await`.
  - Inline event handlers (`onclick`) are acceptable inside tool HTML files for simplicity.
  - When adding new tools, mirror the existing card styling and navigation pattern from `index.html`.

## Current Tools

### Image CDN Validator (`cdn-validator.html`)

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

## Testing

There are currently no automated tests, test runners, or linting tools configured.

When making changes, verify manually:
1. Run `npm run dev`.
2. Open http://localhost:8788.
3. Click through to the tool and run a representative validation (both with and without the CORS proxy option).
4. Check the edge function directly: `curl -I "http://localhost:8788/api/cors?url=https%3A%2F%2Fexample.com"`.

If the project grows, consider adding `vitest` for the Pages Function and a simple static-check step.

## Security Considerations

- The CORS proxy in `functions/api/cors.js` allows any origin (`*`) and forwards arbitrary request bodies and headers. This is intentional for a local development/debugging utility but should not be used for production user traffic without origin restrictions.
- The proxy strips `Content-Security-Policy` from upstream responses and deletes the `Host` header before forwarding.
- There is no authentication, rate limiting, or allow-list for proxy targets.
- Do not store secrets in the function files or HTML. Use `wrangler secret` or environment variables (`vars` in `wrangler.toml`) if secrets become necessary.

## Adding a New Tool

1. Create a new `*.html` file in the project root (e.g., `my-tool.html`).
2. Link the shared assets in `<head>`:
   ```html
   <link rel="stylesheet" href="/assets/toolbox.css">
   <script src="/assets/toolbox.js" defer></script>
   ```
3. Add a card to `index.html` with an "Active" badge and a link to the clean route (e.g., `/my-tool`).
4. Include a back link to `/` in the new tool and a theme switcher where appropriate:
   ```html
   <div data-tb-theme-bar="dots"></div>
   ```
5. Re-use the shared `tb-*` component classes for visual consistency.
6. Keep page-specific styles in a small inline `<style>` block.
7. If server-side logic is needed, add a new file under `functions/` following the Pages Functions file-based routing convention.
