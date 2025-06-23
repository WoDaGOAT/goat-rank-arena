
-- Revert GOAT categories to the specific list provided by user
-- and rename some to match existing database categories

DO $$
DECLARE
    goat_parent_id UUID;
BEGIN
    -- Get the GOAT parent category ID
    SELECT id INTO goat_parent_id FROM public.categories WHERE name = 'GOAT' AND parent_id IS NULL LIMIT 1;
    
    IF goat_parent_id IS NULL THEN
        -- Create GOAT parent if it doesn't exist
        INSERT INTO public.categories (name, description, parent_id)
        VALUES ('GOAT', 'Greatest of All Time rankings', NULL)
        RETURNING id INTO goat_parent_id;
    END IF;

    -- Remove all existing GOAT subcategories first
    DELETE FROM public.categories WHERE parent_id = goat_parent_id;

    -- Add only the specific categories requested, with some renamed to match existing
    INSERT INTO public.categories (name, parent_id, description) VALUES
        ('GOAT Footballer', goat_parent_id, 'Greatest footballer of all time'),
        ('GOAT Goalkeeper', goat_parent_id, 'Greatest goalkeeper of all time'),
        ('GOAT Defender', goat_parent_id, 'Greatest defender of all time'),
        ('GOAT Midfielder', goat_parent_id, 'Greatest midfielder of all time'),
        ('GOAT Attacker', goat_parent_id, 'Greatest attacker of all time'), -- renamed from Forward to match existing
        ('GOAT Free-Kick Taker', goat_parent_id, 'Greatest free-kick specialist of all time'),
        ('GOAT Long Shot', goat_parent_id, 'Greatest long shot specialist of all time'),
        ('GOAT Header Game', goat_parent_id, 'Greatest header specialist of all time'), -- renamed from Header to match existing
        ('GOAT Skills', goat_parent_id, 'Greatest skilled player of all time');
END $$;
