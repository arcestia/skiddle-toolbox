import { layout } from './layout.js';
import { footer } from './footer.js';

export const jsonFormatterView = (): string => layout({
  title: 'JSON Formatter · Skiddle Toolbox',
  description: 'Format, validate, minify, and inspect JSON data with syntax highlighting.',
  canonicalPath: '/json-formatter',
  body: `
    <div class="tb-page-header">
      <div class="tb-tool-icon">📋</div>
      <div class="tb-page-header__text">
        <h1>JSON Formatter</h1>
        <p>Format, validate, and minify JSON with syntax highlighting.</p>
      </div>
    </div>

    <div class="tb-card">
      <div class="jf-toolbar">
        <div class="jf-toolbar-group">
          <button type="button" class="tb-btn tb-btn-primary" onclick="jfFormat()">Format</button>
          <button type="button" class="tb-btn tb-btn-secondary" onclick="jfMinify()">Minify</button>
        </div>
        <div class="jf-toolbar-group">
          <label class="tb-label" style="font-size:0.8rem;margin:0;">Indent:</label>
          <select id="jf-indent" class="tb-select" style="width:auto;min-width:80px;">
            <option value="2" selected>2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tab</option>
          </select>
        </div>
        <div class="jf-toolbar-group">
          <button type="button" class="tb-btn tb-btn-secondary" onclick="jfCopy()">Copy</button>
          <button type="button" class="tb-btn tb-btn-secondary" onclick="jfClear()">Clear</button>
        </div>
      </div>

      <div class="jf-editor-wrap">
        <textarea id="jf-input" class="tb-textarea jf-textarea" placeholder='Paste JSON here, e.g. {"name": "world"}' spellcheck="false" oninput="jfValidate()"></textarea>
      </div>

      <div id="jf-status" class="jf-status"></div>
      <div id="jf-stats" class="jf-stats"></div>
    </div>

    <div class="tb-card">
      <h2 class="section-title" style="margin-bottom:12px;">Tree View</h2>
      <div id="jf-tree" class="jf-tree">
        <div class="empty-state">
          <p>Paste JSON above to see the tree view</p>
        </div>
      </div>
    </div>

    ${footer()}

    <style>
      .jf-toolbar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 12px; }
      .jf-toolbar-group { display: flex; gap: 6px; align-items: center; }
      .jf-textarea {
        min-height: 300px; resize: vertical; font-family: 'JetBrains Mono', monospace;
        font-size: 0.82rem; line-height: 1.5; tab-size: 2;
      }
      .jf-status { font-size: 0.82rem; margin-top: 8px; min-height: 1.4em; }
      .jf-status--valid { color: var(--success, #22c55e); }
      .jf-status--error { color: var(--error, #ef4444); }
      .jf-stats { font-size: 0.78rem; color: var(--text-secondary); margin-top: 4px; }
      .jf-stats:empty { display: none; }
      .jf-tree { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; line-height: 1.6; max-height: 400px; overflow: auto; }
      .jf-tree ul { list-style: none; padding-left: 20px; margin: 0; }
      .jf-tree > ul { padding-left: 0; }
      .jf-tree-key { color: var(--accent); font-weight: 500; }
      .jf-tree-str { color: hsl(120 40% 55%); }
      .jf-tree-num { color: hsl(30 80% 55%); }
      .jf-tree-bool { color: hsl(280 60% 60%); }
      .jf-tree-null { color: var(--text-secondary); font-style: italic; }
      .jf-tree-toggle {
        cursor: pointer; user-select: none; display: inline-block; width: 16px;
        text-align: center; color: var(--text-secondary);
      }
      .jf-tree-toggle:hover { color: var(--text-primary); }
    </style>

    <script>
    (function() {
      window.jfFormat = function() {
        const el = document.getElementById('jf-input');
        try {
          const indent = document.getElementById('jf-indent').value;
          const space = indent === 'tab' ? '\\t' : Number(indent);
          const obj = JSON.parse(el.value);
          el.value = JSON.stringify(obj, null, space);
          jfValidate();
        } catch (e) {
          showStatus('Error: ' + e.message, false);
        }
      };

      window.jfMinify = function() {
        const el = document.getElementById('jf-input');
        try {
          const obj = JSON.parse(el.value);
          el.value = JSON.stringify(obj);
          jfValidate();
        } catch (e) {
          showStatus('Error: ' + e.message, false);
        }
      };

      window.jfValidate = function() {
        const el = document.getElementById('jf-input');
        const raw = el.value.trim();
        if (!raw) {
          showStatus('', true);
          document.getElementById('jf-stats').textContent = '';
          document.getElementById('jf-tree').innerHTML = '<div class="empty-state"><p>Paste JSON above to see the tree view</p></div>';
          return;
        }
        try {
          const obj = JSON.parse(raw);
          showStatus('✓ Valid JSON', true);
          const stats = jsonStats(obj);
          document.getElementById('jf-stats').textContent = stats;
          renderTree(obj);
        } catch (e) {
          showStatus('✗ ' + e.message, false);
          document.getElementById('jf-stats').textContent = '';
          document.getElementById('jf-tree').innerHTML = '';
        }
      };

      function showStatus(msg, valid) {
        const el = document.getElementById('jf-status');
        el.textContent = msg;
        el.className = 'jf-status' + (msg ? (valid ? ' jf-status--valid' : ' jf-status--error') : '');
      }

      function jsonStats(obj) {
        let keys = 0, arrays = 0, objects = 0, values = 0;
        (function walk(v) {
          if (Array.isArray(v)) { arrays++; v.forEach(walk); }
          else if (v && typeof v === 'object') { objects++; const k = Object.keys(v); keys += k.length; k.forEach(k => walk(v[k])); }
          else values++;
        })(obj);
        return keys + ' keys · ' + objects + ' objects · ' + arrays + ' arrays · ' + values + ' values';
      }

      function renderTree(obj) {
        const container = document.getElementById('jf-tree');
        container.innerHTML = '';
        const ul = document.createElement('ul');
        buildNode(ul, null, obj);
        container.appendChild(ul);
      }

      function buildNode(parent, key, val) {
        const li = document.createElement('li');
        const keySpan = key !== null ? '<span class="jf-tree-key">' + escHtml(String(key)) + '</span>: ' : '';

        if (val === null) {
          li.innerHTML = keySpan + '<span class="jf-tree-null">null</span>';
        } else if (typeof val === 'boolean') {
          li.innerHTML = keySpan + '<span class="jf-tree-bool">' + val + '</span>';
        } else if (typeof val === 'number') {
          li.innerHTML = keySpan + '<span class="jf-tree-num">' + val + '</span>';
        } else if (typeof val === 'string') {
          const display = val.length > 120 ? escHtml(val.slice(0, 120)) + '…' : escHtml(val);
          li.innerHTML = keySpan + '<span class="jf-tree-str">"' + display + '"</span>';
        } else if (Array.isArray(val)) {
          const toggle = document.createElement('span');
          toggle.className = 'jf-tree-toggle';
          toggle.textContent = '▾';
          li.appendChild(toggle);
          li.insertAdjacentHTML('beforeend', keySpan + 'Array[' + val.length + ']');
          const sub = document.createElement('ul');
          val.forEach(function(v, i) { buildNode(sub, i, v); });
          li.appendChild(sub);
          toggle.onclick = function() { sub.hidden = !sub.hidden; toggle.textContent = sub.hidden ? '▸' : '▾'; };
        } else {
          const keys = Object.keys(val);
          const toggle = document.createElement('span');
          toggle.className = 'jf-tree-toggle';
          toggle.textContent = '▾';
          li.appendChild(toggle);
          li.insertAdjacentHTML('beforeend', keySpan + 'Object{' + keys.length + '}');
          const sub = document.createElement('ul');
          keys.forEach(function(k) { buildNode(sub, k, val[k]); });
          li.appendChild(sub);
          toggle.onclick = function() { sub.hidden = !sub.hidden; toggle.textContent = sub.hidden ? '▸' : '▾'; };
        }
        parent.appendChild(li);
      }

      function escHtml(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

      window.jfCopy = function() {
        var text = document.getElementById('jf-input').value;
        if (!text) return;
        navigator.clipboard.writeText(text).then(function() {
          if (window.toolbox && window.toolbox.toast) window.toolbox.toast('Copied to clipboard');
        });
      };

      window.jfClear = function() {
        document.getElementById('jf-input').value = '';
        jfValidate();
      };
    })();
    </script>
  `,
});
