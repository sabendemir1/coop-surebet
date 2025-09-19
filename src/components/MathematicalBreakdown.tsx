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
                    <div className="text-lg font-bold mb-2">edge_per_player = total_pool × profit_margin / 100</div>
                    <div className="text-sm text-muted-foreground">Each player deposits full edge</div>
                  </div>
                  <div className="mt-4 text-sm">
                    <div className="font-semibold">Example:</div>
                    <div>€100 × 3.6% / 100 = €3.60 each</div>
                    <div className="text-success">✓ €3.60 edge deposit per player</div>
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
                  <div className="text-lg font-bold">deposit_A = stake_B + total_edge</div>
                  <div className="text-sm text-muted-foreground">Other player's stake + full edge</div>
                </div>
                <div className="mt-4 text-sm">
                  <div className="font-semibold">Example:</div>
                  <div>€50.60 + €3.60 = €54.20</div>
                  <div className="text-success">✓ Player A deposits €54.20</div>
                </div>
              </div>

              <div className="bg-warning/10 p-6 rounded-lg border-warning/30 border">
                <h4 className="font-semibold mb-4 text-lg">Player B Deposit Formula</h4>
                <div className="bg-muted p-4 rounded font-mono space-y-2">
                  <div className="text-lg font-bold">deposit_B = stake_A + total_edge</div>
                  <div className="text-sm text-muted-foreground">Other player's stake + full edge</div>
                </div>
                <div className="mt-4 text-sm">
                  <div className="font-semibold">Example:</div>
                  <div>€49.40 + €3.60 = €53.00</div>
                  <div className="text-success">✓ Player B deposits €53.00</div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-success/10 p-6 rounded-lg border-success/30 border">
              <h4 className="font-semibold mb-4 text-lg text-center">Total System Pool</h4>
              <div className="bg-muted p-4 rounded font-mono text-center">
                <div className="text-xl font-bold">total_pool = deposit_A + deposit_B</div>
                <div className="text-lg mt-2">€54.20 + €53.00 = €107.20</div>
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
                  <div className="text-lg font-bold">loser_recovery = own_stake + full_edge + opposite_stake</div>
                  <div className="text-sm text-muted-foreground">Always gets back what they put in</div>
                </div>
                <div className="mt-4 text-sm text-center">
                  <div className="font-semibold">If Player B loses:</div>
                  <div>€50.60 (own stake) + €3.60 (full edge) + €49.40 (A's stake) = €103.60</div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-primary/10 p-6 rounded-lg border-primary/30 border">
                  <h4 className="font-semibold mb-4 text-lg">Total Edge Distribution</h4>
                  <div className="bg-muted p-4 rounded font-mono space-y-2 text-sm">
                    <div><strong>platform_share = total_edge × 0.33</strong></div>
                    <div><strong>winner_bonus = total_edge × winner_ratio × 0.67</strong></div>
                    <div><strong>loser_bonus = total_edge × loser_ratio × 0.67</strong></div>
                  </div>
                  <div className="mt-4 text-sm">
                    <div className="font-semibold">If A wins (A = 49.4%, B = 50.6%):</div>
                    <div>• Platform: €3.60 × 0.33 = €1.19</div>
                    <div>• A bonus: €3.60 × 0.494 × 0.67 = €1.19</div>
                    <div>• B bonus: €3.60 × 0.506 × 0.67 = €1.22</div>
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
                    <div className="text-success">• Winner A: €1.19</div>
                    <div className="text-success">• Loser B: €1.22</div>
                    <div className="text-muted-foreground">• Platform: €1.19</div>
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
                <div className="font-semibold text-lg">Deposits</div>
                <div className="bg-muted p-4 rounded text-sm space-y-1">
                  <div>A deposits: €50.60 + €3.60 = €54.20</div>
                  <div>B deposits: €49.40 + €3.60 = €53.00</div>
                  <div>Total pool: €107.20</div>
                  <div>A bets: €49.40</div>
                  <div>B bets: €50.60</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">If A Wins</h4>
                <div className="bg-muted p-4 rounded text-sm space-y-1">
                  <div>A gets from bookmaker: €103.74</div>
                  <div>A bonus: €1.19</div>
                  <div>B recovery: €103.60</div>
                  <div>B bonus: €1.22</div>
                  <div className="border-t pt-2 text-success font-semibold">
                    <div>A profit: €1.19</div>
                    <div>B profit: €1.22</div>
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