// entities
export type EntityType = "global" | "home" | "away" | "team" | "player";

// ----- Global markets (match-level) -----
export type GlobalMarketId =
  | "ft_1x2"
  | "double_chance"
  | "dnb"
  | "ht_ft"
  | "to_qualify"
  | "to_lift_trophy"
  | "total_goals_ou"
  | "total_goals_3way"
  | "btts"
  | "btts_and_result"
  | "first_team_to_score"
  | "last_team_to_score"
  | "half_with_most_goals"
  | "first_half_result"
  | "second_half_result"
  | "goal_in_interval"
  | "next_goal"
  | "win_to_nil"
  | "correct_score"
  | "exact_total_goals"
  | "goal_range"
  | "total_cards_ou"
  | "total_corners_ou"
  | "first_to_x_corners"
  | "red_card_in_match"
  | "own_goal"
  | "winning_margin";

// ----- Team-scoped markets (used by home/away/team) -----
export type TeamMarketId =
  | "team_total_goals_ou"
  | "clean_sheet"
  | "team_cards_ou"
  | "team_corners_ou"
  | "corner_handicap"
  | "handicap"          // European 3-way handicap (with draw_hcap)
  | "asian_handicap";   // 2-way, settlement may push/split

// home/away use TeamMarketId; team (by ID) also uses TeamMarketId
export type PlayerMarketId =
  | "anytime_goalscorer"
  | "first_goalscorer"
  | "last_goalscorer"
  | "player_carded"
  | "player_sent_off"
  | "player_shots_on_target_ou"
  | "player_assists_ou"
  | "player_passes_ou"
  | "player_tackles_ou"
  | "player_fouls_committed_ou";

// Convenience unions
export type MarketId = GlobalMarketId | TeamMarketId | PlayerMarketId;

// Discriminated union tying entity → allowed markets
export type GlobalMarketSpec = {
  entity: "global";
  marketId: GlobalMarketId;
};

export type HomeMarketSpec = {
  entity: "home";
  marketId: TeamMarketId;
};

export type AwayMarketSpec = {
  entity: "away";
  marketId: TeamMarketId;
};

export type TeamMarketSpec = {
  entity: "team";
  marketId: TeamMarketId;
};

export type PlayerMarketSpec = {
  entity: "player";
  marketId: PlayerMarketId;
};

export type AnyMarketSpec =
  | GlobalMarketSpec
  | HomeMarketSpec
  | AwayMarketSpec
  | TeamMarketSpec
  | PlayerMarketSpec;

// Canonical string names for UI / storage
export const MARKET_DISPLAY: Record<MarketId, string> = {
  // Global
  ft_1x2: "Full-Time Result (1X2)",
  double_chance: "Double Chance",
  dnb: "Draw No Bet",
  ht_ft: "Half-Time / Full-Time",
  to_qualify: "To Qualify",
  to_lift_trophy: "To Lift the Trophy",
  total_goals_ou: "Total Goals Over/Under",
  total_goals_3way: "Total Goals (3-way)",
  btts: "Both Teams To Score",
  btts_and_result: "BTTS & Result",
  first_team_to_score: "First Team To Score",
  last_team_to_score: "Last Team To Score",
  half_with_most_goals: "Half with Most Goals",
  first_half_result: "First Half Result (1X2)",
  second_half_result: "Second Half Result (1X2)",
  goal_in_interval: "Goal in Interval",
  next_goal: "Next Goal",
  win_to_nil: "Win to Nil",
  correct_score: "Correct Score",
  exact_total_goals: "Exact Total Goals",
  goal_range: "Goal Range",
  total_cards_ou: "Total Cards Over/Under",
  total_corners_ou: "Total Corners Over/Under",
  first_to_x_corners: "First to X Corners",
  red_card_in_match: "Red Card in Match",
  own_goal: "Own Goal",
  winning_margin: "Winning Margin",

  // Team
  team_total_goals_ou: "Team Total Goals O/U",
  clean_sheet: "Clean Sheet",
  team_cards_ou: "Team Cards O/U",
  team_corners_ou: "Team Corners O/U",
  corner_handicap: "Corner Handicap",
  handicap: "European Handicap (3-way)",
  asian_handicap: "Asian Handicap",

  // Player
  anytime_goalscorer: "Anytime Goalscorer",
  first_goalscorer: "First Goalscorer",
  last_goalscorer: "Last Goalscorer",
  player_carded: "Player to be Carded",
  player_sent_off: "Player Sent Off",
  player_shots_on_target_ou: "Shots on Target O/U",
  player_assists_ou: "Assists O/U",
  player_passes_ou: "Passes O/U",
  player_tackles_ou: "Tackles O/U",
  player_fouls_committed_ou: "Fouls Committed O/U"
};

