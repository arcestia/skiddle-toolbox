import { layout } from './layout.js';
import { footer } from './footer.js';
import { changelogEntries, type ChangelogEntry } from '../lib/changelog.js';

function renderList(items: string[] | undefined, title: string): string {
  if (!items || items.length === 0) return '';
  return `
    <h4 class="changelog-section-title">${title}</h4>
    <ul class="changelog-list">
      ${items.map(item => `<li>${item}</li>`).join('\n      ')}
    </ul>
  `;
}

function renderEntry(entry: ChangelogEntry): string {
  return `
    <section class="tb-card changelog-card">
      <div class="changelog-header">
        <h2 class="changelog-version">${entry.version}</h2>
        <span class="tb-badge tb-badge-pending">${entry.date}</span>
      </div>
      ${renderList(entry.added, 'Added')}
      ${renderList(entry.changed, 'Changed')}
      ${renderList(entry.fixed, 'Fixed')}
    </section>
  `;
}

export const changelogView = (): string => layout({
  title: 'Changelog · Skiddle Toolbox',
  body: `
    <div class="tb-page-header">
      <div class="tb-tool-icon">📋</div>
      <div class="tb-page-header__text">
        <h1>Changelog</h1>
        <p>A running history of what's new, changed, and fixed in Skiddle Toolbox.</p>
      </div>
    </div>

    <div class="changelog-timeline">
      ${changelogEntries.map(renderEntry).join('\n      ')}
    </div>

    ${footer()}

    <style>
      .changelog-timeline {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .changelog-card {
        position: relative;
        padding-left: 28px;
      }
      .changelog-card::before {
        content: '';
        position: absolute;
        top: 32px;
        left: 0;
        width: 3px;
        height: calc(100% + 24px);
        background: var(--border-color);
        border-radius: 999px;
      }
      .changelog-card:last-child::before {
        display: none;
      }
      .changelog-card::after {
        content: '';
        position: absolute;
        top: 24px;
        left: -5px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: var(--accent-primary);
        box-shadow: 0 0 0 3px var(--ctp-base);
      }
      .changelog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 18px;
      }
      .changelog-version {
        font-size: 1.35rem;
        font-weight: 800;
        margin: 0;
      }
      .changelog-section-title {
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.7px;
        color: var(--text-muted);
        margin: 18px 0 10px;
      }
      .changelog-list {
        list-style: disc;
        padding-left: 20px;
        color: var(--text-secondary);
        line-height: 1.7;
      }
      .changelog-list li {
        margin-bottom: 6px;
      }
      .changelog-list li::marker {
        color: var(--accent-primary);
      }
    </style>
  `,
});
