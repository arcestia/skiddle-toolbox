export interface ChangelogEntry {
  version: string;
  date: string;
  added?: string[];
  changed?: string[];
  fixed?: string[];
}

export const changelogEntries: ChangelogEntry[] = [
  {
    version: 'Unreleased',
    date: 'In progress',
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
