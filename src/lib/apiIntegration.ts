// API Integration Utilities - Converting External Data to Normalized Structure
import { BetType, Period, Concern, AnyBet, OverUnderBet, YesNoBet, HandicapBet, ExactBet } from "@/types/betting";

// ========= External API Response Types =========

interface OddsAPIResponse {
  sport_key: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price: number;
        point?: number;
      }>;
    }>;
  }>;
}

interface BookmakerAPIBet {
  event_id: string;
  sport: string;
  league: string;
  home_team: string;
  away_team: string;
  market_type: string;
  selection: string;
  odds: number;
  line?: number;
  player?: string;
  period?: string;
  bookmaker: string;
}

// ========= Market Mapping Configurations =========

interface BaseMarketMapping {
  betType: BetType;
  period: Period;
  metric: string;
}

interface ExactMarketMapping extends BaseMarketMapping {
  betType: BetType.EXACT;
  concern: Concern;
  marketKey: string;
  selectionMap: Record<string | number, string>;
}

interface OverUnderMarketMapping extends BaseMarketMapping {
  betType: BetType.OVER_UNDER;
  concern: Concern;
}

interface HandicapMarketMapping extends BaseMarketMapping {
  betType: BetType.HANDICAP;
}

type MarketMapping = ExactMarketMapping | OverUnderMarketMapping | HandicapMarketMapping;

const ODDS_API_MARKET_MAPPING: Record<string, MarketMapping> = {
  "h2h": { // Head to Head (1X2)
    betType: BetType.EXACT,
    period: Period.FT,
    concern: Concern.TOTAL,
    metric: "FT_RESULT",
    marketKey: "1X2",
    selectionMap: {
      0: "1", // home team index -> "1"
      1: "2", // away team index -> "2"  
      "Draw": "X"
    }
  } as ExactMarketMapping,
  
  "totals": { // Over/Under Goals
    betType: BetType.OVER_UNDER,
    period: Period.FT,
    concern: Concern.TOTAL,
    metric: "GOALS"
  } as OverUnderMarketMapping,
  
  "spreads": { // Handicap
    betType: BetType.HANDICAP,
    period: Period.FT,
    metric: "GOALS"
  } as HandicapMarketMapping
};

const PERIOD_MAPPING = {
  "ft": Period.FT,
  "full_time": Period.FT,
  "1h": Period.H1,
  "first_half": Period.H1,
  "2h": Period.H2,
  "second_half": Period.H2,
  "et": Period.ET,
  "extra_time": Period.ET
};

const BOOKMAKER_MAPPING = {
  "draftkings": "DraftKings",
  "fanduel": "FanDuel", 
  "betmgm": "BetMGM",
  "caesars": "Caesars",
  "bet365": "Bet365",
  "williamhill": "William Hill",
  "pinnacle": "Pinnacle",
  "betfair": "Betfair"
};

// ========= API Adapters =========

/**
 * Convert Odds API response to normalized bets
 */
