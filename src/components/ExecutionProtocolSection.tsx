import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, Users, Target, CheckCircle, AlertCircle } from "lucide-react";

const ExecutionProtocolSection = () => {
  const phases = [
    {
      number: 1,
      title: "Lock & Match",
      duration: "30 seconds",
      icon: Users,
      description: "Click 'Lock' to enter matchmaking queue",
      details: ["30-second window to find another player", "Auto-cancel if no match found", "Instant notification when matched"]
    },
    {
      number: 2,
      title: "Preparation Window", 
      duration: "2 minutes (or skip)",
      icon: Clock,
      description: "Prepare your bet slip but DO NOT confirm",
      details: ["Direct links to your assigned bookmaker only", "Step-by-step preparation checklist", "'Ready to Execute' button for early completion", "Window ends when both players are ready"]
    },
    {
      number: 3,
      title: "Critical Recalculation",
      duration: "Real-time",
      icon: Target,
      description: "System verifies current odds and profitability",
      details: ["Fresh odds fetched from both bookmakers", "Automatic profitability check (>0.5% margin required)", "Auto-cancel with full refunds if no longer profitable"]
    },
    {
      number: 4,
      title: "Conditional Auto-Deposit",
      duration: "Instant",
      icon: CheckCircle,
      description: "Deposits executed only if recalculation passes",
      details: ["Exact amounts calculated from current odds", "Simultaneous execution for both players", "No deposits if conditions have changed"]
    },
    {
      number: 5,
      title: "Synchronized 'GO' Signal",
      duration: "60 seconds",
      icon: AlertCircle,
      description: "Execute your prepared bets simultaneously",
      details: ["Both players receive 'EXECUTE NOW!' notification", "60-second window for one-click confirmation", "Real-time status tracking of both executions", "Bet slip verification required"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Enhanced Security Protocol
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Our Enhanced Execution Protocol
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Secure, coordinated, and risk-free arbitrage execution that eliminates timing risks while protecting your identity
          </p>
        </div>

        {/* Security Highlight */}
        <Card className="mb-12 p-6 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-primary">Bookmaker Protection System</h3>
              <p className="text-muted-foreground mb-3">
                For your security, we never reveal which bookmaker your matched partner is using. This prevents bookmakers from cross-referencing betting pools and detecting arbitrage activity.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="font-medium">Protects all users from potential account bans</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Phases Timeline */}
        <div className="space-y-8">
          {phases.map((phase, index) => (
            <Card key={phase.number} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg mb-3">
                    {phase.number}
                  </div>
                  <div className="flex items-center justify-center">
                    <phase.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold">{phase.title}</h3>
                    <Badge variant="outline">{phase.duration}</Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 text-lg">
                    {phase.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {phase.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {index < phases.length - 1 && (
                  <div className="absolute left-9 mt-16 w-0.5 h-8 bg-border -z-10" style={{marginLeft: '1.5rem'}} />
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Key Benefits */}
        <Card className="mt-12 p-6 bg-gradient-to-r from-muted/50 to-background">
          <h3 className="text-xl font-semibold mb-6 text-center">Why This Protocol Eliminates All Risks</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Bookmaker Anonymity</h4>
              <p className="text-sm text-muted-foreground">Never showing opposite bookmaker details protects you from detection</p>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Zero Timing Risk</h4>
              <p className="text-sm text-muted-foreground">Pre-game odds stability + preparation phase eliminates pressure</p>
            </div>
            <div className="text-center">
              <Target className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Automatic Protection</h4>
              <p className="text-sm text-muted-foreground">Auto-cancellation with refunds if odds become unfavorable</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ExecutionProtocolSection;