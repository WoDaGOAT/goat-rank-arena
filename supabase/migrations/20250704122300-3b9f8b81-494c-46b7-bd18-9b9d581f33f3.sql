
-- Add clubs column to athletes table
ALTER TABLE public.athletes ADD COLUMN clubs TEXT[];

-- Create a separate table to store all unique clubs for autocomplete
CREATE TABLE public.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  country TEXT,
  league TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better performance on club searches
CREATE INDEX idx_clubs_name ON public.clubs(name);
CREATE INDEX idx_clubs_country ON public.clubs(country);

-- Enable RLS on clubs table
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

-- Create policies for clubs table (public read, authenticated write)
CREATE POLICY "Anyone can view clubs" ON public.clubs FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can insert clubs" ON public.clubs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update clubs" ON public.clubs FOR UPDATE TO authenticated USING (true);

-- Insert some common clubs as seed data
INSERT INTO public.clubs (name, country, league) VALUES
  ('FC Barcelona', 'Spain', 'La Liga'),
  ('Real Madrid CF', 'Spain', 'La Liga'),
  ('Manchester United FC', 'England', 'Premier League'),
  ('Manchester City FC', 'England', 'Premier League'),
  ('Liverpool FC', 'England', 'Premier League'),
  ('Chelsea FC', 'England', 'Premier League'),
  ('Arsenal FC', 'England', 'Premier League'),
  ('Bayern Munich', 'Germany', 'Bundesliga'),
  ('Borussia Dortmund', 'Germany', 'Bundesliga'),
  ('Paris Saint-Germain', 'France', 'Ligue 1'),
  ('Juventus FC', 'Italy', 'Serie A'),
  ('AC Milan', 'Italy', 'Serie A'),
  ('Inter Milan', 'Italy', 'Serie A'),
  ('Ajax Amsterdam', 'Netherlands', 'Eredivisie'),
  ('Atletico Madrid', 'Spain', 'La Liga')
ON CONFLICT (name) DO NOTHING;

-- Update trigger for clubs table
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON public.clubs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
