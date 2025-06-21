
-- First, ensure the user_badges table exists with proper structure
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all user badges" ON public.user_badges;
DROP POLICY IF EXISTS "System can insert user badges" ON public.user_badges;

-- Create policies for user_badges
CREATE POLICY "Users can view all user badges" ON public.user_badges
  FOR SELECT USING (true);

CREATE POLICY "System can insert user badges" ON public.user_badges
  FOR INSERT WITH CHECK (true);

-- Drop existing functions and triggers if they exist
DROP TRIGGER IF EXISTS on_quiz_completion_award_badges ON public.quiz_attempts;
DROP FUNCTION IF EXISTS public.handle_quiz_completion_badges();
DROP FUNCTION IF EXISTS public.check_and_award_badges(uuid);

-- Create function to automatically award badges based on user stats
CREATE OR REPLACE FUNCTION public.check_and_award_badges(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_stats RECORD;
  total_quizzes INTEGER;
  perfect_scores INTEGER;
  accuracy_percentage DECIMAL;
BEGIN
  -- Get user quiz statistics (standardized to 5 questions per quiz)
  SELECT 
    COUNT(*) as quiz_count,
    COALESCE(SUM(score), 0) as total_correct,
    COUNT(*) * 5 as total_questions, -- Each quiz has exactly 5 questions
    COUNT(CASE WHEN score = 5 THEN 1 END) as perfect_count -- Perfect score is 5/5
  INTO user_stats
  FROM quiz_attempts qa
  WHERE qa.user_id = p_user_id;

  total_quizzes := user_stats.quiz_count;
  perfect_scores := user_stats.perfect_count;
  
  -- Calculate accuracy based on 5-question format
  IF user_stats.total_questions > 0 THEN
    accuracy_percentage := (user_stats.total_correct::DECIMAL / user_stats.total_questions::DECIMAL) * 100;
  ELSE
    accuracy_percentage := 0;
  END IF;

  -- Award badges based on criteria
  
  -- Newcomer badge (automatically earned)
  INSERT INTO user_badges (user_id, badge_id) 
  VALUES (p_user_id, 'newcomer') 
  ON CONFLICT (user_id, badge_id) DO NOTHING;

  -- First Quiz badge
  IF total_quizzes >= 1 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'first_quiz') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- Perfect Score badge (5/5)
  IF perfect_scores >= 1 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'perfect_score') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- 3 Perfect Scores badge
  IF perfect_scores >= 3 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'triple_perfect') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- Accuracy-based badges
  IF accuracy_percentage >= 90 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'goat') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  ELSIF accuracy_percentage >= 75 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'legend') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  ELSIF accuracy_percentage >= 60 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'expert') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  ELSIF accuracy_percentage >= 45 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'foot_lover') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- Log the badge check for debugging
  RAISE NOTICE 'Badge check completed for user %. Stats: quizzes=%, perfect=%, accuracy=%', 
    p_user_id, total_quizzes, perfect_scores, accuracy_percentage;

END;
$$;

-- Create trigger function to award badges after quiz completion
CREATE OR REPLACE FUNCTION public.handle_quiz_completion_badges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check and award badges for the user
  PERFORM check_and_award_badges(NEW.user_id);
  
  RETURN NEW;
END;
$$;

-- Create trigger to award badges after quiz completion
CREATE TRIGGER on_quiz_completion_award_badges
AFTER INSERT ON public.quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION public.handle_quiz_completion_badges();
