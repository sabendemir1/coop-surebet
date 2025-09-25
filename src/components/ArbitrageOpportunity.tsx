import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calculator, Clock, Lock, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MatchmakingDialog from "./MatchmakingDialog";
import PreparationScreen from "./PreparationScreen";
import ExecutionDialog from "./ExecutionDialog";

interface ArbitrageOpportunityProps {
  opportunity: {
    id: string;
    matchId: string;
    teamA: string;
    teamB: string;
    sport: string;
    bookmakerA: string;
    bookmakerB: string;
    oddA: number;
    oddB: number;
    totalPool: number;
    expiresIn: number;
    oddType: string;
    overUnderValue?: number | null;
  };
  userBookmaker: string;
}

const ArbitrageOpportunity = ({ opportunity, userBookmaker }: ArbitrageOpportunityProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isMatchmakingOpen, setIsMatchmakingOpen] = useState(false);
  const [isPreparationOpen, setIsPreparationOpen] = useState(false);
  const [isExecutionOpen, setIsExecutionOpen] = useState(false);
  const [gameStatus, setGameStatus] = useState<'none' | 'matched' | 'preparing' | 'executing' | 'complete'>('none');
  const { toast } = useToast();

  // Convert bookmaker name to website URL
  const getBookmakerURL = (bookmakerName: string) => {
    const name = bookmakerName.toLowerCase().replace(/\s+/g, '');
    return `https://${name}.com`;
  };

  const { teamA, teamB, sport, bookmakerA, bookmakerB, oddA, oddB, totalPool, oddType, overUnderValue } = opportunity;

  // Get bet type display info
  const getBetTypeDisplay = () => {
    switch (oddType) {
      case "wins": return { sideA: `${teamA} Win`, sideB: `${teamB} Win` };
      case "total_fouls": return { sideA: `Over ${overUnderValue}`, sideB: `Under ${overUnderValue}` };
      case "total_goals": return { sideA: `Over ${overUnderValue}`, sideB: `Under ${overUnderValue}` };
      case "total_shots": return { sideA: `Over ${overUnderValue}`, sideB: `Under ${overUnderValue}` };
      case "total_shots_target": return { sideA: `Over ${overUnderValue}`, sideB: `Under ${overUnderValue}` };
      case "handicap_a": return { sideA: `${teamA} (+0.5)`, sideB: `${teamA} (-0.5)` };
      case "handicap_b": return { sideA: `${teamB} (+0.5)`, sideB: `${teamB} (-0.5)` };
      case "team_a_goals": return { sideA: `Over ${overUnderValue}`, sideB: `Under ${overUnderValue}` };
      case "team_a_shots": return { sideA: `Over ${overUnderValue}`, sideB: `Under ${overUnderValue}` };
      case "team_a_shots_target": return { sideA: `Over ${overUnderValue}`, sideB: `Under ${overUnderValue}` };
      case "team_b_goals": return { sideA: `Over ${overUnderValue}`, sideB: `Under ${overUnderValue}` };
      case "team_b_shots": return { sideA: `Over ${overUnderValue}`, sideB: `Under ${overUnderValue}` };
      case "team_b_shots_target": return { sideA: `Over ${overUnderValue}`, sideB: `Under ${overUnderValue}` };
      case "corner_kicks": return { sideA: `Over ${overUnderValue}`, sideB: `Under ${overUnderValue}` };
      case "yellow_cards": return { sideA: `Over ${overUnderValue}`, sideB: `Under ${overUnderValue}` };
      case "first_half_goals": return { sideA: `Over ${overUnderValue}`, sideB: `Under ${overUnderValue}` };
      case "possession_winner": return { sideA: `${teamA} Higher`, sideB: `${teamB} Higher` };
      default: return { sideA: `${teamA} Win`, sideB: `${teamB} Win` };
    }
  };

  const getBetTypeTitle = () => {
    switch (oddType) {
      case "wins": return "Match Winner";
      case "total_fouls": return "Total Fouls";
      case "total_goals": return "Total Goals";
      case "total_shots": return "Total Shots";
      case "total_shots_target": return "Total Shots on Target";
      case "handicap_a": return `${teamA} Handicap`;
      case "handicap_b": return `${teamB} Handicap`;
      case "team_a_goals": return `${teamA} Goals`;
      case "team_a_shots": return `${teamA} Shots`;
      case "team_a_shots_target": return `${teamA} Shots on Target`;
      case "team_b_goals": return `${teamB} Goals`;
      case "team_b_shots": return `${teamB} Shots`;
      case "team_b_shots_target": return `${teamB} Shots on Target`;
      case "corner_kicks": return "Total Corner Kicks";
      case "yellow_cards": return "Total Yellow Cards";
      case "first_half_goals": return "First Half Goals";
      case "possession_winner": return "Ball Possession Winner";
      default: return "Match Winner";
    }
  };

  const betDisplay = getBetTypeDisplay();
  
  // Calculate arbitrage
  const arbitrageFormula = (1 / oddA) + (1 / oddB);
  const profitMargin = ((1 - arbitrageFormula) * 100).toFixed(2);
  
  // Determine user's side
  const isUserOnSideA = bookmakerA.toLowerCase().includes(userBookmaker.toLowerCase());
  const userOdd = isUserOnSideA ? oddA : oddB;
  const userTeam = isUserOnSideA ? teamA : teamB;
  const userBookmakerName = isUserOnSideA ? bookmakerA : bookmakerB;
  
  // Calculate stakes for both sides
  const stakeA = (totalPool / oddA) / arbitrageFormula;
  const stakeB = (totalPool / oddB) / arbitrageFormula;
  
  // User's profit share based on their stake proportion (after 33% platform commission)
  const userStake = isUserOnSideA ? stakeA : stakeB;
  const totalStakes = stakeA + stakeB;
  const userStakeRatio = userStake / totalStakes;
  const profitAfterCommission = parseFloat(profitMargin) * 0.67; // 67% after platform takes 33%
  const userProfitShare = (profitAfterCommission * userStakeRatio).toFixed(2);
  
  // Calculate stakes and deposit
  const stakeAmount = userStake;
  const oppositeStake = isUserOnSideA ? stakeB : stakeA;
  const totalEdgeProfit = totalPool * parseFloat(profitMargin) / 100;
  const depositAmount = oppositeStake + totalEdgeProfit;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLock = () => {
    setIsMatchmakingOpen(true);
    setGameStatus('none');
  };

  const handleMatchFound = () => {
    setIsMatchmakingOpen(false);
    setIsPreparationOpen(true);
    setGameStatus('matched');
    toast({
      title: "Match Found!",
      description: "Opponent found! Prepare your bet slip now.",
    });
  };

  const handleReady = () => {
    setIsPreparationOpen(false);
    setIsExecutionOpen(true);
    setGameStatus('executing');
  };

  const handleExecutionComplete = () => {
    setIsExecutionOpen(false);
    setGameStatus('complete');
    toast({
      title: "Arbitrage Complete!",
      description: "Both bets executed successfully. Awaiting match result.",
    });
  };

  const handleCloseDialogs = () => {
    setIsMatchmakingOpen(false);
    setIsPreparationOpen(false);
    setIsExecutionOpen(false);
    setGameStatus('none');
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-trust/10 border-trust/30">
            {sport}
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 border-primary/30">
            {getBetTypeTitle()}
          </Badge>
          <h3 className="font-semibold text-lg text-foreground">
            {teamA} vs {teamB}
          </h3>
          <Badge variant="secondary" className="bg-success/20 text-success">
            +{profitMargin}% Profit (You get +{userProfitShare}%)
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Pool Size</p>
            <p className="font-bold text-profit">${totalPool.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 text-orange-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{formatTime(opportunity.expiresIn)}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Betting Options */}
        <div className="space-y-3">
          <div className={`p-4 rounded-lg border-2 ${isUserOnSideA ? 'border-primary bg-primary/5' : 'border-muted bg-muted/30'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{betDisplay.sideA}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{bookmakerA}</p>
                  <a 
                    href={getBookmakerURL(bookmakerA)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted/50 hover:bg-muted rounded border transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {bookmakerA.toLowerCase().replace(/\s+/g, '')}.com
                  </a>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">@{oddA}</p>
                {isUserOnSideA && (
                  <Badge variant="default" className="mt-1">Your Side</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border-2 ${!isUserOnSideA ? 'border-primary bg-primary/5' : 'border-muted bg-muted/30'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{betDisplay.sideB}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{bookmakerB}</p>
                  <a 
                    href={getBookmakerURL(bookmakerB)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted/50 hover:bg-muted rounded border transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {bookmakerB.toLowerCase().replace(/\s+/g, '')}.com
                  </a>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">@{oddB}</p>
                {!isUserOnSideA && (
                  <Badge variant="default" className="mt-1">Your Side</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Your Action Panel */}
        <div className={`p-4 rounded-lg border ${
          gameStatus === 'none' ? 'bg-gradient-profit/10 border-profit/20' :
          gameStatus === 'matched' ? 'bg-blue-100 border-blue-300' :
          gameStatus === 'executing' ? 'bg-orange-100 border-orange-300' :
          gameStatus === 'complete' ? 'bg-green-100 border-green-300' :
          'bg-yellow-100 border-yellow-300'
        }`}>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            {gameStatus === 'none' ? `Your Position: ${isUserOnSideA ? betDisplay.sideA : betDisplay.sideB}` :
             gameStatus === 'matched' ? 'Match found - Preparing...' :
             gameStatus === 'executing' ? 'Executing bets...' :
             gameStatus === 'complete' ? 'Arbitrage Complete!' :
             'Finding opponent...'}
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Your Bookmaker:</span>
              <span className="font-medium">{userBookmakerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Your Odds:</span>
              <span className="font-medium">@{userOdd}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Bet Amount:</span>
              <span className="font-bold text-success">${stakeAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Total Deposit:</span>
              <span className="font-bold text-profit">${depositAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm">Your Profit:</span>
              <span className="font-bold text-success">
                ${((totalPool * parseFloat(profitMargin) / 100) * userStakeRatio * 0.67).toFixed(2)} 
                (+{userProfitShare}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {gameStatus === 'none' ? (
          <>
            <Button 
              variant="hero" 
              className="flex-1"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'View Details'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {showDetails && (
              <Button 
                variant="default" 
                size="lg"
                onClick={handleLock}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Lock className="w-4 h-4 mr-2" />
                Lock Position
              </Button>
            )}
          </>
        ) : (
          <Button variant="outline" className="flex-1" disabled>
            {gameStatus === 'matched' ? 'Preparing Bet...' :
             gameStatus === 'executing' ? 'Executing...' :
             gameStatus === 'complete' ? 'Complete ✓' :
             'In Progress...'}
          </Button>
        )}
      </div>

      {/* Expanded Details */}
      {showDetails && gameStatus === 'none' && (
        <div className="mt-6 pt-6 border-t space-y-6">
          {/* Guaranteed Returns */}
          <div className="bg-success/10 p-4 rounded-lg border border-success/20">
            <h5 className="font-semibold text-success mb-2">Expected Returns</h5>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Your Investment:</p>
                <p className="font-bold">${stakeAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Expected Return:</p>
                <p className="font-bold text-success">
                  ${(stakeAmount + (totalPool * parseFloat(profitMargin) / 100) * userStakeRatio * 0.67).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Your Profit:</p>
                <p className="font-bold text-success">
                  ${((totalPool * parseFloat(profitMargin) / 100) * userStakeRatio * 0.67).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <MatchmakingDialog
        isOpen={isMatchmakingOpen}
        onClose={handleCloseDialogs}
        onMatchFound={handleMatchFound}
        opportunity={{
          teamA,
          teamB,
          sport,
          oddA,
          oddB,
          profitMargin,
          userTeam,
          userBookmaker: userBookmakerName,
          userOdd,
          stakeAmount,
          depositAmount,
          profitAmount: ((totalPool * parseFloat(profitMargin) / 100) * userStakeRatio * 0.67),
          userProfitMargin: userProfitShare,
        }}
      />

      <PreparationScreen
        isOpen={isPreparationOpen}
        onClose={handleCloseDialogs}
        onReady={handleReady}
        opportunity={{
          teamA,
          teamB,
          sport,
          userTeam,
          userBookmaker: userBookmakerName,
          userOdd,
          stakeAmount,
          profitMargin,
        }}
      />

      <ExecutionDialog
        isOpen={isExecutionOpen}
        onClose={handleCloseDialogs}
        onComplete={handleExecutionComplete}
        opportunity={{
          userTeam,
          userBookmaker: userBookmakerName,
          userOdd,
          stakeAmount,
          depositAmount,
        }}
      />
    </Card>
  );
};

export default ArbitrageOpportunity;