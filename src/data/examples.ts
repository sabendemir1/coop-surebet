// data/examples.ts
import { BetSelection } from "@/types/betting";

export const exTotalGoalsOU: BetSelection = {
  sport: "football",
  match: {
    id: "match_123",
    home: { id: "t_h", name: "Home FC" },
    away: { id: "t_a", name: "Away United" },
    start_date: "2025-10-12T19:00:00Z",
    end_date: "2025-10-12T21:00:00Z",
    timezone: "Europe/London",
    competition: "Premier League"
  },
  entity: { type: "global", ref: null },
  market: {
    id: "total_goals_ou",
    name: "Total Goals Over/Under",
    params: { line: 2.5, interval: { period: "match" }, includes_et: false }
  },
  outcomes: [
    { key: "over", label: "Over", price: 1.85 },
    { key: "under", label: "Under", price: 1.95 }
  ]
};

export const exHomeTeamTotalsIntLine: BetSelection = {
  sport: "football",
  match: {
    id: "match_123",
    home: { id: "t_h", name: "Home FC" },
    away: { id: "t_a", name: "Away United" },
    start_date: "2025-10-12T19:00:00Z"
  },
  entity: { type: "home", ref: null },
  market: {
    id: "team_total_goals_ou",
    name: "Team Total Goals O/U",
    params: { line: 2.0 }
  },
  outcomes: [
    { key: "over", label: "Over", price: 2.10 },
    { key: "under", label: "Under", price: 1.72 }
  ]
};

export const exAsianHandicapHome: BetSelection = {
  sport: "football",
  match: {
    id: "match_123",
    home: { id: "t_h", name: "Home FC" },
    away: { id: "t_a", name: "Away United" },
    start_date: "2025-10-12T19:00:00Z"
  },
  entity: { type: "home", ref: null },
  market: {
    id: "asian_handicap",
    name: "Asian Handicap",
    params: { line: -0.25 }
  },
  outcomes: [
    { key: "team", label: "Home", price: 1.90 },
    { key: "opp", label: "Away", price: 1.90 }
  ]
};
