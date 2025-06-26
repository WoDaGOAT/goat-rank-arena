
-- Add the new "GOAT Attacking midfielder/winger" category under the main GOAT category
DO $$
DECLARE
    goat_category_id UUID;
BEGIN
    -- Get the ID of the parent 'GOAT' category
    SELECT id INTO goat_category_id
    FROM public.categories
    WHERE name = 'GOAT' AND parent_id IS NULL LIMIT 1;

    -- Insert the new subcategory
    INSERT INTO public.categories (name, parent_id, description, image_url)
    VALUES (
        'GOAT Attacking midfielder/winger', 
        goat_category_id, 
        'Rank the greatest players who excel in both attacking midfield and wing positions.',
        'photo-1493962853295-0fd70327578a'
    )
    ON CONFLICT (name, parent_id) WHERE parent_id IS NOT NULL DO NOTHING;
END $$;
