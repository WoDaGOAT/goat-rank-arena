
-- Update Current GOAT subcategory names to use "Current " prefix instead of "(Season)" suffix

DO $$
DECLARE
    current_goat_parent_id UUID;
BEGIN
    -- Get the Current GOAT parent category ID
    SELECT id INTO current_goat_parent_id FROM public.categories WHERE name = 'Current GOAT' AND parent_id IS NULL LIMIT 1;
    
    -- Update subcategory names to use "Current " prefix instead of "(Season)" suffix
    UPDATE public.categories 
    SET name = 'Current GOAT Footballer'
    WHERE parent_id = current_goat_parent_id AND name = 'GOAT Footballer (Season)';
    
    UPDATE public.categories 
    SET name = 'Current GOAT Goalkeeper'
    WHERE parent_id = current_goat_parent_id AND name = 'GOAT Goalkeeper (Season)';
    
    UPDATE public.categories 
    SET name = 'Current GOAT Defender'
    WHERE parent_id = current_goat_parent_id AND name = 'GOAT Defender (Season)';
    
    UPDATE public.categories 
    SET name = 'Current GOAT Midfielder'
    WHERE parent_id = current_goat_parent_id AND name = 'GOAT Midfielder (Season)';
    
    UPDATE public.categories 
    SET name = 'Current GOAT Forward'
    WHERE parent_id = current_goat_parent_id AND name = 'GOAT Forward (Season)';
    
END $$;
