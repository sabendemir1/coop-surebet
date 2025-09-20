import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, ExternalLink, AlertTriangle, CheckCircle, Users, X } from "lucide-react";

interface PreparationScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onReady: () => void;
  opportunity: {
    teamA: string;
    teamB: string;
    sport: string;
    userTeam: string;
    userBookmaker: string;
    userOdd: number;
    stakeAmount: number;
    profitMargin: string;
  };
}

const PreparationScreen = ({ isOpen, onClose, onReady, opportunity }: PreparationScreenProps) => {
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [opponentReady, setOpponentReady] = useState(false);
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(120);
      setOpponentReady(false);
      setUserReady(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-cancel if timeout
          setTimeout(() => onClose(), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate opponent actions randomly
    const opponentTimer = setTimeout(() => {
      setOpponentReady(Math.random() > 0.3); // 70% chance opponent gets ready
    }, Math.random() * 60000 + 30000); // Between 30-90 seconds

    return () => {
      clearInterval(timer);
      clearTimeout(opponentTimer);
    };
  }, [isOpen, onClose]);

  const handleReady = () => {
    setUserReady(true);
    onReady();
  };

  const handleSkip = () => {
    setCountdown(0);
    handleReady();
  };

  const getBookmakerURL = (bookmakerName: string) => {
    const name = bookmakerName.toLowerCase().replace(/\s+/g, '');
    return `https://${name}.com`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Prepare Your Bet
            </DialogTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-orange-500">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(countdown)}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning Alert */}
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 font-medium">
              <strong>IMPORTANT:</strong> Prepare your bet slip but DO NOT confirm the bet yet! 
              Wait for the synchronized "GO" signal.
            </AlertDescription>
          </Alert>

          {/* Player Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border-2 ${userReady ? 'border-green-300 bg-green-50' : 'border-muted bg-muted/30'}`}>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">You</span>
                {userReady && <CheckCircle className="h-4 w-4 text-green-600" />}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {userReady ? "Ready to execute" : "Preparing bet..."}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${opponentReady ? 'border-green-300 bg-green-50' : 'border-muted bg-muted/30'}`}>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">Opponent</span>
                {opponentReady && <CheckCircle className="h-4 w-4 text-green-600" />}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {opponentReady ? "Ready to execute" : "Preparing bet..."}
              </p>
            </div>
          </div>

          {/* Bet Instructions */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4 text-primary">Your Betting Instructions</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Match:</p>
                  <p className="font-semibold">{opportunity.teamA} vs {opportunity.teamB}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sport:</p>
                  <Badge variant="outline">{opportunity.sport}</Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Bet On:</p>
                    <p className="font-bold text-lg">{opportunity.userTeam}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Odds:</p>
                    <p className="font-bold text-lg">@{opportunity.userOdd}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Bet Amount:</p>
                    <p className="font-bold text-xl text-success">${opportunity.stakeAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bookmaker:</p>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{opportunity.userBookmaker}</p>
                      <a 
                        href={getBookmakerURL(opportunity.userBookmaker)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded border transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open Site
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expected Profit */}
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <h4 className="font-semibold text-success mb-2">Expected Profit</h4>
            <div className="flex justify-between items-center">
              <span>Profit Margin:</span>
              <Badge variant="secondary" className="bg-success/20 text-success">
                +{opportunity.profitMargin}%
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSkip} disabled={userReady}>
              Skip Wait
            </Button>
            <Button 
              variant="default" 
              className="flex-1" 
              onClick={handleReady}
              disabled={userReady}
            >
              {userReady ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Ready - Waiting for opponent
                </>
              ) : (
                "I'm Ready to Execute"
              )}
            </Button>
          </div>

          {countdown <= 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Preparation time expired. Matchmaking cancelled.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreparationScreen;