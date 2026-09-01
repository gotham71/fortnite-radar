export interface PlayerStatsAccount {
  id: string;
  name: string;
}

export interface PlayerModeStats {
  wins: number;
  kills: number;
  deaths: number;
  kd: number;
  matches: number;
  winRate: number;
}

export interface PlayerStats {
  account: PlayerStatsAccount;
  battlePass: {
    level: number;
    progress: number;
  };
  stats: {
    all: {
      overall: PlayerModeStats;
      solo?: PlayerModeStats;
      duo?: PlayerModeStats;
      squad?: PlayerModeStats;
      ltm?: PlayerModeStats;
    };
  };
}

export interface PlayerStatsResponse {
  status: number;
  data: PlayerStats;
}
