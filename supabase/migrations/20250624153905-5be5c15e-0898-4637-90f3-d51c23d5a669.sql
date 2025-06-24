
-- First, let's identify and remove duplicate accepted friendship feed items
-- Keep only the most recent entry for each unique friendship pair
WITH duplicate_friendships AS (
  SELECT 
    id,
    data,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY 
        LEAST(data->'requester'->>'id', data->'receiver'->>'id'),
        GREATEST(data->'requester'->>'id', data->'receiver'->>'id')
      ORDER BY created_at DESC
    ) as rn
  FROM feed_items 
  WHERE type = 'accepted_friendship'
    AND data->'requester'->>'id' IS NOT NULL
    AND data->'receiver'->>'id' IS NOT NULL
)
DELETE FROM feed_items 
WHERE id IN (
  SELECT id FROM duplicate_friendships WHERE rn > 1
);

-- Add a function to create a unique key for friendship pairs
CREATE OR REPLACE FUNCTION get_friendship_pair_key(requester_id text, receiver_id text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT LEAST(requester_id, receiver_id) || '_' || GREATEST(requester_id, receiver_id);
$$;

-- Update the handle_accepted_friendship_feed_item function to prevent duplicates
CREATE OR REPLACE FUNCTION public.handle_accepted_friendship_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_profile JSONB;
  receiver_profile JSONB;
  friendship_key TEXT;
BEGIN
  IF NEW.status = 'accepted' AND OLD.status <> 'accepted' THEN
    -- Get requester profile with validation
    SELECT jsonb_build_object('id', id, 'full_name', full_name, 'avatar_url', avatar_url)
    INTO requester_profile
    FROM public.profiles 
    WHERE id = NEW.requester_id 
    AND full_name IS NOT NULL 
    AND full_name != '';

    -- Get receiver profile with validation
    SELECT jsonb_build_object('id', id, 'full_name', full_name, 'avatar_url', avatar_url)
    INTO receiver_profile
    FROM public.profiles 
    WHERE id = NEW.receiver_id 
    AND full_name IS NOT NULL 
    AND full_name != '';

    -- Only create feed item if both users have valid profiles
    IF requester_profile IS NOT NULL AND receiver_profile IS NOT NULL THEN
      -- Generate a unique key for this friendship pair
      friendship_key := get_friendship_pair_key(NEW.requester_id::text, NEW.receiver_id::text);
      
      -- Check if a feed item for this friendship pair already exists
      IF NOT EXISTS (
        SELECT 1 FROM public.feed_items 
        WHERE type = 'accepted_friendship'
        AND get_friendship_pair_key(
          data->'requester'->>'id', 
          data->'receiver'->>'id'
        ) = friendship_key
      ) THEN
        INSERT INTO public.feed_items (type, data)
        VALUES (
          'accepted_friendship',
          jsonb_build_object(
            'requester', requester_profile,
            'receiver', receiver_profile,
            'friendship_key', friendship_key
          )
        );
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create an index to improve performance for duplicate checking
CREATE INDEX IF NOT EXISTS idx_feed_items_accepted_friendship_dedup 
ON feed_items USING GIN (data) 
WHERE type = 'accepted_friendship';
