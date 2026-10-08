export interface ProductMarket {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: string | number;
  slug: string;

  name: string;
  description?: string;

  category?: string;
  categoryName?: string;

  unit: string;

  price: number;
  previousPrice?: number;

  change: number;

  image?: string;
  emoji?: string;

  markets?: ProductMarket[];
}