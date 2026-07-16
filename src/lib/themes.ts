import latteCss from '../../assets/themes/latte.css.txt';
import frappeCss from '../../assets/themes/frappe.css.txt';
import macchiatoCss from '../../assets/themes/macchiato.css.txt';
import mochaCss from '../../assets/themes/mocha.css.txt';

export interface Theme {
  id: string;
  name: string;
  swatch: string;
  css: string;
}

export const themes: Theme[] = [
  { id: 'latte', name: 'Latte', swatch: '#eff1f5', css: latteCss },
  { id: 'frappe', name: 'Frappé', swatch: '#303446', css: frappeCss },
  { id: 'macchiato', name: 'Macchiato', swatch: '#24273a', css: macchiatoCss },
  { id: 'mocha', name: 'Mocha', swatch: '#1e1e2e', css: mochaCss },
];

export const defaultTheme = 'mocha';

export function renderThemeCss(): string {
  return themes.map(t => t.css).join('\n');
}
