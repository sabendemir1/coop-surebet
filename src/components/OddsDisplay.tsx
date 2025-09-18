import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp } from "lucide-react";

interface OddsDisplayProps {
  event: {
    id: string;
    sport: string;
    homeTeam: string;
    awayTeam: string;
    commenceTime: string;
    bookmakers: {
      key: string;
      title: string;
      homeOdds: number;
      awayOdds: number;
      drawOdds?: number;
      lastUpdate: string;
    }[];
  };
}

export const OddsDisplay = ({ event }: OddsDisplayProps) => {
  const timeUntilEvent = () => {
    const now = new Date();
    const eventTime = new Date(event.commenceTime);
    const diff = eventTime.getTime() - now.getTime();
    
    if (diff < 0) return "Live";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const getBestOdds = (type: 'home' | 'away' | 'draw') => {
    if (event.bookmakers.length === 0) return null;
    
    let bestOdds = 0;
    let bestBookmaker = '';
    
    event.bookmakers.forEach(bookmaker => {
      let odds = 0;
      if (type === 'home' && bookmaker.homeOdds) odds = bookmaker.homeOdds;
      if (type === 'away' && bookmaker.awayOdds) odds = bookmaker.awayOdds;
      if (type === 'draw' && bookmaker.drawOdds) odds = bookmaker.drawOdds;
      
      if (odds > bestOdds) {
        bestOdds = odds;
        bestBookmaker = bookmaker.title;
      }
    });
    
    return bestOdds > 0 ? { odds: bestOdds, bookmaker: bestBookmaker } : null;
  };

  const homeOdds = getBestOdds('home');
  const awayOdds = getBestOdds('away');
  const drawOdds = getBestOdds('draw');

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {event.sport}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Clock className="w-3 h-3" />
              {timeUntilEvent()}
            </div>
          </div>
          <h4 className="text-lg font-semibold text-foreground">
            {event.homeTeam} vs {event.awayTeam}
          </h4>
          <p className="text-sm text-muted-foreground">
            {new Date(event.commenceTime).toLocaleString()}
          </p>
        </div>
        
        <Badge variant="secondary" className="bg-trust/20 text-trust-foreground">
          {event.bookmakers.length} bookmakers
        </Badge>
      </div>

      {/* Best Odds Display */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {homeOdds && (
          <div className="bg-gradient-to-br from-success/10 to-success/5 p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-1">{event.homeTeam}</p>
            <p className="text-xl font-bold text-foreground">{homeOdds.odds.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{homeOdds.bookmaker}</p>
          </div>
        )}
        
        {drawOdds && (
          <div className="bg-gradient-to-br from-profit/10 to-profit/5 p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-1">Draw</p>
            <p className="text-xl font-bold text-foreground">{drawOdds.odds.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{drawOdds.bookmaker}</p>
          </div>
        )}
        
        {awayOdds && (
          <div className="bg-gradient-to-br from-trust/10 to-trust/5 p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-1">{event.awayTeam}</p>
            <p className="text-xl font-bold text-foreground">{awayOdds.odds.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{awayOdds.bookmaker}</p>
          </div>
        )}
      </div>

      {/* All Bookmakers */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          All Bookmakers
        </h5>
        <div className="grid gap-2">
          {event.bookmakers.map((bookmaker, index) => (
            <div 
              key={index} 
              className="grid grid-cols-4 gap-2 p-2 bg-muted/50 rounded text-sm"
            >
              <div className="font-medium text-foreground truncate">
                {bookmaker.title}
              </div>
              <div className="text-center">
                {bookmaker.homeOdds ? bookmaker.homeOdds.toFixed(2) : '-'}
              </div>
              <div className="text-center">
                {bookmaker.drawOdds ? bookmaker.drawOdds.toFixed(2) : '-'}
              </div>
              <div className="text-center">
                {bookmaker.awayOdds ? bookmaker.awayOdds.toFixed(2) : '-'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};