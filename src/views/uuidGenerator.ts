import { layout } from './layout.js';
import { footer } from './footer.js';

export const uuidGeneratorView = (): string => layout({
  title: 'UUID Generator · Skiddle Toolbox',
  description: 'Generate UUIDs v1, v4, and v7 in your browser — no data leaves your device.',
  canonicalPath: '/uuid-generator',
  body: `
    <div class="tb-page-header">
      <div class="tb-tool-icon">🆔</div>
      <div class="tb-page-header__text">
        <h1>UUID Generator</h1>
        <p>Generate UUIDs v1, v4, and v7 instantly — entirely in your browser.</p>
      </div>
    </div>

    <div class="tb-card">
      <div class="uuid-controls">
        <div class="uuid-control-row">
          <label class="tb-label" for="uuid-version">Version</label>
          <select id="uuid-version" class="tb-select" onchange="uuidOnVersionChange()">
            <option value="1">v1 — Timestamp-based</option>
            <option value="4" selected>v4 — Random</option>
            <option value="7">v7 — Unix Epoch time-based</option>
          </select>
        </div>
        <div class="uuid-control-row">
          <label class="tb-label" for="uuid-count">Count</label>
          <input type="number" id="uuid-count" class="tb-input" value="1" min="1" max="100" style="width:80px;">
        </div>
        <button type="button" class="tb-btn tb-btn-primary" onclick="uuidGenerate()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          Generate
        </button>
      </div>

      <div id="uuid-list" class="uuid-list" aria-live="polite"></div>
      <div id="uuid-notation" class="uuid-notation"></div>
    </div>

    <div class="tb-card">
      <h2 class="section-title" style="margin-bottom:12px;">Version Reference</h2>
      <div class="uuid-versions-grid">
        <div class="uuid-version-card">
          <h3>v1 — Timestamp</h3>
          <p>Uses MAC address and timestamp. Sortable, reveals when and where the UUID was created.</p>
        </div>
        <div class="uuid-version-card">
          <h3>v4 — Random</h3>
          <p>Pseudo-random bytes. Does not reveal any information. Most common for general use.</p>
        </div>
        <div class="uuid-version-card">
          <h3>v7 — Unix Epoch</h3>
          <p>Millisecond-precision timestamp + random bits. Sortable and privacy-friendly.</p>
        </div>
      </div>
    </div>

    ${footer()}

    <style>
      .uuid-controls { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; margin-bottom: 16px; }
      .uuid-control-row { display: flex; flex-direction: column; gap: 4px; }
      .uuid-list { display: flex; flex-direction: column; gap: 6px; }
      .uuid-item {
        display: flex; align-items: center; gap: 8px; padding: 8px 12px;
        background: var(--bg-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border);
      }
      .uuid-item code {
        font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; flex: 1;
        letter-spacing: 0.05em; word-break: break-all;
      }
      .uuid-item .copy-btn { flex-shrink: 0; }
      .uuid-notation { font-size: 0.78rem; color: var(--text-secondary); margin-top: 8px; }
      .uuid-notation:empty { display: none; }
      .uuid-versions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
      .uuid-version-card { padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border); }
      .uuid-version-card h3 { font-size: 0.88rem; font-weight: 600; margin: 0 0 4px; }
      .uuid-version-card p { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }
    </style>

    <script>
    (function() {
      // Get cryptographically random bytes
      function getRandomBytes(n) {
        var b = new Uint8Array(n);
        if (window.crypto && window.crypto.getRandomValues) {
          window.crypto.getRandomValues(b);
        } else {
          for (var i = 0; i < n; i++) b[i] = Math.floor(Math.random() * 256);
        }
        return b;
      }

      // Format 16 hex bytes as UUID string: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      function fmtUuid(hex) {
        // hex is a 32-char lowercase hex string
        return hex.slice(0,8) + '-' + hex.slice(8,12) + '-' + hex.slice(12,16) + '-' + hex.slice(16,20) + '-' + hex.slice(20);
      }

      // Convert Uint8Array to 32-char lowercase hex string
      function bytesToHex(b) {
        for (var i = 0, h = ''; i < b.length; i++) h += b[i].toString(16).padStart(2, '0');
        return h;
      }

      // Version 4: 122 random bits
      function uuidv4() {
        var b = getRandomBytes(16);
        b[6] = (b[6] & 0x0f) | 0x40;  // version 4
        b[8] = (b[8] & 0x3f) | 0x80; // variant (RFC 4122)
        return fmtUuid(bytesToHex(b));
      }

      // Version 1: 100-ns timestamp since 1582-10-15 + random clock + random node
      function uuidv1() {
        var UUID_EPOCH = 0x01b21dd213814000n;
        var now = BigInt(Date.now());
        var ts = now * 10000n + UUID_EPOCH;

        var clock_seq = getRandomBytes(2);
        var node = getRandomBytes(6);
        node[0] |= 0x01; // set multicast bit for privacy

        var b = new Uint8Array(16);
        // time_low (32 bits, big-endian in byte layout)
        b[0] = Number((ts >> 24n) & 0xffn);
        b[1] = Number((ts >> 16n) & 0xffn);
        b[2] = Number((ts >> 8n) & 0xffn);
        b[3] = Number(ts & 0xffn);
        // time_mid (16 bits)
        b[4] = Number((ts >> 40n) & 0xffn);
        b[5] = Number((ts >> 32n) & 0xffn);
        // time_hi_and_version (16 bits, version 1 in high nibble)
        b[6] = 0x10 | Number((ts >> 56n) & 0x0fn);
        b[7] = Number((ts >> 48n) & 0xffn);
        // clock_seq (16 bits, variant 10xx_xxxx in high 2 bits)
        b[8] = 0x80 | (clock_seq[0] & 0x3f);
        b[9] = clock_seq[1];
        // node (48 bits)
        b[10] = node[0];
        b[11] = node[1];
        b[12] = node[2];
        b[13] = node[3];
        b[14] = node[4];
        b[15] = node[5];

        return fmtUuid(bytesToHex(b));
      }

      // Version 7: 48-bit Unix timestamp_ms + 74 random bits + RFC 4122 variant
      function uuidv7() {
        var ts = BigInt(Date.now());
        var rand = getRandomBytes(10);

        var b = new Uint8Array(16);
        // Bytes 0-5: big-endian 48-bit Unix timestamp in milliseconds
        b[0] = Number((ts >> 40n) & 0xffn);
        b[1] = Number((ts >> 32n) & 0xffn);
        b[2] = Number((ts >> 24n) & 0xffn);
        b[3] = Number((ts >> 16n) & 0xffn);
        b[4] = Number((ts >> 8n) & 0xffn);
        b[5] = Number(ts & 0xffn);
        // Byte 6: version 7 (0x70) in high nibble + 4 bits of rand
        b[6] = 0x70 | (rand[0] & 0x0f);
        // Byte 7: 8 bits of rand
        b[7] = rand[1];
        // Byte 8: variant (10xx_xxxx = 0x80) in high 2 bits + 6 bits of rand
        b[8] = 0x80 | (rand[2] & 0x3f);
        // Bytes 9-15: 56 bits of rand
        b[9] = rand[3];
        b[10] = rand[4];
        b[11] = rand[5];
        b[12] = rand[6];
        b[13] = rand[7];
        b[14] = rand[8];
        b[15] = rand[9];

        return fmtUuid(bytesToHex(b));
      }

      function uuidGenerate() {
        var version = document.getElementById('uuid-version').value;
        var count = Math.min(100, Math.max(1, parseInt(document.getElementById('uuid-count').value, 10) || 1));
        var list = document.getElementById('uuid-list');
        var notation = document.getElementById('uuid-notation');
        list.innerHTML = '';
        var uuids = [];
        for (var i = 0; i < count; i++) {
          var uuid = version === '1' ? uuidv1() : version === '7' ? uuidv7() : uuidv4();
          uuids.push(uuid);
          var item = document.createElement('div');
          item.className = 'uuid-item';
          item.innerHTML = '<code>' + uuid + '</code>' +
            '<button type="button" class="tb-btn tb-btn-secondary copy-btn" aria-label="Copy UUID" onclick="uuidCopy(\'' + uuid + '\')">Copy</button>';
          list.appendChild(item);
        }
        notation.textContent = 'Generated ' + uuids.length + ' UUID' + (uuids.length > 1 ? 's' : '') + ' \u2014 last: ' + uuids[0];
      }

      window.uuidCopy = function(uuid) {
        navigator.clipboard.writeText(uuid).then(function() {
          if (window.toolbox && window.toolbox.toast) window.toolbox.toast('Copied to clipboard');
        });
      };

      window.uuidOnVersionChange = function() {
        uuidGenerate();
      };

      // Generate on load
      uuidGenerate();
    })();
    </script>
  `,
});