export class OddsAPIAdapter {
  static convertGame(gameData: OddsAPIResponse): AnyBet[] {
    const bets: AnyBet[] = [];
    const gameId = `${gameData.home_team.replace(/\s+/g, "_")}_vs_${gameData.away_team.replace(/\s+/g, "_")}_${new Date(gameData.commence_time).toISOString().split('T')[0]}`;
    
    gameData.bookmakers.forEach(bookmaker => {
      const bookmakerId = BOOKMAKER_MAPPING[bookmaker.key as keyof typeof BOOKMAKER_MAPPING] || bookmaker.title;
      
      bookmaker.markets.forEach(market => {
        const mapping = ODDS_API_MARKET_MAPPING[market.key];
        if (!mapping) return; // Skip unmapped markets
        
        market.outcomes.forEach((outcome, index) => {
          const baseBet = {
            id: `${gameId}_${bookmakerId}_${market.key}_${index}`,
            sport: "FOOTBALL" as const,
            league: this.inferLeague(gameData.sport_key),
            gameId,
            teamHome: gameData.home_team,
            teamAway: gameData.away_team,
            bookmaker: bookmakerId,
            period: mapping.period,
            metric: mapping.metric,
            price: outcome.price,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          // Create specific bet type
          switch (mapping.betType) {
            case BetType.EXACT:
              const exactMapping = mapping as ExactMarketMapping;
              const selectionCode = exactMapping.selectionMap[index] || 
                                  exactMapping.selectionMap[outcome.name] ||
                                  outcome.name;
              bets.push({
                ...baseBet,
                concern: exactMapping.concern,
                marketType: BetType.EXACT,
                marketKey: exactMapping.marketKey,
                selectionCode: selectionCode as string
              } as ExactBet);
              break;
              
            case BetType.OVER_UNDER:
              const ouMapping = mapping as OverUnderMarketMapping;
              if (outcome.point !== undefined) {
                bets.push({
                  ...baseBet,
                  concern: ouMapping.concern,
                  marketType: BetType.OVER_UNDER,
                  line: outcome.point,
                  side: outcome.name.toUpperCase() as "OVER" | "UNDER"
                } as OverUnderBet);
              }
              break;
              
            case BetType.HANDICAP:
              if (outcome.point !== undefined) {
                bets.push({
                  ...baseBet,
                  marketType: BetType.HANDICAP,
                  concern: index === 0 ? Concern.HOME : Concern.AWAY,
                  line: outcome.point
                } as HandicapBet);
              }
              break;
          }
        });
      });
    });
    
    return bets;
  }
  
  private static inferLeague(sportKey: string): string {
    const leagueMap: { [key: string]: string } = {
      "soccer_epl": "Premier League",
      "soccer_spain_la_liga": "La Liga", 
      "soccer_germany_bundesliga": "Bundesliga",
      "soccer_italy_serie_a": "Serie A",
      "soccer_france_ligue_one": "Ligue 1",
      "soccer_uefa_champs_league": "Champions League"
    };
    
    return leagueMap[sportKey] || "Unknown League";
  }
}

/**
 * Generic bookmaker API adapter
 */
export class BookmakerAPIAdapter {
  static convertBet(betData: BookmakerAPIBet): AnyBet | null {
    const baseBet = {
      id: `${betData.event_id}_${betData.bookmaker}_${Date.now()}`,
      sport: "FOOTBALL" as const,
      league: betData.league,
      gameId: betData.event_id,
      teamHome: betData.home_team,
      teamAway: betData.away_team,
      bookmaker: betData.bookmaker,
      period: this.mapPeriod(betData.period),
      price: betData.odds,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Determine bet type from market_type and selection
    if (betData.market_type.includes("total") || betData.market_type.includes("goals")) {
      if (betData.line && (betData.selection.includes("over") || betData.selection.includes("under"))) {
        return {
          ...baseBet,
          marketType: BetType.OVER_UNDER,
          concern: Concern.TOTAL,
          metric: "GOALS",
          line: betData.line,
          side: betData.selection.toUpperCase().includes("OVER") ? "OVER" : "UNDER"
        } as OverUnderBet;
      }
    }
    
    if (betData.market_type.includes("btts") || betData.market_type.includes("both_teams_to_score")) {
      return {
        ...baseBet,
        marketType: BetType.BINARY,
        concern: Concern.TOTAL,
        metric: "BTTS",
        side: betData.selection.toLowerCase().includes("yes") ? "YES" : "NO"
      } as YesNoBet;
    }
    
    if (betData.market_type.includes("player") && betData.player) {
      const metric = betData.market_type.includes("goal") ? "GOALS" : 
                    betData.market_type.includes("card") ? "CARDS" : "UNKNOWN";
      
      return {
        ...baseBet,
        marketType: BetType.BINARY,
        concern: Concern.PLAYER,
        metric,
        side: betData.selection.toLowerCase().includes("yes") ? "YES" : "NO",
        playerName: betData.player
      } as YesNoBet;
    }
    
    if (betData.market_type === "1x2" || betData.market_type === "match_result") {
      return {
        ...baseBet,
        marketType: BetType.EXACT,
        concern: Concern.TOTAL,
        metric: "FT_RESULT",
        marketKey: "1X2",
        selectionCode: betData.selection
      } as ExactBet;
    }
    
    return null; // Unmapped bet type
  }
  
  private static mapPeriod(period?: string): Period {
    if (!period) return Period.FT;
    const normalized = period.toLowerCase();
    return PERIOD_MAPPING[normalized as keyof typeof PERIOD_MAPPING] || Period.FT;
  }
}

// ========= Smart API Integration =========

/**
 * Intelligent API data processor with conflict resolution
 */
export class SmartAPIIntegrator {
  private bets: Map<string, AnyBet> = new Map();
  
  /**
   * Add bets from multiple sources with deduplication
   */
  addFromSource(bets: AnyBet[], source: string) {
    bets.forEach(bet => {
      const key = this.generateBetKey(bet);
      const existing = this.bets.get(key);
      
      if (!existing) {
        this.bets.set(key, { ...bet, id: `${source}_${bet.id}` });
      } else {
        // Handle conflicts (e.g., different odds for same bet)
        this.resolveConflict(existing, bet, source);
      }
    });
  }
  
