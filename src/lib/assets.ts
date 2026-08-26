import toolboxCss from '../../assets/toolbox.css.txt';
import toolboxJs from '../../assets/toolbox.js.txt';
import { renderThemeCss } from './themes.js';
import { renderLayoutCss } from './layouts.js';
import { renderAccentCss } from './accents.js';
import { renderRadiusCss } from './radius.js';

export const styleTag = () =>
  `<style>${toolboxCss}\n${renderThemeCss()}\n${renderLayoutCss()}\n${renderAccentCss()}\n${renderRadiusCss()}</style>`;
export const scriptTag = () => `<script>${toolboxJs}</script>`;

export const htmlContentType = 'text/html; charset=utf-8';
