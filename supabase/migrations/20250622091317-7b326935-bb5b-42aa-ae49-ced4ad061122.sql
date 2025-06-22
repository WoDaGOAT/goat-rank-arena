
-- Add new notification types for quiz completion and badge earning
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'quiz_completed';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'badge_earned';

-- Create function to handle quiz completion notifications
CREATE OR REPLACE FUNCTION public.handle_quiz_completion_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_name TEXT;
  quiz_title TEXT;
BEGIN
  -- Get user's name
  SELECT full_name INTO user_name
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Get quiz title
  SELECT title INTO quiz_title
  FROM public.quizzes
  WHERE id = NEW.quiz_id;

  -- Create notification for the user who completed the quiz
  INSERT INTO public.notifications (user_id, type, data)
  VALUES (
    NEW.user_id,
    'quiz_completed',
    jsonb_build_object(
      'quiz_id', NEW.quiz_id,
      'quiz_title', COALESCE(quiz_title, 'Unknown Quiz'),
      'score', NEW.score,
      'total_questions', 5,
      'user_name', COALESCE(user_name, 'Someone'),
      'completed_at', NEW.completed_at
    )
  );

  RETURN NEW;
END;
$$;

-- Create function to handle badge earning notifications
CREATE OR REPLACE FUNCTION public.handle_badge_earned_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_name TEXT;
  badge_name TEXT;
  badge_description TEXT;
  badge_rarity TEXT;
BEGIN
  -- Get user's name
  SELECT full_name INTO user_name
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Set badge info based on badge_id
  CASE NEW.badge_id
    WHEN 'newcomer' THEN
      badge_name := 'Newcomer';
      badge_description := 'Welcome to WoDaGOAT!';
      badge_rarity := 'common';
    WHEN 'first_quiz' THEN
      badge_name := 'First Quiz';
      badge_description := 'Complete your first quiz';
      badge_rarity := 'common';
    WHEN 'perfect_score' THEN
      badge_name := 'Perfect Score';
      badge_description := 'Get 100% on a quiz';
      badge_rarity := 'common';
    WHEN 'triple_perfect' THEN
      badge_name := '3 Perfect Scores';
      badge_description := 'Achieve 3 perfect scores';
      badge_rarity := 'rare';
    WHEN 'streak_3' THEN
      badge_name := '3-Day Streak';
      badge_description := 'Complete quizzes for 3 consecutive days';
      badge_rarity := 'common';
    WHEN 'streak_10' THEN
      badge_name := '10-Day Streak';
      badge_description := 'Complete quizzes for 10 consecutive days';
      badge_rarity := 'rare';
    WHEN 'foot_lover' THEN
      badge_name := 'Foot Lover';
      badge_description := 'Achieve 45-59.9% accuracy';
      badge_rarity := 'common';
    WHEN 'expert' THEN
      badge_name := 'Expert';
      badge_description := 'Achieve 60-74.9% accuracy';
      badge_rarity := 'rare';
    WHEN 'legend' THEN
      badge_name := 'Legend';
      badge_description := 'Achieve 75-89.9% accuracy';
      badge_rarity := 'epic';
    WHEN 'goat' THEN
      badge_name := 'GOAT';
      badge_description := 'Achieve 90%+ accuracy';
      badge_rarity := 'legendary';
    ELSE
      badge_name := 'Unknown Badge';
      badge_description := 'Badge earned';
      badge_rarity := 'common';
  END CASE;

  -- Create notification for the user who earned the badge
  INSERT INTO public.notifications (user_id, type, data)
  VALUES (
    NEW.user_id,
    'badge_earned',
    jsonb_build_object(
      'badge_id', NEW.badge_id,
      'badge_name', badge_name,
      'badge_description', badge_description,
      'badge_rarity', badge_rarity,
      'user_name', COALESCE(user_name, 'Someone'),
      'earned_at', NEW.earned_at
    )
  );

  RETURN NEW;
END;
$$;

-- Create triggers for quiz completion and badge earning notifications
CREATE TRIGGER trigger_quiz_completion_notification
  AFTER INSERT ON public.quiz_attempts
  FOR EACH ROW EXECUTE FUNCTION handle_quiz_completion_notification();

CREATE TRIGGER trigger_badge_earned_notification
  AFTER INSERT ON public.user_badges
  FOR EACH ROW EXECUTE FUNCTION handle_badge_earned_notification();
