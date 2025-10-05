// Demonstration of Enhanced Arbitrage Detection
import { BetType, Period, Concern, AnyBet } from "@/types/betting";
import { EnhancedArbFinder, createBetFingerprint, extractBetFeatures, betToNaturalLanguage, prepareForAI } from "./enhancedArbEngine";

// ========= Sample Data for Testing =========

const sampleBets: AnyBet[] = [
  // Over/Under Arbitrage Opportunity
  {
    id: "bet1",
    sport: "FOOTBALL" as const,
    league: "Premier League",
    gameId: "MUN_vs_LIV_20251004",
    teamHome: "Manchester United",
    teamAway: "Liverpool",
    bookmaker: "Bet365",
    period: Period.FT,
    concern: Concern.TOTAL,
    metric: "GOALS",
    price: 1.90,
    marketType: BetType.OVER_UNDER,
    line: 2.5,
    side: "OVER",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "bet2", 
    sport: "FOOTBALL" as const,
    league: "Premier League",
    gameId: "MUN_vs_LIV_20251004",
    teamHome: "Manchester United",
    teamAway: "Liverpool", 
    bookmaker: "William Hill",
    period: Period.FT,
    concern: Concern.TOTAL,
    metric: "GOALS",
    price: 2.10,
    marketType: BetType.OVER_UNDER,
    line: 2.5,
    side: "UNDER",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Binary Player Bet Arbitrage
  {
    id: "bet3",
    sport: "FOOTBALL" as const,
    league: "Premier League", 
    gameId: "MUN_vs_LIV_20251004",
    teamHome: "Manchester United",
    teamAway: "Liverpool",
    bookmaker: "Paddy Power",
    period: Period.FT,
    concern: Concern.PLAYER,
    metric: "GOALS",
    price: 2.20,
    marketType: BetType.BINARY,
    side: "YES",
    playerName: "Marcus Rashford",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "bet4",
    sport: "FOOTBALL" as const,
    league: "Premier League",
    gameId: "MUN_vs_LIV_20251004", 
    teamHome: "Manchester United",
    teamAway: "Liverpool",
    bookmaker: "Betfair",
    period: Period.FT,
    concern: Concern.PLAYER,
    metric: "GOALS",
    price: 1.85,
    marketType: BetType.BINARY,
    side: "NO",
    playerName: "Marcus Rashford",
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 1X2 vs Double Chance Coverage
  {
    id: "bet5",
    sport: "FOOTBALL" as const,
    league: "Premier League",
    gameId: "MUN_vs_LIV_20251004",
    teamHome: "Manchester United", 
    teamAway: "Liverpool",
    bookmaker: "Ladbrokes",
    period: Period.FT,
    concern: Concern.TOTAL,
    metric: "FT_RESULT",
    price: 3.20,
    marketType: BetType.EXACT,
    marketKey: "1X2",
    selectionCode: "1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "bet6",
    sport: "FOOTBALL" as const,
    league: "Premier League",
    gameId: "MUN_vs_LIV_20251004",
    teamHome: "Manchester United",
    teamAway: "Liverpool",
    bookmaker: "Coral",
    period: Period.FT,
    concern: Concern.TOTAL,
    metric: "FT_RESULT", 
    price: 1.40,
    marketType: BetType.EXACT,
    marketKey: "double_chance",
    selectionCode: "X2",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// ========= Demonstration Functions =========

export function demonstrateRuleBasedDetection() {
  console.log("=== RULE-BASED ARBITRAGE DETECTION ===\n");
  
  const finder = new EnhancedArbFinder();
  finder.addBets(sampleBets);
  
  const ruleBasedArbs = finder.findRuleBasedArbitrages();
  
  ruleBasedArbs.forEach((arb, i) => {
    console.log(`Arbitrage ${i + 1}:`);
    console.log(`Type: ${arb.kind}`);
    console.log(`Reason: ${arb.reason}`);
    console.log(`Edge: ${(arb.edge * 100).toFixed(2)}%`);
    console.log(`Bet A: ${betToNaturalLanguage(arb.a)}`);
    console.log(`Bet B: ${betToNaturalLanguage(arb.b)}`);
    
    const stakes = arb.stakesForBankroll(1000);
    console.log(`Stakes for £1000: A=${stakes.stakeA.toFixed(2)}, B=${stakes.stakeB.toFixed(2)}`);
    console.log(`Guaranteed profit: £${stakes.minProfit.toFixed(2)}\n`);
  });
}

export function demonstratePatternBasedDetection() {
  console.log("=== PATTERN-BASED ARBITRAGE DETECTION ===\n");
  
  const finder = new EnhancedArbFinder();
  finder.addBets(sampleBets);
  
  const patternArbs = finder.findPatternBasedArbitrages();
  
  patternArbs.forEach((arb, i) => {
    console.log(`Pattern Match ${i + 1}:`);
    console.log(`Pattern: ${arb.pattern}`);
    console.log(`Confidence: ${arb.confidence.toFixed(1)}%`);
    console.log(`Edge: ${(arb.features.edge * 100).toFixed(2)}%`);
    console.log(`Fingerprint A: ${arb.features.fingerprintA}`);
    console.log(`Fingerprint B: ${arb.features.fingerprintB}`);
    console.log(`Natural Language A: ${betToNaturalLanguage(arb.betA)}`);
    console.log(`Natural Language B: ${betToNaturalLanguage(arb.betB)}\n`);
  });
}

export function demonstrateBetFingerprinting() {
  console.log("=== BET FINGERPRINTING FOR AI ===\n");
  
  sampleBets.forEach((bet, i) => {
    console.log(`Bet ${i + 1}:`);
    console.log(`Fingerprint: ${createBetFingerprint(bet)}`);
    console.log(`Natural Language: ${betToNaturalLanguage(bet)}`);
    
    const features = extractBetFeatures(bet);
    console.log(`Key Features:`, {
      marketType: features.marketType,
      ...(features.line && { line: features.line, side: features.side }),
      ...(features.player && { player: features.player }),
      ...(features.timeWindow && { timeWindow: features.timeWindow }),
      ...(features.selection && { market: features.market, selection: features.selection })
    });
    console.log();
  });
}

export function demonstrateAIDataPreparation() {
  console.log("=== AI-READY DATA PREPARATION ===\n");
  
  const finder = new EnhancedArbFinder();
  finder.addBets(sampleBets);
  
  const aiData = prepareForAI(finder);
  
  console.log("Bet Groups by Similarity:");
  Object.entries(aiData.groups).forEach(([key, bets]) => {
    console.log(`${key}: ${bets.length} bets`);
  });
  
  console.log("\nRule-Based Arbitrages with Natural Language:");
  aiData.ruleBasedArbs.forEach((arb, i) => {
    console.log(`${i + 1}. ${arb.naturalLanguage.explanation}`);
    console.log(`   A: ${arb.naturalLanguage.betA}`);
    console.log(`   B: ${arb.naturalLanguage.betB}`);
  });
  
  console.log("\nPattern-Based Arbitrages:");
  aiData.patternBasedArbs.forEach((arb, i) => {
    console.log(`${i + 1}. ${arb.pattern} (${arb.confidence.toFixed(1)}% confidence)`);
  });
}

// ========= Future AI Integration Examples =========

export const AI_INTEGRATION_STRATEGIES = {
  
  // NLP-based bet parsing from API descriptions
  NLP_BET_PARSING: {
    description: "Parse unstructured bet descriptions into normalized structure",
    example: `
    Input: "Manchester United vs Liverpool - Full Time - Marcus Rashford to Score Anytime - Yes @ 2.20"
    Output: {
      sport: "FOOTBALL",
      period: "FT", 
      concern: "PLAYER",
      metric: "GOALS",
      marketType: "BINARY",
      side: "YES",
      playerName: "Marcus Rashford",
      price: 2.20
    }`
  },
  
  // ML-based odds movement prediction
  ODDS_MOVEMENT_PREDICTION: {
    description: "Predict optimal timing for arbitrage execution",
    features: ["Historical odds movement", "Market liquidity", "Time to kickoff", "Bookmaker patterns"],
    example: "Predict if Bet365 Over 2.5 will improve from 1.90 to 1.95 in next 30 minutes"
  },
  
  // LLM-based arbitrage validation
  LLM_VALIDATION: {
    description: "Use LLMs to validate complex arbitrage scenarios",
    prompt: `
    Analyze these two bets for arbitrage potential:
    1. ${betToNaturalLanguage(sampleBets[0])}
    2. ${betToNaturalLanguage(sampleBets[1])}
    
    Are these true opposites? Consider: same event, complementary outcomes, no settlement conflicts.
    `
  },
  
  // Pattern recognition for new arbitrage types
  PATTERN_DISCOVERY: {
    description: "Discover new arbitrage patterns from historical data",
    approach: "Unsupervised learning on bet feature vectors to find previously unknown profitable combinations"
  }
};

// Run demonstrations
if (require.main === module) {
  demonstrateRuleBasedDetection();
  demonstratePatternBasedDetection(); 
  demonstrateBetFingerprinting();
  demonstrateAIDataPreparation();
}