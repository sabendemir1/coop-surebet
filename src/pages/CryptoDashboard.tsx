import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowRightLeft, TrendingUp, Wallet, DollarSign, ChevronDown, ChevronUp, Clock, Lock } from "lucide-react";
import { useState } from "react";
import MatchmakingDialog from "@/components/MatchmakingDialog";
import CryptoProviderDialog from "@/components/CryptoProviderDialog";
import MoneyProviderDialog from "@/components/MoneyProviderDialog";

const CryptoDashboard = () => {
  const navigate = useNavigate();
  const [expandedOpportunity, setExpandedOpportunity] = useState<number | null>(null);
  const [matchmakingOpen, setMatchmakingOpen] = useState(false);
  const [cryptoProviderOpen, setCryptoProviderOpen] = useState(false);
  const [moneyProviderOpen, setMoneyProviderOpen] = useState(false);
  const [currentOpportunity, setCurrentOpportunity] = useState<any>(null);

  // Mock data for arbitrage opportunities
  const btcBinancePrice = 100000;
  const btcCoinbasePrice = 101000;
  const btcPriceDifference = btcCoinbasePrice - btcBinancePrice;
  const btcProfitPerUser = btcPriceDifference / 3;
  
  const ethCoinbasePrice = 3500;
  const ethBinancePrice = 3520;
  const ethPriceDifference = ethBinancePrice - ethCoinbasePrice;
  const ethProfitPerUser = ethPriceDifference / 3;

  // Calculate percentages
  const btcPercentage = ((btcCoinbasePrice - btcBinancePrice) / btcBinancePrice * 100);
  const btcProfitPercentage = btcPercentage / 3;
  
  const ethPercentage = ((ethBinancePrice - ethCoinbasePrice) / ethCoinbasePrice * 100);
  const ethProfitPercentage = ethPercentage / 3;

  // Pool data
  const btcPool = 85000;
  const ethPool = 42000;

  // Calculate amounts based on pool sizes
  const btcAmount = btcPool / btcBinancePrice; // 0.85 BTC
  const ethAmount = ethPool / ethCoinbasePrice; // 12 ETH
  
  const btcTotalProfit = btcAmount * btcProfitPerUser; // Total profit for BTC pool
  const ethTotalProfit = ethAmount * ethProfitPerUser; // Total profit for ETH pool

  // Debug log to ensure variables are defined
  console.log('CryptoDashboard variables:', {
    btcBinancePrice,
    btcCoinbasePrice,
    btcProfitPerUser,
    ethBinancePrice,
    ethCoinbasePrice,
    ethProfitPerUser
  });

  const toggleOpportunity = (opportunityId: number) => {
    setExpandedOpportunity(expandedOpportunity === opportunityId ? null : opportunityId);
  };

  const handleLockOpportunity = (opportunityId: number, role: 'crypto' | 'money') => {
    if (opportunityId === 1) {
      // BTC opportunity
      setCurrentOpportunity({
        teamA: 'Binance',
        teamB: 'Coinbase', 
        sport: 'Crypto',
        oddA: btcBinancePrice,
        oddB: btcCoinbasePrice,
        profitMargin: btcPercentage.toFixed(2),
        userTeam: role === 'crypto' ? 'BTC Provider' : 'Money Provider',
        userBookmaker: role === 'crypto' ? 'Binance' : 'Platform',
        userOdd: role === 'crypto' ? btcBinancePrice : btcCoinbasePrice,
        stakeAmount: role === 'crypto' ? btcAmount : (btcPool - btcTotalProfit),
        depositAmount: role === 'crypto' ? btcPool : (btcPool - btcTotalProfit),
        profitAmount: btcTotalProfit,
        userProfitMargin: btcProfitPercentage.toFixed(2),
        // Additional data for role-specific dialogs
        cryptoType: 'BTC',
        amount: btcAmount,
        investmentAmount: btcPool,
        revenueAmount: btcPool + btcTotalProfit,
        platformWallet: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        sellValue: btcPool,
        edgeProfit: btcTotalProfit
      });
    } else {
      // ETH opportunity
      setCurrentOpportunity({
        teamA: 'Coinbase',
        teamB: 'Binance',
        sport: 'Crypto', 
        oddA: ethCoinbasePrice,
        oddB: ethBinancePrice,
        profitMargin: ethPercentage.toFixed(2),
        userTeam: role === 'crypto' ? 'ETH Provider' : 'Money Provider',
        userBookmaker: role === 'crypto' ? 'Coinbase' : 'Platform',
        userOdd: role === 'crypto' ? ethCoinbasePrice : ethBinancePrice,
        stakeAmount: role === 'crypto' ? ethAmount : (ethPool - ethTotalProfit),
        depositAmount: role === 'crypto' ? ethPool : (ethPool - ethTotalProfit), 
        profitAmount: ethTotalProfit,
        userProfitMargin: ethProfitPercentage.toFixed(2),
        // Additional data for role-specific dialogs
        cryptoType: 'ETH', 
        amount: ethAmount,
        investmentAmount: ethPool,
        revenueAmount: ethPool + ethTotalProfit,
        platformWallet: '0x742d35Cc6635C0532925a3b8D6A85C11A5B9Cf8E',
        sellValue: ethPool,
        edgeProfit: ethTotalProfit
      });
    }
    setMatchmakingOpen(true);
  };

  const handleMatchFound = () => {
    setMatchmakingOpen(false);
    // Determine if user is crypto or money provider based on the opportunity
    if (currentOpportunity?.userTeam?.includes('Provider')) {
      if (currentOpportunity.userTeam.includes('BTC') || currentOpportunity.userTeam.includes('ETH')) {
        setCryptoProviderOpen(true);
      } else {
        setMoneyProviderOpen(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Crypto Arbitrage Dashboard</h1>
            <p className="text-muted-foreground">Real-time Bitcoin arbitrage opportunities</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
          >
            Back to Login
          </Button>
        </div>

        {/* Live Arbitrage Opportunities */}
        <div className="space-y-6 mb-8">
          {/* Opportunity 1: Binance cheaper - You can be BTC Provider */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  <div>
                    <CardTitle>Opportunity #1 - Bitcoin (BTC)</CardTitle>
                    <Badge variant="secondary" className="mt-1">You can be BTC Provider</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>2h 15m</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Binance (Cheap)</h3>
                  <p className="text-3xl font-bold text-green-400">${btcBinancePrice.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">per BTC</p>
                </div>
                <div className="text-center flex items-center justify-center">
                  <ArrowRightLeft className="h-8 w-8 text-blue-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Coinbase (Expensive)</h3>
                  <p className="text-3xl font-bold text-red-400">${btcCoinbasePrice.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">per BTC</p>
                </div>
              </div>
              
              <div className="text-center bg-gradient-to-r from-green-500/20 to-blue-500/20 p-4 rounded-lg mb-4">
                <p className="text-lg font-semibold">
                  Price Difference: <span className="text-green-400">+{btcPercentage.toFixed(2)}%</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  You get 1/3 of it: <span className="text-green-400">+{btcProfitPercentage.toFixed(2)}%</span> of your investment
                </p>
              </div>

              <div className="flex items-center justify-between bg-orange-500/10 p-4 rounded-lg mb-4 border border-orange-500/20">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-orange-400" />
                  <span className="font-semibold text-orange-400">Bitcoin Pool</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-400">${btcPool.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Available liquidity</p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => toggleOpportunity(1)}
                  className="flex items-center gap-2"
                >
                  {expandedOpportunity === 1 ? (
                    <>
                      Hide Details <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      See More <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              {expandedOpportunity === 1 && (
                <div className="mt-6 space-y-4 border-t pt-6">
                  <div className="bg-green-900/10 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-400 mb-4">Your Role: BTC Provider</h4>
                    <p className="text-sm text-muted-foreground mb-4">Buy from Binance (${btcBinancePrice.toLocaleString()}) → Sell to Platform</p>
                    
                    <div className="bg-slate-800/50 p-4 rounded-lg mb-4">
                      <h5 className="font-semibold mb-2">What You Do:</h5>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Buy {btcAmount.toFixed(2)} BTC on Binance for ${btcPool.toLocaleString()}</li>
                        <li>Transfer {btcAmount.toFixed(2)} BTC to our platform</li>
                        <li>Platform matches you with money provider</li>
                        <li>Platform pays you ${(btcPool + btcTotalProfit).toLocaleString()}</li>
                      </ol>
                    </div>
                    
                    <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/20 mb-4">
                      <h5 className="font-semibold text-green-400 mb-2">Your Investment & Profit:</h5>
                      <p className="text-sm">💰 Investment: ${btcPool.toLocaleString()}</p>
                      <p className="text-sm">📈 Revenue: ${(btcPool + btcTotalProfit).toLocaleString()}</p>
                      <p className="text-lg font-bold text-green-400">
                        Net Profit: ${btcTotalProfit.toFixed(2)}
                      </p>
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleLockOpportunity(1, 'crypto')}>
                      <Lock className="mr-2 h-4 w-4" />
                      Lock as BTC Provider
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Opportunity 2: Ethereum - You can be Money Provider */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                  <div>
                    <CardTitle>Opportunity #2 - Ethereum (ETH)</CardTitle>
                    <Badge variant="secondary" className="mt-1">You can be Money Provider</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>45m</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Coinbase (Cheap)</h3>
                  <p className="text-3xl font-bold text-green-400">${ethCoinbasePrice.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">per ETH</p>
                </div>
                <div className="text-center flex items-center justify-center">
                  <ArrowRightLeft className="h-8 w-8 text-blue-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Binance (Expensive)</h3>
                  <p className="text-3xl font-bold text-red-400">${ethBinancePrice.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">per ETH</p>
                </div>
              </div>
              
              <div className="text-center bg-gradient-to-r from-blue-500/20 to-green-500/20 p-4 rounded-lg mb-4">
                <p className="text-lg font-semibold">
                  Price Difference: <span className="text-green-400">+{ethPercentage.toFixed(2)}%</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  You get 1/3 of it: <span className="text-green-400">+{ethProfitPercentage.toFixed(2)}%</span> of your investment
                </p>
              </div>

              <div className="flex items-center justify-between bg-blue-500/10 p-4 rounded-lg mb-4 border border-blue-500/20">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-400" />
                  <span className="font-semibold text-blue-400">Ethereum Pool</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-400">${ethPool.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Available liquidity</p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => toggleOpportunity(2)}
                  className="flex items-center gap-2"
                >
                  {expandedOpportunity === 2 ? (
                    <>
                      Hide Details <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      See More <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              {expandedOpportunity === 2 && (
                <div className="mt-6 space-y-4 border-t pt-6">
                  <div className="bg-blue-900/10 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-400 mb-4">Your Role: Money Provider</h4>
                    <p className="text-sm text-muted-foreground mb-4">Deposit to Platform → Get ETH → Sell on Binance (${ethBinancePrice.toLocaleString()})</p>
                    
                    <div className="bg-slate-800/50 p-4 rounded-lg mb-4">
                      <h5 className="font-semibold mb-2">What You Do:</h5>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Deposit ${(ethPool - ethTotalProfit).toLocaleString()} to platform</li>
                        <li>Platform matches you with ETH provider (buying from Coinbase)</li>
                        <li>Receive {ethAmount.toFixed(0)} ETH from platform</li>
                        <li>Sell {ethAmount.toFixed(0)} ETH on Binance for ${ethPool.toLocaleString()}</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20 mb-4">
                      <h5 className="font-semibold text-blue-400 mb-2">Your Deposit & Profit:</h5>
                      <p className="text-sm">💳 Deposit: ${(ethPool - ethTotalProfit).toLocaleString()}</p>
                      <p className="text-sm">Ξ Receive: {ethAmount.toFixed(0)} ETH (sell for ${ethPool.toLocaleString()})</p>
                      <p className="text-lg font-bold text-blue-400">
                        Net Profit: ${ethTotalProfit.toFixed(2)}
                      </p>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleLockOpportunity(2, 'money')}>
                      <Lock className="mr-2 h-4 w-4" />
                      Lock as Money Provider
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Platform Commission Info */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Platform Commission varies per trade • 
                Total profit split equally among all three parties (platform + both users)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dialogs */}
        {currentOpportunity && (
          <>
            <MatchmakingDialog
              isOpen={matchmakingOpen}
              onClose={() => setMatchmakingOpen(false)}
              onMatchFound={handleMatchFound}
              opportunity={currentOpportunity}
            />
            
            <CryptoProviderDialog
              isOpen={cryptoProviderOpen}
              onClose={() => setCryptoProviderOpen(false)}
              opportunity={currentOpportunity}
            />
            
            <MoneyProviderDialog
              isOpen={moneyProviderOpen}
              onClose={() => setMoneyProviderOpen(false)}
              opportunity={currentOpportunity}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CryptoDashboard;