import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, DollarSign, Percent, ArrowRight } from "lucide-react";

const MathematicalBreakdown = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Calculator className="w-4 h-4 mr-2" />
            Complete Mathematical Framework
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            All Formulas Explained
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Every calculation step-by-step. The complete mathematical framework
            that guarantees profits and fair distribution.
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Core Detection Formulas */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-trust-foreground" />
              Step 1-4: Detection & Core Calculations
            </h3>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-trust/10 p-6 rounded-lg border-trust/30 border">
                  <h4 className="font-semibold mb-4 text-lg">1. Arbitrage Detection</h4>
                  <div className="bg-muted p-4 rounded font-mono text-center">
                    <div className="text-lg font-bold mb-2">arbitrage_formula = (1/odds_A) + (1/odds_B)</div>
                    <div className="text-sm text-muted-foreground">If &lt; 1.00 → Arbitrage exists</div>
                  </div>
                  <div className="mt-4 text-sm">
                    <div className="font-semibold">Example:</div>
                    <div>(1/2.10) + (1/2.05) = 0.476 + 0.488 = 0.964</div>
                    <div className="text-success">✓ 0.964 &lt; 1.00 → Arbitrage detected!</div>
                  </div>
                </div>

                <div className="bg-success/10 p-6 rounded-lg border-success/30 border">
                  <h4 className="font-semibold mb-4 text-lg">2. Profit Margin</h4>
                  <div className="bg-muted p-4 rounded font-mono text-center">
                    <div className="text-lg font-bold mb-2">profit_margin = (1 - arbitrage_formula) × 100</div>
                    <div className="text-sm text-muted-foreground">Guaranteed profit percentage</div>
                  </div>
                  <div className="mt-4 text-sm">
                    <div className="font-semibold">Example:</div>
                    <div>(1 - 0.964) × 100 = 3.6%</div>
                    <div className="text-success">✓ 3.6% guaranteed profit margin</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-primary/10 p-6 rounded-lg border-primary/30 border">
                  <h4 className="font-semibold mb-4 text-lg">3. Optimal Stakes</h4>
                  <div className="bg-muted p-4 rounded font-mono text-center space-y-2">
                    <div className="text-lg font-bold">stake_A = (total_pool / odds_A) / arbitrage_formula</div>
                    <div className="text-lg font-bold">stake_B = (total_pool / odds_B) / arbitrage_formula</div>
                  </div>
                  <div className="mt-4 text-sm">
                    <div className="font-semibold">Example (€100 pool):</div>
                    <div>A: (€100 / 2.10) / 0.964 = €49.40</div>
                    <div>B: (€100 / 2.05) / 0.964 = €50.60</div>
                    <div className="text-success">✓ Total: €100.00</div>
                  </div>
                </div>

                <div className="bg-warning/10 p-6 rounded-lg border-warning/30 border">
                  <h4 className="font-semibold mb-4 text-lg">4. Edge Per Player</h4>
                  <div className="bg-muted p-4 rounded font-mono text-center">
                    <div className="text-lg font-bold mb-2">edge_per_player = (total_pool × profit_margin / 100) / 2</div>
                    <div className="text-sm text-muted-foreground">Each player's edge deposit</div>
                  </div>
                  <div className="mt-4 text-sm">
                    <div className="font-semibold">Example:</div>
                    <div>(€100 × 3.6% / 100) / 2 = €1.80 each</div>
                    <div className="text-success">✓ €1.80 edge deposit per player</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Deposit Calculations */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-success" />
              Step 5: Deposit Calculations
            </h3>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-primary/10 p-6 rounded-lg border-primary/30 border">
                <h4 className="font-semibold mb-4 text-lg">Player A Deposit Formula</h4>
                <div className="bg-muted p-4 rounded font-mono space-y-2">
                  <div className="text-lg font-bold">deposit_A = stake_B + edge_per_player</div>
                  <div className="text-sm text-muted-foreground">Other player's stake + own edge</div>
                </div>
                <div className="mt-4 text-sm">
                  <div className="font-semibold">Example:</div>
                  <div>€50.60 + €1.80 = €52.40</div>
                  <div className="text-success">✓ Player A deposits €52.40</div>
                </div>
              </div>

              <div className="bg-warning/10 p-6 rounded-lg border-warning/30 border">
                <h4 className="font-semibold mb-4 text-lg">Player B Deposit Formula</h4>
                <div className="bg-muted p-4 rounded font-mono space-y-2">
                  <div className="text-lg font-bold">deposit_B = stake_A + edge_per_player</div>
                  <div className="text-sm text-muted-foreground">Other player's stake + own edge</div>
                </div>
                <div className="mt-4 text-sm">
                  <div className="font-semibold">Example:</div>
                  <div>€49.40 + €1.80 = €51.20</div>
                  <div className="text-success">✓ Player B deposits €51.20</div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-success/10 p-6 rounded-lg border-success/30 border">
              <h4 className="font-semibold mb-4 text-lg text-center">Total System Pool</h4>
              <div className="bg-muted p-4 rounded font-mono text-center">
                <div className="text-xl font-bold">total_pool = deposit_A + deposit_B</div>
                <div className="text-lg mt-2">€52.40 + €51.20 = €103.60</div>
              </div>
              <div className="mt-4 text-center text-sm">
                <div className="text-success font-semibold">This guarantees all payouts are covered!</div>
              </div>
            </div>
          </Card>

          {/* Settlement Formulas */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Percent className="w-8 h-8 text-warning" />
              Steps 7-10: Settlement Formulas
            </h3>
            
            <div className="space-y-8">
              <div className="bg-muted/50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4 text-lg text-center">Loser Recovery Formula</h4>
                <div className="bg-muted p-4 rounded font-mono text-center space-y-2">
                  <div className="text-lg font-bold">loser_recovery = own_stake + own_edge + opposite_stake</div>
                  <div className="text-sm text-muted-foreground">Always gets back what they put in</div>
                </div>
                <div className="mt-4 text-sm text-center">
                  <div className="font-semibold">If Player B loses:</div>
                  <div>€50.60 (own stake) + €1.80 (own edge) + €49.40 (A's stake) = €101.80</div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-primary/10 p-6 rounded-lg border-primary/30 border">
                  <h4 className="font-semibold mb-4 text-lg">Winner's Edge Distribution</h4>
                  <div className="bg-muted p-4 rounded font-mono space-y-2 text-sm">
                    <div><strong>platform_share = winner_edge × 0.33</strong></div>
                    <div><strong>winner_bonus = winner_edge × winner_ratio × 0.67</strong></div>
                    <div><strong>loser_bonus = winner_edge × loser_ratio × 0.67</strong></div>
                  </div>
                  <div className="mt-4 text-sm">
                    <div className="font-semibold">If A wins (A = 49.4%, B = 50.6%):</div>
                    <div>• Platform: €1.80 × 0.33 = €0.59</div>
                    <div>• A bonus: €1.80 × 0.494 × 0.67 = €0.60</div>
                    <div>• B bonus: €1.80 × 0.506 × 0.67 = €0.61</div>
                  </div>
                </div>

                <div className="bg-success/10 p-6 rounded-lg border-success/30 border">
                  <h4 className="font-semibold mb-4 text-lg">Final Profit Calculation</h4>
                  <div className="bg-muted p-4 rounded font-mono space-y-2 text-sm">
                    <div><strong>winner_profit = winner_bonus</strong></div>
                    <div><strong>loser_profit = loser_bonus</strong></div>
                  </div>
                  <div className="mt-4 text-sm">
                    <div className="font-semibold">Final profits:</div>
                    <div className="text-success">• Winner A: €0.60</div>
                    <div className="text-success">• Loser B: €0.61</div>
                    <div className="text-muted-foreground">• Platform: €0.59</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Complete Example */}
          <Card className="p-8 bg-gradient-subtle">
            <h3 className="text-2xl font-bold mb-8 text-center">Complete Worked Example</h3>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Initial Detection</h4>
                <div className="bg-muted p-4 rounded text-sm space-y-1">
                  <div>Odds A: 2.10, Odds B: 2.05</div>
                  <div>Formula: 0.476 + 0.488 = 0.964</div>
                  <div>Profit: (1 - 0.964) × 100 = 3.6%</div>
                  <div>Stakes: A=€49.40, B=€50.60</div>
                  <div>Edge each: €1.80</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Deposits</h4>
                <div className="bg-muted p-4 rounded text-sm space-y-1">
                  <div>A deposits: €50.60 + €1.80 = €52.40</div>
                  <div>B deposits: €49.40 + €1.80 = €51.20</div>
                  <div>Total pool: €103.60</div>
                  <div>A bets: €49.40</div>
                  <div>B bets: €50.60</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">If A Wins</h4>
                <div className="bg-muted p-4 rounded text-sm space-y-1">
                  <div>A gets from bookmaker: €103.74</div>
                  <div>A bonus: €0.60</div>
                  <div>B recovery: €101.80</div>
                  <div>B bonus: €0.61</div>
                  <div className="border-t pt-2 text-success font-semibold">
                    <div>A profit: €0.60</div>
                    <div>B profit: €0.61</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
};

export default MathematicalBreakdown;