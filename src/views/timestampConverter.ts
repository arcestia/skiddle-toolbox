import { layout } from './layout.js';
import { footer } from './footer.js';

export const timestampView = (): string => layout({
  title: 'Unix Timestamp Converter · Skiddle Toolbox',
  description: 'Convert between Unix timestamps, ISO 8601, and human-readable dates — entirely in your browser.',
  canonicalPath: '/timestamp-converter',
  body: `
    <div class="tb-page-header">
      <div class="tb-tool-icon">&#128339;</div>
      <div class="tb-page-header__text">
        <h1>Unix Timestamp Converter</h1>
        <p>Convert between Unix timestamps and human-readable dates — entirely in your browser.</p>
      </div>
    </div>

    <div class="tb-card">
      <div class="ts-input-row">
        <div class="ts-input-group">
          <label class="tb-label" for="ts-input">Timestamp or Date</label>
          <input
            type="text"
            id="ts-input"
            class="tb-input"
            placeholder="e.g. 1725220800 or 2024-09-01T12:00:00Z"
            autocomplete="off"
            spellcheck="false"
          />
        </div>
        <div class="ts-input-group" style="flex-shrink:0;">
          <label class="tb-label" for="ts-unit">Unit</label>
          <select id="ts-unit" class="tb-select">
            <option value="s">Seconds</option>
            <option value="ms">Milliseconds</option>
          </select>
        </div>
        <button type="button" class="tb-btn tb-btn-primary ts-now-btn" onclick="tsNow()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Now
        </button>
      </div>

      <div id="ts-results" class="ts-results" aria-live="polite"></div>
    </div>

    <div class="tb-card">
      <h2 class="section-title" style="margin-bottom:12px;">Relative Time</h2>
      <div id="ts-relative" class="ts-relative"></div>
    </div>

    ${footer()}

    <style>
      .ts-input-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; margin-bottom: 16px; }
      .ts-input-group { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 200px; }
      .ts-now-btn { align-self: flex-end; }
      .ts-results { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; }
      .ts-result-item {
        padding: 10px 12px; background: var(--bg-secondary); border-radius: var(--radius-sm);
        border: 1px solid var(--border); display: flex; flex-direction: column; gap: 4px;
      }
      .ts-result-item .label { font-size: 0.72rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.06em; }
      .ts-result-item .value { font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; word-break: break-all; display: flex; align-items: flex-start; gap: 6px; }
      .ts-result-item .value .copy-btn { flex-shrink: 0; margin-top: 2px; }
      .ts-relative { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }
      .ts-relative .rel-value { color: var(--text); font-family: 'JetBrains Mono', monospace; }
    </style>

    <script>
    (function() {
      // Map of label -> [valueFn, copyFn]
      var results = document.getElementById('ts-results');
      var relEl = document.getElementById('ts-relative');

      function tsCopy(val) {
        navigator.clipboard.writeText(String(val)).then(function() {
          if (window.toolbox && window.toolbox.toast) window.toolbox.toast('Copied to clipboard');
        });
      }

      function buildCard(label, value) {
        var item = document.createElement('div');
        item.className = 'ts-result-item';
        var labelEl = document.createElement('span');
        labelEl.className = 'label';
        labelEl.textContent = label;
        var valEl = document.createElement('span');
        valEl.className = 'value';
        valEl.innerHTML = escHtml(String(value));
        if (value !== '—') {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'tb-btn tb-btn-secondary copy-btn';
          btn.setAttribute('aria-label', 'Copy ' + label);
          btn.textContent = 'Copy';
          btn.onclick = (function(v) { return function() { tsCopy(v); }; })(value);
          valEl.appendChild(btn);
        }
        item.appendChild(labelEl);
        item.appendChild(valEl);
        return item;
      }

      function escHtml(s) {
        return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      }

      function parseInput(raw) {
        raw = raw.trim();
        if (!raw) return null;
        // Try ISO 8601 / natural date string
        var d = new Date(raw);
        if (!isNaN(d.getTime()) && raw.match(/[a-zA-Z]/)) {
          return { type: 'date', date: d };
        }
        // Try raw number (seconds or ms)
        if (raw.match(/^-?\d+$/)) {
          var n = BigInt(raw);
          return { type: 'timestamp', value: n };
        }
        return null;
      }

      function updateResults(parsed) {
        results.innerHTML = '';
        relEl.innerHTML = '';
        if (!parsed) return;

        var d;
        if (parsed.type === 'date') {
          d = parsed.date;
        } else {
          // Auto-detect unit
          var unit = document.getElementById('ts-unit').value;
          var n = parsed.value;
          // If value looks like milliseconds (>= 1e12) or seconds (< 1e12), try to detect
          if (n >= 1e12n) {
            d = new Date(Number(n));
          } else {
            d = new Date(Number(n * 1000n));
          }
        }

        if (isNaN(d.getTime())) {
          results.appendChild(buildCard('Error', 'Invalid timestamp'));
          return;
        }

        var ms = d.getTime();
        var s = Math.floor(ms / 1000);
        var ns = ms * 1000000;

        // UTC
        var utcStr = d.toISOString();
        var utcDate = utcStr.split('T')[0];
        var utcTime = utcStr.split('T')[1].replace('Z', ' Z');

        // Local
        var localStr = d.toLocaleString();
        var utcOffset = -d.getTimezoneOffset();
        var tzHours = Math.floor(Math.abs(utcOffset) / 60);
        var tzMins = Math.abs(utcOffset) % 60;
        var tzSign = utcOffset >= 0 ? '+' : '-';
        var tzStr = 'UTC' + tzSign + String(tzHours).padStart(2,'0') + ':' + String(tzMins).padStart(2,'0');

        // Relative
        var nowMs = Date.now();
        var diff = ms - nowMs;
        var diffAbs = Math.abs(diff);
        var diffStr;
        if (diffAbs < 1000) {
          diffStr = 'just now';
        } else if (diffAbs < 60000) {
          diffStr = Math.floor(diffAbs / 1000) + ' seconds ' + (diff < 0 ? 'ago' : 'from now');
        } else if (diffAbs < 3600000) {
          diffStr = Math.floor(diffAbs / 60000) + ' minutes ' + (diff < 0 ? 'ago' : 'from now');
        } else if (diffAbs < 86400000) {
          diffStr = Math.floor(diffAbs / 3600000) + ' hours ' + (diff < 0 ? 'ago' : 'from now');
        } else {
          diffStr = Math.floor(diffAbs / 86400000) + ' days ' + (diff < 0 ? 'ago' : 'from now');
        }

        results.appendChild(buildCard('Unix (seconds)', s));
        results.appendChild(buildCard('Unix (milliseconds)', ms));
        results.appendChild(buildCard('Unix (nanoseconds)', ns.toLocaleString()));
        results.appendChild(buildCard('ISO 8601', utcStr));
        results.appendChild(buildCard('UTC Date', utcDate));
        results.appendChild(buildCard('UTC Time', utcTime));
        results.appendChild(buildCard('Local (' + tzStr + ')', localStr));
        results.appendChild(buildCard('Unix (seconds, 11-digit)', s.toString().padStart(11, '0')));
        results.appendChild(buildCard('Day of Week', d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })));
        results.appendChild(buildCard('Day of Year', Math.ceil((d - new Date(d.getUTCFullYear(), 0, 1)) / 86400000) + ' of ' + d.getUTCFullYear()));
        results.appendChild(buildCard('Week of Year (UTC)', getWeekNumber(d)));

        relEl.innerHTML = diff < 0
          ? '<span class="rel-value">' + diffStr + '</span> (' + Math.abs(Math.floor(diffAbs / 1000)).toLocaleString() + ' seconds ago)'
          : 'In <span class="rel-value">' + diffStr + '</span> (' + Math.floor(diffAbs / 1000).toLocaleString() + ' seconds from now)';
      }

      function getWeekNumber(d) {
        var start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        var days = Math.floor((d - start) / 86400000);
        return Math.ceil((days + start.getUTCDay() + 1) / 7);
      }

      function tsNow() {
        var d = new Date();
        var ms = d.getTime();
        var s = Math.floor(ms / 1000);
        document.getElementById('ts-input').value = s;
        document.getElementById('ts-unit').value = 's';
        updateResults({ type: 'timestamp', value: BigInt(s) });
      }

      document.getElementById('ts-input').addEventListener('input', function() {
        var raw = this.value.trim();
        if (!raw) {
          results.innerHTML = '';
          relEl.innerHTML = '';
          return;
        }
        var parsed = parseInput(raw);
        if (!parsed) {
          results.innerHTML = '';
          relEl.innerHTML = '<span style="color:var(--text-secondary);">Enter a Unix timestamp (seconds or ms) or an ISO/date string.</span>';
          return;
        }
        updateResults(parsed);
      });

      document.getElementById('ts-unit').addEventListener('change', function() {
        document.getElementById('ts-input').dispatchEvent(new Event('input'));
      });

      // Auto-fill current timestamp on load
      tsNow();
    })();
    </script>
  `,
});
