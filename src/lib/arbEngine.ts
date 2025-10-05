// ========= Utilities =========
import { AnyBet, BetBase, BetType, Concern, HandicapBet, OverUnderBet, YesNoBet, ExactBet, Odds } from "@/types/betting";

const FLOAT_EPS = 1e-9;
const eqNum = (a: number, b: number, eps = FLOAT_EPS) => Math.abs(a - b) < eps;

const sameBaseEvent = (a: BetBase, b: BetBase) =>
  a.sport === b.sport &&
  a.league === b.league &&
  a.gameId === b.gameId &&
  a.period === b.period &&
  a.concern === b.concern &&
  a.metric === b.metric &&
  (a.settlementScope ?? "REGULATION") === (b.settlementScope ?? "REGULATION");

// For Binary w/ windowed props (e.g., first 10 minutes).
const sameWindow = (aw?: {startMin:number; endMin:number}, bw?: {startMin:number; endMin:number}) =>
  (!aw && !bw) || (!!aw && !!bw && aw.startMin === bw.startMin && aw.endMin === bw.endMin);

// For Binary w/ player-specific props (e.g., player to score).
const samePlayer = (aPlayer?: string, bPlayer?: string) =>
  (!aPlayer && !bPlayer) || (!!aPlayer && !!bPlayer && aPlayer === bPlayer);

// ========= Opposite / Complement rules =========

// Over/Under: same market, same concern, same period, same line; sides opposite
const isOppositeOverUnder = (a: AnyBet, b: AnyBet): { ok: boolean; reason?: string } => {
  if (a.marketType !== BetType.OVER_UNDER || b.marketType !== BetType.OVER_UNDER) return { ok: false };
  const A = a as OverUnderBet, B = b as OverUnderBet;
  if (!sameBaseEvent(A, B)) return { ok: false };
  if (!eqNum(A.line, B.line)) return { ok: false };
  if (A.side === B.side) return { ok: false };
  return { ok: true, reason: `OU complement: ${A.side} ${A.line} ↔ ${B.side} ${B.line}` };
};

// Binary: same market/concern/period/(window)/(player), sides Yes/No
const isOppositeBinary = (a: AnyBet, b: AnyBet): { ok: boolean; reason?: string } => {
  if (a.marketType !== BetType.BINARY || b.marketType !== BetType.BINARY) return { ok: false };
  const A = a as YesNoBet, B = b as YesNoBet;
  if (!sameBaseEvent(A, B)) return { ok: false };
  if (!sameWindow(A.window, B.window)) return { ok: false };
  if (!samePlayer(A.playerName, B.playerName)) return { ok: false };
  if (A.side === B.side) return { ok: false };
  
  const playerInfo = A.playerName ? ` (${A.playerName})` : "";
  const windowInfo = A.window ? ` [${A.window.startMin}-${A.window.endMin}min]` : "";
  return { ok: true, reason: `YN complement: ${A.side} ↔ ${B.side}${playerInfo}${windowInfo}` };
};

// Handicap: same event, HOME line == -(AWAY line). Accept ±(n + 0.5)
const isOppositeHandicap = (a: AnyBet, b: AnyBet): { ok: boolean; reason?: string } => {
  if (a.marketType !== BetType.HANDICAP || b.marketType !== BetType.HANDICAP) return { ok: false };
  const A = a as HandicapBet, B = b as HandicapBet;
  if (!sameBaseEvent(A, B)) return { ok: false };
  const concernsOpp = (A.concern === Concern.HOME && B.concern === Concern.AWAY) ||
                      (A.concern === Concern.AWAY && B.concern === Concern.HOME);
  if (!concernsOpp) return { ok: false };
  if (!eqNum(A.line, -B.line)) return { ok: false };
  // Encourage half-lines (no push); allow others if you handle settlement elsewhere.
  return { ok: true, reason: `AH complement: ${A.concern} ${A.line} ↔ ${B.concern} ${B.line}` };
};

// Exact cross-market: 1X2 ↔ Double Chance complements via FT_RESULT space
// Pairs that fully cover 1X2 with 2 tickets:
//   1 with X2  |  X with 12  |  2 with 1X
const isExact1X2DoubleChanceCover = (a: AnyBet, b: AnyBet): { ok: boolean; reason?: string } => {
  if (a.marketType !== BetType.EXACT || b.marketType !== BetType.EXACT) return { ok: false };

  const A = a as ExactBet, B = b as ExactBet;
  // Must be the same base FT event (period FT, concern TOTAL, metric FT_RESULT-like)
  if (!sameBaseEvent(A, B)) return { ok: false };

  const pair = (x: string, y: string) => (A.marketKey === "1X2" && A.selectionCode === x && B.marketKey === "double_chance" && B.selectionCode === y)
                                       || (B.marketKey === "1X2" && B.selectionCode === x && A.marketKey === "double_chance" && A.selectionCode === y);

  if (pair("1","X2")) return { ok: true, reason: "Coverage: 1 (Home) + X2 (Draw/Away)" };
  if (pair("X","12")) return { ok: true, reason: "Coverage: X (Draw) + 12 (Home/Away)" };
  if (pair("2","1X")) return { ok: true, reason: "Coverage: 2 (Away) + 1X (Home/Draw)" };

  return { ok: false };
};

