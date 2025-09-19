import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddArbitrageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddArbitrage: (opportunity: any) => void;
  userBookmaker: string;
}

const AddArbitrageDialog = ({ open, onOpenChange, onAddArbitrage, userBookmaker }: AddArbitrageDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    sport: "",
    teamA: "",
    teamB: "",
    oddA: "",
    oddB: "",
    bookmakerB: "",
    poolSize: "",
    remainingTime: ""
  });

  const sports = [
    { value: "Football", label: "Football" },
    { value: "Basketball", label: "Basketball" }
  ];

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

    // Create new opportunity
    const newOpportunity = {
      id: `arb_manual_${Date.now()}`,
      matchId: `match_manual_${Date.now()}`,
      teamA: formData.teamA,
      teamB: formData.teamB,
      sport: formData.sport,
      bookmakerA: userBookmaker,
      bookmakerB: formData.bookmakerB,
      oddA: oddA,
      oddB: oddB,
      totalPool: poolSize,
      expiresIn: remainingTime * 60, // Convert minutes to seconds
      profitMargin: ((1 - arbitrageSum) * 100).toFixed(2)
    };

    onAddArbitrage(newOpportunity);
    
    // Reset form
    setFormData({
      sport: "",
      teamA: "",
      teamB: "",
      oddA: "",
      oddB: "",
      bookmakerB: "",
      poolSize: "",
      remainingTime: ""
    });

    toast({
      title: "Arbitrage Added",
      description: `${formData.teamA} vs ${formData.teamB} opportunity created with ${((1 - arbitrageSum) * 100).toFixed(2)}% profit margin`
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
          <div>
            <Label htmlFor="sport">Sport</Label>
            <Select value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a sport" />
              </SelectTrigger>
              <SelectContent>
                {sports.map((sport) => (
                  <SelectItem key={sport.value} value={sport.value}>
                    {sport.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamA">Team A</Label>
              <Input
                id="teamA"
                value={formData.teamA}
                onChange={(e) => handleInputChange("teamA", e.target.value)}
                placeholder="e.g., PSG"
                required
              />
            </div>
            <div>
              <Label htmlFor="teamB">Team B</Label>
              <Input
                id="teamB"
                value={formData.teamB}
                onChange={(e) => handleInputChange("teamB", e.target.value)}
                placeholder="e.g., Marseille"
                required
              />
            </div>
          </div>

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
              disabled={!formData.sport || !formData.teamA || !formData.teamB || !formData.oddA || !formData.oddB || !formData.bookmakerB || !formData.poolSize || !formData.remainingTime}
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