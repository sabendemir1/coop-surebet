// lib/bettingHelpers.ts
import { BetSelection, Entity, MatchInfo, Outcome } from "@/types/betting";

export function resolveEntityPrefix(entity: Entity, match: MatchInfo): string {
  switch (entity.type) {
    case "home": return match.home.name ?? "Home";
    case "away": return match.away.name ?? "Away";
    case "team":
      // if you store team id => name map elsewhere, resolve here
      return "Team";
    case "player":
      return "Player";
    default:
      return ""; // global
  }
}

// Build friendly outcome labels (e.g., append line and entity context)
export function buildOutcomeLabels(sel: BetSelection): Outcome[] {
  const { market, entity, match } = sel;
  const prefix = resolveEntityPrefix(entity, match);
  const line = market.params?.line;

  return sel.outcomes.map((o) => {
    // Base label from outcome
    let label = o.label;

    // Append line when it makes sense
    if (typeof line === "number") {
      // Examples: Over 2.5, Under 2.0, Home -1, Away +0.25
      if (/over|under/i.test(o.key) || /over|under/i.test(o.label)) {
        label = `${o.key.toLowerCase() === "over" ? "Over" : "Under"} ${line}`;
      } else if (market.id.includes("handicap") || /handicap/i.test(market.name)) {
        // For handicap markets, show signed line on the side being backed
        if (o.key === "team" || o.key === "home") label = `${prefix || "Team"} ${formatSigned(line)}`;
        else if (o.key === "opp" || o.key === "away") label = `${prefixOpposite(entity, match)} ${formatSigned(-line)}`;
        else if (o.key === "draw_hcap") label = "Draw (Handicap)";
      }
    }

    // Add entity context for team-scoped totals
    if (prefix && (market.id.includes("team_total") || market.name.toLowerCase().includes("team total"))) {
      // e.g., Over 1.5 (Home FC)
      label = `${label} (${prefix})`;
    }

    return { ...o, label };
  });
}

function prefixOpposite(entity: Entity, match: MatchInfo): string {
  if (entity.type === "home") return match.away.name ?? "Away";
  if (entity.type === "away") return match.home.name ?? "Home";
  return "Opposition";
}

function formatSigned(n: number): string {
  return (n >= 0 ? `+${n}` : `${n}`);
}
