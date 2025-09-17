import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, Euro, TrendingUp, Target, Calculator, Coins } from "lucide-react";

const ProfitCalculator = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Guaranteed Profit Example
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See exactly how the mathematics work to ensure everyone wins, every time.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Setup */}
            <div className="space-y-6">
              <Card className="p-6 bg-trust/10 border-trust/30">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-trust-foreground" />
                  Arbitrage Opportunity
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Bookmaker A: Team X Win</span>
                    <span className="font-bold text-trust-foreground">@2.10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bookmaker B: Team Y Win</span>
                    <span className="font-bold text-trust-foreground">@2.05</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                    <span>Total Pool</span>
                    <span className="text-profit">€100</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Stake Distribution
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>User A Stake (Team X)</span>
                    <span className="font-bold">€49.40</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User B Stake (Team Y)</span>
                    <span className="font-bold">€50.60</span>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Right side - Outcomes */}
            <div className="space-y-6">
              <div className="grid gap-4">
                <Card className="p-6 bg-success/10 border-success/30">
                  <h4 className="font-semibold text-success mb-3">Outcome 1: Team X Wins</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Payout: €49.40 × 2.10</span>
                      <span className="font-bold">€103.74</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Deposits</span>
                      <span>€100.00</span>
                    </div>
                    <div className="flex justify-between text-success font-bold border-t pt-2">
                      <span>Guaranteed Profit</span>
                      <span>€3.74</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 bg-success/10 border-success/30">
                  <h4 className="font-semibold text-success mb-3">Outcome 2: Team Y Wins</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Payout: €50.60 × 2.05</span>
                      <span className="font-bold">€103.73</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Deposits</span>
                      <span>€100.00</span>
                    </div>
                    <div className="flex justify-between text-success font-bold border-t pt-2">
                      <span>Guaranteed Profit</span>
                      <span>€3.73</span>
                    </div>
                  </div>
                </Card>
              </div>
              
              <Card className="p-6 bg-gradient-profit">
                <h4 className="font-semibold text-profit-foreground mb-3 flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Final Distribution
                </h4>
                <div className="space-y-2 text-sm text-profit-foreground/90">
                  <div className="flex justify-between">
                    <span>Platform Commission (33%)</span>
                    <span className="font-bold">€1.25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User A Total Return</span>
                    <span className="font-bold">€50.65</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User B Total Return</span>
                    <span className="font-bold">€51.85</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button variant="success" size="lg" className="text-lg px-8 py-4 h-auto">
              <TrendingUp className="mr-2 w-5 h-5" />
              Try Live Calculator
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfitCalculator;