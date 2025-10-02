// components/bets/BetCard.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BetSelection, Outcome } from "@/types/betting";
import { buildOutcomeLabels } from "@/lib/bettingHelpers";

type Props = {
  selection: BetSelection;
  onPick?: (outcome: Outcome) => void;
};

export default function BetCard({ selection, onPick }: Props) {
  const labeled = buildOutcomeLabels(selection);

  const { home, away, start_date, competition } = selection.match;
  const h = home.name ?? "Home";
  const a = away.name ?? "Away";

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{competition}</div>
        <div className="text-xs">{new Date(start_date).toLocaleString()}</div>
      </div>

      <div className="text-lg font-semibold">{h} vs {a}</div>

      <div className="text-sm">
        <div className="font-medium">{selection.market.name}</div>
        {selection.market.params?.line !== undefined && (
          <div className="text-muted-foreground">
            Line: {selection.market.params.line}
          </div>
        )}
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-2">
        {labeled.map((o) => (
          <Button
            key={o.key}
            variant="outline"
            className="justify-between"
            onClick={() => onPick?.(o)}
          >
            <span>{o.label}</span>
            {o.price ? <span className="text-muted-foreground">{o.price.toFixed(2)}</span> : null}
          </Button>
        ))}
      </div>
    </Card>
  );
}
