export interface CompetitiveMode {
  id: string;
  name: string;
  description?: string;
  gameType: string;
  teamSizes: string[];
  addedAt: string;
  image?: string;
  isTournament: boolean;
  isLimitedTimeMode: boolean;
}

export interface CompetitiveModesResponse {
  status: number;
  data: CompetitiveMode[];
}
