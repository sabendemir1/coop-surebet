-- Fix security issue: Restrict arbitrage opportunities to authenticated users only
-- This prevents competitors from stealing profitable trading strategies

-- Drop the existing public read policy
DROP POLICY IF EXISTS "Allow public read access to arbitrage opportunities" ON public.arbitrage_opportunities;

-- Create a new policy that requires authentication
CREATE POLICY "Authenticated users can view arbitrage opportunities" 
ON public.arbitrage_opportunities 
FOR SELECT 
TO authenticated
USING (true);

-- Also add policies for other sensitive tables to maintain consistency
-- Drop existing public policies for other tables
DROP POLICY IF EXISTS "Allow public read access to odds" ON public.odds;
DROP POLICY IF EXISTS "Allow public read access to events" ON public.events;
DROP POLICY IF EXISTS "Allow public read access to bookmakers" ON public.bookmakers;
DROP POLICY IF EXISTS "Allow public read access to sports" ON public.sports;

-- Create authenticated-only policies for all sensitive trading data
CREATE POLICY "Authenticated users can view odds" 
ON public.odds 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view events" 
ON public.events 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view bookmakers" 
ON public.bookmakers 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view sports" 
ON public.sports 
FOR SELECT 
TO authenticated
USING (true);