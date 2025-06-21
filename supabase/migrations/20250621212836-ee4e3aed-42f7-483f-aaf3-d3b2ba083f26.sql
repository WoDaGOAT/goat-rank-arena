
-- Update the handle_new_comment_feed_item function to include parent comment information for replies
CREATE OR REPLACE FUNCTION public.handle_new_comment_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  author_profile JSONB;
  category_name_text TEXT;
  parent_comment_text_var TEXT;
  parent_comment_author_profile JSONB;
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

  SELECT name INTO category_name_text FROM public.categories WHERE id = NEW.category_id;

  -- If this is a reply, get parent comment information
  IF NEW.parent_comment_id IS NOT NULL THEN
    -- Get parent comment text
    SELECT comment INTO parent_comment_text_var
    FROM public.category_comments
    WHERE id = NEW.parent_comment_id;

    -- Get parent comment author profile
    SELECT jsonb_build_object('id', p.id, 'full_name', p.full_name, 'avatar_url', p.avatar_url)
    INTO parent_comment_author_profile
    FROM public.category_comments cc
    JOIN public.profiles p ON cc.user_id = p.id
    WHERE cc.id = NEW.parent_comment_id;

    -- Insert feed item with parent comment information
    INSERT INTO public.feed_items (type, data)
    VALUES (
      'new_comment',
      jsonb_build_object(
        'author', author_profile,
        'comment_id', NEW.id,
        'comment_text', LEFT(NEW.comment, 100), -- Truncate comment to 100 chars
        'category_id', NEW.category_id,
        'category_name', category_name_text,
        'parent_comment_id', NEW.parent_comment_id,
        'parent_comment_text', LEFT(COALESCE(parent_comment_text_var, ''), 100), -- Truncate parent comment too
        'parent_comment_author', parent_comment_author_profile
      )
    );
  ELSE
    -- Insert regular comment feed item (no parent information)
    INSERT INTO public.feed_items (type, data)
    VALUES (
      'new_comment',
      jsonb_build_object(
        'author', author_profile,
        'comment_id', NEW.id,
        'comment_text', LEFT(NEW.comment, 100), -- Truncate comment to 100 chars
        'category_id', NEW.category_id,
        'category_name', category_name_text
      )
    );
  END IF;

  RETURN NEW;
END;
$$;
