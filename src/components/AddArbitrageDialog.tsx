import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { EntityType } from "@/types/betting";
import { GlobalMarketId, TeamMarketId, PlayerMarketId, MARKET_DISPLAY } from "@/types/marketEnums";

interface AddArbitrageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddArbitrage: (opportunity: any) => void;
  userBookmaker: string;
}

const AddArbitrageDialog = ({ open, onOpenChange, onAddArbitrage, userBookmaker }: AddArbitrageDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    sport: "football",
    homeTeam: "",
    awayTeam: "",
    entity: "global" as EntityType,
    marketId: "" as GlobalMarketId | TeamMarketId | PlayerMarketId | "",
    line: "",
    oddA: "",
    oddB: "",
    bookmakerB: "",
    poolSize: "",
    remainingTime: ""
  });

  const entityTypes: { value: EntityType; label: string }[] = [
    { value: "global", label: "Match Level" },
    { value: "home", label: "Home Team" },
    { value: "away", label: "Away Team" },
    { value: "player", label: "Player" }
  ];

  const globalMarkets: { id: GlobalMarketId; requiresLine: boolean }[] = [
    { id: "ft_1x2", requiresLine: false },
    { id: "total_goals_ou", requiresLine: true },
    { id: "btts", requiresLine: false },
    { id: "double_chance", requiresLine: false },
    { id: "dnb", requiresLine: false },
    { id: "total_corners_ou", requiresLine: true },
    { id: "total_cards_ou", requiresLine: true },
    { id: "first_half_result", requiresLine: false }
  ];

  const teamMarkets: { id: TeamMarketId; requiresLine: boolean }[] = [
    { id: "team_total_goals_ou", requiresLine: true },
    { id: "asian_handicap", requiresLine: true },
    { id: "handicap", requiresLine: true },
    { id: "clean_sheet", requiresLine: false },
    { id: "team_corners_ou", requiresLine: true },
    { id: "team_cards_ou", requiresLine: true }
  ];

  const playerMarkets: { id: PlayerMarketId; requiresLine: boolean }[] = [
    { id: "anytime_goalscorer", requiresLine: false },
    { id: "first_goalscorer", requiresLine: false },
    { id: "last_goalscorer", requiresLine: false },
    { id: "player_carded", requiresLine: false },
    { id: "player_sent_off", requiresLine: false },
    { id: "player_shots_on_target_ou", requiresLine: true },
    { id: "player_assists_ou", requiresLine: true },
    { id: "player_passes_ou", requiresLine: true },
    { id: "player_tackles_ou", requiresLine: true },
    { id: "player_fouls_committed_ou", requiresLine: true }
  ];

  const getAvailableMarkets = () => {
    if (formData.entity === "global") {
      return globalMarkets.map(m => ({ id: m.id, label: MARKET_DISPLAY[m.id], requiresLine: m.requiresLine }));
    } else if (formData.entity === "player") {
      return playerMarkets.map(m => ({ id: m.id, label: MARKET_DISPLAY[m.id], requiresLine: m.requiresLine }));
    } else {
      return teamMarkets.map(m => ({ id: m.id, label: MARKET_DISPLAY[m.id], requiresLine: m.requiresLine }));
    }
  };

  const selectedMarket = getAvailableMarkets().find(m => m.id === formData.marketId);
  const requiresLine = selectedMarket?.requiresLine ?? false;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateArbitrage = (oddA: number, oddB: number) => {
    return (1 / oddA) + (1 / oddB);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const oddA = parseFloat(formData.oddA);
    const oddB = parseFloat(formData.oddB);
    const poolSize = parseFloat(formData.poolSize);
    const remainingTime = parseInt(formData.remainingTime);

    // Validate arbitrage opportunity
    const arbitrageSum = calculateArbitrage(oddA, oddB);
    
    if (arbitrageSum >= 1) {
      toast({
        title: "No Arbitrage Found",
        description: "Can't add - the odds don't create an arbitrage opportunity",
        variant: "destructive"
      });
      return;
    }

    // Create new opportunity using BetSelection structure
    const newOpportunity = {
      id: `arb_manual_${Date.now()}`,
      matchId: `match_manual_${Date.now()}`,
      sport: formData.sport,
      match: {
        id: `match_manual_${Date.now()}`,
        home: { id: "home_team", name: formData.homeTeam },
        away: { id: "away_team", name: formData.awayTeam },
        start_date: new Date(Date.now() + remainingTime * 60 * 1000).toISOString()
      },
      entity: {
        type: formData.entity,
        ref: null
      },
      market: {
        id: formData.marketId,
        name: MARKET_DISPLAY[formData.marketId as GlobalMarketId | TeamMarketId | PlayerMarketId],
        params: formData.line ? { line: parseFloat(formData.line) } : undefined
      },
      bookmakerA: userBookmaker,
      bookmakerB: formData.bookmakerB,
      oddA: oddA,
      oddB: oddB,
      totalPool: poolSize,
      expiresIn: remainingTime * 60,
      profitMargin: ((1 - arbitrageSum) * 100).toFixed(2)
    };

    onAddArbitrage(newOpportunity);
    
    // Reset form
    setFormData({
      sport: "football",
      homeTeam: "",
      awayTeam: "",
      entity: "global",
      marketId: "",
      line: "",
      oddA: "",
      oddB: "",
      bookmakerB: "",
      poolSize: "",
      remainingTime: ""
    });

    toast({
      title: "Arbitrage Added",
      description: `${formData.homeTeam} vs ${formData.awayTeam} opportunity created with ${((1 - arbitrageSum) * 100).toFixed(2)}% profit margin`
    });
  };

  const oddA = parseFloat(formData.oddA) || 0;
  const oddB = parseFloat(formData.oddB) || 0;
  const arbitrageSum = oddA && oddB ? calculateArbitrage(oddA, oddB) : 0;
  const profitMargin = arbitrageSum && arbitrageSum < 1 ? ((1 - arbitrageSum) * 100).toFixed(2) : "0";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Arbitrage Opportunity</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="homeTeam">Home Team</Label>
              <Input
                id="homeTeam"
                value={formData.homeTeam}
                onChange={(e) => handleInputChange("homeTeam", e.target.value)}
                placeholder="e.g., PSG"
                required
              />
            </div>
            <div>
              <Label htmlFor="awayTeam">Away Team</Label>
              <Input
                id="awayTeam"
                value={formData.awayTeam}
                onChange={(e) => handleInputChange("awayTeam", e.target.value)}
                placeholder="e.g., Marseille"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="entity">Entity Type</Label>
            <Select value={formData.entity} onValueChange={(value) => {
              handleInputChange("entity", value);
              handleInputChange("marketId", ""); // Reset market when entity changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select entity type" />
              </SelectTrigger>
              <SelectContent>
                {entityTypes.map((entity) => (
                  <SelectItem key={entity.value} value={entity.value}>
                    {entity.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="marketId">Market</Label>
            <Select value={formData.marketId} onValueChange={(value) => handleInputChange("marketId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select market type" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableMarkets().map((market) => (
                  <SelectItem key={market.id} value={market.id}>
                    {market.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {requiresLine && (
            <div>
              <Label htmlFor="line">Line Value</Label>
              <Input
                id="line"
                type="number"
                step="0.25"
                value={formData.line}
                onChange={(e) => handleInputChange("line", e.target.value)}
                placeholder="e.g., 2.5 or -0.5"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="oddA">Odd A ({userBookmaker})</Label>
              <Input
                id="oddA"
                type="number"
                step="0.01"
                min="1"
                value={formData.oddA}
                onChange={(e) => handleInputChange("oddA", e.target.value)}
                placeholder="e.g., 2.1"
                required
              />
            </div>
            <div>
              <Label htmlFor="oddB">Odd B</Label>
              <Input
                id="oddB"
                type="number"
                step="0.01"
                min="1"
                value={formData.oddB}
                onChange={(e) => handleInputChange("oddB", e.target.value)}
                placeholder="e.g., 2.05"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bookmakerB">Bookmaker B</Label>
            <Input
              id="bookmakerB"
              value={formData.bookmakerB}
              onChange={(e) => handleInputChange("bookmakerB", e.target.value)}
              placeholder="e.g., Bilyoner"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="poolSize">Pool Size ($)</Label>
              <Input
                id="poolSize"
                type="number"
                min="1"
                value={formData.poolSize}
                onChange={(e) => handleInputChange("poolSize", e.target.value)}
                placeholder="e.g., 1000"
                required
              />
            </div>
            <div>
              <Label htmlFor="remainingTime">Time (minutes)</Label>
              <Input
                id="remainingTime"
                type="number"
                min="1"
                value={formData.remainingTime}
                onChange={(e) => handleInputChange("remainingTime", e.target.value)}
                placeholder="e.g., 30"
                required
              />
            </div>
          </div>

          {oddA && oddB && (
            <div className="p-3 bg-muted rounded-md">
              <div className="text-sm">
                <p>Arbitrage Sum: {arbitrageSum.toFixed(4)}</p>
                <p className={arbitrageSum >= 1 ? "text-destructive" : "text-success"}>
                  {arbitrageSum >= 1 ? "❌ No arbitrage opportunity" : `✅ Profit Margin: ${profitMargin}%`}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!formData.homeTeam || !formData.awayTeam || !formData.marketId || !formData.oddA || !formData.oddB || !formData.bookmakerB || !formData.poolSize || !formData.remainingTime || (requiresLine && !formData.line)}
            >
              Add Arbitrage
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddArbitrageDialog;