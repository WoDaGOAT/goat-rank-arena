
-- First, let's clean up the existing categories structure and align with the menu requirements

-- Get the parent category IDs we'll need
DO $$
DECLARE
    goat_parent_id UUID;
    season_parent_id UUID;
    competitions_parent_id UUID;
BEGIN
    -- Get or create the main parent categories
    SELECT id INTO goat_parent_id FROM public.categories WHERE name = 'GOAT' AND parent_id IS NULL LIMIT 1;
    
    -- Create "Greatest of This Season" parent category
    INSERT INTO public.categories (name, description, parent_id)
    VALUES ('Greatest of This Season', 'Current season rankings and debates', NULL)
    ON CONFLICT DO NOTHING
    RETURNING id INTO season_parent_id;
    
    -- If the insert didn't happen due to conflict, get the existing ID
    IF season_parent_id IS NULL THEN
        SELECT id INTO season_parent_id FROM public.categories WHERE name = 'Greatest of This Season' AND parent_id IS NULL LIMIT 1;
    END IF;
    
    -- Create "Competitions" parent category
    INSERT INTO public.categories (name, description, parent_id)
    VALUES ('Competitions', 'League and competition-specific rankings', NULL)
    ON CONFLICT DO NOTHING
    RETURNING id INTO competitions_parent_id;
    
    -- If the insert didn't happen due to conflict, get the existing ID
    IF competitions_parent_id IS NULL THEN
        SELECT id INTO competitions_parent_id FROM public.categories WHERE name = 'Competitions' AND parent_id IS NULL LIMIT 1;
    END IF;

    -- Update existing GOAT subcategories to match menu names
    UPDATE public.categories SET name = 'GOAT Forward' WHERE name = 'GOAT Attacker' AND parent_id = goat_parent_id;
    UPDATE public.categories SET name = 'GOAT Header' WHERE name = 'GOAT Header Game' AND parent_id = goat_parent_id;
    UPDATE public.categories SET name = 'GOAT Long Shot' WHERE name = 'GOAT Strongest Shot' AND parent_id = goat_parent_id;

    -- Add missing "Greatest of This Season" subcategories
    INSERT INTO public.categories (name, parent_id, description)
    VALUES
        ('GOAT Footballer (Season)', season_parent_id, 'Best footballer of this season'),
        ('GOAT Goalkeeper (Season)', season_parent_id, 'Best goalkeeper of this season'),
        ('GOAT Defender (Season)', season_parent_id, 'Best defender of this season'),
        ('GOAT Midfielder (Season)', season_parent_id, 'Best midfielder of this season'),
        ('GOAT Forward (Season)', season_parent_id, 'Best forward of this season')
    ON CONFLICT (name, parent_id) WHERE parent_id IS NOT NULL DO NOTHING;

    -- Ensure all competition categories exist under Competitions parent
    INSERT INTO public.categories (name, parent_id, description)
    VALUES
        ('GOAT Serie A (Italy)', competitions_parent_id, 'Greatest Serie A player of all time'),
        ('GOAT Ligue 1 (France)', competitions_parent_id, 'Greatest Ligue 1 player of all time'),
        ('GOAT Premier League (UK)', competitions_parent_id, 'Greatest Premier League player of all time'),
        ('GOAT Bundesliga (Germany)', competitions_parent_id, 'Greatest Bundesliga player of all time'),
        ('GOAT LaLiga (Spain)', competitions_parent_id, 'Greatest LaLiga player of all time')
    ON CONFLICT (name, parent_id) WHERE parent_id IS NOT NULL DO NOTHING;

    -- Remove old parent categories that are no longer needed
    DELETE FROM public.categories WHERE name IN ('Current GOAT', 'GOAT of my Time') AND parent_id IS NULL;
    
    -- Remove any orphaned categories that don't match our structure
    DELETE FROM public.categories WHERE parent_id IS NULL AND name NOT IN ('GOAT', 'Greatest of This Season', 'Competitions');
END $$;
