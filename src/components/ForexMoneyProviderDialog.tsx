import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, X, DollarSign } from "lucide-react";

interface ForexMoneyProviderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: {
    brokerA: string;
    brokerB: string;
    currencyPair: string;
    rateA: number;
    rateB: number;
    volume: number;
    investmentAmount: number;
    profitAmount: number;
    userProfitMargin: string;
  };
}

type DialogStage = 'confirm_deposit' | 'waiting_for_trade' | 'final_summary';

const ForexMoneyProviderDialog = ({ isOpen, onClose, opportunity }: ForexMoneyProviderDialogProps) => {
  const [stage, setStage] = useState<DialogStage>('confirm_deposit');
  const [waitingCountdown, setWaitingCountdown] = useState(5);

  const handleConfirmDeposit = () => {
    setStage('waiting_for_trade');
    setWaitingCountdown(5);
  };

  useEffect(() => {
    if (stage === 'waiting_for_trade' && waitingCountdown > 0) {
      const timer = setTimeout(() => {
        setWaitingCountdown(waitingCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (stage === 'waiting_for_trade' && waitingCountdown === 0) {
      setStage('final_summary');
    }
  }, [stage, waitingCountdown]);

  const handleClose = () => {
    setStage('confirm_deposit');
    setWaitingCountdown(5);
    onClose();
  };

  if (!opportunity) return null;

  const [baseCurrency, quoteCurrency] = opportunity.currencyPair.split('/');
  const currencyAmount = opportunity.volume / opportunity.rateA;
  const sellValue = currencyAmount * opportunity.rateB;
  const edgeProfit = opportunity.profitAmount / 3;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {stage === 'confirm_deposit' && 'Match Found - Deposit Required'}
              {stage === 'waiting_for_trade' && 'Waiting for Trade'}
              {stage === 'final_summary' && 'Transaction Complete'}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {stage === 'confirm_deposit' && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-400">Match Found!</h3>
              <p className="text-sm text-muted-foreground">You're the Money Provider</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Deposit Required:</span>
                <span className="font-bold">${opportunity.investmentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">You'll Receive:</span>
                <span className="font-bold">{currencyAmount.toFixed(2)} {baseCurrency}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm text-muted-foreground">Can Sell For:</span>
                <span className="font-bold text-green-400">${sellValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Edge Profit (1/3):</span>
                <span className="font-bold text-green-400">+${edgeProfit.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
              <p className="text-sm font-medium text-blue-400">What happens next:</p>
              <ol className="text-xs text-muted-foreground mt-1 space-y-1">
                <li>1. You deposit ${opportunity.investmentAmount.toLocaleString()}</li>
                <li>2. Other user buys {baseCurrency} and sends to platform</li>
                <li>3. You receive {currencyAmount.toFixed(2)} {baseCurrency}</li>
                <li>4. You can sell it for ${sellValue.toFixed(2)}</li>
              </ol>
            </div>

            <Button onClick={handleConfirmDeposit} className="w-full">
              Confirm Deposit
            </Button>
          </div>
        )}

        {stage === 'waiting_for_trade' && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold text-yellow-400">Processing Trade</h3>
              <p className="text-sm text-muted-foreground">
                Waiting for the other user to buy and send {baseCurrency} to platform...
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary/20 bg-primary/10 flex items-center justify-center">
                <div className="text-xl font-bold text-primary">{waitingCountdown}</div>
              </div>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          </div>
        )}

        {stage === 'final_summary' && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-green-400">Transaction Complete!</h3>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Transaction Summary:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Investment:</span>
                  <span>${opportunity.investmentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You Received:</span>
                  <span className="text-green-400">{currencyAmount.toFixed(2)} {baseCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Sell Value:</span>
                  <span className="text-green-400">${sellValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Edge Profit (1/3):</span>
                  <span className="font-bold text-green-400">+${edgeProfit.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
              <p className="text-sm font-medium text-green-400">Ready to Sell!</p>
              <p className="text-xs text-muted-foreground">
                You can now sell your {currencyAmount.toFixed(2)} {baseCurrency} for ${sellValue.toFixed(2)} and keep the profit!
              </p>
            </div>

            <Button onClick={handleClose} className="w-full">
              Complete
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForexMoneyProviderDialog;