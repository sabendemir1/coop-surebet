import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExecutionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  opportunity: {
    userTeam: string;
    userBookmaker: string;
    userOdd: number;
    stakeAmount: number;
    depositAmount: number;
  };
}

const ExecutionDialog = ({ isOpen, onClose, onComplete, opportunity }: ExecutionDialogProps) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [opponentReady, setOpponentReady] = useState(Math.random() > 0.5); // 50/50 chance
  const [userReady, setUserReady] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setIsExecuting(false);
      setExecuted(false);
      setOpponentReady(Math.random() > 0.5); // Reset opponent readiness 50/50
      setUserReady(true);
      return;
    }

    // If opponent is not ready, make them ready after 2 seconds
    if (!opponentReady) {
      const timer = setTimeout(() => {
        setOpponentReady(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, opponentReady]);

  const handleComplete = () => {
    setIsExecuting(true);
    
    // Simulate bet completion
    setTimeout(() => {
      setExecuted(true);
      setIsExecuting(false);
      toast({
        title: "Bet Completed Successfully!",
        description: `Your bet of $${opportunity.stakeAmount.toFixed(2)} has been placed. Awaiting match result.`,
      });
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isExecuting ? onClose : undefined}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Zap className="h-5 w-5 text-orange-500" />
            Execute Bet Now!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Player Status */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-700">You</span>
              </div>
              <p className="text-sm text-green-600">Ready to execute</p>
            </div>
            <div className={`p-3 rounded-lg ${opponentReady ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                {opponentReady ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-600" />
                )}
                <span className={`font-semibold ${opponentReady ? 'text-green-700' : 'text-yellow-700'}`}>Opponent</span>
              </div>
              <p className={`text-sm ${opponentReady ? 'text-green-600' : 'text-yellow-600'}`}>
                {opponentReady ? 'Ready to execute' : 'Getting ready...'}
              </p>
            </div>
          </div>

          {/* Deposit Confirmation */}
          <Alert className="border-blue-200 bg-blue-50">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 font-medium">
              <strong>DEPOSIT PROCESSED:</strong> Your ${opportunity.depositAmount.toFixed(2)} deposit has been secured. 
              Now place your bet on {opportunity.userBookmaker}.
            </AlertDescription>
          </Alert>

          {/* Bet Details */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Place This Bet Now:</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team:</span>
                <span className="font-bold">{opportunity.userTeam}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Odds:</span>
                <span className="font-bold">@{opportunity.userOdd}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bet Amount:</span>
                <span className="font-bold text-success">${opportunity.stakeAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bookmaker:</span>
                <span className="font-bold">{opportunity.userBookmaker}</span>
              </div>
            </div>
          </div>

          {/* Completion Status */}
          {executed ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Success!</strong> Your bet has been placed. Awaiting match result.
              </AlertDescription>
            </Alert>
          ) : (
            <Button 
              variant="default" 
              size="lg"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg py-6"
              onClick={handleComplete}
              disabled={isExecuting || !opponentReady}
            >
              {isExecuting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Confirming bet placement...
                </>
              ) : !opponentReady ? (
                <>
                  <Clock className="w-5 h-5 mr-2" />
                  Waiting for opponent...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  I finished my bet
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExecutionDialog;