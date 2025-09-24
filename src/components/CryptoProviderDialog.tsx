import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Copy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CryptoProviderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: {
    teamA: string;
    teamB: string;
    sport: string;
    cryptoType: string;
    amount: number;
    investmentAmount: number;
    revenueAmount: number;
    profitAmount: number;
    platformWallet: string;
  };
}

type DialogStage = 'buy_confirmation' | 'send_crypto' | 'final_summary';

const CryptoProviderDialog = ({ isOpen, onClose, opportunity }: CryptoProviderDialogProps) => {
  const [stage, setStage] = useState<DialogStage>('buy_confirmation');
  const { toast } = useToast();

  const handleBoughtConfirmed = () => {
    setStage('send_crypto');
  };

  const handleSentAndReceive = () => {
    setStage('final_summary');
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(opportunity.platformWallet);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  const handleClose = () => {
    setStage('buy_confirmation');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {stage === 'buy_confirmation' && 'Match Found - Buy Crypto'}
              {stage === 'send_crypto' && 'Send Crypto to Platform'}
              {stage === 'final_summary' && 'Transaction Complete'}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {stage === 'buy_confirmation' && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-green-400">Match Found!</h3>
              <p className="text-sm text-muted-foreground">You're the {opportunity.cryptoType} Provider</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Buy Amount:</span>
                <span className="font-bold">{opportunity.amount.toFixed(2)} {opportunity.cryptoType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Investment:</span>
                <span className="font-bold">${opportunity.investmentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm text-muted-foreground">Expected Revenue:</span>
                <span className="font-bold text-green-400">${opportunity.revenueAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
              <p className="text-sm font-medium text-yellow-400">Action Required:</p>
              <p className="text-sm text-muted-foreground">
                Buy {opportunity.amount.toFixed(2)} {opportunity.cryptoType} worth ${opportunity.investmentAmount.toLocaleString()} on your platform
              </p>
            </div>

            <Button onClick={handleBoughtConfirmed} className="w-full">
              I Have Bought the {opportunity.cryptoType}
            </Button>
          </div>
        )}

        {stage === 'send_crypto' && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h3 className="font-semibold text-blue-400">Send to Platform</h3>
              <p className="text-sm text-muted-foreground">Transfer your {opportunity.cryptoType} to our platform wallet</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Platform Wallet Address:</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-muted rounded text-xs font-mono">
                    {opportunity.platformWallet}
                  </code>
                  <Button variant="outline" size="sm" onClick={copyWalletAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                <p className="text-sm font-medium text-blue-400">Amount to Send:</p>
                <p className="text-lg font-bold">{opportunity.amount.toFixed(2)} {opportunity.cryptoType}</p>
              </div>
            </div>

            <Button onClick={handleSentAndReceive} className="w-full">
              Send & Receive Revenue
            </Button>
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
                  <span className="text-muted-foreground">You bought:</span>
                  <span>{opportunity.amount.toFixed(2)} {opportunity.cryptoType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Investment:</span>
                  <span>${opportunity.investmentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You sold for:</span>
                  <span className="text-green-400">${opportunity.revenueAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span className="text-green-400">Your Profit:</span>
                  <span className="text-green-400">${opportunity.profitAmount.toFixed(2)}</span>
                </div>
              </div>
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

export default CryptoProviderDialog;