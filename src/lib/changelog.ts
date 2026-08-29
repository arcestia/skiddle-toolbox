export interface ChangelogEntry {
  version: string;
  date: string;
  added?: string[];
  changed?: string[];
  fixed?: string[];
}

export const changelogEntries: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: '2026-08-28',
    added: [
      'Unix Timestamp Converter: convert between Unix timestamps (s/ms/ns), ISO 8601, UTC, and local time with relative time and calendar metadata.',
      'Hash Generator: client-side text and file hashing with SHA-1, SHA-256, SHA-384, SHA-512, and MD5 via Web Crypto API with progress tracking.',
      'JWT Decoder: decode and inspect JWT tokens (header, payload, signature) with registered claims parsing and expiration chips.',
      'HTML Entity Encoder: encode/decode 70+ named entities, numeric/hex formats, and escape strings for JavaScript.',
      'UUID Generator: generate RFC 4122 compliant UUIDs v1 (timestamp-based), v4 (random), and v7 (Unix Epoch time-based).',
      'Base64 Encoder / Decoder: encode and decode text or files with URL-safe and data URI modes.',
      'JSON Formatter: format, validate, and minify JSON with syntax highlighting, tree view, and statistics.',
      'DDoS Simulator: client-side simulated cyber-war map with Campaign progression, upgrade shop, Trace heat mechanics, and Defense mode.',
      'SEO & Discoverability: dynamic sitemap.xml and robots.txt generation.',
      'Edge Caching & Performance: 1-hour edge caching headers and Server-Timing response headers.',
      'Themed 404 Page: custom Catppuccin-styled not found page integrated with the active theme.',
      'Canonical URL tags across all pages.',
    ],
    changed: [
      'Pinned third-party CDN dependencies (marked@15.0.12, dompurify@3.4.14, xlsx@0.18.5) to fixed versions.',
      'Updated home page metrics and tool index to 17 tools.',
    ],
    fixed: [
      'UUID v1 timestamp arithmetic rewritten with BigInt to eliminate precision loss and ensure valid RFC 4122 version and variant bits.',
      'Base64 options UI cleaned up to hide encode-only toggles in decode mode.',
      'JSON formatter tab indentation mapping corrected.',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-07-16',
    added: [
      'Modular theme, layout, accent, radius, and density registries.',
      '13 themes grouped into Catppuccin and IDE packs.',
      'Accent color picker with 7 presets (Mauve, Blue, Emerald, Violet, Orange, Rose, Cyan).',
      'Corner radius presets: Sharp, Rounded, Soft.',
      'Density presets: Compact, Comfortable, Spacious.',
      'Shared footer component used across all pages.',
      'Credits page.',
      'Changelog page.',
    ],
    changed: [
      'Theme selector in settings changed from pills to a grouped dropdown with a color swatch.',
      'Footer copy standardized to "Crafted with ❤️ and ☕" on every page.',
      'Replaced the boolean compact-mode checkbox with a 3-way density selector.',
    ],
    fixed: [
      'Removed the "Pill" radius preset that turned cards into circles; replaced with "Soft".',
    ],
  },
  {
    version: '1.0.0',
    date: 'Initial release',
    added: [
      'Skiddle Toolbox landing page with 8 developer utilities.',
      'Image CDN Validator, API Tester, DNS Lookup, Text Extractor, Regex Playground, Spreadsheet Viewer, and Markdown Editor.',
      'Catppuccin theme system with Latte, Frappé, Macchiato, and Mocha variants.',
      'Global settings modal with theme switcher, compact mode, and recent tools.',
      'CORS proxy at /api/cors for cross-origin debugging.',
    ],
  },
];
