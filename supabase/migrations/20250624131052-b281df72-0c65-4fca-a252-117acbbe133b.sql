
-- Update the handle_new_user_feed_item function to only create feed items with valid user data
CREATE OR REPLACE FUNCTION public.handle_new_user_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create feed item if we have a valid full_name
  IF NEW.full_name IS NOT NULL AND NEW.full_name != '' THEN
    INSERT INTO public.feed_items (type, data)
    VALUES (
      'new_user',
      jsonb_build_object(
        'user_id', NEW.id,
        'user_name', NEW.full_name,
        'avatar_url', NEW.avatar_url
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Update the handle_new_comment_feed_item function to not create feed items without valid user profiles
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
  WHERE p.id = NEW.user_id
  AND p.full_name IS NOT NULL 
  AND p.full_name != '';

  -- Only proceed if we have a valid user profile
  IF author_profile IS NULL THEN
    RETURN NEW; -- Don't create feed item, just return
  END IF;

  -- Get category info as an object
  SELECT jsonb_build_object('id', c.id, 'name', c.name)
  INTO category_info
  FROM public.categories c
  WHERE c.id = NEW.category_id;

  -- Only create feed item if we have both valid user and category data
  IF category_info IS NOT NULL THEN
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
  END IF;

  RETURN NEW;
END;
$$;

-- Update the handle_accepted_friendship_feed_item function to only create feed items with valid user data
CREATE OR REPLACE FUNCTION public.handle_accepted_friendship_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_profile JSONB;
  receiver_profile JSONB;
BEGIN
  IF NEW.status = 'accepted' AND OLD.status <> 'accepted' THEN
    -- Get requester profile with validation
    SELECT jsonb_build_object('id', id, 'full_name', full_name, 'avatar_url', avatar_url)
    INTO requester_profile
    FROM public.profiles 
    WHERE id = NEW.requester_id 
    AND full_name IS NOT NULL 
    AND full_name != '';

    -- Get receiver profile with validation
    SELECT jsonb_build_object('id', id, 'full_name', full_name, 'avatar_url', avatar_url)
    INTO receiver_profile
    FROM public.profiles 
    WHERE id = NEW.receiver_id 
    AND full_name IS NOT NULL 
    AND full_name != '';

    -- Only create feed item if both users have valid profiles
    IF requester_profile IS NOT NULL AND receiver_profile IS NOT NULL THEN
      INSERT INTO public.feed_items (type, data)
      VALUES (
        'accepted_friendship',
        jsonb_build_object(
          'requester', requester_profile,
          'receiver', receiver_profile
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Update the handle_quiz_completion_feed_item function to only create feed items with valid user data
CREATE OR REPLACE FUNCTION public.handle_quiz_completion_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_profile JSONB;
  quiz_info JSONB;
BEGIN
  -- Get user profile with validation
  SELECT jsonb_build_object('id', p.id, 'full_name', p.full_name, 'avatar_url', p.avatar_url)
  INTO user_profile
  FROM public.profiles p
  WHERE p.id = NEW.user_id
  AND p.full_name IS NOT NULL 
  AND p.full_name != '';

  -- Only proceed if we have a valid user profile
  IF user_profile IS NULL THEN
    RETURN NEW; -- Don't create feed item, just return
  END IF;

  -- Get quiz information
  SELECT jsonb_build_object('id', q.id, 'title', q.title, 'topic', q.topic)
  INTO quiz_info
  FROM public.quizzes q
  WHERE q.id = NEW.quiz_id;

  -- Only create feed item if we have valid quiz data
  IF quiz_info IS NOT NULL THEN
    INSERT INTO public.feed_items (type, data)
    VALUES (
      'quiz_completed',
      jsonb_build_object(
        'user', user_profile,
        'quiz', quiz_info,
        'score', NEW.score,
        'total_questions', 5,
        'completed_at', NEW.completed_at
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Update the handle_badge_earned_feed_item function to only create feed items with valid user data
CREATE OR REPLACE FUNCTION public.handle_badge_earned_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_profile JSONB;
  badge_info JSONB;
BEGIN
  -- Get user profile with validation
  SELECT jsonb_build_object('id', p.id, 'full_name', p.full_name, 'avatar_url', p.avatar_url)
  INTO user_profile
  FROM public.profiles p
  WHERE p.id = NEW.user_id
  AND p.full_name IS NOT NULL 
  AND p.full_name != '';

  -- Only proceed if we have a valid user profile
  IF user_profile IS NULL THEN
    RETURN NEW; -- Don't create feed item, just return
  END IF;

  -- Create badge info based on badge_id
  CASE NEW.badge_id
    WHEN 'newcomer' THEN
      badge_info := jsonb_build_object('id', 'newcomer', 'name', 'Newcomer', 'description', 'Welcome to WoDaGOAT!', 'rarity', 'common');
    WHEN 'first_quiz' THEN
      badge_info := jsonb_build_object('id', 'first_quiz', 'name', 'First Quiz', 'description', 'Complete your first quiz', 'rarity', 'common');
    WHEN 'perfect_score' THEN
      badge_info := jsonb_build_object('id', 'perfect_score', 'name', 'Perfect Score', 'description', 'Get 100% on a quiz', 'rarity', 'common');
    WHEN 'triple_perfect' THEN
      badge_info := jsonb_build_object('id', 'triple_perfect', 'name', '3 Perfect Scores', 'description', 'Achieve 3 perfect scores', 'rarity', 'rare');
    WHEN 'streak_3' THEN
      badge_info := jsonb_build_object('id', 'streak_3', 'name', '3-Day Streak', 'description', 'Complete quizzes for 3 consecutive days', 'rarity', 'common');
    WHEN 'streak_10' THEN
      badge_info := jsonb_build_object('id', 'streak_10', 'name', '10-Day Streak', 'description', 'Complete quizzes for 10 consecutive days', 'rarity', 'rare');
    WHEN 'foot_lover' THEN
      badge_info := jsonb_build_object('id', 'foot_lover', 'name', 'Foot Lover', 'description', 'Achieve 45-59.9% accuracy', 'rarity', 'common');
    WHEN 'expert' THEN
      badge_info := jsonb_build_object('id', 'expert', 'name', 'Expert', 'description', 'Achieve 60-74.9% accuracy', 'rarity', 'rare');
    WHEN 'legend' THEN
      badge_info := jsonb_build_object('id', 'legend', 'name', 'Legend', 'description', 'Achieve 75-89.9% accuracy', 'rarity', 'epic');
    WHEN 'goat' THEN
      badge_info := jsonb_build_object('id', 'goat', 'name', 'GOAT', 'description', 'Achieve 90%+ accuracy', 'rarity', 'legendary');
    ELSE
      badge_info := jsonb_build_object('id', NEW.badge_id, 'name', 'Unknown Badge', 'description', 'Badge earned', 'rarity', 'common');
  END CASE;

  -- Insert feed item for badge earning
  INSERT INTO public.feed_items (type, data)
  VALUES (
    'badge_earned',
    jsonb_build_object(
      'user', user_profile,
      'badge', badge_info,
      'earned_at', NEW.earned_at
    )
  );

  RETURN NEW;
END;
$$;

-- Clean up existing feed items with "Anonymous" users
DELETE FROM public.feed_items 
WHERE (data->>'user_name' = 'Anonymous' 
       OR data->'user'->>'full_name' = 'Anonymous'
       OR data->'author'->>'full_name' = 'Anonymous'
       OR data->>'user_name' IS NULL 
       OR data->'user'->>'full_name' IS NULL
       OR data->'author'->>'full_name' IS NULL
       OR data->>'user_name' = ''
       OR data->'user'->>'full_name' = ''
       OR data->'author'->>'full_name' = '');
