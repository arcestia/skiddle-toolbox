export interface Density {
  id: string;
  name: string;
  description: string;
}

export const densities: Density[] = [
  {
    id: 'compact',
    name: 'Compact',
    description: 'Tighter spacing and smaller targets',
  },
  {
    id: 'comfortable',
    name: 'Comfortable',
    description: 'Balanced spacing for most screens',
  },
  {
    id: 'spacious',
    name: 'Spacious',
    description: 'More breathing room and larger targets',
  },
];

export const defaultDensity = 'comfortable';
