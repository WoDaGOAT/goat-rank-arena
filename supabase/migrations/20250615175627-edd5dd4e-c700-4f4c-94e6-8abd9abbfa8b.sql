
DO $$
DECLARE
    goat_category_id UUID;
    new_description TEXT := 'Join the debate and rank the greatest. Who is your GOAT in this category?';
BEGIN
    -- First, get the ID of the 'GOAT' parent category
    SELECT id INTO goat_category_id
    FROM public.categories
    WHERE name = 'GOAT' AND parent_id IS NULL LIMIT 1;

    -- If the GOAT category exists, clear its old subcategories and insert the new ones
    IF goat_category_id IS NOT NULL THEN
        -- Delete all existing subcategories of GOAT to ensure a clean state
        DELETE FROM public.categories WHERE parent_id = goat_category_id;

        -- Insert the correct list of GOAT subcategories for Football
        INSERT INTO public.categories (name, parent_id, description, image_url)
        VALUES
            ('GOAT Footballer', goat_category_id, new_description, '/placeholder.svg'),
            ('GOAT Goalkeeper', goat_category_id, new_description, '/placeholder.svg'),
            ('GOAT Defender', goat_category_id, new_description, '/placeholder.svg'),
            ('GOAT Midfielder', goat_category_id, new_description, '/placeholder.svg'),
            ('GOAT Attacker', goat_category_id, new_description, '/placeholder.svg'),
            ('GOAT Free-Kick Taker', goat_category_id, new_description, '/placeholder.svg'),
            ('GOAT Strongest Shot', goat_category_id, new_description, '/placeholder.svg'),
            ('GOAT Header Game', goat_category_id, new_description, '/placeholder.svg'),
            ('GOAT Skills', goat_category_id, new_description, '/placeholder.svg'),
            ('GOAT Serie A (Italy)', goat_category_id, new_description, '/placeholder.svg'),
            ('GOAT Ligue 1 (France)', goat_category_id, new_description, '/placeholder.svg'),
            ('GOAT Premier League (UK)', goat_category_id, new_description, '/placeholder.svg'),
            ('GOAT Bundesliga (Germany)', goat_category_id, new_description, '/placeholder.svg'),
            ('GOAT LaLiga (Spain)', goat_category_id, new_description, '/placeholder.svg');
    END IF;
END $$;
