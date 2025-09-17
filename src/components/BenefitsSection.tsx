import { Card } from "@/components/ui/card";
import { Shield, TrendingUp, Users, Clock, Award, Lock } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Zero Risk to Principal",
    description: "Mathematical arbitrage guarantees your deposit is always protected. You never lose your initial investment.",
    highlight: "100% Protection"
  },
  {
    icon: TrendingUp,
    title: "Consistent Returns",
    description: "Earn 3-5% daily returns through guaranteed arbitrage opportunities. No market predictions needed.",
    highlight: "3-5% Daily"
  },
  {
    icon: Users,
    title: "Cooperative Model",
    description: "Work together, not against each other. Everyone benefits when arbitrage opportunities succeed.",
    highlight: "Win-Win"
  },
  {
    icon: Clock,
    title: "Quick Settlements",
    description: "Most bets settle within hours. Get your principal plus profits back the same day.",
    highlight: "Same Day"
  },
  {
    icon: Award,
    title: "Bonus Opportunities",
    description: "Benefit from bookmaker cashback and bonuses that provide additional upside to the pool.",
    highlight: "Extra Profits"
  },
  {
    icon: Lock,
    title: "Secure Escrow",
    description: "All funds held in secure escrow until bet placement. Multi-signature security protocols.",
    highlight: "Bank Grade"
  }
];

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why Choose Coop-Arbitrage?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Traditional betting means someone loses. Our platform ensures everyone wins through mathematical guarantees.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="p-8 hover:shadow-trust transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-success-foreground" />
                  </div>
                  <div className="text-sm font-bold text-success bg-success/20 px-3 py-1 rounded-full">
                    {benefit.highlight}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-success/20 text-success px-6 py-3 rounded-full font-medium">
            <Award className="w-5 h-5" />
            Tagline: "Deposit once, always get your money back, plus a share of daily arbitrage profits."
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;