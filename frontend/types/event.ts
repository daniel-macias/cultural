export interface EventType {
    _id: string;
    name: string;
    description: string;
    dates?: { start: string; end: string }[];
    promoImage?: { asset: { url: string } };
    categories?: string[];
    priceRange?: { minPrice: number; maxPrice: number };
    location?: { _id: string; name: string; address: string };
    trending?: boolean;
  }
  