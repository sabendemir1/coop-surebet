import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Calculator, ArrowRight } from "lucide-react";
import poolingSystem from "@/assets/pooling-system.jpg";

const PoolingSystemSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Users className="w-4 h-4 mr-2" />
            Cooperative Approach
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why Pool Resources?
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Individual arbitrage requires accounts at multiple bookmakers and large capital. 
            Our pooling system lets everyone participate with smaller amounts.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="order-2 lg:order-1">
            <img 
              src={poolingSystem} 
              alt="User Pooling System for Arbitrage" 
              className="w-full rounded-lg shadow-elegant"
            />
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <Card className="p-8">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Calculator className="w-6 h-6 text-trust-foreground" />
                Stake Distribution Formula
              </h3>
              
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="font-mono text-center space-y-2">
                    <div className="text-lg font-bold">Optimal Stakes</div>
                    <div className="text-trust-foreground">
                      Stake₁ = (Total Pool / Odds₁) / Arbitrage Formula
                    </div>
                    <div className="text-trust-foreground">
                      Stake₂ = (Total Pool / Odds₂) / Arbitrage Formula
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">With our €100 example:</h4>
                  <div className="grid gap-3 text-sm">
                    <div className="bg-card p-3 rounded border">
                      <div>Stake₁ = (€100 / 2.10) / 0.964 = €49.40</div>
                    </div>
                    <div className="bg-card p-3 rounded border">
                      <div>Stake₂ = (€100 / 2.05) / 0.964 = €50.60</div>
                    </div>
                    <div className="bg-success/10 p-3 rounded border-success/30 border">
                      <div className="font-semibold text-success">
                        Total: €49.40 + €50.60 = €100 ✓
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-trust/10 border-trust/30">
              <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-trust-foreground" />
                Security & Protection
              </h4>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-trust-foreground flex-shrink-0" />
                  <span><strong>Escrow system:</strong> All deposits held securely until bets are placed</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-trust-foreground flex-shrink-0" />
                  <span><strong>Proof required:</strong> Screenshots or API verification before fund release</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-trust-foreground flex-shrink-0" />
                  <span><strong>Mathematical guarantee:</strong> Formulas ensure profit regardless of outcome</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-trust-foreground flex-shrink-0" />
                  <span><strong>Lower barrier:</strong> Start with smaller amounts, no multiple accounts needed</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PoolingSystemSection;