import { layout } from './layout.js';
import { footer } from './footer.js';

export const hashGeneratorView = (): string => layout({
  title: 'Hash Generator · Skiddle Toolbox',
  description: 'Generate SHA-1, SHA-256, SHA-384, SHA-512, MD5, and more — entirely in your browser. No data leaves your device.',
  canonicalPath: '/hash-generator',
  body: `
    <div class="tb-page-header">
      <div class="tb-tool-icon">&#128274;</div>
      <div class="tb-page-header__text">
        <h1>Hash Generator</h1>
        <p>Generate cryptographic hashes of text or files — entirely in your browser. No data leaves your device.</p>
      </div>
    </div>

    <div class="tb-card">
      <div class="hg-mode-tabs" role="tablist">
        <button type="button" role="tab" class="hg-tab active" id="tab-text" aria-selected="true" onclick="hgSetMode('text')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
          Text
        </button>
        <button type="button" role="tab" class="hg-tab" id="tab-file" aria-selected="false" onclick="hgSetMode('file')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          File
        </button>
      </div>

      <div id="hg-text-panel">
        <label class="tb-label" for="hg-input">Input</label>
        <textarea id="hg-input" class="tb-input" rows="5" placeholder="Enter text to hash..." spellcheck="false" style="resize:vertical; font-family:inherit;"></textarea>
      </div>

      <div id="hg-file-panel" style="display:none;">
        <div class="hg-drop-zone" id="hg-drop-zone" onclick="document.getElementById('hg-file-input').click()" tabindex="0" role="button" aria-label="Click to select a file or drag and drop">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span id="hg-file-label">Click to select a file or drag and drop</span>
          <input type="file" id="hg-file-input" style="display:none;" onchange="hgFileSelected(this.files)" />
        </div>
      </div>

      <div class="hg-algorithms" style="margin-top:12px;">
        <span class="tb-label" style="display:block;margin-bottom:6px;">Algorithms</span>
        <div class="hg-algo-grid" id="hg-algo-grid"></div>
      </div>

      <div id="hg-progress-bar" class="hg-progress" style="display:none; margin-top:12px;">
        <div class="hg-progress-fill" id="hg-progress-fill"></div>
      </div>
    </div>

    <div id="hg-results" class="tb-card" style="display:none;">
      <h2 class="section-title" style="margin-bottom:12px;">Results</h2>
      <div id="hg-results-list"></div>
    </div>

    ${footer()}

    <style>
      .hg-mode-tabs { display: flex; gap: 6px; margin-bottom: 12px; }
      .hg-tab {
        display: flex; align-items: center; gap: 5px; padding: 6px 14px;
        background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-sm);
        color: var(--text-secondary); font-size: 0.82rem; cursor: pointer; transition: all 0.15s;
      }
      .hg-tab:hover { color: var(--text); border-color: var(--accent-color, var(--accent)); }
      .hg-tab.active { background: var(--accent-alpha, rgba(99,102,241,0.12)); border-color: var(--accent-color, var(--accent)); color: var(--accent-color, var(--accent)); font-weight: 600; }
      .hg-drop-zone {
        border: 2px dashed var(--border); border-radius: var(--radius); padding: 28px 16px;
        text-align: center; cursor: pointer; color: var(--text-secondary); transition: all 0.15s;
        display: flex; flex-direction: column; align-items: center; gap: 8px;
      }
      .hg-drop-zone:hover, .hg-drop-zone.drag-over { border-color: var(--accent-color, var(--accent)); color: var(--text); background: var(--accent-alpha, rgba(99,102,241,0.06)); }
      .hg-drop-zone.drag-over { border-style: solid; }
      .hg-drop-zone span { font-size: 0.85rem; }
      .hg-algo-grid { display: flex; flex-wrap: wrap; gap: 6px; }
      .hg-algo-chip {
        padding: 4px 10px; border-radius: 999px; border: 1px solid var(--border); font-size: 0.78rem;
        cursor: pointer; transition: all 0.15s; user-select: none; color: var(--text-secondary);
        background: var(--bg-secondary);
      }
      .hg-algo-chip:hover { border-color: var(--accent-color, var(--accent)); color: var(--text); }
      .hg-algo-chip.selected { background: var(--accent-alpha, rgba(99,102,241,0.15)); border-color: var(--accent-color, var(--accent)); color: var(--accent-color, var(--accent)); font-weight: 600; }
      .hg-progress { height: 4px; background: var(--bg-secondary); border-radius: 2px; overflow: hidden; }
      .hg-progress-fill { height: 100%; background: var(--accent-color, var(--accent)); width: 0%; transition: width 0.2s; }
      .hg-result-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); }
      .hg-result-row:last-child { border-bottom: none; }
      .hg-result-algo { font-size: 0.78rem; font-weight: 700; color: var(--accent-color, var(--accent)); min-width: 80px; text-transform: uppercase; }
      .hg-result-hash { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; flex: 1; word-break: break-all; color: var(--text-secondary); }
      .hg-result-time { font-size: 0.72rem; color: var(--text-secondary); margin-left: auto; white-space: nowrap; }
      .hg-file-info { font-size: 0.78rem; color: var(--text-secondary); margin-top: 8px; display: flex; gap: 16px; flex-wrap: wrap; }
    </style>

    <script>
    (function() {
      var ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512', 'MD5'];
      var selectedAlgos = new Set(['SHA-256', 'MD5']);
      var currentMode = 'text';
      var pendingFile = null;

      var algoGrid = document.getElementById('hg-algo-grid');
      ALGORITHMS.forEach(function(algo) {
        var chip = document.createElement('span');
        chip.className = 'hg-algo-chip' + (selectedAlgos.has(algo) ? ' selected' : '');
        chip.textContent = algo;
        chip.onclick = function() {
          if (selectedAlgos.has(algo)) {
            if (selectedAlgos.size > 1) { selectedAlgos.delete(algo); chip.classList.remove('selected'); }
          } else {
            selectedAlgos.add(algo); chip.classList.add('selected');
          }
          if (currentMode === 'text') hgHashText();
          else if (pendingFile) hgHashFile(pendingFile);
        };
        algoGrid.appendChild(chip);
      });

      window.hgSetMode = function(mode) {
        currentMode = mode;
        document.getElementById('tab-text').classList.toggle('active', mode === 'text');
        document.getElementById('tab-file').classList.toggle('active', mode === 'file');
        document.getElementById('tab-text').setAttribute('aria-selected', String(mode === 'text'));
        document.getElementById('tab-file').setAttribute('aria-selected', String(mode === 'file'));
        document.getElementById('hg-text-panel').style.display = mode === 'text' ? '' : 'none';
        document.getElementById('hg-file-panel').style.display = mode === 'file' ? '' : 'none';
        if (mode === 'text') hgHashText();
      };

      // Drag and drop
      var dropZone = document.getElementById('hg-drop-zone');
      dropZone.addEventListener('dragover', function(e) { e.preventDefault(); dropZone.classList.add('drag-over'); });
      dropZone.addEventListener('dragleave', function() { dropZone.classList.remove('drag-over'); });
      dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) hgFileSelected(e.dataTransfer.files);
      });
      dropZone.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          document.getElementById('hg-file-input').click();
        }
      });

      window.hgFileSelected = function(files) {
        if (!files || !files.length) return;
        var file = files[0];
        pendingFile = file;
        document.getElementById('hg-file-label').textContent = file.name + ' (' + hgFormatSize(file.size) + ')';
        hgHashFile(file);
      };

      window.hgFormatSize = function(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
      };

      function showResults(rows, fileInfo) {
        var container = document.getElementById('hg-results');
        var list = document.getElementById('hg-results-list');
        container.style.display = '';
        list.innerHTML = '';
        if (fileInfo) {
          var fi = document.createElement('div');
          fi.className = 'hg-file-info';
          fi.innerHTML = fileInfo;
          list.appendChild(fi);
        }
        rows.forEach(function(row) {
          var div = document.createElement('div');
          div.className = 'hg-result-row';
          div.innerHTML = row;
          list.appendChild(div);
        });
      }

      function hashText(text, algo) {
        var buf = new TextEncoder().encode(text);
        return crypto.subtle.digest(algo, buf).then(function(hash) {
          return hgHexStr(new Uint8Array(hash));
        });
      }

      function hashFile(file, algo, onProgress) {
        return new Promise(function(resolve, reject) {
          var reader = new FileReader();
          reader.onload = function(e) {
            var buf = e.target.result;
            crypto.subtle.digest(algo, buf).then(function(hash) {
              resolve(hgHexStr(new Uint8Array(hash)));
            }).catch(reject);
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
      }

      function hgHexStr(b) {
        for (var i = 0, h = ''; i < b.length; i++) h += b[i].toString(16).padStart(2, '0');
        return h;
      }

      function hgCopy(val) {
        navigator.clipboard.writeText(val).then(function() {
          if (window.toolbox && window.toolbox.toast) window.toolbox.toast('Copied to clipboard');
        });
      }

      window.hgHashText = function() {
        var text = document.getElementById('hg-input').value;
        if (!text || selectedAlgos.size === 0) {
          document.getElementById('hg-results').style.display = 'none';
          return;
        }
        var algos = Array.from(selectedAlgos);
        Promise.all(algos.map(function(algo) {
          var t0 = performance.now();
          return hashText(text, algo).then(function(hash) {
            return { algo: algo, hash: hash, time: performance.now() - t0 };
          });
        })).then(function(results) {
          var rows = results.map(function(r) {
            return '<span class="hg-result-algo">' + r.algo + '</span>' +
              '<code class="hg-result-hash">' + r.hash + '</code>' +
              '<button type="button" class="tb-btn tb-btn-secondary" style="padding:2px 8px;font-size:0.72rem;" onclick="hgCopy(\'' + r.hash + '\')">Copy</button>' +
              '<span class="hg-result-time">' + r.time.toFixed(1) + ' ms</span>';
          });
          showResults(rows, null);
        });
      };

      window.hgHashFile = function(file) {
        var algos = Array.from(selectedAlgos);
        var progressBar = document.getElementById('hg-progress-bar');
        var progressFill = document.getElementById('hg-progress-fill');
        progressBar.style.display = '';
        progressFill.style.width = '0%';

        var fileInfo = '<span>' + file.name + '</span><span>' + hgFormatSize(file.size) + '</span><span>' + file.type + '</span>';
        showResults([], fileInfo);

        var count = 0;
        Promise.all(algos.map(function(algo) {
          var t0 = performance.now();
          return hashFile(file, algo).then(function(hash) {
            count++;
            progressFill.style.width = (count / algos.length * 100) + '%';
            var row = document.createElement('div');
            row.className = 'hg-result-row';
            row.innerHTML = '<span class="hg-result-algo">' + algo + '</span>' +
              '<code class="hg-result-hash">' + hash + '</code>' +
              '<button type="button" class="tb-btn tb-btn-secondary" style="padding:2px 8px;font-size:0.72rem;" onclick="hgCopy(\'' + hash + '\')">Copy</button>' +
              '<span class="hg-result-time">' + (performance.now() - t0).toFixed(1) + ' ms</span>';
            document.getElementById('hg-results-list').appendChild(row);
          });
        })).then(function() {
          progressFill.style.width = '100%';
          setTimeout(function() { progressBar.style.display = 'none'; }, 500);
        });
      };

      document.getElementById('hg-input').addEventListener('input', hgHashText);
      hgHashText();
    })();
    </script>
  `,
});
