import { layout } from './layout.js';
import { footer } from './footer.js';

export const spreadsheetViewerView = (): string => layout({
  title: 'Spreadsheet Viewer · Skiddle Toolbox',
  description: 'View CSV, TSV, Excel, ODS, JSON, and Markdown tables locally with sorting, filtering, and pagination.',
  subtitle: 'View CSV, Excel, ODS, JSON, and Markdown tables in the browser',
  backHref: '/',
  themeVariant: 'dots',
  body: `
    <div class="tb-page-header accent-green">
      <div class="tb-tool-icon">📊</div>
      <div class="tb-page-header__text">
        <h1>Spreadsheet Viewer</h1>
        <p>Open CSV, TSV, Excel (.xlsx), ODS, JSON, or Markdown tables locally. Sort columns, filter rows, and export back to CSV.</p>
      </div>
    </div>

    <div class="ssv-layout">
      <!-- Main workspace -->
      <div class="ssv-main">
        <!-- Input controls -->
        <div class="tb-card">
          <div class="ssv-input-grid">
            <div class="ssv-drop-zone" id="ssv-drop-zone">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <p><strong>Drop a file here</strong> or click to browse</p>
              <span class="ssv-drop-hint">CSV, TSV, Excel (.xlsx), ODS, JSON, Markdown</span>
              <input type="file" id="ssv-file-input" accept=".csv,.tsv,.xlsx,.xls,.ods,.json,.md,.txt" hidden>
            </div>

            <div class="ssv-or-divider">or</div>

            <div class="ssv-text-input">
              <label class="tb-label" for="ssv-source-text">Paste data or a URL</label>
              <textarea id="ssv-source-text" class="tb-textarea" rows="5" placeholder="Paste CSV/TSV rows, a JSON array, a Markdown table, or type a URL to fetch..."></textarea>
              <div class="ssv-input-actions">
                <select id="ssv-format-select" class="tb-select">
                  <option value="auto">Auto-detect format</option>
                  <option value="csv">CSV</option>
                  <option value="tsv">TSV</option>
                  <option value="xlsx">Excel (.xlsx/.xls)</option>
                  <option value="ods">ODS</option>
                  <option value="json">JSON</option>
                  <option value="md">Markdown table</option>
                </select>
                <button class="tb-btn" id="ssv-load-btn" onclick="loadSpreadsheet()">Load Data</button>
              </div>
            </div>
          </div>

          <div id="ssv-error" class="rgx-error-msg tb-hidden"></div>
        </div>

        <!-- Toolbar & Table -->
        <div class="tb-card" id="ssv-result-card" style="display:none;">
          <div class="ssv-toolbar">
            <div class="ssv-toolbar-left">
              <div id="ssv-sheet-wrap" class="tb-form-group" style="margin:0; min-width:180px;">
                <label class="tb-label" for="ssv-sheet-select">Sheet</label>
                <select id="ssv-sheet-select" class="tb-select" onchange="switchSheet(this.value)"></select>
              </div>
              <div class="tb-form-group" style="margin:0; flex:1; min-width:220px;">
                <label class="tb-label" for="ssv-filter-input">Filter rows</label>
                <input type="text" id="ssv-filter-input" class="tb-input" placeholder="Type to filter any column..." oninput="filterRows()">
              </div>
            </div>
            <div class="ssv-toolbar-right">
              <span id="ssv-row-count" class="tb-badge tb-badge-pending" role="status" aria-live="polite" aria-label="Row count">0 rows</span>
              <button class="tb-btn tb-btn-secondary" onclick="downloadCsv()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export CSV
              </button>
            </div>
          </div>

          <div class="ssv-table-wrap">
            <table id="ssv-table" class="ssv-table"></table>
          </div>

          <div class="ssv-pagination" id="ssv-pagination"></div>
        </div>
      </div>
    </div>

    ${footer()}

    <style>
      .ssv-layout {
        display: grid;
        gap: 24px;
      }

      .ssv-input-grid {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 20px;
        align-items: stretch;
      }

      @media (max-width: 800px) {
        .ssv-input-grid {
          grid-template-columns: 1fr;
        }
        .ssv-or-divider {
          flex-direction: row;
          gap: 12px;
        }
        .ssv-or-divider::before,
        .ssv-or-divider::after {
          width: 100%;
          height: 1px;
        }
      }

      .ssv-drop-zone {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 32px 24px;
        background: color-mix(in srgb, var(--ctp-mantle) 50%, transparent);
        border: 2px dashed var(--border-color);
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.25s ease;
        text-align: center;
      }

      .ssv-drop-zone:hover,
      .ssv-drop-zone.drag-over {
        border-color: var(--ctp-green);
        background: color-mix(in srgb, var(--ctp-green) 8%, transparent);
        color: var(--text-primary);
      }

      .ssv-drop-zone p {
        margin: 0;
        font-weight: 600;
      }

      .ssv-drop-hint {
        font-size: 0.75rem;
        color: var(--text-muted);
      }

      .ssv-or-divider {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: var(--text-muted);
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
      }

      .ssv-or-divider::before,
      .ssv-or-divider::after {
        content: '';
        width: 1px;
        flex: 1;
        background: var(--border-color);
      }

      .ssv-text-input {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .ssv-input-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .ssv-input-actions .tb-select {
        flex: 1;
        min-width: 160px;
      }

      .ssv-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 16px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .ssv-toolbar-left {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        flex: 1;
      }

      .ssv-toolbar-right {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      #ssv-sheet-wrap.tb-hidden {
        display: none;
      }

      .ssv-table-wrap {
        width: 100%;
        overflow-x: auto;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        max-height: 540px;
        overflow-y: auto;
      }

      .ssv-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.85rem;
        font-family: var(--font-mono);
      }

      .ssv-table th,
      .ssv-table td {
        padding: 10px 14px;
        border-bottom: 1px solid var(--border-color);
        border-right: 1px solid color-mix(in srgb, var(--border-color) 50%, transparent);
        text-align: left;
        white-space: nowrap;
      }

      .ssv-table th:last-child,
      .ssv-table td:last-child {
        border-right: none;
      }

      .ssv-table th {
        position: sticky;
        top: 0;
        background: var(--ctp-surface0);
        color: var(--text-primary);
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.7rem;
        letter-spacing: 0.5px;
        cursor: pointer;
        user-select: none;
        transition: background 0.2s ease;
      }

      .ssv-table th:hover {
        background: var(--ctp-surface1);
      }

      .ssv-table th .ssv-sort-icon {
        margin-left: 6px;
        opacity: 0.5;
      }

      .ssv-table th.sorted .ssv-sort-icon {
        opacity: 1;
        color: var(--ctp-green);
      }

      .ssv-table tbody tr:hover {
        background: color-mix(in srgb, var(--ctp-surface0) 35%, transparent);
      }

      .ssv-table td {
        color: var(--text-secondary);
      }

      .ssv-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        margin-top: 18px;
        flex-wrap: wrap;
      }

      .ssv-page-btn {
        background: color-mix(in srgb, var(--ctp-surface0) 50%, transparent);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        padding: 6px 12px;
        font-family: var(--font-sans);
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .ssv-page-btn:hover {
        border-color: var(--border-color-glow);
        color: var(--text-primary);
      }

      .ssv-page-btn.active {
        background: color-mix(in srgb, var(--ctp-green) 20%, transparent);
        border-color: var(--ctp-green);
        color: var(--ctp-green);
      }

      .ssv-page-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    </style>

    <script src="https://cdn.sheetjs.com/xlsx-0.18.5/package/dist/xlsx.full.min.js"></script>
    <script>
      (function () {
        const ROWS_PER_PAGE = 100;

        let workbook = null;
        let currentSheet = '';
        let currentData = { headers: [], rows: [] };
        let filteredRows = [];
        let currentPage = 1;
        let sortColumn = -1;
        let sortDirection = 'asc';

        const dropZone = document.getElementById('ssv-drop-zone');
        const fileInput = document.getElementById('ssv-file-input');
        const sourceText = document.getElementById('ssv-source-text');
        const formatSelect = document.getElementById('ssv-format-select');
        const errorDiv = document.getElementById('ssv-error');
        const resultCard = document.getElementById('ssv-result-card');
        const sheetWrap = document.getElementById('ssv-sheet-wrap');
        const sheetSelect = document.getElementById('ssv-sheet-select');
        const filterInput = document.getElementById('ssv-filter-input');
        const rowCount = document.getElementById('ssv-row-count');
        const table = document.getElementById('ssv-table');
        const pagination = document.getElementById('ssv-pagination');

        function showError(msg) {
          errorDiv.innerText = msg;
          errorDiv.classList.remove('tb-hidden');
        }

        function hideError() {
          errorDiv.classList.add('tb-hidden');
          errorDiv.innerText = '';
        }

        function detectFormat(text, filename) {
          const fmt = formatSelect.value;
          if (fmt !== 'auto') return fmt;

          if (filename) {
            const ext = filename.split('.').pop().toLowerCase();
            if (ext === 'csv') return 'csv';
            if (ext === 'tsv') return 'tsv';
            if (['xlsx', 'xls'].includes(ext)) return 'xlsx';
            if (ext === 'ods') return 'ods';
            if (ext === 'json') return 'json';
            if (['md', 'markdown'].includes(ext)) return 'md';
          }

          const trimmed = text.trim();
          if (trimmed.startsWith('[') || trimmed.startsWith('{')) return 'json';
          if (trimmed.includes('|')) return 'md';
          if (trimmed.includes('\\t')) return 'tsv';
          return 'csv';
        }

        function parseCsvTsv(text, delimiter) {
          const rows = [];
          let row = [];
          let value = '';
          let inQuotes = false;

          for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            const next = text[i + 1];

            if (inQuotes) {
              if (ch === '"') {
                if (next === '"') {
                  value += '"';
                  i++;
                } else {
                  inQuotes = false;
                }
              } else {
                value += ch;
              }
            } else {
              if (ch === '"') {
                inQuotes = true;
              } else if (ch === delimiter) {
                row.push(value);
                value = '';
              } else if (ch === '\\n') {
                row.push(value);
                rows.push(row);
                row = [];
                value = '';
              } else if (ch === '\\r') {
                // skip, will handle LF next
              } else {
                value += ch;
              }
            }
          }
          row.push(value);
          if (row.length > 1 || row[0] !== '') rows.push(row);

          if (rows.length === 0) return { headers: [], rows: [] };
          return { headers: rows[0], rows: rows.slice(1) };
        }

        function parseJson(text) {
          const data = JSON.parse(text);
          let rows = Array.isArray(data) ? data : (data.rows || data.data || []);
          if (!Array.isArray(rows) || rows.length === 0) return { headers: [], rows: [] };

          const headers = Object.keys(rows[0]);
          return {
            headers,
            rows: rows.map(obj => headers.map(h => obj[h] !== undefined ? obj[h] : ''))
          };
        }

        function parseMarkdown(text) {
          const lines = text.split(/\\r?\\n/).map(l => l.trim()).filter(l => l && l.includes('|'));
          if (lines.length < 2) return { headers: [], rows: [] };

          const parseLine = (line) => line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1 || arr.length <= 2);
          // Handle leading/trailing pipes
          const cells = (line) => {
            const parts = line.split('|');
            if (line.startsWith('|')) parts.shift();
            if (line.endsWith('|')) parts.pop();
            return parts.map(c => c.trim());
          };

          const headers = cells(lines[0]);
          const rows = [];
          for (let i = 2; i < lines.length; i++) {
            const row = cells(lines[i]);
            if (row.length) rows.push(row);
          }
          return { headers, rows };
        }

        function parseWithSheetJS(arrayBuffer, format) {
          const data = new Uint8Array(arrayBuffer);
          const bookType = format === 'ods' ? 'ods' : 'xlsx';
          const wb = XLSX.read(data, { type: 'array', bookType });
          workbook = wb;
          populateSheetSelect(wb.SheetNames);
          return sheetToData(wb.SheetNames[0]);
        }

        function sheetToData(sheetName) {
          const ws = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
          if (json.length === 0) return { headers: [], rows: [] };
          // Normalize headers: if first row is short, pad
          const maxCols = Math.max(...json.map(r => r.length));
          const headers = json[0].map((h, i) => h || 'Column ' + (i + 1));
          while (headers.length < maxCols) headers.push('Column ' + (headers.length + 1));
          const rows = json.slice(1).map(r => {
            while (r.length < maxCols) r.push('');
            return r;
          });
          return { headers, rows };
        }

        function populateSheetSelect(names) {
          sheetSelect.innerHTML = '';
          if (names.length <= 1) {
            sheetWrap.classList.add('tb-hidden');
            return;
          }
          sheetWrap.classList.remove('tb-hidden');
          names.forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.innerText = name;
            sheetSelect.appendChild(opt);
          });
        }

        function setData(data) {
          currentData = data;
          sortColumn = -1;
          sortDirection = 'asc';
          filterRows();
          resultCard.style.display = '';
        }

        window.switchSheet = function (name) {
          currentSheet = name;
          setData(sheetToData(name));
        };

        window.filterRows = function () {
          const term = filterInput.value.toLowerCase().trim();
          if (!term) {
            filteredRows = currentData.rows.slice();
          } else {
            filteredRows = currentData.rows.filter(row => row.some(cell => String(cell).toLowerCase().includes(term)));
          }
          applySort();
          currentPage = 1;
          renderTable();
          renderPagination();
        };

        function applySort() {
          if (sortColumn < 0) return;
          filteredRows.sort((a, b) => {
            const av = a[sortColumn];
            const bv = b[sortColumn];
            const astr = String(av).toLowerCase();
            const bstr = String(bv).toLowerCase();
            const anum = parseFloat(av);
            const bnum = parseFloat(bv);
            let cmp;
            if (!isNaN(anum) && !isNaN(bnum) && av !== '' && bv !== '') {
              cmp = anum - bnum;
            } else {
              cmp = astr.localeCompare(bstr);
            }
            return sortDirection === 'asc' ? cmp : -cmp;
          });
        }

        window.sortByColumn = function (index) {
          if (sortColumn === index) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
          } else {
            sortColumn = index;
            sortDirection = 'asc';
          }
          applySort();
          currentPage = 1;
          renderTable();
        };

        function renderTable() {
          const start = (currentPage - 1) * ROWS_PER_PAGE;
          const pageRows = filteredRows.slice(start, start + ROWS_PER_PAGE);

          let html = '<thead><tr>';
          currentData.headers.forEach((h, i) => {
            const sortedClass = i === sortColumn ? 'sorted' : '';
            const icon = i === sortColumn ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅';
            html += '<th class="' + sortedClass + '" onclick="sortByColumn(' + i + ')">' + escapeHtml(String(h)) + '<span class="ssv-sort-icon">' + icon + '</span></th>';
          });
          html += '</tr></thead><tbody>';

          pageRows.forEach(row => {
            html += '<tr>';
            row.forEach(cell => {
              html += '<td>' + escapeHtml(String(cell)) + '</td>';
            });
            html += '</tr>';
          });

          html += '</tbody>';
          table.innerHTML = html;
          rowCount.innerText = filteredRows.length + ' row' + (filteredRows.length === 1 ? '' : 's');
        }

        function renderPagination() {
          const totalPages = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE));
          if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
          }

          let html = '';
          html += '<button class="ssv-page-btn" onclick="goToPage(' + (currentPage - 1) + ')" ' + (currentPage === 1 ? 'disabled' : '') + '>Prev</button>';

          const maxVisible = 5;
          let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
          let endPage = Math.min(totalPages, startPage + maxVisible - 1);
          if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);

          if (startPage > 1) html += '<button class="ssv-page-btn" onclick="goToPage(1)">1</button>';
          if (startPage > 2) html += '<span class="ssv-page-btn" style="cursor:default;background:transparent;border:none;">...</span>';

          for (let i = startPage; i <= endPage; i++) {
            html += '<button class="ssv-page-btn ' + (i === currentPage ? 'active' : '') + '" onclick="goToPage(' + i + ')">' + i + '</button>';
          }

          if (endPage < totalPages - 1) html += '<span class="ssv-page-btn" style="cursor:default;background:transparent;border:none;">...</span>';
          if (endPage < totalPages) html += '<button class="ssv-page-btn" onclick="goToPage(' + totalPages + ')">' + totalPages + '</button>';

          html += '<button class="ssv-page-btn" onclick="goToPage(' + (currentPage + 1) + ')" ' + (currentPage === totalPages ? 'disabled' : '') + '>Next</button>';
          pagination.innerHTML = html;
        }

        window.goToPage = function (page) {
          const totalPages = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE));
          if (page < 1 || page > totalPages) return;
          currentPage = page;
          renderTable();
          renderPagination();
          table.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };

        function escapeHtml(str) {
          return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function csvEscape(value) {
          const str = String(value);
          if (str.includes(',') || str.includes('"') || str.includes('\\n') || str.includes('\\r')) {
            return '"' + str.replace(/"/g, '""') + '"';
          }
          return str;
        }

        window.downloadCsv = function () {
          if (!currentData.headers.length) return;
          const lines = [currentData.headers.map(csvEscape).join(',')];
          filteredRows.forEach(row => lines.push(row.map(csvEscape).join(',')));
          const blob = new Blob([lines.join('\\n')], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'spreadsheet-export.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          window.toolbox.toast('Spreadsheet exported as CSV', 'success');
        };

        async function loadFromSource(text, filename) {
          hideError();
          const format = detectFormat(text, filename);

          try {
            if (['xlsx', 'ods'].includes(format)) {
              // For text-based drag of xlsx/ods is impossible; assume it's a URL or base64? Not supported here.
              // If text looks like a URL, fetch it.
              if (text.startsWith('http')) {
                const res = await fetch('/api/cors?url=' + encodeURIComponent(text));
                if (!res.ok) throw new Error('Could not fetch URL: ' + res.status);
                const ab = await res.arrayBuffer();
                setData(parseWithSheetJS(ab, format));
                return;
              }
              throw new Error('Excel and ODS files must be uploaded as files, not pasted text.');
            }

            if (format === 'json') {
              setData(parseJson(text));
            } else if (format === 'md') {
              setData(parseMarkdown(text));
            } else if (format === 'tsv') {
              setData(parseCsvTsv(text, '\\t'));
            } else {
              setData(parseCsvTsv(text, ','));
            }
          } catch (e) {
            showError('Failed to parse data: ' + (e.message || e));
          }
        }

        async function loadFromFile(file) {
          hideError();
          const format = detectFormat('', file.name);

          try {
            if (['xlsx', 'ods', 'xls'].includes(format)) {
              const ab = await file.arrayBuffer();
              setData(parseWithSheetJS(ab, format));
            } else {
              const text = await file.text();
              await loadFromSource(text, file.name);
            }
          } catch (e) {
            showError('Failed to read file: ' + (e.message || e));
          }
        }

        window.loadSpreadsheet = function () {
          const text = sourceText.value.trim();
          if (!text) {
            showError('Please paste data, enter a URL, or upload a file.');
            return;
          }
          loadFromSource(text, '');
        };

        dropZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) loadFromFile(file);
        });

        ['dragenter', 'dragover'].forEach(evt => {
          dropZone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
          });
        });

        ['dragleave', 'drop'].forEach(evt => {
          dropZone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
          });
        });

        dropZone.addEventListener('drop', (e) => {
          const file = e.dataTransfer.files[0];
          if (file) loadFromFile(file);
        });

        sourceText.addEventListener('keydown', (e) => {
          if (e.ctrlKey && e.key === 'Enter') loadSpreadsheet();
        });
      })();
    </script>
  `
});
