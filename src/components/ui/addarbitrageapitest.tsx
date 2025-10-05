import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Provider = "oddsapi";
type Sport = "football";

const SPORTS: Record<
  Sport,
  { leagues: { id: string; name: string }[]; markets: { id: string; name: string }[] }
> = {
  football: {
    leagues: [
      { id: "premier_league", name: "Premier League" },
      { id: "laliga", name: "La Liga" },
      { id: "serie_a", name: "Serie A" },
      { id: "bundesliga", name: "Bundesliga" },
      { id: "ligue_1", name: "Ligue 1" },
      { id: "ucl", name: "UEFA Champions League" },
    ],
    markets: [
      { id: "1x2", name: "Match Result (1X2)" },
      { id: "double_chance", name: "Double Chance (1X, 12, X2)" },
      { id: "totals", name: "Total Goals (Over/Under)" },
      { id: "handicap", name: "Handicap / Asian Handicap" },
      { id: "btts", name: "Both Teams To Score" },
      { id: "ht_ft", name: "Half-Time / Full-Time" },
      { id: "1st_half_1x2", name: "1st Half Result (1X2)" },
      { id: "total_corners", name: "Total Corners (O/U)" },
      { id: "total_cards", name: "Total Cards (O/U)" },
    ],
  },
};

export function AddArbitrageApiTestDialog({ open, onOpenChange }: Props) {
  const [provider, setProvider] = React.useState<Provider | "">("");
  const [sport, setSport] = React.useState<Sport | "">("");
  const [league, setLeague] = React.useState<string>("");
  const [market, setMarket] = React.useState<string>("");

  const [loading, setLoading] = React.useState(false);
  const [calls, setCalls] = React.useState(0);
  const [lastCallAt, setLastCallAt] = React.useState<string | null>(null);

  // Split view state: when true, expand dialog to full width and show right panel
  const [splitView, setSplitView] = React.useState(false);
  const [results, setResults] = React.useState<any[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      // Reset when closing
      setProvider("");
      setSport("");
      setLeague("");
      setMarket("");
      setLoading(false);
      setCalls(0);
      setLastCallAt(null);
      setSplitView(false);
      setResults(null);
      setError(null);
    }
  }, [open]);

  const canCall = provider && sport && league && market;

  const ODDS_API_KEY = "YOUR_API_KEY";
  // Mapping to The Odds API sport keys
  const leagueToSportKey: Record<string, string> = {
    premier_league: "soccer_epl",
    laliga: "soccer_spain_la_liga",
    serie_a: "soccer_italy_serie_a",
    bundesliga: "soccer_germany_bundesliga",
    ligue_1: "soccer_france_ligue_one",
    ucl: "soccer_uefa_champs_league",
  };

  // Mapping to The Odds API market keys
  const marketToOddsApiKey: Record<string, string> = {
    "1x2": "h2h",
    totals: "totals",
    handicap: "spreads",
    btts: "btts",
    double_chance: "double_chance", // may be limited availability
    ht_ft: "ht_ft", // not widely available; may return empty
    "1st_half_1x2": "h2h_1st_half", // not standard everywhere
    total_corners: "corners", // not standard; may return empty
    total_cards: "cards", // not standard; may return empty
  };

  const runProviderCall = async () => {
    if (!canCall) return;
    setSplitView(true);
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      if (provider === "oddsapi") {
        if (!ODDS_API_KEY) {
          setError("Missing VITE_ODDS_API_KEY");
          return;
        }
        const sportKey = leagueToSportKey[league];
        const marketKey = marketToOddsApiKey[market] || "h2h";
        const params = new URLSearchParams({
          regions: "eu",
          oddsFormat: "decimal",
          markets: marketKey,
          dateFormat: "iso",
        });
        const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/odds?${params.toString()}&apiKey=${ODDS_API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`HTTP ${res.status}: ${txt}`);
        }
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } else {
        // Other providers in future
        setResults([]);
      }
      setCalls((c) => c + 1);
      setLastCallAt(new Date().toLocaleString());
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (value: string) => {
    const p = value as Provider;
    setProvider(p);
    // reset downstream
    setSport("");
    setLeague("");
    setMarket("");
  };

  const handleSportChange = (value: string) => {
    const s = value as Sport;
    setSport(s);
    // reset downstream
    setLeague("");
    setMarket("");
  };

  const handleLeagueChange = (value: string) => {
    setLeague(value);
    // reset downstream
    setMarket("");
  };

  const handleMarketChange = async (value: string) => {
    setMarket(value);
  };

  const handleCall = async () => {
    if (!canCall || loading) return;
    await runProviderCall();
  };

  const leagues = sport ? SPORTS[sport].leagues : [];
  const markets = sport ? SPORTS[sport].markets : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          splitView
            ? // Full-width split layout
              "max-w-none w-screen h-[90vh] overflow-hidden"
            : // Default centered layout
              "sm:max-w-lg"
        }
      >
        {!splitView ? (
          <>
            <DialogHeader>
              <DialogTitle>API Test</DialogTitle>
              <DialogDescription>
                Choose a provider, sport, league, and market. Then press Call.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Provider */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Provider</div>
                <Select value={provider} onValueChange={handleProviderChange} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select API provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oddsapi">OddsAPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sport */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Sport</div>
                <Select
                  value={sport}
                  onValueChange={handleSportChange}
                  disabled={loading || !provider}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="football">Football</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* League */}
              <div className="space-y-2">
                <div className="text-sm font-medium">League</div>
                <Select
                  value={league}
                  onValueChange={handleLeagueChange}
                  disabled={loading || !sport}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select league" />
                  </SelectTrigger>
                  <SelectContent>
                    {leagues.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Market */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Market</div>
                <Select
                  value={market}
                  onValueChange={handleMarketChange}
                  disabled={loading || !league}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select market" />
                  </SelectTrigger>
                  <SelectContent>
                    {markets.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="rounded-md border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Status</div>
                    <div className="text-muted-foreground">
                      {loading
                        ? "Calling..."
                        : calls === 0
                        ? "Waiting for first call"
                        : `Last call at ${lastCallAt}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Calls</div>
                    <div className="text-muted-foreground">{calls}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                  Close
                </Button>
                <Button onClick={handleCall} disabled={!canCall || loading}>
                  {loading ? "Running..." : "Call"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Split layout: left controls + right results panel (scrollable)
          <div className="grid h_full grid-cols-1 gap-4 md:grid-cols-2 h-full min-h-0">
            {/* Left panel (existing form) */}
            <div className="flex min-h-0 flex-col overflow-y-auto p-2">
              <DialogHeader>
                <DialogTitle>API Test</DialogTitle>
                <DialogDescription>
                  Adjust parameters and press Call/Again to refresh.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2 space-y-4">
                {/* Provider */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Provider</div>
                  <Select value={provider} onValueChange={handleProviderChange} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select API provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oddsapi">OddsAPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sport */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Sport</div>
                  <Select
                    value={sport}
                    onValueChange={handleSportChange}
                    disabled={loading || !provider}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="football">Football</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* League */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">League</div>
                  <Select
                    value={league}
                    onValueChange={handleLeagueChange}
                    disabled={loading || !sport}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select league" />
                    </SelectTrigger>
                    <SelectContent>
                      {leagues.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Market */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Market</div>
                  <Select
                    value={market}
                    onValueChange={handleMarketChange}
                    disabled={loading || !league}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select market" />
                    </SelectTrigger>
                    <SelectContent>
                      {markets.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="rounded-md border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Status</div>
                      <div className="text-muted-foreground">
                        {loading
                          ? "Calling..."
                          : calls === 0
                          ? "Waiting for first call"
                          : `Last call at ${lastCallAt}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Calls</div>
                      <div className="text-muted-foreground">{calls}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                    Close
                  </Button>
                  <Button onClick={handleCall} disabled={!canCall || loading}>
                    {loading ? "Running..." : "Again"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right panel (results) */}
            <div className="relative flex h-full min-h-0 flex-col rounded-md border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Results</div>
                  <div className="text-xs text-muted-foreground">
                    Games and odds will be listed here.
                  </div>
                </div>
              </div>
              <div className="mt-3 flex-1 min-h-0 overflow-y-auto">
                {!results && !error && !loading && (
                  <div className="text-sm text-muted-foreground">No data yet. Press Call.</div>
                )}
                {error && (
                  <div className="mb-3 rounded border border-destructive/50 bg-destructive/10 p-2 text-sm text-destructive">
                    {error}
                  </div>
                )}
                {loading && <div className="text-sm">Loading…</div>}

                {/* Render OddsAPI response */}
                {Array.isArray(results) && results.length > 0 && (
                  <div className="space-y-3">
                    {results.map((ev) => {
                      const when = ev?.commence_time
                        ? new Date(ev.commence_time).toLocaleString()
                        : "-";
                      const gameName = `${ev?.home_team ?? "Home"} vs ${ev?.away_team ?? "Away"}`;

                      // Choose the market data from first bookmaker that has the market
                      const chosenMarketKey = marketToOddsApiKey[market] || "h2h";
                      const bmWithMarket = (ev?.bookmakers ?? []).find((bm: any) =>
                        (bm?.markets ?? []).some((mk: any) => mk?.key === chosenMarketKey)
                      );
                      const marketObj = bmWithMarket
                        ? (bmWithMarket.markets ?? []).find((mk: any) => mk?.key === chosenMarketKey)
                        : undefined;

                      const outcomes: any[] = marketObj?.outcomes ?? [];

                      return (
                        <div key={ev?.id} className="rounded-md border p-3">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{gameName}</div>
                            <div className="text-xs text-muted-foreground">{when}</div>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            {bmWithMarket?.title ? `Bookmaker: ${bmWithMarket.title}` : ""}
                          </div>
                          {outcomes.length === 0 ? (
                            <div className="mt-2 text-sm text-muted-foreground">No outcomes for this market.</div>
                          ) : (
                            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                              {outcomes.map((o: any, idx: number) => {
                                // For totals/spreads we might also show point/line
                                const point =
                                  typeof o?.point === "number"
                                    ? ` @ ${o.point}`
                                    : typeof marketObj?.outcomes?.[0]?.point === "number"
                                    ? ` @ ${marketObj.outcomes[0].point}`
                                    : "";
                                return (
                                  <div
                                    key={`${ev?.id}-${idx}-${o?.name}`}
                                    className="rounded-md border bg-card p-2 shadow-sm"
                                  >
                                    <div className="text-sm font-medium">{o?.name || "-"}</div>
                                    <div className="text-xs text-muted-foreground">
                                      Odds: {o?.price ?? "-"}
                                      {point}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}