import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const tradingAreas = [
  { id: "sports", name: "Sports Betting", icon: "🏈" }
];

const accountsByArea = {
  sports: [
    { id: "bet365", name: "Bet365 (UK)", country: "🇬🇧" },
    { id: "pinnacle", name: "Pinnacle (Curacao)", country: "🇨🇼" },
    { id: "betfair", name: "Betfair (UK)", country: "🇬🇧" },
    { id: "unibet", name: "Unibet (Malta)", country: "🇲🇹" },
    { id: "betway", name: "Betway (Malta)", country: "🇲🇹" },
    { id: "williamhill", name: "William Hill (UK)", country: "🇬🇧" },
    { id: "bwin", name: "BWin (Austria)", country: "🇦🇹" },
    { id: "betsson", name: "Betsson (Sweden)", country: "🇸🇪" },
    { id: "draftkings", name: "DraftKings (US)", country: "🇺🇸" },
    { id: "fanduel", name: "FanDuel (US)", country: "🇺🇸" },
    { id: "betclic", name: "Betclic (France)", country: "🇫🇷" },
    { id: "stake", name: "Stake (Curacao)", country: "🇨🇼" }
  ]
};

const Login = () => {
  const [name, setName] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (name && selectedArea && selectedAccount) {
      localStorage.setItem("userName", name);
      localStorage.setItem("userArea", selectedArea);
      localStorage.setItem("userAccount", selectedAccount);
      
      navigate("/dashboard");
    }
  };

  const currentAccounts = selectedArea ? accountsByArea[selectedArea as keyof typeof accountsByArea] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6 animate-fade-in">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-10 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Card className="relative w-full max-w-md p-8 bg-background/95 backdrop-blur-xl border-primary/20 shadow-2xl animate-scale-in hover-scale">
        <div className="text-center mb-8">
          <div className="mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <span className="text-2xl font-bold text-primary-foreground">CA</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Welcome to Coop-Arbitrage
          </h1>
          <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Join the risk-free betting revolution
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="transition-all duration-300 focus:scale-[1.02] hover:border-primary/40"
            />
          </div>

          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '1s' }}>
            <Label htmlFor="area">Trading Area</Label>
            <Select value={selectedArea} onValueChange={(value) => {
              setSelectedArea(value);
              setSelectedAccount(""); // Reset account when area changes
            }}>
              <SelectTrigger className="transition-all duration-300 focus:scale-[1.02] hover:border-primary/40">
                <SelectValue placeholder="Select your trading area" />
              </SelectTrigger>
              <SelectContent>
                {tradingAreas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    <span className="flex items-center gap-2">
                      {area.icon} {area.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedArea && (
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: '1.2s' }}>
              <Label htmlFor="account">Your {tradingAreas.find(a => a.id === selectedArea)?.name} Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="transition-all duration-300 focus:scale-[1.02] hover:border-primary/40">
                  <SelectValue placeholder="Select your bookmaker" />
                </SelectTrigger>
                <SelectContent>
                  {currentAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <span className="flex items-center gap-2">
                        {account.country} {account.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="animate-fade-in" style={{ animationDelay: '1.4s' }}>
            <Button 
              onClick={handleLogin} 
              disabled={!name || !selectedArea || !selectedAccount}
              className="w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
              variant="hero"
              size="lg"
            >
              Start Trading
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '1.6s' }}>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/info")}
            className="text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 story-link"
          >
            Learn How It Works
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;