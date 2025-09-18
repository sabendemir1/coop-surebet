import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { OddsDisplay } from "./OddsDisplay";

interface LiveEvent {
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
}

export const LiveOddsTab = () => {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLiveOdds = async () => {
    try {
      setLoading(true);
      console.log('Fetching live odds...');
      
      const { data, error } = await supabase.functions.invoke('get-live-odds', {
        body: { limit: 20 }
      });

      if (error) {
        console.error('Error fetching live odds:', error);
        return;
      }

      console.log('Received live odds:', data);
      
      if (data?.events) {
        setEvents(data.events);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching live odds:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerFetchOdds = async () => {
    try {
      setFetching(true);
      console.log('Triggering odds data refresh...');
      
      const { data, error } = await supabase.functions.invoke('trigger-fetch-odds', {
        body: {}
      });

      if (error) {
        console.error('Error triggering odds fetch:', error);
        return;
      }

      console.log('Odds fetch triggered:', data);
      
      // Wait a moment then refresh the data
      setTimeout(() => {
        fetchLiveOdds();
      }, 3000);
      
    } catch (error) {
      console.error('Error triggering odds fetch:', error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLiveOdds();
    // Set up periodic refresh every 5 minutes
    const interval = setInterval(fetchLiveOdds, 300000);
    return () => clearInterval(interval);
  }, []);

  const totalEvents = events.length;
  const totalBookmakers = events.reduce((sum, event) => sum + event.bookmakers.length, 0);
  const avgBookmakersPerEvent = totalEvents > 0 ? Math.round(totalBookmakers / totalEvents) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Live Odds</h3>
          <p className="text-muted-foreground">
            Real-time odds from multiple bookmakers
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchLiveOdds} 
            disabled={loading}
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="default" 
            onClick={triggerFetchOdds} 
            disabled={fetching}
            size="sm"
          >
            <Activity className={`w-4 h-4 mr-2 ${fetching ? 'animate-pulse' : ''}`} />
            {fetching ? 'Fetching...' : 'Fetch Latest'}
          </Button>
        </div>
      </div>

      {/* Status */}
      {lastUpdated && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-success/20 text-success">
            Live Data
          </Badge>
          <Badge variant="outline" className="text-xs">
            Updated: {lastUpdated.toLocaleTimeString()}
          </Badge>
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-trust/20 rounded-full">
              <TrendingUp className="w-5 h-5 text-trust-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Live Events</p>
              <p className="text-2xl font-bold text-foreground">{totalEvents}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-profit/20 rounded-full">
              <Activity className="w-5 h-5 text-profit-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bookmakers</p>
              <p className="text-2xl font-bold text-foreground">{totalBookmakers}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success/20 rounded-full">
              <RefreshCw className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Bookmakers/Event</p>
              <p className="text-2xl font-bold text-foreground">{avgBookmakersPerEvent}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Loading live odds...</p>
          </Card>
        ) : events.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No live odds data available. Click "Fetch Latest" to retrieve data from the Odds API.
            </p>
            <Button onClick={triggerFetchOdds} disabled={fetching}>
              <Activity className="w-4 h-4 mr-2" />
              Fetch Live Data
            </Button>
          </Card>
        ) : (
          events.map((event) => (
            <OddsDisplay key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
};