import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, DollarSign, Clock, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ArbitrageOpportunity from "@/components/ArbitrageOpportunity";
import { supabase } from "@/integrations/supabase/client";

// Dashboard interface for API data
interface ArbitrageOpportunityData {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  profitMargin: number;
  totalStake: number;
  homeBet: {
    bookmaker: string;
    odds: number;
    stake: number;
  };
  awayBet: {
    bookmaker: string;
    odds: number;
    stake: number;
  };
  drawBet?: {
    bookmaker: string;
    odds: number;
    stake: number;
  };
  expiresAt: string;
  expectedProfit: number;
  minDeposit: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userBookmaker, setUserBookmaker] = useState("");
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchArbitrageOpportunities = async () => {
    try {
      setLoading(true);
      console.log('Fetching arbitrage opportunities...');
      
      const { data, error } = await supabase.functions.invoke('get-arbitrage-opportunities', {
        body: {
          minProfit: 0.001, // 0.1% minimum profit
          limit: 50
        }
      });

      if (error) {
        console.error('Error fetching opportunities:', error);
        return;
      }

      console.log('Received opportunities:', data);
      
      if (data?.opportunities) {
        setOpportunities(data.opportunities);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching arbitrage opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const bookmaker = localStorage.getItem("userBookmaker");
    
    if (!name || !bookmaker) {
      navigate("/");
      return;
    }
    
    setUserName(name);
    setUserBookmaker(bookmaker);
    
    // Fetch initial data
    fetchArbitrageOpportunities();
    
    // Set up periodic refresh every 2 minutes
    const interval = setInterval(fetchArbitrageOpportunities, 120000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userBookmaker");
    navigate("/");
  };

  const handleRefreshData = () => {
    fetchArbitrageOpportunities();
  };

  const filteredOpportunities = opportunities.filter(opp => 
    opp.homeBet.bookmaker.toLowerCase().includes(userBookmaker.toLowerCase()) || 
    opp.awayBet.bookmaker.toLowerCase().includes(userBookmaker.toLowerCase()) ||
    (opp.drawBet && opp.drawBet.bookmaker.toLowerCase().includes(userBookmaker.toLowerCase()))
  );

  const totalPoolValue = filteredOpportunities.reduce((sum, opp) => sum + opp.totalStake, 0);
  const avgProfitMargin = filteredOpportunities.length > 0 
    ? (filteredOpportunities.reduce((sum, opp) => sum + (opp.profitMargin * 100), 0) / filteredOpportunities.length)
    : 0;

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
              {lastUpdated && (
                <Badge variant="outline" className="text-xs">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-foreground">Welcome, {userName}</p>
                <p className="text-sm text-muted-foreground">Account: {userBookmaker}</p>
              </div>
              <Button variant="outline" onClick={handleRefreshData} disabled={loading}>
                {loading ? "Loading..." : "Refresh"}
              </Button>
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
                  ${totalPoolValue.toLocaleString()}
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
                <p className="text-2xl font-bold text-foreground">{avgProfitMargin.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading arbitrage opportunities...</p>
            </Card>
          ) : filteredOpportunities.length === 0 ? (
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