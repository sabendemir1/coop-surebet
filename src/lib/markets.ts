import { BetType } from "@/types/betting";

// === Types ===
export interface Selection {
  code: string;   // stable key for storage/matching (e.g., "1", "HD", "2-1", "H3+")
  label: string;  // UI text
}

export interface MarketInfo {
  betType: BetType;
  uiLabel: string;
  selections?: Selection[]; // ONLY for ExactBet
}

// === Helpers (for Exact markets that have many outcomes) ===
const genCorrectScore = (max = 5): Selection[] => {
  const out: Selection[] = [];
  for (let h = 0; h <= max; h++) {
    for (let a = 0; a <= max; a++) {
      out.push({ code: `${h}-${a}`, label: `${h}–${a}` });
    }
  }
  // Common bookmaker buckets:
  out.push({ code: "AOHW", label: "Any Other Home Win" });  // home scores ≥6 or away ≥6 or home win beyond grid
  out.push({ code: "AOD",  label: "Any Other Draw" });      // e.g., 3–3+ etc. beyond grid
  out.push({ code: "AOAW", label: "Any Other Away Win" });  // away wins beyond grid
  return out;
};

const HTFT9: Selection[] = [
  { code: "HH", label: "Home/Home" },
  { code: "HD", label: "Home/Draw" },
  { code: "HA", label: "Home/Away" },
  { code: "DH", label: "Draw/Home" },
  { code: "DD", label: "Draw/Draw" },
  { code: "DA", label: "Draw/Away" },
  { code: "AH", label: "Away/Home" },
  { code: "AD", label: "Away/Draw" },
  { code: "AA", label: "Away/Away" },
];

const WinningMargin: Selection[] = [
  { code: "H1", label: "Home by 1" },
  { code: "H2", label: "Home by 2" },
  { code: "H3+", label: "Home by 3+" },
  { code: "D",  label: "Draw" },
  { code: "A1", label: "Away by 1" },
  { code: "A2", label: "Away by 2" },
  { code: "A3+", label: "Away by 3+" },
];

const DoubleChance: Selection[] = [
  { code: "1X", label: "Home or Draw (1X)" },
  { code: "12", label: "Home or Away (12)" },
  { code: "X2", label: "Draw or Away (X2)" },
];

const Result1X2: Selection[] = [
  { code: "1", label: "Home Win" },
  { code: "X", label: "Draw" },
  { code: "2", label: "Away Win" },
];

const HalfTimeResult: Selection[] = [
  { code: "1", label: "HT Home" },
  { code: "X", label: "HT Draw" },
  { code: "2", label: "HT Away" },
];

const FirstLastToScore: Selection[] = [
  { code: "H", label: "Home" },
  { code: "A", label: "Away" },
  { code: "NG", label: "No Goal" },
];

const ExactGoals: Selection[] = [
  { code: "0", label: "0 Goals" },
  { code: "1", label: "1 Goal" },
  { code: "2", label: "2 Goals" },
  { code: "3", label: "3 Goals" },
  { code: "4", label: "4 Goals" },
  { code: "5", label: "5 Goals" },
  { code: "6", label: "6 Goals" },
  { code: "7", label: "7 Goals" },
  { code: "8+", label: "8+ Goals" },
];

const GoalsBands: Selection[] = [
  { code: "0-1", label: "0–1 Goals" },
  { code: "2-3", label: "2–3 Goals" },
  { code: "4-5", label: "4–5 Goals" },
  { code: "6+",  label: "6+ Goals" },
];

