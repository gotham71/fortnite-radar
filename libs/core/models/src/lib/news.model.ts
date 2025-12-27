export interface Motd {
  id: string;
  title: string;
  tabTitle: string;
  body: string;
  image: string;
  tileImage: string;
  sortingPriority: number;
  hidden: boolean;
}

export interface BattleRoyaleNews {
  hash: string;
  date: string;
  image: string;
  motds: Motd[];
}

export interface SaveTheWorldNews {
  hash: string;
  date: string;
  messages: {
    title: string;
    body: string;
    image: string;
  }[];
}

export interface FortniteNewsData {
  br: BattleRoyaleNews;
  stw: SaveTheWorldNews;
}

export interface FortniteNewsResponse {
  status: number;
  data: FortniteNewsData;
}
