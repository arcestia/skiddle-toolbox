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
          <select id="uuid-version" class="tb-select" onchange="uuidGenerate()">
            <option value="1">v1 — Timestamp-based</option>
            <option value="4" selected>v4 — Random</option>
            <option value="7">v7 — Unix Epoch time-based</option>
          </select>
        </div>
        <div class="uuid-control-row">
          <label class="tb-label" for="uuid-count">Count</label>
          <input type="number" id="uuid-count" class="tb-input" value="1" min="1" max="100" style="width:80px;" onchange="uuidGenerate()">
        </div>
        <button type="button" class="tb-btn tb-btn-primary" onclick="uuidGenerate()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          Generate
        </button>
      </div>

      <div id="uuid-list" class="uuid-list"></div>

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
      .uuid-item button { flex-shrink: 0; padding: 3px 8px; font-size: 0.75rem; }
      .uuid-notation { font-size: 0.78rem; color: var(--text-secondary); margin-top: 8px; }
      .uuid-notation:empty { display: none; }
      .uuid-versions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
      .uuid-version-card { padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border); }
      .uuid-version-card h3 { font-size: 0.88rem; font-weight: 600; margin: 0 0 4px; }
      .uuid-version-card p { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }
    </style>

    <script>
    (function() {
      // Node-style crypto.getRandomValues polyfill for browser
      function getRandomValues(buf) {
        if (window.crypto && window.crypto.getRandomValues) {
          window.crypto.getRandomValues(buf);
        } else {
          for (var i = 0; i < buf.length; i++) {
            buf[i] = Math.floor(Math.random() * 256);
          }
        }
        return buf;
      }

      function hex(bytes) {
        return Array.from(bytes).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
      }

      function uuidv4() {
        var bytes = new Uint8Array(16);
        getRandomValues(bytes);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        var h = hex(bytes);
        return h.slice(0,8) + '-' + h.slice(8,12) + '-' + h.slice(12,16) + '-' + h.slice(16,20) + '-' + h.slice(20);
      }

      function uuidv1() {
        var now = Date.now();
        var secs = Math.floor(now / 1000) + 0x01b21dd213814000;
        var nanos = (now % 1000) * 1000000 + Math.floor(Math.random() * 0x3fff) * 1000000;
        var time_low = nanos >>> 0;
        var time_mid = (nanos >>> 32) & 0xffff;
        var time_hi = ((secs >>> 12) & 0x0fff) | 0x1000;
        var clock_seq = (Math.floor(Math.random() * 0x3fff)) | 0x8000;
        var mac = new Uint8Array(6);
        getRandomValues(mac);
        // Use random MAC to avoid leaking device identity
        mac[0] |= 0x01;
        var bytes = new Uint8Array(16);
        var view = new DataView(bytes.buffer);
        view.setUint32(0, time_low, true);
        view.setUint16(4, time_mid, true);
        view.setUint16(6, time_hi, true);
        view.setUint16(8, clock_seq, true);
        bytes.set(mac, 10);
        var h = hex(bytes);
        return h.slice(0,8) + '-' + h.slice(8,12) + '-' + h.slice(12,16) + '-' + h.slice(16,20) + '-' + h.slice(20);
      }

      function uuidv7() {
        var now = Date.now();
        var rand = new Uint8Array(10);
        getRandomValues(rand);
        var high = now * 4096 + (rand[0] >> 4);
        var mid = (rand[0] & 0x0f) * 0x100000000 + (rand[1] * 0x1000000) + (rand[2] * 0x10000) + (rand[3] * 0x100) + rand[4];
        var low = (rand[5] * 0x10000000000) + (rand[6] * 0x100000000) + (rand[7] * 0x1000000) + (rand[8] * 0x10000) + (rand[9] * 0x100) + (rand[4] & 0x0f);
        var bytes = new Uint8Array(16);
        var view = new DataView(bytes.buffer);
        view.setUint32(0, (high / 0x100000000) | 0, false);
        view.setUint32(4, high >>> 0, false);
        view.setUint32(8, mid, false);
        view.setUint32(12, low, false);
        var h = hex(bytes);
        return h.slice(0,8) + '-' + h.slice(8,12) + '-' + h.slice(12,16) + '-' + h.slice(16,20) + '-' + h.slice(20);
      }

      window.uuidGenerate = function() {
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
            '<button type="button" class="tb-btn tb-btn-secondary" onclick="navigator.clipboard.writeText(\'' + uuid + '\').then(function(){if(window.toolbox&&window.toolbox.toast)window.toolbox.toast(\'Copied\')})">Copy</button>';
          list.appendChild(item);
        }
        var note = count > 1 ? count + ' UUIDs generated' : uuids[0];
        notation.textContent = 'Last generated: ' + uuids[0] + (count > 1 ? ' (+' + (count-1) + ' more)' : '');
      };

      // Generate on load
      uuidGenerate();
    })();
    </script>
  `,
});
