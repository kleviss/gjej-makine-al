export const MAKES = [
  'Mercedes-Benz',
  'BMW',
  'Audi',
  'Volkswagen',
  'Toyota',
  'Ford',
  'Opel',
  'Fiat',
  'Renault',
  'Peugeot',
];

export const PRICE_RANGES = [
  { min: 0, max: 5000, label: 'Under \u20ac5,000' },
  { min: 5000, max: 10000, label: '\u20ac5,000 - \u20ac10,000' },
  { min: 10000, max: 20000, label: '\u20ac10,000 - \u20ac20,000' },
  { min: 20000, max: 30000, label: '\u20ac20,000 - \u20ac30,000' },
  { min: 30000, max: 50000, label: '\u20ac30,000 - \u20ac50,000' },
  { min: 50000, max: Infinity, label: 'Over \u20ac50,000' },
];

export const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export const TRANSMISSIONS = ['Automatic', 'Manual'];
