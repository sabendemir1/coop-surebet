import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OddsAPIEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const oddsApiKey = Deno.env.get('ODDS_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!oddsApiKey) {
      throw new Error('ODDS_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get sports parameter from request, default to popular sports
    const { sports = ['soccer_epl', 'americanfootball_nfl', 'basketball_nba', 'icehockey_nhl'] } = await req.json().catch(() => ({}));
    
    console.log('Fetching odds for sports:', sports);

    let allEvents: OddsAPIEvent[] = [];

    // Fetch odds for each sport
    for (const sport of sports) {
      const oddsUrl = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${oddsApiKey}&regions=us,uk,eu&markets=h2h&oddsFormat=decimal&bookmakers=draftkings,fanduel,betmgm,caesars,bet365,unibet`;
      
      console.log(`Fetching odds for ${sport}`);
      
      const response = await fetch(oddsUrl);
      
      if (!response.ok) {
        console.error(`Failed to fetch odds for ${sport}:`, response.status, response.statusText);
        continue;
      }

      const events: OddsAPIEvent[] = await response.json();
      allEvents = allEvents.concat(events);
      
      console.log(`Fetched ${events.length} events for ${sport}`);
    }

    console.log(`Total events fetched: ${allEvents.length}`);

    // Store events and odds in database
    for (const event of allEvents) {
      // Upsert event
      const { error: eventError } = await supabase
        .from('events')
        .upsert({
          id: event.id,
          sport_key: event.sport_key,
          sport_title: event.sport_title,
          commence_time: event.commence_time,
          home_team: event.home_team,
          away_team: event.away_team,
          bookmaker_count: event.bookmakers.length,
          last_update: new Date().toISOString()
        });

      if (eventError) {
        console.error('Error upserting event:', eventError);
        continue;
      }

      // Delete existing odds for this event to avoid stale data
      await supabase
        .from('odds')
        .delete()
        .eq('event_id', event.id);

      // Insert new odds
      for (const bookmaker of event.bookmakers) {
        const h2hMarket = bookmaker.markets.find(m => m.key === 'h2h');
        if (!h2hMarket) continue;

        const homeOutcome = h2hMarket.outcomes.find(o => o.name === event.home_team);
        const awayOutcome = h2hMarket.outcomes.find(o => o.name === event.away_team);
        const drawOutcome = h2hMarket.outcomes.find(o => o.name === 'Draw');

        // Upsert bookmaker
        await supabase
          .from('bookmakers')
          .upsert({
            id: bookmaker.key,
            key: bookmaker.key,
            title: bookmaker.title,
            last_update: bookmaker.last_update
          });

        // Insert odds
        const { error: oddsError } = await supabase
          .from('odds')
          .insert({
            event_id: event.id,
            bookmaker_key: bookmaker.key,
            bookmaker_title: bookmaker.title,
            market_key: 'h2h',
            home_price: homeOutcome?.price || null,
            away_price: awayOutcome?.price || null,
            draw_price: drawOutcome?.price || null,
            last_update: bookmaker.last_update
          });

        if (oddsError) {
          console.error('Error inserting odds:', oddsError);
        }
      }
    }

    // Trigger arbitrage calculation
    const calculateResponse = await fetch(`${supabaseUrl}/functions/v1/calculate-arbitrage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!calculateResponse.ok) {
      console.error('Failed to trigger arbitrage calculation:', calculateResponse.status);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      eventsProcessed: allEvents.length,
      message: 'Odds data updated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-odds function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});