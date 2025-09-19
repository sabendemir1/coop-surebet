import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, ArrowDown, DollarSign } from "lucide-react";

const PoolingSystemSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Users className="w-4 h-4 mr-2" />
            Deposit Flow Diagram
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            The Deposit Guarantee System
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Visual breakdown of how deposits flow to guarantee payments and distribute profits.
            This system eliminates trust issues and ensures mathematical certainty.
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Deposit Flow Diagram */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-8 text-center">Complete Deposit Flow</h3>
            
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Player A Flow */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl flex items-center justify-center mx-auto mb-4">A</div>
                  <h4 className="text-xl font-semibold">Player A</h4>
                  <p className="text-sm text-muted-foreground">Bets on Man United @ 2.10</p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded border-primary/30 border">
                    <div className="font-semibold mb-2">Player A deposits:</div>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex justify-between">
                        <span>Full edge:</span>
                        <span>€3.60</span>
                      </div>
                      <div className="flex justify-between">
                        <span>B's stake:</span>
                        <span>€50.60</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Total:</span>
                        <span>€54.20</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <ArrowDown className="w-8 h-8 text-primary mx-auto" />
                  </div>
                  
                  <div className="bg-trust/10 p-4 rounded border-trust/30 border">
                    <div className="font-semibold mb-2 text-center">A's Bet</div>
                    <div className="text-sm font-mono text-center">
                      €49.40 → Bookmaker
                    </div>
                  </div>
                </div>
              </div>

              {/* System Pool */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-success text-success-foreground font-bold text-2xl flex items-center justify-center mx-auto mb-4">💰</div>
                  <h4 className="text-xl font-semibold">System Pool</h4>
                  <p className="text-sm text-muted-foreground">Holds all deposits securely</p>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-success/10 p-4 rounded border-success/30 border">
                      <div className="font-semibold mb-2 text-center">Total Deposits</div>
                      <div className="space-y-2 text-sm font-mono">
                        <div className="flex justify-between">
                          <span>From A:</span>
                          <span>€54.20</span>
                        </div>
                        <div className="flex justify-between">
                          <span>From B:</span>
                          <span>€53.00</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Pool:</span>
                          <span>€107.20</span>
                        </div>
                      </div>
                    </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Guarantees payouts</div>
                    <div className="text-sm text-muted-foreground">+ profit distribution</div>
                  </div>
                </div>
              </div>

              {/* Player B Flow */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-warning text-warning-foreground font-bold text-2xl flex items-center justify-center mx-auto mb-4">B</div>
                  <h4 className="text-xl font-semibold">Player B</h4>
                  <p className="text-sm text-muted-foreground">Bets on Chelsea @ 2.05</p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-warning/10 p-4 rounded border-warning/30 border">
                    <div className="font-semibold mb-2 text-center">Player B Deposits</div>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex justify-between">
                        <span>Full edge:</span>
                        <span>€3.60</span>
                      </div>
                      <div className="flex justify-between">
                        <span>A's stake:</span>
                        <span>€49.40</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Total:</span>
                        <span>€53.00</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <ArrowDown className="w-8 h-8 text-warning mx-auto" />
                  </div>
                  
                  <div className="bg-trust/10 p-4 rounded border-trust/30 border">
                    <div className="font-semibold mb-2 text-center">B's Bet</div>
                    <div className="text-sm font-mono text-center">
                      €50.60 → Bookmaker
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Settlement Examples */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Scenario 1: A Wins */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6 text-success">Scenario 1: Player A Wins</h3>
              
              <div className="space-y-4">
                <div className="bg-success/10 p-4 rounded border-success/30 border">
                  <div className="font-semibold mb-2">Winner (A) Gets:</div>
                  <div className="space-y-1 text-sm font-mono">
                    <div>• From bookmaker: €103.74</div>
                    <div>• From profit pool: €1.19</div>
                    <div><strong>Total return: €104.93</strong></div>
                    <div className="text-success"><strong>Net profit: €5.53</strong></div>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded">
                  <div className="font-semibold mb-2">Loser (B) Gets:</div>
                  <div className="space-y-1 text-sm font-mono">
                    <div>• His own stake back: €50.60</div>
                    <div>• His deposited edge: €3.60</div>
                    <div>• A's stake he deposited: €49.40</div>
                    <div>• From profit pool: €1.22</div>
                    <div><strong>Total return: €104.82</strong></div>
                    <div className="text-success"><strong>Net profit: €4.22</strong></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Scenario 2: B Wins */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6 text-warning">Scenario 2: Player B Wins</h3>
              
              <div className="space-y-4">
                <div className="bg-warning/10 p-4 rounded border-warning/30 border">
                  <div className="font-semibold mb-2">Winner (B) Gets:</div>
                  <div className="space-y-1 text-sm font-mono">
                    <div>• From bookmaker: €103.73</div>
                    <div>• From profit pool: €1.22</div>
                    <div><strong>Total return: €104.95</strong></div>
                    <div className="text-success"><strong>Net profit: €4.35</strong></div>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded">
                  <div className="font-semibold mb-2">Loser (A) Gets:</div>
                  <div className="space-y-1 text-sm font-mono">
                    <div>• His own stake back: €49.40</div>
                    <div>• His deposited edge: €3.60</div>
                    <div>• B's stake he deposited: €50.60</div>
                    <div>• From profit pool: €1.19</div>
                    <div><strong>Total return: €104.79</strong></div>
                    <div className="text-success"><strong>Net profit: €5.39</strong></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Key Formula */}
          <Card className="p-8 bg-primary/5 border-primary/30">
            <h3 className="text-2xl font-bold mb-6 text-center">Key Formulas</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <h4 className="font-semibold">Deposit Amount</h4>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  Opposite Stake + Full Edge
                </div>
              </div>
              <div className="text-center space-y-2">
                <h4 className="font-semibold">Loser Recovery</h4>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  Own Stake + Full Edge + Opposite Stake
                </div>
              </div>
              <div className="text-center space-y-2">
                <h4 className="font-semibold">Edge Distribution</h4>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  33% Platform + 67% Players
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
};

export default PoolingSystemSection;