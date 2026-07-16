export interface Radius {
  id: string;
  name: string;
  css: string;
}

export const radii: Radius[] = [
  {
    id: 'sharp',
    name: 'Sharp',
    css: `:root {
  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --radius-xl: 0px;
}`,
  },
  {
    id: 'rounded',
    name: 'Rounded',
    css: `:root {
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}`,
  },
  {
    id: 'soft',
    name: 'Soft',
    css: `:root {
  --radius-sm: 12px;
  --radius-md: 18px;
  --radius-lg: 26px;
  --radius-xl: 36px;
}`,
  },
];

export const defaultRadius = 'rounded';

export function renderRadiusCss(): string {
  return radii.map(r => r.css).join('\n');
}
