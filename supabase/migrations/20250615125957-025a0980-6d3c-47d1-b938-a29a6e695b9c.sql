
-- First, let's remove the old, very specific football-related subcategories
-- to make way for broader sports categories.
WITH goat_category AS (
  SELECT id FROM public.categories WHERE name = 'GOAT' AND parent_id IS NULL LIMIT 1
)
DELETE FROM public.categories
WHERE parent_id = (SELECT id FROM goat_category)
AND name IN (
    'GOAT Footballer', 'GOAT Goalkeeper', 'GOAT Defender', 'GOAT Midfielder',
    'GOAT Attacker', 'GOAT Free-Kick Taker', 'GOAT Finisher',
    'GOAT Dribbler', 'GOAT Playmaker', 'GOAT Leader / Captain'
);

-- Now, let's add the new, more engaging sports categories with their images.
-- These will be displayed on the homepage.
DO $$
DECLARE
    goat_category_id UUID;
    new_description TEXT := 'Dive into the debate and rank the all-time greats in this exciting category.';
BEGIN
    -- Get the ID of the parent 'GOAT' category
    SELECT id INTO goat_category_id
    FROM public.categories
    WHERE name = 'GOAT' AND parent_id IS NULL LIMIT 1;

    -- Insert the new, broader sports subcategories with image URLs from Unsplash
    -- The special 'octagon' URL is handled by the frontend to show an icon.
    INSERT INTO public.categories (name, parent_id, description, image_url)
    VALUES
        ('Football', goat_category_id, new_description, 'photo-1579952363873-27f3bade9f55'),
        ('Basketball', goat_category_id, new_description, 'photo-1546519638-68e109498ffc'),
        ('MMA', goat_category_id, new_description, 'octagon'),
        ('Tennis', goat_category_id, new_description, 'photo-1554068533-39798b35489f'),
        ('American Football', goat_category_id, new_description, 'photo-1546428664-8f0c7e80e55a'),
        ('Formula 1', goat_category_id, new_description, 'photo-1552674312-38a04b1a8069'),
        ('Esports', goat_category_id, new_description, 'photo-1593305953932-53b64b1cca28'),
        ('Boxing', goat_category_id, new_description, 'photo-1594751543129-97642d918335'),
        ('Baseball', goat_category_id, new_description, 'photo-1551022375-6e449c331904')
    ON CONFLICT (name, parent_id) WHERE parent_id IS NOT NULL DO UPDATE 
    SET description = EXCLUDED.description, image_url = EXCLUDED.image_url;
END $$;
