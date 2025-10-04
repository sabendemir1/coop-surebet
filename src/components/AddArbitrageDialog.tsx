import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BetType, Period, Concern, AnyBet } from "@/types/betting";
import { FootballMarkets } from "@/lib/markets";
import { ArbOpportunity } from "@/lib/arbEngine";

const bookmakers = [
  { id: "bet365", name: "Bet365 (UK)", country: "🇬🇧" },
  { id: "pinnacle", name: "Pinnacle (Curacao)", country: "🇨🇼" },
  { id: "betfair", name: "Betfair (UK)", country: "🇬🇧" },
  { id: "unibet", name: "Unibet (Malta)", country: "🇲🇹" },
  { id: "betway", name: "Betway (Malta)", country: "🇲🇹" },
  { id: "williamhill", name: "William Hill (UK)", country: "🇬🇧" },
  { id: "bwin", name: "BWin (Austria)", country: "🇦🇹" },
  { id: "betsson", name: "Betsson (Sweden)", country: "🇸🇪" },
  { id: "draftkings", name: "DraftKings (US)", country: "🇺🇸" },
  { id: "fanduel", name: "FanDuel (US)", country: "🇺🇸" },
  { id: "betclic", name: "Betclic (France)", country: "🇫🇷" },
  { id: "stake", name: "Stake (Curacao)", country: "🇨🇼" }
];

interface AddArbitrageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddArbitrage: (opportunity: any) => void;
  userBookmaker: string;
}

interface BetFormData {
  sport: "FOOTBALL";
  league: string;
  gameId: string;
  teamHome: string;
  teamAway: string;
  bookmaker: string;
  period: Period | "";
  concern: Concern | "";
  odds: string;
  betType: BetType | "";
  metric: string;
  line: string;
  side: "OVER" | "UNDER" | "YES" | "NO" | "";
  selectionCode: string;
}

const emptyBetForm: BetFormData = {
  sport: "FOOTBALL",
  league: "",
  gameId: "",
  teamHome: "",
  teamAway: "",
  bookmaker: "",
  period: "",
  concern: "",
  odds: "",
  betType: "",
  metric: "",
  line: "",
  side: "",
  selectionCode: "",
};

