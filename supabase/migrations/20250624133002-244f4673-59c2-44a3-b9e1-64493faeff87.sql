
-- Update the handle_new_ranking_feed_item function to match the component's expected data structure
CREATE OR REPLACE FUNCTION public.handle_new_ranking_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  author_profile JSONB;
  category_info JSONB;
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

  -- Only create feed item if we have valid category data
  IF category_info IS NOT NULL THEN
    INSERT INTO public.feed_items (type, data)
    VALUES (
      'new_ranking',
      jsonb_build_object(
        'user', author_profile,
        'category', category_info,
        'ranking_title', NEW.title,
        'top_athletes', '[]'::jsonb
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update the create_new_ranking_feed_item function to use the correct structure
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
        'top_athletes', p_athletes
      )
    );
  END IF;
END;
$$;
