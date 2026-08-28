import { layout } from './layout.js';
import { footer } from './footer.js';

export const jwtDecoderView = (): string => layout({
  title: 'JWT Decoder · Skiddle Toolbox',
  description: 'Decode and inspect JWT tokens (header, payload, signature) — entirely in your browser. No data leaves your device.',
  canonicalPath: '/jwt-decoder',
  body: `
    <div class="tb-page-header">
      <div class="tb-tool-icon">&#128275;</div>
      <div class="tb-page-header__text">
        <h1>JWT Decoder</h1>
        <p>Decode and inspect JWT tokens (header, payload, signature) — entirely in your browser. No data leaves your device.</p>
      </div>
    </div>

    <div class="tb-card">
      <label class="tb-label" for="jwt-input">JWT Token</label>
      <textarea id="jwt-input" class="tb-input" rows="4" placeholder="Paste your JWT token here..." spellcheck="false" style="resize:vertical; font-family:'JetBrains Mono',monospace; font-size:0.82rem; word-break:break-all;"></textarea>
      <div id="jwt-error" class="tb-error" style="display:none; margin-top:6px;"></div>
    </div>

    <div id="jwt-output" style="display:none;">
      <div class="tb-card">
        <div class="jwt-section">
          <div class="jwt-header">
            <div class="jwt-label-row">
              <h2 class="section-title" style="margin:0;">Header</h2>
              <button type="button" class="tb-btn tb-btn-secondary" style="padding:2px 8px;font-size:0.72rem;" onclick="jwtCopySection('header')">Copy</button>
            </div>
            <span class="jwt-badge" id="jwt-alg-badge"></span>
          </div>
          <pre id="jwt-header-pre" class="jwt-pre"></pre>
        </div>

        <div class="jwt-section">
          <div class="jwt-label-row">
            <h2 class="section-title" style="margin:0;">Payload</h2>
            <div style="display:flex;gap:6px;">
              <button type="button" class="tb-btn tb-btn-secondary" style="padding:2px 8px;font-size:0.72rem;" onclick="jwtCopySection('payload')">Copy</button>
              <button type="button" class="tb-btn tb-btn-secondary" style="padding:2px 8px;font-size:0.72rem;" onclick="jwtTogglePayload()">Expand claims</button>
            </div>
          </div>
          <div id="jwt-claims-badges" class="jwt-claims-badges"></div>
          <pre id="jwt-payload-pre" class="jwt-pre"></pre>
        </div>

        <div class="jwt-section">
          <div class="jwt-label-row">
            <h2 class="section-title" style="margin:0;">Signature</h2>
            <button type="button" class="tb-btn tb-btn-secondary" style="padding:2px 8px;font-size:0.72rem;" onclick="jwtCopySection('signature')">Copy</button>
          </div>
          <pre id="jwt-signature-pre" class="jwt-pre"></pre>
          <div id="jwt-signature-note" class="jwt-note">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Signature verification requires the secret or public key and is not performed here.
          </div>
        </div>
      </div>

      <div id="jwt-registered-claims" class="tb-card" style="display:none;">
        <h2 class="section-title" style="margin-bottom:12px;">Registered Claims</h2>
        <div id="jwt-claims-list" class="jwt-claims-list"></div>
      </div>
    </div>

    ${footer()}

    <style>
      .jwt-section { margin-bottom: 20px; }
      .jwt-section:last-child { margin-bottom: 0; }
      .jwt-label-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
      .jwt-badge { font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: var(--accent-alpha, rgba(99,102,241,0.15)); color: var(--accent-color, var(--accent)); border: 1px solid var(--accent-color, var(--accent)); }
      .jwt-pre {
        background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-sm);
        padding: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; overflow-x: auto;
        white-space: pre-wrap; word-break: break-all; color: var(--text); line-height: 1.6; margin: 0;
      }
      .jwt-note {
        display: flex; align-items: flex-start; gap: 6px; margin-top: 8px; font-size: 0.78rem;
        color: var(--text-secondary); line-height: 1.5;
      }
      .jwt-note svg { flex-shrink: 0; margin-top: 2px; }
      .jwt-claims-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
      .jwt-claim-chip { font-size: 0.72rem; padding: 2px 8px; border-radius: 999px; font-weight: 600; }
      .jwt-claim-chip.exp { background: rgba(239,68,68,0.12); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
      .jwt-claim-chip.iat { background: rgba(59,130,246,0.12); color: #3b82f6; border: 1px solid rgba(59,130,246,0.3); }
      .jwt-claim-chip.nbf { background: rgba(245,158,11,0.12); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); }
      .jwt-claim-chip.other { background: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border); }
      .jwt-claims-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
      .jwt-claim-item { padding: 10px 12px; background: var(--bg-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border); }
      .jwt-claim-item .claim-name { font-size: 0.78rem; font-weight: 700; color: var(--text); margin-bottom: 2px; }
      .jwt-claim-item .claim-value { font-size: 0.78rem; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace; word-break: break-all; }
      .jwt-claim-item .claim-desc { font-size: 0.72rem; color: var(--text-secondary); margin-top: 4px; }
      .jwt-claim-item.expired { border-color: rgba(239,68,68,0.3); }
      .jwt-claim-item.valid { border-color: rgba(34,197,94,0.3); }
    </style>

    <script>
    (function() {
      var REGISTERED_CLAIMS = {
        iss: { name: 'Issuer', desc: 'Who issued this token' },
        sub: { name: 'Subject', desc: 'The subject of this token' },
        aud: { name: 'Audience', desc: 'Who this token is intended for' },
        exp: { name: 'Expiration Time', desc: 'Unix timestamp when token expires' },
        nbf: { name: 'Not Before', desc: 'Unix timestamp before which token is invalid' },
        iat: { name: 'Issued At', desc: 'Unix timestamp when token was issued' },
        jti: { name: 'JWT ID', desc: 'Unique identifier for this token' },
      };

      var payloadExpanded = false;

      window.jwtTogglePayload = function() {
        payloadExpanded = !payloadExpanded;
        var pre = document.getElementById('jwt-payload-pre');
        pre.style.whiteSpace = payloadExpanded ? 'pre-wrap' : 'pre';
        pre.style.wordBreak = payloadExpanded ? 'break-all' : 'normal';
      };

      window.jwtCopySection = function(section) {
        var el = document.getElementById('jwt-' + section + '-pre');
        if (!el) return;
        navigator.clipboard.writeText(el.textContent).then(function() {
          if (window.toolbox && window.toolbox.toast) window.toolbox.toast('Copied to clipboard');
        });
      };

      function base64UrlDecode(str) {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) str += '=';
        try { return decodeURIComponent(atob(str).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')); }
        catch (e) { return atob(str); }
      }

      function formatJson(json) {
        return JSON.stringify(JSON.parse(json), null, 2);
      }

      function formatTimestamp(ts) {
        var d = new Date(ts * 1000);
        return ts + '  →  ' + d.toISOString() + ' UTC';
      }

      function formatRelativeTime(ts) {
        var diff = ts * 1000 - Date.now();
        var abs = Math.abs(diff);
        var label = diff < 0 ? 'ago' : 'from now';
        if (abs < 60000) return Math.floor(abs / 1000) + ' seconds ' + label;
        if (abs < 3600000) return Math.floor(abs / 60000) + ' minutes ' + label;
        if (abs < 86400000) return Math.floor(abs / 3600000) + ' hours ' + label;
        return Math.floor(abs / 86400000) + ' days ' + label;
      }

      function decodeJwt(token) {
        var parts = token.trim().split('.');
        if (parts.length !== 3) throw new Error('JWT must have exactly 3 parts separated by dots.');
        var header, payload, signature;
        try { header = JSON.parse(base64UrlDecode(parts[0])); }
        catch (e) { throw new Error('Invalid header: ' + e.message); }
        try { payload = JSON.parse(base64UrlDecode(parts[1])); }
        catch (e) { throw new Error('Invalid payload: ' + e.message); }
        signature = parts[2];
        return { header, payload, signature };
      }

      function updateDisplay(decoded) {
        document.getElementById('jwt-output').style.display = '';
        document.getElementById('jwt-error').style.display = 'none';

        // Header
        document.getElementById('jwt-header-pre').textContent = formatJson(JSON.stringify(decoded.header));
        if (decoded.header.alg) {
          var badge = document.getElementById('jwt-alg-badge');
          badge.textContent = decoded.header.alg;
          badge.style.display = '';
        } else {
          document.getElementById('jwt-alg-badge').style.display = 'none';
        }

        // Payload
        var payloadStr = formatJson(JSON.stringify(decoded.payload));
        document.getElementById('jwt-payload-pre').textContent = payloadStr;

        // Signature
        document.getElementById('jwt-signature-pre').textContent = decoded.signature;

        // Claims chips
        var chipsEl = document.getElementById('jwt-claims-badges');
        chipsEl.innerHTML = '';
        ['exp', 'iat', 'nbf'].forEach(function(claim) {
          if (decoded.payload[claim]) {
            var chip = document.createElement('span');
            chip.className = 'jwt-claim-chip ' + claim;
            var label = claim.toUpperCase() + ': ' + formatTimestamp(decoded.payload[claim]) + ' (' + formatRelativeTime(decoded.payload[claim]) + ')';
            chip.textContent = label;
            chip.title = label;
            chipsEl.appendChild(chip);
          }
        });

        // Registered claims card
        var regCard = document.getElementById('jwt-registered-claims');
        var claimsList = document.getElementById('jwt-claims-list');
        var regKeys = Object.keys(decoded.payload).filter(function(k) { return k in REGISTERED_CLAIMS; });
        if (regKeys.length > 0) {
          regCard.style.display = '';
          claimsList.innerHTML = '';
          regKeys.forEach(function(k) {
            var info = REGISTERED_CLAIMS[k];
            var item = document.createElement('div');
            var isTime = ['exp', 'iat', 'nbf'].indexOf(k) !== -1;
            var val = decoded.payload[k];
            var displayVal = isTime ? formatTimestamp(val) + ' (' + formatRelativeTime(val) + ')' : String(val);
            var isExpired = k === 'exp' && val * 1000 < Date.now();
            var isValid = k === 'exp' && val * 1000 >= Date.now();
            item.className = 'jwt-claim-item' + (isExpired ? ' expired' : '') + (isValid ? ' valid' : '');
            item.innerHTML = '<div class="claim-name">' + k + '</div>' +
              '<div class="claim-value">' + escHtml(displayVal) + '</div>' +
              '<div class="claim-desc">' + info.desc + '</div>';
            claimsList.appendChild(item);
          });
        } else {
          regCard.style.display = 'none';
        }
      }

      function escHtml(s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      }

      document.getElementById('jwt-input').addEventListener('input', function() {
        var token = this.value.trim();
        if (!token) {
          document.getElementById('jwt-output').style.display = 'none';
          document.getElementById('jwt-error').style.display = 'none';
          return;
        }
        try {
          var decoded = decodeJwt(token);
          updateDisplay(decoded);
        } catch (e) {
          document.getElementById('jwt-output').style.display = 'none';
          var errEl = document.getElementById('jwt-error');
          errEl.textContent = e.message;
          errEl.style.display = '';
        }
      });
    })();
    </script>
  `,
});
