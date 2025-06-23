
-- Fix GOAT categories structure - handle duplicates properly

DO $$
DECLARE
    goat_parent_id UUID;
    competitions_parent_id UUID;
BEGIN
    -- Get the GOAT and Competitions parent category IDs
    SELECT id INTO goat_parent_id FROM public.categories WHERE name = 'GOAT' AND parent_id IS NULL LIMIT 1;
    SELECT id INTO competitions_parent_id FROM public.categories WHERE name = 'Competitions' AND parent_id IS NULL LIMIT 1;
    
    -- Create Competitions parent if it doesn't exist
    IF competitions_parent_id IS NULL THEN
        INSERT INTO public.categories (name, description, parent_id)
        VALUES ('Competitions', 'League and competition-specific rankings', NULL)
        RETURNING id INTO competitions_parent_id;
    END IF;
    
    -- Delete competition categories that are under GOAT parent (since they already exist under Competitions)
    DELETE FROM public.categories 
    WHERE parent_id = goat_parent_id 
    AND name IN ('GOAT Bundesliga (Germany)', 'GOAT LaLiga (Spain)', 'GOAT Serie A (Italy)', 'GOAT Premier League (UK)', 'GOAT Ligue 1 (France)');
    
    -- Delete all remaining GOAT subcategories to start fresh
    DELETE FROM public.categories WHERE parent_id = goat_parent_id;
    
    -- Insert exactly the 9 GOAT categories requested by the user
    INSERT INTO public.categories (name, parent_id, description) VALUES
        ('GOAT Footballer', goat_parent_id, 'Greatest footballer of all time'),
        ('GOAT Goalkeeper', goat_parent_id, 'Greatest goalkeeper of all time'),
        ('GOAT Defender', goat_parent_id, 'Greatest defender of all time'),
        ('GOAT Midfielder', goat_parent_id, 'Greatest midfielder of all time'),
        ('GOAT Attacker', goat_parent_id, 'Greatest attacker of all time'),
        ('GOAT Free-Kick Taker', goat_parent_id, 'Greatest free-kick specialist of all time'),
        ('GOAT Long Shot', goat_parent_id, 'Greatest long shot specialist of all time'),
        ('GOAT Header Game', goat_parent_id, 'Greatest header specialist of all time'),
        ('GOAT Skills', goat_parent_id, 'Greatest skilled player of all time');
END $$;
