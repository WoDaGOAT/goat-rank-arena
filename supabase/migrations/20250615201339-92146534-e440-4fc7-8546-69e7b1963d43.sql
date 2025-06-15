
-- Sets a fixed search_path for multiple database functions to enhance security
-- and resolve Supabase's "Function Search Path Mutable" warnings.

-- Fix for handle_new_category_notification
CREATE OR REPLACE FUNCTION public.handle_new_category_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, data)
  SELECT
    id,
    'new_category',
    jsonb_build_object(
      'category_id', NEW.id,
      'category_name', NEW.name
    )
  FROM auth.users;
  RETURN NEW;
END;
$$;

-- Fix for handle_new_comment_reply_notification
CREATE OR REPLACE FUNCTION public.handle_new_comment_reply_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  parent_comment_author_id UUID;
  replying_user_name TEXT;
  category_name_text TEXT;
BEGIN
  -- Only proceed if it's a reply
  IF NEW.parent_comment_id IS NOT NULL THEN
    -- Get parent comment author
    SELECT user_id INTO parent_comment_author_id
    FROM public.category_comments
    WHERE id = NEW.parent_comment_id;

    -- Get replying user's name from profiles table
    SELECT full_name INTO replying_user_name
    FROM public.profiles
    WHERE id = NEW.user_id;

    -- Get category name
    SELECT name INTO category_name_text
    FROM public.categories
    WHERE id = NEW.category_id;

    -- Create notification for parent comment's author if it's not a self-reply
    IF parent_comment_author_id IS NOT NULL AND parent_comment_author_id != NEW.user_id THEN
      INSERT INTO public.notifications (user_id, type, data)
      VALUES (
        parent_comment_author_id,
        'new_comment_reply',
        jsonb_build_object(
          'category_id', NEW.category_id,
          'category_name', category_name_text,
          'comment_id', NEW.id,
          'parent_comment_id', NEW.parent_comment_id,
          'replying_user_id', NEW.user_id,
          'replying_user_name', COALESCE(replying_user_name, 'Someone')
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Fix for handle_new_friend_request_notification
CREATE OR REPLACE FUNCTION public.handle_new_friend_request_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
DECLARE
  requester_name TEXT;
BEGIN
  -- Get requester's name
  SELECT full_name INTO requester_name
  FROM public.profiles
  WHERE id = NEW.requester_id;
  
  -- Create notification for the receiver
  INSERT INTO public.notifications (user_id, type, data)
  VALUES (
    NEW.receiver_id,
    'new_friend_request',
    jsonb_build_object(
      'requester_id', NEW.requester_id,
      'requester_name', COALESCE(requester_name, 'Someone'),
      'friendship_id', NEW.id
    )
  );

  RETURN NEW;
END;
$$;

-- Fix for handle_accepted_friend_request_notification
CREATE OR REPLACE FUNCTION public.handle_accepted_friend_request_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
DECLARE
  receiver_name TEXT;
BEGIN
  -- Get receiver's (the one who accepted) name
  SELECT full_name INTO receiver_name
  FROM public.profiles
  WHERE id = NEW.receiver_id;
  
  -- Create notification for the original requester
  INSERT INTO public.notifications (user_id, type, data)
  VALUES (
    NEW.requester_id,
    'friend_request_accepted',
    jsonb_build_object(
      'receiver_id', NEW.receiver_id,
      'receiver_name', COALESCE(receiver_name, 'Someone'),
      'friendship_id', NEW.id
    )
  );

  RETURN NEW;
END;
$$;

-- Fix for handle_new_user_feed_item
CREATE OR REPLACE FUNCTION public.handle_new_user_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.feed_items (type, data)
  VALUES (
    'new_user',
    jsonb_build_object(
      'user_id', NEW.id,
      'user_name', NEW.full_name,
      'avatar_url', NEW.avatar_url
    )
  );
  RETURN NEW;
END;
$$;

-- Fix for handle_new_comment_feed_item
CREATE OR REPLACE FUNCTION public.handle_new_comment_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  author_profile JSONB;
  category_name_text TEXT;
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
  RETURN NEW;
END;
$$;

-- Fix for handle_accepted_friendship_feed_item
CREATE OR REPLACE FUNCTION public.handle_accepted_friendship_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_profile JSON;
  receiver_profile JSON;
BEGIN
  IF NEW.status = 'accepted' AND OLD.status <> 'accepted' THEN
    SELECT json_build_object('id', id, 'full_name', full_name, 'avatar_url', avatar_url)
    INTO requester_profile
    FROM public.profiles WHERE id = NEW.requester_id;

    SELECT json_build_object('id', id, 'full_name', full_name, 'avatar_url', avatar_url)
    INTO receiver_profile
    FROM public.profiles WHERE id = NEW.receiver_id;

    INSERT INTO public.feed_items (type, data)
    VALUES (
      'accepted_friendship',
      jsonb_build_object(
        'requester', requester_profile,
        'receiver', receiver_profile
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Fix for get_quiz_leaderboard
CREATE OR REPLACE FUNCTION public.get_quiz_leaderboard()
RETURNS TABLE(
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  total_score BIGINT,
  quizzes_completed BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as user_id,
    p.full_name,
    p.avatar_url,
    sum(qa.score)::BIGINT as total_score,
    count(qa.id)::BIGINT as quizzes_completed
  FROM
    public.quiz_attempts as qa
  JOIN
    public.profiles as p ON qa.user_id = p.id
  GROUP BY
    p.id
  ORDER BY
    total_score DESC, quizzes_completed DESC;
END;
$$;

