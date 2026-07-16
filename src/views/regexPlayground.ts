import { layout } from './layout.js';

export const regexPlaygroundView = (): string => layout({
  title: 'Regex Playground · Developer Toolbox',
  subtitle: 'Interactive Regular Expression Visualizer',
  backHref: '/',
  themeVariant: 'dots',
  body: `
    <div class="tb-page-header accent-mauve">
      <div class="tb-tool-icon">🧩</div>
      <div class="tb-page-header__text">
        <h1>Regex Playground</h1>
        <p>Write, validate, and debug regular expressions in real-time with syntax highlighting and match group breakdowns.</p>
      </div>
    </div>

    <div class="rgx-layout">
      <!-- Main workspace -->
      <div class="rgx-main">
        <div class="tb-card">
          <!-- Regex Pattern & Flags -->
          <div class="tb-form-group">
            <label class="tb-label">Regular Expression</label>
            <div class="rgx-pattern-bar">
              <span class="rgx-delimiter">/</span>
              <input type="text" id="rgx-pattern" class="rgx-pattern-input" placeholder="[a-zA-Z0-9]+" value="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" oninput="runRegexPlayground()">
              <span class="rgx-delimiter">/</span>
              <input type="text" id="rgx-flags" class="rgx-flags-input" placeholder="g" value="g" oninput="syncFlagsFromInput()">
            </div>
            
            <div class="rgx-flag-toggles">
              <button type="button" class="rgx-flag-btn" data-flag="g" onclick="toggleFlag('g')" title="Global (match all)">g</button>
              <button type="button" class="rgx-flag-btn" data-flag="i" onclick="toggleFlag('i')" title="Case-insensitive">i</button>
              <button type="button" class="rgx-flag-btn" data-flag="m" onclick="toggleFlag('m')" title="Multiline">m</button>
              <button type="button" class="rgx-flag-btn" data-flag="s" onclick="toggleFlag('s')" title="Single line (dot matches newline)">s</button>
              <button type="button" class="rgx-flag-btn" data-flag="u" onclick="toggleFlag('u')" title="Unicode support">u</button>
              <button type="button" class="rgx-flag-btn" data-flag="y" onclick="toggleFlag('y')" title="Sticky search">y</button>
            </div>
            <div id="rgx-error" class="rgx-error-msg tb-hidden"></div>
          </div>

          <!-- Test String Input -->
          <div class="tb-form-group">
            <label class="tb-label" for="rgx-test-string">Test String</label>
            <textarea id="rgx-test-string" class="tb-textarea" rows="6" placeholder="Type or paste test string here..." oninput="runRegexPlayground()">Send an email to dev-support@example.com or reach out at john.doe@agency.co.uk.</textarea>
          </div>

          <!-- Highlight Preview -->
          <div class="tb-form-group">
            <label class="tb-label">Match Visualization</label>
            <div id="rgx-visualizer" class="rgx-visualizer-pane"></div>
          </div>

          <!-- Results Summary & Copy Buttons -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
            <div id="rgx-summary" class="tb-summary" style="margin-bottom:0;"></div>
            <button id="rgx-copy-matches-btn" class="tb-btn tb-btn-secondary tb-hidden" onclick="copyAllMatches()" style="padding:8px 14px; font-size:0.82rem; gap:6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copy Matches
            </button>
          </div>
          
          <!-- Matches List -->
          <div id="rgx-results"></div>
        </div>

        <!-- Snippets Card -->
        <div class="tb-card" style="margin-top: 24px;">
          <h3 class="rgx-sidebar-title" style="margin-bottom: 12px; border-bottom: none; padding-bottom: 0;">Code Snippets</h3>
          <div class="rgx-snippet-tabs">
            <button class="rgx-tab-btn active" data-tab="js" onclick="switchSnippetTab('js')">JavaScript</button>
            <button class="rgx-tab-btn" data-tab="python" onclick="switchSnippetTab('python')">Python</button>
            <button class="rgx-tab-btn" data-tab="php" onclick="switchSnippetTab('php')">PHP</button>
          </div>
          <div class="rgx-snippet-container">
            <pre><code id="rgx-snippet-code" class="tb-mono"></code></pre>
            <button class="rgx-copy-snippet-btn" onclick="copySnippet()" title="Copy Code">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="rgx-sidebar">
        <!-- Predefined templates -->
        <div class="tb-card rgx-card-sidebar">
          <h3 class="rgx-sidebar-title">Templates</h3>
          <div class="rgx-template-list">
            <button class="rgx-template-btn" onclick="loadTemplate('email')">
              <strong>Email Address</strong>
              <span>Simple RFC 5322 validator</span>
            </button>
            <button class="rgx-template-btn" onclick="loadTemplate('url')">
              <strong>URL Web Address</strong>
              <span>HTTP/HTTPS standard formats</span>
            </button>
            <button class="rgx-template-btn" onclick="loadTemplate('phone')">
              <strong>US Phone Number</strong>
              <span>Formats like (123) 456-7890</span>
            </button>
            <button class="rgx-template-btn" onclick="loadTemplate('html')">
              <strong>HTML Tag Extractor</strong>
              <span>Match tags and inner content</span>
            </button>
            <button class="rgx-template-btn" onclick="loadTemplate('ipv4')">
              <strong>IPv4 Address</strong>
              <span>IP octet validator (0-255)</span>
            </button>
          </div>
        </div>

        <!-- Cheatsheet -->
        <div class="tb-card rgx-card-sidebar">
          <h3 class="rgx-sidebar-title">Cheatsheet</h3>
          <div class="rgx-cheatsheet">
            <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:10px; line-height:1.4;">Tip: Click any code token to insert it into your pattern.</p>
            <div class="rgx-cheat-section">
              <h4>Character Classes</h4>
              <div class="rgx-cheat-row"><code title="Insert token">.</code> <span>Any character except line break</span></div>
              <div class="rgx-cheat-row"><code title="Insert token">\\d</code> <span>Any digit (0-9)</span></div>
              <div class="rgx-cheat-row"><code title="Insert token">\\w</code> <span>Alphanumeric + underscore</span></div>
              <div class="rgx-cheat-row"><code title="Insert token">\\s</code> <span>Any whitespace character</span></div>
              <div class="rgx-cheat-row"><code title="Insert token">\\b</code> <span>Word boundary</span></div>
            </div>
            <div class="rgx-cheat-section">
              <h4>Quantifiers</h4>
              <div class="rgx-cheat-row"><code title="Insert token">*</code> <span>0 or more times</span></div>
              <div class="rgx-cheat-row"><code title="Insert token">+</code> <span>1 or more times</span></div>
              <div class="rgx-cheat-row"><code title="Insert token">?</code> <span>0 or 1 time (optional)</span></div>
              <div class="rgx-cheat-row"><code title="Insert token">{n}</code> <span>Exactly n times</span></div>
              <div class="rgx-cheat-row"><code title="Insert token">{n,m}</code> <span>Between n and m times</span></div>
            </div>
            <div class="rgx-cheat-section">
              <h4>Anchors & Groups</h4>
              <div class="rgx-cheat-row"><code title="Insert token">^</code> <span>Start of string / line</span></div>
              <div class="rgx-cheat-row"><code title="Insert token">$</code> <span>End of string / line</span></div>
              <div class="rgx-cheat-row"><code title="Insert token">(abc)</code> <span>Capture group</span></div>
              <div class="rgx-cheat-row"><code title="Insert token">(?:abc)</code> <span>Non-capturing group</span></div>
              <div class="rgx-cheat-row"><code title="Insert token">a|b</code> <span>Match a OR b</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="tb-footer">
      All regular expression testing happens locally in your browser · No data is transmitted
    </footer>

    <style>
      .rgx-layout {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 24px;
        align-items: start;
      }

      @media (max-width: 900px) {
        .rgx-layout {
          grid-template-columns: 1fr;
        }
      }

      /* Pattern Bar styling */
      .rgx-pattern-bar {
        display: flex;
        align-items: center;
        background-color: var(--input-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 4px 16px;
        transition: all 0.25s ease;
      }

      .rgx-pattern-bar:focus-within {
        border-color: var(--ctp-mauve);
        box-shadow: var(--glow-focus);
        background-color: var(--input-bg-focus);
      }

      .rgx-delimiter {
        font-family: var(--font-mono);
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--ctp-mauve);
        user-select: none;
        padding: 0 4px;
      }

      .rgx-pattern-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--text-primary);
        font-family: var(--font-mono);
        font-size: 0.95rem;
        padding: 10px 8px;
        min-width: 0;
      }

      .rgx-flags-input {
        width: 80px;
        background: transparent;
        border: none;
        outline: none;
        color: var(--ctp-pink);
        font-family: var(--font-mono);
        font-size: 1.05rem;
        font-weight: 600;
        padding: 10px 4px;
        letter-spacing: 1px;
      }

      /* Flag Buttons */
      .rgx-flag-toggles {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 10px;
      }

      .rgx-flag-btn {
        background: color-mix(in srgb, var(--ctp-surface0) 45%, transparent);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        padding: 5px 12px;
        font-family: var(--font-mono);
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .rgx-flag-btn:hover {
        border-color: var(--border-color-glow);
        color: var(--text-primary);
      }

      .rgx-flag-btn.active {
        background: color-mix(in srgb, var(--ctp-pink) 20%, transparent);
        border-color: var(--ctp-pink);
        color: var(--ctp-pink);
      }

      /* Error styling */
      .rgx-error-msg {
        background-color: color-mix(in srgb, var(--color-bad) 12%, transparent);
        border: 1px solid var(--color-bad);
        color: var(--color-bad);
        padding: 12px 16px;
        border-radius: var(--radius-md);
        margin-top: 12px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        line-height: 1.4;
      }

      /* Visualizer Panel */
      .rgx-visualizer-pane {
        width: 100%;
        background-color: color-mix(in srgb, var(--ctp-mantle) 60%, transparent);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 16px;
        font-family: var(--font-mono);
        font-size: 0.9rem;
        line-height: 1.6;
        min-height: 120px;
        max-height: 320px;
        overflow-y: auto;
        white-space: pre-wrap;
        word-break: break-all;
        color: var(--text-primary);
      }

      /* Highlighted Matches */
      .rgx-match-highlight {
        background-color: color-mix(in srgb, var(--ctp-green) 26%, transparent);
        border-bottom: 2px solid var(--ctp-green);
        border-radius: 2px;
        transition: background-color 0.2s ease;
      }

      .rgx-match-highlight:hover {
        background-color: color-mix(in srgb, var(--ctp-green) 40%, transparent);
      }

      /* Match details display */
      .rgx-match-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 18px;
        max-height: 480px;
        overflow-y: auto;
      }

      .rgx-match-card {
        background-color: color-mix(in srgb, var(--ctp-mantle) 55%, transparent);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 14px 18px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        transition: border-color 0.2s ease, transform 0.2s ease;
      }

      .rgx-match-card:hover {
        border-color: var(--border-color-glow);
        transform: translateX(4px);
      }

      .rgx-match-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid color-mix(in srgb, var(--border-color) 40%, transparent);
        padding-bottom: 6px;
      }

      .rgx-match-title {
        font-weight: 700;
        font-size: 0.82rem;
        color: var(--ctp-green);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .rgx-match-meta {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        color: var(--text-muted);
      }

      .rgx-match-val {
        font-family: var(--font-mono);
        font-size: 0.95rem;
        color: var(--text-primary);
        word-break: break-all;
        background: color-mix(in srgb, var(--ctp-surface0) 30%, transparent);
        padding: 6px 10px;
        border-radius: var(--radius-sm);
        border-left: 3px solid var(--ctp-green);
      }

      /* Groups section */
      .rgx-groups {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 4px;
        padding-left: 10px;
        border-left: 1.5px dashed var(--border-color);
      }

      .rgx-group-row {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.85rem;
      }

      .rgx-group-label {
        font-family: var(--font-sans);
        font-weight: 700;
        font-size: 0.7rem;
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid var(--border-color);
        background: color-mix(in srgb, var(--border-color) 12%, transparent);
        min-width: 68px;
        text-align: center;
        text-transform: uppercase;
      }

      .rgx-group-val {
        font-family: var(--font-mono);
        word-break: break-all;
      }

      /* Sidebar formatting */
      .rgx-card-sidebar {
        padding: 22px;
        margin-bottom: 24px;
      }
      .rgx-card-sidebar:last-child {
        margin-bottom: 0;
      }

      .rgx-sidebar-title {
        font-size: 0.95rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: var(--text-primary);
        margin-bottom: 16px;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 8px;
      }

      /* Templates */
      .rgx-template-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .rgx-template-btn {
        width: 100%;
        background: color-mix(in srgb, var(--ctp-surface0) 35%, transparent);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: var(--radius-md);
        padding: 10px 14px;
        cursor: pointer;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 3px;
        transition: all 0.2s ease;
      }

      .rgx-template-btn:hover {
        border-color: var(--ctp-pink);
        background: color-mix(in srgb, var(--ctp-surface0) 65%, transparent);
        transform: translateY(-1px);
      }

      .rgx-template-btn strong {
        font-size: 0.86rem;
        font-weight: 700;
      }

      .rgx-template-btn span {
        font-size: 0.72rem;
        color: var(--text-secondary);
      }

      /* Cheatsheet */
      .rgx-cheatsheet {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .rgx-cheat-section h4 {
        font-size: 0.8rem;
        color: var(--ctp-lavender);
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }

      .rgx-cheat-row {
        display: grid;
        grid-template-columns: 75px 1fr;
        gap: 10px;
        font-size: 0.78rem;
        margin-bottom: 6px;
        align-items: center;
      }

      .rgx-cheat-row code {
        font-family: var(--font-mono);
        color: var(--ctp-pink);
        background: color-mix(in srgb, var(--ctp-surface0) 45%, transparent);
        padding: 2px 6px;
        border-radius: 4px;
        text-align: center;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }

      .rgx-cheat-row code:hover {
        background: color-mix(in srgb, var(--ctp-pink) 20%, transparent);
        border-color: var(--ctp-pink);
        transform: scale(1.06);
      }

      .rgx-cheat-row span {
        color: var(--text-secondary);
        line-height: 1.3;
      }

      /* Snippets styling */
      .rgx-snippet-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 8px;
      }

      .rgx-tab-btn {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        font-family: var(--font-sans);
        font-size: 0.85rem;
        font-weight: 600;
        padding: 6px 12px;
        cursor: pointer;
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
      }

      .rgx-tab-btn:hover {
        color: var(--text-primary);
        background: color-mix(in srgb, var(--ctp-surface0) 40%, transparent);
      }

      .rgx-tab-btn.active {
        color: var(--ctp-pink);
        background: color-mix(in srgb, var(--ctp-pink) 15%, transparent);
      }

      .rgx-snippet-container {
        position: relative;
        background: color-mix(in srgb, var(--ctp-mantle) 60%, transparent);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 14px;
        overflow-x: auto;
      }

      .rgx-snippet-container pre {
        margin: 0;
        white-space: pre;
      }

      .rgx-snippet-container code {
        font-family: var(--font-mono);
        font-size: 0.82rem;
        color: var(--ctp-lavender);
      }

      .rgx-copy-snippet-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        padding: 6px 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .rgx-copy-snippet-btn:hover {
        border-color: var(--ctp-pink);
        color: var(--ctp-pink);
      }
    </style>

    <script>
      (function () {
        const TEMPLATES = {
          email: {
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$',
            flags: 'gm',
            test: 'hello@example.com\\\\ninvalid-email@\\\\nanother.user+tag@domain.co.uk'
          },
          url: {
            pattern: '^(https?:\\\\/\\\\/)?(www\\\\.)?([a-zA-Z0-9-]+)\\\\.([a-zA-Z]{2,})(\\\\/[a-zA-Z0-9-_./?%&=]*)?$',
            flags: 'gm',
            test: 'https://www.google.com/search?q=regex\\\\nhttp://example.org/path/to/page\\\\ninvalid_url'
          },
          phone: {
            pattern: '\\\\(?(\\\\d{3})\\\\)?[-. ]?(\\\\d{3})[-. ]?(\\\\d{4})',
            flags: 'g',
            test: 'Call me at (123) 456-7890 or 987-654-3210.\\\\nWork number is 555.123.4567.'
          },
          html: {
            pattern: '<([a-z1-6]+)([^>]*)>(.*?)</\\\\1>',
            flags: 'gi',
            test: '<div>Hello <b>world</b>!</div>\\\\n<p class="text">Paragraph content</p>'
          },
          ipv4: {
            pattern: '\\\\b(?:(?:25[0-5]|2[0-4]\\\\d|[01]?\\\\d\\\\d?)\\\\.){3}(?:25[0-5]|2[0-4]\\\\d|[01]?\\\\d\\\\d?)\\\\b',
            flags: 'g',
            test: 'IP addresses detected: 192.168.1.1, 10.0.0.254, 999.999.999.999 (invalid)'
          }
        };

        const GROUP_COLORS = [
          'var(--ctp-lavender)',
          'var(--ctp-pink)',
          'var(--ctp-peach)',
          'var(--ctp-yellow)',
          'var(--ctp-sky)',
          'var(--ctp-green)'
        ];

        let currentMatches = [];
        let activeSnippetTab = 'js';

        function escapeHtml(str) {
          return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        window.toggleFlag = function (flag) {
          const flagsInput = document.getElementById('rgx-flags');
          let current = flagsInput.value;
          if (current.includes(flag)) {
            current = current.replace(new RegExp(flag, 'g'), '');
          } else {
            current += flag;
          }
          // Sort flags alphabetically to be neat
          flagsInput.value = current.split('').sort().join('');
          updateActiveFlagButtons();
          runRegexPlayground();
        };

        window.syncFlagsFromInput = function () {
          updateActiveFlagButtons();
          runRegexPlayground();
        };

        function updateActiveFlagButtons() {
          const flags = document.getElementById('rgx-flags').value;
          document.querySelectorAll('.rgx-flag-btn').forEach(btn => {
            const flag = btn.dataset.flag;
            if (flags.includes(flag)) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          });
        }

        window.loadTemplate = function (key) {
          const t = TEMPLATES[key];
          if (!t) return;
          document.getElementById('rgx-pattern').value = t.pattern;
          document.getElementById('rgx-flags').value = t.flags;
          document.getElementById('rgx-test-string').value = t.test.replace(/\\\\n/g, '\\n');
          updateActiveFlagButtons();
          runRegexPlayground();
        };

        window.switchSnippetTab = function (tab) {
          activeSnippetTab = tab;
          document.querySelectorAll('.rgx-tab-btn').forEach(btn => {
            if (btn.dataset.tab === tab) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          });
          updateCodeSnippet();
        };

        window.copySnippet = async function () {
          const codeEl = document.getElementById('rgx-snippet-code');
          if (!codeEl.innerText || codeEl.innerText.startsWith('//')) return;
          try {
            await navigator.clipboard.writeText(codeEl.innerText);
            const btn = document.querySelector('.rgx-copy-snippet-btn');
            const orig = btn.innerHTML;
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            setTimeout(() => { btn.innerHTML = orig; }, 1200);
          } catch (e) {
            alert('Failed to copy: ' + e.message);
          }
        };

        window.copyAllMatches = async function () {
          if (!currentMatches || !currentMatches.length) return;
          const text = currentMatches.map(m => m[0]).join('\\n');
          try {
            await navigator.clipboard.writeText(text);
            const btn = document.getElementById('rgx-copy-matches-btn');
            const orig = btn.innerHTML;
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
            setTimeout(() => { btn.innerHTML = orig; }, 1200);
          } catch (err) {
            alert('Could not copy matches: ' + (err.message || err));
          }
        };

        function updateCodeSnippet() {
          const pattern = document.getElementById('rgx-pattern').value;
          const flags = document.getElementById('rgx-flags').value;
          const codeEl = document.getElementById('rgx-snippet-code');

          if (!pattern) {
            codeEl.innerText = '// Enter a regular expression to see code snippets';
            return;
          }

          if (activeSnippetTab === 'js') {
            const jsPattern = pattern.replace(/\\\//g, '\\\\/');
            const jsLines = [
              'const pattern = /' + jsPattern + '/' + flags + ';',
              'const subject = "your test string";',
              '',
              '// Match validation',
              'const isValid = pattern.test(subject);',
              '',
              '// Get all matches',
              'const matches = [...subject.matchAll(pattern)];',
              'matches.forEach(match => {',
              '  console.log("Found match:", match[0], "at index", match.index);',
              '});'
            ];
            codeEl.innerText = jsLines.join('\\n');
          } else if (activeSnippetTab === 'python') {
            let pyFlags = [];
            if (flags.includes('i')) pyFlags.push('re.IGNORECASE');
            if (flags.includes('m')) pyFlags.push('re.MULTILINE');
            if (flags.includes('s')) pyFlags.push('re.DOTALL');
            if (flags.includes('u')) pyFlags.push('re.UNICODE');
            const flagsStr = pyFlags.length ? ', ' + pyFlags.join(' | ') : '';

            const pyPattern = pattern.replace(/"/g, '\\\\"');
            const pyLines = [
              'import re',
              '',
              'pattern = r"' + pyPattern + '"',
              'subject = "your test string"',
              '',
              '# Search or validate',
              'match = re.search(pattern, subject' + flagsStr + ')',
              'if match:',
              '    print("Valid match:", match.group(0))',
              '',
              '# Find all occurrences',
              'for m in re.finditer(pattern, subject' + flagsStr + '):',
              '    print("Found:", m.group(0), "at start index", m.start())'
            ];
            codeEl.innerText = pyLines.join('\\n');
          } else if (activeSnippetTab === 'php') {
            const phpPattern = pattern.replace(/\\\//g, '\\\\/').replace(/"/g, '\\\\"');
            const phpLines = [
              '<?php',
              '$pattern = "/' + phpPattern + '/' + flags + '";',
              '$subject = "your test string";',
              '',
              '// Validate match',
              'if (preg_match($pattern, $subject)) {',
              '    echo "Match found!\\\\n";',
              '}',
              '',
              '// Get all matches',
              'if (preg_match_all($pattern, $subject, $matches, PREG_OFFSET_CAPTURE)) {',
              '    foreach ($matches[0] as $match) {',
              '        echo "Found: " . $match[0] . " at index " . $match[1] . "\\\\n";',
              '    }',
              '}'
            ];
            codeEl.innerText = phpLines.join('\\n');
          }
        }

        window.runRegexPlayground = function () {
          const pattern = document.getElementById('rgx-pattern').value;
          const flags = document.getElementById('rgx-flags').value;
          const testString = document.getElementById('rgx-test-string').value;
          const errorDiv = document.getElementById('rgx-error');
          const visualizerDiv = document.getElementById('rgx-visualizer');
          const summaryDiv = document.getElementById('rgx-summary');
          const resultsDiv = document.getElementById('rgx-results');
          const copyMatchesBtn = document.getElementById('rgx-copy-matches-btn');

          errorDiv.classList.add('tb-hidden');
          errorDiv.innerHTML = '';

          if (!pattern) {
            visualizerDiv.innerHTML = escapeHtml(testString);
            summaryDiv.innerHTML = '<span class="tb-badge tb-badge-pending">0 matches</span>';
            copyMatchesBtn.classList.add('tb-hidden');
            resultsDiv.innerHTML = '<div class="tb-state-message">Enter a regular expression pattern to begin.</div>';
            currentMatches = [];
            updateCodeSnippet();
            return;
          }

          let regex;
          try {
            regex = new RegExp(pattern, flags);
          } catch (e) {
            errorDiv.classList.remove('tb-hidden');
            errorDiv.innerText = e.message;
            visualizerDiv.innerHTML = escapeHtml(testString);
            summaryDiv.innerHTML = '<span class="tb-badge tb-badge-bad">Invalid Regex</span>';
            copyMatchesBtn.classList.add('tb-hidden');
            resultsDiv.innerHTML = '<div class="tb-state-message" style="color:var(--color-bad);">Regex syntax error. Please correct the pattern above.</div>';
            currentMatches = [];
            updateCodeSnippet();
            return;
          }

          let matches = [];
          try {
            if (flags.includes('g')) {
              let m;
              regex.lastIndex = 0;
              while ((m = regex.exec(testString)) !== null) {
                matches.push(m);
                // Prevent infinite loop on zero-length matches (e.g. ^, $, \\b, a*)
                if (m[0].length === 0) {
                  regex.lastIndex++;
                }
              }
            } else {
              const m = regex.exec(testString);
              if (m) {
                matches.push(m);
              }
            }
          } catch (e) {
            console.error(e);
          }

          // Store matches globally
          currentMatches = matches;

          // Build Match Highlights safely
          let vizHtml = '';
          let lastIdx = 0;
          let safeMatches = [];

          // Filter out overlapping or back-sliding indices to avoid visualizer corruption
          matches.forEach(m => {
            if (m.index >= lastIdx && m[0].length > 0) {
              safeMatches.push(m);
              lastIdx = m.index + m[0].length;
            }
          });

          lastIdx = 0;
          safeMatches.forEach(m => {
            const start = m.index;
            const end = start + m[0].length;
            vizHtml += escapeHtml(testString.slice(lastIdx, start));
            vizHtml += '<span class="rgx-match-highlight">' + escapeHtml(testString.slice(start, end)) + '</span>';
            lastIdx = end;
          });
          vizHtml += escapeHtml(testString.slice(lastIdx));
          visualizerDiv.innerHTML = vizHtml || '&nbsp;';

          // Display Summary Badge
          const matchCount = matches.length;
          summaryDiv.innerHTML = '<span class="tb-badge ' + (matchCount > 0 ? 'tb-badge-active' : 'tb-badge-pending') + '">' +
            matchCount + ' match' + (matchCount === 1 ? '' : 'es') + '</span>';

          if (matchCount > 0) {
            copyMatchesBtn.classList.remove('tb-hidden');
          } else {
            copyMatchesBtn.classList.add('tb-hidden');
          }

          if (matchCount === 0) {
            resultsDiv.innerHTML = '<div class="tb-state-message">No matches found.</div>';
            updateCodeSnippet();
            return;
          }

          // Render Matches Detail Cards
          let cardsHtml = '<div class="rgx-match-list">';
          matches.forEach((m, idx) => {
            const matchVal = m[0];
            const startIdx = m.index;
            const endIdx = startIdx + matchVal.length;
            
            let groupsHtml = '';
            // Match captures start at index 1
            if (m.length > 1) {
              groupsHtml += '<div class="rgx-groups">';
              for (let g = 1; g < m.length; g++) {
                const groupVal = m[g] !== undefined ? m[g] : 'undefined';
                const color = GROUP_COLORS[(g - 1) % GROUP_COLORS.length];
                groupsHtml += '<div class="rgx-group-row">' +
                  '<span class="rgx-group-label" style="color: ' + color + '; border-color: ' + color + '">Group ' + g + '</span>' +
                  '<span class="rgx-group-val" style="color: ' + color + '">' + escapeHtml(groupVal) + '</span>' +
                '</div>';
              }
              groupsHtml += '</div>';
            }

            cardsHtml += '<div class="rgx-match-card">' +
              '<div class="rgx-match-header">' +
                '<span class="rgx-match-title">Match #' + (idx + 1) + '</span>' +
                '<span class="rgx-match-meta">Index: ' + startIdx + '–' + endIdx + ' (' + matchVal.length + ' chars)</span>' +
              '</div>' +
              '<div class="rgx-match-val">' + escapeHtml(matchVal) + '</div>' +
              groupsHtml +
            '</div>';
          });
          cardsHtml += '</div>';
          resultsDiv.innerHTML = cardsHtml;
          
          updateCodeSnippet();
        };

        // Initialize state
        updateActiveFlagButtons();
        runRegexPlayground();

        // Cheatsheet click insertion listener
        document.querySelectorAll('.rgx-cheatsheet code').forEach(codeEl => {
          codeEl.addEventListener('click', function () {
            const token = this.innerText;
            const input = document.getElementById('rgx-pattern');
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const val = input.value;
            input.value = val.slice(0, start) + token + val.slice(end);
            input.focus();
            input.selectionStart = input.selectionEnd = start + token.length;
            runRegexPlayground();
          });
        });
      })();
    </script>
  `
});