  /**
   * Generate semantic key for bet deduplication
   */
  private generateBetKey(bet: AnyBet): string {
    const base = `${bet.sport}.${bet.gameId}.${bet.period}.${bet.concern}.${bet.metric}`;
    
    switch (bet.marketType) {
      case BetType.OVER_UNDER:
        return `${base}.${bet.side}.${bet.line}`;
      case BetType.BINARY:
        const player = bet.playerName || "";
        const window = bet.window ? `${bet.window.startMin}-${bet.window.endMin}` : "";
        return `${base}.${player}.${window}.${bet.side}`;
      case BetType.HANDICAP:
        return `${base}.${bet.line}`;
      case BetType.EXACT:
        return `${base}.${bet.marketKey}.${bet.selectionCode}`;
    }
  }
  
  /**
   * Resolve conflicts between bets from different sources
   */
  private resolveConflict(existing: AnyBet, newBet: AnyBet, source: string) {
    // Keep the bet with better odds (higher for backing)
    if (newBet.price > existing.price) {
      this.bets.set(this.generateBetKey(newBet), { 
        ...newBet, 
        id: `${source}_${newBet.id}`,
        updatedAt: new Date()
      });
    }
  }
  
  /**
   * Get all unique bets
   */
  getAllBets(): AnyBet[] {
    return Array.from(this.bets.values());
  }
  
  /**
   * Get bets grouped by game
   */
  getBetsByGame(): Map<string, AnyBet[]> {
    const games = new Map<string, AnyBet[]>();
    
    this.bets.forEach(bet => {
      if (!games.has(bet.gameId)) {
        games.set(bet.gameId, []);
      }
      games.get(bet.gameId)!.push(bet);
    });
    
    return games;
  }
}

// ========= Usage Examples =========

export const API_INTEGRATION_EXAMPLES = {
  
  // Example: Processing Odds API data
  ODDS_API_EXAMPLE: `
    const oddsApiResponse = await fetch('https://api.the-odds-api.com/v4/sports/soccer_epl/odds/');
    const games = await oddsApiResponse.json();
    
    const integrator = new SmartAPIIntegrator();
    
    games.forEach(game => {
      const bets = OddsAPIAdapter.convertGame(game);
      integrator.addFromSource(bets, 'odds_api');
    });
    
    const finder = new EnhancedArbFinder();
    finder.addBets(integrator.getAllBets());
    const arbitrages = finder.findRuleBasedArbitrages();
  `,
  
  // Example: Processing multiple bookmaker APIs
  MULTI_SOURCE_EXAMPLE: `
    const integrator = new SmartAPIIntegrator();
    
    // Add from Bet365 API
    const bet365Bets = await Bet365API.getBets();
    integrator.addFromSource(bet365Bets.map(BookmakerAPIAdapter.convertBet), 'bet365');
    
    // Add from William Hill API  
    const whillBets = await WilliamHillAPI.getBets();
    integrator.addFromSource(whillBets.map(BookmakerAPIAdapter.convertBet), 'williamhill');
    
    // Find arbitrages across all sources
    const finder = new EnhancedArbFinder();
    finder.addBets(integrator.getAllBets());
    
    // Use both rule-based and pattern-based detection
    const ruleArbs = finder.findRuleBasedArbitrages();
    const patternArbs = finder.findPatternBasedArbitrages();
  `,
  
  // Example: Real-time arbitrage monitoring
  REAL_TIME_MONITORING: `
    setInterval(async () => {
      const integrator = new SmartAPIIntegrator();
      
      // Fetch from multiple sources
      await Promise.all([
        fetchOddsAPI().then(data => integrator.addFromSource(data, 'odds_api')),
        fetchBet365().then(data => integrator.addFromSource(data, 'bet365')),
        fetchPinnacle().then(data => integrator.addFromSource(data, 'pinnacle'))
      ]);
      
      // Find arbitrages
      const finder = new EnhancedArbFinder();
      finder.addBets(integrator.getAllBets());
      const arbitrages = finder.findRuleBasedArbitrages();
      
      // Alert on profitable opportunities
      arbitrages
        .filter(arb => arb.edge > 0.02) // 2%+ edge
        .forEach(arb => sendAlert(arb));
        
    }, 30000); // Check every 30 seconds
  `
};