export interface Filters {
  make?: string;
  priceRange?: { min: number; max: number; label: string };
  year?: number;
  transmission?: string;
}
