
-- Add reaction notification types to the notification_type enum
ALTER TYPE public.notification_type ADD VALUE 'ranking_reaction';
ALTER TYPE public.notification_type ADD VALUE 'category_reaction';

-- Create function to handle ranking reaction notifications
CREATE OR REPLACE FUNCTION public.handle_ranking_reaction_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  ranking_author_id UUID;
  reacting_user_name TEXT;
  ranking_title TEXT;
BEGIN
  -- Get the ranking author and title
  SELECT user_id, title INTO ranking_author_id, ranking_title
  FROM public.user_rankings
  WHERE id = NEW.ranking_id;

  -- Get reacting user's name
  SELECT full_name INTO reacting_user_name
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Create notification for ranking author if it's not a self-reaction
  IF ranking_author_id IS NOT NULL AND ranking_author_id != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, data)
    VALUES (
      ranking_author_id,
      'ranking_reaction',
      jsonb_build_object(
        'ranking_id', NEW.ranking_id,
        'ranking_title', ranking_title,
        'reaction_type', NEW.reaction_type,
        'reacting_user_id', NEW.user_id,
        'reacting_user_name', COALESCE(reacting_user_name, 'Someone')
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create function to handle category reaction notifications  
CREATE OR REPLACE FUNCTION public.handle_category_reaction_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  reacting_user_name TEXT;
  category_name_text TEXT;
BEGIN
  -- Get reacting user's name
  SELECT full_name INTO reacting_user_name
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Get category name
  SELECT name INTO category_name_text
  FROM public.categories
  WHERE id = NEW.category_id;

  -- For now, we won't create category reaction notifications since categories don't have owners
  -- This function is prepared for future use if needed
  
  RETURN NEW;
END;
$$;

-- Create triggers for reaction notifications
CREATE TRIGGER on_new_ranking_reaction
AFTER INSERT ON public.ranking_reactions
FOR EACH ROW
EXECUTE FUNCTION public.handle_ranking_reaction_notification();

CREATE TRIGGER on_new_category_reaction
AFTER INSERT ON public.category_reactions
FOR EACH ROW
EXECUTE FUNCTION public.handle_category_reaction_notification();
