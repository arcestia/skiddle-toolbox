import defaultCss from '../../assets/layouts/default.css.txt';
import compactCss from '../../assets/layouts/compact.css.txt';
import wideCss from '../../assets/layouts/wide.css.txt';

export interface Layout {
  id: string;
  name: string;
  description: string;
  css: string;
}

export const layouts: Layout[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Balanced spacing and card size',
    css: defaultCss,
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Smaller hero and tighter spacing',
    css: compactCss,
  },
  {
    id: 'wide',
    name: 'Wide',
    description: 'Full-width container for large screens',
    css: wideCss,
  },
];

export const defaultLayout = 'default';

export function renderLayoutCss(): string {
  return layouts.map(l => l.css).join('\n');
}

export function renderLayoutOptions(): string {
  return layouts
    .map(
      l => `<button type="button" class="tb-layout-option" data-layout="${l.id}" onclick="window.toolbox.setLayout('${l.id}')">
              <strong>${l.name}</strong>
              <span>${l.description}</span>
            </button>`
    )
    .join('\n          ');
}
