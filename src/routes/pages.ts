import { Hono } from 'hono';
import { htmlContentType } from '../lib/assets.js';
import { homeView } from '../views/home.js';
import { cdnValidatorView } from '../views/cdnValidator.js';
import { apiTesterView } from '../views/apiTester.js';
import { dnsLookupView } from '../views/dnsLookup.js';
import { textExtractorView } from '../views/textExtractor.js';
import { regexPlaygroundView } from '../views/regexPlayground.js';
import { spreadsheetViewerView } from '../views/spreadsheetViewer.js';
import { markdownEditorView } from '../views/markdownEditor.js';
import { creditsView } from '../views/credits.js';
import { changelogView } from '../views/changelog.js';
import { ddosSimulatorView } from '../views/ddosSimulator.js';
import { base64View } from '../views/base64.js';
import { jsonFormatterView } from '../views/jsonFormatter.js';
import { uuidGeneratorView } from '../views/uuidGenerator.js';
import { timestampView } from '../views/timestampConverter.js';
import { hashGeneratorView } from '../views/hashGenerator.js';
import { jwtDecoderView } from '../views/jwtDecoder.js';
import { htmlEncoderView } from '../views/htmlEncoder.js';
import { tools } from '../lib/tools.js';
import { manifestJson, serviceWorkerJs, appIconSvg } from '../lib/pwa.js';

export const pagesRoute = new Hono();

// Cache HTML pages at the edge for 1 hour; browsers always revalidate
pagesRoute.use('*', async (c, next) => {
  await next();
  if (!c.res.headers.has('Cache-Control')) {
    c.header('Cache-Control', 'public, s-maxage=3600, max-age=0');
  }
});

pagesRoute.get('/', (c) => {
  return c.html(homeView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/cdn-validator', (c) => {
  return c.html(cdnValidatorView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/api-tester', (c) => {
  return c.html(apiTesterView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/dns-lookup', (c) => {
  return c.html(dnsLookupView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/text-extractor', (c) => {
  return c.html(textExtractorView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/regex-playground', (c) => {
  return c.html(regexPlaygroundView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/spreadsheet-viewer', (c) => {
  return c.html(spreadsheetViewerView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/markdown-editor', (c) => {
  return c.html(markdownEditorView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/ddos-simulator', (c) => {
  return c.html(ddosSimulatorView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/credits', (c) => {
  return c.html(creditsView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/changelog', (c) => {
  return c.html(changelogView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/base64', (c) => {
  return c.html(base64View(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/json-formatter', (c) => {
  return c.html(jsonFormatterView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/uuid-generator', (c) => {
  return c.html(uuidGeneratorView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/timestamp-converter', (c) => {
  return c.html(timestampView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/hash-generator', (c) => {
  return c.html(hashGeneratorView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/jwt-decoder', (c) => {
  return c.html(jwtDecoderView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/html-encoder', (c) => {
  return c.html(htmlEncoderView(), 200, { 'Content-Type': htmlContentType });
});

pagesRoute.get('/manifest.json', (c) => {
  const env = c.env as { SITE_URL?: string };
  const base = env.SITE_URL ?? 'https://skiddle-toolbox.pages.dev';
  return c.body(manifestJson(base), 200, {
    'Content-Type': 'application/manifest+json; charset=utf-8',
    'Cache-Control': 'public, s-maxage=86400, max-age=3600',
  });
});

pagesRoute.get('/sw.js', (c) => {
  return c.body(serviceWorkerJs(), 200, {
    'Content-Type': 'application/javascript; charset=utf-8',
    'Cache-Control': 'public, s-maxage=0, max-age=0, must-revalidate',
  });
});

pagesRoute.get('/icon.svg', (c) => {
  return c.body(appIconSvg(), 200, {
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': 'public, s-maxage=604800, max-age=86400',
  });
});

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  ...tools.map(t => ({
    path: t.href,
    priority: t.priority ?? '0.8',
    changefreq: t.changefreq ?? 'monthly',
  })),
  { path: '/credits', priority: '0.5', changefreq: 'yearly' },
  { path: '/changelog', priority: '0.5', changefreq: 'weekly' },
];

pagesRoute.get('/sitemap.xml', (c) => {
  const env = c.env as { SITE_URL?: string };
  const base = (env.SITE_URL ?? 'https://skiddle-toolbox.pages.dev').replace(/\/$/, '');
  const today = new Date().toISOString().split('T')[0];
  const urls = STATIC_PAGES.map(
    p => '  <url>\n    <loc>' + base + p.path + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <changefreq>' + p.changefreq + '</changefreq>\n    <priority>' + p.priority + '</priority>\n  </url>'
  ).join('\n');

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '\n</urlset>';

  return c.body(xml, 200, { 'Content-Type': 'application/xml', 'Cache-Control': 'public, s-maxage=86400, max-age=3600' });
});

pagesRoute.get('/robots.txt', (c) => {
  const env = c.env as { SITE_URL?: string };
  const base = (env.SITE_URL ?? 'https://skiddle-toolbox.pages.dev').replace(/\/$/, '');
  const body = 'User-agent: *\nAllow: /\n\nSitemap: ' + base + '/sitemap.xml';
  return c.body(body, 200, { 'Content-Type': 'text/plain', 'Cache-Control': 'public, s-maxage=86400, max-age=3600' });
});