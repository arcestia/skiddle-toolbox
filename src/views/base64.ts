import { layout } from './layout.js';
import { footer } from './footer.js';

export const base64View = (): string => layout({
  title: 'Base64 Encoder/Decoder · Skiddle Toolbox',
  description: 'Encode and decode Base64 strings, data URIs, and files directly in your browser.',
  canonicalPath: '/base64',
  body: `
    <div class="tb-page-header">
      <div class="tb-tool-icon">🔤</div>
      <div class="tb-page-header__text">
        <h1>Base64 Encoder / Decoder</h1>
        <p>Encode text or files to Base64 and decode Base64 back to text.</p>
      </div>
    </div>

    <div class="tb-card">
      <div class="b64-mode-tabs" role="tablist" aria-label="Encoding mode">
        <button type="button" class="b64-tab b64-tab--active" role="tab" aria-selected="true" data-mode="encode" onclick="b64SetMode('encode')" aria-controls="b64-workspace">Encode</button>
        <button type="button" class="b64-tab" role="tab" aria-selected="false" data-mode="decode" onclick="b64SetMode('decode')" aria-controls="b64-workspace">Decode</button>
      </div>

      <div id="b64-workspace">
        <div class="b64-grid">
          <div class="b64-col">
            <label for="b64-input" class="tb-label">Input</label>
            <textarea id="b64-input" class="tb-textarea b64-textarea" placeholder="Type or paste text here..." spellcheck="false" oninput="b64Convert()"></textarea>
            <div class="b64-file-row">
              <label class="tb-btn tb-btn-secondary b64-file-btn" for="b64-file">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload file
              </label>
              <input type="file" id="b64-file" class="tb-sr-only" onchange="b64HandleFile(this)" aria-label="Upload file to encode or decode">
              <span id="b64-file-name" class="tb-muted" style="font-size:0.8rem;" aria-live="polite"></span>
            </div>
          </div>
          <div class="b64-col">
            <label for="b64-output" class="tb-label">Output</label>
            <textarea id="b64-output" class="tb-textarea b64-textarea" readonly spellcheck="false" aria-live="polite"></textarea>
            <div class="b64-actions">
              <button type="button" class="tb-btn tb-btn-secondary" onclick="b64Copy()" aria-label="Copy output">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy
              </button>
              <button type="button" class="tb-btn tb-btn-secondary" onclick="b64Clear()" aria-label="Clear all">Clear</button>
            </div>
          </div>
        </div>

        <div id="b64-info" class="b64-info" aria-live="polite"></div>
      </div>
    </div>

    <div class="tb-card" id="b64-options" aria-label="Encoding options">
      <h2 class="section-title" style="margin-bottom:12px;">Options</h2>
      <label class="tb-settings-row" style="gap:8px;cursor:pointer;">
        <input type="checkbox" id="b64-url-safe" onchange="b64Convert()">
        <span>URL-safe encoding</span>
        <span class="tb-muted" style="font-size:0.78rem;">(replace + with -, / with _)</span>
      </label>
      <label class="tb-settings-row" style="gap:8px;cursor:pointer;margin-top:6px;">
        <input type="checkbox" id="b64-data-uri" onchange="b64Convert()">
        <span>Wrap as data URI</span>
        <span class="tb-muted" style="font-size:0.78rem;">(data:text/plain;base64,...)</span>
      </label>
    </div>

    ${footer()}

    <style>
      .b64-mode-tabs { display: flex; gap: 4px; margin-bottom: 16px; }
      .b64-tab {
        padding: 6px 16px; border-radius: var(--radius); border: 1px solid var(--border);
        background: transparent; color: var(--text-secondary); cursor: pointer;
        font-weight: 500; font-size: 0.85rem; transition: all 0.15s;
      }
      .b64-tab--active { background: var(--accent); color: var(--accent-fg); border-color: var(--accent); }
      .b64-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      @media (max-width: 700px) { .b64-grid { grid-template-columns: 1fr; } }
      .b64-col { display: flex; flex-direction: column; gap: 8px; }
      .b64-textarea { min-height: 200px; resize: vertical; font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; }
      .b64-file-row { display: flex; align-items: center; gap: 8px; }
      .b64-file-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; padding: 5px 12px; cursor: pointer; }
      .b64-actions { display: flex; gap: 6px; }
      .b64-info { font-size: 0.8rem; color: var(--text-secondary); margin-top: 12px; }
      .b64-info:empty { display: none; }
      .b64-options--decode { display: none; }
    </style>

    <script>
    (function() {
      var mode = 'encode';

      window.b64SetMode = function(m) {
        mode = m;
        document.querySelectorAll('.b64-tab').forEach(function(t) {
          var active = t.dataset.mode === m;
          t.classList.toggle('b64-tab--active', active);
          t.setAttribute('aria-selected', String(active));
        });
        document.getElementById('b64-options').classList.toggle('b64-options--decode', m === 'decode');
        b64Convert();
      };

      window.b64Convert = function() {
        var input = document.getElementById('b64-input').value;
        var urlSafe = document.getElementById('b64-url-safe').checked;
        var dataUri = document.getElementById('b64-data-uri').checked;
        var info = document.getElementById('b64-info');
        var output = document.getElementById('b64-output');

        if (!input.trim()) { output.value = ''; info.textContent = ''; return; }

        try {
          if (mode === 'encode') {
            var encoded = btoa(unescape(encodeURIComponent(input)));
            if (urlSafe) encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            if (dataUri) encoded = 'data:text/plain;base64,' + encoded;
            output.value = encoded;
            info.textContent = 'Input: ' + new Blob([input]).size + ' bytes → Output: ' + encoded.length + ' chars';
          } else {
            var toDecode = input.trim();
            if (toDecode.indexOf('data:') === 0) {
              var commaIdx = toDecode.indexOf(',');
              toDecode = commaIdx >= 0 ? toDecode.slice(commaIdx + 1) : '';
            }
            toDecode = toDecode.replace(/-/g, '+').replace(/_/g, '/');
            while (toDecode.length % 4) toDecode += '=';
            var decoded = decodeURIComponent(escape(atob(toDecode)));
            output.value = decoded;
            info.textContent = 'Input: ' + input.length + ' chars → Output: ' + new Blob([decoded]).size + ' bytes';
          }
        } catch (e) {
          output.value = '';
          info.textContent = 'Error: ' + e.message;
        }
      };

      window.b64HandleFile = function(el) {
        var file = el.files[0];
        if (!file) return;
        document.getElementById('b64-file-name').textContent = file.name;
        var reader = new FileReader();
        reader.onload = function() {
          if (mode === 'encode') {
            var base64 = reader.result.split(',')[1] || '';
            var dataUri = document.getElementById('b64-data-uri').checked;
            document.getElementById('b64-output').value = dataUri
              ? 'data:' + file.type + ';base64,' + base64
              : base64;
            document.getElementById('b64-info').textContent = file.name + ' (' + file.size + ' bytes) → ' + base64.length + ' chars';
          } else {
            document.getElementById('b64-input').value = reader.result;
            b64Convert();
          }
        };
        reader.readAsDataURL(file);
      };

      window.b64Copy = function() {
        var text = document.getElementById('b64-output').value;
        if (!text) return;
        navigator.clipboard.writeText(text).then(function() {
          if (window.toolbox && window.toolbox.toast) window.toolbox.toast('Copied to clipboard');
        });
      };

      window.b64Clear = function() {
        document.getElementById('b64-input').value = '';
        document.getElementById('b64-output').value = '';
        document.getElementById('b64-info').textContent = '';
        document.getElementById('b64-file-name').textContent = '';
      };
    })();
    </script>
  `,
});