// Master dispatcher
export const classifyOpposites = (a: AnyBet, b: AnyBet): { ok: boolean; kind?: "OU"|"YN"|"AH"|"EXACT_COVER"; reason?: string } => {
  let res = isOppositeOverUnder(a,b);
  if (res.ok) return { ok:true, kind:"OU", reason:res.reason };

  res = isOppositeBinary(a,b);
  if (res.ok) return { ok:true, kind:"YN", reason:res.reason };

  res = isOppositeHandicap(a,b);
  if (res.ok) return { ok:true, kind:"AH", reason:res.reason };

  const ex = isExact1X2DoubleChanceCover(a,b);
  if (ex.ok) return { ok:true, kind:"EXACT_COVER", reason:ex.reason };

  return { ok:false };
};

// ========= Arb math (2-leg) =========

// Exists if 1/oddsA + 1/oddsB < 1 (pure 2-outcome complement) or
// for EXACT_COVER pairs (1X2+DC) the same formula applies because they cover the whole space.
export const arbEdge = (oa: Odds, ob: Odds) => 1 - (1/oa + 1/ob); // >0 means positive edge

// Stakes for a desired net profit P across outcomes
export function stakesForTargetProfit(oddsA: Odds, oddsB: Odds, targetProfit: number) {
  // Solve for SA and SB s.t. outcomeA profit = outcomeB profit = targetProfit
  // Profit if A wins: SA*(oddsA-1) - SB
  // Profit if B wins: SB*(oddsB-1) - SA
  // Set both = targetProfit and solve:
  const SA = (targetProfit * (oddsB)) / (oddsA + oddsB - 2);
  const SB = (targetProfit * (oddsA)) / (oddsA + oddsB - 2);
  return { stakeA: SA, stakeB: SB };
}

// Stakes that spend a given bankroll and maximize min-outcome profit
export function stakesForBankroll(oddsA: Odds, oddsB: Odds, bankroll: number) {
  // Optimal split proportionally to (oddsB-1) and (oddsA-1)
  const a = (oddsB - 1), b = (oddsA - 1);
  const stakeA = bankroll * a / (a + b);
  const stakeB = bankroll - stakeA;
  // Compute guaranteed profits
  const profitIfA = stakeA * (oddsA - 1) - stakeB;
  const profitIfB = stakeB * (oddsB - 1) - stakeA;
  const minProfit = Math.min(profitIfA, profitIfB);
  return { stakeA, stakeB, profitIfA, profitIfB, minProfit };
}

// ========= ArbOpportunity =========
export class ArbOpportunity {
  readonly a: AnyBet;
  readonly b: AnyBet;
  readonly kind: "OU"|"YN"|"AH"|"EXACT_COVER";
  readonly reason: string;
  readonly edge: number; // 1 - (1/oa + 1/ob)

  constructor(a: AnyBet, b: AnyBet) {
    // Quick universal sanity checks (same game)
    if (a.sport !== b.sport) throw new Error("Different sports");
    if (a.gameId !== b.gameId) throw new Error("Different games");
    if (a.period !== b.period) throw new Error("Different periods");
    // NOTE: concern/metric equivalence is enforced by the per-type matchers below

    const res = classifyOpposites(a,b);
    if (!res.ok) throw new Error("Not an opposite/complementary pair");
    this.a = a; this.b = b;
    this.kind = res.kind!;
    this.reason = res.reason ?? "";

    // Arb edge (two outcomes fully covering the event space)
    this.edge = arbEdge(a.price, b.price);
  }

  exists(): boolean {
    return this.edge > 0;
  }

  stakesFor(targetProfit: number) {
    return stakesForTargetProfit(this.a.price, this.b.price, targetProfit);
  }

  stakesForBankroll(bankroll: number) {
    return stakesForBankroll(this.a.price, this.b.price, bankroll);
  }

  // Convenience: show outcome-wise profits for a given stake split
  profitForStakes(stakeA: number, stakeB: number) {
    const pA = stakeA * (this.a.price - 1) - stakeB;
    const pB = stakeB * (this.b.price - 1) - stakeA;
    return { profitIfA: pA, profitIfB: pB, minProfit: Math.min(pA,pB) };
  }
}
