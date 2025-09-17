import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(210, 220, 255, 0.95), rgba(210, 220, 255, 0.9)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-trust/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-trust/80 text-trust-foreground px-4 py-2 rounded-full mb-8 font-medium">
            <Shield className="w-4 h-4" />
            Risk-Free Arbitrage Platform
          </div>
          
          {/* Main headline */}
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Everyone Wins.
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Nobody Loses.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Pool your deposits with other users to cover opposite sides of arbitrage bets. 
            Mathematical guarantees ensure everyone gets their money back plus profit share.
          </p>
          
          {/* Key stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-success">100%</div>
              <div className="text-muted-foreground">Principal Protected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-profit">3-5%</div>
              <div className="text-muted-foreground">Daily Returns</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-trust-foreground">0%</div>
              <div className="text-muted-foreground">Risk of Loss</div>
            </div>
          </div>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4 h-auto">
              Join Waitlist
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
              See How It Works
            </Button>
          </div>
          
          {/* Trust indicator */}
          <p className="text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Mathematically guaranteed returns through arbitrage
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;