
-- Create function to handle ranking reaction feed items
CREATE OR REPLACE FUNCTION public.handle_ranking_reaction_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reacting_user_profile JSONB;
  ranking_info JSONB;
  ranking_author_profile JSONB;
BEGIN
  -- Get reacting user's profile
  SELECT jsonb_build_object('id', p.id, 'full_name', p.full_name, 'avatar_url', p.avatar_url)
  INTO reacting_user_profile
  FROM public.profiles p
  WHERE p.id = NEW.user_id
  AND p.full_name IS NOT NULL 
  AND p.full_name != '';

  -- Only proceed if we have a valid user profile
  IF reacting_user_profile IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get ranking information and author
  SELECT 
    jsonb_build_object(
      'id', ur.id,
      'title', ur.title,
      'category_id', ur.category_id,
      'category_name', c.name,
      'author', jsonb_build_object('id', p.id, 'full_name', p.full_name, 'avatar_url', p.avatar_url)
    )
  INTO ranking_info
  FROM public.user_rankings ur
  JOIN public.categories c ON ur.category_id = c.id
  JOIN public.profiles p ON ur.user_id = p.id
  WHERE ur.id = NEW.ranking_id;

  -- Only create feed item if we have valid ranking data
  IF ranking_info IS NOT NULL THEN
    INSERT INTO public.feed_items (type, data)
    VALUES (
      'ranking_reaction',
      jsonb_build_object(
        'reacting_user', reacting_user_profile,
        'ranking', ranking_info,
        'reaction_type', NEW.reaction_type,
        'reacted_at', NEW.created_at
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Add 'ranking_reaction' to the feed_item_type ENUM if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'public.feed_item_type'::regtype AND enumlabel = 'ranking_reaction') THEN
        ALTER TYPE public.feed_item_type ADD VALUE 'ranking_reaction';
    END IF;
END$$;

-- Create trigger for ranking reactions
DROP TRIGGER IF EXISTS on_ranking_reaction_for_feed ON public.ranking_reactions;

CREATE TRIGGER on_ranking_reaction_for_feed
AFTER INSERT ON public.ranking_reactions
FOR EACH ROW
EXECUTE FUNCTION public.handle_ranking_reaction_feed_item();
