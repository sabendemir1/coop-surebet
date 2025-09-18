import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Upload, Calculator, DollarSign, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ArbitrageOpportunityProps {
  opportunity: {
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
  };
  userBookmaker: string;
}

const ArbitrageOpportunity = ({ opportunity, userBookmaker }: ArbitrageOpportunityProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [proofUploaded, setProofUploaded] = useState(false);
  const [depositStatus, setDepositStatus] = useState<'none' | 'waiting' | 'complete'>('none');
  const { toast } = useToast();

  const { homeTeam, awayTeam, sport, homeBet, awayBet, drawBet, totalStake, profitMargin, expectedProfit, minDeposit, expiresAt } = opportunity;
  
  // Calculate profit margin percentage
  const profitPercent = (profitMargin * 100).toFixed(2);
  
  // Determine user's side
  const isUserOnHomeTeam = homeBet.bookmaker.toLowerCase().includes(userBookmaker.toLowerCase());
  const isUserOnAwayTeam = awayBet.bookmaker.toLowerCase().includes(userBookmaker.toLowerCase());
  const isUserOnDraw = drawBet && drawBet.bookmaker.toLowerCase().includes(userBookmaker.toLowerCase());
  
  let userBet, userTeam, opposingBets;
  
  if (isUserOnHomeTeam) {
    userBet = homeBet;
    userTeam = homeTeam;
    opposingBets = [awayBet, ...(drawBet ? [drawBet] : [])];
  } else if (isUserOnAwayTeam) {
    userBet = awayBet;
    userTeam = awayTeam;
    opposingBets = [homeBet, ...(drawBet ? [drawBet] : [])];
  } else if (isUserOnDraw && drawBet) {
    userBet = drawBet;
    userTeam = "Draw";
    opposingBets = [homeBet, awayBet];
  } else {
    // Fallback if no exact match - use the first bet that partially matches
    userBet = homeBet;
    userTeam = homeTeam;
    opposingBets = [awayBet, ...(drawBet ? [drawBet] : [])];
  }
  
  // Calculate time remaining until expiry
  const timeUntilExpiry = () => {
    const now = new Date().getTime();
    const expiryTime = new Date(expiresAt).getTime();
    const timeDiff = Math.max(0, Math.floor((expiryTime - now) / 1000));
    return timeDiff;
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDeposit = () => {
    setDepositStatus('waiting');
    toast({
      title: "Deposit Initiated",
      description: `Depositing $${minDeposit.toFixed(2)} - Waiting for other player`,
    });
    
    // Simulate matching with another player after 5 seconds
    setTimeout(() => {
      setDepositStatus('complete');
      toast({
        title: "Match Found!",
        description: "Both players have placed their bets. Good luck!",
      });
    }, 5000);
  };

  const handleProofUpload = () => {
    setProofUploaded(true);
    toast({
      title: "Proof Uploaded",
      description: "Bet verification successful. Awaiting match result.",
    });
  };

  const remainingTime = timeUntilExpiry();

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-trust/10 border-trust/30">
            {sport}
          </Badge>
          <h3 className="font-semibold text-lg text-foreground">
            {homeTeam} vs {awayTeam}
          </h3>
          <Badge variant="secondary" className="bg-success/20 text-success">
            +{profitPercent}% Profit
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Pool Size</p>
            <p className="font-bold text-profit">${totalStake.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 text-orange-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{formatTime(remainingTime)}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Betting Options */}
        <div className="space-y-3">
          <div className={`p-4 rounded-lg border-2 ${isUserOnHomeTeam ? 'border-primary bg-primary/5' : 'border-muted bg-muted/30'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{homeTeam} Win</p>
                <p className="text-sm text-muted-foreground">{homeBet.bookmaker}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">@{homeBet.odds}</p>
                {isUserOnHomeTeam && (
                  <Badge variant="default" className="mt-1">Your Side</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border-2 ${isUserOnAwayTeam ? 'border-primary bg-primary/5' : 'border-muted bg-muted/30'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{awayTeam} Win</p>
                <p className="text-sm text-muted-foreground">{awayBet.bookmaker}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">@{awayBet.odds}</p>
                {isUserOnAwayTeam && (
                  <Badge variant="default" className="mt-1">Your Side</Badge>
                )}
              </div>
            </div>
          </div>

          {drawBet && (
            <div className={`p-4 rounded-lg border-2 ${isUserOnDraw ? 'border-primary bg-primary/5' : 'border-muted bg-muted/30'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Draw</p>
                  <p className="text-sm text-muted-foreground">{drawBet.bookmaker}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">@{drawBet.odds}</p>
                  {isUserOnDraw && (
                    <Badge variant="default" className="mt-1">Your Side</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Your Action Panel */}
        <div className={`p-4 rounded-lg border ${
          depositStatus === 'none' ? 'bg-gradient-profit/10 border-profit/20' :
          depositStatus === 'waiting' ? 'bg-yellow-100 border-yellow-300' :
          'bg-green-100 border-green-300'
        }`}>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            {depositStatus === 'none' ? `Your Position: ${userTeam}` :
             depositStatus === 'waiting' ? 'Waiting for other player...' :
             'Both players bet!'}
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Your Bookmaker:</span>
              <span className="font-medium">{userBet.bookmaker}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Your Odds:</span>
              <span className="font-medium">@{userBet.odds}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm">Amount to Play:</span>
              <span className="font-bold text-success">${userBet.stake.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Your Investment:</span>
              <span className="font-bold text-profit">${userBet.stake.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="hero" 
          className="flex-1"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Play'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="mt-6 pt-6 border-t space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Deposit Section */}
            <div className="space-y-4">
              <h5 className="font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Step 1: Secure Your Position
              </h5>
              
              <div className="space-y-3">
                <div className="p-3 bg-background rounded border">
                  <Label className="text-sm">Required Deposit</Label>
                  <p className="text-lg font-bold text-profit">${minDeposit.toFixed(2)}</p>
                </div>
                
                <Button 
                  variant="profit" 
                  className="w-full" 
                  size="lg"
                  onClick={handleDeposit}
                >
                  Deposit ${minDeposit.toFixed(2)}
                </Button>
              </div>
            </div>

            {/* Proof Section */}
            <div className="space-y-4">
              <h5 className="font-semibold flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Step 2: Upload Bet Proof
              </h5>
              
              <div className="space-y-3">
                <div className="p-3 bg-background rounded border">
                  <Label className="text-sm">Bet Amount on {userBet.bookmaker}</Label>
                  <p className="text-lg font-bold text-success">${userBet.stake.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Bet on: {userTeam} @ {userBet.odds}
                  </p>
                </div>
                
                {!proofUploaded ? (
                  <Button 
                    variant="success" 
                    className="w-full" 
                    size="lg"
                    onClick={handleProofUpload}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Screenshot/Proof
                  </Button>
                ) : (
                  <Button 
                    variant="success" 
                    className="w-full" 
                    size="lg"
                    disabled
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Proof Verified
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Guaranteed Returns */}
          <div className="bg-success/10 p-4 rounded-lg border border-success/20">
            <h5 className="font-semibold text-success mb-2">Guaranteed Returns</h5>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Your Investment:</p>
                <p className="font-bold">${userBet.stake.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Guaranteed Return:</p>
                <p className="font-bold text-success">
                  ${(userBet.stake + expectedProfit).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Your Profit:</p>
                <p className="font-bold text-success">
                  ${expectedProfit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ArbitrageOpportunity;