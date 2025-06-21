
-- First drop the existing function, then recreate it with badge information
DROP FUNCTION IF EXISTS public.get_quiz_leaderboard();

-- Now create the updated function with badge information
CREATE OR REPLACE FUNCTION public.get_quiz_leaderboard()
 RETURNS TABLE(
   user_id uuid, 
   full_name text, 
   avatar_url text, 
   total_score bigint, 
   quizzes_completed bigint,
   highest_badge_id text,
   highest_badge_name text,
   highest_badge_rarity text
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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
    total_score DESC, quizzes_completed DESC;
END;
$$;
