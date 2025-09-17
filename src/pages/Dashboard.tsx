import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, DollarSign, Clock, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ArbitrageOpportunity from "@/components/ArbitrageOpportunity";

// Mock data generator for arbitrage opportunities
const generateArbitrageOpportunities = () => {
  const bookmakers = [
    "Bet365", "Pinnacle", "Betfair", "Unibet", "Betway", 
    "William Hill", "BWin", "Betsson", "DraftKings", "FanDuel"
  ];
  
  const matches = [
    { teamA: "Manchester City", teamB: "Arsenal", sport: "Football" },
    { teamA: "Real Madrid", teamB: "Barcelona", sport: "Football" },
    { teamA: "Lakers", teamB: "Warriors", sport: "Basketball" },
    { teamA: "Djokovic", teamB: "Nadal", sport: "Tennis" },
    { teamA: "Bayern Munich", teamB: "Dortmund", sport: "Football" },
    { teamA: "Celtics", teamB: "Heat", sport: "Basketball" },
    { teamA: "Federer", teamB: "Murray", sport: "Tennis" },
    { teamA: "PSG", teamB: "Marseille", sport: "Football" },
  ];

  return Array.from({ length: 8 }, (_, i) => {
    // Generate odds that create arbitrage (1/oddA + 1/oddB < 1)
    const oddA = 2.0 + Math.random() * 1.5; // 2.0 to 3.5
    const maxOddB = 1 / (1 - 1/oddA - 0.02); // Ensure arbitrage with 2% margin
    const oddB = 2.0 + Math.random() * (maxOddB - 2.0);
    
    const totalPool = Math.floor(Math.random() * 9900) + 100; // $100 to $10,000
    const match = matches[i % matches.length];
    
    const bookmakerA = bookmakers[Math.floor(Math.random() * bookmakers.length)];
    let bookmakerB = bookmakers[Math.floor(Math.random() * bookmakers.length)];
    while (bookmakerB === bookmakerA) {
      bookmakerB = bookmakers[Math.floor(Math.random() * bookmakers.length)];
    }

    return {
      id: `arb_${i + 1}`,
      matchId: `match_${i + 1}`,
      teamA: match.teamA,
      teamB: match.teamB,
      sport: match.sport,
      bookmakerA,
      bookmakerB,
      oddA: Number(oddA.toFixed(2)),
      oddB: Number(oddB.toFixed(2)),
      totalPool,
      expiresIn: Math.floor(Math.random() * 3600) + 300, // 5 minutes to 1 hour
    };
  });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userBookmaker, setUserBookmaker] = useState("");
  const [opportunities, setOpportunities] = useState(generateArbitrageOpportunities());

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const bookmaker = localStorage.getItem("userBookmaker");
    
    if (!name || !bookmaker) {
      navigate("/");
      return;
    }
    
    setUserName(name);
    setUserBookmaker(bookmaker);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userBookmaker");
    navigate("/");
  };

  const filteredOpportunities = opportunities.filter(opp => 
    opp.bookmakerA.toLowerCase().includes(userBookmaker.toLowerCase()) || 
    opp.bookmakerB.toLowerCase().includes(userBookmaker.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Coop-Arbitrage</h1>
              <Badge variant="secondary" className="bg-success/20 text-success">
                Live Trading
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-foreground">Welcome, {userName}</p>
                <p className="text-sm text-muted-foreground">Account: {userBookmaker}</p>
              </div>
              <Button variant="outline" onClick={() => navigate("/info")}>
                <Info className="w-4 h-4 mr-2" />
                Info
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Live Arbitrage Opportunities</h2>
          <p className="text-muted-foreground">
            Risk-free betting opportunities matching your bookmaker account
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/20 rounded-full">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Opportunities</p>
                <p className="text-2xl font-bold text-foreground">{filteredOpportunities.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-profit/20 rounded-full">
                <DollarSign className="w-5 h-5 text-profit" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pool Value</p>
                <p className="text-2xl font-bold text-foreground">
                  ${filteredOpportunities.reduce((sum, opp) => sum + opp.totalPool, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-trust/20 rounded-full">
                <Clock className="w-5 h-5 text-trust" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Profit Margin</p>
                <p className="text-2xl font-bold text-foreground">2.8%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          {filteredOpportunities.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No arbitrage opportunities found for your bookmaker. 
                <br />
                New opportunities appear every few minutes.
              </p>
            </Card>
          ) : (
            filteredOpportunities.map((opportunity) => (
              <ArbitrageOpportunity 
                key={opportunity.id} 
                opportunity={opportunity}
                userBookmaker={userBookmaker}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;