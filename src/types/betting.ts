// ========= Shared enums & bases =========
export enum BetType { 
  EXACT = "ExactBet", 
  OVER_UNDER = "OverUnderBet", 
  BINARY = "BinaryBet", 
  HANDICAP = "HandicapBet" 
}

export enum Period { 
  FT = "FT", 
  H1 = "1H", 
  H2 = "2H", 
  ET = "ET" 
}

export enum Concern { 
  TOTAL = "TOTAL", 
  HOME = "HOME", 
  AWAY = "AWAY", 
  PLAYER = "PLAYER" 
}

export type Odds = number; // decimal odds

export type SettlementScope = "REGULATION" | "ET_INCLUDED" | "PENALTIES_INCLUDED";

export interface BetBase {
  id: string;
  sport: "FOOTBALL";
  league: string;
  gameId: string;           // canonical ID if you have it
  teamHome: string;
  teamAway: string;
  bookmaker: string;
  period: Period;
  concern: Concern;
  metric: string;           // e.g., "GOALS","CORNERS","BTTS","QUALIFY", etc.
  settlementScope?: SettlementScope;
  createdAt: Date;
  updatedAt: Date;
  price: Odds;              // decimal odds
}

export interface OverUnderBet extends BetBase {
  marketType: BetType.OVER_UNDER;
  line: number;
  side: "OVER" | "UNDER";
}

export interface YesNoBet extends BetBase {
  marketType: BetType.BINARY;
  side: "YES" | "NO";
  // Optional time window for "goal in first 10'", etc.
  window?: { startMin: number; endMin: number };
  // Optional player name for player-specific bets
  playerName?: string;
}

export interface HandicapBet extends BetBase {
  marketType: BetType.HANDICAP;
  line: number; // ±y.5 recommended for 2-way
  // direction comes from concern (HOME/AWAY) + line sign
}

export interface ExactBet extends BetBase {
  marketType: BetType.EXACT;
  marketKey: string;      // e.g., "1X2", "double_chance", "ht_ft", "correct_score", ...
  selectionCode: string;  // e.g., "1","X","2","1X","12","X2","HH","2-1", etc.
}

// Union
export type AnyBet = OverUnderBet | YesNoBet | HandicapBet | ExactBet;
