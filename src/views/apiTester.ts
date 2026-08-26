import { layout } from './layout.js';
import { footer } from './footer.js';

export const apiTesterView = (): string => layout({
  title: 'API Tester · Skiddle Toolbox',
  description: 'Browser-local HTTP client with custom methods, headers, body editor, and optional CORS proxy for cross-origin debugging.',
  subtitle: 'Browser-local HTTP client',
  backHref: '/',
  themeVariant: 'dots',
  body: `
    <div class="tb-page-header accent-blue">
      <div class="tb-tool-icon">🌐</div>
      <div class="tb-page-header__text">
        <h1>API Tester</h1>
        <p>Browser-local HTTP client with custom methods, headers, body editor, and optional CORS proxy.</p>
      </div>
    </div>

    <div class="tb-card">
      <div class="api-layout">
        <!-- Request form -->
        <div>
          <div class="tb-form-group">
            <label class="tb-label" for="api-url">Request URL</label>
            <div class="api-url-row">
              <select id="api-method" class="api-select" onchange="toggleBodyField()">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
                <option value="HEAD">HEAD</option>
                <option value="OPTIONS">OPTIONS</option>
              </select>
              <input type="text" id="api-url" class="api-input" placeholder="https://api.example.com/users" value="https://httpbin.org/get">
            </div>
          </div>

          <div class="tb-form-group">
            <div class="api-section-title">
              <span>Headers</span>
              <button class="tb-btn tb-btn-secondary" type="button" onclick="addHeaderRow()">+ Add</button>
            </div>
            <div id="api-headers" class="headers-editor">
              <div class="header-row">
                <input type="text" placeholder="Header" value="Accept">
                <input type="text" placeholder="Value" value="application/json">
                <button type="button" onclick="removeHeaderRow(this)" aria-label="Remove header">×</button>
              </div>
            </div>
          </div>

          <div class="tb-form-group" id="api-body-group">
            <label class="tb-label" for="api-body">
              Request Body
              <span id="api-body-hint" class="tb-secondary" style="font-weight:500; text-transform:none; margin-left:8px; font-size:0.75rem;">(enabled for POST, PUT, PATCH)</span>
            </label>
            <textarea id="api-body" class="tb-textarea" rows="8" placeholder='{"name":"test"}'></textarea>
            <div style="margin-top:8px; display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
              <label class="tb-label" style="margin-bottom:0;">Body type:</label>
              <select id="api-body-type" class="api-select" style="width:auto; min-width:160px;" onchange="applyBodyType()">
                <option value="">Manual / from headers</option>
                <option value="application/json" selected>JSON (application/json)</option>
                <option value="text/plain">Plain text (text/plain)</option>
                <option value="application/x-www-form-urlencoded">Form (application/x-www-form-urlencoded)</option>
              </select>
            </div>
          </div>

          <div class="tb-form-group">
            <label class="tb-checkbox">
              <input type="checkbox" id="api-use-proxy">
              Route through local Worker CORS proxy (needed for many cross-origin requests)
            </label>
          </div>

          <button class="tb-btn" onclick="sendApiRequest()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            Send Request
          </button>
        </div>

        <!-- Response panel -->
        <div>
          <div class="api-section-title">Response</div>
          <div id="api-response-empty" class="response-empty">Send a request to see the response here.</div>

          <div id="api-response-content" class="tb-hidden" aria-live="polite" aria-label="API response">
            <div id="api-cors-warning" class="cors-warning tb-hidden"></div>

            <div class="response-meta">
              <div id="api-status" class="response-status" role="status" aria-label="HTTP status code" aria-live="polite"></div>
              <div class="response-detail">
                <span id="api-status-text">OK</span>
                <span>·</span>
                <span id="api-duration">0 ms</span>
                <span>·</span>
                <span id="api-size">0 B</span>
              </div>
            </div>

            <div class="response-panels">
              <div class="response-panel">
                <div class="response-panel-header">
                  <span class="response-panel-title">Response Headers</span>
                </div>
                <div id="api-response-headers" class="response-panel-body">
                  <div class="response-headers-list"></div>
                </div>
              </div>

              <div class="response-panel">
                <div class="response-panel-header">
                  <span class="response-panel-title">Response Body</span>
                  <div class="body-toolbar">
                    <button class="tb-btn tb-btn-secondary" type="button" onclick="formatResponseBody()">Format</button>
                    <button class="tb-btn tb-btn-secondary" type="button" onclick="copyResponseBody()">Copy</button>
                  </div>
                </div>
                <textarea id="api-response-body" class="tb-textarea" rows="14" readonly style="border-radius:0; border:none; resize:vertical;"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    ${footer()}

    <style>
      .api-layout {
        display: grid;
        grid-template-columns: minmax(320px, 1fr) minmax(320px, 1fr);
        gap: 24px;
        align-items: start;
      }
      @media (max-width: 768px) {
        .api-layout { grid-template-columns: 1fr; }
      }
      .api-input,
      .api-select {
        width: 100%;
        background-color: var(--input-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        padding: 12px 14px;
        font-family: var(--font-sans);
        font-size: 0.95rem;
        transition: all 0.25s ease;
        outline: none;
      }
      .api-input::placeholder,
      .api-select::placeholder { color: var(--text-muted); }
      .api-input:focus,
      .api-select:focus {
        border-color: var(--accent-primary);
        box-shadow: var(--glow-focus);
        background-color: var(--input-bg-focus);
      }
      .api-select {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239399b2' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 36px;
      }
      [data-theme="latte"] .api-select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237c7f93' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      }
      .api-url-row {
        display: flex;
        gap: 10px;
        align-items: stretch;
      }
      .api-url-row select { width: 130px; flex-shrink: 0; }
      .api-url-row input { flex: 1; }
      .headers-editor {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .header-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 8px;
        align-items: center;
      }
      .header-row input {
        background-color: var(--input-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        color: var(--text-primary);
        padding: 9px 11px;
        font-size: 0.85rem;
        font-family: var(--font-mono);
        outline: none;
        transition: all 0.2s ease;
      }
      .header-row input:focus {
        border-color: var(--accent-primary);
        box-shadow: var(--glow-focus);
      }
      .header-row button {
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .header-row button:hover {
        border-color: var(--color-bad);
        color: var(--color-bad);
        background: color-mix(in srgb, var(--ctp-red) 10%, transparent);
      }
      .api-section-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.6px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .api-section-title button {
        font-size: 0.75rem;
        padding: 5px 10px;
      }
      .response-empty {
        padding: 40px 20px;
        text-align: center;
        color: var(--text-muted);
        border: 1px dashed var(--border-color);
        border-radius: var(--radius-md);
        background: color-mix(in srgb, var(--ctp-surface0) 15%, transparent);
      }
      .response-meta {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border-color);
      }
      .response-status {
        font-size: 1.6rem;
        font-weight: 800;
        font-family: var(--font-mono);
      }
      .response-status.ok { color: var(--color-ok); }
      .response-status.redirect { color: var(--color-info); }
      .response-status.error { color: var(--color-bad); }
      .response-detail {
        font-size: 0.85rem;
        color: var(--text-secondary);
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
      }
      .response-panels {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .response-panel {
        background: color-mix(in srgb, var(--ctp-mantle) 55%, transparent);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        overflow: hidden;
      }
      .response-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 14px;
        background: color-mix(in srgb, var(--ctp-surface0) 40%, transparent);
        border-bottom: 1px solid var(--border-color);
      }
      .response-panel-title {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .response-panel-body {
        padding: 14px;
        max-height: 280px;
        overflow: auto;
        font-family: var(--font-mono);
        font-size: 0.82rem;
        line-height: 1.6;
        color: var(--text-primary);
        white-space: pre-wrap;
        word-break: break-word;
      }
      .response-headers-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .response-header-item {
        display: flex;
        gap: 10px;
      }
      .response-header-name {
        color: var(--accent-primary);
        font-weight: 600;
        flex-shrink: 0;
      }
      .response-header-value {
        color: var(--text-secondary);
      }
      .cors-warning {
        padding: 14px;
        border-radius: var(--radius-md);
        border: 1px solid color-mix(in srgb, var(--ctp-yellow) 40%, transparent);
        background: color-mix(in srgb, var(--ctp-yellow) 10%, transparent);
        color: var(--text-primary);
        font-size: 0.9rem;
        line-height: 1.6;
        margin-bottom: 16px;
      }
      .cors-warning strong {
        color: var(--color-warn);
        display: block;
        margin-bottom: 4px;
      }
      .body-toolbar {
        display: flex;
        gap: 8px;
      }
      .body-toolbar button {
        font-size: 0.7rem;
        padding: 4px 8px;
      }
    </style>

    <script>
      const bodyMethods = ['POST', 'PUT', 'PATCH'];
      let lastResponseBody = '';
      let lastResponseFormatted = '';

      function toggleBodyField() {
        const method = document.getElementById('api-method').value;
        const textarea = document.getElementById('api-body');
        const hint = document.getElementById('api-body-hint');
        const enabled = bodyMethods.includes(method);
        textarea.disabled = !enabled;
        textarea.style.opacity = enabled ? '1' : '0.5';
        textarea.style.cursor = enabled ? 'auto' : 'not-allowed';
        hint.textContent = enabled ? '' : '(enable for POST, PUT, PATCH)';
      }

      function addHeaderRow(key = '', value = '') {
        const container = document.getElementById('api-headers');
        const row = document.createElement('div');
        row.className = 'header-row';
        row.innerHTML = \`
          <input type="text" placeholder="Header" value="\${escapeHtml(key)}">
          <input type="text" placeholder="Value" value="\${escapeHtml(value)}">
          <button type="button" onclick="removeHeaderRow(this)" aria-label="Remove header">×</button>
        \`;
        container.appendChild(row);
      }

      function removeHeaderRow(btn) {
        const rows = document.querySelectorAll('#api-headers .header-row');
        if (rows.length <= 1) {
          const inputs = btn.parentElement.querySelectorAll('input');
          inputs.forEach(input => input.value = '');
          return;
        }
        btn.parentElement.remove();
      }

      function escapeHtml(str) {
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      }

      function collectHeaders() {
        const headers = new Headers();
        document.querySelectorAll('#api-headers .header-row').forEach(row => {
          const inputs = row.querySelectorAll('input');
          const key = inputs[0].value.trim();
          const value = inputs[1].value.trim();
          if (key) headers.append(key, value);
        });
        return headers;
      }

      function setHeader(name, value) {
        const rows = document.querySelectorAll('#api-headers .header-row');
        for (const row of rows) {
          const inputs = row.querySelectorAll('input');
          if (inputs[0].value.trim().toLowerCase() === name.toLowerCase()) {
            inputs[1].value = value;
            return;
          }
        }
        addHeaderRow(name, value);
      }

      function applyBodyType() {
        const type = document.getElementById('api-body-type').value;
        if (type) setHeader('Content-Type', type);
      }

      function statusClass(status) {
        if (status >= 200 && status < 300) return 'ok';
        if (status >= 300 && status < 400) return 'redirect';
        return 'error';
      }

      function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }

      function formatBody(text) {
        lastResponseBody = text;
        try {
          const parsed = JSON.parse(text);
          lastResponseFormatted = JSON.stringify(parsed, null, 2);
          return lastResponseFormatted;
        } catch {
          lastResponseFormatted = text;
          return text;
        }
      }

      function formatResponseBody() {
        const textarea = document.getElementById('api-response-body');
        textarea.value = formatBody(lastResponseBody);
      }

      function copyResponseBody() {
        const textarea = document.getElementById('api-response-body');
        navigator.clipboard.writeText(textarea.value).then(() => {
          window.toolbox.toast('Response body copied to clipboard', 'success');
        });
      }

      async function sendApiRequest() {
        const urlInput = document.getElementById('api-url');
        const method = document.getElementById('api-method').value;
        const bodyInput = document.getElementById('api-body');
        const useProxy = document.getElementById('api-use-proxy').checked;
        const emptyState = document.getElementById('api-response-empty');
        const contentState = document.getElementById('api-response-content');
        const corsWarning = document.getElementById('api-cors-warning');
        const statusEl = document.getElementById('api-status');
        const statusTextEl = document.getElementById('api-status-text');
        const durationEl = document.getElementById('api-duration');
        const sizeEl = document.getElementById('api-size');
        const headersList = document.querySelector('#api-response-headers .response-headers-list');
        const bodyTextarea = document.getElementById('api-response-body');

        let url = urlInput.value.trim();
        if (!url) {
          window.toolbox.toast('Please enter a URL', 'warning');
          return;
        }

        if (!/^https?:\\/\\//i.test(url)) {
          url = 'https://' + url;
          urlInput.value = url;
        }

        emptyState.classList.add('tb-hidden');
        contentState.classList.remove('tb-hidden');
        corsWarning.classList.add('tb-hidden');
        corsWarning.innerHTML = '';
        statusEl.textContent = '...';
        statusEl.className = 'response-status';
        statusTextEl.textContent = 'Sending...';
        durationEl.textContent = '';
        sizeEl.textContent = '';
        headersList.innerHTML = '';
        bodyTextarea.value = '';

        const startTime = performance.now();
        const ctrl = new AbortController();
        const timeoutId = setTimeout(() => ctrl.abort(), 10000);

        const headers = collectHeaders();
        const options = { method, headers, signal: ctrl.signal };

        if (bodyMethods.includes(method)) {
          options.body = bodyInput.value;
        }

        let fetchUrl = url;
        if (useProxy) {
          const useExternalProxy = window.location.protocol === 'file:';
          const proxyPrefix = useExternalProxy ? 'https://corsproxy.io/?' : '/api/cors?url=';
          fetchUrl = proxyPrefix + encodeURIComponent(url);
        }

        try {
          const response = await fetch(fetchUrl, options);
          clearTimeout(timeoutId);
          const duration = Math.round(performance.now() - startTime);

          statusEl.textContent = response.status;
          statusEl.className = 'response-status ' + statusClass(response.status);
          statusTextEl.textContent = response.statusText || 'No Status Text';
          durationEl.textContent = duration + ' ms';

          headersList.innerHTML = '';
          response.headers.forEach((value, key) => {
            const item = document.createElement('div');
            item.className = 'response-header-item';
            item.innerHTML = \`<span class="response-header-name">\${escapeHtml(key)}:</span><span class="response-header-value">\${escapeHtml(value)}</span>\`;
            headersList.appendChild(item);
          });

          const bodyText = await response.text();
          sizeEl.textContent = formatBytes(new Blob([bodyText]).size);
          bodyTextarea.value = formatBody(bodyText);
        } catch (err) {
          clearTimeout(timeoutId);
          statusEl.textContent = 'ERR';
          statusEl.className = 'response-status error';
          statusTextEl.textContent = 'Request failed';
          durationEl.textContent = Math.round(performance.now() - startTime) + ' ms';
          sizeEl.textContent = '0 B';
          headersList.innerHTML = '';
          bodyTextarea.value = '';

          const isCors = err.name === 'TypeError' || /fetch|cors|network/i.test(err.message);
          corsWarning.innerHTML = isCors
            ? \`<strong>Browser CORS block or network error</strong>
               The request could not complete. If the target server does not allow cross-origin requests, enable the <em>"Route through local Worker CORS proxy"</em> toggle and try again.
               <br><br>
               Error: \${escapeHtml(err.message || err.name)}\`
            : \`<strong>Request failed</strong>
               \${escapeHtml(err.message || err.name)}\`;
          corsWarning.classList.remove('tb-hidden');
        }
      }

      toggleBodyField();

      // Keyboard shortcuts
      if (window.toolbox) {
        window.toolbox.registerShortcut('ctrl+enter', 'Send request', sendApiRequest, 'API Tester');
      }
    </script>
  `
});