// Outcome kind helper (2-way / 3-way / dynamic)
type OutcomeKind = "two_way" | "three_way" | "multi_dynamic";

export const MARKET_OUTCOME_KIND: Record<MarketId, OutcomeKind> = {
  // Global
  ft_1x2: "three_way",
  double_chance: "three_way",
  dnb: "two_way",
  ht_ft: "multi_dynamic",
  to_qualify: "two_way",
  to_lift_trophy: "two_way",
  total_goals_ou: "two_way",        // push possible at integer lines (settlement)
  total_goals_3way: "three_way",    // over/exact/under (no pushes)
  btts: "two_way",
  btts_and_result: "multi_dynamic", // 6 outcomes
  first_team_to_score: "three_way", // home/away/no_goal
  last_team_to_score: "three_way",
  half_with_most_goals: "three_way",
  first_half_result: "three_way",
  second_half_result: "three_way",
  goal_in_interval: "two_way",
  next_goal: "three_way",
  win_to_nil: "multi_dynamic",
  correct_score: "multi_dynamic",
  exact_total_goals: "multi_dynamic",
  goal_range: "multi_dynamic",
  total_cards_ou: "two_way",
  total_corners_ou: "two_way",
  first_to_x_corners: "two_way",
  red_card_in_match: "two_way",
  own_goal: "two_way",
  winning_margin: "multi_dynamic",

  // Team
  team_total_goals_ou: "two_way",   // push possible at integer lines
  clean_sheet: "two_way",
  team_cards_ou: "two_way",
  team_corners_ou: "two_way",
  corner_handicap: "two_way",
  handicap: "three_way",            // team / draw_hcap / opp
  asian_handicap: "two_way",        // settlement may push/split

  // Player
  anytime_goalscorer: "two_way",
  first_goalscorer: "multi_dynamic", // N players + no_goalscorer
  last_goalscorer: "multi_dynamic",
  player_carded: "two_way",
  player_sent_off: "two_way",
  player_shots_on_target_ou: "two_way",
  player_assists_ou: "two_way",
  player_passes_ou: "two_way",
  player_tackles_ou: "two_way",
  player_fouls_committed_ou: "two_way"
};

// API mapping → your enums
export function mapApiMarketToId(entity: EntityType, apiName: string): MarketId | null {
  const key = apiName.trim().toLowerCase();

  // global examples
  if (entity === "global") {
    if (key === "1x2" || key.includes("full time result")) return "ft_1x2";
    if (key.includes("double chance")) return "double_chance";
    if (key.includes("draw no bet")) return "dnb";
    if (key.includes("total goals") && key.includes("3-way")) return "total_goals_3way";
    if (key.includes("total goals")) return "total_goals_ou";
    if (key === "btts" || key.includes("both teams to score")) return "btts";
  }

  // team-scoped (home/away/team)
  if (entity === "home" || entity === "away" || entity === "team") {
    if (key.includes("team total goals")) return "team_total_goals_ou";
    if (key.includes("clean sheet")) return "clean_sheet";
    if (key.includes("asian handicap")) return "asian_handicap";
    if (key.includes("handicap")) return "handicap";
  }

  // player
  if (entity === "player") {
    if (key.includes("anytime goalscorer")) return "anytime_goalscorer";
    if (key.includes("first goalscorer")) return "first_goalscorer";
    if (key.includes("last goalscorer")) return "last_goalscorer";
    if (key.includes("carded")) return "player_carded";
  }

  return null;
}

// Stringify helpers
export function marketIdToDisplay(id: MarketId): string {
  return MARKET_DISPLAY[id];
}

export function isTeamScoped(entity: EntityType): boolean {
  return entity === "home" || entity === "away" || entity === "team";
}
