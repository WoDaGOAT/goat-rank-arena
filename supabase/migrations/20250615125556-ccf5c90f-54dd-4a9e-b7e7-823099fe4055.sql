
-- This script updates the image_url for specific subcategories of the main 'GOAT' category.
-- It uses dynamic, sports- and gaming-themed image IDs from Unsplash.
-- The CategoryCard component will automatically use these to display the new images.

WITH goat_category AS (
  SELECT id FROM public.categories WHERE name = 'GOAT' AND parent_id IS NULL LIMIT 1
)
UPDATE public.categories
SET image_url = CASE
  WHEN name = 'Football' THEN 'photo-1579952363873-27f3bade9f55'
  WHEN name = 'Basketball' THEN 'photo-1546519638-68e109498ffc'
  WHEN name = 'MMA' THEN 'octagon'
  WHEN name = 'Tennis' THEN 'photo-1554068533-39798b35489f'
  WHEN name = 'American Football' THEN 'photo-1546428664-8f0c7e80e55a'
  WHEN name = 'Formula 1' THEN 'photo-1552674312-38a04b1a8069'
  WHEN name = 'Esports' THEN 'photo-1593305953932-53b64b1cca28'
  WHEN name = 'Boxing' THEN 'photo-1594751543129-97642d918335'
  WHEN name = 'Baseball' THEN 'photo-1551022375-6e449c331904'
  WHEN name = 'Cricket' THEN 'photo-1590212393237-33a499a9f078'
END
WHERE parent_id = (SELECT id FROM goat_category)
AND name IN ('Football', 'Basketball', 'MMA', 'Tennis', 'American Football', 'Formula 1', 'Esports', 'Boxing', 'Baseball', 'Cricket');

