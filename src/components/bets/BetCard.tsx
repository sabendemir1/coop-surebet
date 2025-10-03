import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnyBet } from "@/types/betting";
import { getBetDisplayLabel, getBetShortLabel, formatMetric, formatPeriod } from "@/lib/bettingHelpers";

type Props = {
  bet: AnyBet;
  onSelect?: (bet: AnyBet) => void;
  selected?: boolean;
};

export default function BetCard({ bet, onSelect, selected }: Props) {
  return (
    <Card className={selected ? "border-primary" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">{bet.league}</div>
            <div className="font-semibold">{bet.teamHome} vs {bet.teamAway}</div>
          </div>
          <Badge variant="secondary">{formatPeriod(bet.period)}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">{formatMetric(bet.metric)}</div>
          <div className="font-medium">{getBetDisplayLabel(bet)}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Bookmaker</div>
            <div className="text-sm font-medium">{bet.bookmaker}</div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-xs text-muted-foreground">Odds</div>
            <div className="text-xl font-bold">{bet.price.toFixed(2)}</div>
          </div>
        </div>

        {onSelect && (
          <Button 
            variant={selected ? "default" : "outline"} 
            className="w-full"
            onClick={() => onSelect(bet)}
          >
            {selected ? "Selected" : "Select Bet"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
