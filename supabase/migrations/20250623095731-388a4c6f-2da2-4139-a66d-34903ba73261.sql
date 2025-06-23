
-- Create storage bucket for athlete profile pictures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('athlete-images', 'athlete-images', true);

-- Create storage policies for athlete images (public read access)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'athlete-images');

CREATE POLICY "Authenticated users can upload athlete images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'athlete-images');

CREATE POLICY "Authenticated users can update athlete images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'athlete-images');

CREATE POLICY "Authenticated users can delete athlete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'athlete-images');

-- Create athletes table
CREATE TABLE public.athletes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  profile_picture_url TEXT,
  date_of_birth DATE,
  date_of_death DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  country_of_origin TEXT,
  nationality TEXT,
  positions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create athlete_clubs junction table for club history
CREATE TABLE public.athlete_clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id TEXT REFERENCES public.athletes(id) ON DELETE CASCADE,
  club_name TEXT NOT NULL,
  country TEXT,
  league TEXT,
  years_active TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create athlete_competitions junction table for competitions
CREATE TABLE public.athlete_competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id TEXT REFERENCES public.athletes(id) ON DELETE CASCADE,
  competition_name TEXT NOT NULL,
  competition_type TEXT CHECK (competition_type IN ('international', 'continental', 'domestic')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Migrate ALL existing footballer data from footballPlayers.ts to athletes table
INSERT INTO public.athletes (id, name, profile_picture_url, date_of_birth, date_of_death, is_active, country_of_origin, nationality, positions)
VALUES 
  ('pele', 'Pelé', '/placeholder.svg', '1940-10-23', '2022-12-29', false, 'Brazil', 'Brazilian', ARRAY['Forward', 'Attacking Midfielder']),
  ('maradona', 'Diego Maradona', '/placeholder.svg', '1960-10-30', '2020-11-25', false, 'Argentina', 'Argentine', ARRAY['Attacking Midfielder', 'Forward']),
  ('cruyff', 'Johan Cruyff', '/placeholder.svg', '1947-04-25', '2016-03-24', false, 'Netherlands', 'Dutch', ARRAY['Forward', 'Attacking Midfielder', 'Midfielder']),
  ('beckenbauer', 'Franz Beckenbauer', '/placeholder.svg', '1945-09-11', '2024-01-07', false, 'Germany', 'German', ARRAY['Sweeper', 'Centre-Back', 'Defensive Midfielder']),
  ('zico', 'Zico', '/placeholder.svg', '1953-03-03', NULL, false, 'Brazil', 'Brazilian', ARRAY['Attacking Midfielder', 'Forward']),
  ('messi', 'Lionel Messi', '/placeholder.svg', '1987-06-24', NULL, true, 'Argentina', 'Argentine', ARRAY['Right Winger', 'Attacking Midfielder', 'Forward']),
  ('cristiano', 'Cristiano Ronaldo', '/placeholder.svg', '1985-02-05', NULL, true, 'Portugal', 'Portuguese', ARRAY['Right Winger', 'Left Winger', 'Forward', 'Striker']),
  ('mbappe', 'Kylian Mbappé', '/placeholder.svg', '1998-12-20', NULL, true, 'France', 'French', ARRAY['Left Winger', 'Right Winger', 'Striker', 'Forward']),
  ('haaland', 'Erling Haaland', '/placeholder.svg', '2000-07-21', NULL, true, 'Norway', 'Norwegian', ARRAY['Striker', 'Forward']),
  ('neymar', 'Neymar Jr.', '/placeholder.svg', '1992-02-05', NULL, true, 'Brazil', 'Brazilian', ARRAY['Left Winger', 'Right Winger', 'Attacking Midfielder', 'Forward']),
  ('debruyne', 'Kevin De Bruyne', '/placeholder.svg', '1991-06-28', NULL, true, 'Belgium', 'Belgian', ARRAY['Central Midfielder', 'Attacking Midfielder', 'Right Midfielder']),
  ('lewandowski', 'Robert Lewandowski', '/placeholder.svg', '1988-08-21', NULL, true, 'Poland', 'Polish', ARRAY['Striker', 'Forward']),
  ('zidane', 'Zinedine Zidane', '/placeholder.svg', '1972-06-23', NULL, false, 'France', 'French', ARRAY['Attacking Midfielder']),
  ('ronaldinho', 'Ronaldinho', '/placeholder.svg', '1980-03-21', NULL, false, 'Brazil', 'Brazilian', ARRAY['Attacking Midfielder', 'Forward']),
  ('ronaldo-nazario', 'Ronaldo Nazário', '/placeholder.svg', '1976-09-22', NULL, false, 'Brazil', 'Brazilian', ARRAY['Striker']),
  ('thierry-henry', 'Thierry Henry', '/placeholder.svg', '1977-08-17', NULL, false, 'France', 'French', ARRAY['Striker', 'Left Winger']),
  ('xavi', 'Xavi Hernández', '/placeholder.svg', '1980-01-25', NULL, false, 'Spain', 'Spanish', ARRAY['Central Midfielder']),
  ('iniesta', 'Andrés Iniesta', '/placeholder.svg', '1984-05-11', NULL, false, 'Spain', 'Spanish', ARRAY['Central Midfielder', 'Attacking Midfielder']),
  ('modric', 'Luka Modrić', '/placeholder.svg', '1985-09-09', NULL, true, 'Croatia', 'Croatian', ARRAY['Central Midfielder']),
  ('salah', 'Mohamed Salah', '/placeholder.svg', '1992-06-15', NULL, true, 'Egypt', 'Egyptian', ARRAY['Right Winger', 'Forward']),
  ('van-dijk', 'Virgil van Dijk', '/placeholder.svg', '1991-07-08', NULL, true, 'Netherlands', 'Dutch', ARRAY['Centre-Back']),
  ('ramos', 'Sergio Ramos', '/placeholder.svg', '1986-03-30', NULL, true, 'Spain', 'Spanish', ARRAY['Centre-Back', 'Right-Back']),
  ('kane', 'Harry Kane', '/placeholder.svg', '1993-07-28', NULL, true, 'England', 'English', ARRAY['Striker']),
  ('griezmann', 'Antoine Griezmann', '/placeholder.svg', '1991-03-21', NULL, true, 'France', 'French', ARRAY['Forward', 'Attacking Midfielder']),
  ('suarez', 'Luis Suárez', '/placeholder.svg', '1987-01-24', NULL, true, 'Uruguay', 'Uruguayan', ARRAY['Striker']),
  ('maldini', 'Paolo Maldini', '/placeholder.svg', '1968-06-26', NULL, false, 'Italy', 'Italian', ARRAY['Left-Back', 'Centre-Back']),
  ('kaka', 'Kaká', '/placeholder.svg', '1982-04-22', NULL, false, 'Brazil', 'Brazilian', ARRAY['Attacking Midfielder']),
  ('pirlo', 'Andrea Pirlo', '/placeholder.svg', '1979-05-19', NULL, false, 'Italy', 'Italian', ARRAY['Deep-Lying Playmaker', 'Central Midfielder']),
  ('gerrard', 'Steven Gerrard', '/placeholder.svg', '1980-05-30', NULL, false, 'England', 'English', ARRAY['Central Midfielder', 'Attacking Midfielder']),
  ('lampard', 'Frank Lampard', '/placeholder.svg', '1978-06-20', NULL, false, 'England', 'English', ARRAY['Central Midfielder', 'Attacking Midfielder']),
  ('drogba', 'Didier Drogba', '/placeholder.svg', '1978-03-11', NULL, false, 'Ivory Coast', 'Ivorian', ARRAY['Striker']),
  ('etoo', 'Samuel Eto''o', '/placeholder.svg', '1981-03-10', NULL, false, 'Cameroon', 'Cameroonian', ARRAY['Striker']),
  ('puyol', 'Carles Puyol', '/placeholder.svg', '1978-04-13', NULL, false, 'Spain', 'Spanish', ARRAY['Centre-Back', 'Right-Back']),
  ('casillas', 'Iker Casillas', '/placeholder.svg', '1981-05-20', NULL, false, 'Spain', 'Spanish', ARRAY['Goalkeeper']),
  ('buffon', 'Gianluigi Buffon', '/placeholder.svg', '1978-01-28', NULL, false, 'Italy', 'Italian', ARRAY['Goalkeeper']),
  ('neuer', 'Manuel Neuer', '/placeholder.svg', '1986-03-27', NULL, true, 'Germany', 'German', ARRAY['Goalkeeper']),
  ('kroos', 'Toni Kroos', '/placeholder.svg', '1990-01-04', NULL, true, 'Germany', 'German', ARRAY['Central Midfielder']),
  ('busquets', 'Sergio Busquets', '/placeholder.svg', '1988-07-16', NULL, true, 'Spain', 'Spanish', ARRAY['Defensive Midfielder']),
  ('ibrahimovic', 'Zlatan Ibrahimović', '/placeholder.svg', '1981-10-03', NULL, false, 'Sweden', 'Swedish', ARRAY['Striker']),
  ('bale', 'Gareth Bale', '/placeholder.svg', '1989-07-16', NULL, false, 'Wales', 'Welsh', ARRAY['Right Winger', 'Forward']),
  ('robben', 'Arjen Robben', '/placeholder.svg', '1984-01-23', NULL, false, 'Netherlands', 'Dutch', ARRAY['Right Winger']),
  ('ribery', 'Franck Ribéry', '/placeholder.svg', '1983-04-07', NULL, false, 'France', 'French', ARRAY['Left Winger']),
  ('figo', 'Luís Figo', '/placeholder.svg', '1972-11-04', NULL, false, 'Portugal', 'Portuguese', ARRAY['Right Winger', 'Attacking Midfielder']),
  ('raul', 'Raúl', '/placeholder.svg', '1977-06-27', NULL, false, 'Spain', 'Spanish', ARRAY['Striker', 'Second Striker']),
  ('roberto-carlos', 'Roberto Carlos', '/placeholder.svg', '1973-04-10', NULL, false, 'Brazil', 'Brazilian', ARRAY['Left-Back']),
  ('cafu', 'Cafu', '/placeholder.svg', '1970-06-07', NULL, false, 'Brazil', 'Brazilian', ARRAY['Right-Back']),
  ('shevchenko', 'Andriy Shevchenko', '/placeholder.svg', '1976-09-29', NULL, false, 'Ukraine', 'Ukrainian', ARRAY['Striker']),
  ('nedved', 'Pavel Nedvěd', '/placeholder.svg', '1972-08-30', NULL, false, 'Czech Republic', 'Czech', ARRAY['Attacking Midfielder', 'Left Winger']),
  ('bergkamp', 'Dennis Bergkamp', '/placeholder.svg', '1969-05-10', NULL, false, 'Netherlands', 'Dutch', ARRAY['Second Striker', 'Attacking Midfielder']),
  ('cantona', 'Eric Cantona', '/placeholder.svg', '1966-05-24', NULL, false, 'France', 'French', ARRAY['Forward', 'Attacking Midfielder']),
  ('scholes', 'Paul Scholes', '/placeholder.svg', '1974-11-16', NULL, false, 'England', 'English', ARRAY['Central Midfielder']),
  ('giggs', 'Ryan Giggs', '/placeholder.svg', '1973-11-29', NULL, false, 'Wales', 'Welsh', ARRAY['Left Winger']),
  ('beckham', 'David Beckham', '/placeholder.svg', '1975-05-02', NULL, false, 'England', 'English', ARRAY['Right Midfielder', 'Central Midfielder']),
  ('totti', 'Francesco Totti', '/placeholder.svg', '1976-09-27', NULL, false, 'Italy', 'Italian', ARRAY['Attacking Midfielder', 'Forward']),
  ('del-piero', 'Alessandro Del Piero', '/placeholder.svg', '1974-11-09', NULL, false, 'Italy', 'Italian', ARRAY['Second Striker', 'Attacking Midfielder']);

-- Create indexes for better performance
CREATE INDEX idx_athletes_name ON public.athletes(name);
CREATE INDEX idx_athletes_country ON public.athletes(country_of_origin);
CREATE INDEX idx_athletes_active ON public.athletes(is_active);
CREATE INDEX idx_athlete_clubs_athlete_id ON public.athlete_clubs(athlete_id);
CREATE INDEX idx_athlete_competitions_athlete_id ON public.athlete_competitions(athlete_id);

-- Enable RLS on all tables (initially permissive for public read access)
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athlete_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athlete_competitions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to athletes data
CREATE POLICY "Anyone can view athletes" ON public.athletes FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can view athlete clubs" ON public.athlete_clubs FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can view athlete competitions" ON public.athlete_competitions FOR SELECT TO public USING (true);

-- Create policies for authenticated write access (for admin functionality later)
CREATE POLICY "Authenticated users can insert athletes" ON public.athletes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update athletes" ON public.athletes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete athletes" ON public.athletes FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert athlete clubs" ON public.athlete_clubs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update athlete clubs" ON public.athlete_clubs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete athlete clubs" ON public.athlete_clubs FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert athlete competitions" ON public.athlete_competitions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update athlete competitions" ON public.athlete_competitions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete athlete competitions" ON public.athlete_competitions FOR DELETE TO authenticated USING (true);

-- Now add the foreign key constraint after all athletes are populated
ALTER TABLE public.ranking_athletes ADD CONSTRAINT ranking_athletes_athlete_id_fkey 
  FOREIGN KEY (athlete_id) REFERENCES public.athletes(id) ON DELETE CASCADE;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON public.athletes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
