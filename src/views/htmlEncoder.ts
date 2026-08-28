import { layout } from './layout.js';
import { footer } from './footer.js';

export const htmlEncoderView = (): string => layout({
  title: 'HTML Entity Encoder \xb7 Skiddle Toolbox',
  description: 'Encode and decode HTML entities, spot them in raw HTML, and safely escape text for insertion — entirely in your browser.',
  canonicalPath: '/html-encoder',
  body: `
    <div class="tb-page-header">
      <div class="tb-tool-icon">&#128260;</div>
      <div class="tb-page-header__text">
        <h1>HTML Entity Encoder</h1>
        <p>Encode and decode HTML entities — spot them in raw HTML, escape text for safe insertion. Entirely in your browser.</p>
      </div>
    </div>

    <div class="tb-card">
      <div class="he-mode-tabs" role="tablist">
        <button type="button" role="tab" class="he-tab active" id="he-tab-encode" aria-selected="true" onclick="heSetMode('encode')">Encode</button>
        <button type="button" role="tab" class="he-tab" id="he-tab-decode" aria-selected="false" onclick="heSetMode('decode')">Decode</button>
        <button type="button" role="tab" class="he-tab" id="he-tab-escape" aria-selected="false" onclick="heSetMode('escape')">Escape for JS</button>
      </div>

      <div id="he-encode-panel">
        <label class="tb-label" for="he-input-encode">Input Text</label>
        <textarea id="he-input-encode" class="tb-input" rows="5" placeholder="Enter text to encode as HTML entities..." spellcheck="false" style="resize:vertical; font-family:inherit;"></textarea>

        <div class="he-options" style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <label class="tb-label" style="margin:0;">Mode</label>
          <select id="he-encode-mode" class="tb-select" onchange="heEncode()" style="width:auto;">
            <option value="named">Named entities (&amp;amp;)</option>
            <option value="numeric">Numeric (&#nnn;)</option>
            <option value="hex">Hexadecimal (&#xhhh;)</option>
          </select>
          <label style="display:flex;align-items:center;gap:4px;font-size:0.82rem;cursor:pointer;">
            <input type="checkbox" id="he-encode-unsafe" onchange="heEncode()" />
            Encode all (including safe chars)
          </label>
        </div>

        <label class="tb-label" style="margin-top:12px;">Encoded Output</label>
        <div class="he-output-box">
          <pre id="he-encode-output" class="he-output-pre"></pre>
          <button type="button" class="tb-btn tb-btn-secondary" style="position:absolute;top:8px;right:8px;" onclick="heCopyOutput()">Copy</button>
        </div>
      </div>

      <div id="he-decode-panel" style="display:none;">
        <label class="tb-label" for="he-input-decode">HTML Entities or Encoded Text</label>
        <textarea id="he-input-decode" class="tb-input" rows="5" placeholder="Enter HTML entities to decode..." spellcheck="false" style="resize:vertical; font-family:inherit;"></textarea>

        <label class="tb-label" style="margin-top:12px;">Decoded Output</label>
        <div class="he-output-box">
          <pre id="he-decode-output" class="he-output-pre"></pre>
          <button type="button" class="tb-btn tb-btn-secondary" style="position:absolute;top:8px;right:8px;" onclick="heCopyOutput()">Copy</button>
        </div>
      </div>

      <div id="he-escape-panel" style="display:none;">
        <label class="tb-label" for="he-input-escape">JavaScript String</label>
        <textarea id="he-input-escape" class="tb-input" rows="5" placeholder="Enter a JavaScript string to escape..." spellcheck="false" style="resize:vertical; font-family:inherit;"></textarea>

        <div class="he-options" style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <label style="display:flex;align-items:center;gap:4px;font-size:0.82rem;cursor:pointer;">
            <input type="checkbox" id="he-js-single" onchange="heEscape()" />
            Single quotes only
          </label>
          <label style="display:flex;align-items:center;gap:4px;font-size:0.82rem;cursor:pointer;">
            <input type="checkbox" id="he-js-template" onchange="heEscape()" />
            Template literal
          </label>
        </div>

        <label class="tb-label" style="margin-top:12px;">Escaped Output</label>
        <div class="he-output-box">
          <pre id="he-escape-output" class="he-output-pre"></pre>
          <button type="button" class="tb-btn tb-btn-secondary" style="position:absolute;top:8px;right:8px;" onclick="heCopyOutput()">Copy</button>
        </div>
      </div>
    </div>

    <div class="tb-card">
      <h2 class="section-title" style="margin-bottom:12px;">Quick Reference</h2>
      <div class="he-ref-grid">
        <div class="he-ref-item"><span class="he-ref-code">&amp;amp;</span><span>Ampersand</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;lt;</span><span>Less than</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;gt;</span><span>Greater than</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;quot;</span><span>Double quote</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;apos;</span><span>Apostrophe</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;#39;</span><span>Apostrophe (numeric)</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;nbsp;</span><span>Non-breaking space</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;copy;</span><span>Copyright sign</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;reg;</span><span>Registered sign</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;trade;</span><span>Trademark sign</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;mdash;</span><span>Em dash</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;ldquo;</span><span>Left double quote</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;rdquo;</span><span>Right double quote</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;hellip;</span><span>Ellipsis</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;euro;</span><span>Euro sign</span></div>
        <div class="he-ref-item"><span class="he-ref-code">&amp;ndash;</span><span>En dash</span></div>
      </div>
    </div>

    ${footer()}

    <style>
      .he-mode-tabs { display: flex; gap: 6px; margin-bottom: 14px; }
      .he-tab {
        padding: 6px 16px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-sm);
        color: var(--text-secondary); font-size: 0.82rem; cursor: pointer; transition: all 0.15s;
      }
      .he-tab:hover { color: var(--text); border-color: var(--accent-color, var(--accent)); }
      .he-tab.active { background: var(--accent-alpha, rgba(99,102,241,0.12)); border-color: var(--accent-color, var(--accent)); color: var(--accent-color, var(--accent)); font-weight: 600; }
      .he-output-box { position: relative; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; min-height: 60px; }
      .he-output-pre { font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; white-space: pre-wrap; word-break: break-all; margin: 0; color: var(--text); }
      .he-ref-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; }
      .he-ref-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; background: var(--bg-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border); font-size: 0.78rem; }
      .he-ref-code { font-family: 'JetBrains Mono', monospace; color: var(--accent-color, var(--accent)); min-width: 80px; }
    </style>

    <script>
    (function() {
      var NAMED_ENTITIES = {
        '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'",
        '&nbsp;': ' ', '&iexcl;': '¡', '&cent;': '¢', '&pound;': '£',
        '&curren;': '¤', '&yen;': '¥', '&brvbar;': '¦', '&sect;': '§',
        '&uml;': '¨', '&copy;': '©', '&ordf;': 'ª', '&laquo;': '«',
        '&not;': '¬', '&shy;': '­', '&reg;': '®', '&macr;': '¯',
        '&deg;': '°', '&plusmn;': '±', '&sup2;': '²', '&sup3;': '³',
        '&acute;': '´', '&micro;': 'µ', '&para;': '¶', '&middot;': '·',
        '&cedil;': '¸', '&sup1;': '¹', '&ordm;': 'º', '&raquo;': '»',
        '&frac14;': '¼', '&frac12;': '½', '&frac34;': '¾', '&iquest;': '¿',
        '&ndash;': '–', '&mdash;': '—', '&lsquo;': '‘', '&rsquo;': '’',
        '&sbquo;': '‚', '&ldquo;': '“', '&rdquo;': '”', '&bdquo;': '„',
        '&dagger;': '†', '&Dagger;': '‡', '&bull;': '•', '&hellip;': '…',
        '&permil;': '‰', '&prime;': '′', '&Prime;': '″', '&lsaquo;': '‹',
        '&rsaquo;': '›', '&oline;': '‾', '&frasl;': '⁄', '&euro;': '€',
        '&trade;': '™', '&larr;': '←', '&uarr;': '↑', '&rarr;': '→',
        '&darr;': '↓', '&harr;': '↔', '&crarr;': '↵',
        '&forall;': '∀', '&part;': '∂', '&exist;': '∃', '&empty;': '∅',
        '&nabla;': '∇', '&isin;': '∈', '&notin;': '∉', '&ni;': '∋',
        '&prod;': '∏', '&sum;': '∑', '&minus;': '−', '&lowast;': '∗',
        '&radic;': '√', '&prop;': '∝', '&infin;': '∞', '&ang;': '∠',
        '&and;': '∧', '&or;': '∨', '&cap;': '∩', '&cup;': '∪',
        '&int;': '∫', '&there4;': '∴', '&sim;': '∼', '&cong;': '≅',
        '&asymp;': '≈', '&ne;': '≠', '&equiv;': '≡', '&le;': '≤',
        '&ge;': '≥', '&sub;': '⊂', '&sup;': '⊃', '&nsub;': '⊄',
        '&sube;': '⊆', '&supe;': '⊇', '&oplus;': '⊕', '&otimes;': '⊗',
        '&perp;': '⊥', '&sdot;': '⋅', '&lceil;': '⌈', '&rceil;': '⌉',
        '&lfloor;': '⌊', '&rfloor;': '⌋',
      };

      function escapeHtml(str, mode, encodeAll) {
        return str.replace(encodeAll ? /[\s\S]/g : /[&<>"']/g, function(m) {
          if (mode === 'named') {
            switch (m) {
              case '&': return '&amp;';
              case '<': return '&lt;';
              case '>': return '&gt;';
              case '"': return '&quot;';
              case "'": return '&apos;';
            }
          } else if (mode === 'numeric') {
            return '&#' + m.charCodeAt(0) + ';';
          } else {
            return '&#x' + m.charCodeAt(0).toString(16) + ';';
          }
          return m;
        });
      }

      function decodeEntities(str) {
        var result = str;
        var names = Object.keys(NAMED_ENTITIES).sort(function(a, b) { return b.length - a.length; });
        for (var i = 0; i < names.length; i++) {
          var entity = names[i];
          var char = NAMED_ENTITIES[entity];
          var parts = result.split(entity);
          result = parts.join(char);
        }
        result = result.replace(/&#(\d+);/g, function(_, n) { return String.fromCharCode(parseInt(n, 10)); });
        result = result.replace(/&#x([0-9a-fA-F]+);/g, function(_, h) { return String.fromCharCode(parseInt(h, 16)); });
        return result;
      }

      window.heSetMode = function(mode) {
        ['encode','decode','escape'].forEach(function(m) {
          var tab = document.getElementById('he-tab-' + m);
          var panel = document.getElementById('he-' + m + '-panel');
          if (tab) { tab.classList.toggle('active', m === mode); tab.setAttribute('aria-selected', String(m === mode)); }
          if (panel) panel.style.display = m === mode ? '' : 'none';
        });
      };

      window.heEncode = function() {
        var text = document.getElementById('he-input-encode').value;
        var mode = document.getElementById('he-encode-mode').value;
        var encodeAll = document.getElementById('he-encode-unsafe').checked;
        document.getElementById('he-encode-output').textContent = escapeHtml(text, mode, encodeAll);
      };

      window.heEscape = function() {
        var text = document.getElementById('he-input-escape').value;
        var single = document.getElementById('he-js-single').checked;
        var tmpl = document.getElementById('he-js-template').checked;
        var escaped = text.replace(/\\/g, '\\\\').replace(/\x60/g, '\\x60').replace(/\$/g, '\\$');
        if (single) escaped = escaped.replace(/'/g, "\\'");
        else escaped = escaped.replace(/"/g, '\\"');
        if (tmpl) escaped = escaped.replace(/\}/g, '\\}');
        document.getElementById('he-escape-output').textContent = escaped;
      };

      document.getElementById('he-input-decode').addEventListener('input', function() {
        document.getElementById('he-decode-output').textContent = decodeEntities(this.value);
      });

      window.heCopyOutput = function() {
        var panels = ['encode', 'decode', 'escape'];
        for (var i = 0; i < panels.length; i++) {
          var panel = document.getElementById('he-' + panels[i] + '-panel');
          if (panel && panel.style.display !== 'none') {
            var pre = panel.querySelector('.he-output-pre');
            if (pre) {
              navigator.clipboard.writeText(pre.textContent).then(function() {
                if (window.toolbox && window.toolbox.toast) window.toolbox.toast('Copied to clipboard');
              });
              return;
            }
          }
        }
      };

      document.getElementById('he-input-encode').addEventListener('input', heEncode);
      document.getElementById('he-input-escape').addEventListener('input', heEscape);
    })();
    </script>
  `,
});
