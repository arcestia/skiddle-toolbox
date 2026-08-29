import { tools } from './tools.js';

export const manifestJson = (siteUrl: string = 'https://skiddle-toolbox.pages.dev'): string => {
  const base = siteUrl.replace(/\/$/, '');
  return JSON.stringify(
    {
      name: 'Skiddle Toolbox',
      short_name: 'Toolbox',
      description: 'A developer utility suite with 17 offline-ready client-side tools.',
      start_url: '/',
      display: 'standalone',
      background_color: '#1e1e2e',
      theme_color: '#cba6f7',
      orientation: 'any',
      icons: [
        {
          src: `${base}/icon.svg`,
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any maskable',
        },
      ],
      categories: ['developer', 'utilities', 'productivity'],
      shortcuts: tools.slice(0, 4).map(t => ({
        name: t.title,
        url: t.href,
        description: t.desc,
        icons: [{ src: `${base}/icon.svg`, sizes: 'any' }],
      })),
    },
    null,
    2
  );
};

export const serviceWorkerJs = (): string => `/* Skiddle Toolbox Service Worker — Offline Support */
const CACHE_NAME = 'skiddle-toolbox-v1.2.0';

const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/cdn-validator',
  '/api-tester',
  '/dns-lookup',
  '/text-extractor',
  '/regex-playground',
  '/spreadsheet-viewer',
  '/markdown-editor',
  '/ddos-simulator',
  '/base64',
  '/json-formatter',
  '/uuid-generator',
  '/timestamp-converter',
  '/hash-generator',
  '/jwt-decoder',
  '/html-encoder',
  '/credits',
  '/changelog',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS).catch(err => {
        console.warn('Pre-cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Don't cache API proxy calls (CORS / DNS)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Google Fonts caching (Cache-First)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' || url.hostname === 'cdn.jsdelivr.net') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
          const response = await fetch(event.request);
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        } catch (err) {
          return cached || new Response('Offline font unavailable', { status: 503 });
        }
      })
    );
    return;
  }

  // Navigation requests: Network-First with Cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const fallback = await caches.match('/');
          return fallback || new Response('Offline — Skiddle Toolbox', {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
    return;
  }

  // Stale-While-Revalidate for other static assets
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
          }
          return networkResponse;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
`;

export const appIconSvg = (): string => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181825"/>
      <stop offset="100%" stop-color="#11111b"/>
    </linearGradient>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#cba6f7"/>
      <stop offset="50%" stop-color="#89b4fa"/>
      <stop offset="100%" stop-color="#94e2d5"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#bg)" stroke="#313244" stroke-width="8"/>
  <circle cx="256" cy="256" r="160" fill="none" stroke="url(#grad)" stroke-width="12" opacity="0.3"/>
  <path d="M190 170 L322 170 M256 170 L256 342" stroke="url(#grad)" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
  <circle cx="190" cy="170" r="10" fill="#cba6f7"/>
  <circle cx="322" cy="170" r="10" fill="#94e2d5"/>
  <circle cx="256" cy="342" r="10" fill="#89b4fa"/>
</svg>`;
