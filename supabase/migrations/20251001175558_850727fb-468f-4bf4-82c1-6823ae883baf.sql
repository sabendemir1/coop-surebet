-- Add new columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN username text UNIQUE,
ADD COLUMN phone_number text,
ADD COLUMN country_code text DEFAULT '+1',
ADD COLUMN balance_usd numeric(10, 2) DEFAULT 0.00 NOT NULL;

-- Create index on username for fast lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, bookmaker, username, phone_number, country_code, balance_usd)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'bookmaker', 'bet365'),
    COALESCE(NEW.raw_user_meta_data->>'username', NULL),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', NULL),
    COALESCE(NEW.raw_user_meta_data->>'country_code', '+1'),
    0.00
  );
  RETURN NEW;
END;
$function$;

-- Create function to check username availability
CREATE OR REPLACE FUNCTION public.check_username_available(username_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE username = username_to_check
  );
END;
$function$;

-- Add RLS policy for username checking (allow authenticated users to check)
CREATE POLICY "Users can check username availability"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);