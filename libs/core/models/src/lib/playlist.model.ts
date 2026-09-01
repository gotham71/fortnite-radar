export interface CompetitiveMode {
  id: string;
  name: string;
  description?: string;
  gameType: string;
  teamSizeLabel: string;
  maxPlayers?: number;
  noBuild: boolean;
  addedAt: string;
  image?: string;
  isTournament: boolean;
  isLimitedTimeMode: boolean;
}

export interface CompetitiveModesResponse {
  status: number;
  data: CompetitiveMode[];
}
