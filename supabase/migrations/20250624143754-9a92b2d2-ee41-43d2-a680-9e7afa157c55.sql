
-- First, let's check if "Current GOAT Footballer" category exists and create it if it doesn't
DO $$
DECLARE
    current_goat_parent_id UUID;
    current_goat_footballer_exists BOOLEAN;
BEGIN
    -- Check if "Current GOAT" parent category exists
    SELECT id INTO current_goat_parent_id 
    FROM public.categories 
    WHERE name = 'Current GOAT' AND parent_id IS NULL 
    LIMIT 1;
    
    -- If Current GOAT parent doesn't exist, create it
    IF current_goat_parent_id IS NULL THEN
        INSERT INTO public.categories (name, description, parent_id)
        VALUES ('Current GOAT', 'Current greatest athletes in various categories', NULL)
        RETURNING id INTO current_goat_parent_id;
    END IF;
    
    -- Check if "Current GOAT Footballer" already exists
    SELECT EXISTS(
        SELECT 1 FROM public.categories 
        WHERE name = 'Current GOAT Footballer' AND parent_id = current_goat_parent_id
    ) INTO current_goat_footballer_exists;
    
    -- Create "Current GOAT Footballer" if it doesn't exist
    IF NOT current_goat_footballer_exists THEN
        INSERT INTO public.categories (name, description, parent_id)
        VALUES (
            'Current GOAT Footballer', 
            'Greatest footballer currently playing', 
            current_goat_parent_id
        );
    END IF;
END $$;
