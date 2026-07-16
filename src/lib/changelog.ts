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
    added: [
      'DDoS Simulator: fully client-side, 100% simulated cyber-war map with zero real network traffic.',
      'Campaign mode: farm a botnet from zero by clicking land on the map, plus auto-scan and self-replicating Worm Spread.',
      'Campaign progression: 7 targets from Personal Blog to Edge Network Titan, each with capacity, mitigation level, and a weakness attack type.',
      'Credits economy and upgrade shop: Exploit Kit, Worm Spread, Bot Overclock, Proxy Chains, and C2 Servers.',
      'Trace level mechanic: loud attacks raise heat; at 100% the authorities seize 40% of your botnet.',
      'Sandbox mode with 5 attack types (UDP, SYN, HTTP floods, DNS Amplification, Slowloris) and 4 toggleable mitigations.',
      'Defense Game mode: survive escalating waves with max 2 active mitigations; best score persisted locally.',
      'Campaign save persistence in localStorage: auto-save every 5s, manual 💾 Save progress button, and save on page unload.',
      'Offline earnings: your botnet keeps farming while you are away (auto-scan + Worm rates, capped at 4 hours) with a welcome-back summary.',
      'Trace level persists across sessions and cools slowly while away — refreshing the page no longer dodges the heat.',
      'Export/import campaign saves as a copy-paste JSON string — move your botnet between browsers or keep a backup.',
      'Lifetime campaign stats: total bots farmed, credits earned, busts, targets pwned, and playtime — persisted in the save.',
      '🌟 Prestige endgame: pwn all 7 targets to unlock a campaign reset with permanent +25% credits and +50 starting bots per prestige level.',
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
