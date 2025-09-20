import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Target, X } from "lucide-react";

interface MatchmakingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMatchFound: () => void;
  opportunity: {
    teamA: string;
    teamB: string;
    sport: string;
    oddA: number;
    oddB: number;
    profitMargin: string;
    userTeam: string;
    userBookmaker: string;
    userOdd: number;
    stakeAmount: number;
    depositAmount: number;
    profitAmount: number;
    userProfitMargin: string;
  };
}

const MatchmakingDialog = ({ isOpen, onClose, onMatchFound, opportunity }: MatchmakingDialogProps) => {
  const [countdown, setCountdown] = useState(30);
  const [isMatching, setIsMatching] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(30);
      setIsMatching(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsMatching(false);
          setTimeout(() => onClose(), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate finding a match randomly between 5-25 seconds
    const matchTime = Math.random() * 20000 + 5000;
    const matchTimer = setTimeout(() => {
      if (countdown > 0) {
        clearInterval(timer);
        onMatchFound();
      }
    }, matchTime);

    return () => {
      clearInterval(timer);
      clearTimeout(matchTimer);
    };
  }, [isOpen, onClose, onMatchFound]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Finding Match
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Countdown */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-primary/20 bg-primary/10 flex items-center justify-center">
              <div className="text-2xl font-bold text-primary">
                {isMatching ? countdown : "0"}
              </div>
            </div>
            <p className="text-lg font-semibold">
              {isMatching ? "Searching for opponent..." : "No match found"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isMatching ? `${countdown} seconds remaining` : "Try again later"}
            </p>
          </div>

          {/* Match Details */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Your Match Details
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Match:</span>
                <span className="font-medium">{opportunity.teamA} vs {opportunity.teamB}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sport:</span>
                <Badge variant="outline">{opportunity.sport}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Side:</span>
                <span className="font-medium">{opportunity.userTeam}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Bookmaker:</span>
                <span className="font-medium">{opportunity.userBookmaker}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Odds:</span>
                <span className="font-bold">@{opportunity.userOdd}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm text-muted-foreground">Bet Amount:</span>
                <span className="font-bold text-success">${opportunity.stakeAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Deposit:</span>
                <span className="font-bold text-profit">${opportunity.depositAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Profit:</span>
                <span className="font-bold text-success">${opportunity.profitAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm text-muted-foreground">Total Profit Margin:</span>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  +{opportunity.profitMargin}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Profit Margin:</span>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  +{opportunity.userProfitMargin}%
                </Badge>
              </div>
            </div>
          </div>

          {/* Loading indicator */}
          {isMatching && (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">Matching you with another player...</span>
            </div>
          )}

          {/* Cancel button */}
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancel Matchmaking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchmakingDialog;