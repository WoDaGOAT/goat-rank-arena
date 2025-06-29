
-- First, let's identify and fix feed items that are missing ranking_id
-- Update new_ranking feed items that have the ranking data but missing ranking_id field

UPDATE feed_items 
SET data = data || jsonb_build_object('ranking_id', (data->>'ranking_id'))
WHERE type = 'new_ranking' 
AND data ? 'ranking_title' 
AND NOT (data ? 'ranking_id')
AND EXISTS (
  SELECT 1 FROM user_rankings ur 
  WHERE ur.title = data->>'ranking_title'
);

-- For feed items where we can match by title and user, add the ranking_id
UPDATE feed_items 
SET data = data || jsonb_build_object('ranking_id', ur.id::text)
FROM user_rankings ur
WHERE feed_items.type = 'new_ranking'
AND NOT (feed_items.data ? 'ranking_id')
AND feed_items.data->>'ranking_title' = ur.title
AND (
  feed_items.data->'user'->>'id' = ur.user_id::text 
  OR feed_items.data->'author'->>'id' = ur.user_id::text
);

-- Update the handle_new_ranking_feed_item function to always include ranking_id
CREATE OR REPLACE FUNCTION public.handle_new_ranking_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  author_profile JSONB;
  category_info JSONB;
  ranking_athletes JSONB;
BEGIN
  -- Get author's profile info with validation
  SELECT jsonb_build_object('id', id, 'full_name', full_name, 'avatar_url', avatar_url)
  INTO author_profile
  FROM public.profiles
  WHERE id = NEW.user_id
  AND full_name IS NOT NULL 
  AND full_name != '';

  -- Only proceed if we have a valid user profile
  IF author_profile IS NULL THEN
    RETURN NEW; -- Don't create feed item, just return
  END IF;

  -- Get category info as an object
  SELECT jsonb_build_object('id', id, 'name', name)
  INTO category_info
  FROM public.categories
  WHERE id = NEW.category_id;

  -- Get top 5 athletes from the ranking
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', ra.athlete_id,
      'name', a.name,
      'position', ra.position,
      'imageUrl', a.profile_picture_url
    ) ORDER BY ra.position
  )
  INTO ranking_athletes
  FROM ranking_athletes ra
  JOIN athletes a ON ra.athlete_id = a.id
  WHERE ra.ranking_id = NEW.id
  LIMIT 5;

  -- Only create feed item if we have valid category data
  IF category_info IS NOT NULL THEN
    INSERT INTO public.feed_items (type, data)
    VALUES (
      'new_ranking',
      jsonb_build_object(
        'user', author_profile,
        'category', category_info,
        'ranking_title', NEW.title,
        'ranking_id', NEW.id,
        'top_athletes', COALESCE(ranking_athletes, '[]'::jsonb)
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update the create_new_ranking_feed_item function to always include ranking_id
CREATE OR REPLACE FUNCTION public.create_new_ranking_feed_item(p_ranking_id uuid, p_athletes jsonb, p_ranking_description text DEFAULT '')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ranking_record RECORD;
  author_profile JSONB;
  category_info JSONB;
BEGIN
  -- Get ranking details from the provided ranking ID
  SELECT * INTO ranking_record
  FROM public.user_rankings
  WHERE id = p_ranking_id;

  -- Get the author's profile information with validation
  SELECT jsonb_build_object('id', id, 'full_name', full_name, 'avatar_url', avatar_url)
  INTO author_profile
  FROM public.profiles
  WHERE id = ranking_record.user_id
  AND full_name IS NOT NULL 
  AND full_name != '';

  -- Only proceed if we have a valid user profile
  IF author_profile IS NULL THEN
    RETURN; -- Don't create feed item, just return
  END IF;

  -- Get category info as an object
  SELECT jsonb_build_object('id', id, 'name', name)
  INTO category_info
  FROM public.categories
  WHERE id = ranking_record.category_id;

  -- Only create feed item if we have valid category data
  IF category_info IS NOT NULL THEN
    INSERT INTO public.feed_items (type, data)
    VALUES (
      'new_ranking',
      jsonb_build_object(
        'user', author_profile,
        'category', category_info,
        'ranking_title', ranking_record.title,
        'ranking_id', p_ranking_id,
        'top_athletes', p_athletes
      )
    );
  END IF;
END;
$$;
