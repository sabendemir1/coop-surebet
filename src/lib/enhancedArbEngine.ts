// Enhanced Arbitrage Engine - Combining Rule-Based + AI-Ready Detection
import { AnyBet, BetBase, BetType, Concern, Period } from "@/types/betting";
import { ArbOpportunity, classifyOpposites } from "./arbEngine";

// ========= AI-Ready Bet Fingerprinting =========

/**
 * Creates a semantic fingerprint for AI/NLP processing
 * Format: "SPORT.PERIOD.CONCERN.METRIC[.PLAYER][.WINDOW][.LINE][.SELECTION]"
 * Examples:
 * - "FOOTBALL.FT.TOTAL.GOALS.OVER.2.5"
 * - "FOOTBALL.1H.PLAYER.GOALS.Messi.YES" 
 * - "FOOTBALL.FT.HOME.RESULT.1"
 */
export function createBetFingerprint(bet: AnyBet): string {
  const base = `${bet.sport}.${bet.period}.${bet.concern}.${bet.metric}`;
  
  switch (bet.marketType) {
    case BetType.OVER_UNDER:
      return `${base}.${bet.side}.${bet.line}`;
      
    case BetType.BINARY:
      const player = bet.playerName ? `.${bet.playerName}` : "";
      const window = bet.window ? `.${bet.window.startMin}-${bet.window.endMin}min` : "";
      return `${base}${player}${window}.${bet.side}`;
      
    case BetType.HANDICAP:
      const sign = bet.line >= 0 ? "+" : "";
      return `${base}.${sign}${bet.line}`;
      
    case BetType.EXACT:
      return `${base}.${bet.marketKey}.${bet.selectionCode}`;
  }
}

/**
 * Extracts semantic features for ML/NLP processing
 */
export function extractBetFeatures(bet: AnyBet) {
  return {
    // Core identifiers
    sport: bet.sport,
    league: bet.league,
    teams: [bet.teamHome, bet.teamAway],
    period: bet.period,
    concern: bet.concern,
    metric: bet.metric,
    
    // Market specifics
    marketType: bet.marketType,
    bookmaker: bet.bookmaker,
    odds: bet.price,
    
    // Type-specific features
    ...(bet.marketType === BetType.OVER_UNDER && {
      line: bet.line,
      side: bet.side,
      threshold: bet.line
    }),
    
    ...(bet.marketType === BetType.BINARY && {
      binary: bet.side,
      player: bet.playerName,
      timeWindow: bet.window ? `${bet.window.startMin}-${bet.window.endMin}` : null,
      isPlayerBet: !!bet.playerName,
      isTimedBet: !!bet.window
    }),
    
    ...(bet.marketType === BetType.HANDICAP && {
      handicap: bet.line,
      isAsianHandicap: Math.abs(bet.line % 1 - 0.5) < 0.01 // detect .5 lines
    }),
    
    ...(bet.marketType === BetType.EXACT && {
      market: bet.marketKey,
      selection: bet.selectionCode,
      isResultBet: bet.metric.includes("RESULT"),
      isScoreBet: bet.marketKey === "correct_score"
    }),
    
    // Semantic tags for AI processing
    fingerprint: createBetFingerprint(bet)
  };
}

// ========= Pattern-Based Arbitrage Detection =========

/**
 * Rule-based patterns for common arbitrage scenarios
 */
export const ARBITRAGE_PATTERNS = {
  // Over/Under complements
  OVER_UNDER_COMPLEMENT: {
    name: "Over/Under Complement",
    description: "Same line, opposite sides",
    pattern: (a: AnyBet, b: AnyBet) => {
      if (a.marketType !== BetType.OVER_UNDER || b.marketType !== BetType.OVER_UNDER) return null;
      const fa = extractBetFeatures(a), fb = extractBetFeatures(b);
      return fa.line === fb.line && fa.side !== fb.side && 
             fa.sport === fb.sport && fa.period === fb.period && 
             fa.concern === fb.concern && fa.metric === fb.metric;
    }
  },
  
  // Binary Yes/No complements
  BINARY_COMPLEMENT: {
    name: "Yes/No Complement", 
    description: "Same event, opposite binary outcomes",
    pattern: (a: AnyBet, b: AnyBet) => {
      if (a.marketType !== BetType.BINARY || b.marketType !== BetType.BINARY) return null;
      const fa = extractBetFeatures(a), fb = extractBetFeatures(b);
      return fa.binary !== fb.binary &&
             fa.player === fb.player &&
             fa.timeWindow === fb.timeWindow &&
             fa.sport === fb.sport && fa.period === fb.period &&
             fa.concern === fb.concern && fa.metric === fb.metric;
    }
  },
  
  // 1X2 vs Double Chance coverage
  RESULT_COVERAGE: {
    name: "Result Coverage",
    description: "1X2 outcome covered by Double Chance",
    pattern: (a: AnyBet, b: AnyBet) => {
      if (a.marketType !== BetType.EXACT || b.marketType !== BetType.EXACT) return null;
      const fa = extractBetFeatures(a), fb = extractBetFeatures(b);
      
      const coverage = [
        { single: "1", double: "X2" },
        { single: "X", double: "12" }, 
        { single: "2", double: "1X" }
      ];
      
      return coverage.some(c => 
        (fa.market === "1X2" && fa.selection === c.single && fb.market === "double_chance" && fb.selection === c.double) ||
        (fb.market === "1X2" && fb.selection === c.single && fa.market === "double_chance" && fa.selection === c.double)
      );
    }
  }
};

// ========= Enhanced Arbitrage Finder =========

export class EnhancedArbFinder {
  private bets: AnyBet[] = [];
  private opportunities: ArbOpportunity[] = [];
  
