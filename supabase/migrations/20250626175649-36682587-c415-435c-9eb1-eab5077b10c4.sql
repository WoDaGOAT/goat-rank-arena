
-- Drop the existing function first
DROP FUNCTION IF EXISTS public.search_athletes_admin(text, text, boolean, integer, integer);

-- Add career start and end year columns to the athletes table
ALTER TABLE public.athletes 
ADD COLUMN career_start_year INTEGER,
ADD COLUMN career_end_year INTEGER;

-- Recreate the search_athletes_admin function with the new fields
CREATE OR REPLACE FUNCTION public.search_athletes_admin(
  p_search_term TEXT DEFAULT NULL,
  p_country_filter TEXT DEFAULT NULL,
  p_active_filter BOOLEAN DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  id TEXT,
  name TEXT,
  country_of_origin TEXT,
  nationality TEXT,
  year_of_birth INTEGER,
  date_of_death DATE,
  is_active BOOLEAN,
  positions TEXT[],
  profile_picture_url TEXT,
  career_start_year INTEGER,
  career_end_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  total_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  WITH filtered_athletes AS (
    SELECT a.*
    FROM public.athletes a
    WHERE 
      (p_search_term IS NULL OR 
       a.name ILIKE '%' || p_search_term || '%' OR
       a.country_of_origin ILIKE '%' || p_search_term || '%' OR
       a.nationality ILIKE '%' || p_search_term || '%' OR
       EXISTS (SELECT 1 FROM unnest(a.positions) pos WHERE pos ILIKE '%' || p_search_term || '%'))
    AND (p_country_filter IS NULL OR a.country_of_origin = p_country_filter)
    AND (p_active_filter IS NULL OR a.is_active = p_active_filter)
  ),
  total_count_cte AS (
    SELECT COUNT(*) as total_count FROM filtered_athletes
  )
  SELECT 
    a.id,
    a.name,
    a.country_of_origin,
    a.nationality,
    a.year_of_birth,
    a.date_of_death,
    a.is_active,
    a.positions,
    a.profile_picture_url,
    a.career_start_year,
    a.career_end_year,
    a.created_at,
    a.updated_at,
    tc.total_count
  FROM filtered_athletes a
  CROSS JOIN total_count_cte tc
  ORDER BY a.name
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;
