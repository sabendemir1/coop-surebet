import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Target, BarChart3, ArrowRight } from "lucide-react";
import profitDistribution from "@/assets/profit-distribution.jpg";

const InvestorSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <BarChart3 className="w-4 h-4 mr-2" />
            For Investors & Partners
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Investment Opportunity
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Coop-Arbitrage represents a revolutionary approach to risk-free returns. 
            Our mathematical model creates sustainable profit for all participants.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="space-y-8">
            <Card className="p-8 bg-gradient-subtle">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-profit" />
                Market Opportunity
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-card rounded border">
                  <span>Global sports betting market</span>
                  <span className="font-bold text-profit">$203B annually</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-card rounded border">
                  <span>Arbitrage opportunities daily</span>
                  <span className="font-bold text-success">1000+ events</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-card rounded border">
                  <span>Average profit margin</span>
                  <span className="font-bold text-trust-foreground">2-8%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-trust/10 rounded border-trust/30 border">
                  <span>Platform commission potential</span>
                  <span className="font-bold text-trust-foreground">33% of all profits</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-trust-foreground" />
                Risk Assessment
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span><strong>Market Risk:</strong> Zero - mathematical arbitrage eliminates market risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span><strong>Liquidity Risk:</strong> Minimal - quick settlement within 24-48 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span><strong>Operational Risk:</strong> Low - automated systems, manual verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span><strong>Regulatory Risk:</strong> Managed - compliant with local betting laws</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <div className="relative">
              <img 
                src={profitDistribution} 
                alt="Profit Distribution Model" 
                className="w-full rounded-lg shadow-elegant"
              />
            </div>

            <Card className="p-6 bg-profit/10 border-profit/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-profit">
                <TrendingUp className="w-5 h-5" />
                Revenue Projections
              </h3>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-profit">€50K</div>
                    <div className="text-muted-foreground">Monthly Volume (Year 1)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-profit">€500K</div>
                    <div className="text-muted-foreground">Monthly Volume (Year 2)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-profit">€2M</div>
                    <div className="text-muted-foreground">Monthly Volume (Year 3)</div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Conservative profit margin:</span>
                    <span className="font-bold">3.5% average</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Platform commission:</span>
                    <span className="font-bold">33% of profits</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-profit border-t pt-2">
                    <span>Year 3 monthly revenue:</span>
                    <span>€23,100</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="text-center">
              <Button variant="profit" size="lg" className="text-lg px-8 py-4 h-auto">
                Request Investor Deck
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestorSection;