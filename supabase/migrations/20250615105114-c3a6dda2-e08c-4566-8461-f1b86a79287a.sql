
-- First, delete duplicate rankings, keeping only the most recent one for each user/category pair.
WITH duplicates AS (
  SELECT
    id,
    ROW_NUMBER() OVER(PARTITION BY user_id, category_id ORDER BY created_at DESC) as rn
  FROM
    public.user_rankings
)
DELETE FROM public.user_rankings
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Now, add the unique constraint to prevent future duplicates.
ALTER TABLE public.user_rankings
ADD CONSTRAINT user_rankings_user_id_category_id_key UNIQUE (user_id, category_id);
