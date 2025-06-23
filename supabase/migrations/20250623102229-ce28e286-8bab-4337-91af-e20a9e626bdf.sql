
-- Add better indexing for athlete search and filtering
CREATE INDEX IF NOT EXISTS idx_athletes_name ON public.athletes(name);
CREATE INDEX IF NOT EXISTS idx_athletes_country_origin ON public.athletes(country_of_origin);
CREATE INDEX IF NOT EXISTS idx_athletes_nationality ON public.athletes(nationality);
CREATE INDEX IF NOT EXISTS idx_athletes_active ON public.athletes(is_active);
CREATE INDEX IF NOT EXISTS idx_athletes_search ON public.athletes USING gin(to_tsvector('english', name || ' ' || COALESCE(country_of_origin, '') || ' ' || COALESCE(nationality, '')));

-- Create function for bulk athlete insertion
CREATE OR REPLACE FUNCTION public.bulk_insert_athletes(p_athletes JSONB)
RETURNS TABLE(
  inserted_count INTEGER,
  skipped_count INTEGER,
  errors TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  athlete JSONB;
  inserted_count INTEGER := 0;
  skipped_count INTEGER := 0;
  errors TEXT[] := '{}';
  error_msg TEXT;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Process each athlete
  FOR athlete IN SELECT * FROM jsonb_array_elements(p_athletes)
  LOOP
    BEGIN
      -- Check for duplicate (by name and country)
      IF EXISTS (
        SELECT 1 FROM public.athletes 
        WHERE name = athlete->>'name' 
        AND COALESCE(country_of_origin, '') = COALESCE(athlete->>'country_of_origin', '')
      ) THEN
        skipped_count := skipped_count + 1;
        CONTINUE;
      END IF;

      -- Insert new athlete
      INSERT INTO public.athletes (
        id,
        name,
        country_of_origin,
        nationality,
        date_of_birth,
        date_of_death,
        is_active,
        positions,
        profile_picture_url
      ) VALUES (
        COALESCE(athlete->>'id', gen_random_uuid()::text),
        athlete->>'name',
        athlete->>'country_of_origin',
        athlete->>'nationality',
        CASE 
          WHEN athlete->>'date_of_birth' IS NOT NULL AND athlete->>'date_of_birth' != '' 
          THEN (athlete->>'date_of_birth')::date 
          ELSE NULL 
        END,
        CASE 
          WHEN athlete->>'date_of_death' IS NOT NULL AND athlete->>'date_of_death' != '' 
          THEN (athlete->>'date_of_death')::date 
          ELSE NULL 
        END,
        COALESCE((athlete->>'is_active')::boolean, true),
        CASE 
          WHEN athlete->'positions' IS NOT NULL 
          THEN (SELECT array_agg(value::text) FROM jsonb_array_elements_text(athlete->'positions'))
          ELSE NULL 
        END,
        athlete->>'profile_picture_url'
      );
      
      inserted_count := inserted_count + 1;
      
    EXCEPTION
      WHEN OTHERS THEN
        error_msg := format('Error inserting athlete %s: %s', athlete->>'name', SQLERRM);
        errors := array_append(errors, error_msg);
    END;
  END LOOP;

  RETURN QUERY SELECT inserted_count, skipped_count, errors;
END;
$$;

-- Create function to get athlete management stats
CREATE OR REPLACE FUNCTION public.get_athlete_stats()
RETURNS TABLE(
  total_athletes BIGINT,
  active_athletes BIGINT,
  inactive_athletes BIGINT,
  countries_count BIGINT,
  positions_count BIGINT
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
  SELECT 
    COUNT(*) as total_athletes,
    COUNT(*) FILTER (WHERE is_active = true) as active_athletes,
    COUNT(*) FILTER (WHERE is_active = false) as inactive_athletes,
    COUNT(DISTINCT country_of_origin) FILTER (WHERE country_of_origin IS NOT NULL) as countries_count,
    COUNT(DISTINCT unnest(positions)) FILTER (WHERE positions IS NOT NULL) as positions_count
  FROM public.athletes;
END;
$$;

-- Create function for admin athlete search with pagination
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
  date_of_birth DATE,
  date_of_death DATE,
  is_active BOOLEAN,
  positions TEXT[],
  profile_picture_url TEXT,
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
    a.date_of_birth,
    a.date_of_death,
    a.is_active,
    a.positions,
    a.profile_picture_url,
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
