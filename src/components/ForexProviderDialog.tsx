import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TrendingUp, CheckCircle, Send, Trophy, X } from "lucide-react";

interface ForexProviderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: {
    brokerA: string;
    brokerB: string;
    currencyPair: string;
    rateA: number;
    rateB: number;
    userBroker: string;
    volume: number;
    investmentAmount: number;
    profitAmount: number;
    userProfitMargin: string;
  };
}

const ForexProviderDialog = ({ isOpen, onClose, opportunity }: ForexProviderDialogProps) => {
  const [stage, setStage] = useState<'buy' | 'send' | 'complete'>('buy');
  const [hasBought, setHasBought] = useState(false);

  const handleBought = () => {
    setHasBought(true);
    setStage('send');
  };

  const handleSent = () => {
    setStage('complete');
  };

  const handleClose = () => {
    setStage('buy');
    setHasBought(false);
    onClose();
  };

  if (!opportunity) return null;

  const platformWallet = "platform-forex-" + Math.random().toString(36).substr(2, 8);
  
  // Calculate currency amounts based on the pair
  const [baseCurrency, quoteCurrency] = opportunity.currencyPair.split('/');
  const currencyAmount = opportunity.volume / opportunity.rateA;
  const revenueRate = opportunity.rateB;
  const totalRevenue = currencyAmount * revenueRate;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {stage === 'buy' && 'Buy Currency'}
              {stage === 'send' && 'Send Currency'}
              {stage === 'complete' && 'Trade Complete'}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {stage === 'buy' && (
            <>
              <Card className="p-4 bg-muted/50">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{opportunity.currencyPair}</Badge>
                    <Badge variant="secondary">{opportunity.userBroker}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Buy Rate</p>
                      <p className="font-bold">{opportunity.rateA}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount to Buy</p>
                      <p className="font-bold text-primary">{currencyAmount.toFixed(2)} {baseCurrency}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Cost</p>
                      <p className="font-bold text-orange-400">${opportunity.volume.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Your Profit</p>
                      <p className="font-bold text-success">${opportunity.profitAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="text-center space-y-4">
                <p className="text-lg font-semibold">
                  Buy {currencyAmount.toFixed(2)} {baseCurrency} on {opportunity.userBroker}
                </p>
                <p className="text-sm text-muted-foreground">
                  Purchase the currency at rate {opportunity.rateA} for ${opportunity.volume.toLocaleString()}
                </p>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleBought}
                  disabled={hasBought}
                >
                  {hasBought ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Purchase Confirmed
                    </>
                  ) : (
                    'I Have Bought the Currency'
                  )}
                </Button>
              </div>
            </>
          )}

          {stage === 'send' && (
            <>
              <Card className="p-4 bg-muted/50">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Send className="h-4 w-4" />
                    <span className="font-semibold">Transfer Details</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount to Send:</span>
                      <span className="font-bold">{currencyAmount.toFixed(2)} {baseCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Account:</span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{platformWallet}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Revenue:</span>
                      <span className="font-bold text-success">${totalRevenue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="text-center space-y-4">
                <p className="text-lg font-semibold">
                  Send Currency to Platform
                </p>
                <p className="text-sm text-muted-foreground">
                  Transfer your {baseCurrency} to our platform account above
                </p>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSent}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send & Receive Revenue
                </Button>
              </div>
            </>
          )}

          {stage === 'complete' && (
            <>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-success/20 rounded-full flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-success" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-success mb-2">Trade Complete!</h3>
                  <p className="text-muted-foreground">Your forex arbitrage trade was successful</p>
                </div>
              </div>

              <Card className="p-4 bg-success/5 border-success/20">
                <h4 className="font-semibold mb-3">Trade Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You bought:</span>
                    <span className="font-medium">{currencyAmount.toFixed(2)} {baseCurrency} @ {opportunity.rateA}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform sold at:</span>
                    <span className="font-medium">{opportunity.rateB}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total revenue:</span>
                    <span className="font-medium">${totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span className="text-success">Your profit:</span>
                    <span className="text-success">${opportunity.profitAmount.toFixed(2)} ({opportunity.userProfitMargin}%)</span>
                  </div>
                </div>
              </Card>

              <Button className="w-full" onClick={handleClose}>
                Close
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForexProviderDialog;