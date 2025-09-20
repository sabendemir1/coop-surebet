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
  const [countdown, setCountdown] = useState(60); // 60 seconds
  const [isExecuting, setIsExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setCountdown(60);
      setIsExecuting(false);
      setExecuted(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-cancel if timeout
          toast({
            title: "Execution Timeout",
            description: "Bet execution window closed. Match cancelled with full refund.",
            variant: "destructive",
          });
          setTimeout(() => onClose(), 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose, toast]);

  const handleExecute = () => {
    setIsExecuting(true);
    
    // Simulate bet execution
    setTimeout(() => {
      setExecuted(true);
      setIsExecuting(false);
      toast({
        title: "Bet Executed Successfully!",
        description: `Deposit of $${opportunity.depositAmount.toFixed(2)} processed. Awaiting match result.`,
      });
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 2000);
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
          {/* Countdown */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-orange-500 bg-orange-100 flex items-center justify-center">
              <div className="text-xl font-bold text-orange-600">
                {countdown}
              </div>
            </div>
            <p className="text-lg font-semibold">Execute Your Bet Immediately!</p>
            <p className="text-sm text-muted-foreground">
              {formatTime(countdown)} remaining
            </p>
          </div>

          {/* Critical Alert */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">
              <strong>CRITICAL:</strong> Confirm your bet on {opportunity.userBookmaker} NOW! 
              Both players must execute within 60 seconds.
            </AlertDescription>
          </Alert>

          {/* Bet Details */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Confirm These Details:</h3>
            
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
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Total Deposit:</span>
                <span className="font-bold text-profit">${opportunity.depositAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Execution Status */}
          {executed ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Success!</strong> Your bet has been executed and deposit processed.
              </AlertDescription>
            </Alert>
          ) : (
            <Button 
              variant="default" 
              size="lg"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg py-6"
              onClick={handleExecute}
              disabled={isExecuting || countdown <= 0}
            >
              {isExecuting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Bet...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  EXECUTE BET NOW - ${opportunity.depositAmount.toFixed(2)}
                </>
              )}
            </Button>
          )}

          {countdown <= 0 && !executed && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Execution window expired. Match cancelled with full refund.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExecutionDialog;