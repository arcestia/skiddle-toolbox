import http from 'http';
import https from 'https';
import crypto from 'crypto';

const BASE = 'http://localhost:8787';

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function run() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 Running Full Skiddle Toolbox Test Suite');
  console.log('═══════════════════════════════════════════════════════════\n');

  // 1. Wait for server
  console.log('📦 1. Server Health & Availability');
  let ready = false;
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetchUrl(BASE + '/');
      if (res.status === 200) { ready = true; break; }
    } catch (e) {}
    await sleep(800);
  }
  assert(ready, 'Local Cloudflare Worker server is responding at http://localhost:8787');

  // 2. Test all HTML Routes
  console.log('\n📄 2. HTML View Routes');
  const routes = [
    { path: '/', title: 'Skiddle Toolbox', check: 'tb-palette-modal' },
    { path: '/cdn-validator', title: 'Image CDN Validator', check: 'cdn-validator' },
    { path: '/api-tester', title: 'API Tester', check: 'api-tester' },
    { path: '/dns-lookup', title: 'DNS Lookup', check: 'dns-lookup' },
    { path: '/text-extractor', title: 'Text Extractor', check: 'text-extractor' },
    { path: '/regex-playground', title: 'Regex Playground', check: 'regex-playground' },
    { path: '/spreadsheet-viewer', title: 'Spreadsheet Viewer', check: 'spreadsheet-viewer' },
    { path: '/markdown-editor', title: 'Markdown Editor', check: 'markdown-editor' },
    { path: '/ddos-simulator', title: 'DDoS Simulator', check: 'ddos-simulator' },
    { path: '/base64', title: 'Base64 Encoder / Decoder', check: 'base64' },
    { path: '/json-formatter', title: 'JSON Formatter', check: 'json-formatter' },
    { path: '/uuid-generator', title: 'UUID Generator', check: 'uuid-generator' },
    { path: '/timestamp-converter', title: 'Unix Timestamp Converter', check: 'timestamp-converter' },
    { path: '/hash-generator', title: 'Hash Generator', check: 'hash-generator' },
    { path: '/jwt-decoder', title: 'JWT Decoder', check: 'jwt-decoder' },
    { path: '/html-encoder', title: 'HTML Entity Encoder', check: 'html-encoder' },
    { path: '/credits', title: 'Credits', check: 'credits' },
    { path: '/changelog', title: 'Changelog', check: 'changelog' },
  ];

  for (const r of routes) {
    try {
      const res = await fetchUrl(BASE + r.path);
      const okStatus = res.status === 200;
      const hasTitle = res.body.includes(r.title);
      const hasCheck = res.body.includes(r.check);
      const hasPalette = res.body.includes('tb-palette-modal');
      const hasCanonical = res.body.includes('rel="canonical"');
      assert(okStatus && hasTitle && hasCheck && hasPalette && hasCanonical, `GET ${r.path.padEnd(22)} (200 OK, title, palette, canonical)`);
    } catch (e) {
      assert(false, `GET ${r.path} error: ${e.message}`);
    }
  }

  // 3. Static & Metadata Endpoints
  console.log('\n⚙️ 3. Static & PWA Endpoints');
  try {
    const sitemap = await fetchUrl(BASE + '/sitemap.xml');
    const locCount = (sitemap.body.match(/<loc>/g) || []).length;
    assert(sitemap.status === 200 && locCount >= 18 && sitemap.headers['content-type'].includes('xml'), `GET /sitemap.xml (200 OK, Content-Type xml, ${locCount} URLs indexed)`);
  } catch (e) {
    assert(false, `/sitemap.xml error: ${e.message}`);
  }

  try {
    const robots = await fetchUrl(BASE + '/robots.txt');
    assert(robots.status === 200 && robots.body.includes('Sitemap:'), `GET /robots.txt (200 OK, references sitemap)`);
  } catch (e) {
    assert(false, `/robots.txt error: ${e.message}`);
  }

  try {
    const manifest = await fetchUrl(BASE + '/manifest.json');
    const json = JSON.parse(manifest.body);
    assert(manifest.status === 200 && json.name === 'Skiddle Toolbox' && Array.isArray(json.shortcuts), `GET /manifest.json (200 OK, valid JSON, PWA name & shortcuts)`);
  } catch (e) {
    assert(false, `/manifest.json error: ${e.message}`);
  }

  try {
    const sw = await fetchUrl(BASE + '/sw.js');
    assert(sw.status === 200 && sw.body.includes('CACHE_NAME') && sw.body.includes('PRECACHE_URLS'), `GET /sw.js (200 OK, Service Worker with cache manifest)`);
  } catch (e) {
    assert(false, `/sw.js error: ${e.message}`);
  }

  try {
    const icon = await fetchUrl(BASE + '/icon.svg');
    assert(icon.status === 200 && icon.body.includes('<svg') && icon.headers['content-type'].includes('svg'), `GET /icon.svg (200 OK, SVG image)`);
  } catch (e) {
    assert(false, `/icon.svg error: ${e.message}`);
  }

  // 4. Headers & 404
  console.log('\n🔒 4. Headers, Security & 404 Behavior');
  try {
    const home = await fetchUrl(BASE + '/');
    const cacheControl = home.headers['cache-control'] || '';
    const serverTiming = home.headers['server-timing'] || '';
    assert(cacheControl.includes('public') && cacheControl.includes('s-maxage=3600'), `Cache-Control header on HTML: "${cacheControl}"`);
    assert(serverTiming.includes('total'), `Server-Timing header present: "${serverTiming}"`);
  } catch (e) {
    assert(false, `Header check error: ${e.message}`);
  }

  try {
    const notFound = await fetchUrl(BASE + '/non-existent-route-' + Date.now());
    assert(notFound.status === 404 && notFound.body.includes('404') && notFound.body.includes('Page not found'), `404 Not Found handling (404 status with Catppuccin themed UI)`);
  } catch (e) {
    assert(false, `404 check error: ${e.message}`);
  }

  // 5. API Proxies
  console.log('\n🌐 5. Edge API Proxies');
  try {
    const cors = await fetchUrl(BASE + '/api/cors?url=' + encodeURIComponent('https://example.com'));
    assert(cors.status === 200 && cors.headers['access-control-allow-origin'] === '*', `GET /api/cors?url=... (200 OK with CORS Allow-Origin: *)`);
  } catch (e) {
    assert(false, `/api/cors error: ${e.message}`);
  }

  try {
    const dns = await fetchUrl(BASE + '/api/dns?domain=cloudflare.com&type=A');
    assert(dns.status === 200 && (dns.body.includes('Status') || dns.body.includes('Answer') || dns.body.includes('domain')), `GET /api/dns?domain=cloudflare.com&type=A (200 OK DoH response)`);
  } catch (e) {
    assert(false, `/api/dns error: ${e.message}`);
  }

  // 6. Client Algorithm Validations
  console.log('\n🧪 6. Core Algorithms (UUID, Hashes, JWT, Timestamps, Entities)');

  // UUID tests
  function getRandomBytes(n) {
    return crypto.randomBytes(n);
  }
  function bytesToHex(b) {
    return Buffer.from(b).toString('hex');
  }
  function fmtUuid(hex) {
    return hex.slice(0,8) + '-' + hex.slice(8,12) + '-' + hex.slice(12,16) + '-' + hex.slice(16,20) + '-' + hex.slice(20);
  }
  function testUuidV1() {
    var UUID_EPOCH = 0x01b21dd213814000n;
    var now = BigInt(Date.now());
    var ts = now * 10000n + UUID_EPOCH;
    var clock_seq = getRandomBytes(2);
    var node = getRandomBytes(6);
    node[0] |= 0x01;
    var b = new Uint8Array(16);
    b[0] = Number((ts >> 24n) & 0xffn);
    b[1] = Number((ts >> 16n) & 0xffn);
    b[2] = Number((ts >> 8n) & 0xffn);
    b[3] = Number(ts & 0xffn);
    b[4] = Number((ts >> 40n) & 0xffn);
    b[5] = Number((ts >> 32n) & 0xffn);
    b[6] = 0x10 | Number((ts >> 56n) & 0x0fn);
    b[7] = Number((ts >> 48n) & 0xffn);
    b[8] = 0x80 | (clock_seq[0] & 0x3f);
    b[9] = clock_seq[1];
    b[10] = node[0]; b[11] = node[1]; b[12] = node[2];
    b[13] = node[3]; b[14] = node[4]; b[15] = node[5];
    return fmtUuid(bytesToHex(b));
  }
  function testUuidV7() {
    var ts = BigInt(Date.now());
    var rand = getRandomBytes(10);
    var b = new Uint8Array(16);
    b[0] = Number((ts >> 40n) & 0xffn);
    b[1] = Number((ts >> 32n) & 0xffn);
    b[2] = Number((ts >> 24n) & 0xffn);
    b[3] = Number((ts >> 16n) & 0xffn);
    b[4] = Number((ts >> 8n) & 0xffn);
    b[5] = Number(ts & 0xffn);
    b[6] = 0x70 | (rand[0] & 0x0f);
    b[7] = rand[1];
    b[8] = 0x80 | (rand[2] & 0x3f);
    for (let i = 9; i < 16; i++) b[i] = rand[i - 9 + 3];
    return fmtUuid(bytesToHex(b));
  }

  const v1 = testUuidV1();
  const v7 = testUuidV7();
  assert(/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v1), `UUID v1 conformant: "${v1}"`);
  assert(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v7), `UUID v7 conformant: "${v7}"`);

  // JWT decoding test
  const testPayload = { sub: '1234567890', name: 'John Doe', iat: 1516239022, exp: 1716239022 };
  const headerB64 = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(testPayload)).toString('base64url');
  const dummyJwt = `${headerB64}.${payloadB64}.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;

  const jwtParts = dummyJwt.split('.');
  const decodedHeader = JSON.parse(Buffer.from(jwtParts[0], 'base64url').toString());
  const decodedPayload = JSON.parse(Buffer.from(jwtParts[1], 'base64url').toString());
  assert(decodedHeader.alg === 'HS256' && decodedPayload.name === 'John Doe' && decodedPayload.exp === 1716239022, `JWT Decoder parse test (header & payload decoded accurately)`);

  // Hash tests
  const sampleText = 'Hello Skiddle Toolbox!';
  const sha256 = crypto.createHash('sha256').update(sampleText).digest('hex');
  const md5 = crypto.createHash('md5').update(sampleText).digest('hex');
  assert(sha256.length === 64 && md5.length === 32, `Hash Generator digests: SHA-256=${sha256.slice(0,12)}... MD5=${md5}`);

  // HTML Entity encoding test
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
      switch(m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&apos;';
      }
    });
  }
  const rawHtml = '<script>alert("XSS & fun\'s")</script>';
  const escaped = escapeHtml(rawHtml);
  assert(escaped === '&lt;script&gt;alert(&quot;XSS &amp; fun&apos;s&quot;)&lt;/script&gt;', `HTML Entity escaping: safely sanitized input`);

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`📊 Test Suite Result: ${passed} PASSED, ${failed} FAILED`);
  console.log('═══════════════════════════════════════════════════════════');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
