
-- Phase 1: Critical Database Optimizations
-- Add missing indexes for high-traffic queries

-- 1. Quiz attempts indexes for leaderboard performance
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_score ON quiz_attempts(user_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_completed ON quiz_attempts(user_id, completed_at DESC);

-- 2. Feed items index for pagination
CREATE INDEX IF NOT EXISTS idx_feed_items_created_at ON feed_items(created_at DESC);

-- 3. User badges indexes for badge lookups
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_badge ON user_badges(user_id, badge_id);

-- 4. Notifications indexes for user queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);

-- 5. User rankings indexes for category queries
CREATE INDEX IF NOT EXISTS idx_user_rankings_category ON user_rankings(category_id);
CREATE INDEX IF NOT EXISTS idx_user_rankings_user_category ON user_rankings(user_id, category_id);

-- 6. Ranking athletes indexes for leaderboard calculations
CREATE INDEX IF NOT EXISTS idx_ranking_athletes_ranking ON ranking_athletes(ranking_id);
CREATE INDEX IF NOT EXISTS idx_ranking_athletes_athlete ON ranking_athletes(athlete_id);

-- 7. Category comments indexes for comment loading
CREATE INDEX IF NOT EXISTS idx_category_comments_category_created ON category_comments(category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_category_comments_parent ON category_comments(parent_comment_id);

-- Optimize the quiz leaderboard function with pagination
CREATE OR REPLACE FUNCTION public.get_quiz_leaderboard(
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  total_score BIGINT,
  quizzes_completed BIGINT,
  highest_badge_id TEXT,
  highest_badge_name TEXT,
  highest_badge_rarity TEXT
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
    COALESCE(sum(qa.score), 0)::BIGINT as total_score,
    COALESCE(count(qa.id), 0)::BIGINT as quizzes_completed,
    -- Determine highest badge by rarity priority
    CASE 
      WHEN bool_or(ub.badge_id = 'goat') THEN 'goat'
      WHEN bool_or(ub.badge_id = 'legend') THEN 'legend'
      WHEN bool_or(ub.badge_id = 'expert') THEN 'expert'
      WHEN bool_or(ub.badge_id = 'triple_perfect') THEN 'triple_perfect'
      WHEN bool_or(ub.badge_id = 'perfect_score') THEN 'perfect_score'
      WHEN bool_or(ub.badge_id = 'streak_10') THEN 'streak_10'
      WHEN bool_or(ub.badge_id = 'streak_3') THEN 'streak_3'
      WHEN bool_or(ub.badge_id = 'foot_lover') THEN 'foot_lover'
      WHEN bool_or(ub.badge_id = 'first_quiz') THEN 'first_quiz'
      WHEN bool_or(ub.badge_id = 'newcomer') THEN 'newcomer'
      ELSE null
    END as highest_badge_id,
    -- Get badge name based on highest badge
    CASE 
      WHEN bool_or(ub.badge_id = 'goat') THEN 'GOAT'
      WHEN bool_or(ub.badge_id = 'legend') THEN 'Legend'
      WHEN bool_or(ub.badge_id = 'expert') THEN 'Expert'
      WHEN bool_or(ub.badge_id = 'triple_perfect') THEN '3 Perfect Scores'
      WHEN bool_or(ub.badge_id = 'perfect_score') THEN 'Perfect Score'
      WHEN bool_or(ub.badge_id = 'streak_10') THEN '10-Day Streak'
      WHEN bool_or(ub.badge_id = 'streak_3') THEN '3-Day Streak'
      WHEN bool_or(ub.badge_id = 'foot_lover') THEN 'Foot Lover'
      WHEN bool_or(ub.badge_id = 'first_quiz') THEN 'First Quiz'
      WHEN bool_or(ub.badge_id = 'newcomer') THEN 'Newcomer'
      ELSE null
    END as highest_badge_name,
    -- Get badge rarity based on highest badge
    CASE 
      WHEN bool_or(ub.badge_id = 'goat') THEN 'legendary'
      WHEN bool_or(ub.badge_id = 'legend') THEN 'epic'
      WHEN bool_or(ub.badge_id = 'expert') THEN 'rare'
      WHEN bool_or(ub.badge_id = 'triple_perfect') THEN 'rare'
      WHEN bool_or(ub.badge_id = 'perfect_score') THEN 'common'
      WHEN bool_or(ub.badge_id = 'streak_10') THEN 'rare'
      WHEN bool_or(ub.badge_id = 'streak_3') THEN 'common'
      WHEN bool_or(ub.badge_id = 'foot_lover') THEN 'common'
      WHEN bool_or(ub.badge_id = 'first_quiz') THEN 'common'
      WHEN bool_or(ub.badge_id = 'newcomer') THEN 'common'
      ELSE 'common'
    END as highest_badge_rarity
  FROM
    public.profiles as p
  LEFT JOIN
    public.quiz_attempts as qa ON qa.user_id = p.id
  LEFT JOIN
    public.user_badges as ub ON ub.user_id = p.id
  WHERE
    qa.id IS NOT NULL -- Only include users who have taken at least one quiz
  GROUP BY
    p.id
  ORDER BY
    total_score DESC, quizzes_completed DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Optimize the badge checking function
CREATE OR REPLACE FUNCTION public.check_and_award_badges(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_stats RECORD;
  total_quizzes INTEGER;
  perfect_scores INTEGER;
  accuracy_percentage DECIMAL;
BEGIN
  -- Get user quiz statistics with optimized query using new indexes
  SELECT 
    COUNT(*) as quiz_count,
    COALESCE(SUM(score), 0) as total_correct,
    COUNT(*) * 5 as total_questions,
    COUNT(CASE WHEN score = 5 THEN 1 END) as perfect_count
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

  -- Use INSERT ... ON CONFLICT for better performance (atomic operations)
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

  -- Accuracy-based badges (hierarchical to avoid multiple inserts)
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

END;
$$;
