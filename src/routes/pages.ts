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

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/cdn-validator', priority: '0.8', changefreq: 'monthly' },
  { path: '/api-tester', priority: '0.8', changefreq: 'monthly' },
  { path: '/dns-lookup', priority: '0.8', changefreq: 'monthly' },
  { path: '/text-extractor', priority: '0.8', changefreq: 'monthly' },
  { path: '/regex-playground', priority: '0.8', changefreq: 'monthly' },
  { path: '/spreadsheet-viewer', priority: '0.8', changefreq: 'monthly' },
  { path: '/markdown-editor', priority: '0.8', changefreq: 'monthly' },
  { path: '/ddos-simulator', priority: '0.7', changefreq: 'monthly' },
  { path: '/credits', priority: '0.5', changefreq: 'yearly' },
  { path: '/changelog', priority: '0.5', changefreq: 'weekly' },
  { path: '/base64', priority: '0.8', changefreq: 'monthly' },
  { path: '/json-formatter', priority: '0.8', changefreq: 'monthly' },
  { path: '/uuid-generator', priority: '0.8', changefreq: 'monthly' },
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