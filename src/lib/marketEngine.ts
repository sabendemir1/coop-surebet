// lib/marketEngine.ts
import { Outcome, BetSelection } from "@/types/betting";

export function generateOutcomes(sel: BetSelection): Outcome[] {
  const id = sel.market.id;

  if (id.endsWith("_ou")) return [
    { key: "over", label: "Over" },
    { key: "under", label: "Under" },
  ];

  if (id === "asian_handicap") return [
    { key: "team", label: sel.entity.type === "home" ? "Home" : sel.entity.type === "away" ? "Away" : "Team" },
    { key: "opp",  label: sel.entity.type === "home" ? "Away" : sel.entity.type === "away" ? "Home" : "Opposition" },
  ];

  if (id === "handicap" || id === "euro_handicap") return [
    { key: "team", label: "Team" },
    { key: "draw_hcap", label: "Draw (Handicap)" },
    { key: "opp", label: "Opposition" },
  ];

  if (id === "ft_1x2") return [
    { key: "home", label: "Home" },
    { key: "draw", label: "Draw" },
    { key: "away", label: "Away" },
  ];

  // default fallback
  return sel.outcomes.length ? sel.outcomes : [{ key: "yes", label: "Yes" }, { key: "no", label: "No" }];
}
