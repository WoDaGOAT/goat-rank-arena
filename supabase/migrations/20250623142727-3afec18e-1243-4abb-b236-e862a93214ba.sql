
-- Update the bulk_insert_athletes function to better handle positions data
CREATE OR REPLACE FUNCTION public.bulk_insert_athletes(p_athletes jsonb, p_update_mode boolean DEFAULT false)
 RETURNS TABLE(inserted_count integer, updated_count integer, skipped_count integer, errors text[])
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  athlete JSONB;
  inserted_count INTEGER := 0;
  updated_count INTEGER := 0;
  skipped_count INTEGER := 0;
  errors TEXT[] := '{}';
  error_msg TEXT;
  existing_athlete_id TEXT;
  positions_array TEXT[];
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Process each athlete
  FOR athlete IN SELECT * FROM jsonb_array_elements(p_athletes)
  LOOP
    BEGIN
      -- Check for existing athlete by name (primary matching criterion)
      SELECT id INTO existing_athlete_id
      FROM public.athletes 
      WHERE name = athlete->>'name'
      LIMIT 1;

      -- Handle positions field safely
      positions_array := NULL;
      IF athlete->'positions' IS NOT NULL AND jsonb_typeof(athlete->'positions') = 'array' THEN
        SELECT array_agg(value::text) INTO positions_array
        FROM jsonb_array_elements_text(athlete->'positions');
      ELSIF athlete->>'positions' IS NOT NULL AND athlete->>'positions' != '' THEN
        -- Handle case where positions is a single string
        positions_array := ARRAY[athlete->>'positions'];
      END IF;

      IF existing_athlete_id IS NOT NULL THEN
        -- Athlete exists
        IF p_update_mode THEN
          -- Update existing athlete with new non-null data
          UPDATE public.athletes SET
            country_of_origin = COALESCE(NULLIF(athlete->>'country_of_origin', ''), country_of_origin),
            nationality = COALESCE(NULLIF(athlete->>'nationality', ''), nationality),
            date_of_birth = CASE 
              WHEN athlete->>'date_of_birth' IS NOT NULL AND athlete->>'date_of_birth' != '' 
              THEN (athlete->>'date_of_birth')::date 
              ELSE date_of_birth 
            END,
            date_of_death = CASE 
              WHEN athlete->>'date_of_death' IS NOT NULL AND athlete->>'date_of_death' != '' 
              THEN (athlete->>'date_of_death')::date 
              ELSE date_of_death 
            END,
            is_active = COALESCE((athlete->>'is_active')::boolean, is_active),
            positions = COALESCE(positions_array, positions),
            profile_picture_url = COALESCE(NULLIF(athlete->>'profile_picture_url', ''), profile_picture_url),
            updated_at = now()
          WHERE id = existing_athlete_id;
          
          updated_count := updated_count + 1;
        ELSE
          -- Skip in insert-only mode
          skipped_count := skipped_count + 1;
        END IF;
      ELSE
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
          NULLIF(athlete->>'country_of_origin', ''),
          NULLIF(athlete->>'nationality', ''),
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
          positions_array,
          NULLIF(athlete->>'profile_picture_url', '')
        );
        
        inserted_count := inserted_count + 1;
      END IF;
      
    EXCEPTION
      WHEN OTHERS THEN
        error_msg := format('Error processing athlete %s: %s', athlete->>'name', SQLERRM);
        errors := array_append(errors, error_msg);
    END;
  END LOOP;

  RETURN QUERY SELECT inserted_count, updated_count, skipped_count, errors;
END;
$function$
