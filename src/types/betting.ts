// types/betting.ts
export type Sport = "football";

export type EntityType = "global" | "home" | "away" | "player" | "team";

export interface TeamRef {
  id: string;
  name?: string;
}

export interface MatchInfo {
  id: string;
  home: TeamRef;
  away: TeamRef;
  start_date: string; // ISO-8601
  end_date?: string;  // ISO-8601
  timezone?: string;
  competition?: string;
  venue?: string;
}

export interface Interval {
  period: "match" | "1h" | "2h" | "et" | "pens" | "custom";
  start_min?: number;
  end_min?: number;
  include_stoppage?: boolean;
}

export interface MarketParams {
  line?: number;     // e.g., 2.5, -1.0
  target?: number;   // e.g., first to 5 corners
  interval?: Interval;
  includes_et?: boolean;
  includes_penalties?: boolean;
  [k: string]: unknown; // extensible
}

export interface MarketRef {
  id: string;        // e.g. "total_goals_ou", "asian_handicap"
  name: string;      // human-friendly
  params?: MarketParams;
}

export interface Entity {
  type: EntityType;  // global | home | away | player | team
  ref?: string | null; // playerId or teamId when relevant
}

export interface Outcome {
  key: string;       // stable key, e.g. 'over' | 'under' | 'home'
  label: string;     // human label; can be auto-built
  price?: number;    // decimal odds (optional)
}

export interface BetSelection {
  sport: Sport;
  match: MatchInfo;
  entity: Entity;
  market: MarketRef;
  outcomes: Outcome[]; // concrete outcomes user can choose from
}
