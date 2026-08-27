import { layout } from './layout.js';
import { footer } from './footer.js';

export const markdownEditorView = (): string => layout({
  title: 'Markdown Editor Â· Skiddle Toolbox',
  description: 'Split-pane Markdown editor with live preview, formatting toolbar, and one-click .md and HTML export.',
  canonicalPath: '/markdown-editor',
  subtitle: 'Write, preview, and download Markdown with a live split-pane editor',
  backHref: '/',
  themeVariant: 'dots',
  body: `
    <div class="tb-page-header accent-blue">
      <div class="tb-tool-icon">ðŸ“</div>
      <div class="tb-page-header__text">
        <h1>Markdown Editor</h1>
        <p>Compose Markdown on the left and see the rendered preview update live on the right. Includes a formatting toolbar and one-click export.</p>
      </div>
    </div>

    <div class="md-layout">
      <div class="tb-card md-toolbar-card">
        <div class="md-toolbar">
          <div class="md-toolbar-group">
            <button type="button" class="md-tool-btn" onclick="wrapSelection('**','**')" title="Bold"><strong>B</strong></button>
            <button type="button" class="md-tool-btn" onclick="wrapSelection('*','*')" title="Italic"><em>I</em></button>
            <button type="button" class="md-tool-btn" onclick="insertPrefix('# ')">H1</button>
            <button type="button" class="md-tool-btn" onclick="insertPrefix('## ')">H2</button>
            <button type="button" class="md-tool-btn" onclick="insertPrefix('### ')">H3</button>
            <button type="button" class="md-tool-btn" onclick="wrapSelection('[','](url)')" title="Link">ðŸ”—</button>
            <button type="button" class="md-tool-btn" onclick="wrapSelection('![', '](url)')" title="Image">ðŸ–¼ï¸</button>
            <button type="button" class="md-tool-btn" onclick="insertPrefix('- ')" title="Bullet list">â€¢ List</button>
            <button type="button" class="md-tool-btn" onclick="insertPrefix('1. ')" title="Numbered list">1. List</button>
            <button type="button" class="md-tool-btn" onclick="insertInlineCode()" title="Inline code">&lt;/&gt;</button>
            <button type="button" class="md-tool-btn" onclick="insertCodeBlock()" title="Code block">{ }</button>
            <button type="button" class="md-tool-btn" onclick="insertPrefix('&gt; ')" title="Quote">" Quote</button>
            <button type="button" class="md-tool-btn" onclick="insertRule()" title="Horizontal rule">â€”</button>
          </div>
          <div class="md-toolbar-group md-toolbar-group--right">
            <button type="button" class="tb-btn tb-btn-secondary" onclick="loadMarkdownFile()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Load File
            </button>
            <button type="button" class="tb-btn tb-btn-secondary" onclick="downloadMarkdown()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Save .md
            </button>
            <button type="button" class="tb-btn tb-btn-secondary" onclick="openMdShortcuts()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6" y2="8.01"></line><line x1="10" y1="8" x2="10" y2="8.01"></line><line x1="14" y1="8" x2="14" y2="8.01"></line><line x1="18" y1="8" x2="18" y2="8.01"></line></svg>
              Shortcuts
            </button>
          </div>
        </div>
        <input type="file" id="md-file-input" accept=".md,.markdown,.txt" hidden onchange="handleMarkdownFile(this)">
      </div>

      <div class="md-editor-wrap">
        <div class="tb-card md-pane md-pane--editor">
          <label class="tb-label" for="md-editor">Markdown Source</label>
          <textarea id="md-editor" class="tb-textarea md-textarea" placeholder="# Start writing..." spellcheck="false" oninput="updateMarkdownPreview()"></textarea>
        </div>

        <div class="tb-card md-pane md-pane--preview">
          <div class="md-preview-header">
            <span class="tb-label" style="margin:0;">Preview</span>
            <button type="button" class="tb-btn tb-btn-secondary" onclick="copyHtml()" style="padding:6px 12px;font-size:0.78rem;">Copy HTML</button>
          </div>
          <div id="md-preview" class="md-preview-content"></div>
        </div>
      </div>
    </div>

    <div id="md-shortcuts-overlay" class="tb-overlay tb-hidden" onclick="if(event.target===this) closeMdShortcuts()"></div>
    <div id="md-shortcuts-modal" class="tb-settings-modal tb-hidden" role="dialog" aria-modal="true" aria-labelledby="md-shortcuts-title">
      <div class="tb-settings-modal__header">
        <h2 id="md-shortcuts-title">Keyboard Shortcuts</h2>
        <button type="button" class="tb-settings-modal__close" onclick="closeMdShortcuts()" aria-label="Close shortcuts">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="tb-settings-modal__body">
        <div class="md-shortcuts-grid">
          <div class="md-shortcut-row"><kbd>Ctrl</kbd> + <kbd>B</kbd><span>Bold</span></div>
          <div class="md-shortcut-row"><kbd>Ctrl</kbd> + <kbd>I</kbd><span>Italic</span></div>
          <div class="md-shortcut-row"><kbd>Ctrl</kbd> + <kbd>K</kbd><span>Insert link</span></div>
          <div class="md-shortcut-row"><kbd>Ctrl</kbd> + <kbd>1</kbd><span>Heading 1</span></div>
          <div class="md-shortcut-row"><kbd>Ctrl</kbd> + <kbd>2</kbd><span>Heading 2</span></div>
          <div class="md-shortcut-row"><kbd>Ctrl</kbd> + <kbd>3</kbd><span>Heading 3</span></div>
          <div class="md-shortcut-row"><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd><span>Code block</span></div>
          <div class="md-shortcut-row"><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd><span>Inline code</span></div>
          <div class="md-shortcut-row"><kbd>Ctrl</kbd> + <kbd>S</kbd><span>Save .md file</span></div>
          <div class="md-shortcut-row"><kbd>Tab</kbd><span>Insert two spaces</span></div>
          <div class="md-shortcut-row"><kbd>Shift</kbd> + <kbd>Tab</kbd><span>Outdent current line</span></div>
        </div>
        <p class="tb-muted" style="font-size:0.8rem;margin-top:12px;">On macOS, use <kbd>Cmd</kbd> instead of <kbd>Ctrl</kbd>.</p>
      </div>
    </div>

    ${footer()}

    <style>
      .md-layout {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .md-toolbar-card {
        padding: 14px 18px;
      }

      .md-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
      }

      .md-toolbar-group {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .md-toolbar-group--right {
        margin-left: auto;
      }

      .md-tool-btn {
        background: color-mix(in srgb, var(--ctp-surface0) 45%, transparent);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        padding: 6px 10px;
        font-family: var(--font-sans);
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 32px;
      }

      .md-tool-btn:hover {
        border-color: var(--ctp-blue);
        color: var(--ctp-blue);
        background: color-mix(in srgb, var(--ctp-blue) 12%, transparent);
      }

      .md-editor-wrap {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        align-items: start;
      }

      @media (max-width: 900px) {
        .md-editor-wrap {
          grid-template-columns: 1fr;
        }
      }

      .md-pane {
        display: flex;
        flex-direction: column;
        gap: 12px;
        min-height: 540px;
      }

      .md-pane--editor {
        padding: 0;
        overflow: hidden;
      }

      .md-pane--editor .tb-label {
        padding: 18px 18px 0;
      }

      .md-textarea {
        flex: 1;
        min-height: 480px;
        border: none;
        border-radius: 0;
        resize: none;
        background: transparent;
        padding: 0 18px 18px;
        line-height: 1.7;
      }

      .md-textarea:focus {
        box-shadow: none;
        background: transparent;
      }

      .md-preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .md-preview-content {
        flex: 1;
        overflow-y: auto;
        max-height: 560px;
        padding-right: 6px;
        color: var(--text-secondary);
        line-height: 1.7;
      }

      .md-preview-content h1,
      .md-preview-content h2,
      .md-preview-content h3,
      .md-preview-content h4,
      .md-preview-content h5,
      .md-preview-content h6 {
        color: var(--text-primary);
        margin-top: 24px;
        margin-bottom: 12px;
        line-height: 1.3;
      }

      .md-preview-content h1 { font-size: 1.8rem; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }
      .md-preview-content h2 { font-size: 1.45rem; border-bottom: 1px solid var(--border-color); padding-bottom: 6px; }
      .md-preview-content h3 { font-size: 1.2rem; }

      .md-preview-content p {
        margin-bottom: 14px;
      }

      .md-preview-content a {
        color: var(--ctp-blue);
        text-decoration: none;
      }

      .md-preview-content a:hover {
        text-decoration: underline;
      }

      .md-preview-content code {
        font-family: var(--font-mono);
        background: color-mix(in srgb, var(--ctp-surface0) 50%, transparent);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        font-size: 0.85em;
        color: var(--accent-primary);
      }

      .md-preview-content pre {
        background: color-mix(in srgb, var(--ctp-mantle) 80%, transparent);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 16px;
        overflow-x: auto;
        margin-bottom: 16px;
      }

      .md-preview-content pre code {
        background: transparent;
        padding: 0;
        font-size: 0.82rem;
      }

      .md-preview-content blockquote {
        border-left: 4px solid var(--ctp-blue);
        padding-left: 16px;
        margin: 0 0 16px;
        color: var(--text-secondary);
      }

      .md-preview-content ul,
      .md-preview-content ol {
        margin-bottom: 16px;
        padding-left: 24px;
      }

      .md-preview-content li {
        margin-bottom: 6px;
      }

      .md-preview-content img {
        max-width: 100%;
        border-radius: var(--radius-md);
        margin: 10px 0;
      }

      .md-preview-content hr {
        border: none;
        border-top: 1px solid var(--border-color);
        margin: 20px 0;
      }

      .md-preview-content table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 16px;
      }

      .md-preview-content th,
      .md-preview-content td {
        border: 1px solid var(--border-color);
        padding: 8px 12px;
        text-align: left;
      }

      .md-preview-content th {
        background: color-mix(in srgb, var(--ctp-surface0) 50%, transparent);
      }

      .md-shortcuts-grid {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .md-shortcut-row {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.9rem;
        color: var(--text-secondary);
      }

      .md-shortcut-row kbd {
        font-family: var(--font-mono);
        background: color-mix(in srgb, var(--ctp-surface0) 60%, transparent);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 3px 7px;
        font-size: 0.78rem;
        color: var(--text-primary);
        min-width: 28px;
        text-align: center;
      }

      .md-shortcut-row span {
        margin-left: auto;
      }
    </style>

    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js"></script>
    <script>
      (function () {
        const editor = document.getElementById('md-editor');
        const preview = document.getElementById('md-preview');
        const fileInput = document.getElementById('md-file-input');

                const sampleMarkdown = [
          '# Hello Markdown',
          '',
          'Start typing on the **left** to see the live preview on the *right*.',
          '',
          '## Features',
          '',
          '- Bold, italic, headings, lists, quotes, code',
          '- Links and images',
          '- Tables and horizontal rules',
          '',
          '> "Markdown is a text-to-HTML conversion tool."',
          '',
          String.fromCharCode(96,96,96) + 'js',
          'const greeting = "Hello, world!";',
          'console.log(greeting);',
          String.fromCharCode(96,96,96)
        ].join(String.fromCharCode(10));

        editor.value = sampleMarkdown;

        window.updateMarkdownPreview = function () {
          const raw = editor.value;
          const html = marked.parse(raw);
          preview.innerHTML = DOMPurify.sanitize(html);
        };

        window.wrapSelection = function (before, after) {
          const start = editor.selectionStart;
          const end = editor.selectionEnd;
          const value = editor.value;
          const selected = value.slice(start, end);
          const replacement = before + selected + after;
          editor.value = value.slice(0, start) + replacement + value.slice(end);
          editor.focus();
          editor.selectionStart = start + before.length;
          editor.selectionEnd = editor.selectionStart + selected.length;
          updateMarkdownPreview();
        };

        window.insertPrefix = function (prefix) {
          const start = editor.selectionStart;
          const value = editor.value;
          const lineStart = value.lastIndexOf('\\n', start - 1) + 1;
          editor.value = value.slice(0, lineStart) + prefix + value.slice(lineStart);
          editor.focus();
          editor.selectionStart = editor.selectionEnd = lineStart + prefix.length;
          updateMarkdownPreview();
        };

        window.insertRule = function () {
          const start = editor.selectionStart;
          const value = editor.value;
          editor.value = value.slice(0, start) + '\\n\\n---\\n\\n' + value.slice(start);
          editor.focus();
          editor.selectionStart = editor.selectionEnd = start + 8;
          updateMarkdownPreview();
        };

        window.insertCodeBlock = function () {
          const start = editor.selectionStart;
          const end = editor.selectionEnd;
          const value = editor.value;
          const fence = '\\n' + String.fromCharCode(96,96,96) + '\\n';
          editor.value = value.slice(0, start) + fence + value.slice(start, end) + fence + value.slice(end);
          editor.focus();
          editor.selectionStart = start + fence.length;
          editor.selectionEnd = editor.selectionStart + (end - start);
          updateMarkdownPreview();
        };

        window.insertInlineCode = function () {
          const tick = String.fromCharCode(96);
          wrapSelection(tick, tick);
        };

        window.loadMarkdownFile = function () {
          fileInput.click();
        };

        window.handleMarkdownFile = function (input) {
          const file = input.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = function (e) {
            editor.value = e.target.result;
            updateMarkdownPreview();
            window.toolbox.toast('File loaded: ' + file.name, 'info');
          };
          reader.readAsText(file);
          input.value = '';
        };

        window.downloadMarkdown = function () {
          const blob = new Blob([editor.value], { type: 'text/markdown;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'document.md';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          window.toolbox.toast('Markdown file downloaded', 'success');
        };

        window.copyHtml = async function () {
          const html = preview.innerHTML;
          try {
            await navigator.clipboard.writeText(html);
            const btn = document.querySelector('.md-preview-header .tb-btn');
            const orig = btn.innerHTML;
            btn.innerText = 'Copied!';
            window.toolbox.toast('HTML copied to clipboard', 'success');
            setTimeout(() => { btn.innerHTML = orig; }, 1200);
          } catch (err) {
            window.toolbox.toast('Could not copy HTML: ' + (err.message || err), 'error');
          }
        };

        window.openMdShortcuts = function () {
          document.getElementById('md-shortcuts-overlay').classList.remove('tb-hidden');
          document.getElementById('md-shortcuts-modal').classList.remove('tb-hidden');
        };

        window.closeMdShortcuts = function () {
          document.getElementById('md-shortcuts-overlay').classList.add('tb-hidden');
          document.getElementById('md-shortcuts-modal').classList.add('tb-hidden');
        };

        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') closeMdShortcuts();
        });

        editor.addEventListener('keydown', function (e) {
          const mod = e.metaKey || e.ctrlKey;
          if (!mod) return;

          switch (e.key.toLowerCase()) {
            case 'b':
              e.preventDefault();
              wrapSelection('**', '**');
              break;
            case 'i':
              e.preventDefault();
              wrapSelection('*', '*');
              break;
            case 'k':
              e.preventDefault();
              wrapSelection('[', '](url)');
              break;
            case 's':
              e.preventDefault();
              downloadMarkdown();
              break;
            case '1':
              e.preventDefault();
              insertPrefix('# ');
              break;
            case '2':
              e.preventDefault();
              insertPrefix('## ');
              break;
            case '3':
              e.preventDefault();
              insertPrefix('### ');
              break;
          }

          if (e.shiftKey) {
            switch (e.key.toLowerCase()) {
              case 'c':
                e.preventDefault();
                insertCodeBlock();
                break;
              case 'x':
                e.preventDefault();
                insertInlineCode();
                break;
            }
          }
        });

        editor.addEventListener('keydown', function (e) {
          if (e.key !== 'Tab') return;
          e.preventDefault();
          const start = editor.selectionStart;
          const end = editor.selectionEnd;
          const value = editor.value;
          if (e.shiftKey) {
            // Outdent current line
            const lineStart = value.lastIndexOf('\\n', start - 1) + 1;
            const line = value.slice(lineStart, end);
            const outdented = line.replace(/^(  |\\t|- |\\d+\\. )/, '');
            editor.value = value.slice(0, lineStart) + outdented + value.slice(end);
            editor.selectionStart = editor.selectionEnd = lineStart + outdented.length;
          } else {
            editor.value = value.slice(0, start) + '  ' + value.slice(end);
            editor.selectionStart = editor.selectionEnd = start + 2;
          }
          updateMarkdownPreview();
        });

        updateMarkdownPreview();
      })();
    </script>
  `
});
