import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowRightLeft, TrendingUp, Wallet, DollarSign } from "lucide-react";

const CryptoDashboard = () => {
  const navigate = useNavigate();

  // Mock data for the arbitrage opportunity
  const binancePrice = 100000;
  const coinbasePrice = 101000;
  const priceDifference = coinbasePrice - binancePrice;
  const profitPerUser = priceDifference / 3; // 1/3 split
  const totalPool = 75000; // Random between 10k-100k

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

        {/* Current Arbitrage Opportunity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-500" />
              Live Arbitrage Opportunity - Bitcoin (BTC)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Binance (Cheap)</h3>
                <p className="text-3xl font-bold text-green-400">${binancePrice.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">per BTC</p>
              </div>
              <div className="text-center flex items-center justify-center">
                <ArrowRightLeft className="h-8 w-8 text-blue-400" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Coinbase (Expensive)</h3>
                <p className="text-3xl font-bold text-red-400">${coinbasePrice.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">per BTC</p>
              </div>
            </div>
            
            <div className="text-center bg-gradient-to-r from-green-500/20 to-blue-500/20 p-4 rounded-lg">
              <p className="text-lg font-semibold">Price Difference: <span className="text-green-400">${priceDifference.toLocaleString()}</span></p>
              <p className="text-sm text-muted-foreground">Profit per user: ${profitPerUser.toFixed(2)} (after 1/3 split)</p>
            </div>
          </CardContent>
        </Card>

        {/* Pool Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-blue-500" />
              Current Pool Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">${totalPool.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total liquidity available for matching</p>
              <Badge variant="secondary" className="mt-2">Active Pool</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Trading Scenarios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scenario A: Buy from Exchange, Sell to Platform */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-400">Scenario A: Provide Cheap BTC</CardTitle>
              <p className="text-sm text-muted-foreground">Buy from Binance → Sell to Platform</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What You Do:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Buy 1 BTC on Binance for ${binancePrice.toLocaleString()}</li>
                  <li>Transfer BTC to our platform</li>
                  <li>Sell BTC to platform (matched with User B)</li>
                  <li>Platform pays you ${(binancePrice + profitPerUser).toLocaleString()}</li>
                </ol>
              </div>
              
              <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/20">
                <h4 className="font-semibold text-green-400 mb-2">Your Investment & Profit:</h4>
                <p className="text-sm">💰 Investment: ${binancePrice.toLocaleString()}</p>
                <p className="text-sm">📈 Revenue: ${(binancePrice + profitPerUser).toLocaleString()}</p>
                <p className="text-lg font-bold text-green-400">
                  Net Profit: ${profitPerUser.toFixed(2)}
                </p>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                <DollarSign className="mr-2 h-4 w-4" />
                Start as BTC Provider
              </Button>
            </CardContent>
          </Card>

          {/* Scenario B: Deposit to Platform, Get BTC to Sell */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-400">Scenario B: Provide Expensive Money</CardTitle>
              <p className="text-sm text-muted-foreground">Deposit to Platform → Get BTC → Sell on Coinbase</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What You Do:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Deposit ${(coinbasePrice - profitPerUser).toLocaleString()} to platform</li>
                  <li>Platform matches you with BTC provider</li>
                  <li>Receive 1 BTC from platform</li>
                  <li>Sell BTC on Coinbase for ${coinbasePrice.toLocaleString()}</li>
                </ol>
              </div>
              
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                <h4 className="font-semibold text-blue-400 mb-2">Your Deposit & Profit:</h4>
                <p className="text-sm">💳 Deposit: ${(coinbasePrice - profitPerUser).toLocaleString()}</p>
                <p className="text-sm">₿ Receive: 1 BTC (worth ${coinbasePrice.toLocaleString()})</p>
                <p className="text-lg font-bold text-blue-400">
                  Net Profit: ${profitPerUser.toFixed(2)}
                </p>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Wallet className="mr-2 h-4 w-4" />
                Start as Money Provider
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Platform Commission Info */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Platform Commission: ${profitPerUser.toFixed(2)} per trade • 
                Total profit split equally: Users A & B each get ${profitPerUser.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CryptoDashboard;