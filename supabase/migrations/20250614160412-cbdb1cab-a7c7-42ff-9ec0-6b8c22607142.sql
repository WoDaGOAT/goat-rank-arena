
-- Add image_url column to categories table if it doesn't already exist
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Set a default placeholder image for any categories that don't have one
UPDATE public.categories SET image_url = '/placeholder.svg' WHERE image_url IS NULL;
