import { Card } from "@/components/ui/card";
import { Search, Calculator, Users, Target, Trophy, Coins } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Arb Detection",
    description: "Our system continuously scans bookmaker APIs and odds to identify profitable arbitrage opportunities.",
    detail: "Example: Team A @ 2.10, Team B @ 2.05"
  },
  {
    icon: Calculator,
    title: "Stake Calculation", 
    description: "Mathematical formulas ensure risk-free coverage by calculating optimal stake distribution.",
    detail: "Formula guarantees profit regardless of outcome"
  },
  {
    icon: Users,
    title: "User Matching",
    description: "Two users are matched to cover opposite sides of the bet, with deposits held in secure escrow.",
    detail: "Both sides funded before execution"
  },
  {
    icon: Target,
    title: "Bet Placement",
    description: "Each user places their calculated bet at their respective bookmaker with verification.",
    detail: "Screenshot or API verification required"
  },
  {
    icon: Trophy,
    title: "Event Result",
    description: "Winning bet gets paid out from pooled deposits. Losing bet is covered by the arbitrage math.",
    detail: "Both users protected regardless of outcome"
  },
  {
    icon: Coins,
    title: "Profit Allocation",
    description: "Arbitrage profit is split between platform commission and both users equally.",
    detail: "Everyone gets original stake + profit share"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How Coop-Arbitrage Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Six simple steps that guarantee profit for everyone involved through mathematical arbitrage.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="p-8 hover:shadow-elegant transition-all duration-300 border-l-4 border-l-trust">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-trust rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-trust-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {step.description}
                </p>
                
                <div className="text-sm font-medium text-trust-foreground bg-trust/20 px-3 py-2 rounded-lg">
                  {step.detail}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;