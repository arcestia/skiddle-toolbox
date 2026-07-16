import { Hono } from 'hono';
import { htmlContentType } from '../lib/assets.js';
import { homeView } from '../views/home.js';
import { cdnValidatorView } from '../views/cdnValidator.js';
import { apiTesterView } from '../views/apiTester.js';
import { dnsLookupView } from '../views/dnsLookup.js';
import { textExtractorView } from '../views/textExtractor.js';
import { regexPlaygroundView } from '../views/regexPlayground.js';
import { spreadsheetViewerView } from '../views/spreadsheetViewer.js';

export const pagesRoute = new Hono();

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
