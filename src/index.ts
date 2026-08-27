import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { timing } from 'hono/timing';
import { pagesRoute } from './routes/pages.js';
import { corsRoute } from './routes/cors.js';
import { dnsRoute } from './routes/dns.js';
import { notFoundView } from './views/notFound.js';

const app = new Hono();

app.use(logger());
app.use(timing());

app.route('/', pagesRoute);
app.route('/api', corsRoute);
app.route('/api', dnsRoute);

app.notFound((c) => c.html(notFoundView(), 404));

export default app;
