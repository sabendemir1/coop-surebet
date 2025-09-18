import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching live odds...');

    // Get query parameters
    const url = new URL(req.url);
    const sport = url.searchParams.get('sport');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    // Fetch events with their odds
    let eventsQuery = supabase
      .from('events')
      .select(`
        *,
        odds (
          bookmaker_key,
          bookmaker_title,
          home_price,
          away_price,
          draw_price,
          last_update
        )
      `)
      .gte('commence_time', new Date().toISOString())
      .order('commence_time', { ascending: true })
      .limit(limit);

    // Filter by sport if provided
    if (sport) {
      eventsQuery = eventsQuery.eq('sport_key', sport);
    }

    const { data: events, error } = await eventsQuery;

    if (error) {
      throw new Error(`Failed to fetch live odds: ${error.message}`);
    }

    // Transform data for frontend
    const transformedEvents = events?.map(event => ({
      id: event.id,
      sport: event.sport_title,
      homeTeam: event.home_team,
      awayTeam: event.away_team,
      commenceTime: event.commence_time,
      bookmakers: event.odds?.map((odd: any) => ({
        key: odd.bookmaker_key,
        title: odd.bookmaker_title,
        homeOdds: odd.home_price,
        awayOdds: odd.away_price,
        drawOdds: odd.draw_price,
        lastUpdate: odd.last_update
      })) || []
    })) || [];

    console.log(`Returning ${transformedEvents.length} events with live odds`);

    return new Response(JSON.stringify({ 
      success: true,
      events: transformedEvents,
      count: transformedEvents.length,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-live-odds function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});