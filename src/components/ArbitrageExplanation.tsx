import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Shield } from "lucide-react";
import arbitrageDetection from "@/assets/arbitrage-detection.jpg";

const ArbitrageExplanation = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Mathematical Guarantee
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            What is Arbitrage?
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Arbitrage betting exploits differences in odds between bookmakers to guarantee profit 
            regardless of the event outcome. It's pure mathematics, not gambling.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="space-y-8">
            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Calculator className="w-6 h-6 text-trust-foreground" />
                The Core Formula
              </h3>
              
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg font-mono text-center">
                  <div className="text-lg font-bold mb-2">Arbitrage Detection</div>
                  <div className="text-2xl text-trust-foreground">
                    (1 / Odds₁) + (1 / Odds₂) &lt; 1
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    When this equation is true, an arbitrage opportunity exists
                  </p>
                </div>

                <div className="bg-success/10 p-4 rounded-lg">
                  <div className="text-lg font-bold mb-2">Profit Margin</div>
                  <div className="font-mono text-center text-xl text-success">
                    Profit% = (1 - arbitrage_formula) × 100
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Real Example:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-card p-3 rounded border">
                      <div className="font-semibold">Bookmaker A</div>
                      <div>Team X @ 2.10</div>
                      <div className="text-muted-foreground">1/2.10 = 0.476</div>
                    </div>
                    <div className="bg-card p-3 rounded border">
                      <div className="font-semibold">Bookmaker B</div>
                      <div>Team Y @ 2.05</div>
                      <div className="text-muted-foreground">1/2.05 = 0.488</div>
                    </div>
                  </div>
                  <div className="bg-trust/10 p-3 rounded text-center">
                    <div className="font-semibold">0.476 + 0.488 = 0.964 &lt; 1 ✓</div>
                    <div className="text-success">Profit: (1 - 0.964) × 100 = 3.6%</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <div className="relative">
              <img 
                src={arbitrageDetection} 
                alt="Arbitrage Detection System" 
                className="w-full rounded-lg shadow-elegant"
              />
            </div>
            
            <Card className="p-6 bg-gradient-subtle">
              <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-profit" />
                Why This Works
              </h4>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>Different bookmakers</strong> have different opinions on probabilities, 
                  creating pricing inefficiencies.
                </p>
                <p>
                  <strong>Mathematical certainty:</strong> When the sum of inverse odds is less than 1, 
                  you can bet on all outcomes and guarantee profit.
                </p>
                <p>
                  <strong>Risk-free:</strong> Unlike traditional betting, arbitrage betting eliminates 
                  the element of chance through mathematical coverage.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArbitrageExplanation;