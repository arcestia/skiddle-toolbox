import { layout } from './layout.js';
import { footer } from './footer.js';

export const textExtractorView = (): string => layout({
  title: 'Text Extractor · Skiddle Toolbox',
  subtitle: 'Cloudflare Workers Edge Utility',
  backHref: '/',
  themeVariant: 'dots',
  body: `
    <div class="tb-page-header accent-green">
      <div class="tb-tool-icon">🔗</div>
      <div class="tb-page-header__text">
        <h1>Text Extractor</h1>
        <p>Paste anything — logs, HTML, markdown — and extract URLs, emails, domains, or IP addresses.</p>
      </div>
    </div>

    <div class="tb-card">
      <div class="tb-form-group">
        <label class="tb-label" for="url-input">Raw text</label>
        <textarea id="url-input" class="tb-textarea" rows="10" placeholder="Paste logs, HTML, markdown, or any blob of text here..."></textarea>
      </div>

      <div class="url-options">
        <div class="url-mode-group">
          <span class="url-options-label">Extract</span>
          <button type="button" class="tb-btn tb-btn-secondary url-mode-btn" data-mode="all">All</button>
          <button type="button" class="tb-btn tb-btn-secondary url-mode-btn active" data-mode="urls">URLs</button>
          <button type="button" class="tb-btn tb-btn-secondary url-mode-btn" data-mode="emails">Emails</button>
          <button type="button" class="tb-btn tb-btn-secondary url-mode-btn" data-mode="domains">Domains</button>
          <button type="button" class="tb-btn tb-btn-secondary url-mode-btn" data-mode="ips">IPs</button>
        </div>

        <label class="tb-checkbox">
          <input type="checkbox" id="url-dedupe" checked>
          Deduplicate
        </label>
        <label class="tb-checkbox">
          <input type="checkbox" id="url-sort" checked>
          Sort
        </label>
      </div>

      <div class="tb-btn-group">
        <button class="tb-btn" onclick="runExtractor()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 2px;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          Extract
        </button>
        <button class="tb-btn tb-btn-secondary" onclick="copyExtracted()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:2px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          Copy All
        </button>
        <button class="tb-btn tb-btn-secondary tb-btn-danger" onclick="clearExtractor()">
          Clear
        </button>
      </div>

      <div id="url-summary" class="tb-summary"></div>
      <div id="url-results"></div>
    </div>

    ${footer()}

    <style>
      .url-options {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 18px;
        margin-bottom: 22px;
      }
      .url-mode-group {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .url-options-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.6px;
      }
      .url-mode-btn.active {
        background: var(--ctp-green);
        color: #111;
        border-color: var(--ctp-green);
      }

      .url-empty,
      .url-error {
        margin-top: 18px;
        padding: 28px;
        text-align: center;
        border: 1px dashed var(--border-color);
        border-radius: var(--radius-md);
        background: color-mix(in srgb, var(--ctp-surface0) 15%, transparent);
        color: var(--text-secondary);
      }
      .url-error { color: var(--color-error); border-color: var(--color-error); background: color-mix(in srgb, var(--color-error) 8%, transparent); }

      .url-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 18px;
        max-height: 560px;
        overflow-y: auto;
        padding-right: 6px;
      }
      .url-list::-webkit-scrollbar { width: 6px; }
      .url-list::-webkit-scrollbar-track { background: var(--input-bg); border-radius: 999px; }
      .url-list::-webkit-scrollbar-thumb { background: var(--border-color-glow); border-radius: 999px; }

      .url-card {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 14px;
        align-items: center;
        background: color-mix(in srgb, var(--ctp-mantle) 55%, transparent);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 12px 14px;
        transition: transform 0.2s ease, border-color 0.2s ease;
      }
      .url-card:hover {
        transform: translateX(4px);
        border-color: var(--border-color-glow);
      }
      .url-card__value {
        color: var(--ctp-green);
        font-family: var(--font-mono);
        font-size: 0.9rem;
        word-break: break-all;
        font-weight: 600;
      }
      .url-card__value a {
        color: inherit;
        text-decoration: none;
      }
      .url-card__value a:hover {
        text-decoration: underline;
      }
      .url-card__meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 6px;
      }
      .url-card__pill {
        font-size: 0.72rem;
        padding: 3px 8px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--ctp-surface0) 50%, transparent);
        color: var(--text-muted);
        border: 1px solid var(--border-color);
      }
      .url-card__copy {
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        padding: 8px 10px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .url-card__copy:hover {
        border-color: var(--ctp-green);
        color: var(--ctp-green);
      }
      .url-group-heading {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 18px;
        margin-bottom: 8px;
        font-weight: 700;
        font-size: 0.85rem;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.6px;
      }
      .url-group-heading:first-child { margin-top: 0; }
    </style>

    <script>
      (function () {
        let extractedItems = [];
        let extractedGroups = {};
        let currentMode = 'urls';

        function escapeHtml(str) {
          return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function charBefore(text, idx) {
          return idx > 0 ? text.charAt(idx - 1) : '';
        }

        function stripTrailingPunctuation(raw) {
          let u = raw;
          while (u.length > 0) {
            var last = u.charAt(u.length - 1);
            if (';>"\\',]'.indexOf(last) !== -1) {
              u = u.slice(0, -1);
            } else if (last === ')' && u.indexOf('(') === -1) {
              u = u.slice(0, -1);
            } else {
              break;
            }
          }
          return u;
        }

        function isIpv6(ip) {
          return /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/.test(ip) && ip.indexOf('::') !== -1;
        }

        const EXTRACTORS = {
          urls: {
            label: 'URL',
            regex: /(?:https?|ftp|ssh|s3|file):\\/\\/[^\\s<>"]+/gi,
            clean: function (m) {
              var u = stripTrailingPunctuation(m);
              if (u.indexOf('$') !== -1) return null;
              try {
                new URL(u);
                return u;
              } catch (e) {
                return null;
              }
            },
            href: function (v) { return v; },
            meta: function (v) {
              try {
                var u = new URL(v);
                var scheme = u.protocol.replace(':', '');
                var parts = [
                  '<span class="url-card__pill">' + escapeHtml(scheme) + '</span>',
                  '<span class="url-card__pill">' + escapeHtml(u.hostname) + '</span>'
                ];
                if (u.pathname && u.pathname !== '/') parts.push('<span class="url-card__pill">' + escapeHtml(u.pathname) + '</span>');
                if (u.search) parts.push('<span class="url-card__pill">?' + escapeHtml(u.search.slice(1)) + '</span>');
                if (u.hash) parts.push('<span class="url-card__pill">#' + escapeHtml(u.hash.slice(1)) + '</span>');
                return parts.join('');
              } catch (e) { return ''; }
            }
          },
          emails: {
            label: 'Email',
            regex: /(?<![:/])\\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g,
            clean: function (m) { return m.toLowerCase(); },
            href: function (v) { return 'mailto:' + v; },
            meta: function (v) {
              var at = v.indexOf('@');
              return '<span class="url-card__pill">@' + escapeHtml(v.slice(at + 1)) + '</span>';
            }
          },
          domains: {
            label: 'Domain',
            regex: /(?:https?:\\/\\/)?(?:www\\.)?([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])+)/g,
            clean: function (m, group1, text, index) {
              var domain = (group1 || m).toLowerCase();
              var start = index !== undefined ? index + m.toLowerCase().indexOf(domain) : text.toLowerCase().indexOf(domain);
              var before = start > 0 ? text.charAt(start - 1) : '';
              var after = start + domain.length < text.length ? text.charAt(start + domain.length) : '';
              if (before === '/' || before === '.' || before === '@') return null;
              if (after === '+' || after === '@') return null;
              if (/^[0-9.]+$/.test(domain)) return null;
              if (!/[a-zA-Z]/.test(domain)) return null;
              return domain;
            },
            href: function (v) { return 'https://' + v; },
            meta: function (v) {
              var tld = v.slice(v.lastIndexOf('.') + 1);
              return '<span class="url-card__pill">.' + escapeHtml(tld) + '</span>';
            }
          },
          ips: {
            label: 'IP',
            regex: /\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b|\\b(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}\\b/g,
            clean: function (m) {
              if (m.indexOf(':') !== -1 && !isIpv6(m)) return null;
              return m;
            },
            href: function (v) { return null; },
            meta: function (v) {
              return '<span class="url-card__pill">' + (v.indexOf(':') !== -1 ? 'IPv6' : 'IPv4') + '</span>';
            }
          }
        };

        function getMode() {
          var active = document.querySelector('.url-mode-btn.active');
          return active ? active.dataset.mode : 'urls';
        }

        window.runExtractor = function () {
          currentMode = getMode();
          var raw = document.getElementById('url-input').value || '';
          var dedupe = document.getElementById('url-dedupe').checked;
          var sort = document.getElementById('url-sort').checked;
          var summaryDiv = document.getElementById('url-summary');
          var resultsDiv = document.getElementById('url-results');

          extractedItems = [];
          extractedGroups = {};

          if (!raw.trim()) {
            summaryDiv.innerHTML = '';
            resultsDiv.innerHTML = '<div class="url-empty">Paste some text above to start extracting.</div>';
            return;
          }

          function extractMode(mode) {
            var cfg = EXTRACTORS[mode];
            var matches = [];
            var m;
            cfg.regex.lastIndex = 0;
            while ((m = cfg.regex.exec(raw)) !== null) {
              var cleaned = cfg.clean(m[0], m[1], raw, m.index);
              if (cleaned) matches.push(cleaned);
            }
            if (dedupe) matches = Array.from(new Set(matches));
            if (sort) matches.sort();
            return matches;
          }

          function renderCard(v, cfg) {
            var href = cfg.href(v);
            var valueHtml = href
              ? '<a class="url-card__value" href="' + escapeHtml(href) + '" target="_blank" rel="noopener">' + escapeHtml(v) + '</a>'
              : '<span class="url-card__value">' + escapeHtml(v) + '</span>';
            return '<div class="url-card">' +
              '<div>' + valueHtml + '<div class="url-card__meta">' + cfg.meta(v) + '</div></div>' +
              '<button class="url-card__copy" onclick="copySingleItem(this)" data-value="' + escapeHtml(v) + '" title="Copy">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>' +
              '</button>' +
            '</div>';
          }

          if (currentMode === 'all') {
            var order = ['urls', 'emails', 'domains', 'ips'];
            var total = 0;
            var sections = [];
            order.forEach(function (mode) {
              var items = extractMode(mode);
              extractedGroups[mode] = items;
              extractedItems = extractedItems.concat(items);
              total += items.length;
              if (items.length > 0) {
                var cfg = EXTRACTORS[mode];
                var heading = '<div class="url-group-heading"><span class="tb-badge tb-badge-active">' + items.length + '</span> ' + cfg.label + (items.length === 1 ? '' : 's') + '</div>';
                sections.push(heading + '<div class="url-list">' + items.map(function (v) { return renderCard(v, cfg); }).join('') + '</div>');
              }
            });
            summaryDiv.innerHTML = '<span class="tb-badge tb-badge-active">' + total + '</span> <span style="color:var(--text-secondary);font-size:0.9rem;">total items found</span>';
            if (sections.length === 0) {
              resultsDiv.innerHTML = '<div class="url-empty">No URLs, emails, domains, or IPs found.</div>';
            } else {
              resultsDiv.innerHTML = sections.join('');
            }
            return;
          }

          var cfg = EXTRACTORS[currentMode];
          var matches = extractMode(currentMode);
          extractedItems = matches;

          summaryDiv.innerHTML = '<span class="tb-badge tb-badge-active">' + extractedItems.length + '</span> <span style="color:var(--text-secondary);font-size:0.9rem;">' + cfg.label + (extractedItems.length === 1 ? '' : 's') + ' found</span>';

          if (extractedItems.length === 0) {
            resultsDiv.innerHTML = '<div class="url-empty">No ' + cfg.label.toLowerCase() + 's found in the provided text.</div>';
            return;
          }

          resultsDiv.innerHTML = '<div class="url-list">' + extractedItems.map(function (v) { return renderCard(v, cfg); }).join('') + '</div>';
        };

        window.copyExtracted = async function () {
          if (!extractedItems.length) return;
          var text;
          if (currentMode === 'all' && Object.keys(extractedGroups).length) {
            var order = ['urls', 'emails', 'domains', 'ips'];
            var parts = [];
            order.forEach(function (mode) {
              if (extractedGroups[mode] && extractedGroups[mode].length) {
                parts.push('// ' + EXTRACTORS[mode].label + (extractedGroups[mode].length === 1 ? '' : 's') + '\\n' + extractedGroups[mode].join('\\n'));
              }
            });
            text = parts.join('\\n\\n');
          } else {
            text = extractedItems.join('\\n');
          }
          try {
            await navigator.clipboard.writeText(text);
            alert('Copied ' + extractedItems.length + ' item' + (extractedItems.length === 1 ? '' : 's') + ' to clipboard.');
          } catch (err) {
            alert('Could not copy: ' + (err.message || err));
          }
        };

        window.copySingleItem = async function (btn) {
          var value = btn.getAttribute('data-value');
          if (!value) return;
          try {
            await navigator.clipboard.writeText(value);
            var original = btn.innerHTML;
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            setTimeout(function () { btn.innerHTML = original; }, 1200);
          } catch (err) {
            alert('Could not copy: ' + (err.message || err));
          }
        };

        window.clearExtractor = function () {
          document.getElementById('url-input').value = '';
          document.getElementById('url-summary').innerHTML = '';
          document.getElementById('url-results').innerHTML = '';
          extractedItems = [];
          extractedGroups = {};
        };

        document.querySelectorAll('.url-mode-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            document.querySelectorAll('.url-mode-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
          });
        });
      })();
    </script>
  `
});
