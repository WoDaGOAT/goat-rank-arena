
-- Optimize feed performance for 50 WAU
-- Add indexes for better query performance on feed_items table

-- Index for feed query ordering (most important)
CREATE INDEX IF NOT EXISTS idx_feed_items_created_at_desc ON public.feed_items (created_at DESC);

-- Index for feed type filtering if needed
CREATE INDEX IF NOT EXISTS idx_feed_items_type_created_at ON public.feed_items (type, created_at DESC);

-- Optimize ranking reactions table
CREATE INDEX IF NOT EXISTS idx_ranking_reactions_ranking_id ON public.ranking_reactions (ranking_id);
CREATE INDEX IF NOT EXISTS idx_ranking_reactions_user_id ON public.ranking_reactions (user_id);

-- Optimize user_rankings table for feed queries
CREATE INDEX IF NOT EXISTS idx_user_rankings_created_at ON public.user_rankings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_rankings_user_id ON public.user_rankings (user_id);

-- Optimize profiles table for feed item creation
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON public.profiles (full_name) WHERE full_name IS NOT NULL AND full_name != '';

-- Add a function to clean up old feed items (older than 30 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_feed_items()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete feed items older than 30 days to keep the feed manageable
  DELETE FROM public.feed_items 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Log cleanup
  RAISE NOTICE 'Cleaned up old feed items older than 30 days';
END;
$$;

-- Optimize the handle_ranking_reaction_feed_item function for better performance
CREATE OR REPLACE FUNCTION public.handle_ranking_reaction_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reacting_user_profile JSONB;
  ranking_info JSONB;
BEGIN
  -- Get reacting user's profile with optimized query
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

  -- Get ranking information and author in a single optimized query
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
  WHERE ur.id = NEW.ranking_id
  AND p.full_name IS NOT NULL 
  AND p.full_name != '';

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

-- Optimize the handle_new_ranking_feed_item function
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
  -- Get author's profile info with validation in single query
  SELECT jsonb_build_object('id', id, 'full_name', full_name, 'avatar_url', avatar_url)
  INTO author_profile
  FROM public.profiles
  WHERE id = NEW.user_id
  AND full_name IS NOT NULL 
  AND full_name != '';

  -- Only proceed if we have a valid user profile
  IF author_profile IS NULL THEN
    RETURN NEW;
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
        'ranking_id', NEW.id,
        'top_athletes', '[]'::jsonb
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;
