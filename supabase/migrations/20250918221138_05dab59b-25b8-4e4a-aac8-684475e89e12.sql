-- Create sports table
CREATE TABLE public.sports (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  has_outrights BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookmakers table
CREATE TABLE public.bookmakers (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  last_update TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create events table for storing match/game information
CREATE TABLE public.events (
  id TEXT PRIMARY KEY,
  sport_key TEXT NOT NULL,
  sport_title TEXT NOT NULL,
  commence_time TIMESTAMP WITH TIME ZONE NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  bookmaker_count INTEGER DEFAULT 0,
  last_update TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create odds table for storing bookmaker odds
CREATE TABLE public.odds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  bookmaker_key TEXT NOT NULL,
  bookmaker_title TEXT NOT NULL,
  market_key TEXT NOT NULL DEFAULT 'h2h',
  home_price DECIMAL(8,2),
  away_price DECIMAL(8,2),
  draw_price DECIMAL(8,2),
  last_update TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  FOREIGN KEY (bookmaker_key) REFERENCES public.bookmakers(key) ON DELETE CASCADE
);

-- Create arbitrage_opportunities table for calculated arbitrage opportunities
CREATE TABLE public.arbitrage_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  sport_key TEXT NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  commence_time TIMESTAMP WITH TIME ZONE NOT NULL,
  profit_margin DECIMAL(5,4) NOT NULL,
  total_stake DECIMAL(10,2) NOT NULL,
  
  -- Best odds for each outcome
  best_home_bookmaker TEXT NOT NULL,
  best_home_price DECIMAL(8,2) NOT NULL,
  best_home_stake DECIMAL(10,2) NOT NULL,
  
  best_away_bookmaker TEXT NOT NULL,
  best_away_price DECIMAL(8,2) NOT NULL,
  best_away_stake DECIMAL(10,2) NOT NULL,
  
  -- Optional draw for sports that support it
  best_draw_bookmaker TEXT,
  best_draw_price DECIMAL(8,2),
  best_draw_stake DECIMAL(10,2),
  
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_events_sport_key ON public.events(sport_key);
CREATE INDEX idx_events_commence_time ON public.events(commence_time);
CREATE INDEX idx_odds_event_id ON public.odds(event_id);
CREATE INDEX idx_odds_bookmaker_key ON public.odds(bookmaker_key);
CREATE INDEX idx_arbitrage_opportunities_sport_key ON public.arbitrage_opportunities(sport_key);
CREATE INDEX idx_arbitrage_opportunities_expires_at ON public.arbitrage_opportunities(expires_at);
CREATE INDEX idx_arbitrage_opportunities_profit_margin ON public.arbitrage_opportunities(profit_margin DESC);

-- Enable Row Level Security (tables will be accessed via edge functions mainly, but good practice)
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.odds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arbitrage_opportunities ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (since this will be accessed via edge functions)
CREATE POLICY "Allow public read access to sports" ON public.sports FOR SELECT USING (true);
CREATE POLICY "Allow public read access to bookmakers" ON public.bookmakers FOR SELECT USING (true);
CREATE POLICY "Allow public read access to events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public read access to odds" ON public.odds FOR SELECT USING (true);
CREATE POLICY "Allow public read access to arbitrage opportunities" ON public.arbitrage_opportunities FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_sports_updated_at BEFORE UPDATE ON public.sports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookmakers_updated_at BEFORE UPDATE ON public.bookmakers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_odds_updated_at BEFORE UPDATE ON public.odds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_arbitrage_opportunities_updated_at BEFORE UPDATE ON public.arbitrage_opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();