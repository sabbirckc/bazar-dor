
export interface ProductChange {
  dir: "up" | "down" | "same";
  pct: number;
}

export interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: ProductChange;
  markets: Market[];
}

export interface Category {
  slug: string;
  nameBn: string;
  icon?: string;
}
