import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, DollarSign, Clock, Info, Plus, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ArbitrageOpportunity from "@/components/ArbitrageOpportunity";
import AddArbitrageDialog from "@/components/AddArbitrageDialog";
import FilterDialog from "@/components/FilterDialog";

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

  const oddTypes = [
    { value: "wins", requiresValue: false },
    { value: "total_fouls", requiresValue: true },
    { value: "total_goals", requiresValue: true },
    { value: "total_shots", requiresValue: true },
    { value: "total_shots_target", requiresValue: true },
    { value: "handicap_a", requiresValue: false },
    { value: "handicap_b", requiresValue: false },
    { value: "team_a_goals", requiresValue: true },
    { value: "team_a_shots", requiresValue: true },
    { value: "team_a_shots_target", requiresValue: true },
    { value: "team_b_goals", requiresValue: true },
    { value: "team_b_shots", requiresValue: true },
    { value: "team_b_shots_target", requiresValue: true },
    { value: "corner_kicks", requiresValue: true },
    { value: "yellow_cards", requiresValue: true },
    { value: "first_half_goals", requiresValue: true },
    { value: "possession_winner", requiresValue: false }
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

    // Random odd type
    const randomOddType = oddTypes[Math.floor(Math.random() * oddTypes.length)];
    const overUnderValue = randomOddType.requiresValue ? 
      (Math.random() * 10 + 0.5).toFixed(1) : null;

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
      oddType: randomOddType.value,
      overUnderValue: overUnderValue ? parseFloat(overUnderValue) : null
    };
  });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [userBookmaker, setUserBookmaker] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState(generateArbitrageOpportunities());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    sport: "all",
    minTime: "",
    maxTime: "",
    minProfitMargin: "",
    maxProfitMargin: "",
    minPoolSize: "",
    maxPoolSize: ""
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/");
        return;
      }

      // Fetch user profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        toast({
          title: "Error",
          description: "Could not load profile",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate("/");
        return;
      }

      setUserName(profile.name);
      setUserBookmaker(profile.bookmaker);
      setBalance(Number(profile.balance_usd || 0));
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  const handleAddArbitrage = (newOpportunity) => {
    setOpportunities(prev => [newOpportunity, ...prev]);
    setIsAddDialogOpen(false);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  const filteredOpportunities = opportunities.filter(opp => {
    // Basic bookmaker filter
    const bookmakerMatch = opp.bookmakerA.toLowerCase().includes(userBookmaker.toLowerCase()) || 
                          opp.bookmakerB.toLowerCase().includes(userBookmaker.toLowerCase());
    
    if (!bookmakerMatch) return false;

    // Sport filter
    if (filters.sport !== "all" && opp.sport !== filters.sport) return false;

    // Time filter (convert seconds to minutes)
    const timeInMinutes = Math.floor(opp.expiresIn / 60);
    if (filters.minTime && timeInMinutes < parseInt(filters.minTime)) return false;
    if (filters.maxTime && timeInMinutes > parseInt(filters.maxTime)) return false;

    // Calculate profit margin for filtering
    const profitMargin = (1 - (1/opp.oddA + 1/opp.oddB)) * 100;
    if (filters.minProfitMargin && profitMargin < parseFloat(filters.minProfitMargin)) return false;
    if (filters.maxProfitMargin && profitMargin > parseFloat(filters.maxProfitMargin)) return false;

    // Pool size filter
    if (filters.minPoolSize && opp.totalPool < parseInt(filters.minPoolSize)) return false;
    if (filters.maxPoolSize && opp.totalPool > parseInt(filters.maxPoolSize)) return false;

    return true;
  });

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
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">Balance:</span>
                  <span className="text-lg font-bold text-primary">
                    ${balance.toFixed(2)}
                  </span>
                </div>
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Live Arbitrage Opportunities</h2>
            <p className="text-muted-foreground">
              Risk-free betting opportunities matching your bookmaker account
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)} className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Arbitrage
            </Button>
          </div>
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

      <AddArbitrageDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddArbitrage={handleAddArbitrage}
        userBookmaker={userBookmaker}
      />

      <FilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default Dashboard;