const AddArbitrageDialog = ({ open, onOpenChange, onAddArbitrage, userBookmaker }: AddArbitrageDialogProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [betA, setBetA] = useState<BetFormData>(emptyBetForm);
  const [betB, setBetB] = useState<BetFormData>(emptyBetForm);
  const [poolSize, setPoolSize] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState("60");
  const [expirySeconds, setExpirySeconds] = useState("0");

  const getAvailableMetrics = (betType: BetType | ""): string[] => {
    if (!betType) return [];
    return Object.entries(FootballMarkets)
      .filter(([_, info]) => info.betType === betType)
      .map(([key, _]) => key);
  };

  const formToBet = (form: BetFormData): AnyBet | null => {
    if (!form.betType || !form.metric || !form.odds || !form.period || !form.concern) {
      return null;
    }

    const price = parseFloat(form.odds);
    if (isNaN(price) || price <= 1) return null;

    const baseProps = {
      id: `bet_${Date.now()}_${Math.random()}`,
      sport: form.sport,
      league: form.league,
      gameId: form.gameId,
      teamHome: form.teamHome,
      teamAway: form.teamAway,
      bookmaker: form.bookmaker,
      period: form.period as Period,
      concern: form.concern as Concern,
      metric: form.metric,
      price,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    switch (form.betType) {
      case BetType.OVER_UNDER: {
        const line = parseFloat(form.line);
        if (isNaN(line) || !form.side || (form.side !== "OVER" && form.side !== "UNDER")) return null;
        return {
          ...baseProps,
          marketType: BetType.OVER_UNDER,
          line,
          side: form.side as "OVER" | "UNDER",
        };
      }
      case BetType.BINARY: {
        if (!form.side || (form.side !== "YES" && form.side !== "NO")) return null;
        return {
          ...baseProps,
          marketType: BetType.BINARY,
          side: form.side as "YES" | "NO",
        };
      }
      case BetType.HANDICAP: {
        const line = parseFloat(form.line);
        if (isNaN(line)) return null;
        return {
          ...baseProps,
          marketType: BetType.HANDICAP,
          line,
        };
      }
      case BetType.EXACT: {
        if (!form.selectionCode) return null;
        return {
          ...baseProps,
          marketType: BetType.EXACT,
          marketKey: form.metric,
          selectionCode: form.selectionCode,
        };
      }
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    const bet1 = formToBet(betA);
    const bet2 = formToBet(betB);

    if (!bet1 || !bet2) {
      toast({
        title: "Incomplete Data",
        description: "Please fill in all required fields for both bets.",
        variant: "destructive",
      });
      return;
    }

    const pool = parseFloat(poolSize);
    if (isNaN(pool) || pool <= 0) {
      toast({
        title: "Invalid Pool Size",
        description: "Please enter a valid pool size.",
        variant: "destructive",
      });
      return;
    }

    try {
      const arb = new ArbOpportunity(bet1, bet2);
      
      if (!arb.exists()) {
        toast({
          title: "No Arbitrage",
          description: "These bets do not form a profitable arbitrage opportunity.",
          variant: "destructive",
        });
        return;
      }

      const totalExpirySeconds = (parseInt(expiryMinutes) * 60) + parseInt(expirySeconds);

      const opportunity = {
        id: `arb_manual_${Date.now()}`,
        matchId: bet1.gameId,
        teamA: bet1.teamHome,
        teamB: bet1.teamAway,
        sport: bet1.sport,
        bookmakerA: bet1.bookmaker,
        bookmakerB: bet2.bookmaker,
        oddA: bet1.price,
        oddB: bet2.price,
        totalPool: pool,
        expiresIn: totalExpirySeconds,
        profitMargin: (arb.edge * 100).toFixed(2),
        betA: bet1,
        betB: bet2,
      };

      onAddArbitrage(opportunity);

      setBetA(emptyBetForm);
      setBetB(emptyBetForm);
      setPoolSize("");
      setExpiryMinutes("60");
      setExpirySeconds("0");
      setActiveTab("general");

      toast({
        title: "Arbitrage Added",
        description: `Opportunity created with ${(arb.edge * 100).toFixed(2)}% profit margin`,
      });
    } catch (err: any) {
      toast({
        title: "Invalid Bet Pair",
        description: err.message || "These bets are not valid opposites for arbitrage.",
        variant: "destructive",
      });
    }
  };

  const renderBetForm = (bet: BetFormData, setBet: React.Dispatch<React.SetStateAction<BetFormData>>, betLabel: string) => {
    const updateField = (field: keyof BetFormData, value: any) => {
      setBet((prev) => {
        const updated = { ...prev, [field]: value };
        
        // Reset dependent fields
        if (field === "betType") {
          updated.metric = "";
          updated.line = "";
          updated.side = "";
          updated.selectionCode = "";
          // Automatically set concern to TOTAL for EXACT bet types
          if (value === BetType.EXACT) {
            updated.concern = Concern.TOTAL;
          }
        }
        if (field === "metric") {
          updated.line = "";
          updated.side = "";
          updated.selectionCode = "";
        }
        
        return updated;
      });
    };

    const availableMetrics = getAvailableMetrics(bet.betType);
    const selectedMarket = bet.metric ? FootballMarkets[bet.metric] : null;

    return (
      <div className="space-y-4 py-4">
        <h3 className="font-semibold text-lg">{betLabel}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>League</Label>
            <Input
              value={bet.league}
              onChange={(e) => updateField("league", e.target.value)}
              placeholder="e.g., Premier League"
            />
          </div>
          <div>
            <Label>Game ID</Label>
            <Input
              value={bet.gameId}
              onChange={(e) => updateField("gameId", e.target.value)}
              placeholder="e.g., EPL_2024_001"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Home Team</Label>
            <Input
              value={bet.teamHome}
              onChange={(e) => updateField("teamHome", e.target.value)}
              placeholder="e.g., Arsenal"
            />
          </div>
          <div>
            <Label>Away Team</Label>
            <Input
              value={bet.teamAway}
              onChange={(e) => updateField("teamAway", e.target.value)}
              placeholder="e.g., Chelsea"
            />
          </div>
        </div>

        <div>
          <Label>Bookmaker</Label>
          <Select value={bet.bookmaker} onValueChange={(value) => updateField("bookmaker", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select bookmaker" />
            </SelectTrigger>
            <SelectContent>
              {bookmakers.map((bookmaker) => (
                <SelectItem key={bookmaker.id} value={bookmaker.id}>
                  <span className="flex items-center gap-2">
                    {bookmaker.country} {bookmaker.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Period</Label>
            <Select value={bet.period} onValueChange={(value) => updateField("period", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Period.FT}>Full Time</SelectItem>
                <SelectItem value={Period.H1}>First Half</SelectItem>
                <SelectItem value={Period.H2}>Second Half</SelectItem>
                <SelectItem value={Period.ET}>Extra Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Concern</Label>
            <Select 
              value={bet.concern} 
              onValueChange={(value) => updateField("concern", value)}
              disabled={bet.betType === BetType.EXACT}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select concern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Concern.TOTAL}>Total</SelectItem>
                <SelectItem value={Concern.HOME}>Home Team</SelectItem>
                <SelectItem value={Concern.AWAY}>Away Team</SelectItem>
                <SelectItem value={Concern.PLAYER}>Player</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Odds</Label>
          <Input
            type="number"
            step="0.01"
            min="1.01"
            value={bet.odds}
            onChange={(e) => updateField("odds", e.target.value)}
            placeholder="e.g., 2.10"
          />
        </div>

        <div>
          <Label>Bet Type</Label>
          <Select value={bet.betType} onValueChange={(value) => updateField("betType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select bet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BetType.EXACT}>Exact</SelectItem>
              <SelectItem value={BetType.OVER_UNDER}>Over/Under</SelectItem>
              <SelectItem value={BetType.BINARY}>Binary (Yes/No)</SelectItem>
              <SelectItem value={BetType.HANDICAP}>Handicap</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {bet.betType && (
          <div>
            <Label>Market</Label>
            <Select value={bet.metric} onValueChange={(value) => updateField("metric", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent>
                {availableMetrics.map((metricKey) => (
                  <SelectItem key={metricKey} value={metricKey}>
                    {FootballMarkets[metricKey].uiLabel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {bet.betType === BetType.OVER_UNDER && (
          <>
            <div>
              <Label>Line (e.g., 2.5)</Label>
              <Input
                type="number"
                step="0.5"
                value={bet.line}
                onChange={(e) => updateField("line", e.target.value)}
                placeholder="e.g., 2.5"
              />
            </div>
            <div>
              <Label>Side</Label>
              <Select value={bet.side} onValueChange={(value) => updateField("side", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Over or Under" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OVER">Over</SelectItem>
                  <SelectItem value="UNDER">Under</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {bet.betType === BetType.BINARY && (
          <div>
            <Label>Side</Label>
            <Select value={bet.side} onValueChange={(value) => updateField("side", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Yes or No" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YES">Yes</SelectItem>
                <SelectItem value="NO">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {bet.betType === BetType.HANDICAP && (
          <div>
            <Label>Handicap Line (e.g., +0.5 or -1.5)</Label>
            <Input
              type="number"
              step="0.5"
              value={bet.line}
              onChange={(e) => updateField("line", e.target.value)}
              placeholder="e.g., -0.5"
            />
          </div>
        )}

        {bet.betType === BetType.EXACT && selectedMarket?.selections && (
          <div>
            <Label>Selection</Label>
            <Select value={bet.selectionCode} onValueChange={(value) => updateField("selectionCode", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                {selectedMarket.selections.map((sel) => (
                  <SelectItem key={sel.code} value={sel.code}>
                    {sel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  };

  const calculateArbPreview = () => {
    const bet1 = formToBet(betA);
    const bet2 = formToBet(betB);

    if (!bet1 || !bet2) return null;

    try {
      const arb = new ArbOpportunity(bet1, bet2);
      return {
        exists: arb.exists(),
        edge: arb.edge,
        reason: arb.reason,
      };
    } catch (err: any) {
      return {
        exists: false,
        error: err.message,
      };
    }
  };

  const arbPreview = calculateArbPreview();

  const generateBetDescription = (bet: BetFormData): string => {
    if (!bet.betType || !bet.metric || !bet.period || !bet.concern) {
      return "Incomplete bet details";
    }

    const periodText = {
      [Period.FT]: "Full Time",
      [Period.H1]: "1st Half", 
      [Period.H2]: "2nd Half",
      [Period.ET]: "Extra Time"
    }[bet.period as Period] || bet.period;

    const concernText = {
      [Concern.TOTAL]: "Total",
      [Concern.HOME]: "Home",
      [Concern.AWAY]: "Away", 
      [Concern.PLAYER]: "Player"
    }[bet.concern as Concern] || bet.concern;

    const marketLabel = FootballMarkets[bet.metric]?.uiLabel || bet.metric;

    switch (bet.betType) {
      case BetType.OVER_UNDER:
        const overUnderSide = bet.side === "OVER" ? "Over" : bet.side === "UNDER" ? "Under" : "Over/Under";
        const line = bet.line ? ` ${bet.line}` : "";
        return `${concernText} ${overUnderSide}${line} ${marketLabel} in ${periodText}`;

      case BetType.BINARY:
        const binarySide = bet.side === "YES" ? "Yes" : bet.side === "NO" ? "No" : "Yes/No";
        return `${binarySide} ${marketLabel} (${concernText}) in ${periodText}`;

      case BetType.HANDICAP:
        const lineValue = parseFloat(bet.line);
        const handicapLine = bet.line ? ` ${lineValue >= 0 ? '+' : ''}${bet.line}` : "";
        return `${concernText}${handicapLine} ${marketLabel} in ${periodText}`;

      case BetType.EXACT:
        const selection = bet.selectionCode ? 
          FootballMarkets[bet.metric]?.selections?.find(s => s.code === bet.selectionCode)?.label || bet.selectionCode
          : "selection";
        return `${selection} ${marketLabel} in ${periodText}`;

      default:
        return "Unknown bet type";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Arbitrage Opportunity</DialogTitle>
          <DialogDescription>
            Define two opposite bets to create an arbitrage opportunity
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="bet1">First Bet</TabsTrigger>
            <TabsTrigger value="bet2">Second Bet</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div>
              <Label>Pool Size ($)</Label>
              <Input
                type="number"
                min="1"
                value={poolSize}
                onChange={(e) => setPoolSize(e.target.value)}
                placeholder="e.g., 1000"
              />
            </div>

            <div>
              <Label>Expires In</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Minutes</Label>
                  <Input
                    type="number"
                    min="0"
                    max="999"
                    value={expiryMinutes}
                    onChange={(e) => setExpiryMinutes(e.target.value)}
                    placeholder="60"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Seconds</Label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={expirySeconds}
                    onChange={(e) => setExpirySeconds(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total: {expiryMinutes}:{expirySeconds.padStart(2, '0')} 
                ({(parseInt(expiryMinutes) * 60) + parseInt(expirySeconds)} seconds)
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-semibold">Arbitrage Analysis</h4>
              {arbPreview ? (
                arbPreview.exists ? (
                  <div className="space-y-1 text-sm">
                    <p className="text-success">✅ Valid Arbitrage Opportunity</p>
                    <p>Edge: {(arbPreview.edge! * 100).toFixed(2)}%</p>
                    <p className="text-muted-foreground">{arbPreview.reason}</p>
                  </div>
                ) : (
                  <p className="text-destructive text-sm">
                    ❌ {arbPreview.error || "No arbitrage opportunity detected"}
                  </p>
                )
              ) : (
                <p className="text-muted-foreground text-sm">
                  Complete both bets to see arbitrage analysis
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bet1">
            {renderBetForm(betA, setBetA, "First Bet")}
            <div className="p-3 bg-muted rounded-lg mt-4">
              <h4 className="font-semibold text-sm mb-1">Bet 1 Summary:</h4>
              <p className="text-sm text-muted-foreground">{generateBetDescription(betA)}</p>
            </div>
          </TabsContent>

          <TabsContent value="bet2">
            {renderBetForm(betB, setBetB, "Second Bet")}
            <div className="p-3 bg-muted rounded-lg mt-4">
              <h4 className="font-semibold text-sm mb-1">Bet 2 Summary:</h4>
              <p className="text-sm text-muted-foreground">{generateBetDescription(betB)}</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="flex-1"
            disabled={!arbPreview || !arbPreview.exists || !poolSize}
          >
            Add Arbitrage
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddArbitrageDialog;