
-- Fix the get_category_leaderboard function to return proper JSON objects
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
      COALESCE(a.profile_picture_url, '/placeholder.svg') as profile_picture_url,
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
  SELECT 
    ra.athlete_id,
    ra.athlete_name,
    ra.profile_picture_url,
    ra.country_of_origin,
    ra.total_points,
    ra.rank,
    ra.movement
  FROM ranked_athletes ra;
END;
$$;
