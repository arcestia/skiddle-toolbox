import { layout } from './layout.js';
import { footer } from './footer.js';

const TYPE_NAMES: Record<number, string> = {
  1: 'A',
  2: 'NS',
  5: 'CNAME',
  6: 'SOA',
  12: 'PTR',
  15: 'MX',
  16: 'TXT',
  28: 'AAAA',
  33: 'SRV',
  257: 'CAA',
  255: 'ANY'
};

export const dnsLookupView = (): string => layout({
  title: 'DNS Lookup · Skiddle Toolbox',
  subtitle: 'Cloudflare Workers Edge Utility',
  backHref: '/',
  themeVariant: 'dots',
  body: `
    <div class="tb-page-header accent-mauve">
      <div class="tb-tool-icon">🔍</div>
      <div class="tb-page-header__text">
        <h1>DNS Lookup</h1>
        <p>Query public DNS-over-HTTPS resolvers for A, AAAA, MX, TXT, CNAME, and other record types.</p>
      </div>
    </div>

    <div class="tb-card">
      <div class="dns-form">
        <div class="tb-form-group dns-form-domain">
          <label class="tb-label" for="dns-domain">Domain</label>
          <input type="text" id="dns-domain" class="tb-input" placeholder="example.com" value="cloudflare.com">
        </div>

        <div class="tb-form-group dns-form-type">
          <label class="tb-label" for="dns-type">Record Type</label>
          <select id="dns-type" class="tb-select">
            <option value="A" selected>A</option>
            <option value="AAAA">AAAA</option>
            <option value="CNAME">CNAME</option>
            <option value="MX">MX</option>
            <option value="TXT">TXT</option>
            <option value="NS">NS</option>
            <option value="SOA">SOA</option>
            <option value="PTR">PTR</option>
            <option value="SRV">SRV</option>
            <option value="CAA">CAA</option>
          </select>
        </div>

        <div class="tb-form-group dns-form-provider">
          <label class="tb-label" for="dns-provider">Resolver</label>
          <select id="dns-provider" class="tb-select">
            <option value="cloudflare" selected>Cloudflare (1.1.1.1)</option>
            <option value="google">Google (8.8.8.8)</option>
            <option value="quad9">Quad9 (9.9.9.9)</option>
          </select>
        </div>

        <div class="dns-form-action">
          <button class="tb-btn" onclick="runDnsLookup()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 2px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Lookup
          </button>
        </div>
      </div>

      <div id="dns-summary" class="tb-summary" aria-live="polite" aria-atomic="true"></div>
      <div id="dns-results"></div>
    </div>

    ${footer()}

    <style>
      .dns-form {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr auto;
        gap: 16px;
        align-items: end;
      }
      .dns-form .tb-form-group { margin-bottom: 0; }
      .dns-form-action { padding-bottom: 1px; }
      @media (max-width: 860px) {
        .dns-form { grid-template-columns: 1fr; }
        .dns-form-action { width: 100%; }
        .dns-form-action .tb-btn { width: 100%; }
      }

      .dns-empty,
      .dns-error {
        margin-top: 18px;
        padding: 28px;
        text-align: center;
        border: 1px dashed var(--border-color);
        border-radius: var(--radius-md);
        background: color-mix(in srgb, var(--ctp-surface0) 15%, transparent);
        color: var(--text-secondary);
      }
      .dns-error { color: var(--color-error); border-color: var(--color-error); background: color-mix(in srgb, var(--color-error) 8%, transparent); }

      .dns-results-table {
        width: 100%;
        margin-top: 18px;
        border-collapse: collapse;
        font-size: 0.9rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        overflow: hidden;
      }
      .dns-results-table th,
      .dns-results-table td {
        padding: 12px 14px;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
      }
      .dns-results-table th {
        background: color-mix(in srgb, var(--ctp-surface0) 35%, transparent);
        font-weight: 700;
        color: var(--text-secondary);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.6px;
      }
      .dns-results-table tr:last-child td { border-bottom: none; }
      .dns-results-table tr:hover td { background: color-mix(in srgb, var(--ctp-surface0) 15%, transparent); }
      .dns-results-table td { font-family: var(--font-mono); }
      .dns-results-table .dns-name { color: var(--text-secondary); }
      .dns-results-table .dns-data { color: var(--text-primary); word-break: break-all; }
      .dns-results-table .dns-ttl { white-space: nowrap; color: var(--text-muted); }
      .dns-results-table .dns-type { white-space: nowrap; }
      .dns-type-badge {
        display: inline-flex;
        align-items: center;
        padding: 3px 8px;
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        font-weight: 700;
        background: color-mix(in srgb, var(--accent-primary) 12%, transparent);
        color: var(--accent-primary);
        border: 1px solid color-mix(in srgb, var(--accent-primary) 30%, var(--border-color));
      }
    </style>

    <script>
      (function () {
        const TYPE_NAMES = {
          1: 'A', 2: 'NS', 5: 'CNAME', 6: 'SOA', 12: 'PTR',
          15: 'MX', 16: 'TXT', 28: 'AAAA', 33: 'SRV', 257: 'CAA', 255: 'ANY'
        };

        function typeName(type) {
          return TYPE_NAMES[type] || ('Type ' + type);
        }

        function formatRecord(type, data) {
          if (type === 15 && data && typeof data === 'string' && data.includes(' ')) {
            const parts = data.split(' ');
            return '<span style="color:var(--text-muted)">Priority ' + parts[0] + '</span> · ' + parts.slice(1).join(' ');
          }
          return data;
        }

        window.runDnsLookup = async function () {
          const domain = document.getElementById('dns-domain').value.trim();
          const type = document.getElementById('dns-type').value;
          const provider = document.getElementById('dns-provider').value;
          const summaryDiv = document.getElementById('dns-summary');
          const resultsDiv = document.getElementById('dns-results');

          if (!domain) {
            summaryDiv.innerHTML = '<span class="tb-badge tb-badge-pending">Waiting</span>';
            resultsDiv.innerHTML = '<div class="dns-error">Please enter a domain.</div>';
            return;
          }

          summaryDiv.innerHTML = '<span class="tb-badge tb-badge-pending">Querying…</span>';
          resultsDiv.innerHTML = '<div class="tb-state-message">Resolving ' + type + ' records for ' + domain + '…</div>';

          try {
            const res = await fetch('/api/dns?domain=' + encodeURIComponent(domain) + '&type=' + encodeURIComponent(type) + '&provider=' + encodeURIComponent(provider));
            const payload = await res.json();

            if (!res.ok || payload.error) {
              summaryDiv.innerHTML = '<span class="tb-badge" style="background:var(--color-error);color:#fff;">Error</span>';
              resultsDiv.innerHTML = '<div class="dns-error">' + (payload.error || 'Request failed') + '</div>';
              return;
            }

            const data = payload.data || {};
            const answers = Array.isArray(data.Answer) ? data.Answer : [];
            const statusCode = typeof data.Status === 'number' ? data.Status : null;

            let statusBadge = '';
            if (statusCode === 0) statusBadge = '<span class="tb-badge tb-badge-active">NOERROR</span>';
            else if (statusCode === 3) statusBadge = '<span class="tb-badge" style="background:var(--color-warn);color:#111;">NXDOMAIN</span>';
            else statusBadge = '<span class="tb-badge" style="background:var(--color-error);color:#fff;">Status ' + statusCode + '</span>';

            summaryDiv.innerHTML = statusBadge + ' <span style="color:var(--text-secondary);font-size:0.9rem;">' + answers.length + ' record' + (answers.length === 1 ? '' : 's') + ' found</span>';

            if (answers.length === 0) {
              resultsDiv.innerHTML = '<div class="dns-empty">No ' + type + ' records returned for <strong>' + domain + '</strong>.</div>';
              return;
            }

            const rows = answers.map(r => {
              return '<tr>' +
                '<td class="dns-type"><span class="dns-type-badge">' + typeName(r.type) + '</span></td>' +
                '<td class="dns-name">' + (r.name || domain) + '</td>' +
                '<td class="dns-data">' + formatRecord(r.type, r.data) + '</td>' +
                '<td class="dns-ttl">' + (r.TTL || '-') + 's</td>' +
              '</tr>';
            }).join('');

            resultsDiv.innerHTML = '<table class="dns-results-table"><thead><tr><th>Type</th><th>Name</th><th>Data</th><th>TTL</th></tr></thead><tbody>' + rows + '</tbody></table>';
          } catch (err) {
            summaryDiv.innerHTML = '<span class="tb-badge" style="background:var(--color-error);color:#fff;">Error</span>';
            resultsDiv.innerHTML = '<div class="dns-error">' + (err.message || 'DNS lookup failed') + '</div>';
          }
        };

        // Allow Enter key to submit.
        document.getElementById('dns-domain').addEventListener('keypress', function (e) {
          if (e.key === 'Enter') runDnsLookup();
        });

        // Keyboard shortcuts
        if (window.toolbox) {
          window.toolbox.registerShortcut('ctrl+enter', 'Run DNS lookup', runDnsLookup, 'DNS Lookup');
        }
      })();
    </script>
  `
});
