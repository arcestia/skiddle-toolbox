import latteCss from '../../assets/themes/latte.css.txt';
import frappeCss from '../../assets/themes/frappe.css.txt';
import macchiatoCss from '../../assets/themes/macchiato.css.txt';
import mochaCss from '../../assets/themes/mocha.css.txt';
import tokyoNightCss from '../../assets/themes/tokyo-night.css.txt';
import nordCss from '../../assets/themes/nord.css.txt';
import draculaCss from '../../assets/themes/dracula.css.txt';
import gruvboxCss from '../../assets/themes/gruvbox.css.txt';
import oneDarkCss from '../../assets/themes/one-dark.css.txt';
import githubDarkCss from '../../assets/themes/github-dark.css.txt';
import githubLightCss from '../../assets/themes/github-light.css.txt';
import solarizedDarkCss from '../../assets/themes/solarized-dark.css.txt';
import solarizedLightCss from '../../assets/themes/solarized-light.css.txt';

export interface Theme {
  id: string;
  name: string;
  swatch: string;
  pack: string;
  css: string;
}

export const themes: Theme[] = [
  { id: 'latte', name: 'Latte', swatch: '#eff1f5', pack: 'Catppuccin', css: latteCss },
  { id: 'frappe', name: 'Frappé', swatch: '#303446', pack: 'Catppuccin', css: frappeCss },
  { id: 'macchiato', name: 'Macchiato', swatch: '#24273a', pack: 'Catppuccin', css: macchiatoCss },
  { id: 'mocha', name: 'Mocha', swatch: '#1e1e2e', pack: 'Catppuccin', css: mochaCss },
  { id: 'tokyo-night', name: 'Tokyo Night', swatch: '#1a1b26', pack: 'IDE', css: tokyoNightCss },
  { id: 'nord', name: 'Nord', swatch: '#2e3440', pack: 'IDE', css: nordCss },
  { id: 'dracula', name: 'Dracula', swatch: '#282a36', pack: 'IDE', css: draculaCss },
  { id: 'gruvbox', name: 'Gruvbox', swatch: '#282828', pack: 'IDE', css: gruvboxCss },
  { id: 'one-dark', name: 'One Dark', swatch: '#282c34', pack: 'IDE', css: oneDarkCss },
  { id: 'github-dark', name: 'GitHub Dark', swatch: '#0d1117', pack: 'IDE', css: githubDarkCss },
  { id: 'github-light', name: 'GitHub Light', swatch: '#ffffff', pack: 'IDE', css: githubLightCss },
  { id: 'solarized-dark', name: 'Solarized Dark', swatch: '#002b36', pack: 'IDE', css: solarizedDarkCss },
  { id: 'solarized-light', name: 'Solarized Light', swatch: '#fdf6e3', pack: 'IDE', css: solarizedLightCss },
];

export const defaultTheme = 'mocha';

export function renderThemeCss(): string {
  return themes.map(t => t.css).join('\n');
}
