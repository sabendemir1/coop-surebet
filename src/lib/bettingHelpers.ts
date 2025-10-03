import { AnyBet, BetType, Concern, Period } from "@/types/betting";

export function getBetDisplayLabel(bet: AnyBet): string {
  const teams = `${bet.teamHome} vs ${bet.teamAway}`;
  const period = bet.period === Period.FT ? "Full Time" : bet.period;
  
  switch (bet.marketType) {
    case BetType.OVER_UNDER: {
      const concern = bet.concern === Concern.TOTAL ? "" : ` (${bet.concern})`;
      return `${bet.metric} ${bet.side} ${bet.line}${concern} - ${period}`;
    }
    case BetType.BINARY: {
      const concern = bet.concern === Concern.TOTAL ? "" : ` (${bet.concern})`;
      return `${bet.metric} ${bet.side}${concern} - ${period}`;
    }
    case BetType.HANDICAP: {
      const sign = bet.line >= 0 ? "+" : "";
      return `${bet.concern} ${sign}${bet.line} - ${period}`;
    }
    case BetType.EXACT: {
      return `${bet.marketKey} - ${bet.selectionCode} - ${period}`;
    }
    default: {
      const exhaustiveCheck: never = bet;
      return `Unknown - ${period}`;
    }
  }
}

export function getBetShortLabel(bet: AnyBet): string {
  switch (bet.marketType) {
    case BetType.OVER_UNDER:
      return `${bet.side} ${bet.line}`;
    case BetType.BINARY:
      return bet.side;
    case BetType.HANDICAP: {
      const sign = bet.line >= 0 ? "+" : "";
      return `${bet.concern} ${sign}${bet.line}`;
    }
    case BetType.EXACT:
      return bet.selectionCode;
    default: {
      const exhaustiveCheck: never = bet;
      return "Unknown";
    }
  }
}

export function formatMetric(metric: string): string {
  return metric
    .split("_")
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatConcern(concern: Concern): string {
  if (concern === Concern.TOTAL) return "Total";
  return concern.charAt(0) + concern.slice(1).toLowerCase();
}

export function formatPeriod(period: Period): string {
  const periodMap: Record<Period, string> = {
    [Period.FT]: "Full Time",
    [Period.H1]: "1st Half",
    [Period.H2]: "2nd Half",
    [Period.ET]: "Extra Time"
  };
  return periodMap[period];
}
