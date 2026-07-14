import { Hono } from 'hono';

const DNS_PROVIDERS: Record<string, string> = {
  cloudflare: 'https://cloudflare-dns.com/dns-query',
  google: 'https://dns.google/resolve',
  quad9: 'https://dns.quad9.net:5053/dns-query'
};

const VALID_TYPES = new Set([
  'A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'PTR', 'SRV', 'CAA', 'ANY'
]);

function isValidDomain(domain: string): boolean {
  // Allow standard hostnames, punycode, and trailing dot; no spaces.
  return /^[a-zA-Z0-9_.-]+$/.test(domain) && domain.length <= 253;
}

export const dnsRoute = new Hono();

dnsRoute.get('/dns', async (c) => {
  const domain = c.req.query('domain')?.trim();
  const type = (c.req.query('type') || 'A').toUpperCase();
  const providerKey = c.req.query('provider') || 'cloudflare';

  if (!domain) return c.json({ error: 'Missing domain parameter' }, 400);
  if (!isValidDomain(domain)) return c.json({ error: 'Invalid domain format' }, 400);
  if (!VALID_TYPES.has(type)) return c.json({ error: 'Unsupported record type' }, 400);

  const dohUrl = DNS_PROVIDERS[providerKey] || DNS_PROVIDERS.cloudflare;
  const url = `${dohUrl}?name=${encodeURIComponent(domain)}&type=${encodeURIComponent(type)}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        Accept: 'application/dns-json',
        'User-Agent': 'DeveloperToolbox/1.0'
      },
      cf: { cacheTtl: 60 }
    });

    if (!upstream.ok) {
      return c.json({ error: `Upstream resolver returned ${upstream.status}` }, 502);
    }

    const data = await upstream.json<Record<string, unknown>>();
    return c.json({ domain, type, provider: providerKey, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'DNS query failed';
    return c.json({ error: message }, 502);
  }
});

export default dnsRoute;
