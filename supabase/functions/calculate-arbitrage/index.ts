import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OddsData {
  event_id: string;
  sport_key: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  odds: Array<{
    bookmaker_key: string;
    bookmaker_title: string;
    home_price: number;
    away_price: number;
    draw_price?: number;
  }>;
}

function calculateArbitrage(odds: OddsData['odds'], totalStake: number = 1000) {
  if (odds.length < 2) return null;

  // Find best odds for each outcome
  let bestHome = { price: 0, bookmaker: '', title: '' };
  let bestAway = { price: 0, bookmaker: '', title: '' };
  let bestDraw = { price: 0, bookmaker: '', title: '' };

  for (const odd of odds) {
    if (odd.home_price && odd.home_price > bestHome.price) {
      bestHome = { price: odd.home_price, bookmaker: odd.bookmaker_key, title: odd.bookmaker_title };
    }
    if (odd.away_price && odd.away_price > bestAway.price) {
      bestAway = { price: odd.away_price, bookmaker: odd.bookmaker_key, title: odd.bookmaker_title };
    }
    if (odd.draw_price && odd.draw_price > bestDraw.price) {
      bestDraw = { price: odd.draw_price, bookmaker: odd.bookmaker_key, title: odd.bookmaker_title };
    }
  }

  // Calculate arbitrage for 2-way markets (no draw)
  if (bestHome.price > 0 && bestAway.price > 0) {
    const impliedProbHome = 1 / bestHome.price;
    const impliedProbAway = 1 / bestAway.price;
    const totalImpliedProb = impliedProbHome + impliedProbAway;

    if (totalImpliedProb < 1) {
      // Arbitrage opportunity exists!
      const profitMargin = (1 - totalImpliedProb);
      
      // Calculate stakes
      const homeStake = (impliedProbHome / totalImpliedProb) * totalStake;
      const awayStake = (impliedProbAway / totalImpliedProb) * totalStake;

      return {
        profitMargin,
        totalStake,
        homeStake: Math.round(homeStake * 100) / 100,
        awayStake: Math.round(awayStake * 100) / 100,
        bestHome,
        bestAway,
        bestDraw: bestDraw.price > 0 ? bestDraw : null
      };
    }
  }

  // Calculate arbitrage for 3-way markets (with draw)
  if (bestHome.price > 0 && bestAway.price > 0 && bestDraw.price > 0) {
    const impliedProbHome = 1 / bestHome.price;
    const impliedProbAway = 1 / bestAway.price;
    const impliedProbDraw = 1 / bestDraw.price;
    const totalImpliedProb = impliedProbHome + impliedProbAway + impliedProbDraw;

    if (totalImpliedProb < 1) {
      // Arbitrage opportunity exists!
      const profitMargin = (1 - totalImpliedProb);
      
      // Calculate stakes
      const homeStake = (impliedProbHome / totalImpliedProb) * totalStake;
      const awayStake = (impliedProbAway / totalImpliedProb) * totalStake;
      const drawStake = (impliedProbDraw / totalImpliedProb) * totalStake;

      return {
        profitMargin,
        totalStake,
        homeStake: Math.round(homeStake * 100) / 100,
        awayStake: Math.round(awayStake * 100) / 100,
        drawStake: Math.round(drawStake * 100) / 100,
        bestHome,
        bestAway,
        bestDraw
      };
    }
  }

  return null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting arbitrage calculation...');

    // Get all events with their odds
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select(`
        id,
        sport_key,
        home_team,
        away_team,
        commence_time,
        odds (
          bookmaker_key,
          bookmaker_title,
          home_price,
          away_price,
          draw_price
        )
      `)
      .gte('commence_time', new Date().toISOString()); // Only future events

    if (eventsError) {
      throw new Error(`Failed to fetch events: ${eventsError.message}`);
    }

    console.log(`Processing ${events?.length || 0} events for arbitrage calculation`);

    // Clear existing arbitrage opportunities
    await supabase
      .from('arbitrage_opportunities')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    let opportunitiesFound = 0;

    for (const event of events || []) {
      if (!event.odds || event.odds.length < 2) continue;

      const arbitrageResult = calculateArbitrage(event.odds as any[]);
      
      if (arbitrageResult && arbitrageResult.profitMargin > 0.001) { // At least 0.1% profit
        console.log(`Arbitrage found for ${event.home_team} vs ${event.away_team}: ${(arbitrageResult.profitMargin * 100).toFixed(2)}%`);
        
        // Calculate expires_at (2 hours before commence_time or in 30 minutes, whichever is sooner)
        const commenceTime = new Date(event.commence_time);
        const twoHoursBefore = new Date(commenceTime.getTime() - 2 * 60 * 60 * 1000);
        const thirtyMinutesFromNow = new Date(Date.now() + 30 * 60 * 1000);
        const expiresAt = twoHoursBefore < thirtyMinutesFromNow ? twoHoursBefore : thirtyMinutesFromNow;

        const { error: insertError } = await supabase
          .from('arbitrage_opportunities')
          .insert({
            event_id: event.id,
            sport_key: event.sport_key,
            home_team: event.home_team,
            away_team: event.away_team,
            commence_time: event.commence_time,
            profit_margin: arbitrageResult.profitMargin,
            total_stake: arbitrageResult.totalStake,
            best_home_bookmaker: arbitrageResult.bestHome.bookmaker,
            best_home_price: arbitrageResult.bestHome.price,
            best_home_stake: arbitrageResult.homeStake,
            best_away_bookmaker: arbitrageResult.bestAway.bookmaker,
            best_away_price: arbitrageResult.bestAway.price,
            best_away_stake: arbitrageResult.awayStake,
            best_draw_bookmaker: arbitrageResult.bestDraw?.bookmaker || null,
            best_draw_price: arbitrageResult.bestDraw?.price || null,
            best_draw_stake: (arbitrageResult as any).drawStake || null,
            expires_at: expiresAt.toISOString(),
            is_active: true
          });

        if (insertError) {
          console.error('Error inserting arbitrage opportunity:', insertError);
        } else {
          opportunitiesFound++;
        }
      }
    }

    console.log(`Arbitrage calculation complete. Found ${opportunitiesFound} opportunities.`);

    return new Response(JSON.stringify({ 
      success: true, 
      opportunitiesFound,
      eventsProcessed: events?.length || 0,
      message: 'Arbitrage calculation completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in calculate-arbitrage function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});