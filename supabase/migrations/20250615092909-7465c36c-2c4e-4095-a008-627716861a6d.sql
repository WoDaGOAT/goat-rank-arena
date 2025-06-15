
-- Add 'new_ranking' to the feed_item_type ENUM if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'public.feed_item_type'::regtype AND enumlabel = 'new_ranking') THEN
        ALTER TYPE public.feed_item_type ADD VALUE 'new_ranking';
    END IF;
END$$;

-- Function to create a feed item when a new ranking is created
CREATE OR REPLACE FUNCTION public.handle_new_ranking_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  author_profile JSONB;
  category_name_text TEXT;
BEGIN
  -- Get author's profile info
  SELECT jsonb_build_object('id', id, 'full_name', full_name, 'avatar_url', avatar_url)
  INTO author_profile
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Get category name
  SELECT name INTO category_name_text
  FROM public.categories
  WHERE id = NEW.category_id;

  -- Insert into feed_items
  INSERT INTO public.feed_items (type, data)
  VALUES (
    'new_ranking',
    jsonb_build_object(
      'author', author_profile,
      'ranking_id', NEW.id,
      'ranking_title', NEW.title,
      'category_id', NEW.category_id,
      'category_name', category_name_text
    )
  );
  RETURN NEW;
END;
$$;

-- Drop existing trigger to prevent errors on re-run
DROP TRIGGER IF EXISTS on_new_ranking_for_feed ON public.user_rankings;

-- Create a trigger that executes the function after a new ranking is inserted
CREATE TRIGGER on_new_ranking_for_feed
AFTER INSERT ON public.user_rankings
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_ranking_feed_item();
