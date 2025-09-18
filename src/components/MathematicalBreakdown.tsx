import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, DollarSign, Percent } from "lucide-react";
import arbitrageFormulas from "@/assets/arbitrage-formulas.jpg";

const MathematicalBreakdown = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Calculator className="w-4 h-4 mr-2" />
            Complete Formula Set
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            The Mathematics Behind Guarantees
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Every calculation is transparent and verifiable. Here are all the formulas 
            that ensure your returns are mathematically guaranteed.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          <div className="space-y-8">
            <img 
              src={arbitrageFormulas} 
              alt="Arbitrage Mathematical Formulas" 
              className="w-full rounded-lg shadow-elegant"
            />
          </div>

          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-trust-foreground" />
                Core Calculations
              </h3>
              <div className="space-y-4 font-mono text-sm">
                <div className="bg-muted p-3 rounded">
                  <div className="font-semibold mb-1">1. Arbitrage Detection:</div>
                  <div className="text-trust-foreground">arbitrage_formula = (1/odds_A) + (1/odds_B)</div>
                </div>
                <div className="bg-muted p-3 rounded">
                  <div className="font-semibold mb-1">2. Profit Margin:</div>
                  <div className="text-success">profit_margin = (1 - arbitrage_formula) × 100</div>
                </div>
                <div className="bg-muted p-3 rounded">
                  <div className="font-semibold mb-1">3. Optimal Stakes:</div>
                  <div className="text-profit">stake_A = (total_pool / odds_A) / arbitrage_formula</div>
                  <div className="text-profit">stake_B = (total_pool / odds_B) / arbitrage_formula</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-profit" />
                User-Specific Returns
              </h3>
              <div className="space-y-4 font-mono text-sm">
                <div className="bg-muted p-3 rounded">
                  <div className="font-semibold mb-1">4. User Stake Ratio:</div>
                  <div className="text-trust-foreground">user_ratio = user_stake / (stake_A + stake_B)</div>
                </div>
                <div className="bg-muted p-3 rounded">
                  <div className="font-semibold mb-1">5. Commission Calculation:</div>
                  <div className="text-muted-foreground">profit_after_commission = profit_margin × 0.67</div>
                </div>
                <div className="bg-muted p-3 rounded">
                  <div className="font-semibold mb-1">6. User Profit Share:</div>
                  <div className="text-success">user_profit = profit_after_commission × user_ratio</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Percent className="w-5 h-5 text-profit" />
                Final Settlement
              </h3>
              <div className="space-y-4 font-mono text-sm">
                <div className="bg-muted p-3 rounded">
                  <div className="font-semibold mb-1">7. Required Deposit:</div>
                  <div className="text-warning">deposit = opposite_stake + total_edge_profit</div>
                </div>
                <div className="bg-success/10 p-3 rounded border-success/30 border">
                  <div className="font-semibold mb-1 text-success">8. Guaranteed Return:</div>
                  <div className="text-success">return = user_stake + user_profit_share</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-16">
          <Card className="p-8 max-w-4xl mx-auto bg-gradient-subtle">
            <h3 className="text-2xl font-semibold text-center mb-6">
              Example: €100 Pool with 3.6% Arbitrage
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="font-semibold">Initial Setup:</div>
                <div>• Odds A: 2.10, Odds B: 2.05</div>
                <div>• Arbitrage formula: 0.964</div>
                <div>• Profit margin: 3.6%</div>
                <div>• Stake A: €49.40, Stake B: €50.60</div>
              </div>
              <div className="space-y-3">
                <div className="font-semibold">User A (49.4% ratio):</div>
                <div>• Investment: €49.40</div>
                <div>• Profit share: 1.19% (67% of 3.6% × 49.4%)</div>
                <div>• Total return: €50.59</div>
                <div className="text-success font-semibold">• Net profit: €1.19</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MathematicalBreakdown;