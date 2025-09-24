import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Target, X } from "lucide-react";

interface ForexMatchmakingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMatchFound: () => void;
  opportunity: {
    brokerA: string;
    brokerB: string;
    currencyPair: string;
    rateA: number;
    rateB: number;
    profitMargin: string;
    userRole: string;
    userBroker: string;
    volume: number;
    investmentAmount: number;
    profitAmount: number;
    userProfitMargin: string;
  };
}

const ForexMatchmakingDialog = ({ isOpen, onClose, onMatchFound, opportunity }: ForexMatchmakingDialogProps) => {
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

  if (!opportunity) return null;

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
                <span className="font-medium">{opportunity.brokerA} vs {opportunity.brokerB}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type:</span>
                <Badge variant="outline">Forex</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pair:</span>
                <Badge variant="secondary">{opportunity.currencyPair}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Role:</span>
                <span className="font-medium">{opportunity.userRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Broker:</span>
                <span className="font-medium">{opportunity.userBroker}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rate Difference:</span>
                <span className="font-bold text-green-400">
                  {opportunity.rateA} → {opportunity.rateB}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm text-muted-foreground">Volume:</span>
                <span className="font-bold text-primary">${opportunity.volume.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Investment Required:</span>
                <span className="font-bold text-orange-400">${opportunity.investmentAmount.toLocaleString()}</span>
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
              <span className="text-sm text-muted-foreground">Matching you with another trader...</span>
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

export default ForexMatchmakingDialog;