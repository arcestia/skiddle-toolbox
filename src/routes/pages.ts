import { Hono } from 'hono';
import { htmlContentType } from '../lib/assets.js';
import { homeView } from '../views/home.js';
import { cdnValidatorView } from '../views/cdnValidator.js';
import { apiTesterView } from '../views/apiTester.js';

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
