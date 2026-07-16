export interface Accent {
  id: string;
  name: string;
  hue: number;
}

export const accents: Accent[] = [
  { id: 'mauve', name: 'Mauve', hue: 267 },
  { id: 'blue', name: 'Blue', hue: 217 },
  { id: 'emerald', name: 'Emerald', hue: 145 },
  { id: 'violet', name: 'Violet', hue: 270 },
  { id: 'orange', name: 'Orange', hue: 25 },
  { id: 'rose', name: 'Rose', hue: 350 },
  { id: 'cyan', name: 'Cyan', hue: 190 },
];

export const defaultAccent = 'mauve';

export function renderAccentCss(): string {
  return accents
    .map(a => `[data-accent="${a.id}"] { --accent-hue: ${a.hue}; }`)
    .join('\n');
}
