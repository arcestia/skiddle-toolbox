import { Hono } from 'hono';

export const corsRoute = new Hono();

corsRoute.all('/cors', async (c) => {
  const targetUrl = c.req.query('url');

  if (!targetUrl) {
    return c.text("Error: Missing target 'url' search parameter.", 400, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain'
    });
  }

  if (c.req.method === 'OPTIONS') {
    return c.body(null, 204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400'
    });
  }

  try {
    const request = c.req.raw;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.delete('Host');

    const fetchOptions: RequestInit = {
      method: request.method,
      headers: requestHeaders,
      redirect: 'follow'
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      fetchOptions.body = await request.clone().text();
    }

    const response = await fetch(targetUrl, fetchOptions);

    const proxyHeaders = new Headers(response.headers);
    proxyHeaders.set('Access-Control-Allow-Origin', '*');
    proxyHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    proxyHeaders.set('Access-Control-Allow-Headers', '*');
    proxyHeaders.delete('Content-Security-Policy');

    const headerRecord: Record<string, string> = {};
    proxyHeaders.forEach((value, key) => {
      headerRecord[key] = value;
    });
    return c.newResponse(response.body, response.status as import('hono/utils/http-status').StatusCode, headerRecord);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return c.text('CORS Proxy edge failure: ' + message, 502, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain'
    });
  }
});
