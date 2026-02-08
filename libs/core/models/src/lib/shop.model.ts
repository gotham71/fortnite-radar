
export interface ShopResponse {
  status: number;
  data: ShopData;
}

export interface ShopData {
  hash: string;
  date: string;
  vbuckIcon: string;
  entries: ShopEntry[];
}

export interface ShopEntry {
  regularPrice: number;
  finalPrice: number;
  devName: string;
  offerId: string;
  inDate: string;
  outDate: string;
  giftable: boolean;
  refundable: boolean;
  sortPriority: number;
  layoutId?: string;
  layout?: ShopLayout;
  tileSize?: string;
  newDisplayAssetPath?: string;
  newDisplayAsset?: ShopDisplayAsset;
  brItems?: ShopItem[];
  tracks?: ShopTrack[];
  colors?: {
      color1?: string;
      color2?: string;
      color3?: string;
      textBackgroundColor?: string;
  };
}

export interface ShopTrack {
  id: string;
  devName: string;
  title: string;
  artist: string;
  albumArt: string;
  releaseYear: number;
  bpm: number;
  duration: number;
  difficulty: {
    vocals: number;
    guitar: number;
    bass: number;
    plasticBass: number;
    drums: number;
    plasticDrums: number;
  };
}

export interface ShopLayout {
  id: string;
  name: string;
  index: number;
  rank: number;
  showIneligibleOffers: string;
  useWidePreview: boolean;
  displayType: string;
}

export interface ShopDisplayAsset {
  id: string;
  cosmeticId?: string;
  materialInstances: any[];
  renderImages: ShopRenderImage[];
}

export interface ShopRenderImage {
  productTag: string;
  fileName: string;
  image: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: {
    value: string;
    displayValue: string;
    backendValue: string;
  };
  rarity: {
    value: string;
    displayValue: string;
    backendValue: string;
  };
  series?: {
      value: string;
      image: string;
      colors: string[];
      backendValue: string;
  };
  set?: {
    value: string;
    text: string;
    backendValue: string;
  };
  introduction?: {
    chapter: string;
    season: string;
    text: string;
    backendValue: number;
  };
  images: {
    smallIcon: string;
    icon: string;
    featured?: string;
    other?: Record<string, string>;
  };
  variants?: any[];
  added: string;
}
