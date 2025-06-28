
-- Phase 1: Database Optimization for 50 WAU (Fixed type mismatch)

-- 1. Add critical indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_rankings_category_created 
ON user_rankings(category_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ranking_athletes_athlete_points 
ON ranking_athletes(athlete_id, points DESC);

CREATE INDEX IF NOT EXISTS idx_ranking_athletes_ranking_position 
ON ranking_athletes(ranking_id, position);

-- 2. Create optimized leaderboard calculation function (fixed type mismatch)
CREATE OR REPLACE FUNCTION get_category_leaderboard(
  p_category_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
  athlete_id TEXT,
  athlete_name TEXT,
  profile_picture_url TEXT,
  country_of_origin TEXT,
  total_points BIGINT,
  rank BIGINT,
  movement TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH athlete_scores AS (
    SELECT 
      ra.athlete_id,
      SUM(ra.points) as total_score,
      COUNT(*) as appearances
    FROM ranking_athletes ra
    JOIN user_rankings ur ON ra.ranking_id = ur.id
    WHERE ur.category_id = p_category_id
    GROUP BY ra.athlete_id
    HAVING COUNT(*) > 0
  ),
  ranking_timeline AS (
    SELECT 
      ur.created_at,
      ROW_NUMBER() OVER (ORDER BY ur.created_at DESC) as rank_desc,
      COUNT(*) OVER () as total_rankings
    FROM user_rankings ur
    WHERE ur.category_id = p_category_id
  ),
  recent_cutoff AS (
    SELECT created_at as recent_date
    FROM ranking_timeline
    WHERE rank_desc = GREATEST(1, FLOOR(total_rankings * 0.25)::integer)
    LIMIT 1
  ),
  older_cutoff AS (
    SELECT 
      MIN(rt.created_at) as older_start,
      MAX(rt.created_at) as older_end
    FROM ranking_timeline rt
    WHERE rt.rank_desc BETWEEN 
      GREATEST(1, FLOOR(rt.total_rankings * 0.5)::integer) AND
      GREATEST(1, FLOOR(rt.total_rankings * 0.75)::integer)
  ),
  recent_positions AS (
    SELECT 
      ra.athlete_id,
      AVG(ra.position::decimal) as recent_avg_pos
    FROM ranking_athletes ra
    JOIN user_rankings ur ON ra.ranking_id = ur.id
    CROSS JOIN recent_cutoff rc
    WHERE ur.category_id = p_category_id
    AND ur.created_at >= rc.recent_date
    GROUP BY ra.athlete_id
  ),
  older_positions AS (
    SELECT 
      ra.athlete_id,
      AVG(ra.position::decimal) as older_avg_pos
    FROM ranking_athletes ra
    JOIN user_rankings ur ON ra.ranking_id = ur.id
    CROSS JOIN older_cutoff oc
    WHERE ur.category_id = p_category_id
    AND ur.created_at BETWEEN oc.older_start AND oc.older_end
    GROUP BY ra.athlete_id
  ),
  ranked_athletes AS (
    SELECT 
      ats.athlete_id,
      a.name as athlete_name,
      a.profile_picture_url,
      a.country_of_origin,
      ats.total_score as total_points,
      ROW_NUMBER() OVER (ORDER BY ats.total_score DESC) as rank,
      CASE 
        WHEN rp.recent_avg_pos IS NULL OR op.older_avg_pos IS NULL THEN 'neutral'
        WHEN op.older_avg_pos - rp.recent_avg_pos > 1 THEN 'up'
        WHEN rp.recent_avg_pos - op.older_avg_pos > 1 THEN 'down'
        ELSE 'neutral'
      END as movement
    FROM athlete_scores ats
    JOIN athletes a ON ats.athlete_id = a.id
    LEFT JOIN recent_positions rp ON ats.athlete_id = rp.athlete_id
    LEFT JOIN older_positions op ON ats.athlete_id = op.athlete_id
    ORDER BY ats.total_score DESC
    LIMIT p_limit
  )
  SELECT * FROM ranked_athletes;
END;
$$;

-- 3. Create homepage leaderboard materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS homepage_leaderboards AS
WITH category_stats AS (
  SELECT 
    c.id,
    c.name,
    c.description,
    c.image_url,
    COUNT(ur.id) as ranking_count,
    CASE 
      WHEN c.name = 'GOAT Footballer' THEN 1
      WHEN c.name IN ('GOAT Attacker', 'GOAT Skills', 'Current GOAT') THEN 2
      ELSE 3
    END as priority
  FROM categories c
  LEFT JOIN user_rankings ur ON c.id = ur.category_id
  WHERE c.parent_id IS NOT NULL
  GROUP BY c.id, c.name, c.description, c.image_url
  HAVING COUNT(ur.id) > 0
),
top_categories AS (
  SELECT *
  FROM category_stats
  ORDER BY ranking_count DESC, priority ASC, name ASC
  LIMIT 6
),
category_leaderboards AS (
  SELECT 
    tc.id as category_id,
    tc.name as category_name,
    tc.description as category_description,
    tc.image_url as category_image_url,
    tc.ranking_count,
    jsonb_agg(
      jsonb_build_object(
        'id', cl.athlete_id,
        'name', cl.athlete_name,
        'profile_picture_url', cl.profile_picture_url,
        'country_of_origin', cl.country_of_origin,
        'points', cl.total_points,
        'rank', cl.rank,
        'movement', cl.movement
      ) ORDER BY cl.rank
    ) as leaderboard
  FROM top_categories tc
  CROSS JOIN LATERAL get_category_leaderboard(
    tc.id, 
    CASE WHEN tc.name = 'GOAT Footballer' THEN 10 ELSE 3 END
  ) cl
  GROUP BY tc.id, tc.name, tc.description, tc.image_url, tc.ranking_count
)
SELECT * FROM category_leaderboards;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_homepage_leaderboards_category_name 
ON homepage_leaderboards(category_name);

-- 4. Function to refresh homepage data
CREATE OR REPLACE FUNCTION refresh_homepage_leaderboards()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW homepage_leaderboards;
END;
$$;

-- 5. Optimize quiz leaderboard function with pagination
CREATE OR REPLACE FUNCTION get_quiz_leaderboard_optimized(
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
  WITH user_quiz_stats AS (
    SELECT
      qa.user_id,
      SUM(qa.score)::BIGINT as total_score,
      COUNT(qa.id)::BIGINT as quizzes_completed
    FROM quiz_attempts qa
    GROUP BY qa.user_id
    HAVING COUNT(qa.id) > 0
  ),
  user_top_badges AS (
    SELECT DISTINCT ON (ub.user_id)
      ub.user_id,
      ub.badge_id,
      CASE ub.badge_id
        WHEN 'goat' THEN 'GOAT'
        WHEN 'legend' THEN 'Legend'
        WHEN 'expert' THEN 'Expert'
        WHEN 'triple_perfect' THEN '3 Perfect Scores'
        WHEN 'perfect_score' THEN 'Perfect Score'
        WHEN 'streak_10' THEN '10-Day Streak'
        WHEN 'streak_3' THEN '3-Day Streak'
        WHEN 'foot_lover' THEN 'Foot Lover'
        WHEN 'first_quiz' THEN 'First Quiz'
        WHEN 'newcomer' THEN 'Newcomer'
        ELSE 'Unknown Badge'
      END as badge_name,
      CASE ub.badge_id
        WHEN 'goat' THEN 'legendary'
        WHEN 'legend' THEN 'epic'
        WHEN 'expert' THEN 'rare'
        WHEN 'triple_perfect' THEN 'rare'
        WHEN 'perfect_score' THEN 'common'
        WHEN 'streak_10' THEN 'rare'
        WHEN 'streak_3' THEN 'common'
        WHEN 'foot_lover' THEN 'common'
        WHEN 'first_quiz' THEN 'common'
        WHEN 'newcomer' THEN 'common'
        ELSE 'common'
      END as badge_rarity,
      CASE ub.badge_id
        WHEN 'goat' THEN 1
        WHEN 'legend' THEN 2
        WHEN 'expert' THEN 3
        WHEN 'triple_perfect' THEN 4
        WHEN 'perfect_score' THEN 5
        WHEN 'streak_10' THEN 6
        WHEN 'streak_3' THEN 7
        WHEN 'foot_lover' THEN 8
        WHEN 'first_quiz' THEN 9
        WHEN 'newcomer' THEN 10
        ELSE 11
      END as badge_priority
    FROM user_badges ub
    ORDER BY ub.user_id, badge_priority ASC
  )
  SELECT
    p.id as user_id,
    p.full_name,
    p.avatar_url,
    uqs.total_score,
    uqs.quizzes_completed,
    utb.badge_id as highest_badge_id,
    utb.badge_name as highest_badge_name,
    utb.badge_rarity as highest_badge_rarity
  FROM user_quiz_stats uqs
  JOIN profiles p ON uqs.user_id = p.id
  LEFT JOIN user_top_badges utb ON uqs.user_id = utb.user_id
  ORDER BY uqs.total_score DESC, uqs.quizzes_completed DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;
