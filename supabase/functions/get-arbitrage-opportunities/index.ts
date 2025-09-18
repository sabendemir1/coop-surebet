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

    console.log('Fetching arbitrage opportunities...');

    // Get query parameters
    const url = new URL(req.url);
    const sport = url.searchParams.get('sport');
    const minProfit = parseFloat(url.searchParams.get('minProfit') || '0.001');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let query = supabase
      .from('arbitrage_opportunities')
      .select('*')
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .gte('profit_margin', minProfit)
      .order('profit_margin', { ascending: false })
      .limit(limit);

    // Filter by sport if provided
    if (sport) {
      query = query.eq('sport_key', sport);
    }

    const { data: opportunities, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch arbitrage opportunities: ${error.message}`);
    }

    // Transform data to match frontend expectations
    const transformedOpportunities = opportunities?.map(opp => ({
      id: opp.id,
      sport: opp.sport_key.replace('_', ' ').toUpperCase(),
      homeTeam: opp.home_team,
      awayTeam: opp.away_team,
      commenceTime: opp.commence_time,
      profitMargin: opp.profit_margin,
      totalStake: opp.total_stake,
      
      // Home bet details
      homeBet: {
        bookmaker: opp.best_home_bookmaker,
        odds: opp.best_home_price,
        stake: opp.best_home_stake
      },
      
      // Away bet details
      awayBet: {
        bookmaker: opp.best_away_bookmaker,
        odds: opp.best_away_price,
        stake: opp.best_away_stake
      },
      
      // Draw bet details (if applicable)
      drawBet: opp.best_draw_bookmaker ? {
        bookmaker: opp.best_draw_bookmaker,
        odds: opp.best_draw_price,
        stake: opp.best_draw_stake
      } : null,
      
      expiresAt: opp.expires_at,
      
      // Calculate expected profit
      expectedProfit: Math.round(opp.total_stake * opp.profit_margin * 100) / 100,
      
      // Calculate minimum deposit required
      minDeposit: Math.max(opp.best_home_stake, opp.best_away_stake, opp.best_draw_stake || 0)
    })) || [];

    console.log(`Returning ${transformedOpportunities.length} arbitrage opportunities`);

    return new Response(JSON.stringify({ 
      success: true,
      opportunities: transformedOpportunities,
      count: transformedOpportunities.length,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-arbitrage-opportunities function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});