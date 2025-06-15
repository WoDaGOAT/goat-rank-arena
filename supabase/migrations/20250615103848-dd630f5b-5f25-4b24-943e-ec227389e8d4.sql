
-- Step 1: Drop the old trigger and function which are no longer needed
DROP TRIGGER IF EXISTS on_new_ranking_for_feed ON public.user_rankings;
DROP FUNCTION IF EXISTS public.handle_new_ranking_feed_item();

-- Step 2: Create a new function that can be called from the app to create a feed item
-- This new function accepts the full list of ranked athletes to store it in the feed.
CREATE OR REPLACE FUNCTION public.create_new_ranking_feed_item(p_ranking_id UUID, p_athletes JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ranking_record RECORD;
  author_profile JSONB;
  category_name_text TEXT;
BEGIN
  -- Get ranking details from the provided ranking ID
  SELECT * INTO ranking_record
  FROM public.user_rankings
  WHERE id = p_ranking_id;

  -- Get the author's profile information
  SELECT jsonb_build_object('id', id, 'full_name', full_name, 'avatar_url', avatar_url)
  INTO author_profile
  FROM public.profiles
  WHERE id = ranking_record.user_id;

  -- Get the category name
  SELECT name INTO category_name_text
  FROM public.categories
  WHERE id = ranking_record.category_id;

  -- Insert the new feed item with the full ranking data
  INSERT INTO public.feed_items (type, data)
  VALUES (
    'new_ranking',
    jsonb_build_object(
      'author', author_profile,
      'ranking_id', ranking_record.id,
      'ranking_title', ranking_record.title,
      'category_id', ranking_record.category_id,
      'category_name', category_name_text,
      'athletes', p_athletes
    )
  );
END;
$$;
