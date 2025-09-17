import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const bookmakers = [
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
];

const Login = () => {
  const [name, setName] = useState("");
  const [selectedBookmaker, setSelectedBookmaker] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (name && selectedBookmaker) {
      localStorage.setItem("userName", name);
      localStorage.setItem("userBookmaker", selectedBookmaker);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-background/95 backdrop-blur border-primary/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Coop-Arbitrage</h1>
          <p className="text-muted-foreground">Join the risk-free betting revolution</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bookmaker">Your Bookmaker Account</Label>
            <Select value={selectedBookmaker} onValueChange={setSelectedBookmaker}>
              <SelectTrigger>
                <SelectValue placeholder="Select your bookmaker" />
              </SelectTrigger>
              <SelectContent>
                {bookmakers.map((bookmaker) => (
                  <SelectItem key={bookmaker.id} value={bookmaker.id}>
                    <span className="flex items-center gap-2">
                      {bookmaker.country} {bookmaker.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleLogin} 
            disabled={!name || !selectedBookmaker}
            className="w-full"
            variant="hero"
            size="lg"
          >
            Start Trading
          </Button>
        </div>

        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/info")}
            className="text-primary hover:text-primary/80"
          >
            Learn How It Works
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;