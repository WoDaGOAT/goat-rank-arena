
-- Fix the handle_new_comment_feed_item function to use correct data structure
CREATE OR REPLACE FUNCTION public.handle_new_comment_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  author_profile JSONB;
  category_info JSONB;
BEGIN
  -- Try to get author profile
  SELECT jsonb_build_object('id', p.id, 'full_name', p.full_name, 'avatar_url', p.avatar_url)
  INTO author_profile
  FROM public.profiles p
  WHERE p.id = NEW.user_id;

  -- If profile doesn't exist, create a default one for the feed item
  IF author_profile IS NULL THEN
    author_profile := jsonb_build_object(
      'id', NEW.user_id,
      'full_name', 'Anonymous',
      'avatar_url', null
    );
  END IF;

  -- Get category info as an object
  SELECT jsonb_build_object('id', c.id, 'name', c.name)
  INTO category_info
  FROM public.categories c
  WHERE c.id = NEW.category_id;

  -- If category doesn't exist, create a default one
  IF category_info IS NULL THEN
    category_info := jsonb_build_object(
      'id', NEW.category_id,
      'name', 'Unknown Category'
    );
  END IF;

  INSERT INTO public.feed_items (type, data)
  VALUES (
    'new_comment',
    jsonb_build_object(
      'user', author_profile,
      'category', category_info,
      'comment_preview', LEFT(NEW.comment, 100),
      'comment_id', NEW.id
    )
  );
  RETURN NEW;
END;
$$;