  addBet(bet: AnyBet) {
    this.bets.push(bet);
  }
  
  addBets(bets: AnyBet[]) {
    this.bets.push(...bets);
  }
  
  /**
   * Rule-based arbitrage detection using existing engine
   */
  findRuleBasedArbitrages(): ArbOpportunity[] {
    const arbs: ArbOpportunity[] = [];
    
    for (let i = 0; i < this.bets.length; i++) {
      for (let j = i + 1; j < this.bets.length; j++) {
        try {
          const arb = new ArbOpportunity(this.bets[i], this.bets[j]);
          if (arb.exists()) {
            arbs.push(arb);
          }
        } catch (e) {
          // Not an opposite pair, continue
        }
      }
    }
    
    return arbs;
  }
  
  /**
   * Pattern-based detection for AI preprocessing
   */
  findPatternBasedArbitrages(): Array<{
    betA: AnyBet;
    betB: AnyBet; 
    pattern: string;
    features: any;
    confidence: number;
  }> {
    const results = [];
    
    for (let i = 0; i < this.bets.length; i++) {
      for (let j = i + 1; j < this.bets.length; j++) {
        const betA = this.bets[i];
        const betB = this.bets[j];
        
        // Check each pattern
        for (const [key, pattern] of Object.entries(ARBITRAGE_PATTERNS)) {
          if (pattern.pattern(betA, betB)) {
            const edge = 1 - (1/betA.price + 1/betB.price);
            if (edge > 0) {
              results.push({
                betA,
                betB,
                pattern: pattern.name,
                features: {
                  edge,
                  fingerprintA: createBetFingerprint(betA),
                  fingerprintB: createBetFingerprint(betB),
                  featuresA: extractBetFeatures(betA),
                  featuresB: extractBetFeatures(betB)
                },
                confidence: this.calculateConfidence(betA, betB, edge)
              });
            }
          }
        }
      }
    }
    
    return results.sort((a, b) => b.confidence - a.confidence);
  }
  
  /**
   * AI-ready feature extraction for all bets
   */
  extractAllFeatures() {
    return this.bets.map(bet => ({
      bet,
      features: extractBetFeatures(bet),
      fingerprint: createBetFingerprint(bet)
    }));
  }
  
  /**
   * Group bets by semantic similarity for AI clustering
   */
  groupBySimilarity() {
    const groups: { [key: string]: AnyBet[] } = {};
    
    this.bets.forEach(bet => {
      // Group by base event context
      const key = `${bet.sport}.${bet.gameId}.${bet.period}.${bet.concern}.${bet.metric}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(bet);
    });
    
    return groups;
  }
  
  private calculateConfidence(betA: AnyBet, betB: AnyBet, edge: number): number {
    let confidence = edge * 100; // Base confidence from edge
    
    // Boost confidence for same bookmaker (less likely to be error)
    if (betA.bookmaker === betB.bookmaker) confidence *= 0.8;
    
    // Boost for established patterns
    const classification = classifyOpposites(betA, betB);
    if (classification.ok) confidence += 20;
    
    // Boost for liquid markets (Over/Under, 1X2)
    if (betA.marketType === BetType.OVER_UNDER || betA.marketType === BetType.EXACT) {
      confidence += 10;
    }
    
    return Math.min(confidence, 100);
  }
}

// ========= AI Integration Helpers =========

/**
 * Convert bet to natural language for LLM processing
 */
export function betToNaturalLanguage(bet: AnyBet): string {
  const teams = `${bet.teamHome} vs ${bet.teamAway}`;
  const period = bet.period === Period.FT ? "Full Time" : 
                bet.period === Period.H1 ? "First Half" : 
                bet.period === Period.H2 ? "Second Half" : "Extra Time";
  
  switch (bet.marketType) {
    case BetType.OVER_UNDER:
      const entity = bet.concern === Concern.TOTAL ? "Total" :
                    bet.concern === Concern.HOME ? bet.teamHome :
                    bet.concern === Concern.AWAY ? bet.teamAway : "Player";
      return `${teams} - ${period}: ${entity} ${bet.metric} ${bet.side} ${bet.line} @ ${bet.price}`;
      
    case BetType.BINARY:
      const subject = bet.playerName ? bet.playerName : 
                     bet.concern === Concern.HOME ? bet.teamHome :
                     bet.concern === Concern.AWAY ? bet.teamAway : "Team";
      const timeStr = bet.window ? ` in minutes ${bet.window.startMin}-${bet.window.endMin}` : "";
      return `${teams} - ${period}: ${subject} to ${bet.metric}${timeStr} ${bet.side} @ ${bet.price}`;
      
    case BetType.HANDICAP:
      const team = bet.concern === Concern.HOME ? bet.teamHome : bet.teamAway;
      const sign = bet.line >= 0 ? "+" : "";
      return `${teams} - ${period}: ${team} ${sign}${bet.line} Handicap @ ${bet.price}`;
      
    case BetType.EXACT:
      return `${teams} - ${period}: ${bet.marketKey} ${bet.selectionCode} @ ${bet.price}`;
  }
}

/**
 * Prepare arbitrage data for AI analysis
 */
export function prepareForAI(finder: EnhancedArbFinder) {
  return {
    bets: finder.extractAllFeatures(),
    groups: finder.groupBySimilarity(),
    ruleBasedArbs: finder.findRuleBasedArbitrages().map(arb => ({
      arbDetails: arb,
      naturalLanguage: {
        betA: betToNaturalLanguage(arb.a),
        betB: betToNaturalLanguage(arb.b),
        explanation: arb.reason
      }
    })),
    patternBasedArbs: finder.findPatternBasedArbitrages()
  };
}