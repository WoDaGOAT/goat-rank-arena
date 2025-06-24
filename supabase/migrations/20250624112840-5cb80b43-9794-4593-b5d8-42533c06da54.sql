
-- Remove specific GOAT subcategories that are no longer needed

DO $$
DECLARE
    goat_parent_id UUID;
BEGIN
    -- Get the GOAT parent category ID
    SELECT id INTO goat_parent_id FROM public.categories WHERE name = 'GOAT' AND parent_id IS NULL LIMIT 1;
    
    -- Delete the specific categories
    DELETE FROM public.categories 
    WHERE parent_id = goat_parent_id 
    AND name IN ('GOAT Header Game', 'GOAT Long Shot');
    
    -- Also delete any potential variations of these names
    DELETE FROM public.categories 
    WHERE parent_id = goat_parent_id 
    AND (name ILIKE '%header game%' OR name ILIKE '%long shot%');
    
END $$;
