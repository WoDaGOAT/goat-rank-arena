
-- Add new feed item types for quiz completion and badge earning
ALTER TYPE feed_item_type ADD VALUE IF NOT EXISTS 'quiz_completed';
ALTER TYPE feed_item_type ADD VALUE IF NOT EXISTS 'badge_earned';

-- Create function to handle quiz completion feed items
CREATE OR REPLACE FUNCTION public.handle_quiz_completion_feed_item()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_profile JSONB;
  quiz_info JSONB;
BEGIN
  -- Get user profile
  SELECT jsonb_build_object('id', p.id, 'full_name', p.full_name, 'avatar_url', p.avatar_url)
  INTO user_profile
  FROM public.profiles p
  WHERE p.id = NEW.user_id;

  -- If profile doesn't exist, create a default one
  IF user_profile IS NULL THEN
    user_profile := jsonb_build_object(
      'id', NEW.user_id,
      'full_name', 'Anonymous',
      'avatar_url', null
    );
  END IF;

  -- Get quiz information
  SELECT jsonb_build_object('id', q.id, 'title', q.title, 'topic', q.topic)
  INTO quiz_info
  FROM public.quizzes q
  WHERE q.id = NEW.quiz_id;

  -- Insert feed item for quiz completion
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

  RETURN NEW;
END;
$$;

-- Create function to handle badge earning feed items
CREATE OR REPLACE FUNCTION public.handle_badge_earned_feed_item()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_profile JSONB;
  badge_info JSONB;
BEGIN
  -- Get user profile
  SELECT jsonb_build_object('id', p.id, 'full_name', p.full_name, 'avatar_url', p.avatar_url)
  INTO user_profile
  FROM public.profiles p
  WHERE p.id = NEW.user_id;

  -- If profile doesn't exist, create a default one
  IF user_profile IS NULL THEN
    user_profile := jsonb_build_object(
      'id', NEW.user_id,
      'full_name', 'Anonymous',
      'avatar_url', null
    );
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

-- Create triggers for quiz completion and badge earning
CREATE TRIGGER trigger_quiz_completion_feed_item
  AFTER INSERT ON public.quiz_attempts
  FOR EACH ROW EXECUTE FUNCTION handle_quiz_completion_feed_item();

CREATE TRIGGER trigger_badge_earned_feed_item
  AFTER INSERT ON public.user_badges
  FOR EACH ROW EXECUTE FUNCTION handle_badge_earned_feed_item();
