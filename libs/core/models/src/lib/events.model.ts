export interface TournamentResponse {
  result: boolean;
  region: string;
  season: number;
  lang: LanguageCode;
  events: TournamentEntry[];
}

export interface TournamentEntry {
  id: string;
  displayId: string;
  region: string;
  detectionDate: string;
  name_line1: string;
  name_line2: string;
  poster?: string | null;
  posterBack?: string | null;
  loadingScreen?: string | null;
  tileImage?: string | null;
  short_description: string;
  long_description: string;
  schedule: string;
  beginTime: string;
  endTime: string;
  cumulative: boolean;
  platforms: PlatformType[];
  renderData: Record<string, unknown>;
  windows: TournamentWindow[];
}

export interface TournamentWindow {
  endTime: string;
  beginTime: string;
  windowId: string;
}

export interface RulesResponse {
  eventId: string;
  rules: Rule[];
}

export interface Rule {
  matchRules: {
    placement: { rank: number; points: number }[];
    eliminations: number;
  };
}

export interface LeaderboardResponse {
  eventId: string;
  windowId: string;
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  name: string;
  points: number;
  rank: number;
  matchesPlayed: number;
}

//#region Window
export interface TournamentWindowResponse {
  result:	boolean;
  page:	number;
  totalPages:	number;
  session: {
    eventId:	string;
    eventDisplayId:	string;
    region:	string;
    windowId:	string;
    beginTime: string;
    endTime: string;
    matchCap:	number;
    useIndividualScores: boolean;
    finished:	boolean;
    rules: {
      tie: TournamentWindowTieRule;
      scoring: TournamentWindowScoring[];
    }
    payout: TournamentWindowPayout;
    results: TournamentWindowResult[];
  };
}
export interface TournamentWindowResult {
  gameId:	string;
  eventId:	string;
  eventWindowId:	string;
  teamAccountIds:	string[];
  liveSessionId:	string | null;
  pointsEarned:	number;
  score:	number;
  rank:	number;
  percentile:	number;
  pointBreakdown:	Record<string, {
    pointsEarned:	number;
    timesAchieved: number;
  }>;
  playerFlagTokens: { [key: string]: string };
  sessionHistory:	{
      trackedStats:	Record<string, number>;
      endTime: string;
      sessionId: string;
  }[];
  unscoredSessions:	object[];
  tokens:	string[];
  teamId:	string;
  teamAccountNames:	{
    name:	string;
    id:	string;
  }[];
}

export interface TournamentWindowPayout {
  scoreId: string | null;
  scoringType: string;
  ranks: {
    payouts: {
      quantity:	number;
      value: string;
      rewardMode:	string;
      rewardType:	string;
    }[];
    threshold: number;
  }[];
}

export interface TournamentWindowTieRule {
  basePointsBits:	number;
  components: {
    aggregation: string;
    multiplier:	number | null;
    nullable: boolean;
    bits:	number;
    trackedStat:	string;
  }[];
}

export interface TournamentWindowScoring {
  trackedStat: string;
  matchRule: string;
  rewardTiers: RewardTier[];
}

export interface SimplifiedWindow {
  eventId: string;
  eventWindowId: string;
  team: TeamInfo[];
  pointsEarned: number;
  score: number;
  rank: number;
  percentile: number;
}

export interface TeamInfo {
  id: string;
  name: string;
  flag?: string | null;
}

export interface PointBreakDown  {
  [key: string]: {
    timesAchieved: number;
    pointsEarned: number;
  };
};

export interface RewardTier  {
  keyValue: number;
  pointsEarned: number;
  multiplicative: boolean;
};

export interface TorunamentWindowScoring  {
  trackedStat: string;
  matchRule: "lte" | "gte";
  rewardTiers: RewardTier[];
};
//#endregion Window

export type PlatformType = 'epic' | 'psn' | 'xbl' | 'steam';

export type LanguageCode =
  | 'en'
  | 'fr'
  | 'ar'
  | 'de'
  | 'es'
  | 'es-419'
  | 'it'
  | 'ja'
  | 'ko'
  | 'pl'
  | 'pt-br'
  | 'ru'
  | 'tr';
