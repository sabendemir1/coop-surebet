import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowDown, ArrowRight, CheckCircle } from "lucide-react";

const ArbitrageExplanation = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            10-Step Pipeline
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How The Arbitrage System Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            A complete step-by-step breakdown of our deposit-guaranteed arbitrage system.
            Deposits ensure losers get paid back and profits are distributed fairly.
          </p>
        </div>

        {/* Step-by-step Pipeline */}
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Steps 1-4: Detection & Calculation */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-8 text-center">Phase 1: Detection & Calculation</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-trust text-trust-foreground font-bold text-xl flex items-center justify-center mx-auto">1</div>
                <h4 className="font-semibold">Arbitrage Detected</h4>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  (1/2.10) + (1/2.05) = 0.964 &lt; 1
                </div>
                <ArrowDown className="w-6 h-6 text-muted-foreground mx-auto" />
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-success text-success-foreground font-bold text-xl flex items-center justify-center mx-auto">2</div>
                <h4 className="font-semibold">Profit Calculated</h4>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  (1 - 0.964) × 100 = 3.6%
                </div>
                <ArrowDown className="w-6 h-6 text-muted-foreground mx-auto" />
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-warning text-warning-foreground font-bold text-xl flex items-center justify-center mx-auto">3</div>
                <h4 className="font-semibold">Stakes Calculated</h4>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  A: €49.40<br/>B: €50.60
                </div>
                <ArrowDown className="w-6 h-6 text-muted-foreground mx-auto" />
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto">4</div>
                <h4 className="font-semibold">Deposits Calculated</h4>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  Edge: €3.60<br/>Each: €1.80
                </div>
                <ArrowDown className="w-6 h-6 text-muted-foreground mx-auto" />
              </div>

            </div>
          </Card>

          {/* Steps 5-6: Player Actions */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-8 text-center">Phase 2: Deposits & Betting</h3>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center">5</div>
                  <h4 className="text-xl font-semibold">Players Deposit</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-card p-4 rounded border">
                    <div className="font-semibold mb-2">Player A deposits:</div>
                    <div className="space-y-1 text-sm font-mono">
                      <div>• Own edge: €1.80</div>
                      <div>• Player B's stake: €50.60</div>
                      <div><strong>Total: €52.40</strong></div>
                    </div>
                  </div>
                  
                  <div className="bg-card p-4 rounded border">
                    <div className="font-semibold mb-2">Player B deposits:</div>
                    <div className="space-y-1 text-sm font-mono">
                      <div>• Own edge: €1.80</div>
                      <div>• Player A's stake: €49.40</div>
                      <div><strong>Total: €51.20</strong></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-trust text-trust-foreground font-bold text-xl flex items-center justify-center">6</div>
                  <h4 className="text-xl font-semibold">Players Bet</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-trust/10 p-4 rounded border-trust/30 border">
                    <div className="font-semibold mb-2">Player A:</div>
                    <div className="text-sm">Bets €49.40 on Man United @ 2.10</div>
                  </div>
                  
                  <div className="bg-trust/10 p-4 rounded border-trust/30 border">
                    <div className="font-semibold mb-2">Player B:</div>
                    <div className="text-sm">Bets €50.60 on Chelsea @ 2.05</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Steps 7-10: Settlement */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-8 text-center">Phase 3: Match End & Settlement</h3>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 rounded-full bg-success text-success-foreground font-bold text-xl flex items-center justify-center">7</span>
                  <span className="w-12 h-12 rounded-full bg-destructive text-destructive-foreground font-bold text-xl flex items-center justify-center">8</span>
                  <h4 className="text-xl font-semibold">Match Ends</h4>
                </div>
                
                <div className="bg-success/10 p-4 rounded border-success/30 border">
                  <div className="font-semibold mb-2 text-success">If Player A Wins (Man United):</div>
                  <div className="space-y-1 text-sm">
                    <div>• Player A gets €103.74 from bookmaker</div>
                    <div>• Player B gets back from system:</div>
                    <div className="ml-4 font-mono">- His own stake: €50.60</div>
                    <div className="ml-4 font-mono">- His deposited edge: €1.80</div>
                    <div className="ml-4 font-mono">- A's stake he deposited: €49.40</div>
                    <div className="ml-4 font-mono"><strong>Total: €101.80</strong></div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 rounded-full bg-warning text-warning-foreground font-bold text-xl flex items-center justify-center">9</span>
                  <span className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center">10</span>
                  <h4 className="text-xl font-semibold">Profit Distribution</h4>
                </div>
                
                <div className="bg-primary/10 p-4 rounded border-primary/30 border">
                  <div className="font-semibold mb-2">Winner's Edge (€1.80) Split:</div>
                  <div className="space-y-1 text-sm font-mono">
                    <div>• Platform (33%): €0.59</div>
                    <div>• Winner gets (49.4%): €0.62</div>
                    <div>• Loser gets (17.6%): €0.59</div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="font-semibold">Final Profits:</div>
                    <div className="text-sm">Winner: €0.62 | Loser: €0.59</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Key Guarantees */}
          <Card className="p-8 bg-trust/5 border-trust/30">
            <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-8 h-8 text-trust-foreground" />
              System Guarantees
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-semibold mb-2">Loser Protection</h4>
                <p className="text-sm text-muted-foreground">Deposits ensure losers always get their money back plus profit share</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">No Player Risk</h4>
                <p className="text-sm text-muted-foreground">If players don't bet, they only lose if their odds would have won</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mathematical Certainty</h4>
                <p className="text-sm text-muted-foreground">Profits are guaranteed by arbitrage mathematics, not luck</p>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
};

export default ArbitrageExplanation;