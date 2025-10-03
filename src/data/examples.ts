import { AnyBet, BetType, Period, Concern } from "@/types/betting";

const now = new Date();

export const exOverUnderTotal: AnyBet = {
  id: "bet_1",
  sport: "FOOTBALL",
  league: "Premier League",
  gameId: "match_123",
  teamHome: "Manchester United",
  teamAway: "Liverpool",
  bookmaker: "Bet365",
  period: Period.FT,
  concern: Concern.TOTAL,
  metric: "GOALS",
  marketType: BetType.OVER_UNDER,
  line: 2.5,
  side: "OVER",
  price: 1.95,
  createdAt: now,
  updatedAt: now
};

export const exOverUnderHome: AnyBet = {
  id: "bet_2",
  sport: "FOOTBALL",
  league: "Premier League",
  gameId: "match_123",
  teamHome: "Manchester United",
  teamAway: "Liverpool",
  bookmaker: "Betfair",
  period: Period.FT,
  concern: Concern.HOME,
  metric: "GOALS",
  marketType: BetType.OVER_UNDER,
  line: 1.5,
  side: "OVER",
  price: 2.10,
  createdAt: now,
  updatedAt: now
};

export const exHandicapHome: AnyBet = {
  id: "bet_3",
  sport: "FOOTBALL",
  league: "Premier League",
  gameId: "match_123",
  teamHome: "Manchester United",
  teamAway: "Liverpool",
  bookmaker: "William Hill",
  period: Period.FT,
  concern: Concern.HOME,
  metric: "GOALS",
  marketType: BetType.HANDICAP,
  line: -0.5,
  price: 1.85,
  createdAt: now,
  updatedAt: now
};

export const exBinaryBTTS: AnyBet = {
  id: "bet_4",
  sport: "FOOTBALL",
  league: "Premier League",
  gameId: "match_123",
  teamHome: "Manchester United",
  teamAway: "Liverpool",
  bookmaker: "Unibet",
  period: Period.FT,
  concern: Concern.TOTAL,
  metric: "BTTS",
  marketType: BetType.BINARY,
  side: "YES",
  price: 1.75,
  createdAt: now,
  updatedAt: now
};

export const exExact1X2: AnyBet = {
  id: "bet_5",
  sport: "FOOTBALL",
  league: "Premier League",
  gameId: "match_123",
  teamHome: "Manchester United",
  teamAway: "Liverpool",
  bookmaker: "Bwin",
  period: Period.FT,
  concern: Concern.TOTAL,
  metric: "FT_RESULT",
  marketType: BetType.EXACT,
  marketKey: "1X2",
  selectionCode: "1",
  price: 2.50,
  createdAt: now,
  updatedAt: now
};

export const exExactDoubleChance: AnyBet = {
  id: "bet_6",
  sport: "FOOTBALL",
  league: "Premier League",
  gameId: "match_123",
  teamHome: "Manchester United",
  teamAway: "Liverpool",
  bookmaker: "Ladbrokes",
  period: Period.FT,
  concern: Concern.TOTAL,
  metric: "FT_RESULT",
  marketType: BetType.EXACT,
  marketKey: "double_chance",
  selectionCode: "X2",
  price: 1.40,
  createdAt: now,
  updatedAt: now
};

export const allExamples: AnyBet[] = [
  exOverUnderTotal,
  exOverUnderHome,
  exHandicapHome,
  exBinaryBTTS,
  exExact1X2,
  exExactDoubleChance
];
