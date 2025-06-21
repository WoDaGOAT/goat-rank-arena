
-- Create user_badges table to track which badges users have earned
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for user_badges
CREATE POLICY "Users can view all user badges" ON public.user_badges
  FOR SELECT USING (true);

CREATE POLICY "System can insert user badges" ON public.user_badges
  FOR INSERT WITH CHECK (true);

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
  current_streak INTEGER;
  perfect_scores INTEGER;
  accuracy_percentage DECIMAL;
BEGIN
  -- Get user quiz statistics
  SELECT 
    COUNT(*) as quiz_count,
    COALESCE(SUM(score), 0) as total_correct,
    COALESCE(SUM((SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = qa.quiz_id)), 0) as total_questions,
    COUNT(CASE WHEN score = (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = qa.quiz_id) THEN 1 END) as perfect_count
  INTO user_stats
  FROM quiz_attempts qa
  WHERE qa.user_id = p_user_id;

  total_quizzes := user_stats.quiz_count;
  perfect_scores := user_stats.perfect_count;
  
  -- Calculate accuracy
  IF user_stats.total_questions > 0 THEN
    accuracy_percentage := (user_stats.total_correct::DECIMAL / user_stats.total_questions::DECIMAL) * 100;
  ELSE
    accuracy_percentage := 0;
  END IF;

  -- Calculate current streak (simplified - just check if user has taken quiz today and yesterday)
  SELECT CASE 
    WHEN EXISTS (
      SELECT 1 FROM quiz_attempts qa2 
      JOIN quizzes q ON qa2.quiz_id = q.id 
      WHERE qa2.user_id = p_user_id 
      AND q.active_date = CURRENT_DATE
    ) THEN 1
    ELSE 0
  END INTO current_streak;

  -- Award badges based on criteria
  
  -- First Quiz badge
  IF total_quizzes >= 1 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'first-quiz') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- Perfect Score badge
  IF perfect_scores >= 1 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'perfect-score') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- 3 Perfect Scores badge
  IF perfect_scores >= 3 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'hat-trick') 
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
    VALUES (p_user_id, 'foot-lover') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- Quiz count badges
  IF total_quizzes >= 10 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'scholar') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  IF total_quizzes >= 50 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'quiz-master') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

END;
$$;

-- Create trigger to award badges after quiz completion
CREATE OR REPLACE FUNCTION public.handle_quiz_completion_badges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Award newcomer badge for first quiz attempt
  IF NOT EXISTS (SELECT 1 FROM user_badges WHERE user_id = NEW.user_id AND badge_id = 'newcomer') THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (NEW.user_id, 'newcomer');
  END IF;

  -- Check and award other badges
  PERFORM check_and_award_badges(NEW.user_id);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_quiz_completion_award_badges
AFTER INSERT ON public.quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION public.handle_quiz_completion_badges();
