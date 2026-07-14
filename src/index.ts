import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { pagesRoute } from './routes/pages.js';
import { corsRoute } from './routes/cors.js';

const app = new Hono();

app.use(logger());

app.route('/', pagesRoute);
app.route('/api', corsRoute);

app.notFound((c) => c.html('<h1>404 Not Found</h1>', 404));

export default app;
