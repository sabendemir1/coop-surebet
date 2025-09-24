import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, TrendingUp, DollarSign } from "lucide-react";
import ForexMatchmakingDialog from "@/components/ForexMatchmakingDialog";
import ForexProviderDialog from "@/components/ForexProviderDialog";
import ForexMoneyProviderDialog from "@/components/ForexMoneyProviderDialog";

const ForexDashboard = () => {
  const navigate = useNavigate();
  const [matchmakingDialog, setMatchmakingDialog] = useState<{
    isOpen: boolean;
    opportunity: any;
  }>({ isOpen: false, opportunity: null });
  const [providerDialog, setProviderDialog] = useState<{
    isOpen: boolean;
    type: 'forex' | 'money';
    opportunity: any;
  }>({ isOpen: false, type: 'forex', opportunity: null });

  const opportunities = [
    {
      id: 1,
      brokerA: "FXCM",
      brokerB: "IG Markets",
      currencyPair: "EUR/USD",
      rateA: 1.0845,
      rateB: 1.0851,
      profitMargin: "0.55",
      poolSize: 75000,
      volume: 75000, // USD volume
      userRole: Math.random() > 0.5 ? "Forex Provider" : "Money Provider",
      userBroker: Math.random() > 0.5 ? "FXCM" : "IG Markets",
      investmentAmount: 75000,
      profitAmount: 413.25,
      userProfitMargin: "0.18"
    },
    {
      id: 2,
      brokerA: "Interactive Brokers",
      brokerB: "XM",
      currencyPair: "GBP/JPY",
      rateA: 195.42,
      rateB: 195.58,
      profitMargin: "0.82",
      poolSize: 50000,
      volume: 50000, // USD volume
      userRole: Math.random() > 0.5 ? "Forex Provider" : "Money Provider",
      userBroker: Math.random() > 0.5 ? "Interactive Brokers" : "XM",
      investmentAmount: 50000,
      profitAmount: 410.00,
      userProfitMargin: "0.27"
    },
    {
      id: 3,
      brokerA: "Pepperstone",
      brokerB: "Oanda",
      currencyPair: "USD/CHF",
      rateA: 0.8742,
      rateB: 0.8748,
      profitMargin: "0.69",
      poolSize: 30000,
      volume: 30000, // USD volume
      userRole: Math.random() > 0.5 ? "Forex Provider" : "Money Provider",
      userBroker: Math.random() > 0.5 ? "Pepperstone" : "Oanda",
      investmentAmount: 30000,
      profitAmount: 207.00,
      userProfitMargin: "0.23"
    }
  ];

  const handleLockOpportunity = (opportunity: any) => {
    setMatchmakingDialog({
      isOpen: true,
      opportunity
    });
  };

  const handleMatchFound = () => {
    setMatchmakingDialog({ isOpen: false, opportunity: null });
    const opportunity = matchmakingDialog.opportunity;
    setProviderDialog({
      isOpen: true,
      type: opportunity.userRole === "Forex Provider" ? 'forex' : 'money',
      opportunity
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Forex Dashboard</h1>
            <p className="text-muted-foreground">Real-time forex arbitrage opportunities</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
          >
            Back to Login
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <Badge variant="outline" className="text-xs">
                    {opportunity.currencyPair}
                  </Badge>
                </div>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  +{opportunity.profitMargin}%
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="text-center">
                  <h3 className="font-semibold text-lg">
                    {opportunity.brokerA} vs {opportunity.brokerB}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {opportunity.rateA} → {opportunity.rateB}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Pool Size</p>
                    <p className="font-semibold text-primary">
                      ${opportunity.poolSize.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Your Role</p>
                    <p className="font-semibold">
                      {opportunity.userRole}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Your Broker</p>
                    <p className="font-semibold">{opportunity.userBroker}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Your Profit</p>
                    <p className="font-bold text-success">
                      ${opportunity.profitAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={() => handleLockOpportunity(opportunity)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Lock Opportunity
              </Button>
            </Card>
          ))}
        </div>

        <ForexMatchmakingDialog
          isOpen={matchmakingDialog.isOpen}
          onClose={() => setMatchmakingDialog({ isOpen: false, opportunity: null })}
          onMatchFound={handleMatchFound}
          opportunity={matchmakingDialog.opportunity}
        />

        <ForexProviderDialog
          isOpen={providerDialog.isOpen && providerDialog.type === 'forex'}
          onClose={() => setProviderDialog({ isOpen: false, type: 'forex', opportunity: null })}
          opportunity={providerDialog.opportunity}
        />

        <ForexMoneyProviderDialog
          isOpen={providerDialog.isOpen && providerDialog.type === 'money'}
          onClose={() => setProviderDialog({ isOpen: false, type: 'money', opportunity: null })}
          opportunity={providerDialog.opportunity}
        />
      </div>
    </div>
  );
};

export default ForexDashboard;