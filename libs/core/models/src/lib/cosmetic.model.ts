export interface Cosmetic {
  id: string;
  name: string;
  description?: string;
  type: {
    value: string;
    displayValue: string;
  };
  rarity: {
    value: string;
    displayValue: string;
  };
  set?: {
    value: string;
    text: string;
  };
  introduction?: {
    chapter: string;
    season: string;
    text: string;
  };
  images: {
    smallIcon?: string;
    icon?: string;
    featured?: string;
  };
}

export interface CosmeticsSearchResponse {
  status: number;
  data: Cosmetic[];
}