// === Master dictionary ===
export const FootballMarkets: Record<string, MarketInfo> = {
  // ---- Exact bets (with ready-to-use selections) ----
  "1X2": {
    betType: BetType.EXACT,
    uiLabel: "Match Result (1X2)",
    selections: Result1X2,
  },
  "half_time_result": {
    betType: BetType.EXACT,
    uiLabel: "Half-Time Result",
    selections: HalfTimeResult,
  },
  "ht_ft": {
    betType: BetType.EXACT,
    uiLabel: "Half-Time / Full-Time",
    selections: HTFT9,
  },
  "correct_score": {
    betType: BetType.EXACT,
    uiLabel: "Correct Score",
    selections: genCorrectScore(5), // 0–5 grid + Any Other buckets
  },
  "winning_margin": {
    betType: BetType.EXACT,
    uiLabel: "Winning Margin",
    selections: WinningMargin,
  },
  "double_chance": {
    betType: BetType.EXACT,
    uiLabel: "Double Chance",
    selections: DoubleChance,
  },
  "exact_goals": {
    betType: BetType.EXACT,
    uiLabel: "Exact Total Goals",
    selections: ExactGoals,
  },
  "goals_band": {
    betType: BetType.EXACT,
    uiLabel: "Goals Range (Band)",
    selections: GoalsBands,
  },
  "first_team_to_score": {
    betType: BetType.EXACT,
    uiLabel: "First Team to Score",
    selections: FirstLastToScore,
  },
  "last_team_to_score": {
    betType: BetType.EXACT,
    uiLabel: "Last Team to Score",
    selections: FirstLastToScore,
  },

  // ---- Over/Under bets (values handled by line + Over/Under) ----
  "total_goals_over_under": { betType: BetType.OVER_UNDER, uiLabel: "Total Goals Over/Under" },
  "team_total_goals_over_under": { betType: BetType.OVER_UNDER, uiLabel: "Team Goals Over/Under" },
  "half_goals_over_under": { betType: BetType.OVER_UNDER, uiLabel: "Half-Time Goals Over/Under" },
  "corners_over_under": { betType: BetType.OVER_UNDER, uiLabel: "Corners Over/Under" },
  "cards_over_under": { betType: BetType.OVER_UNDER, uiLabel: "Cards / Booking Points Over/Under" },
  "shots_over_under": { betType: BetType.OVER_UNDER, uiLabel: "Shots Over/Under" },
  "shots_on_target_over_under": { betType: BetType.OVER_UNDER, uiLabel: "Shots on Target Over/Under" },
  "offsides_over_under": { betType: BetType.OVER_UNDER, uiLabel: "Offsides Over/Under" },
  "fouls_over_under": { betType: BetType.OVER_UNDER, uiLabel: "Fouls Over/Under" },

  // ---- Binary bets (Yes/No handled by side) ----
  "btts": { betType: BetType.BINARY, uiLabel: "Both Teams To Score" },
  "btts_first_half": { betType: BetType.BINARY, uiLabel: "BTTS in 1st Half" },
  "btts_second_half": { betType: BetType.BINARY, uiLabel: "BTTS in 2nd Half" },
  "goal_in_first_half": { betType: BetType.BINARY, uiLabel: "Goal in 1st Half" },
  "goal_in_second_half": { betType: BetType.BINARY, uiLabel: "Goal in 2nd Half" },
  "goal_in_first_10min": { betType: BetType.BINARY, uiLabel: "Goal in First 10 Minutes" },
  "both_halves_over_0_5": { betType: BetType.BINARY, uiLabel: "Over 0.5 Goals in Both Halves" },
  "penalty_awarded": { betType: BetType.BINARY, uiLabel: "Penalty Awarded" },
  "red_card": { betType: BetType.BINARY, uiLabel: "Red Card" },
  "clean_sheet": { betType: BetType.BINARY, uiLabel: "Clean Sheet" },
  "win_to_nil": { betType: BetType.BINARY, uiLabel: "Win to Nil" },
  "to_qualify": { betType: BetType.BINARY, uiLabel: "To Qualify" },
  "to_lift_trophy": { betType: BetType.BINARY, uiLabel: "To Lift Trophy" },
  "player_to_score_anytime": { betType: BetType.BINARY, uiLabel: "Player to Score Anytime" },
  "player_to_be_carded": { betType: BetType.BINARY, uiLabel: "Player to be Carded" },
  "player_offside": { betType: BetType.BINARY, uiLabel: "Player Offside" },

  // ---- Handicap bets (values handled by line ±y.5 etc.) ----
  "asian_handicap": { betType: BetType.HANDICAP, uiLabel: "Asian Handicap" },
  "asian_handicap_whole_line": { betType: BetType.HANDICAP, uiLabel: "Asian Handicap (Whole Line)" },
  "asian_handicap_quarter_line": { betType: BetType.HANDICAP, uiLabel: "Asian Handicap (Quarter Line)" },
};
