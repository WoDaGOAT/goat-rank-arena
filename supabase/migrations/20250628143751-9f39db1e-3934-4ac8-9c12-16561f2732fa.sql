
-- Step 1: Create the missing trigger for new rankings feed items
CREATE TRIGGER on_new_ranking_for_feed
AFTER INSERT ON public.user_rankings
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_ranking_feed_item();

-- Step 2: Backfill recent rankings that were missed (last 7 days)
-- This will create feed items for rankings created recently that don't have feed items yet
DO $$
DECLARE
  ranking_record RECORD;
  author_profile JSONB;
  category_info JSONB;
  ranking_athletes JSONB;
BEGIN
  -- Loop through recent rankings that don't have corresponding feed items
  FOR ranking_record IN 
    SELECT ur.* 
    FROM user_rankings ur
    WHERE ur.created_at >= CURRENT_DATE - INTERVAL '7 days'
    AND NOT EXISTS (
      SELECT 1 FROM feed_items fi 
      WHERE fi.type = 'new_ranking' 
      AND fi.data->>'ranking_id' = ur.id::text
    )
  LOOP
    -- Get author profile
    SELECT jsonb_build_object('id', p.id, 'full_name', p.full_name, 'avatar_url', p.avatar_url)
    INTO author_profile
    FROM public.profiles p
    WHERE p.id = ranking_record.user_id
    AND p.full_name IS NOT NULL 
    AND p.full_name != '';

    -- Get category info
    SELECT jsonb_build_object('id', c.id, 'name', c.name)
    INTO category_info
    FROM public.categories c
    WHERE c.id = ranking_record.category_id;

    -- Get top 5 athletes from the ranking
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', ra.athlete_id,
        'name', a.name,
        'position', ra.position,
        'imageUrl', a.profile_picture_url
      ) ORDER BY ra.position
    )
    INTO ranking_athletes
    FROM ranking_athletes ra
    JOIN athletes a ON ra.athlete_id = a.id
    WHERE ra.ranking_id = ranking_record.id
    LIMIT 5;

    -- Only create feed item if we have valid data
    IF author_profile IS NOT NULL AND category_info IS NOT NULL THEN
      INSERT INTO public.feed_items (type, data, created_at)
      VALUES (
        'new_ranking',
        jsonb_build_object(
          'user', author_profile,
          'category', category_info,
          'ranking_title', ranking_record.title,
          'ranking_id', ranking_record.id,
          'top_athletes', COALESCE(ranking_athletes, '[]'::jsonb)
        ),
        ranking_record.created_at
      );
    END IF;
  END LOOP;

  -- Log how many items were backfilled
  RAISE NOTICE 'Backfilled % recent ranking feed items', 
    (SELECT COUNT(*) FROM user_rankings ur
     WHERE ur.created_at >= CURRENT_DATE - INTERVAL '7 days'
     AND NOT EXISTS (
       SELECT 1 FROM feed_items fi 
       WHERE fi.type = 'new_ranking' 
       AND fi.data->>'ranking_id' = ur.id::text
     ));
END $$;
