
-- Replaces the existing function to also accept a description for the ranking.
CREATE OR REPLACE FUNCTION public.create_new_ranking_feed_item(p_ranking_id UUID, p_athletes JSONB, p_ranking_description TEXT)
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

  -- Insert the new feed item with the full ranking data, including the description
  INSERT INTO public.feed_items (type, data)
  VALUES (
    'new_ranking',
    jsonb_build_object(
      'author', author_profile,
      'ranking_id', ranking_record.id,
      'ranking_title', ranking_record.title,
      'ranking_description', p_ranking_description,
      'category_id', ranking_record.category_id,
      'category_name', category_name_text,
      'athletes', p_athletes
    )
  );
END;
$$;
